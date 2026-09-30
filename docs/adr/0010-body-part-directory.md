# ADR 0010 — Body-part directory outside the claim pipeline

- Status: Accepted by owner, 2026-09-30
- Date: 2026-09-30
- Task: T5

## Context

The owner wants a simple, browsable directory: click a body part to read a
plain overview, common injuries, and categorized studies ordered newest first
and linked to PubMed. The claim pipeline is too slow for this directory, and
the owner does not want AI review of every page.

## Decision

1. Body-part pages at `/body/<slug>/` are general education and an automated
   literature listing, not scientific claims.
2. They do not use `content/` collections, claim components, approval
   manifests, or evidence tiers, and are not subject to Claude Review.
3. Keep them outside claim territory: no recommendations, dosages, statistics,
   evidence rankings, or “studies show” language (checked by
   `validateBodyPart`). Studies are listed, never summarized or endorsed, and
   every page says that lists are automatic and not individually vetted.
4. Quality control is automated checks (`pnpm verify`, the relevance test, and
   the validator) plus the owner's read-through before publishing a region.
5. Tasks follow
   `docs/superpowers/plans/2026-09-30-body-part-directory.md`, hand off through
   per-task progress notes, and do not use `docs/runbooks/current-work.md`.

## Consequences

This allows the directory to ship faster. Lists may contain an occasional
off-topic or low-quality study; title filters and the relevance test reduce
that risk. Overview text may contain errors; conservative writing rules and the
owner's review reduce that risk.

## Alternatives considered

- Put every body-part overview and study listing through the claim pipeline and
  independent review. The owner rejected this due to the time cost and because
  these pages are educational summaries rather than project claims.
- Publish pages with no safeguards. Rejected because automated validation,
  study relevance checks, and owner review provide a bounded quality process.

## Reversal cost

Low. A later owner-approved ADR can bring body-part pages into the claim
pipeline; page content and routes can remain in place while their validation
and review process changes.
