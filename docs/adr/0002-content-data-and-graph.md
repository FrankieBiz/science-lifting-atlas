# ADR 0002 — Content data model and graph generation

- Status: Accepted
- Date: 2026-08-30
- Task: SBLA-003
- Reverified: 2026-09-01
- Note: This ADR fixes the _mechanism_. The entity and claim **schemas
  themselves** are owned by SBLA-007 and are deliberately not specified here.

## Context

Master plan §10 defines entity types, relationship types, claim/source records,
and graph integrity rules. §11.2 selects Zod for schemas and a generated static
JSON graph for traversal. SBLA-001 already ships stage-aware content, graph, and
evidence adapters that pass only in the truthful empty state and fail closed on
unsupported records.

A decision is needed now on _where records live and how they become pages_, so
SBLA-007 and SBLA-011 build against a settled pipeline.

## Decision

1. **Records are files in the repository**, under the canonical `content/`
   tree already materialised by SBLA-001. Git is the source of truth, the audit
   log, and the review surface. There is no separate content store.
2. **Zod schemas are the single validation authority**, consumed both by Astro
   content collections and by the standalone `pnpm validate:content` /
   `validate:graph` scripts, so a record cannot pass one path and fail the other.
3. **The graph is generated, never hand-maintained.** `scripts/graph/` compiles
   validated records into versioned static JSON. A hand-edited graph file is a
   defect.
4. **Claims are referenced by typed ID, never restated in prose.** Editorial MDX
   cites claim IDs; the rendered claim text comes from the claim record.
5. **Validators fail closed.** An unrecognised, malformed, or unsupported record
   is an error, not a skip. SBLA-001 already establishes this, including for
   symbolic links, and it must not be weakened.
6. **Drafts and published content are separate trees.** `content-drafts/` holds
   Claude Research output; only Codex promotes into `content/`.

## Consequences

- Review of content is ordinary code review: diffs, blame, and immutable
  history come free, which the evidence gates in §9 depend on.
- Build time grows with record count. This is the accepted trade for build-time
  validation, and the content waves in SBLA-018/019 must measure it.
- Renaming an entity ID is a breaking graph change and needs a migration, since
  IDs are the link substrate between claims, pages, and sources.
- Because the graph is generated, any traversal feature is a pure function of
  validated records — so search and comparison (SBLA-016) inherit correctness
  from validation rather than re-implementing it.

## Alternatives considered

- **A headless CMS.** Rejected: it moves the source of truth outside Git,
  weakens the review trail the evidence system depends on, adds a runtime
  dependency, and risks recurring cost against the §11.8 $0 target.
- **A build-time database (SQLite) as the graph.** Rejected for Release 1: the
  static JSON bundle is directly consumable by client islands with no query
  layer, and the graph is small at Release 1 scale.
- **Hand-authored graph edges.** Rejected: it would allow the graph to drift out
  of agreement with the records it claims to describe.

## Reversal cost

- Replacing Pagefind or the generated JSON serialization is **moderate** cost:
  the validated records and typed IDs remain reusable, but search/graph clients
  and build outputs change.
- Moving authoring to a CMS is **high** cost because the project must preserve
  Git-equivalent provenance, immutable review history, role boundaries, and
  fail-closed validation during migration.
- Changing individual schemas after SBLA-007 is **moderate to high** depending on
  record count. Stable IDs reduce the cost; renaming IDs requires a versioned
  migration and redirect/reference plan.
