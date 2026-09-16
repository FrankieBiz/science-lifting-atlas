# SBLA-011 owner authorization for a criterion-13 remediation and recheck

- Date: 2026-09-16
- Decision: authorize one second, narrowly bounded remediation and one focused
  independent recheck of criterion 13
- Failed recheck: [`SBLA-011-r2.md`](SBLA-011-r2.md)
- Reviewed candidate: `ebb1e41bc115e281255c72b3b7242ebc8096cc4d`
- R2 report commit: `462c4fb55c14e5618bac936f2e5a30abb487e887`
- Remaining blocker: `I5-R2`

## Owner direction

After asking for a progress estimate, the owner explicitly directed Codex to
continue the project and to use both connected Claude Code accounts in the most
efficient manner possible. R2 subsequently closed six of seven original
blockers but returned FAIL for one Important certainty-lint defect. Codex
disclosed that the normal single-remediation/recheck budget was spent and
interpreted the owner's current direction to continue building, together with
the owner's stated preference for a strong result, as authorization for option
1 in R2 section 9.2: repair the remaining defect rather than accept or defer it.

## Authorized scope

The authorization is limited to:

1. make certainty-language exceptions apply to the matched universal or causal
   token rather than the whole punctuation clause;
2. delete exception branches that no promoted claim needs when doing so reduces
   the attack surface;
3. add regression fixtures for R2's joined-clause attacks and their sentence and
   semicolon controls; and
4. have independent Claude Review account B recheck criterion 13 and the
   promoted-claim positive controls.

No promoted claim, source, page record, research artifact, approval decision,
or graph data may change. R2's five new Minor findings and the remaining R1
Minor findings stay out of scope. This record does not convert R2 to PASS and
does not establish a general additional-review entitlement.

## Role separation

Claude Code account A may advise read-only on patch design. Codex owns the
implementation. Claude Code account B, which did not author or advise on the
patch, retains independent verdict authority for the focused recheck.
