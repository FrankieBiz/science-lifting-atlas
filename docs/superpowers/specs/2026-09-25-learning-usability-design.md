# Learning usability review and design

Date: 2026-09-25. Base: 25e8f0a. User requests a full page review and easier interactive teaching. Continues the approved learning roadmap; no new scientific records or publication decisions.

## Review findings

| Surface               | Finding                                                        | Action                                                                             |
| --------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Homepage              | Public primary action is disabled although anatomy works       | Link directly to explorer                                                          |
| Explorer              | Isolation leaves small structures distant                      | Add camera focus using actual selected mesh bounds                                 |
| Guide                 | Four tabs offer no learning sequence                           | Add section position, previous/next actions and a final next destination           |
| Guide                 | Non-pec selection has a passive empty state                    | Provide a working return-to-first-guide action                                     |
| Claims                | Reading and opening sources are the only learning interactions | Add optional knowledge checks with exact canonical feedback                        |
| Exercises             | Same bench schematic shown for cable fly                       | Replace exercise schematic with actual scoped record definition                    |
| Muscle/exercise pages | Deep records lack active recall                                | Reuse knowledge checks through the claim renderer                                  |
| Evidence/source pages | Source trail and limitations already exist                     | Preserve exact locators and check generated internal links                         |
| Publication           | Scientific content remains unpublished                         | Keep local-only rendering and visible status                                       |
| Accessibility         | Static content available without JavaScript                    | Keep checks' answers available as native disclosure; enhance controls only with JS |

## Design

Keep the existing white, slate and rose atlas design. Retain the body as the dominant visual. Learning uses a quiet blue-tinted practice area, clear question and large answer buttons. Answers give corrective feedback copied directly from the canonical claim; no gamified scientific certainty score. Progress means section position, not mastery. Native buttons, visible focus, polite feedback, no animation dependency and no persistent tracking.

Approaches considered: more accordions (little active learning), a separate course route (duplicates content), or integrated learning controls (chosen; one canonical claim supports multiple surfaces).

## Implementation sequence

1. Add a typed four-question presentation map and validate answer indexes and canonical claim references with unit tests.
2. Build LearningCheck with no-JS disclosure and JS answer feedback; render through PrototypeClaim so both guide and record pages benefit.
3. Add next/previous controls and return-to-guide action, retain keyboard tab behavior and existing source disclosures.
4. Add camera focus; retain reset, fallback and reduced-motion behavior, compute distance from bounds and camera aspect.
5. Replace misleading exercise illustration with canonical exercise-definition text; restore actionable homepage CTA.
6. Build normal and prototype variants, check generated internal links, run available verification and browser tests where permitted. Record sandbox failures rather than claim unrun browser checks.

## Acceptance

Each knowledge check has one valid answer, canonical feedback, no stale cross-question result and keyboard-operable choices. Guided next/previous moves focus to the selected section. Empty state action selects pectoralis in both viewer and guide. Focus frames selected geometry and reset restores full body. No unpublished content reaches production. No incorrect bench illustration remains on the cable record. No-JS text/evidence remains readable.

## Limits

This makes existing content easier to learn; 22 additional muscle guides still need research and review. Static model cannot demonstrate validated contraction or joint movement without a separately reviewed rig. Physical device and manual screen-reader checks remain release work. No participant gate is reinstated.
