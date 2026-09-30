# XLRHandy — Two-model handoff for the body-part directory

This file splits the body-part directory build between two agents so they can
work at the same time **without touching each other's files**:

- **Lane S — Claude Sonnet 5.5** (Claude Code)
- **Lane L — GPT‑6 Luna**

It also covers the owner's few manual steps.

The **how** for every task (exact steps, code shapes, commands, checks) lives in
[`docs/superpowers/plans/2026-09-30-body-part-directory.md`](docs/superpowers/plans/2026-09-30-body-part-directory.md),
called **"the plan"** below. This file decides **who does what, in what order,
and when**. If the two files disagree about who does a task, this file wins. If
they disagree about how to do a task, the plan wins.

---

## 1. Read this first (both models)

1. **Your role.** You hold the **Codex (builder) role** defined in `AGENTS.md`
   ("Codex names a role, not a vendor"). You are **not** Claude Research and
   **not** Claude Review, whatever `CLAUDE.md` says about Claude sessions. You
   may write application code, tests, and scripts within your lane's files.
2. **Owner direction, 2026-09-30.** Body-part pages are general education plus
   automatic PubMed lists. They are outside the claim/evidence pipeline. Do not
   add entries to `docs/runbooks/current-work.md`, do not run `pnpm handoff`,
   and do not request independent review. The handoff for each task is its
   progress note (plan §2.4). ADR 0010, written in task T5, records this.
3. **Read the plan fully**, especially §2 (hard rules and environment), §4
   (file ownership), §7 (writing rules) and §11 (when to stop).
4. **Stay in your lane.** Edit only the files your current task owns. Never
   touch the other model's worktree, branches, or progress notes. If you need
   something outside your lane, write `BLOCKED:` plus the reason in your
   progress note and stop.
5. **Never push, merge, or deploy.** The owner merges.

---

## 2. Who does what

| Order | Lane S — Sonnet 5.5                                                                                        | Lane L — GPT‑6 Luna                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1     | **T1** Split the registry, add the validator, add back-view plate support (plan §5 T1)                     | **T2** Capture the back-view poster (plan §5 T2). Needs a working browser. |
| 2     | —                                                                                                          | **T5** Write ADR 0010 (plan §5 T5)                                         |
| 3     | **T3** Study-list upgrades: 50 per category, filters, show more, relevance test, preview tool (plan §5 T3) | **T4** Homepage body map (plan §5 T4)                                      |
| 4     | **R-chest**                                                                                                | **R-neck**                                                                 |
| 5     | **R-upper-back** (back view)                                                                               | **R-shoulder**                                                             |
| 6     | **R-abdomen-and-core**                                                                                     | **R-elbow**                                                                |
| 7     | **R-thigh**                                                                                                | **R-wrist-and-hand**                                                       |
| 8     | **R-lower-leg**                                                                                            | **R-lower-back** (moves to back view)                                      |
| 9     | —                                                                                                          | **R-hip-and-groin**                                                        |
| 10    | —                                                                                                          | **R-knee**                                                                 |
| 11    | —                                                                                                          | **R-ankle-and-foot**                                                       |
| 12    | —                                                                                                          | **Q1** Integration QA and screenshots (plan §9). Needs a working browser.  |

Lane S has fewer region tasks because its five are brand-new regions with
harder search tuning. Lane L's eight are revisions of existing pages.

**Browser note.** Browsers cannot launch inside the Claude Code sandbox, so
Lane S never gets browser tasks. If Luna's environment cannot launch a browser
either, Luna writes the T2/Q1 scripts, commits them, and marks them
`BLOCKED: needs owner to run <command>` in the progress note. See §6 for the
owner commands.

---

## 3. Gates: when each model may start its next task

A gate opens when the owner has merged the listed branches into
`FrankieBiz/body-parts-atlas`. Check a gate yourself before starting a task:

```bash
git log FrankieBiz/body-parts-atlas --oneline --merges | grep -E "bp/(T1|T2|T5)"
```

Replace the task ids with the ones your gate needs.

| Gate   | Opens when merged            | Unlocks                                                                                                                                                                 |
| ------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **G0** | T0 (owner's baseline commit) | S: T1 · L: T2, then T5                                                                                                                                                  |
| **G½** | T2                           | S: step T1.7 (back poster import). Do T1.1–T1.6 and T1.8–T1.9 first. If T2 is still not merged when you reach T1.7, write `WAITING: T2` in your progress note and stop. |
| **G1** | T1, T2, T5                   | S: T3 · L: T4                                                                                                                                                           |
| **G2** | T3, T4                       | Both lanes: all R tasks, in the order in §2                                                                                                                             |
| **G3** | All 13 R tasks               | L: Q1                                                                                                                                                                   |

**While waiting at a gate:** you may draft overview text for **your own**
regions only in `docs/superpowers/plans/body-parts/drafts/<slug>.md`. Follow
plan §6 and §7. These drafts are yours alone; copy the text into the region
file when that R task starts. Do not start any other task early.

---

## 4. Workspace setup (one worktree per model)

The owner creates one worktree per model once, after G0 (§6). Each model
then stays in its own worktree and makes a fresh branch per task.

| Lane | Worktree path                                                           |
| ---- | ----------------------------------------------------------------------- |
| S    | `/Users/frankbisignano/orca/workspaces/science-lifting-atlas/bp-sonnet` |
| L    | `/Users/frankbisignano/orca/workspaces/science-lifting-atlas/bp-luna`   |

Start each new task from the current integration branch:

```bash
git switch -c bp/<task-id> FrankieBiz/body-parts-atlas
export PATH=/private/tmp/claude-501/node-v24.20.0-darwin-arm64/bin:$PATH   # Node 24.20.0 (plan §2.2)
node --version                                                            # must print v24.20.0
pnpm install --frozen-lockfile --store-dir "$TMPDIR/pnpm-store"
ls -a | grep -q pnpm-store && rm -rf .pnpm-store                          # never keep a store in the worktree
```

Finish each task like this:

```bash
pnpm format && pnpm verify           # must exit 0
git add <only your owned files> && git commit -m "<conventional message>"
# write docs/superpowers/plans/body-parts/progress/<task-id>.md (plan §2.4 template), commit it
```

Then tell the owner: `<task-id> ready to merge: bp/<task-id> @ <short hash>`.

---

## 5. Collision map: shared files, and who may touch them when

Every file not listed here belongs to exactly one task (plan §4). These are
the only places the lanes come close:

| File                                                       | Lane S touches it                                                                    | Lane L touches it                                                                                      | Why it's safe                                                                        |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `package.json`                                             | T3: `studies:fetch`, `studies:preview` script lines                                  | T2: `assets:capture-posters` line (phase 0). Q1: `qa:screens` line (phase 4)                           | Different phases, one line each. **Never reformat or reorder** other lines.          |
| `src/data/body-parts/regions/*.ts` (existing 8)            | T1 creates them. T3 may edit **only `mustMatch` lines** if the relevance test fails  | T4 may edit **only `hotspots` coordinates** if the spacing test fails. Then R tasks own their files    | T3 and T4 run together but edit different lines. The owner merges T3 first, then T4. |
| `src/data/body-parts/regions/<new 5>.ts`                   | T1 creates stubs. R tasks fill chest, upper-back, abdomen-and-core, thigh, lower-leg | —                                                                                                      | Lane L never opens these.                                                            |
| `src/data/studies/*.json`                                  | T3 regenerates all published. S's R tasks regenerate only their own slug             | L's R tasks regenerate only their own slug (`pnpm studies:fetch <slug>`)                               | **Always pass your slug.** Never run a bare `pnpm studies:fetch` in phase 3.         |
| `src/pages/index.astro`                                    | never                                                                                | T4: the `#body-parts` section only                                                                     | —                                                                                    |
| `src/pages/body/[part].astro`, `src/styles/body-parts.css` | T3 only                                                                              | never (T4 uses its own `src/styles/body-map.css`)                                                      | —                                                                                    |
| `src/components/body-parts/RegionPlate.astro`              | T1 only                                                                              | never                                                                                                  | —                                                                                    |
| `src/components/sbla-013/AnatomyExplorer.astro`            | T1: import path only, if it changes                                                  | never                                                                                                  | —                                                                                    |
| `tests/unit/studies.test.ts`                               | T1, then T3                                                                          | never                                                                                                  | —                                                                                    |
| `tests/e2e/body-parts.spec.ts`                             | T3                                                                                   | never (Q1 writes `tests/e2e/body-parts-all.spec.ts`)                                                   | —                                                                                    |
| `docs/superpowers/plans/body-parts/progress/`              | one file per S task                                                                  | one file per L task                                                                                    | Separate files, one per task.                                                        |
| `docs/superpowers/plans/body-parts/drafts/`                | `chest`, `upper-back`, `abdomen-and-core`, `thigh`, `lower-leg`                      | `neck`, `shoulder`, `elbow`, `wrist-and-hand`, `lower-back`, `hip-and-groin`, `knee`, `ankle-and-foot` | Separate files, one per region.                                                      |
| `AGENTS.md`, `docs/adr/**`                                 | never                                                                                | T5 only                                                                                                | —                                                                                    |

**Region-to-region rules in phase 3:**

- **Hotspot spacing** (plan §T4.2 test: 44 px apart at 320 px). If moving
  your hotspot makes the test fail against the **other lane's** region, move
  your own hotspot, never theirs. If you cannot, write `BLOCKED` and name the
  pair.
- **Query overlap.** The plan already assigns which region owns which topic
  (e.g. thigh owns quad/hamstring training, knee drops them; lower-leg owns
  calf training, ankle-and-foot drops it). Follow plan §6 exactly. Knee and
  ankle-and-foot (Lane L) must make those removals so Lane S's thigh and
  lower-leg don't duplicate them.

---

## 6. Owner checklist

1. **G0 — baseline.** Commit the current work on `FrankieBiz/body-parts-atlas`
   (plan T0), for example by asking the session that built it: "commit the
   body-part work and the plan." Then create the two worktrees:
   ```bash
   cd /Users/frankbisignano/orca/science-lifting-atlas
   git worktree add -b bp/T1 ../workspaces/science-lifting-atlas/bp-sonnet FrankieBiz/body-parts-atlas
   git worktree add -b bp/T2 ../workspaces/science-lifting-atlas/bp-luna   FrankieBiz/body-parts-atlas
   ```
   Open Sonnet in `bp-sonnet` and Luna in `bp-luna`, and paste their prompts from §7.
2. **Merging** (when a model reports "ready to merge"). In the `mackerel` worktree:
   ```bash
   git switch FrankieBiz/body-parts-atlas
   git diff FrankieBiz/body-parts-atlas...bp/<task-id> --stat   # glance at what changed
   git merge --no-ff bp/<task-id> -m "Merge branch 'bp/<task-id>'"
   export PATH=/private/tmp/claude-501/node-v24.20.0-darwin-arm64/bin:$PATH && pnpm verify
   ```
   Keep the merge message exactly `Merge branch 'bp/<task-id>'`; the gate
   check in §3 searches for it. Merge order inside a gate does not matter,
   **except T3 before T4**.
3. **Browser steps**, if a model reports it cannot run them. Run these in a
   normal terminal:
   ```bash
   pnpm build && (pnpm preview --host 127.0.0.1 --port 4321 &) && sleep 3
   pnpm assets:capture-posters     # T2
   pnpm test:e2e                   # any task's browser tests
   pnpm qa:screens                 # Q1, screenshots land in test-results/screens/
   ```
4. **Read each region page** once its R task is merged (`pnpm dev`, then
   open `/body/<slug>/`). This is the only human review.
5. **Deploy** when Q1 passes and you like the screenshots. Models never deploy.

---

## 7. Paste-ready kickoff prompts

### For Claude Sonnet 5.5 (run in `bp-sonnet`)

> You are Lane S in `XLRHandy.md` at the repository root. Read `XLRHandy.md`
> completely, then `docs/superpowers/plans/2026-09-30-body-part-directory.md`
> completely. You hold the Codex (builder) role from `AGENTS.md`, not Claude
> Research or Claude Review. You may write code within your lane's files. Do
> your lane's tasks in order: T1, T3, R-chest, R-upper-back,
> R-abdomen-and-core, R-thigh, R-lower-leg. Before each task, check its gate
> (XLRHandy §3). If the gate is closed, stop and say which gate you are waiting
> for. Edit only the files your current task owns (plan §4, XLRHandy §5).
> Finish each task with `pnpm format && pnpm verify`, a commit on
> `bp/<task-id>`, and a progress note. Then report "`<task-id>` ready to merge"
> and stop. Never push, merge, deploy, or edit the other lane's files. If
> anything in plan §11 happens, write BLOCKED in the progress note and stop.

### For GPT‑6 Luna (run in `bp-luna`)

> You are Lane L in `XLRHandy.md` at the repository root. Read `XLRHandy.md`
> completely, then `docs/superpowers/plans/2026-09-30-body-part-directory.md`
> completely. You hold the Codex (builder) role from `AGENTS.md`. Owner
> direction dated 2026-09-30 puts this work outside the claim pipeline: no
> `current-work.md` entries, no `pnpm handoff`, no review requests. Do your
> lane's tasks in order: T2, T5, T4, R-neck, R-shoulder, R-elbow,
> R-wrist-and-hand, R-lower-back, R-hip-and-groin, R-knee, R-ankle-and-foot,
> Q1. Before each task, check its gate (XLRHandy §3). If the gate is closed,
> you may only draft text for your own regions in
> `docs/superpowers/plans/body-parts/drafts/<slug>.md`. Edit only the files
> your current task owns (plan §4, XLRHandy §5). Finish each task with
> `pnpm format && pnpm verify`, a commit on `bp/<task-id>`, and a progress
> note. Then report "`<task-id>` ready to merge" and stop. If you cannot
> launch a browser for T2 or Q1, commit the script and mark the task
> `BLOCKED: needs owner to run <command>`. Never push, merge, deploy, or edit
> the other lane's files.

---

## 8. Done

The whole job is done when the plan's §10 checklist is met. That means all
13 regions, the body map, green checks, a progress note for every task, and
your sign-off.
