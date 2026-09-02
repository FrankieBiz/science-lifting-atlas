export type ResourceAttribute = 'href' | 'src' | 'srcset';

export interface ResourceReference {
  attribute: ResourceAttribute;
  raw: string;
  url: URL;
}

const NAVIGATION_ELEMENTS = new Set(['a', 'area']);
const SUPPORTED_PROTOCOLS = new Set(['http:', 'https:']);

/**
 * Collect resources from the attributes emitted into the current static HTML.
 * Navigation links are intentionally excluded because their route semantics are
 * checked separately from byte-bearing resources.
 */
export function collectSameOriginResourceReferences(
  html: string,
  pageUrl: string,
): ResourceReference[] {
  const page = new URL(pageUrl);
  const references: ResourceReference[] = [];
  const htmlWithoutComments = html.replaceAll(/<!--[^]*?-->/gu, '');
  const tags = htmlWithoutComments.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/giu);

  for (const tag of tags) {
    const tagName = tag[1]?.toLowerCase();
    const attributes = tag[2];
    if (!tagName || attributes === undefined) continue;

    for (const attribute of attributes.matchAll(
      /(?:^|\s)(href|src|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/giu,
    )) {
      const attributeName = attribute[1]?.toLowerCase() as
        ResourceAttribute | undefined;
      const value = attribute[2] ?? attribute[3];
      if (!attributeName || value === undefined) continue;
      if (attributeName === 'href' && NAVIGATION_ELEMENTS.has(tagName)) {
        continue;
      }

      const candidates =
        attributeName === 'srcset' ? parseSrcset(value) : [value];
      for (const raw of candidates) {
        if (!raw || raw.startsWith('#')) continue;

        let url;
        try {
          url = new URL(raw, page);
        } catch {
          continue;
        }

        if (
          !SUPPORTED_PROTOCOLS.has(url.protocol) ||
          url.origin !== page.origin
        ) {
          continue;
        }

        references.push({ attribute: attributeName, raw, url });
      }
    }
  }

  return references;
}

export function isPathInsideMount(pathname: string, mount: string): boolean {
  const prefix = mount.endsWith('/') ? mount : `${mount}/`;
  return pathname === prefix.slice(0, -1) || pathname.startsWith(prefix);
}

function parseSrcset(value: string): string[] {
  // Data URLs contain a comma and are an explicitly unsupported scheme for
  // this same-origin fetch check. Excluding the whole value avoids treating the
  // data payload as a relative URL.
  if (value.trimStart().startsWith('data:')) return [];

  return value
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/u, 1)[0] ?? '')
    .filter(Boolean);
}
