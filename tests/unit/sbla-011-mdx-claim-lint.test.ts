import { describe, expect, it } from 'vitest';

import { lintMdxClaims } from '../../src/lib/content/mdx-lint';

describe('SBLA-011 MDX claim lint', () => {
  it('accepts presentation headings and typed claim components', () => {
    const issues = lintMdxClaims(`# Training response

<Claim id="claim-training-response" />

<ClaimGroup ids={['claim-a', 'claim-b']} framing="claim-a" />

<Editorial>Choose a topic to continue.</Editorial>
`);

    expect(issues).toEqual([]);
  });

  it('rejects uncited prose, raw HTML, and unconstrained components', () => {
    const issues = lintMdxClaims(`# Exercise

This sentence makes a factual assertion without a claim record.

<div>raw</div>

<Widget />
`);

    expect(issues.map((issue) => issue.code)).toEqual([
      'MDX_UNCITED_FACTUAL_PROSE',
      'MDX_RAW_HTML',
      'MDX_COMPONENT_UNSUPPORTED',
    ]);
  });

  it('requires identifiers on claim components', () => {
    const issues = lintMdxClaims(`<Claim />

<ClaimGroup />
`);

    expect(issues.map((issue) => issue.code)).toEqual([
      'MDX_CLAIM_ID_MISSING',
      'MDX_CLAIM_GROUP_IDS_MISSING',
    ]);
  });
});
