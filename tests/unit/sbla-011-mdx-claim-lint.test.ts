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

  it('rejects publication preview attributes', () => {
    const issues = lintMdxClaims(`<Claim id="claim-a" preview />

<ClaimGroup ids={['claim-a']} preview />
`);

    expect(issues.map((issue) => issue.code)).toEqual([
      'MDX_PREVIEW_FORBIDDEN',
      'MDX_PREVIEW_FORBIDDEN',
    ]);
  });

  it('recursively rejects unsafe syntax inside allowed containers', () => {
    const issues = lintMdxClaims(`<Editorial>
  <div>raw</div>
  {globalThis.process.env.SECRET}
  <Callout>unsupported</Callout>
</Editorial>

<Claim id="claim-a"><span>discarded</span></Claim>

<ClaimGroup ids={['claim-a']}><Widget /></ClaimGroup>
`);

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'MDX_RAW_HTML',
        'MDX_MODULE_SYNTAX_UNSUPPORTED',
        'MDX_COMPONENT_UNSUPPORTED',
      ]),
    );
  });
});
