import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export type MdxClaimLintIssue = {
  code:
    | 'MDX_RAW_HTML'
    | 'MDX_UNCITED_FACTUAL_PROSE'
    | 'MDX_COMPONENT_UNSUPPORTED'
    | 'MDX_CLAIM_ID_MISSING'
    | 'MDX_CLAIM_GROUP_IDS_MISSING'
    | 'MDX_MODULE_SYNTAX_UNSUPPORTED';
  line: number;
  message: string;
};

type AstNode = {
  type: string;
  name?: string | null;
  attributes?: Array<{ type: string; name?: string; value?: unknown }>;
  children?: AstNode[];
  position?: { start?: { line?: number } };
};

function lineOf(node: AstNode) {
  return node.position?.start?.line ?? 1;
}

function hasAttribute(node: AstNode, name: string) {
  return (node.attributes ?? []).some(
    (attribute) =>
      attribute.type === 'mdxJsxAttribute' &&
      attribute.name === name &&
      attribute.value !== null &&
      attribute.value !== undefined,
  );
}

function isPresentationNode(node: AstNode) {
  return (
    node.type === 'heading' ||
    node.type === 'thematicBreak' ||
    node.type === 'yaml' ||
    node.type === 'toml'
  );
}

function singleInlineComponent(node: AstNode) {
  if (node.type !== 'paragraph' || node.children?.length !== 1) return null;
  const child = node.children[0];
  return child?.type === 'mdxJsxTextElement' ? child : null;
}

export function lintMdxClaims(source: string): MdxClaimLintIssue[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(source) as AstNode;
  const issues: MdxClaimLintIssue[] = [];

  visit(tree as never, 'html', (node: AstNode) => {
    issues.push({
      code: 'MDX_RAW_HTML',
      line: lineOf(node),
      message: 'Raw HTML is prohibited in public content.',
    });
  });

  for (const node of tree.children ?? []) {
    if (isPresentationNode(node)) continue;

    const inlineComponent = singleInlineComponent(node);
    if (inlineComponent) {
      if (inlineComponent.name === 'Editorial') continue;
      const rawHtml = /^[a-z]/.test(inlineComponent.name ?? '');
      issues.push({
        code: rawHtml ? 'MDX_RAW_HTML' : 'MDX_COMPONENT_UNSUPPORTED',
        line: lineOf(inlineComponent),
        message: rawHtml
          ? 'Raw HTML is prohibited in public content.'
          : `Component ${inlineComponent.name ?? '(fragment)'} is not allowed in public content.`,
      });
      continue;
    }

    if (node.type === 'mdxjsEsm' || node.type === 'mdxFlowExpression') {
      issues.push({
        code: 'MDX_MODULE_SYNTAX_UNSUPPORTED',
        line: lineOf(node),
        message:
          'Public content cannot execute imports, exports, or free expressions.',
      });
      continue;
    }

    if (node.type === 'mdxJsxFlowElement') {
      if (node.name === 'Editorial') continue;
      if (node.name === 'Claim') {
        if (!hasAttribute(node, 'id')) {
          issues.push({
            code: 'MDX_CLAIM_ID_MISSING',
            line: lineOf(node),
            message: 'Claim components require an immutable id attribute.',
          });
        }
        continue;
      }
      if (node.name === 'ClaimGroup') {
        if (!hasAttribute(node, 'ids')) {
          issues.push({
            code: 'MDX_CLAIM_GROUP_IDS_MISSING',
            line: lineOf(node),
            message: 'ClaimGroup components require an ids attribute.',
          });
        }
        continue;
      }
      issues.push({
        code: 'MDX_COMPONENT_UNSUPPORTED',
        line: lineOf(node),
        message: `Component ${node.name ?? '(fragment)'} is not allowed in public content.`,
      });
      continue;
    }

    issues.push({
      code: 'MDX_UNCITED_FACTUAL_PROSE',
      line: lineOf(node),
      message:
        'Text-bearing public blocks must be an approved Claim, ClaimGroup, or explicit Editorial component.',
    });
  }

  return issues;
}
