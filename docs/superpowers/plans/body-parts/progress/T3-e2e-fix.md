# T3-e2e-fix — Scope the homepage Elbow locator

Branch: bp/T3-e2e-fix · Base: 0ffc47e (integration with T1–T5 merged) · Head: 016ed8f · Agent: Claude Sonnet 5.5 (Lane S)

## Done

- `tests/e2e/body-parts.spec.ts`: the home → Elbow step now selects `a.part-card` containing "Elbow" inside `#body-parts`. T4's body map and grouped list added two more Elbow links there, which broke the unscoped locator (reported in T4's note).

## Checks (real output)

- pnpm verify: exit 0.
- pnpm test:e2e: not run: sandbox blocks browsers. Please rerun the full `pnpm test:e2e` where a browser works (Luna reported a working preview on port 4321).

## Deviations from the plan

- none

## Needs from other tasks / owner

- Rerun `pnpm test:e2e` (all specs) outside the sandbox before accepting T4.
