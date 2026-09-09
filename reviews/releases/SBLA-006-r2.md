# SBLA-006 Review R2

**Task:** SBLA-006 — Gate A anatomy asset and 2D fallback decision
**Reviewer role:** Claude Review (Account B), independent acceptance review, round 2
**Reviewer account:** francis@beyondlimitscarefoundation.org (Claude Code / Opus 5, Account B reviewer session)
**Review date:** 2026-09-09
**Repository:** `/Users/frankbisignano/dev/science-lifting-atlas`
**Reviewer worktree:** `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-006-review-r2`
**Reviewer branch:** `claude-review/SBLA-006-r2`
**Review base HEAD:** `ea736e5334670d6c5cd25c2f42e5bdeaf0191ea1`
**Reviewed candidate commit:** `d98ad23050b18e9a6fa6204bbbdabe162e31dd17` *(immutable; re-verified this round)*
**Reviewed candidate tree:** `18144129c0801679d0fe4737dce5d2515e26a051` *(immutable; re-verified this round)*
**Accepted dependency base:** `2e08f4371b1744b1b917dad858355e0b29b1c484`
**Prior round:** `reviews/releases/SBLA-006-r1.md` (blob `b1882efd86fafdf06b05030e6bcf18e233a40d04`)

**Verdict: PASS.**
**Unresolved Critical: 0 · Unresolved Important: 0 · Minor (carried forward, non-blocking): 7**

R1's two Important findings were both review-evidence gaps, not candidate defects. Both are closed
this round: the adversarial mutation battery was executed (47 cases), and the primary DBCLS license
page was fetched live and matches the repository verbatim. No new Critical or Important finding was
produced. Two of R1's Minor findings are materially narrowed by compensating controls that R1 marked
unverified and that this round verified.

---

## 1. Scope and reviewer boundary

This R2 is narrowly scoped to close R1's two Important evidence gaps. The R1-affirmed checks
(§5 of the R1 report) are accepted and not redone, except where re-running was cheap and needed to
support the verdict (§3.1, §3.5). No contradictory evidence to any R1 affirmation was found.

**Write boundary.** My only permitted repository output is `reviews/releases/SBLA-006-r2.md`. As in
R1, the session sandbox denies all writes under the repository:

```
$ touch reviews/releases/.r2probe
touch: reviews/releases/.r2probe: Operation not permitted     (exit 1)
```

This report is therefore delivered inline for Codex to commit verbatim to that exact path.
**No file in the repository was created, modified, or deleted by this review; no Git ref, branch,
commit, or configuration was touched.** The reviewer worktree was clean at start and at finish:

```
$ git status --porcelain -b
## claude-review/SBLA-006-r2                       (no entries — clean)
```

All mutation work was performed in disposable copies under `$TMPDIR/sbla006-r2-mut/`, outside the
repository and outside every worktree. Candidate artifacts were never altered in place.

**Honesty statement.** Everything below stated as executed was executed, with its real output
recorded. Where a check could not be run, that is stated plainly rather than inferred. One R1 claim
is corrected in the candidate's favour (Minor-2); one R1 "unverified" mitigation is now confirmed
(Minor-3).

## 2. Environment

| Item | Value |
|---|---|
| Node.js | `v24.20.0` — pinned, from `/tmp/sbla005-node/node-v24.20.0-darwin-arm64/bin` |
| pnpm | `11.24.0` (`packageManager`) |
| Dependencies | **No install performed.** The already-present dependency tree in the reviewer worktree (`node_modules/.pnpm`, 534 packages) was copied read-only into the disposable clone. |

**Documented deviation — the `pnpm` wrapper could not be used; verify stages were run directly.**
In this sandbox `pnpm run` triggers `runDepsStatusCheck`, which attempts an install and then aborts
on `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`; `pnpm store path` itself fails with `EPERM`. I
therefore executed **all twelve stages of the `verify` chain directly** via `node` and
`node_modules/.bin/*`, in the same order `package.json:28` defines. This runs identical underlying
commands and omits only pnpm's own process wrapper. The chain composition was independently
confirmed against `scripts/foundation/contract.mjs:12-23` (`REQUIRED_VERIFY_STEPS`), and
`verify:foundation` — which asserts that composition — is itself one of the twelve stages and
passes.

**Disposable environments used**

| Path | Built from | Purpose |
|---|---|---|
| `$TMPDIR/sbla006-r2-mut/base` | `git archive 18144129…` | pristine reference; per-case source for Battery A |
| `$TMPDIR/sbla006-r2-mut/run` | fresh copy per mutation | Battery A (decision-gate mutations) |
| `$TMPDIR/sbla006-r2-mut/clone` | `git clone` → `checkout --detach d98ad23` | Phase B (full 12-stage gate) |
| `$TMPDIR/sbla006-r2-mut/dir with space` | copy of `base` | Minor-6 probe |

The clone's identity was verified before use:

```
HEAD  = d98ad23050b18e9a6fa6204bbbdabe162e31dd17
TREE  = 18144129c0801679d0fe4737dce5d2515e26a051
git status --porcelain                     → (empty)
git diff --stat d98ad23 HEAD               → (empty)
```

An earlier attempt used a plain `git archive` extraction with no `.git`; its baseline showed
`1 failed | 186 passed` on `tests/unit/asset-conversion.test.ts > requires a genuine strict-ancestor
baseline receipt`, which probes Git ancestry. That was a **harness artifact of the missing
repository, not a candidate defect** — it disappears in the proper clone, which passes 187/187. It
is recorded here because it was observed, not suppressed.

## 3. Evidence

### 3.1 Identity, immutability, ancestry (re-verified)

```
git cat-file -t d98ad23…                       → commit
git log -1 --format='%H %T' d98ad23…           → d98ad23050b18e9a6fa6204bbbdabe162e31dd17
                                                 18144129c0801679d0fe4737dce5d2515e26a051   ✅
git merge-base --is-ancestor 2e08f437… d98ad23… → exit 0  (accepted base is an ancestor)     ✅
git merge-base --is-ancestor d98ad23… HEAD      → exit 0  (candidate is an ancestor of R2 base) ✅
```

The review base adds only reviewer/ledger material on top of the candidate — **no candidate artifact
moved between `d98ad23` and `ea736e5`**:

```
git diff --name-status d98ad23… ea736e5…
  M  docs/runbooks/current-work.md
  A  reviews/releases/SBLA-006-r1.md
commits: 8a62bd6 "chore: claim SBLA-006 Account-B review"
         ea736e5 "review: record SBLA-006 round-one findings"
```

Per-file blob comparison `d98ad23` vs `ea736e5` — all **same**: `anatomy-asset-decision.json`,
`bodyparts3d-mesh-mapping.json`, `bodyparts3d-feasibility.json`, `bodyparts3d-performance.json`,
`asset-candidates.json`, `scripts/assets/decision.mjs`, `docs/product/gates/SBLA-006-asset-decision.md`.

Evidence-file digests recomputed from the extracted immutable tree — all match R1 and the decision
record:

```
98078059b1385a258776145fa0b528a046098f77843503c57eda6b744fb57a27  anatomy-asset-decision.json
b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196  bodyparts3d-mesh-mapping.json
39a8f846ec4b1d179ea9c84f8ed443c6155c3b9848c5875275105d414dacbd39  bodyparts3d-feasibility.json
f6be37064594e603a849079ec32e340ae7260efb8702a228a7cb4c7381090019  bodyparts3d-performance.json
```

### 3.2 Live primary-license verification — **closes R1 Important-2 (part 3)**

**Network access was available.** The page was fetched successfully; nothing here is inferred.

| Item | Value |
|---|---|
| URL | `https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html` |
| Fetch timestamp (UTC) | **2026-09-09T16:06:30Z** |
| HTTP status | **200** (no redirect; `url_effective` identical to requested) |
| Bytes / SHA-256 of response | 14,694 · `fa66e4b2c32d93a9a4d5067de1199ad9de4e5ab83ed22a14066e6975be739f68` |
| Page's own "Last updated" | **2025/02/27** |

Verbatim excerpt from the fetched page (tags stripped, whitespace collapsed):

> The license for this database is specified in the Creative Commons Attribution 4.0 International.
> If you use data from this database, please be sure attribute this database as follows:
> "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0
> International". … With regard to this database, you are licensed to: freely access part or whole
> of this database, and acquire data; freely redistribute part or whole of the data from this
> database; and freely create and distribute database and other derivative works based on part or
> whole of the data from this database, under the license, as long as you comply with the following
> conditions: You must attribute this database in the manner specified by the author or licensor
> when distributing part or whole of this database or any adapted material.

The page also links `creativecommons.org/licenses/by/4.0/deed.en` and
`creativecommons.org/licenses/by/4.0/legalcode.en`, and renders the CC BY 4.0 badge.

**Exact conclusion.** As of 2026-09-09T16:06:30Z the official primary DBCLS BodyParts3D license page
**does currently state Creative Commons Attribution 4.0 International**, and **does expressly permit
all three of access/acquisition, redistribution, and creation and distribution of derivative works,
conditioned on attribution**. The attribution string it specifies is present **verbatim, byte-for-byte**
in the repository:

```
live page  : BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International
repository : BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International
             (anatomy-asset-decision.json:54, asset-candidates.json path-c license.attributionString,
              and frozen as EXPECTED_ATTRIBUTION at scripts/assets/decision.mjs:29-30)
python check `repo attribution present verbatim in live page` → True
```

Corroborating details: the page's "Last updated : 2025/02/27" **predates** the recorded
`accessedOn` values (`2026-09-05` in the inventory, `2026-09-09` in the decision record), so the
upstream terms have **not** changed since the repository recorded them — the specific risk R1 named
is excluded on evidence. This also independently confirms the inventory's own note that "The current
DBCLS license page was updated 2025-02-27 and now states CC BY 4.0 International". The live page
contains **no ShareAlike obligation**, which is consistent with the record's conservative treatment
of the historical CC BY-SA 2.1 Japan notice still embedded in the acquired OBJ headers.

*Precision note, not a finding:* the repository record carries **no SPDX identifier field**. The
quartet actually recorded and machine-enforced is `license.name` / `license.version` /
`license.source` / `license.attributionString` (`decision.mjs:158-174`). All four match the live
page. An SPDX short identifier (`CC-BY-4.0`) is absent from the record and therefore was not, and
could not be, validated.

### 3.3 Adversarial mutation battery — **closes R1 Important-2 (parts 1 and 2)**

47 mutation cases across two phases, every one executed in a disposable copy. Baselines pass in both
phases, so every rejection below is attributable to the mutation.

**Baseline, Phase B (full 12-stage gate on the pristine clone at `d98ad23`) — 12/12 pass:**

```
  ok format:check    ok lint            ok typecheck        ok test(unit) [187 passed]
  ok validate:content ok validate:graph  ok evidence:status  ok build
  ok test:portability [17 passed]        ok verify:foundation
  ok assets:spike     ok assets:decision
  --> stages passed=12 failed=0     GATE_EXIT=0
```

This independently reproduces R1's `pnpm verify` PASS on the exact candidate tree.

#### Battery A — targeted mutations vs the intended verifier (`node scripts/assets/decision.mjs`)

`d` = `assets:decision` exit, `s` = `assets:spike` exit.

| # | Mutation (one field at a time) | d | s | Intended verifier rejects? |
|---|---|---|---|---|
| 0 | *baseline, unmutated* | 0 | 0 | n/a (clean) |
| 1 | `ownerApproval.approved` true→false | 1 | 0 | ✅ rejected |
| 2 | `ownerApproval.approved` deleted | 1 | 0 | ✅ rejected |
| 3 | `cost.purchaseUsd` 0→4999 | 1 | 0 | ✅ rejected |
| 4 | `cost.purchaseRequired` false→true | 1 | 0 | ✅ rejected |
| 5 | `cost.recurringUsd` 0→120 | 1 | 0 | ✅ rejected |
| 6 | archive `isa_BP3D_4.0_obj_99.zip` sha256 → `00…` | 1 | 0 | ✅ rejected |
| 7 | archive `isa_…` bytes +1 | 1 | 0 | ✅ rejected |
| 8 | archive `isa_…` sha256 **coordinated** (decision+mapping+digest) | **0** | 0 | ❌ not rejected here — **caught by full gate**, see B5 |
| 9 | archive `partof_BP3D_4.0_obj_99.zip` sha256 → `00…` | 1 | 0 | ✅ rejected |
| 10 | archive `partof_…` bytes +1 | 1 | 0 | ✅ rejected |
| 11 | archive `partof_…` sha256 **coordinated** | **0** | 0 | ❌ not rejected here — **caught by full gate**, see B6 |
| 12 | `license.source` → `https://example.invalid/lic.html` | 1 | 0 | ✅ rejected |
| 13 | `license.name` → `…Attribution-ShareAlike 4.0 International` | 1 | 0 | ✅ rejected |
| 14 | `license.version` → `2.1` | 1 | 0 | ✅ rejected |
| 15 | `license.attributionString` → altered | 1 | 0 | ✅ rejected |
| 16 | `license.source` **coordinated** (decision **+** inventory) | 1 | 0 | ✅ rejected — frozen constant anchors it |
| 17 | `license.attributionString` **coordinated** (decision **+** inventory) | 1 | 0 | ✅ rejected — frozen constant anchors it |
| 18 | `representativeArtifact.sha256` → `11…` | 1 | 0 | ✅ rejected |
| 19 | `representativeArtifact.path` → `other.glb` | 1 | 0 | ✅ rejected |
| 20 | `coverage.mapped3dTargets` 23→28 *(gap dilution)* | 1 | 0 | ✅ rejected |
| 21 | `coverage.requiredTargets` 28→23 | 1 | 0 | ✅ rejected |
| 22 | drop missing id `latissimus-dorsi` | 1 | 0 | ✅ rejected |
| 23 | drop missing id `rectus-abdominis` | 1 | 0 | ✅ rejected |
| 24 | drop missing id `internal-oblique` | 1 | 0 | ✅ rejected |
| 25 | drop missing id `transversus-abdominis` | 1 | 0 | ✅ rejected |
| 26 | drop missing id `multifidus` | 1 | 0 | ✅ rejected |
| 27 | substitute one missing id, same count | 1 | 0 | ✅ rejected |
| 28 | guardrail `bodyparts3dMayBeSoleAnatomySource` false→true | 1 | 0 | ✅ rejected |
| 29 | guardrail `webglRequiredForCoreJourney` false→true | 1 | 0 | ✅ rejected |
| 30 | guardrail `createScientificIllustrationsInThisTask` false→true | 1 | 0 | ✅ rejected |
| 31 | guardrail `publishUnsupportedAnatomy` false→true | 1 | 0 | ✅ rejected |
| 32 | guardrail `generatedAnatomyImagesPermitted` false→true | **0** | 0 | ❌ **not rejected — survives full gate** (Minor-4) |
| 33 | guardrail `requiredAttributionMustShipWithEveryDerivative` true→false | **0** | 0 | ❌ **not rejected — survives full gate** (Minor-4) |
| 34 | inventory path-c: **delete `scores` object** | **0** | **1** | ⚠️ decision gate fails open; **`assets:spike` rejects** (Minor-3) |
| 35 | inventory path-c: `license_clarity` 4→1 *(control)* | 1 | 1 | ✅ rejected by both |

**Battery A result: every single-field mutation R1 named as mandatory is rejected by the intended
verifier** — `ownerApproval.approved`, `cost.purchaseUsd`, every archive `sha256`, the full license
quartet, the representative artifact `sha256`, `mapped3dTargets`, each of the five missing target
IDs, and each of the four *validated* guardrails. 5 of 35 mutations survived `assets:decision`; all
five are analysed at chain level in Phase B.

#### Phase B — coordinated evidence-file + decision-digest mutations vs the **full 12-stage gate**

Each case mutates an evidence file **and** refreshes `decision.evidenceDigests` so the decision
record's own digest check is satisfied, then runs all twelve stages.

| # | Coordinated mutation | Gate exit | Failing stage(s) | Caught? |
|---|---|---|---|---|
| B1 | `performance.json`: inflate a measured value ×10 **+ refresh digest** | 1 | `test(unit)` | ✅ **caught** |
| B2 | `mapping.json`: rewrite `coverage.conclusion` prose **+ refresh digest** | 1 | `test(unit)` | ✅ caught |
| B3 | `mapping.json`: coverage 23/5 → 28/0 **+ refresh digest** *(control)* | 1 | `test(unit)`, `assets:decision` | ✅ caught |
| B4 | `feasibility.json` + decision: representative sha256 → `22…` **+ refresh digest** | 1 | `test(unit)` | ✅ caught |
| B5 | archive `isa_…` sha256 coordinated (decision+mapping+digest) | 1 | `test(unit)` | ✅ caught |
| B6 | archive `partof_…` sha256 coordinated | 1 | `test(unit)` | ✅ caught |
| B7 | guardrail `generatedAnatomyImagesPermitted` → true | **0** | — | ❌ **survives** (Minor-4) |
| B8 | guardrail `requiredAttributionMustShipWithEveryDerivative` → false | **0** | — | ❌ **survives** (Minor-4) |
| B9 | inventory path-c: delete `scores` | 1 | `test(unit)`, `assets:spike` | ✅ caught |
| B10 | decision JSON free-text edit → gate-packet SHA-256 goes stale | **0** | — | ❌ **survives** (Minor-5) |
| B11 | gate packet prose 23/28 → 28/28 *(contradicts machine record)* | **0** | — | ❌ **survives** (Minor-5) |

**The catching control, identified by execution.** For B1–B6 the rejecting stage is the unit suite,
specifically:

```
FAIL tests/unit/asset-spike.test.ts > BodyParts3D exercise-media feasibility evidence
     > binds the measured artifacts and all seven rubric criteria to inspectable evidence
FAIL tests/unit/asset-spike.test.ts > SBLA-005 measured candidate scorecard
     > binds the embedded browser score evidence to the authenticated performance record
FAIL tests/unit/asset-full-benchmark.test.ts > complete representative browser benchmark
     > pins the checked-in record to the actual artifact
```

`tests/unit/asset-spike.test.ts` carries **frozen SHA-256 literals for the evidence files
themselves** — including `b10761d2…` (mesh-mapping) at lines 1638/1749 and `f6be3706…`
(performance) at line 1759 — hard-coded in the test source and therefore **independent of
`decision.evidenceDigests`**. It also recomputes the checked-in artifacts' digests directly
(`decision.mjs`-independent, lines 1772-1781). This is the anchor that defeats the coordinated
attack class, and R1 did not find it.

**Net: only 4 of 47 mutations survive the full gate**, and all four are instances of the two Minor
findings R1 already recorded (Minor-4 and Minor-5), now upgraded from static analysis to
execution-confirmed. Every mutation touching owner approval, cost, licensing, provenance digests,
coverage, the five gaps, or the four load-bearing guardrails is rejected.

### 3.4 Probes of the R1 Minor claims (all executed)

- **Unvalidated guardrails / declarative fields (Minor-4) — CONFIRMED.** Cases 32/33 and B7/B8:
  flipping `generatedAnatomyImagesPermitted` to `true` or
  `requiredAttributionMustShipWithEveryDerivative` to `false` passes all twelve stages, exit 0.
  Both are at their correct values in the candidate as delivered.
- **Performance JSON parsing (Minor-2) — CONFIRMED at the decision gate, REFUTED at chain level.**
  The file's contents are indeed never read by `validateAssetDecision` (only its digest is compared),
  so B1 passes `assets:decision`. But B1 **fails `pnpm verify`** via the frozen test literals above.
  R1's literal statement ("would survive the decision gate") is correct; R1's practical implication
  ("Changing a measured value in that file and updating the recorded digest should therefore pass")
  is **false for the verify chain**. Recorded as a correction in the candidate's favour.
- **Fail-open missing scores (Minor-3) — CONFIRMED, and R1's suspected mitigation now VERIFIED.**
  Deleting `scores` yields `undefined < 4` → false, and `assets:decision` exits 0 (case 34). R1
  flagged "pnpm assets:spike may independently reject a scoreless candidate — unverified". It does:
  `assets:spike` exits **1**, and the unit suite also fails, so the chain rejects it (B9). The
  control (`license_clarity` 4→1) is rejected by both.
- **Percent-decoding (Minor-6) — CONFIRMED, fail-closed.**
  ```
  $ cd "$TMPDIR/sbla006-r2-mut/dir with space" && node scripts/assets/decision.mjs
  SBLA-006 asset decision failed to load:
  - ENOENT: no such file or directory, open '/private/tmp/.../dir%20with%20space/docs/licenses/bodyparts3d-mesh-mapping.json'
  exit=1
  # control, identical tree at a space-free path: exit=0
  ```
  It breaks reproducibility on such paths; it cannot mask a bad decision.
- **Gate-packet digest desync (Minor-5) — CONFIRMED with concrete hashes.**
  ```
  gate doc cites                        : 98078059b1385a258776145fa0b528a046098f77843503c57eda6b744fb57a27
  live decision JSON (pristine)         : 98078059b1385a258776145fa0b528a046098f77843503c57eda6b744fb57a27   ✅ correct today
  live decision JSON (after free-text edit): 38038bb2c14b8ca9772a8a7ee1af4cd317e6922bc53457714379b0ba4543ceea
  gate doc still cites                  : 98078059…a27      (stale, undetected)
  assets:decision exit                  : 0 ;  full gate exit: 0
  ```
- **`git diff --check` invocation (Minor-1) — CONFIRMED.**
  ```
  git diff --check                                → exit 0
  git diff --check 2e08f437… d98ad23…             → exit 2
    docs/product/gates/SBLA-006-asset-decision.md:3,4,5: trailing whitespace
  ```
  The three flagged lines are two-space Markdown hard breaks; `prettier --check` passes on them.
- **Tree hash absent from the claim (Minor-7) — CONFIRMED.**
  `git grep 18144129c0801679d0fe4737dce5d2515e26a051` at `d98ad23` returns no match.

### 3.5 Browser evidence — disposition of R1 Important-1

**My own rerun: not possible. The blocker is this sandbox, and it is proven, not assumed.**

```
$ .../chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell \
      --headless --no-sandbox --disable-gpu --dump-dom about:blank
[FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed: kr == KERN_SUCCESS.
bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.97240: Permission denied (1100)
```

Identical to R1. No Chromium process can start in this session. Per instruction, this is **not**
recorded as a candidate defect. (A `playwright test` attempt in the clone additionally failed
earlier, at `config.webServer` — that server command is `pnpm build && pnpm preview`, so it died on
the same pnpm sandbox limitation described in §2, before reaching a browser.)

**The witnessed Codex output.** A separate non-sandboxed Codex execution in this exact R2 reviewer
worktree produced, today:

```
exit=0
$ playwright test
Running 1 test using 1 worker
✓ 1 [chromium] › tests/e2e/foundation.spec.ts:5:1 › serves a useful static foundation without client JavaScript (411ms)
1 passed (4.8s)
```

**Assessment — is this sufficient independent acceptance evidence?** I judge **yes**, on two
independent strands, with the residual named honestly.

*Strand 1 — the transcript is consistent with the candidate tree in ways only a real run reproduces.*
Every structural detail checks out against the committed sources, which I verified directly:
`tests/e2e/` contains exactly one spec with exactly one `test(` (`grep -c` → 1); that test begins at
**line 5** of `tests/e2e/foundation.spec.ts`, matching `:5:1`; its title is verbatim `serves a useful
static foundation without client JavaScript`; `playwright.config.ts:15-19` declares exactly one
project named `chromium`; `fullyParallel: false` with no `CI` set yields "1 worker"; and
`reporter: process.env.CI ? 'github' : 'list'` yields precisely this `list`-reporter line format. I
note plainly that a reporter transcript is forgeable text and I did not observe the process myself —
this strand is corroboration of authenticity, not proof of it.

*Strand 2 — I independently verified the whole semantic content of the test without a browser.*
The spec (`tests/e2e/foundation.spec.ts:3-16`) sets `javaScriptEnabled: false`, does `page.goto('/')`,
and makes exactly two assertions. I built the production output (`astro build`, exit 0) and served
`dist/` over a real `node:http` server on `127.0.0.1:4321` — the config's `baseURL` — then fetched `/`:

```
GET /            -> 200  1592 bytes
  <h1> match     -> true      # <h1>Science-Based Lifting Atlas</h1>  → satisfies getByRole('heading', …)
  tagline match  -> true      # 'Evidence-first resistance training anatomy' present
  <script> count -> 0         # nothing on the page depends on client JS
GET /health.txt  -> 200  "ok\n"
```

Both assertions hold, over HTTP, at the exact path and origin the test uses, on the exact candidate
build. The `javaScriptEnabled: false` premise is structurally satisfied because the page ships **zero**
`<script>` tags. The 17 portability tests, which serve `dist` over a bare `node:http` server, also
pass in my run. For this particular test the browser is doing little beyond parsing static HTML and
resolving an ARIA heading role, so the residual risk that a real Chromium disagrees with these
findings is very small.

**Exact remaining blocker.** A reviewer-executed, first-party `pnpm test:e2e` in *this* session
remains impossible: Chromium cannot bootstrap Mach ports under this sandbox, and `pnpm` cannot run
its script wrapper here. Fully first-party browser evidence requires a non-sandboxed reviewer session
or CI. Given the witnessed exit-0 run in this exact worktree plus my independent verification of
every assertion the test makes, I do **not** carry this forward as an unresolved Important finding.
It is recorded as **Minor-8** so the residual stays visible rather than being quietly dropped.

## 4. Findings

### Critical — 0

None.

### Important — 0 unresolved

**R1 Important-1 — `pnpm test:e2e` not independently executed → RESOLVED.**
Closed by the witnessed exit-0 Codex run in this exact R2 worktree plus reviewer-executed
verification of both of the test's assertions against the production build served over HTTP (§3.5).
The residual — no first-party browser run is possible in this sandbox — is carried as Minor-8. No
candidate defect found; no candidate change requested.

**R1 Important-2 — adversarial battery and primary-license verification not performed → RESOLVED.**
Closed by 47 executed mutation cases across two phases (§3.3) and a successful live fetch of the
DBCLS license page (§3.2). Both mandated verifications now have real, recorded outcomes. The
adversarial work found no Critical or Important defect: every mutation of owner approval, cost,
licence, provenance digests, coverage, the five gaps, and the four load-bearing guardrails is
rejected by the gate. No candidate change requested.

### Minor — 8 (non-blocking; carried forward, not inflated)

All seven R1 Minors are substantiated and carried forward. Two are **narrowed** by compensating
controls verified this round; four are **upgraded from static analysis to execution-confirmed** at
unchanged severity. One new Minor records the residual browser-evidence gap.

**Minor-1 — the handoff's `git diff --check` claim does not hold in the range form.** *(Confirmed by
execution, §3.4.)* Bare form exit 0; `git diff --check 2e08f437 d98ad23` exit 2 on
`docs/product/gates/SBLA-006-asset-decision.md:3-5`. Prettier-canonical hard breaks matching
`docs/product/master-plan.md:13-19`; previously accepted commits trip the same check. Wording
precision, not a formatting defect. *Destination:* SBLA-007 handoff hygiene.

**Minor-2 — `bodyparts3d-performance.json` is digest-pinned but never parsed by the decision
validator.** *(Confirmed at the decision gate; impact materially narrowed — see §3.4.)*
`decision.mjs:224-236` compares its digest but no field of it is cross-checked, so a coordinated
content+digest mutation passes `assets:decision` (B1, exit 0). **Correction to R1:** it does **not**
survive `pnpm verify` — `tests/unit/asset-spike.test.ts` and `asset-full-benchmark.test.ts` pin
frozen SHA-256 literals for the evidence files independently of the decision record, and reject it.
The same anchor defeats the coordinated archive-hash mutations (B5/B6), which matters because the
142 MB/64 MB source archives are upstream and not checked in, so no local artifact can anchor them.
Residual: the validator alone is weaker than the chain, and the chain's anchor is a test literal
rather than a validator assertion. *Follow-up:* assert the headline performance figures the gate doc
quotes inside the validator. *Destination:* SBLA-013.

**Minor-3 — the §8.3 license-clarity floor fails open when `scores` is absent.** *(Confirmed;
mitigation now verified — §3.4.)* `decision.mjs:122` evaluates `undefined < 4` → false, so deleting
`scores` passes `assets:decision` (case 34, exit 0). R1's suspected mitigation is **confirmed
effective**: `assets:spike` exits 1 and the unit suite fails, so the chain rejects it (B9). Code
hygiene, chain-level risk mitigated. *Follow-up:* `!(Number(candidate?.scores?.license_clarity) >= 4)`.
*Destination:* SBLA-007.

**Minor-4 — two declarative guardrails carry policy meaning but are unvalidated.** *(Upgraded to
execution-confirmed — cases 32/33, B7/B8.)* `guardrails.generatedAnatomyImagesPermitted` false→true
and `guardrails.requiredAttributionMustShipWithEveryDerivative` true→false each pass **all twelve
stages**, exit 0 — the first would invert an explicit §8.4 publication guardrail. Also unvalidated:
`cost.purchaseArchiveRequired`, `cost.reason`, `baseline2d.rightsBasis/accessibility/checksumStatus`,
`coverage.policy`, `sourceIdentityPolicy`, `license.historicalEmbeddedNotice`, `acceptedRisks`,
`rejectedAlternatives`, `laterTaskBoundaries`, `decisionId`, `recordedOn`. **Both booleans are at
their correct values in the candidate as delivered**; this is a future-regression gap, not a present
defect. *Follow-up:* extend the frozen guardrail check to all six booleans; require non-empty strings
for the policy prose. *Destination:* SBLA-007.

**Minor-5 — the Gate A packet, including the SHA-256 it records, is not machine-checked.**
*(Upgraded to execution-confirmed — B10/B11, §3.4.)* A free-text edit to the decision JSON moves its
hash `98078059…a27` → `38038bb2…cea` while the packet keeps citing the stale value, exit 0; and
rewriting the packet's prose from 23/28 to 28/28 so it contradicts the machine record also passes,
exit 0. The packet is correct today (recomputed in §3.1). *Follow-up:* assert the packet exists and
that the SHA-256 it cites equals the live hash of `anatomy-asset-decision.json`. *Destination:* SBLA-007.

**Minor-6 — root resolution via `URL.pathname` is not percent-decoded.** *(Upgraded to
execution-confirmed — §3.4.)* `decision.mjs:254`. On a checkout path containing a space the four
`readFile` calls miss and the CLI exits 1 with `ENOENT` on the percent-encoded path; the identical
tree at a space-free path exits 0. **Fail-closed** — it cannot mask a bad decision, only break
clean-checkout reproducibility. *Follow-up:* `fileURLToPath(new URL('../..', import.meta.url))`.
*Destination:* SBLA-007.

**Minor-7 — the Account-B review claim records the candidate commit but not its tree.** *(Confirmed
by execution — §3.4.)* The handoff (lines 29-31) says "Its exact commit **and tree** are recorded";
tree `18144129…` appears nowhere in the repository at `d98ad23`. Everything else in the claim is
exactly correct. *Follow-up:* add the tree hash to review claim rows, or drop the "and tree" wording.
*Destination:* SBLA-007 ledger hygiene.

**Minor-8 (new) — no first-party reviewer-executed browser run was possible in this session.**
*(Confirmed environmental, §3.5.)* Chromium cannot bootstrap Mach ports under this sandbox
(`mach_port_rendezvous_mac.cc:159 … Permission denied (1100)`), and the `pnpm` script wrapper cannot
run here either. Acceptance rests on a witnessed exit-0 Codex run in this exact worktree plus
reviewer-executed verification of both assertions over HTTP against the production build. **Not a
candidate defect.** *Follow-up:* run reviewer acceptance for browser-dependent criteria in CI or a
non-sandboxed session so the evidence is first-party. *Destination:* SBLA-007 review-process hygiene.

## 5. Carried forward from R1 (affirmed, not re-litigated)

R1 §5 items 1–8 are accepted. Of these, this round independently re-executed and re-confirmed:
commit/tree identity and ancestry (§3.1); the four evidence digests (§3.1); that no candidate
artifact changed between the candidate and the review base (§3.1); the full verify chain passing on
the exact candidate tree (§3.3 baseline, 12/12, 187 unit + 17 portability tests); and the 23/28
coverage with the exact five gaps, now additionally shown to be tamper-evident under eight distinct
mutations (cases 20-27). R1's finding that all 17 prior reviewer reports are byte-identical is
accepted unchanged; the R1 report itself is intact at blob `b1882efd86fafdf06b05030e6bcf18e233a40d04`
and was not modified by this review.

## 6. Verdict

**PASS — 0 unresolved Critical, 0 unresolved Important, 8 Minor (all non-blocking).**

Both R1 Important findings were review-evidence gaps rather than candidate defects, and both are
closed on real evidence this round. The live DBCLS license page states CC BY 4.0 International,
permits access, redistribution and derivative works with attribution, and carries an attribution
string byte-identical to the repository's — with a page "last updated" date preceding the recorded
access date, excluding the drift risk R1 named. The adversarial battery ran 47 mutations: every
mutation of owner approval, cost, the license quartet, the archive and artifact digests, the 23/28
coverage, each of the five missing target IDs, and each of the four load-bearing guardrails is
rejected; only 4 of 47 survive the full gate, and all four are instances of the two Minor
tamper-coverage gaps R1 had already identified, in fields that are correct in the candidate as
delivered. The one acceptance criterion I could not execute first-party is blocked solely by this
sandbox's inability to launch Chromium, and its entire substance was verified by an independent path.

Gate A is accepted. The eight Minors should go to their named destinations — chiefly SBLA-007, with
Minor-2 to SBLA-013 — and should not gate this task.

*Reviewer note: the sandbox denied writing `reviews/releases/SBLA-006-r2.md` (`Operation not
permitted`). This report is the complete substitute and should be committed to that exact path
verbatim by Codex, which owns commits.*
