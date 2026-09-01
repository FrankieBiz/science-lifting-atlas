# Research question — SBLA-002 Claude Research readiness simulation

- Task: SBLA-002 environment-readiness simulation (§13.9)
- Role: Claude Research (account A)
- Date: 2026-08-31
- Status: readiness simulation only — **not** production evidence work

## Scope warning

This is a plumbing test, not research. It exists to prove that the Claude
Research role can read the repository at a reviewed commit, write only inside its
permitted paths, extract from a source with exact locators, and produce a handoff
that stands alone. **No output of this task may ever be promoted to `content/`.**

## Question

> Within the Science-Based Lifting Atlas operating model, which repository paths
> may the Claude Research role write to, and does that role's own source material
> license it to make anatomical, exercise, or training claims?

This question is deliberately answerable from the assigned fixture alone. It is
an operating-model question, not a scientific one, so a correct answer cannot
smuggle an unsupported training claim into the repository.

## Why this shape of question

Master plan §9.3 requires a real research question to be atomic and answerable
from identified sources. A readiness fixture cannot support a PICO/PECO question
because it contains no population, intervention, comparator, or outcome — so
framing one would be theatre. The question above is therefore scoped to what the
fixture can actually answer, and the absence of PICO/PECO is itself recorded as a
limitation rather than faked.

## Inclusion criteria

- The assigned CC0 readiness fixture, in full.

## Exclusion criteria

- Every anatomy, exercise, biomechanics, or training source. None is in scope.
- Model memory. §13.8 forbids it as evidence, and nothing here relies on it.

## Search strategy

None, and that is correct. The source was assigned directly by the readiness
packet, so there is no database, no search string, and no screening log. A
production evidence task (SBLA-008 onward) would require all three; recording
"not applicable" here rather than inventing a search string keeps the distinction
between a plumbing test and real evidence work legible.

## Expected output

1. This question record.
2. A locator-backed extraction separating fixture facts from interpretation.
3. A handoff packet using every §13.6 heading.

## Success condition

The role wrote only within `research/`, produced exact locators, claimed nothing
the fixture does not support, and left a handoff a reviewer can act on without
this session's context.
