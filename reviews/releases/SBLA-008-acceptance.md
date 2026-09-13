# SBLA-008 owner acceptance

- Date: 2026-09-13
- Decision: Accepted
- Accepted base: `0752d5021da72eed840f61ae06f6c1966906c177`
- Final reviewed candidate: `d1a77071e0a794c537c24e4b30bfcf3b1016063e`
- Independent acceptance review: [`SBLA-008-r3.md`](../evidence/SBLA-008-r3.md)
- R3 verdict: PASS — 0 Critical, 0 Important, 2 new nonblocking Minor

## Owner direction

The owner instructed Codex to continue building the main project, gave Claude
Research account A a strong implementation role, and asked Codex and both Claude
accounts to keep useful work moving forward. That direction authorizes Codex to
record acceptance after the independent gate passes. It does not waive evidence,
provenance, reproducibility, licensing, accessibility, or validation requirements.

## Acceptance basis

SBLA-008 now has a complete scope-stage vertical slice: two research questions,
PICO/PECO boundaries where applicable, reproducible exercise definitions, an
outcome hierarchy, database-specific search strategies, operational eligibility
and screening rules, contradiction-search requirements, and a standalone handoff.
It makes no scientific conclusion and does not treat model memory as evidence.

The immutable review history is preserved:

| Round | Candidate                                  | Report                                                                                                                      | Verdict                                         | Result                                                                                              |
| ----- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| R1    | `56068c222bd8971378586776d133a7cf7a470b96` | `5d519595c7f6ed2b6e1b2ba23458a560adb372cb`, formatted without semantic change at `eefefd20ebdf61efe65489f30b60db09c33aa124` | FAIL — 0 Critical, 2 Important, 5 Minor         | One bounded Account-A remediation followed                                                          |
| R2    | `383b63244aabb19404046dbd4a5aeb1589175346` | `bf7e5bb70f4f3948597bd90b84f76d9515d55f87`                                                                                  | FAIL — 0 Critical, 2 Important, 5 Minor         | All R1 findings were closed; I-3 and I-4 received a second owner-directed documentation remediation |
| R3    | `d1a77071e0a794c537c24e4b30bfcf3b1016063e` | `06caab0acf62db347d55db79b75a22d1dd2edf74`                                                                                  | **PASS — 0 Critical, 0 Important, 2 new Minor** | I-3 and I-4 independently verified closed; all R1 findings remain closed                            |

Account B independently reproduced the long PubMed S2 transport behavior: GET
returns HTTP 414 while the documented form-encoded POST returns HTTP 200 and
preserves `querytranslation`, using only the zero-yield nonsense anchor. It also
verified the handoff's candidate lineage, claim, per-round file inventory,
identities, and all fourteen acceptance criteria. The trusted exact-path checker
passes for the sole R3 report file.

Codex independently ran `pnpm verify` on the final reviewed tree. It passes 234
unit tests, 17 portability tests, formatting, lint, type checking, content and
graph validation, evidence status, the static build, foundation verification,
and both asset gates. The R3 report is Prettier-clean and its committed range has
no whitespace errors.

## Integration record

The accepted branch preserves the forked review history without pretending it
was linear:

- Fast-forwarded accepted `main` through the R1 candidate, R1 report, validator
  repair, and first remediation at `383b63244aabb19404046dbd4a5aeb1589175346`.
- Replayed the immutable R2 report as `e48c7d2`.
- Replayed the second Account-A remediation as `c14a4d6`.
- Replayed the immutable R3 PASS report as `e8ab58e`.

The original role commits and branches remain preserved. No report was rewritten
to manufacture a PASS.

## Deferred nonblocking findings

These do not block SBLA-008 acceptance, but their impact and destination remain
explicit:

| Finding | Impact                                                                                                                   | Destination                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| R2 M-6  | Round-one provenance remains in the question and eligibility headers; current lineage is explicit elsewhere.             | Correct when SBLA-009 next owns those files.                         |
| R2 M-7  | Europe PMC E1 lacks four S2 MeSH descriptors whose Europe PMC handling was not verified.                                 | Test and resolve during SBLA-009 when Europe PMC is reachable.       |
| R2 M-8  | The handoff's historical round-one anchor record differs from the current syntax-only anchor.                            | Preserve history; make SBLA-009's new search receipts authoritative. |
| R2 M-9  | One early reconciliation formula omits `awaiting-full-text`, while the governing four-state mapping is correct.          | Correct before screening starts in SBLA-009.                         |
| R2 M-10 | A Cochrane access sentence is broader than the client-specific evidence.                                                 | Narrow on the next owned edit with a fresh access check.             |
| R3 M-11 | Two handoff summaries say 33 declared items although the complete enumeration contains 31. No item is missing.           | Correct the total or remove it on the next handoff edit.             |
| R3 M-12 | A handoff summary lists six of eight 2026-09-12 verification locations; each omitted observation remains dated in place. | Point to SU6 or list all eight on the next handoff edit.             |

The R3 report also routes two data-model hardening observations to Codex: tighten
the evidence-review Markdown filename exemption if desired, and decide whether a
structured review record must accompany each Markdown report.

## Gate before SBLA-009 execution

Acceptance of the scope does not authorize immediate evidence retrieval without
resolving the decisions the scope deliberately exposes. Before SBLA-009 searches
or records evidence, Codex must record the owner-delegated choices for U2/EU2,
SE-U1, and SE-U2/SU8; before screening it must resolve U3/EU1, U5/EU4, and M-9;
before extraction it must resolve A2 and U4/EU3. SBLA-009 starts from the accepted
`main` tip and carries every executed search receipt, including the disclosed
Europe PMC E1 count of 334.
