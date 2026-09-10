# Complete fresh-device handoff for new Codex and Claude accounts

**Prepared:** 2026-09-10  
**GitHub:** `https://github.com/FrankieBiz/science-lifting-atlas` (private)  
**Coordination branch containing this document:** `codex/SBLA-007-review-coordination`  
**Accepted branch:** `main`  
**Current immutable candidate branch:** `codex/SBLA-007-evidence-schemas`

This document replaces all prior chat context. A completely new Codex account and a completely new Claude account can continue from repository evidence alone. Do not require access to the prior Mac, Windows checkout, Codex conversations, Claude conversations, scratch files, or browser sessions.

## 1. Access prerequisite

The repository is private. The new device must authenticate Git with the GitHub account `FrankieBiz`, or another GitHub identity that the owner has explicitly added as a collaborator. Never paste a GitHub token into an AI chat or commit it to the repository.

On Windows, prefer a short checkout path because long nested paths previously caused Windows Git and executable-path failures:

```powershell
cd C:\
mkdir src -ErrorAction SilentlyContinue
cd C:\src
git clone https://github.com/FrankieBiz/science-lifting-atlas.git sciatlas
cd C:\src\sciatlas
git fetch --all --prune
git switch codex/SBLA-007-review-coordination
```

Install official Node.js `24.20.0`, enable Corepack, and activate pnpm `11.24.0`:

```powershell
corepack enable
corepack prepare pnpm@11.24.0 --activate
node --version
pnpm --version
```

The versions must print `v24.20.0` and `11.24.0` exactly.

## 2. Product and authority

Science-Based Lifting Atlas is a static-first, evidence-visible resistance-training anatomy and exercise atlas. Its promise is to let a reader select a trainable structure, understand what it does, see how exercises load it, and inspect the evidence, applicability, uncertainty, and revision history behind every meaningful claim.

The authority order is:

1. `docs/product/master-plan.md`, especially section 18's `SBLA-001` through `SBLA-020` queue.
2. `AGENTS.md` and `docs/runbooks/operating-policy.json`.
3. `docs/runbooks/current-work.md`.
4. The latest immutable task handoff and append-only review report.
5. This transfer summary.

If a chat statement conflicts with the repository, the repository wins. If two repository documents conflict, stop and resolve them against the master plan without erasing history.

## 3. Exact verified state

- `main` is the accepted line at `bbeddc06b53962a8f76e4d0f5d0871e20fa4075a`.
- SBLA-001 through SBLA-006 are accepted.
- Durable queue progress is 6 of 20 accepted gates, or 30% by gate count.
- SBLA-007 implementation is complete but is not accepted and is not on `main`.
- The immutable SBLA-007 candidate is commit `a48981a8c1a8a66b4345251633a841fc4e08df5c`.
- Its exact tree is `81de159aa0533b318011ed3eda2ff3dca59da8a5`.
- Its branch is `codex/SBLA-007-evidence-schemas`.
- Its authoritative handoff is `reviews/releases/SBLA-007-handoff.md` on that candidate.
- No `reviews/releases/SBLA-007-r1.md` exists in the immutable candidate or any pushed SBLA-007 review branch at preparation time.
- The remaining gate is a fresh independent Claude Review followed by Codex integration if and only if the review passes.

Do not describe the whole product as 30% built. Thirty percent is only accepted queue-gate progress; later content waves are much larger than early foundation tasks. The master plan intentionally postpones a trustworthy delivery forecast until SBLA-017 measures real vertical-slice throughput.

## 4. What SBLA-007 contains

SBLA-007 provides the evidence data foundation:

- strict shared Zod schemas for common metadata, claims, sources, evidence packets, reviews, and change records;
- deterministic cross-record, publication-state, review-date, source-status, identifier, and certainty-language validation;
- safe JSON/YAML discovery and fail-closed content, graph, and evidence commands;
- Astro content collection registration using the same schemas;
- adversarial valid/invalid fixtures and documented authoring diagnostics;
- Windows portability repairs and exact provenance binding;
- bounded SBLA-006 follow-up checks for decision guardrails, score presence, packet checksum drift, and paths containing spaces.

The final candidate was verified on Windows with:

- `pnpm verify`: PASS;
- 16 unit-test files and 222 tests: PASS;
- 3 portability files and 17 tests: PASS;
- Astro type checking: zero errors, warnings, or hints;
- production build, foundation checks, content/graph/evidence gates, and both asset gates: PASS;
- `pnpm test:e2e`: 1 of 1 Chromium journey PASS;
- accepted-base and working-tree `git diff --check`: PASS with no output.

These are builder results and must be reproduced by the reviewer; they are not self-acceptance.

## 5. Explicitly deferred scope

Do not add any of the following while reviewing or integrating SBLA-007:

- scientific claims or published content;
- graph generation or public graph bundles;
- MDX claim components or factual-prose AST linting;
- Crossref, PubMed, Retraction Watch, or other live status clients;
- production anatomy media or performance-record semantic validation;
- anatomy interaction, search, comparison, or public page design.

SBLA-008 begins research scoping only after SBLA-007 is accepted. SBLA-011 owns graph compilation and approved vertical-slice integration. SBLA-013 owns production media and performance semantics.

## 6. Role assignment for the two fresh accounts

### New Codex account

Codex is the integration and repository authority. It must verify the clone, create the exact reviewer claim and worktree, provide the reviewer packet, independently verify the returned report boundary, commit the report if Claude's sandbox cannot, and merge only a passing candidate.

Codex must not write the independent review, disguise builder checks as reviewer evidence, weaken a failed gate, or merge before acceptance.

### New Claude account

For the current task, reserve the new Claude account exclusively as **Claude Review**. It is independent because it did not create or remediate the candidate. Do not use it for SBLA-007 implementation advice before the review; doing so would unnecessarily blur that independence.

Claude Review may write only a newly pre-claimed regular file at `reviews/releases/SBLA-007-r1.md`. It must never modify the candidate, the ledger, scripts, schemas, fixtures, configuration, or prior reports. It must report FAIL if any Critical or Important finding remains unresolved.

For SBLA-008 and later Claude-authored research, this same Claude account may act as Claude Research, but a different independent model/account must review artifacts it authors or remediates.

## 7. New Codex bootstrap procedure

The old device-specific review claim was canceled during this transfer because its worktree path and account identity do not exist on the new device. The new Codex must create a fresh coordination claim before Claude receives candidate access.

From the coordination checkout:

1. Read in full: `AGENTS.md`, master-plan sections 9, 10, 13, and 18, `docs/adr/0002-content-data-and-graph.md`, `docs/runbooks/current-work.md`, `reviews/releases/SBLA-006-handoff.md`, `reviews/releases/SBLA-006-r2.md`, and `reviews/releases/SBLA-007-handoff.md` from candidate `a48981a...`.
2. Prove remote identity with `git remote -v`, `git ls-remote`, `git log -1 --format="%H %T %s"`, and `git status --short --branch`.
3. Confirm `git cat-file -t a48981a8c1a8a66b4345251633a841fc4e08df5c` says `commit` and its tree is `81de159aa0533b318011ed3eda2ff3dca59da8a5`.
4. Create a short reviewer worktree directly from the immutable candidate. On Windows use `C:\src\s007r1`:

```powershell
git worktree add C:\src\s007r1 -b claude-review/SBLA-007-r1-new-device a48981a8c1a8a66b4345251633a841fc4e08df5c
```

5. In the coordination branch, add and commit an active `docs/runbooks/current-work.md` claim for role `Claude Review (fresh independent account)`, branch `claude-review/SBLA-007-r1-new-device`, worktree `C:\src\s007r1`, base `a48981a...`, expected handoff `reviews/releases/SBLA-007-r1.md`, and exactly one owned path: `reviews/releases/SBLA-007-r1.md`.
6. Push both the coordination branch and empty reviewer branch before dispatch.
7. Let Claude inspect only the reviewer worktree. Do not give it the coordination branch as its write target.

## 8. Prompt to paste into the new Codex account

```text
Clone or open https://github.com/FrankieBiz/science-lifting-atlas and switch to codex/SBLA-007-review-coordination. Read docs/runbooks/new-device-agent-handoff.md completely before acting. Treat it as the replacement for all prior chat context. Verify every commit, tree, branch, claim, and command yourself. The current immutable candidate is a48981a8c1a8a66b4345251633a841fc4e08df5c with tree 81de159aa0533b318011ed3eda2ff3dca59da8a5. Do not modify that candidate and do not begin SBLA-008. Your task is to create a fresh exact-path Claude Review claim/worktree as instructed, prepare the independent review packet, verify the returned append-only report and role boundary, and integrate only if the report says PASS with zero unresolved Critical and Important findings. Preserve every branch and report; never force-push or self-accept.
```

## 9. Prompt to paste into the new Claude account

Paste this only after the new Codex has committed the replacement review claim and substitute its real committed coordination-claim SHA where marked:

```text
You are the fresh independent Claude Review for Science-Based Lifting Atlas task SBLA-007. You did not author or remediate this candidate. Do not repair it.

Repository: C:\src\sciatlas
Reviewer worktree: C:\src\s007r1
Reviewer branch: claude-review/SBLA-007-r1-new-device
Immutable candidate commit: a48981a8c1a8a66b4345251633a841fc4e08df5c
Expected candidate tree: 81de159aa0533b318011ed3eda2ff3dca59da8a5
Accepted dependency base: bbeddc06b53962a8f76e4d0f5d0871e20fa4075a
Codex coordination claim commit: REPLACE_WITH_NEW_CODEX_CLAIM_SHA
Your only permitted repository write: reviews/releases/SBLA-007-r1.md

First verify branch, commit, tree, clean status, dependency ancestry, and the exact claim using git show on the coordination commit. Read AGENTS.md; master-plan sections 9, 10, 13, 18; ADR 0002; the complete SBLA-006 handoff and passing R2 report; the complete SBLA-007 handoff; schemas, validators, adapters, authoring-error guide, fixtures, tests, dependency changes, and the accepted-base-to-candidate diff.

Use official Node.js v24.20.0 and pnpm 11.24.0. Run pnpm install --frozen-lockfile, pnpm verify, pnpm test:e2e, the accepted-base range git diff --check, and adversarial mutations in disposable copies outside the repository. Independently test all five schema families; common metadata; review/publication transitions; exact target/checksum and evidence-packet provenance binding; DOI/PMID/PMCID and URL normalization; deterministic asOf and date boundaries; every source-link role; missing/duplicate references; retraction/correction/status behavior; certainty-language false positives and negatives including punctuation and Unicode; structured issue paths/remediation; symlink, extension, parsing, and filename/ID failures; Windows path behavior; and scope exclusions.

Write only reviews/releases/SBLA-007-r1.md. It must cite the exact candidate and tree, list commands actually run and real results, state PASS or FAIL, enumerate unresolved Critical/Important/Minor counts, distinguish candidate defects from environment limitations, and give exact file/line evidence and remediation. PASS requires zero unresolved Critical and zero unresolved Important findings. If your sandbox cannot write the repository, create the complete report as one file in your scratch output and give Codex its exact path and SHA-256 for byte-identical placement. Do not modify or commit any other path.
```

## 10. Codex acceptance procedure after Claude returns

1. Preserve Claude's report verbatim. If Codex must place it because of sandbox limits, compare source and destination byte-for-byte and record the SHA-256.
2. From a trusted checkout, run the role boundary against the exact candidate and reviewer worktree, permitting only `reviews/releases/SBLA-007-r1.md`.
3. Re-run `pnpm verify` and `pnpm test:e2e` on the reviewed candidate/report state. Record actual output.
4. If the report is FAIL, do not merge. Close the review claim, preserve the report, and open one bounded Codex remediation claim for its Critical/Important findings. A repaired candidate requires a new append-only review round.
5. If the report is PASS with zero unresolved Critical and Important findings, close the review claim, add the acceptance traceability record, and fast-forward `main` only through the reviewed candidate and immutable report/integration commits.
6. Push `main` and all relevant task/review/coordination branches. Verify local and remote SHAs match.
7. Only then begin SBLA-008 from the accepted SBLA-007 handoff commit named by the acceptance record.

## 11. Independent continuation probes

Before changing anything, the new Codex should be able to answer from files and Git alone:

- What is the accepted `main` SHA?
- What exact candidate commit and tree await review?
- Why is SBLA-007 not yet accepted despite passing tests?
- Which one path may Claude Review write?
- Which tasks own graph compilation, live source acquisition, and production media?
- What happens after a failed review?
- Which commands prove the candidate and report are reproducible?

If any answer requires the old chat, stop: the handoff has not been followed correctly.

## 12. Non-negotiable safety rules

- Never force-push or rewrite published task/review history.
- Never edit an existing review report.
- Never let Claude Review repair the artifact it audits.
- Never merge an unreviewed or failed candidate into `main`.
- Never invent scientific claims, sources, command output, approvals, or reviewer evidence.
- Never expose tokens, credentials, private keys, or proprietary assets to either AI account.
- Preserve unrelated or concurrent work and fetch before every push.
