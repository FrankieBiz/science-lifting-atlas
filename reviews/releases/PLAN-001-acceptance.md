# PLAN-001 owner acceptance

- Date: 2026-09-05
- Decision: Accepted
- Accepted candidate: `95ba9cc27e627cb42b60d4f9ef0b07e9a700f733`
- Independent review: [`PLAN-001-r2.md`](PLAN-001-r2.md)
- Decision record: [`ADR 0006`](../../docs/adr/0006-execution-quality-and-validation-gates.md)

## Owner direction

The owner repeatedly authorized Codex to continue the project, approved the
direction, and instructed Codex to make necessary edits and keep working. That
direction authorizes acceptance once the required independent gate passes; it
does not waive any scientific, licensing, accessibility, performance, or
resilience requirement.

## Acceptance basis

Account-B Claude Review performed the single complete-artifact recheck required
after the bounded remediation. The review exercised 60 drift probes and returned
PASS with zero Critical and zero Important findings. Round 1's Important finding
and all eight Round 1 Minor findings are closed. The trusted exact-path boundary
passed for the review report.

ADR 0006 is therefore accepted. The project will use one independent milestone
acceptance review by default, require zero unresolved Critical and Important
findings for PASS, report capability rather than a speculative overall
percentage, and perform the 3–5 participant formative usability check at
SBLA-012.

## Deferred nonblocking findings

The following Round 2 Minor findings do not block acceptance. They remain open
and are assigned to a future operating-model hardening task:

| Finding | Impact                                                                                                                                                                  | Follow-up destination                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| M-9     | The synonymous terms “full-artifact” and “complete-artifact” are both encoded, so a harmless terminology cleanup can cause a drift failure.                             | Normalize the term across the four contracts, structured policy, and validator sentinels in one operating-model hardening change. |
| M-10    | Literal sentinels catch deletion or mutation of protected language but cannot detect every semantically contradictory addition. Independent review remains the control. | Add narrowly scoped forbidden weakening phrases to the validator in the same operating-model hardening task.                      |
| M-11    | The exact Prettier exemption for the immutable Round 1 report is documented but its checksum is not machine-enforced. Git history still exposes tampering.              | Add a repository-wide immutable-artifact path-to-SHA-256 manifest rather than a one-off check.                                    |

## Next execution step

Integrate PLAN-001 into accepted `main`, then start SBLA-004 from that accepted
tip. Preserve the stale SBLA-004 branch only as reconciliation input; do not
merge it directly.
