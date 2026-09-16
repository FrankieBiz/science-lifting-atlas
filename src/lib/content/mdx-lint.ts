import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export type MdxClaimLintIssue = {
  code:
    | 'MDX_RAW_HTML'
    | 'MDX_UNCITED_FACTUAL_PROSE'
    | 'MDX_COMPONENT_UNSUPPORTED'
    | 'MDX_CLAIM_ID_MISSING'
    | 'MDX_CLAIM_GROUP_IDS_MISSING'
    | 'MDX_PREVIEW_FORBIDDEN'
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

function hasNamedAttribute(node: AstNode, name: string) {
  return (node.attributes ?? []).some(
    (attribute) =>
      attribute.type === 'mdxJsxAttribute' && attribute.name === name,
  );
}

function isRawJsx(node: AstNode) {
  return (
    (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
    /^[a-z]/.test(node.name ?? '')
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

  function addRawHtmlIssue(node: AstNode) {
    issues.push({
      code: 'MDX_RAW_HTML',
      line: lineOf(node),
      message: 'Raw HTML is prohibited in public content.',
    });
  }

  function addModuleIssue(node: AstNode) {
    issues.push({
      code: 'MDX_MODULE_SYNTAX_UNSUPPORTED',
      line: lineOf(node),
      message:
        'Public content cannot execute imports, exports, or free expressions.',
    });
  }

  function validateAllowedComponent(node: AstNode) {
    if (hasNamedAttribute(node, 'preview')) {
      issues.push({
        code: 'MDX_PREVIEW_FORBIDDEN',
        line: lineOf(node),
        message:
          'Public claim components cannot bypass publication eligibility.',
      });
    }
    if (node.name === 'Claim' && !hasAttribute(node, 'id')) {
      issues.push({
        code: 'MDX_CLAIM_ID_MISSING',
        line: lineOf(node),
        message: 'Claim components require an immutable id attribute.',
      });
    }
    if (node.name === 'ClaimGroup' && !hasAttribute(node, 'ids')) {
      issues.push({
        code: 'MDX_CLAIM_GROUP_IDS_MISSING',
        line: lineOf(node),
        message: 'ClaimGroup components require an ids attribute.',
      });
    }
  }

  function scanSafetyDescendants(node: AstNode) {
    for (const child of node.children ?? []) {
      if (child.type === 'html' || isRawJsx(child)) {
        addRawHtmlIssue(child);
      } else if (
        child.type === 'mdxjsEsm' ||
        child.type === 'mdxFlowExpression' ||
        child.type === 'mdxTextExpression'
      ) {
        addModuleIssue(child);
      } else if (
        child.type === 'mdxJsxFlowElement' ||
        child.type === 'mdxJsxTextElement'
      ) {
        if (
          child.name === 'Editorial' ||
          child.name === 'Claim' ||
          child.name === 'ClaimGroup'
        ) {
          validateAllowedComponent(child);
        } else {
          issues.push({
            code: 'MDX_COMPONENT_UNSUPPORTED',
            line: lineOf(child),
            message: `Component ${child.name ?? '(fragment)'} is not allowed in public content.`,
          });
        }
      }
      scanSafetyDescendants(child);
    }
  }

  for (const node of tree.children ?? []) {
    if (isPresentationNode(node)) continue;

    const inlineComponent = singleInlineComponent(node);
    if (inlineComponent) {
      if (inlineComponent.name === 'Editorial') {
        scanSafetyDescendants(inlineComponent);
        continue;
      }
      const rawHtml = isRawJsx(inlineComponent);
      issues.push({
        code: rawHtml ? 'MDX_RAW_HTML' : 'MDX_COMPONENT_UNSUPPORTED',
        line: lineOf(inlineComponent),
        message: rawHtml
          ? 'Raw HTML is prohibited in public content.'
          : `Component ${inlineComponent.name ?? '(fragment)'} is not allowed in public content.`,
      });
      continue;
    }

    if (
      node.type === 'mdxjsEsm' ||
      node.type === 'mdxFlowExpression' ||
      node.type === 'mdxTextExpression'
    ) {
      addModuleIssue(node);
      continue;
    }

    if (node.type === 'mdxJsxFlowElement') {
      if (node.name === 'Editorial') {
        scanSafetyDescendants(node);
        continue;
      }
      if (node.name === 'Claim') {
        validateAllowedComponent(node);
        scanSafetyDescendants(node);
        continue;
      }
      if (node.name === 'ClaimGroup') {
        validateAllowedComponent(node);
        scanSafetyDescendants(node);
        continue;
      }
      if (isRawJsx(node)) {
        addRawHtmlIssue(node);
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
