import { parse, type DefaultTreeAdapterTypes } from 'parse5';

export type ResourceAttribute =
  'content' | 'data' | 'href' | 'imagesrcset' | 'poster' | 'src' | 'srcset';

interface SameOriginReference<TAttribute extends string> {
  attribute: TAttribute;
  raw: string;
  url: URL;
}

export type ResourceReference = SameOriginReference<ResourceAttribute>;
export type NavigationReference = SameOriginReference<'href'>;

const SUPPORTED_PROTOCOLS = new Set(['http:', 'https:']);
const RESOURCE_ATTRIBUTES_BY_ELEMENT = new Map<
  string,
  ReadonlySet<ResourceAttribute>
>([
  ['audio', new Set(['src'])],
  ['embed', new Set(['src'])],
  ['iframe', new Set(['src'])],
  ['image', new Set(['href'])],
  ['img', new Set(['src', 'srcset'])],
  ['input', new Set(['src'])],
  ['link', new Set(['href', 'imagesrcset'])],
  ['meta', new Set(['content'])],
  ['object', new Set(['data'])],
  ['script', new Set(['src'])],
  ['source', new Set(['src', 'srcset'])],
  ['track', new Set(['src'])],
  ['use', new Set(['href'])],
  ['video', new Set(['poster', 'src'])],
]);
const RESOURCE_META_KEYS = new Set([
  'image',
  'msapplication-tileimage',
  'og:image',
  'og:image:secure_url',
  'og:image:url',
  'twitter:image',
  'twitter:image:src',
]);

/**
 * Collect same-origin resources from explicitly supported, byte-bearing HTML
 * attributes. parse5 supplies a standards-aware tokenizer so valid quoted or
 * unquoted values cannot change which later attributes are visible.
 */
export function collectSameOriginResourceReferences(
  html: string,
  pageUrl: string,
): ResourceReference[] {
  const page = new URL(pageUrl);
  const references: ResourceReference[] = [];

  walkElements(parse(html, { scriptingEnabled: false }), (element) => {
    const tagName = element.tagName.toLowerCase();
    const supportedAttributes = RESOURCE_ATTRIBUTES_BY_ELEMENT.get(tagName);
    if (!supportedAttributes) return;

    const attributes = new Map(
      element.attrs.map(({ name, value }) => [name.toLowerCase(), value]),
    );
    if (tagName === 'meta' && !isResourceMetadata(attributes)) return;

    for (const { name, value } of element.attrs) {
      const attribute = name.toLowerCase() as ResourceAttribute;
      if (!supportedAttributes.has(attribute)) continue;

      const candidates =
        attribute === 'srcset' || attribute === 'imagesrcset'
          ? parseSrcset(value)
          : [value];
      appendSameOriginReferences(references, candidates, attribute, page);
    }
  });

  return references;
}

/** Collect same-origin destinations from standard anchors and image maps. */
export function collectSameOriginNavigationReferences(
  html: string,
  pageUrl: string,
): NavigationReference[] {
  const page = new URL(pageUrl);
  const references: NavigationReference[] = [];

  walkElements(parse(html, { scriptingEnabled: false }), (element) => {
    if (element.tagName !== 'a' && element.tagName !== 'area') return;
    const href = element.attrs.find(({ name }) => name === 'href')?.value;
    if (href === undefined) return;
    appendSameOriginReferences(references, [href], 'href', page);
  });

  return references;
}

export function isPathInsideMount(pathname: string, mount: string): boolean {
  const prefix = mount.endsWith('/') ? mount : `${mount}/`;
  return pathname === prefix.slice(0, -1) || pathname.startsWith(prefix);
}

function appendSameOriginReferences<TAttribute extends string>(
  references: SameOriginReference<TAttribute>[],
  candidates: string[],
  attribute: TAttribute,
  page: URL,
): void {
  for (const raw of candidates) {
    if (!raw || raw.startsWith('#')) continue;

    let url;
    try {
      url = new URL(raw, page);
    } catch {
      continue;
    }

    if (!SUPPORTED_PROTOCOLS.has(url.protocol) || url.origin !== page.origin) {
      continue;
    }

    references.push({ attribute, raw, url });
  }
}

function isResourceMetadata(attributes: ReadonlyMap<string, string>): boolean {
  return ['property', 'name', 'itemprop'].some((attribute) =>
    RESOURCE_META_KEYS.has(
      attributes.get(attribute)?.trim().toLowerCase() ?? '',
    ),
  );
}

function walkElements(
  node: DefaultTreeAdapterTypes.Node,
  visit: (element: DefaultTreeAdapterTypes.Element) => void,
): void {
  if (isElement(node)) visit(node);
  if ('childNodes' in node) {
    for (const child of node.childNodes) walkElements(child, visit);
  }
}

function isElement(
  node: DefaultTreeAdapterTypes.Node,
): node is DefaultTreeAdapterTypes.Element | DefaultTreeAdapterTypes.Template {
  return 'tagName' in node;
}

function parseSrcset(value: string): string[] {
  const urls: string[] = [];
  let index = 0;

  while (index < value.length) {
    while (index < value.length && /[\s,]/u.test(value[index] ?? '')) index++;
    if (index >= value.length) break;

    const start = index;
    while (index < value.length && !/\s/u.test(value[index] ?? '')) index++;
    const token = value.slice(start, index);
    const url = token.replace(/,+$/u, '');
    if (url) urls.push(url);

    if (token.length === url.length) {
      while (index < value.length && value[index] !== ',') index++;
    }
  }

  return urls;
}
