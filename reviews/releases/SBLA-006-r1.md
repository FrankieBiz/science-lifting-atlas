# SBLA-006 Review R1

**Task:** SBLA-006 — Gate A anatomy asset and 2D fallback decision
**Reviewer role:** Claude Review (Account B), independent acceptance review, round 1
**Review date:** 2026-09-09
**Repository:** `/Users/frankbisignano/dev/science-lifting-atlas`
**Reviewer worktree:** `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-006-review-r1`
**Branch:** `claude-review/SBLA-006-r1`
**Candidate commit:** `d98ad23050b18e9a6fa6204bbbdabe162e31dd17`
**Candidate tree:** `18144129c0801679d0fe4737dce5d2515e26a051`
**Accepted dependency base:** `2e08f4371b1744b1b917dad858355e0b29b1c484`

**Verdict: FAIL (not accepted this round).**
**Critical: 0 · Important: 2 · Minor: 7**

No Critical or Important **defect in the candidate artifact** was found. The FAIL is recorded because two mandated acceptance verifications could not be completed in this round, and the governing rule (`AGENTS.md`, "Review stop rule") admits PASS only with zero unresolved Critical **and** Important findings. Both Important findings are review-completeness gaps, not proven candidate defects, and both are named with an exact remediation path for R2.

---

## 1. Reviewer boundary and honesty statement

- Claude Review may write only `reviews/releases/SBLA-006-r1.md`. The session sandbox denies **all** writes under `/Users/frankbisignano/dev/science-lifting-atlas` (`touch .../reviews/releases/.probe` → `Operation not permitted`). This report is therefore delivered inline, as instructed. **No file in the repository was created, modified, or deleted by this review, and no Git configuration, ref, branch, or commit was touched.**
- The `node_modules` symlink now present in the reviewer worktree (`?? node_modules` in `git status --porcelain`) was created by the owner mid-review, not by this review. I was instructed to `unlink` it before the final status check and then instructed to stop running commands; it therefore remains. It is untracked and is not part of the candidate tree.
- Everything below that is stated as executed was executed and its real output recorded. Everything derived from source reading alone is explicitly labelled **(static analysis; not executed)**. Two required verifications were not performed at all and are recorded as Important findings rather than glossed.

## 2. Environment

| Item | Value |
|---|---|
| Node.js | `v24.20.0` (pinned; from `/tmp/sbla005-node/node-v24.20.0-darwin-arm64/bin`) |
| pnpm | `11.24.0` (resolved from `packageManager`) |
| Host default Node (rejected) | `v26.0.0` — correctly refused by `engineStrict` with `ERR_PNPM_UNSUPPORTED_ENGINE` |

**Documented deviation.** The reviewer worktree is read-only in this sandbox, so `pnpm verify` cannot execute there (`EPERM: operation not permitted, open '.../_tmp_42828_…'`). The full chain was therefore run in a **byte-identical local clone** at `$TMPDIR/sbla006-verify`, checked out detached at `d98ad23`, confirmed to resolve to tree `18144129c0801679d0fe4737dce5d2515e26a051` with `git status --porcelain` empty and `git diff --stat d98ad23 HEAD` empty. Dependencies were the exact candidate dependency tree copied from the builder worktree `.worktrees/sbla-006-asset-decision/node_modules`; the only alteration was the `storeDir` field of the copied `node_modules/.modules.yaml` (gitignored, outside the audited tree) to stop pnpm purging the modules directory. All read-only stages were additionally re-run **directly inside the reviewer worktree** and agree.

## 3. Commands run and results

### 3.1 Identity, ancestry, immutability

```
git -C <worktree> rev-parse HEAD
  → d98ad23050b18e9a6fa6204bbbdabe162e31dd17            ✅ matches expected candidate
git -C <worktree> rev-parse HEAD^{tree}
  → 18144129c0801679d0fe4737dce5d2515e26a051            ✅ matches expected tree
git -C <worktree> cat-file -p HEAD
  → parent 514f0f8711ef6c3f2cc7a227e672030735cf380a
    "docs: hand off SBLA-006 asset decision"            ✅
git -C <worktree> merge-base --is-ancestor 2e08f437… HEAD
  → exit 0                                              ✅ accepted base is an ancestor
git -C <worktree> status --porcelain -b
  → ## claude-review/SBLA-006-r1  (clean at review start) ✅
```

Commit range `2e08f437..d98ad23` (9 commits, oldest first): `39b9a15`, `a74b073`, `0c90c46`, `90e1f79`, `0d0340a`, `f7e03c2`, `f82d493`, `514f0f8`, `d98ad23`. Diffstat: 17 files, +1125 / −88.

**Prior reviewer-report immutability — PASS.** All 17 reviewer-authored reports under `reviews/` were compared blob-to-blob between `2e08f437` and `d98ad23`: `PLAN-001-acceptance/-r1/-r2`, `SBLA-001-r1/-r2`, `SBLA-002-r1…r5`, `SBLA-003-internal-r1/-r1/-r1-addendum/-r2`, `SBLA-004-r1/-r2`, `SBLA-005-r1` — **every one UNCHANGED**. `git log --name-status 2e08f437..HEAD -- 'reviews/**/*-r*.md'` is empty, so no commit in the range touched a report even transiently. `reviews/releases/SBLA-005-handoff.md` *was* modified, which is permitted: it is a builder handoff, not a reviewer report, and Codex owns it.

### 3.2 Hash and identity reconciliation

| Artifact | Recomputed SHA-256 | Claimed at | Result |
|---|---|---|---|
| `docs/licenses/anatomy-asset-decision.json` | `98078059b1385a258776145fa0b528a046098f77843503c57eda6b744fb57a27` | gate doc line 6; handoff line 26 | ✅ match |
| `docs/licenses/bodyparts3d-mesh-mapping.json` | `b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196` | decision JSON line 75 | ✅ match |
| `docs/licenses/bodyparts3d-feasibility.json` | `39a8f846ec4b1d179ea9c84f8ed443c6155c3b9848c5875275105d414dacbd39` | decision JSON line 76 | ✅ match |
| `docs/licenses/bodyparts3d-performance.json` | `f6be37064594e603a849079ec32e340ae7260efb8702a228a7cb4c7381090019` | decision JSON line 77 | ✅ match |
| `assets/derived/bodyparts3d/sbla005-representative.glb` (2,874,932 bytes) | `b51f1fadbf84a5d1c439e5ca6af175397bee054306850d414f23178fb12cf5a7` | decision JSON line 59 | ✅ match, and byte count matches the gate doc's "2,874,932-byte representative GLB" |
| `reviews/releases/SBLA-005-r1.md` | `64791abd88cf5cccbac2a0170ddd1224816cd66f99f4bddc50e9cdb42d157e90` | handoff line 21 | ✅ match |

Working-tree and committed-blob hashes are identical for the decision record and the SBLA-005 report (`git cat-file -p HEAD:<path> | shasum -a 256`).

**SBLA-005 chain.** `26ce8a2bad292f82c05208fcbe4676739bfaefe1` exists, its tree is `b4f57556469a906d1fb34fe77c18e9afd4d3ddff` (matches the addendum), and it is an ancestor of the accepted base. `b3596209…` and `4427c86c…` exist. `reviews/releases/SBLA-005-r1.md` lines 323–371 read "**Critical: none.** … **Important: none.** … **PASS.**" with two non-blocking Minors — exactly as the handoff and gate doc assert.

### 3.3 Source, version, license, coverage

- `enhancement3d.datasetVersion` = `BodyParts3D 4.0 / FMA 3.0 / 99% polygon reduction` — identical to `bodyparts3d-mesh-mapping.json:datasetVersion`. ✅
- `sourceBaseUrl` identical to `mapping.source.baseUrl`. ✅
- Archives identical to `mapping.source.archives`: `isa_BP3D_4.0_obj_99.zip` 142,903,898 B / `40665852…409e`; `partof_BP3D_4.0_obj_99.zip` 64,888,505 B / `9fbc713f…1c97`. ✅
- License block: CC BY 4.0 International, version `4.0`, source `https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html`, exact attribution string, historical CC BY-SA 2.1 Japan notice preserved — cross-equal to the inventory candidate's license block and enforced field-by-field by the validator. ✅ *(Cross-checked against checked-in repository evidence only; the live DBCLS page was not re-fetched this round — see Important-2.)*

**23/28 mapping and the five gaps — independently recomputed, not trusted.** Parsing `bodyparts3d-mesh-mapping.json` directly and counting targets carrying at least one mesh:

```
targets in coverage.targets : 28
targets with >= 1 mesh      : 23
targets with 0 meshes       : 5  →  internal-oblique, latissimus-dorsi, multifidus,
                                     rectus-abdominis, transversus-abdominis
selectedMeshes: 139
coverage.conclusion: "Full mesh/header inspection confirms the five prior label gaps;
                      none is recoverable under another represented FMA term."
```

This reproduces `required 28 / present 23 / absent 5` from the underlying data, and the absent set is byte-equal to the five IDs in the decision record (`anatomy-asset-decision.json:65-71`), the gate doc (lines 12–16), and the validator's frozen `EXPECTED_MISSING_TARGET_IDS` (`scripts/assets/decision.mjs:9-15`). The gaps are not diluted anywhere in the diff. ✅

**$0 / no purchase — PASS.** `cost.purchaseRequired: false`, `purchaseUsd: 0`, `recurringUsd: 0`, `purchaseArchiveRequired: false` (`anatomy-asset-decision.json:15-22`); gate doc §Cost states `$0` purchase, `$0` recurring, "Purchase/license archive: not applicable; no commercial delivery exists." The validator hard-fails any of the three numeric/boolean cost fields (`decision.mjs:92-100`). No purchase archive is claimed, implied, or fabricated anywhere in the diff. ✅

**Owner authority — judged, not waved through.** Master plan §18 assigns SBLA-006 as "Owner decides; Codex records/commits → Claude Review," with the pass condition "…owner decision recorded in repository; reviewed commit created." The record states an explicit `approved: true`, `approvedOn: 2026-09-09`, `authorityBasis: owner-delegated-project-decision`, `recordedBy: Codex acting under owner delegation`, plus a prose record of the delegation (`anatomy-asset-decision.json:8-14`), and the handoff itself invites the reviewer to flag it (lines 87–91). Given the owner's repeated, explicit delegation of project decisions and approval authority, I find the recorded artifact satisfies the §18 pass condition: the decision is explicit, dated, attributed, durable in Git, and machine-enforced. **Not a finding.** Residual observation only (no finding): the delegation is evidenced by an in-repository prose record rather than a cryptographic signature or out-of-band owner artifact; if the owner later wants Gate A sign-offs to be non-repudiable, a signed tag or a countersigned note is the cheap upgrade.

### 3.4 `pnpm verify` — PASS (exit 0)

Run in the byte-identical clone with the pinned runtime. `pnpm install --frozen-lockfile` → "Lockfile is up to date… Already up to date", `git status --porcelain` empty afterwards.

```
$ pnpm verify                                            → exit 0
  $ prettier --check .            All matched files use Prettier code style!
  $ eslint . --max-warnings 0     (silent, exit 0)
  $ astro check                   Result (51 files): 0 errors, 0 warnings, 0 hints
  $ vitest run tests/unit         Test Files 14 passed (14) | Tests 187 passed (187)
  $ node scripts/content/validate.mjs    foundation mode; 0 records
  $ node scripts/graph/validate.mjs      foundation mode; 0 nodes and 0 edges
  $ node scripts/evidence/status.mjs     foundation mode; 0 sources checked
  $ astro build                   1 page(s) built in 744ms
  $ vitest run --config vitest.portability.config.ts
                                  Test Files 3 passed (3) | Tests 17 passed (17)
  $ node scripts/foundation/verify.mjs   Foundation contract passed
  $ node scripts/assets/spike.mjs        4 candidate(s); 1 eligible, 2 ineligible;
                                         BodyParts3D 73/100 preserved
  $ node scripts/assets/decision.mjs     SBLA-006 asset decision passed: owner-approved
                                         2D-authoritative hybrid; BodyParts3D 4.0 bounded
                                         to 23/28 optional 3D targets; $0 purchase.
```

187 unit tests and 17 portability tests reproduce the handoff's claim exactly (handoff lines 114–117). The new `pnpm assets:decision` step is genuinely in the canonical chain: `package.json:28` and `scripts/foundation/contract.mjs:22` (`REQUIRED_VERIFY_STEPS`), with `tests/unit/foundation-contract.test.ts:40-42` asserting it.

Re-run **directly in the reviewer worktree** (read-only stages only), all exit 0:

```
node_modules/.bin/prettier --check .          exit=0
node_modules/.bin/eslint . --max-warnings 0   exit=0
node scripts/content/validate.mjs             exit=0
node scripts/graph/validate.mjs               exit=0
node scripts/evidence/status.mjs              exit=0
node scripts/foundation/verify.mjs            exit=0
node scripts/assets/spike.mjs                 exit=0
node scripts/assets/decision.mjs              exit=0
```

### 3.5 `git diff --check`

```
git diff --check                          → exit 0   (clean working tree)
git diff --check 2e08f437 d98ad23         → exit 2
  docs/product/gates/SBLA-006-asset-decision.md:3: trailing whitespace.
  docs/product/gates/SBLA-006-asset-decision.md:4: trailing whitespace.
  docs/product/gates/SBLA-006-asset-decision.md:5: trailing whitespace.
```

Context that keeps this Minor rather than Important: those three lines are two-space Markdown hard breaks, Prettier-canonical (`prettier --check` passes), and the identical convention exists in the long-accepted `docs/product/master-plan.md:13-19`. A sweep of the full first-parent history shows previously **accepted** commits `919caa4` and `8482a29` also trip `git diff --check`, so this is longstanding repository convention, not a regression introduced by SBLA-006.

### 3.6 `pnpm test:e2e` — NOT EXECUTED

```
$ pnpm test:e2e                                          → exit 1
  1 failed  [chromium] › tests/e2e/foundation.spec.ts:5:1
  [FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed: kr == KERN_SUCCESS.
  bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.43836:
  Permission denied (1100)
```

Root-caused to the review sandbox, not the candidate: launching the browser binary standalone, outside Playwright and outside the repository, fails identically —

```
$ .../chromium_headless_shell-1234/.../chrome-headless-shell --headless --no-sandbox \
    --disable-gpu --dump-dom about:blank
  [FATAL:…mach_port_rendezvous_mac.cc:159] … Permission denied (1100)
```

No Chromium process can start in this session. Partial compensating evidence gathered from the production build the same run produced: `dist/index.html` contains both strings the single e2e assertion checks (`Science-Based Lifting Atlas`, `Evidence-first resistance training anatomy`), contains **zero** `<script` tags (so the JS-disabled premise is structurally satisfied), `dist/health.txt` = `ok`, and the 17 portability tests — which serve `dist` over a bare `node:http` server — passed. **This is corroboration, not the required check.** See Important-1.

## 4. Findings

### Critical — 0

None.

### Important — 2

---

**Important-1 — Required check `pnpm test:e2e` was not executed in this review round.**

*File/line:* `reviews/releases/SBLA-006-handoff.md:177` (acceptance criterion 6: "`pnpm verify`, `pnpm test:e2e`, and `git diff --check` pass on the candidate"); `reviews/releases/SBLA-006-handoff.md:118` (claims "Fresh final `pnpm test:e2e` — PASS; 1/1 Chromium production-build journey"); `playwright.config.ts:14-19`; `tests/e2e/foundation.spec.ts:5`.

*Reproduction:* With PATH set to the pinned runtime, in a byte-identical clone of `d98ad23`, run `pnpm test:e2e`. Result: exit 1, `1 failed`, with `FATAL:base/apple/mach_port_rendezvous_mac.cc:159 … bootstrap_check_in … Permission denied (1100)`. Confirm the cause is environmental by running `chrome-headless-shell --headless --no-sandbox --dump-dom about:blank` directly: identical fatal error.

*Why Important, and what it is not:* This is **not** evidence that the candidate's e2e journey is broken — the builder's claim is plausible and the static build output independently contains exactly what the one assertion checks. It is that an acceptance criterion the handoff itself makes binding has **no independent confirmation** in this round, and the review stop rule allows PASS only on zero unresolved Important items. Accepting on the builder's own e2e claim would make this review a rubber stamp on the one check it could not reproduce.

*Remediation for R2:* Re-run the review in an environment where Chromium may bootstrap Mach ports (a non-sandboxed session or CI), and record `pnpm test:e2e` output verbatim. No candidate change is expected or requested.

---

**Important-2 — Mandated adversarial and primary-source verifications were not performed.**

*File/line:* `reviews/releases/SBLA-006-handoff.md:156-163` ("Required reviewer action": "…recompute decision/evidence hashes, compare the selected source to SBLA-005 **and current primary license terms**, verify the owner-authority record, and **try to falsify every guardrail**").

*Reproduction / what is missing:* Three specified verifications were not run before this review was concluded:
1. **The adversarial fail-closed mutation battery.** No mutation of `docs/licenses/anatomy-asset-decision.json` was executed against `node scripts/assets/decision.mjs`. The candidate's own unit suite (`tests/unit/asset-decision.test.ts`, 9 cases) does exercise nine negative paths and passed, but that is the builder's test of the builder's validator, not independent falsification.
2. **Coordinated digest mutations.** The specific scenario the review was asked to probe — mutating an evidence file *and* its recorded digest together — was analysed by source reading only (see Minor-2) and never executed.
3. **Primary license re-verification.** `https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html` was not fetched. The CC BY 4.0 claim was cross-checked only against checked-in repository evidence (`asset-candidates.json` ↔ decision record, enforced field-by-field by the validator), which cannot detect a change in the upstream terms since the recorded `accessedOn: 2026-09-09`.

*Why Important:* The handoff's required-reviewer-action list is the acceptance scope for this gate. Roughly a third of it is unexecuted, and it is precisely the adversarial third. The static findings below are hypotheses derived from reading `scripts/assets/decision.mjs`; none is confirmed by execution, and at least one of them (Minor-3) could turn out to be fully mitigated by `pnpm assets:spike` in the same `pnpm verify` chain.

*Remediation for R2:* Execute, at minimum: single-field negative mutations of `ownerApproval.approved`, `cost.purchaseUsd`, each archive `sha256`, the license quadruple, `representativeArtifact.sha256`, `coverage.mapped3dTargets`, each of the five `missing3dTargetIds`, and each validated guardrail; the coordinated (file + recorded digest) mutation of each of the three evidence files, checking whether any other `pnpm verify` stage catches it; deletion of `candidates[].scores`; and a live fetch of the DBCLS license page. No candidate change is requested pending those results.

---

### Minor — 7 (non-blocking; all recorded with a follow-up destination)

**Minor-1 — The handoff's `git diff --check` claim does not hold under the convention the prior reviewer used.** *(Confirmed by execution.)*
`reviews/releases/SBLA-006-handoff.md:119` states "`git diff --check` — PASS." Bare `git diff --check` is exit 0 (clean tree), but `git diff --check 2e08f437 d98ad23` is **exit 2**, flagging `docs/product/gates/SBLA-006-asset-decision.md:3-5`. `reviews/releases/SBLA-005-r1.md:99` records the prior reviewer running the range form. The flagged lines are Prettier-canonical Markdown hard breaks matching `docs/product/master-plan.md:13-19`, and accepted commits `919caa4` and `8482a29` trip the same check, so this is a wording-precision defect, not a formatting defect. *Follow-up:* state the exact invocation in future handoffs (`git diff --check <base> <candidate>`), or normalise the three lines to `<br>`-free wrapping. Destination: SBLA-007 handoff hygiene.

**Minor-2 — `bodyparts3d-performance.json` is digest-pinned but never parsed, so a coordinated mutation would survive the decision gate.** *(Static analysis; not executed.)*
`scripts/assets/decision.mjs:17-21` lists it in `EXPECTED_EVIDENCE_PATHS`, and `decision.mjs:224-236` recomputes its SHA-256 and compares it to `decision.evidenceDigests` (`anatomy-asset-decision.json:77`). But unlike `mapping` and `feasibility`, the performance file's *contents* are never read into `validateAssetDecision` — no field of it is cross-checked. Changing a measured value in that file **and** updating the recorded digest in the decision record should therefore pass. By contrast, the same coordinated attack on `bodyparts3d-mesh-mapping.json` should still be caught for the fields that are independently cross-checked (`decision.mjs:139-156, 192-207`: dataset version, base URL, archives, 28/23/5, absent IDs), and on `bodyparts3d-feasibility.json` for the representative artifact path/SHA (`decision.mjs:176-190`) — which is additionally anchored by the checked-in GLB whose real hash I recomputed. *Follow-up:* assert at least the headline performance figures the gate doc quotes (2,874,932 B; 3.811125 ms native; 6.0015 ms reduced-simulation median) inside the validator. Destination: SBLA-013, which owns production performance gates.

**Minor-3 — The §8.3 license-clarity floor passes vacuously when `scores` is absent.** *(Static analysis; not executed.)*
`scripts/assets/decision.mjs:122`: `candidate.scores?.license_clarity < 4`. If `scores` is missing, this evaluates `undefined < 4` → `false`, so the branch does not fire and the hard master-plan floor ("no candidate license score <4 proceeds") is silently skipped. `weightedTotal !== 73` on line 121 still pins the candidate, and `pnpm assets:spike` may independently reject a scoreless candidate — **unverified**. *Follow-up:* rewrite as `!(Number(candidate?.scores?.license_clarity) >= 4)`. Destination: SBLA-007.

**Minor-4 — Several declarative decision fields carry policy meaning but are not validated.** *(Static analysis; not executed.)*
`validateAssetDecision` checks four of the six guardrails (`decision.mjs:209-222`); `guardrails.generatedAnatomyImagesPermitted` and `guardrails.requiredAttributionMustShipWithEveryDerivative` (`anatomy-asset-decision.json:84-85`) are unchecked, as are `cost.purchaseArchiveRequired`, `cost.reason`, `baseline2d.rightsBasis/accessibility/checksumStatus`, `coverage.policy`, `sourceIdentityPolicy`, `license.historicalEmbeddedNotice`, `acceptedRisks`, `rejectedAlternatives`, `laterTaskBoundaries`, `decisionId`, and `recordedOn`. Flipping `generatedAnatomyImagesPermitted` to `true` — which would invert an explicit §8.4 publication guardrail — should not fail `pnpm verify`. *Follow-up:* extend the frozen guardrail check to all six booleans and require non-empty strings for the policy prose. Destination: SBLA-007.

**Minor-5 — The Gate A packet, including the SHA-256 it records for the decision JSON, is not machine-checked.** *(Static analysis; not executed.)*
`docs/product/gates/SBLA-006-asset-decision.md:6` records `98078059…a27` for the decision record — correct today (recomputed in §3.2) — but nothing in `pnpm verify` reads the gate markdown. Editing a free-text field in the JSON would silently invalidate that digest, and editing the packet's prose (outcome, cost, coverage) to contradict the machine record would not fail any gate. *Follow-up:* add a check that the gate packet exists and that the SHA-256 it cites equals the live hash of `anatomy-asset-decision.json`. Destination: SBLA-007.

**Minor-6 — Root resolution via `URL.pathname` is not percent-decoded.** *(Static analysis; not executed.)*
`scripts/assets/decision.mjs:254`: `resolve(new URL('../..', import.meta.url).pathname)`. On a checkout path containing a space or non-ASCII character, `pathname` is percent-encoded and the four `readFile` calls miss. The failure mode is **fail-closed** (the CLI's `catch` prints "failed to load" and sets exit 1), so it cannot mask a bad decision; it only breaks clean-checkout reproducibility on such paths. *Follow-up:* use `fileURLToPath(new URL('../..', import.meta.url))`. Destination: SBLA-007.

**Minor-7 — The Account-B review claim records the candidate commit but not its tree, contrary to the handoff.** *(Confirmed by execution.)*
`reviews/releases/SBLA-006-handoff.md:29-31` states "Its exact commit **and tree** are recorded in the subsequent Codex-authored review claim." The claim commit `8a62bd64d4d54989e88ced1b2143d6b395c70bc2` adds an active-claim row naming branch `claude-review/SBLA-006-r1`, worktree `.worktrees/sbla-006-review-r1`, base commit `d98ad23050b18e9a6fa6204bbbdabe162e31dd17`, expected handoff and sole owned path `reviews/releases/SBLA-006-r1.md` — but no tree hash. Tree `18144129…` appears nowhere in the repository. Everything else in the claim is exactly correct, and the claim correctly scopes this reviewer to one path. *Follow-up:* add the tree hash to review claim rows, or drop the "and tree" wording. Destination: SBLA-007 ledger hygiene.

## 5. What this review affirms

Recorded so the R2 round need not redo it:

1. Commit identity, tree identity, and ancestry from the accepted base are exact.
2. Every checksum the candidate asserts — decision record, three evidence digests, representative GLB, SBLA-005 report — recomputes correctly.
3. The 23/28 coverage and the exact five gaps were recomputed from the underlying mesh data, not read from prose.
4. `$0` purchase / `$0` recurring / no purchase archive is truthful and machine-enforced; nothing in the diff implies a commercial acquisition.
5. All 17 prior reviewer reports are byte-identical; append-only immutability holds.
6. `pnpm verify` passes end to end (exit 0) on the exact candidate tree under the pinned Node 24.20.0 / pnpm 11.24.0 runtime, and `pnpm assets:decision` is genuinely wired into the canonical chain and contract test.
7. The owner-delegated authority record satisfies the §18 pass condition for a recorded owner decision.
8. Scope discipline holds: no scientific illustration, claim, schema, rig, or anatomy assertion is created by this task; later-gate boundaries (SBLA-007/008–011/012/013/015) are stated in the decision record, the gate packet, the plan, and the handoff, and the 73/100 score is consistently framed as measurement, never as blanket approval.

## 6. Verdict

**FAIL — 0 Critical, 2 Important, 7 Minor.**

The candidate artifact is in good shape: no confirmed defect in it reached Critical or Important, and every substantive claim I was able to reproduce, reproduced exactly. The failure is one of review evidence, not (on current evidence) of the work: the required `pnpm test:e2e` could not run in this sandbox, and the mandated adversarial falsification and primary-license verification were not performed. Under `AGENTS.md`, PASS requires zero unresolved Important findings, so this round cannot accept.

Per the review stop rule, the correct next step is **one bounded remediation round that re-runs the complete artifact check** — specifically Important-1 and Important-2 in an environment that can launch Chromium and execute the mutation battery. No repair of the candidate is requested. If R2 executes those and they hold, the seven Minors are all non-blocking and should be carried to their named destinations (mostly SBLA-007) rather than gating Gate A.

*Reviewer note: the sandbox denied writing `reviews/releases/SBLA-006-r1.md`; this report is the complete inline substitute and should be committed to that exact path verbatim by Codex, which owns commits.*
