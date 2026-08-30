# Handoff template

Every task ends with a handoff written from this template. The headings are
fixed by master plan section 13.6 and are checked by `pnpm verify`; do not
rename, reorder, or drop one. Add sections if a task needs them.

Destinations:

- Builder tasks — `reviews/releases/<task-id>-handoff.md`
- Evidence tasks — `research/packets/<task-id>-handoff.md`
- Review reports — `reviews/<discipline>/<task-id>-r<number>.md` (append-only)

The rule that makes this template worth following: **no handoff may rely on
chat context.** A reviewer who has never seen your session must be able to
start from the file alone. Write exact paths, exact commits, and real command
output.

---

Copy everything below this line.

---

# Handoff: <task ID and title>

## Objective

What this task was required to deliver, in the queue's own terms. Name the
master plan row it satisfies.

## Inputs and exact paths

Every file, branch, worktree, and commit the work started from. Include the
reviewed base commit named by the dependency's approved handoff.

## Constraints

What this task was not allowed to do, and which queue items own the work you
deliberately left alone.

## Work completed

What now exists that did not before. Be specific enough to review without
re-deriving it.

## Decisions made

Choices a reviewer could reasonably question, with the reason. Include
alternatives rejected and why.

## Tests/checks run and results

The exact commands and their real results. A check you did not run does not
appear here. A check that failed appears here as failed, with the output.

## Known uncertainties

What you are not sure about, what is untested, and what a later task must
confirm. This section being empty is itself a claim.

## Files created or modified

Complete list. A reviewer uses this to bound the diff.

## Required reviewer action

Exactly what the reviewer must decide, and against which criteria.

## Acceptance criteria

The conditions that make this task complete. Each one must be checkable by
someone other than you.
