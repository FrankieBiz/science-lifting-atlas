# SBLA-012 formative usability plan

> **Superseded 2026-09-24 by owner decision.** The 3–5 participant requirement
> below is retained as historical planning context and is no longer an SBLA-012
> acceptance gate. See the [owner decision](../gates/SBLA-012-usability-decision.md)
> and [current static acceptance plan](SBLA-012-static-acceptance.md).

Status: **planned; no participant sessions completed**  
Artifact under test: `codex/SBLA-012-realistic-static-slice`  
Required sample: 3–5 representative lifters or coaches  
Owner gate: results, Critical fixes, and visual direction require owner approval

Production Blender and interactive 3D work are intentionally excluded under the
owner hold recorded 2026-09-17. Participants evaluate the authoritative static,
semantic journey; they must not be shown a rushed 3D substitute or told that the
evaluation render represents final anatomy quality. See
[`SBLA-012-anatomy-production-hold.md`](../design/SBLA-012-anatomy-production-hold.md).

## Purpose

Test whether the first realistic static slice makes the product's central
promise understandable: find a relevant entity, understand the practical
takeaway and uncertainty, verify it through claim-level evidence, and share a
stable route. This is formative design research, not a scientific study and not
evidence about training.

The current public-safe build contains only the home and methodology
archetypes. Muscle, exercise, and source tasks begin only after the local-only
prototype gate can render reviewed records without including those routes in a
normal build.

The test may assess whether people understand where an eventual body explorer
fits, but it does not evaluate mesh quality, orbit/selection behavior, materials,
lighting, or 3D performance. Those questions remain deferred with SBLA-013
through SBLA-015.

## Participants

Recruit 3–5 adults who fit at least one category:

- A resistance-training participant with at least six months of consistent
  practice who has previously looked up exercise or anatomy information.
- A coach or personal trainer who compares exercises or explains evidence to
  clients.

Aim for at least one coach and at least one participant who primarily uses a
phone. Do not collect health history, injury details, biometric data, account
credentials, or other sensitive personal information. Record only a participant
code, category, primary device, task outcome, observed friction, and optional
product comments.

If 3–5 representative participants cannot be recruited after a documented
reasonable effort, SBLA-012 is blocked and the decision returns to the owner.
A smaller convenience check may inform design but does not satisfy the gate.

## Test environments

Run at least:

- One desktop viewport at or above 1280 × 720.
- One mobile viewport near 390 × 844.
- One keyboard-only pass.
- Reduced-motion enabled for at least one pass.
- The ordinary fail-closed build once, proving unpublished entity routes are
  absent.

Use the local prototype only. It must carry a visible “not approved for
publication” banner and `noindex,nofollow`. Never deploy the prototype build.

## Moderator script

1. “This is an unfinished atlas for resistance-training anatomy and evidence.
   We are testing the interface, not you. Please think aloud. The content is not
   medical or training advice.”
2. Ask the participant to begin from the home page without explaining the
   navigation.
3. Present the tasks below one at a time. Do not suggest which control to use.
4. After each task ask: “What do you think this page is saying, and how certain
   does it feel?”
5. End with: “What would make you trust this more? What felt slower or less
   clear than expected?”

## Tasks and success criteria

### F1 — Find

Prompt: “You want to learn about the first chest structure covered by the
atlas. Show where you would start and open its page.”

Success: reaches the pectoralis-major archetype without moderator help and can
identify that it is the current review slice. Record route, hesitation, false
starts, and time to first correct selection.

### U1 — Understand

Prompt: “In your own words, what is the practical takeaway, and what important
limit or uncertainty is the page showing?”

Success: identifies one displayed takeaway and at least one visible limitation
without interpreting certainty as a performance score or universal rule.

### V1 — Verify

Prompt: “Show how you would check where this statement came from and whether
the evidence is mixed or limited.”

Success: moves from entity page to claim detail and source record, identifies
the evidence label, and locates the source/locator trail. No hidden hover-only
step may be required.

### S1 — Share

Prompt: “You want to send this exact page or state to another lifter. Show what
you would share, then explain what you expect them to see.”

Success: identifies a stable URL or share control and expects the recipient to
land on the same entity/state. The task does not require actually transmitting
anything.

### M1 — Method

Prompt: “Find out who made this, how AI is used, and whether ‘reviewed’ means
peer reviewed.”

Success: reaches methodology and correctly states that the project is AI-only
under human ownership and is not credentialed expert or peer review.

## Measures

For each participant and task record:

- Outcome: unassisted success, assisted success, or failure.
- Time to outcome, rounded to the nearest five seconds.
- Number of wrong-route selections.
- Observed blocker and the participant's words, paraphrased unless they consent
  to a short direct quote.
- Confidence after the task on a 1–5 scale, used only as a usability signal.
- Viewport/input mode and whether reduced motion was enabled.

Do not average the sample into claims of population-level usability. Report
task-level patterns and concrete failures.

## Severity and repair rule

- **Critical:** prevents a core find/understand/verify/share task, exposes
  unpublished content in the ordinary build, or creates a serious accessibility
  barrier. Must be fixed and rechecked before owner review.
- **Important:** materially misleads the evidence interpretation or causes
  repeated task failure/friction. Must be fixed or explicitly returned to the
  owner with scope evidence.
- **Minor:** local clarity/polish issue that does not block or materially distort
  the journey. Record impact and destination.

## Output

Results go to `docs/product/usability/SBLA-012-formative-report.md`. The report
must distinguish observation from interpretation, name participant count and
mix, list every task result, show fixes and rechecks, and state whether the
3–5-person gate was actually satisfied. Empty or simulated participant rows are
prohibited.
