# SBLA-012 static acceptance record

**Status:** builder checks passed; independent review and owner visual approval pending

**Authority:** [2026-09-24 owner decision](../gates/SBLA-012-usability-decision.md)

**Candidate:** `codex/SBLA-012-realistic-static-slice`

## What this gate can show

The local prototype and automated browser checks can show that routes,
controls, labels, links, and presentation states work. They cannot show that
representative lifters understand the content or trust the hierarchy. Do not
describe automated checks or builder walkthroughs as participant observations.

## Required checks

1. Run `pnpm verify`, `pnpm test:e2e`, and `pnpm test:prototype` with the pinned
   Node.js and pnpm versions. Record exact results and the candidate commit.
2. In the local prototype, follow home → pectoralis major → bench press →
   claim disclosure → source record. Check that uncertainty and the source
   locator remain visible (find, understand, verify).
3. Confirm the entity URL is stable and opens the same route in a fresh tab
   (share). Follow the methodology route and verify the AI-role disclosure.
4. Check the journey with keyboard only and with JavaScript disabled. At a
   390 × 844 viewport, confirm there is no horizontal document overflow. Check
   the reduced-motion presentation.
5. Confirm every prototype evidence route carries a visible unpublished banner
   and `noindex,nofollow`. Confirm the normal build emits no unpublished entity
   routes or unpublished evidence graph data.
6. Record any Critical or Important findings, repairs, and rechecks before the
   independent reviewer receives the exact candidate. Owner visual-direction
   approval follows the passing review.

The local prototype uses `SBLA_012_PROTOTYPE=local-owner-review`. Do not deploy
that build. The production build remains fail-closed.

## Builder results — 2026-09-24

- Pinned runtime: Node.js `v24.20.0`, pnpm `11.24.0`.
- `pnpm verify` passed: 323 unit tests, five accessibility contract checks,
  four visual contract checks, 17 portability checks, content/evidence gates,
  typecheck, lint, and a two-route normal static build.
- `pnpm test:e2e` passed: five Chromium checks of the ordinary fail-closed
  build, including absent unpublished entity routes and graph data.
- `pnpm test:prototype` passed: four Chromium checks of the local unpublished
  journey, share URL, methodology disclosure, keyboard path, mobile reflow,
  reduced motion, and the visible/noindex boundary on muscle, exercise, and
  source archetypes. All four checks ran with JavaScript disabled.

These results are builder checks, not independent acceptance or evidence of
human comprehension. No participant sessions took place. The next steps are
independent review of the exact candidate and owner inspection of the visual
direction. The anatomy-production hold remains active regardless of SBLA-012
acceptance.
