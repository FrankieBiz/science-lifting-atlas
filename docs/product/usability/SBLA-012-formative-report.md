# SBLA-012 formative usability report

Status: **recruitment pending; required participant gate not yet satisfied**  
Candidate under test: `9515aa0` (`codex/SBLA-012-realistic-static-slice`)  
Required sample: 3–5 representative lifters or coaches  
Protocol: [`SBLA-012-formative-plan.md`](SBLA-012-formative-plan.md)

This report is deliberately incomplete until real participant sessions occur.
No simulated participants, inferred reactions, or AI-generated observations are
included. The builder preflight below verifies that the candidate is safe and
usable enough to put in front of participants; it is not participant evidence
and does not satisfy the SBLA-012 gate.

Production Blender, glTF, and interactive-body work remain excluded by the
owner hold. Participants will evaluate the static evidence journey and the
clearly labeled BodyParts3D evaluation fallback, not final anatomy quality.

## Gate status

| Requirement                                                 | Current state | Evidence                                       |
| ----------------------------------------------------------- | ------------- | ---------------------------------------------- |
| 3–5 representative participants                             | Open          | No sessions completed                          |
| At least one coach                                          | Open          | Recruitment pending                            |
| At least one primarily mobile participant                   | Open          | Recruitment pending                            |
| Find, understand, verify, share, and method tasks attempted | Open          | No participant task results                    |
| Critical blockers fixed and rechecked                       | Open          | Requires participant observations              |
| Owner approves visual direction                             | Open          | Requires completed report and review candidate |

The candidate must not advance to SBLA-012 acceptance, SBLA-013, or production
anatomy work while any row above remains open.

## Builder preflight — not participant evidence

The exact candidate was checked on 2026-09-17 before recruitment:

- The prototype build generated 73 local review routes; the normal fail-closed
  build generated only the home and methodology routes.
- Every prototype record retains `noindex,nofollow` and the visible wording
  “not approved for publication.”
- The home, muscle, exercise, source, and methodology archetypes were visually
  inspected at desktop and 390 × 844 mobile widths.
- The mobile muscle and source pages had no horizontal document overflow. The
  smallest rendered text measured 12 px in the inspected muscle page.
- The muscle record uses a visibly attributed static evaluation plate. The
  exercise record uses a separate movement schematic and does not imply that
  the anatomy fallback is an exercise demonstration.
- `pnpm verify`, all five Chromium journeys, five accessibility checks, four
  visual-contract checks, and seventeen portability checks passed for the
  candidate.

These checks reduce avoidable session failures, but they cannot establish that
the hierarchy, language, evidence labels, or navigation are understandable to
representative users.

## Recruitment log

No recruitment attempt is recorded yet. When outreach begins, record only the
date, channel, number invited, number eligible, and number scheduled. Do not
record names, health history, injury information, contact details, or other
sensitive data in this repository.

If a documented reasonable effort cannot recruit 3–5 qualifying participants,
mark SBLA-012 blocked and return the recruitment decision to the owner. A
smaller convenience check may guide design but cannot satisfy the queue gate.

## Participant observations

No participant observations have been collected. Add one subsection per real
session only after it occurs. Each subsection must identify the anonymous
participant code, category, primary device/input, task outcomes, rounded task
times, wrong-route selections, observed friction, confidence ratings, and any
consented short quote. Keep observation separate from interpretation.

Do not add blank participant tables: empty rows are easy to mistake for missing
data, and simulated rows are prohibited by the protocol.

## Findings, repairs, and rechecks

No participant-derived findings exist yet. Once sessions begin, list every
Critical, Important, and Minor finding with its evidence, disposition, commit,
and recheck result. Critical journey blockers must be fixed and rechecked before
owner review.

## Current conclusion

The static vertical slice is technically ready for formative sessions, but the
usability gate remains **OPEN**. The next proof is three to five real sessions
using F1, U1, V1, S1, and M1 from the protocol, followed by repair and recheck
of any Critical blockers. Until then, this document is a transparent readiness
record—not an acceptance report.
