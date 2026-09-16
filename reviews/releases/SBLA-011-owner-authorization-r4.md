# SBLA-011 owner authorization for final criterion-13 closure

- Date: 2026-09-16
- Decision: authorize one final two-site remediation and one focused independent
  recheck
- Failed recheck: [`SBLA-011-r3.md`](SBLA-011-r3.md)
- R3 report commit: `cf7efc5c8e15923e1d8b314785ce946716b68e9e`
- Remaining blocker: `I7-R3`

## Owner direction and decision

The owner repeatedly directed Codex to continue building, use both Claude Code
accounts efficiently, and favor a strong completed project rather than leaving
known defects behind. R3 verified that the 30 R2 probes are closed but found two
pre-existing certainty-exception sites that still cross a short conjunction.
Codex disclosed the residual and is implementing option 1 from R3 section 10.2:
the smallest quality-preserving repair, rather than accepting or deferring the
known Important finding.

## Authorized scope

Only the two sites in R3 section 10.1 may change:

1. bind the short negation-prefix exemption to the matched universal token by
   refusing to cross a new-assertion boundary; and
2. bind the single-causal-token calibration fallback to the causal token using
   the existing calibration-position and assertion-boundary helpers.

Regression fixtures may be added for the R3 universal and causal triads and all
135 promoted texts must remain accepted. No content, qualifier wording,
research, approval, graph data, source, grade, or publication state may change.
R3 Minors N6-R3 and N7-R3 remain routed to SBLA-012; N8-R3 may close only if it
is an automatic consequence of the mechanism-A fix. This authorization does
not turn R3 into PASS or establish a general entitlement to more review rounds.

## Role separation

Codex owns the two-site implementation. Claude Code account A may perform
read-only advisory verification. Claude Code account B remains independent and
may write only the pre-claimed R4 report.
