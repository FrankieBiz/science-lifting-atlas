# Evidence review: SBLA-008 vertical-slice scope, round 3 (complete-artifact recheck)

**Task:** SBLA-008 — Vertical-slice research questions, PICO/PECO, search strings, inclusion and
exclusion plan. Round 3 recheck of the complete remediated artifact, per the CLAUDE.md stop rule
("After FAIL, one bounded remediation is followed by one complete-artifact recheck").
**Reviewer role:** Claude Review (Account B), independent adversarial evidence review, round 3.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). Fresh review
session. I did not author, remediate, or contribute to any SBLA-008 candidate, and I received none of
the authoring role's reasoning beyond the committed artifacts (§9.10).
**Review date:** 2026-09-13
**Reviewer worktree:** `C:\src\s008r3`
**Reviewer branch:** `claude-review/SBLA-008-r3`
**Reviewer write path:** `reviews/evidence/SBLA-008-r3.md` (sole permitted path; nothing else written)

**Reviewed candidate commit:** `d1a77071e0a794c537c24e4b30bfcf3b1016063e` _(immutable)_
**Reviewed candidate tree:** `6e2506553a92ab78068afd23940cce5ec23d61fa` _(immutable)_
**Candidate parent:** `383b63244aabb19404046dbd4a5aeb1589175346` _("fix: remediate SBLA-008 evidence
review R1" — the immutable round-2 candidate that R2 failed)_
**Review coordination claim:** `6d8b7d45d2073838e29a0cb7344503336b941eec` on branch
`codex/SBLA-007-review-coordination` _(verified as a Git object; contents verified — see §2.3)_
**Prior rounds:** `reviews/evidence/SBLA-008-r1.md` FAIL, 0 Critical / 2 Important / 5 Minor;
`reviews/evidence/SBLA-008-r2.md` FAIL, 0 Critical / 2 Important / 5 Minor

Reviewed file blobs and SHA-256 checksums, recomputed in this session at the candidate commit:

- `research/questions/SBLA-008-vertical-slice.md` — blob `62067b94b0fbaf64afa124316ef352b5b37fb920`,
  SHA-256 `17f8e5acf2bcf08f2e2efa76d68f9618b2e1964d508aaeab86317bee7762eb22`, 435 lines
- `research/searches/SBLA-008-search-strategy.md` — blob `8ae5e937c30cfe37dc0f95c931627537298bca07`,
  SHA-256 `7e0629d57425fb85e5fd9da88f5cb71e544d7b531f61e5a9da870efba0bfdcf3`, 1,090 lines
- `research/screening/SBLA-008-eligibility-plan.md` — blob `88c220224d8859758bd7fa7a9dafb57df3a1d16c`,
  SHA-256 `5fc3363e933e1855cf77596dd3576e5356773749eab31e45d225aa147d78560c`, 623 lines
- `research/packets/SBLA-008-handoff.md` — blob `cff403c8afd7c192e9c72159bc39fc227b9cdb91`,
  SHA-256 `f50461376a29b41be2ca2fc5ea74c165394d897aa6e6f197ee3ebf995d7bf6bb`, 1,287 lines

Immutable prior reports as they stand: R1 at the candidate commit — blob
`9db00fdc07e575ad9c45d02b2796d68cb622b84d`, SHA-256
`0cd5aaa37769a9458b48343d4aa4487b45c4371540e46e30241f44882546376d`, 772 lines, byte-unchanged from
`eefefd20`. R2 at `bf7e5bb70f4f3948597bd90b84f76d9515d55f87` — blob
`894a952711bfca2edfa1649db76b7851e91eae67`, SHA-256
`dd19898f0ebde216bc48761f402980d33063592b37baddb140579d90b3730b18`, 1,038 lines. Neither is present
in this branch's diff and neither was modified.

---

## Verdict

**Verdict: PASS.**
**Critical: 0 · Important: 0 · Minor: 2 new · Out-of-scope observation routed to Codex: 1**

PASS requires zero Critical and zero Important findings (CLAUDE.md review stop rule; AGENTS.md;
`operating-policy.json` `passRequiresZeroCritical` and `passRequiresZeroImportant`). No Critical or
Important finding stands against this candidate.

**Both R2 Important findings are closed, and closed by verification rather than by assertion.**

- **I-3 — closed.** Every external claim the remediation added is reproducible, and I reproduced all
  of them, most to the exact integer. The S2 GET URL measures **4,137** characters and returns
  **HTTP 414** with `Server: Apache` and a zero-length body; the same string by **POST** returns
  **HTTP 200**, `count` 0, `errorlist.fieldsnotfound` `[]`, `warninglist.quotedphrasesnotfound` `[]`,
  `errorlist.phrasesnotfound` `["zzzqqqnonsenseanchor"]`, and **all eight M-3 forms verbatim as
  `[tiab:~0]` phrases in `querytranslation`**. The measured GET boundary reproduces byte-exactly at
  **4,121 → 200 / 4,122 → 414**, the fixed prefix is **96** characters and the encoded `term` budget
  at the boundary is **4,025**, all three exactly as §5.0 states. The per-string GET URL table
  reproduces for all six strings with no deviation. The `esearchresult` returned by POST is
  **byte-identical** to the one returned by GET for S1, `querytranslation` included. The NCBI
  documentation locator is accurate and its quoted sentence is verbatim. The §9 failure matrix has
  the HTTP 414 row with the diagnostic, POST as the fallback, and an explicit prohibition on trimming
  or silently splitting. **No term was trimmed to make S2 fit**: all ten fenced query strings are
  byte-identical to the failed candidate, and S2's tagged-term set is a strict superset of the
  pre-remediation one.
- **I-4 — closed.** Every identity the handoff asserts about itself and its siblings reproduces: both
  changed-file line counts (1,090 and 1,287) and both prior counts (969 and 790), all four blob IDs
  at the parent, both unchanged files' SHA-256 sums, the R1 and R2 report blobs and checksums, the
  parent and tree, the two-path boundary, and the ledger claim `f910736d…` and its recorded contents.
  Every SHA-256 written in the handoff resolves to the file it names. The handoff records **no**
  checksum for the two files it changed and says plainly why, which is the correct handling rather
  than a gap. Criteria 1, 2, 12 and 13 now describe round 3; criterion 2 — the one R2 found simply
  false — is now correct.

**All seven R1 findings remain closed.** I re-tested each against the current files rather than
against the author's closure map or R2's, and every one holds.

**The two Minor findings below are new and neither is material to acceptance.** Both are arithmetic
or enumeration slips in the handoff's summary prose, sitting beside complete and correct enumerations
in the same sentence or the same file. I record them because R2's I-4 established that this
document's summary layer drifting from its body is the recurring failure mode here, and because one
of them — a declared-item count of "thirty-three" against an actual and correctly enumerated **31** —
has now been repeated by the handoff and by both prior review reports without anyone recounting.
Neither changes what a reader must check, neither omits an item, and neither is of the kind CLAUDE.md
makes blocking.

**Four of R2's five Minor findings remain open, deliberately and with their impact and destination
recorded**, which `operating-policy.json` `minorFindingsMayBeDeferredWhenNonblocking` permits and
CLAUDE.md conditions on exactly that record existing. I re-tested the factual basis of each and
confirmed all four; none has grown into an Important finding, and I decline to promote any of them
without evidence of acceptance impact that I did not find. M-6 is closed in the one file this round
owned and openly declared still-open in the two it did not.

I ran the full repository gate myself: **`pnpm verify` exit 0** under the pinned runtime, 234 unit
tests and 17 portability tests passing, every gate green.

This report is append-only and is never edited.

---

## 1. What this review is, and what it deliberately is not

This is the `scope`-stage complete-artifact recheck for SBLA-008 (§9.8 step 1). SBLA-009 owns
`search` onward.

**I reviewed the complete artifact, not the two-file diff.** I read all four research files in full
at the candidate commit, `reviews/evidence/SBLA-008-r1.md` and `reviews/evidence/SBLA-008-r2.md` in
full, `CLAUDE.md`, `AGENTS.md`, `docs/product/master-plan.md`, `docs/runbooks/operating-policy.json`,
`docs/runbooks/current-work.md` as committed on the coordination branch,
`src/lib/content/schemas.ts`, `scripts/content/validate.mjs`, `.prettierrc.mjs` and
`.prettierignore`. The diff was used only to establish provenance and to locate what round 3 changed.

**I did not execute the planned SBLA-009 evidence review.** I collected no identifier, opened no
record, screened nothing, and cite no study. No statement in this report is a scientific finding
about anatomy, exercise, or training.

**I did not repair the artifact** (CLAUDE.md). Every finding below returns to the authoring role.

**Boundary discipline on my own external calls.** Every PubMed composite I submitted carried the
documented nonsense zero-yield anchor `AND zzzqqqnonsenseanchor[tiab]` (search strategy §5.0), so the
platform parsed the whole string while the count was structurally zero. **I observed no
question-level yield at any point.** I did not call Europe PMC at all, anchored or otherwise, so I
ran no composite on the one route where a question-level count already exists. Where I needed to
size the URI-length boundary I used a single padded nonsense token — `zzz` followed by a run of `q`
and `[tiab]` — with no topical content whatsoever.

**Cochrane access.** I did not substitute a user agent, send credentials, crawl, or follow links. I
sent exactly one plain request per client with that client's own default `User-Agent` and report
exactly what each returned (§5.4).

---

## 2. Methods and reproduction

### 2.1 Environment

- Repository worktree `C:\src\s008r3` at the candidate commit, working tree clean at the start of
  this session.
- Node on `PATH` is `v24.14.0`, below the `>=24.20.0 <25` engine floor, and `pnpm` is not on `PATH`.
  The pinned runtime is available on this host: Node `v24.20.0` via `fnm`
  (`~/AppData/Roaming/fnm/node-versions/v24.20.0/installation`) and pnpm `11.24.0` via `corepack`. I
  put the pinned toolchain on `PATH` explicitly and **did** run the full repository gate.
- External calls were made with Node's `fetch` (undici) and with `curl 8.19.0`, throttled to stay
  under the unkeyed E-utilities limit of three requests per second. No NCBI API key was used or
  needed.

### 2.2 Repository checks, all run by me

| Check                   | Command, exactly as run                                                      | Result                                                                           |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Candidate commit        | `git rev-parse HEAD`                                                         | `d1a77071e0a794c537c24e4b30bfcf3b1016063e`                                       |
| Candidate tree          | `git rev-parse HEAD^{tree}`                                                  | `6e2506553a92ab78068afd23940cce5ec23d61fa`                                       |
| Candidate parent        | `git rev-parse HEAD^`                                                        | `383b63244aabb19404046dbd4a5aeb1589175346`                                       |
| Boundary                | `git diff --name-status 383b632 HEAD`                                        | **Exactly two entries, both `M`**, both the claimed research paths. Nothing else |
| Diff size               | `git diff --shortstat 383b632 HEAD`                                          | `2 files changed, 770 insertions(+), 152 deletions(-)`                           |
| Whitespace              | `git diff --check 383b632 HEAD`                                              | No output, **exit 0**                                                            |
| Unowned files untouched | `git diff --name-only 383b632 HEAD -- research/questions research/screening` | Empty — both byte-identical to the reviewed candidate                            |
| Install                 | `corepack pnpm install --frozen-lockfile`                                    | Pass, "Done in 6.2s using pnpm v11.24.0"; `pnpm-lock.yaml` unchanged             |
| **Full gate**           | `corepack pnpm verify` under Node 24.20.0                                    | **Pass, exit 0** — see §6.1                                                      |
| Checksums               | `sha256sum` on the four files and both prior reports                         | Recorded in the header block above                                               |
| R1 report immutability  | `git diff eefefd2 HEAD -- reviews/evidence/SBLA-008-r1.md`                   | Empty — byte-unchanged                                                           |
| R1 formatting edit      | `git diff --word-diff --ignore-all-space 5d51959 eefefd2`                    | Empty — whitespace-only, as R2 also found                                        |
| Query strings unchanged | Node extraction of every fenced `text` block at both commits                 | **All ten byte-identical** to the reviewed candidate                             |
| Line counts             | `wc -l` on the four paths                                                    | 435 / 1,090 / 623 / 1,287 — matching the handoff's own stated values exactly     |

**Independence caveat, stated because CLAUDE.md requires it.** I ran `pnpm verify` from my own
mutable role branch. Per CLAUDE.md that is **not** admissible as independent role-path boundary
evidence; the boundary result must come from Codex or CI executing
`scripts/foundation/check-role-paths.mjs` from a trusted checkout with `--repository`. That evidence
exists and I did not produce it: the coordination commit `6d8b7d45…` records Codex's own full
`pnpm verify` on this exact commit under Node 24.20.0 and pnpm 11.24.0 — 234 unit tests, 17
portability tests, all gates — and that "The trusted Claude Research path boundary, committed-range
whitespace, and targeted Prettier check pass." My run corroborates the repository gate; Codex's run
is the boundary evidence. The candidate itself states this correctly in criterion 1 and in its
_Tests/checks_ independence note, and does not claim otherwise.

### 2.3 The external coordination claim, verified

`git cat-file -t 6d8b7d45…` returns `commit`, and `git rev-parse codex/SBLA-007-review-coordination`
resolves to `6d8b7d45d2073838e29a0cb7344503336b941eec`, so the claim is the branch head. Its subject
is "docs: open SBLA-008 R3 review"; it changes exactly one file, `docs/runbooks/current-work.md`.
Row 34 of its active-claims table records:

| Field            | Recorded value                             | Matches my assignment |
| ---------------- | ------------------------------------------ | --------------------- |
| Task             | SBLA-008 evidence review R3 full recheck   | Yes                   |
| Role             | Claude Review (account B)                  | Yes                   |
| Branch           | `claude-review/SBLA-008-r3`                | Yes                   |
| Worktree         | `C:\src\s008r3`                            | Yes                   |
| Base commit      | `d1a77071e0a794c537c24e4b30bfcf3b1016063e` | Yes                   |
| Started          | 2026-09-12 20:38 EDT                       | —                     |
| Expected handoff | `reviews/evidence/SBLA-008-r3.md`          | Yes                   |
| Paths owned      | `reviews/evidence/SBLA-008-r3.md`          | Yes — exactly one     |

The same commit closes the Account-A round-3 remediation claim and records its result, naming commit
`d1a77071…`, tree `6e250655…`, "parent exactly the failed R2 candidate", and "changes only the two
claimed research files". The claim is `exact-append-only-report-path` scoped, as
`operating-policy.json` requires, and it was recorded by Codex on the coordination branch, not by me.
I did not edit the ledger and cannot.

One value in that closure record is wrong. It is Codex's artifact, not the candidate's, so it is an
out-of-scope observation and not a finding — see §12.1.

### 2.4 What I could not reproduce, and therefore carry as unverified

- **Europe PMC, every route claim.** I made no call to Europe PMC in this session, by choice: the
  only question-level yield figure that exists in this task is a Europe PMC composite count, and the
  instruction governing this review is to observe none. The amended E1 string is therefore still
  confirmed by nobody but its author, exactly as at the end of R2, and **M-7 remains unquantified**.
- **Cochrane CENTRAL's retrieval behaviour.** I re-observed the help page's access behaviour (§5.4)
  but did not enter a Search Manager session and did not verify that CENTRAL behaves as its help page
  documents. SU9's execution-time instruction stands.
- **PROSPERO and SportRxiv query syntax** (SU1, SU2), and **FIPAT** (U1/SU3). Not re-tested; the
  candidate already carries all three as unverified, so re-testing could not change a verdict.
- **The role-path boundary checker with `--repository`** (§2.2).

---

## 3. Closure of R2 finding I-3 — the S2 transport defect

R2 required five things. I checked each against the committed file and then tested the file's
instructions against the live endpoint.

| What R2 required                                                                | Where it landed                             | Verified                                                                                             |
| ------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Record the E-utilities `POST` form as the required transport above ~3,700 chars | §5.0, third execution path + transport rule | **Yes** — full spec: endpoint, method, `application/x-www-form-urlencoded`, and the four body fields |
| Name which strings are affected                                                 | §5.0 per-string table; §5.2                 | **Yes** — S2 only, and the rule is stated as a measurement, not a list of names                      |
| Add an HTTP 414 row to the §9 failure matrix with POST as its fallback          | §9, row `PubMed API, GET transport`         | **Yes** — with the diagnostic and the prohibition on trimming or silent splitting                    |
| State in §5.2 which transport produced the recorded S2 result                   | §5.2 transport table                        | **Yes** — named as POST, with both transports' responses tabulated                                   |
| Soften "two equivalent execution paths"                                         | §5.0 opening                                | **Yes** — the equivalence claim is withdrawn in terms, with the reason given                         |

### 3.1 The POST transport, executed exactly as §5.0 specifies

I took the S2 string verbatim from the committed §5.2 fenced block, collapsed internal newlines to
single spaces, appended the §5.0 anchor, and sent it to
`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` by `POST` with
`Content-Type: application/x-www-form-urlencoded` and a form body of `db=pubmed`, `retmode=json`,
`retmax=0`, `term=<query>` — the four fields the file names, and nothing else.

```
S2 POST: 200 OK
  count                              0
  errorlist.fieldsnotfound           []
  warninglist.quotedphrasesnotfound  []
  errorlist.phrasesnotfound          ["zzzqqqnonsenseanchor"]
  POST body                          3,676 bytes
```

Every assertion in the §5.2 table reproduces, including the body size of **3,676 bytes** to the byte.
All eight M-3 forms appear verbatim as `[tiab:~0]` phrases in the returned `querytranslation`:
`"pectoral fly"[tiab:~0]`, `"pectoral flies"[tiab:~0]`, `"pectoral flye"[tiab:~0]`,
`"pectoral flyes"[tiab:~0]`, `"pec fly"[tiab:~0]`, `"pec flies"[tiab:~0]`, `"pec flye"[tiab:~0]`,
`"pec flyes"[tiab:~0]`. The file's phrasing — "verbatim as `[tiab:~0]` phrases" — is literally
accurate: because every term in the string is explicitly tagged, PubMed echoes the submitted term
back unmodified rather than rewriting the tags into `[Title/Abstract:~0]` form.

### 3.2 GET 414 handling, and the transport rule, tested as written

Built the GET URL first and measured it, as §5.0 directs. All six strings, both transports, anchored:

| String | GET URL chars — §5.0 states | GET URL chars — I measured | GET     | POST    |
| ------ | --------------------------: | -------------------------: | ------- | ------- |
| S1     |                       2,973 |                  **2,973** | 200     | 200     |
| **S2** |                   **4,137** |                  **4,137** | **414** | **200** |
| S3     |                       2,319 |                  **2,319** | 200     | 200     |
| S4     |                       1,905 |                  **1,905** | 200     | 200     |
| S5     |                       1,008 |                  **1,008** | 200     | 200     |
| S6     |                         714 |                    **714** | 200     | 200     |

Six of six match exactly. The S2 GET response is `HTTP 414 Request-URI Too Long`, `Server: Apache`,
body length **0** — identical to what §5.2 and §9 record, and confirming that the response carries no
diagnostic of its own, which is precisely why the §9 row's "diagnose it by the status code alone" is
the right instruction. Under POST, all six return 200 with empty `fieldsnotfound` and empty
`quotedphrasesnotfound`, so the transport rule selects a working path for every string in the file.

The rule is deterministic and I could apply it mechanically without judgement: measure, compare
against 3,700, and for S2 use POST unconditionally. A URL built to exactly 3,700 characters returns
**HTTP 200**, so the operating threshold is genuinely below the live boundary, as §5.0 claims.

### 3.3 The measured boundary, reproduced byte-exactly with nonsense tokens

Synthetic probe: `term` = `zzz` + a run of `q` + `[tiab]`, length tuned to hit each target URL length
exactly. No topical term, no yield.

| Full GET URL characters | Encoded `term` | Observed                                   |
| ----------------------: | -------------: | ------------------------------------------ |
|                   3,700 |          3,604 | HTTP 200 OK                                |
|                   4,120 |          4,024 | HTTP 200 OK                                |
|               **4,121** |      **4,025** | **HTTP 200 OK**                            |
|               **4,122** |      **4,026** | **HTTP 414 Request-URI Too Long**, 0 bytes |
|                   4,123 |          4,027 | HTTP 414 Request-URI Too Long, 0 bytes     |
|                   4,137 |          4,041 | HTTP 414 Request-URI Too Long, 0 bytes     |

§5.0's three figures — **4,121 passing, 4,122 failing, and an encoded `term` budget of 4,025 at the
boundary** — all reproduce exactly. The fixed prefix
`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=`
measures **96** characters, again exactly as stated. R2 could bound this only to a 3,680–4,490 window
and said so; the candidate has narrowed it to one character and labelled it correctly as its own
observation rather than a published NCBI figure.

The pre-remediation comparison also reproduces. Extracting S2 from `56068c22` and anchoring it the
same way gives **3,803** characters and **HTTP 200** on GET — the exact before-figure §5.0 records,
which the file is right to call its own re-measurement rather than a number borrowed from the review.

### 3.4 `querytranslation` is preserved, and nothing is trimmed

Two separate claims, both load-bearing, both tested.

**Transport equivalence.** For S1 — short enough for both transports — the entire `esearchresult`
object returned by POST is **byte-identical** to the one returned by GET, 2,293 bytes each,
`querytranslation` included. §5.0's "POST is therefore a transport substitute and not a different
query" is verified, not asserted. The mandatory `querytranslation` is therefore obtainable for every
string in the file, S2 included, which is exactly what R2 said the earlier draft could not deliver.

**No silent term trimming.** For all six strings the returned `querytranslation` is byte-identical to
the submitted term, character for character (1,911 / 2,603 / 1,425 / 1,191 / 602 / 400). PubMed
rewrote nothing and dropped nothing. Across commits:

- All **ten** fenced query strings in the search strategy — S1–S6, E1, C1 and both T1 blocks — are
  **byte-identical** between the failed candidate `383b632` and this candidate. Round 3 changed how
  the strings are executed and recorded and did not touch what they retrieve, exactly as _Work
  completed_ §4 claims.
- S2's tagged-term set at this candidate contains **96** terms and is a strict superset of the
  pre-remediation **88**; zero terms present at `56068c2` or at `383b632` are missing now.

This is the right resolution of I-3 and the one D14 defends: the reviewer-mandated M-3 and M-4 terms
were kept and the transport was documented, rather than the terms being trimmed to fit a URL limit.
All ten fenced blocks are also structurally balanced — parentheses net 0, brackets net 0, even quote
count in every one — reproducing the candidate's own recorded integrity check.

### 3.5 The NCBI documentation locator, checked

`https://www.ncbi.nlm.nih.gov/books/NBK25499/` returns **HTTP 200**. Under ESearch → Required
Parameters → `term`, the page reads:

> Entrez text query. All special characters must be URL encoded. Spaces may be replaced by '+' signs.
> For very long queries (more than several hundred characters long), consider using an HTTP POST
> call.

§5.0's quotation — "consider using an HTTP POST call" — is verbatim, its paraphrase of the condition
is faithful, and the locator (_Entrez Programming Utilities Help_, NBK25499, ESearch `term`) is
correct. R2 explicitly left this unchecked in its own §11.6; it checks out.

### 3.6 Adversarial reading of the §9 row

R2's stated falsification test was whether the §9 row "would stop a reasonable executor from trimming
S2 when they meet a 414". Reading the row as an executor with only the committed files: it names the
status code and the empty body, says outright that this is "a transport failure, not a parse failure,
and the string is not malformed", gives the diagnosis rule, directs re-sending the identical query by
POST, and states "**Never trim terms, split the string silently, or drop the search**" with the
reason that trimming "would undo the M-3 and M-4 term additions and change what the query retrieves".
It closes the last escape by requiring "not executed" rather than zero results if POST also fails,
and it states that `querytranslation` from the POST response satisfies §8.3 in full and remains
mandatory. Each of the three wrong reactions R2 identified is named and forbidden. **I-3 is closed.**

---

## 4. Closure of R2 finding I-4 — the handoff's provenance and self-description

R2's complaint was that the handoff's tail described round 1 while its body described round 2, across
eight stale statements in three required sections. I checked every factual assertion the handoff now
makes about itself against Git.

### 4.1 Rounds, parents, and claims

| Handoff assertion                                                                                                                                                            | Verified                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Lineage table: three rounds, `56068c22` / `383b632` / this commit                                                                                                            | Correct; each commit resolves and carries the stated subject          |
| This commit's parent is `383b63244aabb19404046dbd4a5aeb1589175346`                                                                                                           | `git rev-parse HEAD^` — **exact match**                               |
| Parent tree `975f154a164aa6779107c1b9f7ad4e820ba46793`                                                                                                                       | **Exact match**                                                       |
| Round-1 base `0752d502…`, round-2 base `2de2a3ef…`, recorded as lineage only                                                                                                 | Both correct; neither is claimed as this commit's parent              |
| Round-3 ledger claim `f910736d6dcf2791956e988205983a8a7a69bcef`                                                                                                              | Exists; subject "docs: correct SBLA-008 R2 remediation base"          |
| That claim records branch `claude-research/SBLA-008-r2-remediation-v2`, worktree `C:\src\s008fix3`, base `383b632…`, start 2026-09-12 20:08 EDT, and exactly two owned paths | **Every field matches** the row I read at that commit                 |
| Earlier claims `09f9ba4c…` and `247096a7…` cover the earlier commits                                                                                                         | Both exist; correctly excluded from gating this commit                |
| R2 report at `bf7e5bb7`, blob `894a9527…`, SHA-256 `dd19898f…`, 1,038 lines                                                                                                  | **All four exact**                                                    |
| R1 report blob `9db00fdc…`, SHA-256 `0cd5aaa3…`, 772 lines, byte-identical to `eefefd20`                                                                                     | **All four exact**                                                    |
| History is linear; no merge, rebase or force-push; coordination branch not merged in                                                                                         | Parent is a single commit; the coordination branch is not an ancestor |

Criterion 2 — the criterion R2 found "simply false" — now names the correct parent and the correct
parent tree, and applying it literally now **passes**.

### 4.2 "Files created or modified", checked line by line

| Handoff assertion                                            | Verified                                                                   |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Round 3: 0 created, **2 modified**, 0 deleted, 0 renamed     | `git diff --name-status` → exactly two `M` entries, both under `research/` |
| The other two research files are byte-identical to `383b632` | `git diff` on those paths is **empty**                                     |
| `wc -l` on the handoff "must print **1,287**"                | Prints **1,287**                                                           |
| `wc -l` on the search strategy "must print **1,090**"        | Prints **1,090**                                                           |
| Search strategy 969 → 1,090; handoff 790 → 1,287             | Both prior counts exact at `383b632`                                       |
| Blob at `383b632` for each of the four paths                 | `62067b94…`, `e433130d…`, `88c22022…`, `75423c47…` — **all four exact**    |
| SHA-256 of the two unchanged files                           | `17f8e5ac…` and `5fc3363e…` — **both exact**                               |
| Commit-lineage table, four rows                              | Every commit resolves with the stated subject and role                     |

**Every SHA-256 written anywhere in the handoff resolves to the file it names.** I extracted all
64-hex strings from the document and matched each against the candidate files and the two prior
reports; there are four, and all four are correct with no orphans.

The handoff records **no** SHA-256 and no blob ID for the two files it changed, and explains why: "a
file cannot contain its own hash — so those cells are left for Codex to record at verification time,
and everything that _can_ be pinned now is pinned now." That is the correct handling of a genuine
constraint, and it is paired with an explicit `git` recipe a reviewer can run instead. The line
counts, which _are_ stable under an idempotent formatter, are written and are correct. I ran the
document's own falsification instruction — "If either disagrees, the file was edited after this
section was written and the discrepancy is itself the finding" — and neither disagrees.

### 4.3 The three criteria R2 failed

- **Criterion 1** now points at `f910736d…`, the claim that covers this commit, names the two owned
  paths, explicitly excludes the two earlier claims from gating this commit, and states that
  independent confirmation must come from Codex or CI with `--repository`. Correct on every limb.
- **Criterion 2** now names `383b632…` and its tree. Correct; it was false before.
- **Criterion 12** now enumerates the full series including `SU7`, `SU8`, `SU9` and `SE-U2`, and says
  in terms that those four "were added in round 2 and are the ones the round-1 form of this criterion
  omitted (R2 finding I-4)". The enumeration is complete and exactly matches the items in the files —
  I checked the set both ways and it is a bijection. The **count** attached to that enumeration is
  wrong; see M-11. The substance R2 required is delivered.
- **Criterion 13** now states the standalone claim in falsifiable terms and names the specific test
  ("_Files created or modified_ must say **two files modified** and must agree with
  `git diff --name-status`"). It passes that test.

**I-4 is closed.** I looked for a statement anywhere in the handoff that describes a round other than
the one it names, which is the falsification test the packet itself proposes, and found none.

---

## 5. Independent external verification

Every call was made by me on **2026-09-13** against the platform's own official endpoint, with the
documented zero-yield anchor on every composite. None is evidence about anatomy or training; all are
statements about query languages, HTTP behaviour and repository state.

### 5.1 Reproduced exactly

1. **S2 GET → HTTP 414**, `Server: Apache`, `Content-Length: 0`, URL 4,137 characters (§3.2).
2. **S2 POST → HTTP 200**, `count` 0, all three warning/error lists exactly as §5.2 tabulates, POST
   body 3,676 bytes (§3.1).
3. **All eight M-3 fly spellings** present verbatim as `[tiab:~0]` phrases in S2's returned
   `querytranslation` (§3.1).
4. **All six per-string GET URL lengths** (§3.2), six of six exact.
5. **All six strings return HTTP 200 on POST**, with empty `fieldsnotfound` and empty
   `quotedphrasesnotfound` (§3.2).
6. **The GET URI boundary at 4,121 / 4,122**, the 96-character prefix, and the 4,025-character
   encoded `term` budget (§3.3), all three exact.
7. **The 3,700-character operating threshold is genuinely conservative** — a URL of exactly 3,700
   characters returns HTTP 200 (§3.3).
8. **Pre-remediation S2 at 3,803 characters returns HTTP 200 on GET** (§3.3), exact.
9. **POST and GET return a byte-identical `esearchresult` for S1**, `querytranslation` included
   (§3.4).
10. **`querytranslation` equals the submitted term byte-for-byte for all six strings** (§3.4).
11. **NBK25499 returns HTTP 200 and its ESearch `term` entry carries the quoted sentence verbatim**
    (§3.5).
12. **`evidencePacketSchema` is exactly as the candidate, R1 and R2 all describe it.**
    `src/lib/content/schemas.ts` — `.strict()`, with `searches[]` a `.strict()` object of exactly
    `database`, `query`, `searchedAt`, `resultCount`; `includedSourceIds: string[]`; `exclusions[]` a
    `.strict()` object of exactly `sourceId` and `reason`. No field for a retrieved total,
    duplicates, platform version, `querytranslation`, failures, or `awaiting-full-text`. **SU8 and
    SE-U2 are accurate and the gap they name is real.**
13. **SE-U1 is accurate.** `sourceSchema.type` has no `preprint` member, and `publication.status` is
    `current | corrected | expression-of-concern | retracted | superseded`, with no preprint state.
14. **The exclusion-code count is 28.** I counted the definition rows independently: `E-POP` 6,
    `E-EXP` 6, `E-OUT` 3, `E-MET` 2, `E-DES` 5, `E-REC` 4, `E-ADM` 2 = **28 unique codes**, with
    `E-OUT-3` and `E-OUT-4` appearing only in the reserved-gap note. The handoff's "twenty-eight" is
    right and R1's M-1 stays closed.
15. **M-7's factual basis, confirmed.** S2's exercise block carries six MeSH descriptors
    (`Resistance Training`, `Weight Lifting`, `Exercise`, `Exercise Therapy`, `Exercise Test`,
    `Athletic Performance`); E1's carries two. Four are absent from E1. Free-text parity, by
    contrast, is **complete**: all 48 of S2's `[tiab:~0]` exercise phrases appear among E1's 50
    `TITLE_ABS:` phrases, set difference empty. R2's measurement is exactly right on both halves.
16. **The ten fenced blocks are structurally balanced** and byte-identical to the reviewed candidate
    (§3.4).

### 5.2 Declared-item enumeration, recounted

I extracted every declared-item identifier from the three artifact files and deduplicated:

- Questions file: `A1 A2 A3 A4 U1 U2 U3 U4 U5` — **9**
- Search strategy: `SA1 SA2 SA3 SU1 SU2 SU3 SU4 SU5 SU6 SU7 SU8 SU9` — **12**
- Eligibility plan: `EA1 EA2 EA3 EA4 EU1 EU2 EU3 EU4 SE-U1 SE-U2` — **10**

**Total: 31 distinct items.** The set is exactly the set criterion 12 enumerates — no item exists
that the criterion omits, and no item is enumerated that does not exist. The enumeration is therefore
complete and correct. The stated total of "thirty-three" is not; see **M-11**.

### 5.3 No scientific finding anywhere in the four files

A pattern scan across all four files for assertive constructions — "studies show", "has been shown
to", "is more effective", "produces greater", "is superior", "proven to", "demonstrates that", "the
data show", "research proves", "evidence proves" — returns **zero matches**. A scan for universal
certainty language returns hits only inside prohibition rules (tier hard limits, H1–H3, "never
evidence of long-term growth", "never a reason to prefer either exercise"), which are
confidence-lowering fences rather than assertions. I read Q1, Q2, the tier hierarchy, the estimand
and the exercise definitions looking for a sentence that asserts a training or anatomy fact, and
found none: every anatomical term is used as a scoping label, and V1 is explicitly a vocabulary fact
about MeSH rather than a fact about the muscle. Criterion 11 holds.

### 5.4 Cochrane, re-observed — M-10's basis still stands

One plain `GET` for `https://www.cochranelibrary.com/search-manager-help` per client, each with that
client's own default `User-Agent`. No substitution, no credentials, no crawl, no link-following, no
search, no record retrieval.

| Client                        | Default `User-Agent` | Result                      |
| ----------------------------- | -------------------- | --------------------------- |
| `curl 8.19.0` (Git Bash)      | `curl/8.19.0`        | **HTTP 419**, 0 bytes       |
| Node 24.20.0 `fetch` (undici) | `node`               | **HTTP 200**, 253,666 bytes |

This reproduces R2's §3.4 result one day later, to within one byte of page drift. The sentence at
`research/searches/SBLA-008-search-strategy.md:112-115` — "no reader can be told 're-run this call
and compare'" — therefore remains falsifiable by a single call, and **M-10's factual basis is
confirmed rather than weakened**. It also remains Minor: the consequence is that a cheap verification
route is described as closed when it is open, which is conservative in the direction that costs
coverage rather than accuracy of the artifact's claims. I did not read the page's contents and make
no statement here about Cochrane grammar beyond what R2 already recorded.

---

## 6. Repository gate and validator behaviour

### 6.1 `pnpm verify` — run by me, exit 0

Real output, stage by stage, from `corepack pnpm verify` in `C:\src\s008r3` under Node `v24.20.0` and
pnpm `11.24.0`:

| Stage               | Result                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `format:check`      | "All matched files use Prettier code style!"                                                                 |
| `lint`              | `eslint . --max-warnings 0` — clean, no output                                                               |
| `typecheck`         | `astro check` — "Result (55 files): 0 errors, 0 warnings, 0 hints"                                           |
| `test`              | **16 test files passed, 234 tests passed**                                                                   |
| `validate:content`  | "Content validation passed: 0 records."                                                                      |
| `validate:graph`    | "Graph validation passed: 0 nodes checked; graph generation remains SBLA-011."                               |
| `evidence:status`   | "Evidence status passed: 0 sources checked as of 2026-09-13; live network acquisition remains a later task." |
| `build`             | "1 page(s) built in 783ms"                                                                                   |
| `test:portability`  | **3 test files passed, 17 tests passed**                                                                     |
| `verify:foundation` | "Foundation contract passed at `C:\src\s008r3\`"                                                             |
| `assets:spike`      | "Asset spike passed: 4 candidate(s); 1 eligible, 2 ineligible under the §8.3 licence-clarity floor of 4/5."  |
| `assets:decision`   | "SBLA-006 asset decision passed: owner-approved 2D-authoritative hybrid…"                                    |

**Exit 0.** This reproduces the candidate's recorded round-3 result stage for stage, including the
234/17 test counts and the 55-file `astro check`. `git diff --check` across the candidate range is
clean, exit 0.

**Read this as a statement about the repository, not about the artifact**, exactly as criterion 14
instructs. `scripts/content/validate.mjs` has `RECORD_ROOTS` including `research/packets` and
`reviews/evidence` but `RECORD_EXTENSIONS` of `.json`/`.yaml`/`.yml`, and `isIgnored()` skips
`research/packets/*-handoff.md` and documented `reviews/evidence/**/-r<n>.md` reports. Both owned
files, and this report, sit outside schema validation. Prettier is the only automated gate that
touches their content, and the candidate says so plainly rather than dressing a green gate up as
evidence for the artifact. That honesty is itself worth recording.

### 6.2 The validator repair still holds with three reports present

`node scripts/content/validate.mjs` run in this worktree **with this report present at its final
path** prints "Content validation passed: 0 records.", exit 0. The exemption Codex added at
SBLA-008's validation-remediation task therefore covers `-r3` as it covered `-r1` and `-r2`, in the
real repository and not only in fixture. R2's fixture matrix for that repair stands; I did not re-run
it, because nothing in this candidate touches it.

---

## 7. Criterion-by-criterion result

Against the fourteen acceptance criteria the candidate states at
`research/packets/SBLA-008-handoff.md:1185-1287`.

1. **Boundary — PASS.** Exactly two paths, both `M`, both the paths the covering ledger claim names.
   Nothing outside `research/`. Independent confirmation is Codex's, recorded at `6d8b7d45…`.
2. **Base — PASS.** Parent `383b63244aabb19404046dbd4a5aeb1589175346`, tree
   `975f154a164aa6779107c1b9f7ad4e820ba46793`, history linear, coordination branch not merged. The
   criterion R2 found false is now true and reproduces in one command.
3. **Two questions with structured fields — PASS.** Q1 decomposes into Q1a/Q1b/Q1c with a full
   PICO/PECO field table in which inapplicable cells are marked not-applicable **with a stated
   reason**. Q2 carries P, I, C, O, T, setting, design eligibility and a fully specified estimand
   (§5.4) covering population, treatment and comparator conditions, endpoint, population-level
   summary, design contrast, intercurrent events with a preferred treatment-policy strategy, missing
   data, training-variable equating and measurement timing. Unchanged since R1 and still correct.
4. **Outcome hierarchy with priority order and hard limits — PASS.** Six rows; only tier 1 may
   support a hypertrophy claim; tier 2 carries a mandatory task-specificity qualifier; tier 4 EMG
   carries the mandatory §2.2 qualifier; tier 5 is "never a reason to prefer either exercise"; harms
   are a mandatory parallel tier including zero-event and not-reported states. H1–H3 close the
   remaining routes, including the §2.2 prohibition on reading "no significant difference" as
   equivalence.
5. **Exercise definitions reproducible — PASS.** Defining attributes / recorded modifiers / distinct
   conditions for both exercises, with the "fly performed with intentional elbow extension is a
   press, not a fly" boundary and the four-step thin-description procedure in eligibility §2.3 that
   resolves uncertainty away from the index set.
6. **Search strings complete, copyable, valid, executable by a documented transport — PASS.** This is
   the criterion I-3 failed and it now passes on its own terms. Three execution paths, the
   equivalence claim withdrawn, POST fully specified, a deterministic transport rule, and — verified
   by me — a transport that actually executes each of the six strings.
7. **Every route records platform, query, filters, dates, dedup, updates, failure and fallback —
   PASS.** §8.1 date semantics including the `[edat]`/`[crdt]`-versus-`[dp]` distinction; §8.2's
   five-step dedup ladder with the weakest key last and fuzzy matches flagged rather than merged;
   §8.3 correctly separating the two recording contracts with a per-field "fits the schema?" column;
   §8.4 update cadence. The §9 matrix now has the HTTP 414 row the gap R2 named, and "not executed"
   is still never recorded as zero results.
8. **Screening rules operational — PASS with M-9 attached.** Design eligibility per question and per
   outcome tier; systematic reviews as signposts and contradiction sources only; language,
   publication status, multi-report linkage, §9.7-consistent retraction handling, the lawful
   acquisition ladder and `awaiting-full-text`; conflict resolution; one primary code per exclusion,
   28 codes verified by my own count. The residue is §1.2's stale reconciliation formula — **M-9**,
   open and correctly declared.
9. **Deliberate contradiction search — PASS.** Five named targets including measurement-invalidity
   evidence; S4 runs unconditionally and is logged under the same rules as S1–S3;
   registry-to-publication reconciliation with a 24-month unpublished threshold; both-directions
   citation chaining; reference-list mining of opposing syntheses; retraction sweep before synthesis;
   limitations and conflicts extracted as fields; "searched and found nothing" recorded as a result
   distinct from "not run". Ten anti-cherry-picking rules and eight guards. Still the artifact's
   strongest section.
10. **Facts and methodology distinguishable — PASS with M-12 attached.** Four labels used
    consistently; an eighteen-row verification log with URL, what was checked and what was observed;
    row 6 marked as the one row a reader cannot reproduce; counts borrowed from R1 attributed to R1
    with an exact locator and flagged "not re-run by this role". The header now states the
    per-verification dating rule with its exception list instead of a blanket date, and **SU6**
    enumerates the same eight locations — the two lists agree with each other. The handoff's third
    copy of that list omits two of the eight; that is **M-12**, and it does not touch the criterion's
    substance, which is that the rule is stated and the exceptions are enumerated in the file itself.
11. **What was and was not run stated exactly; no scientific conclusion — PASS.** §5.3 above. The one
    route-level composite count is disclosed as a search in §0, §4.2, §4.3, the questions file, D13
    and the handoff's Constraints, with the instruction that the disclosure "is not to be deleted,
    softened, or demoted to a footnote in any later revision" still in place. Round 3's own external
    work is bounded and disclosed, and I verified its anchor discipline by reproducing it.
12. **Assumptions and unresolved decisions labelled with a named resolver — PASS with M-11
    attached.** The enumeration is complete and exactly matches the files; every item names a
    resolver and several name a deadline. The stated count of "thirty-three" is wrong by two against
    an enumeration of 31 — **M-11**. The substance R2 required, extension to SU1–SU9 and
    SE-U1/SE-U2, is delivered.
13. **Handoff stands alone — PASS.** It uses the §13.6 headings, records three rounds' bases and
    ledger claims, gives fourteen numbered decisions with rejected alternatives, records the
    repository gate with real output, discloses what it did not check, and pins every identity a
    reviewer needs. I acted on it without access to the authoring session, which is the test, and its
    own falsification instructions all pass. The failure R2 recorded is repaired.
14. **Formatting and hygiene — PASS.** `git diff --check` across the candidate range clean, exit 0.
    Full `pnpm verify` passes exit 0 under the pinned runtime, run by me, including
    `prettier --check .` over both owned paths. The criterion's own caveat — that a green gate says
    nothing about whether the two Markdown files are correct — is stated in the criterion itself.

**Criteria result: 14 PASS, 0 FAIL.** Criteria 8, 10 and 12 pass on their own terms while carrying
Minor findings recorded below.

---

## 8. Findings

### Critical

None.

### Important

None.

### Minor

Recorded with impact and follow-up destination, per CLAUDE.md. Neither blocks acceptance, and each is
explicitly justified as nonblocking below.

#### M-11 — The declared-item count is "thirty-three" against a complete and correct enumeration of 31

**Evidence.**

- `research/packets/SBLA-008-handoff.md:1260` — criterion 12: "**Thirty-three items, in full:**"
  followed by an explicit list of `A1`–`A4`, `U1`–`U5`, `SA1`–`SA3`, `SU1`–`SU9`, `EA1`–`EA4`,
  `EU1`–`EU4`, `SE-U1`, `SE-U2`. That list contains **31** identifiers.
- `research/packets/SBLA-008-handoff.md:293` — Constraints: the same series, again called
  "thirty-three items".
- Independently extracted from the three artifact files and deduplicated: **31 distinct items**
  (9 + 12 + 10, §5.2 above). The enumeration and the files are in exact bijection; only the total is
  wrong.

**Why the number is wrong, which matters for the fix.** The error predates this round and was
inherited rather than introduced. At round 1 the artifact carried **27** items and R1's criterion-12
assessment called them "twenty-eight". Round 2 added `SU7`, `SU8`, `SU9` and `SE-U2`, giving **31**;
the round-2 handoff and R2's own §8 and criterion 12 both called them "thirty-three". Round 3 added
none — correctly, and it says so, folding its one new time-bounded fact into `SU6` — and carried the
figure forward. So the count has been wrong by one since round 1 and by two since round 2, and has
now been repeated by the artifact and by **both** prior review reports without anyone recounting.
That is the substantive reason to record it: the number has acquired the appearance of corroboration
that it does not have.

**Impact.** Bounded, and I state it narrowly rather than inflating it. Criterion 12 is a criterion a
reviewer is directed to apply, and applied literally it produces a mismatch — which is the failure
mode R2's I-4 named. But the mismatch is self-announcing and self-correcting: the complete list sits
in the same sentence as the wrong total, so a reviewer who counts finds the discrepancy immediately
and loses nothing. **No item is omitted, no item is invented, and no unresolved decision is hidden
from the reviewer or from SBLA-009.** Nothing about provenance, boundary, base commit, ledger claim,
scientific content, search strings or screening rules is affected. It is the same class of defect as
R1's **M-1** — a prose count disagreeing with the enumeration it summarises — which R1 itself graded
Minor, and it is weaker than M-1 was, because M-1's count had no enumeration beside it and its
consequence was a numbering gap that EA3 made costly. **Destination:** SBLA-008 remediation or the
next round that owns the handoff; correct both occurrences to thirty-one, or drop the total and let
the enumeration speak. Whoever fixes it should recount rather than adjust, since two prior arithmetic
slips are already in the chain.

#### M-12 — The handoff's copy of the verification-date exception list omits two of the eight locations

**Evidence.**

- `research/searches/SBLA-008-search-strategy.md:11-14` (header) — exceptions are "§2 rows 5 and 6,
  §4.1, §5.0 (transport rule and E-utilities POST), §5.2, §5.3, §6.1, §6.2 and §9". **Eight
  locations.**
- `research/searches/SBLA-008-search-strategy.md` §10 **SU6** — the identical eight: "§2 rows 5 and
  6, §4.1, §5.0, §5.2, §5.3, §6.1, §6.2 and §9". The file's two authoritative lists agree.
- `research/packets/SBLA-008-handoff.md:999-1002` — "The exceptions are the 2026-09-12 re-checks in
  search strategy §2 rows 5 and 6, §4.1, §5.0, §5.2, §5.3 and §6.1". **Six locations — §6.2 and §9
  are missing.**
- Both omitted sections do carry dated 2026-09-12 observations: §6.2 carries the Cochrane 419, and §9
  carries both the Cochrane 419 row and the S2 HTTP 414 row.

**Impact.** Small. The handoff's sentence leads with the governing rule — "Every verification is a
2026-09-11 observation **except where a later date is recorded beside it**" — which is correct, is
self-applying, and does not depend on the list being complete; and both omitted observations are
dated in place where they appear. The file's own two enumerations, which are the authoritative ones
and the ones criterion 10 directs a reviewer to check, are complete and agree with each other. What
the omission costs is that a reader working from the handoff's summary alone would under-count the
2026-09-12 observations by two. It is nonblocking because no verification is mis-dated anywhere, and
because the rule beside the list is sufficient without it. It is recorded because M-6's root cause
was a header asserting a date its own body disproved, and a third copy of the exception list that
does not match the other two is the same drift beginning again in the summary layer. **Destination:**
SBLA-008 remediation or the next round that owns the handoff; extend the list to the eight the file
enumerates, or replace it with a pointer to SU6 so there is one authoritative copy rather than three.

---

## 9. Disposition of R2's five Minor findings, re-tested

Round 3 owned only two of the four research paths. I checked both whether that constraint is real and
whether each open item is properly recorded with impact and destination, which is what CLAUDE.md
requires for a Minor finding to be deferrable.

**The narrowed boundary is real and correctly observed.** The covering ledger claim `f910736d…`
records exactly two owned paths, and the diff touches exactly those two. A round that repaired M-9 —
which lives in the eligibility plan — would have breached its own claim.

| #        | Status at this candidate                                                                                                                                                                                                                | My re-test                                                                                                                                                                                                                                                                               |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M-6**  | **Closed in the search strategy; open in the questions file and eligibility plan, and declared as such in the search strategy's own header.** The blanket date is replaced by a per-verification rule with an enumerated exception list | Confirmed both ways: the search-strategy header is repaired and names the residual defect; `vertical-slice.md:11-12` and `eligibility-plan.md:6-7` still read base `0752d502…` / "Date written: 2026-09-11". Correct handling of a real boundary; see M-12 for the residue               |
| **M-7**  | **Open, deliberately.** Destination SBLA-009 at execution time, with SU7, when Europe PMC is reachable and the four descriptors' `MESH:` handling can be tested                                                                         | Basis confirmed exactly (§5.1 item 15). I could not quantify it either — I made no Europe PMC call. The reasoning for deferring is sound: adding four `MESH:` terms to a route whose handling of them nobody has verified would be an unverified change to a query string                |
| **M-8**  | **Open, deliberately.** The mismatch is between §5.0's anchor and the handoff's round-1 verification table, which records what was submitted on 2026-09-11; correcting it needs the round-1 call log this session does not hold         | Confirmed still present at `handoff.md:893` and `:898` (`zzzqqqnonsense`, and `TITLE` rather than `TITLE_ABS`). The refusal to rewrite a round-1 record into an assertion it cannot verify is the right instinct, and it is stated rather than hidden                                    |
| **M-9**  | **Open.** Not repairable in this round's boundary. Destination: a round owning the eligibility plan, before screening                                                                                                                   | Confirmed still present at `eligibility-plan.md:67-68`, formula unchanged. §6.4's four-state mapping is correct and explicit, so the governing reading is unambiguous; still worth fixing before a screener applies §1.2 literally                                                       |
| **M-10** | **Open, deliberately.** An owned file, but a wording change to the most contested passage in the artifact, with no new Cochrane evidence gathered this round                                                                            | **Basis re-confirmed by me today** (§5.4): curl 419, Node 200. The sentence remains falsifiable in one call. The deferral reason is defensible but this is the one open Minor I would put first in the next round, because it is cheap and its evidence is now three days old and stable |

None of the four open items has grown into an Important finding, and I decline to promote any of them
without evidence of acceptance impact, which I looked for and did not find. Each carries a stated
impact and a named destination in the candidate's own R2 closure map, which is the condition
`operating-policy.json` `minorFindingsMayBeDeferredWhenNonblocking` and CLAUDE.md both impose.

**On the shape of the R2 closure map itself.** It is unusually honest. Three rows say "Not done" and
give the reason, one distinguishes "not doable here" from "not done", and the map's preamble tells
the reader to "read the Minor rows as a boundary statement rather than as a judgement that they do
not matter". A remediation round that claims only what it repaired is easier to review than one that
claims more, and this one claims exactly two things and delivers both.

---

## 10. R1 findings — all seven still closed

Re-tested against the current files, not against the diff or either closure map.

- **I-1 (Europe PMC composite described as not executed) — CLOSED.** A repository-wide grep of
  `research/` for "no composite question query", "composite question query was executed", "no search
  was" and "no search has been" returns **zero matches**. §0 defines the fourth label, **Route-level
  composite count**, and states that exactly one exists. §4.2 records database, route, endpoint,
  query, `searchedAt` 2026-09-11, `resultCount` 334, platform version 6.9 and "Identifiers examined:
  none". §4.3 states the U2 consequence, §5.0 carries it forward as a required SBLA-009 search row,
  and the questions file §3 and §8 repeat it. The protective sentence — "This disclosure stays in the
  file. It is not to be deleted, softened, or demoted to a footnote in any later revision" — survives
  round 3 intact, which is the thing most likely to have been quietly lost.
- **I-2 (records the strict schema cannot hold) — CLOSED as a declaration.** `SE-U2` at eligibility
  §8 and `SU8` at search strategy §10 both present with **Codex** named as resolver and the deadline
  "before SBLA-009 writes a packet". §8.3 is rewritten with a per-field "fits the schema?" column
  marking platform version, `querytranslation` and failures as "**No home in the schema**", and says
  outright "R1 finding I-2 is correct that this section was the one that was wrong". §6.4 maps all
  four states and states without smoothing that "the rule 3 arithmetic closes in the **screening
  log** … it does **not** close inside the packet, and it is not machine-checkable there". I verified
  the schema facts myself (§5.1 items 12–13). The underlying defect correctly remains open for Codex.
- **M-1 (exclusion-code count) — CLOSED.** I counted 28 independently (§5.1 item 14); handoff §5 says
  "twenty-eight"; §5.3 explains the reserved `E-OUT-3`/`E-OUT-4` gap and ties it to EA3.
- **M-2 (duplicate as both state and code) — CLOSED.** §6.4 states the decision explicitly — "**yes,
  duplicates go in `exclusions[]`**" under `E-REC-1` — with its reason, and instructs the screener
  not to also record a substantive code.
- **M-3 (fly spellings) — CLOSED.** All eight forms present in S2, S3 and E1, and additionally in C1
  in `NEXT` form. I confirmed all eight appear verbatim in PubMed's returned `querytranslation` for
  S2 (§3.1).
- **M-4 (E1 thinner than S2) — CLOSED for free text.** Set difference S2-minus-E1 on free-text
  exercise phrases is **empty** (§5.1 item 15). The MeSH residue is M-7, open and declared.
- **M-5 (Cochrane claims unreproducible; retrieval method imprecise) — CLOSED, both limbs.** §2 row 6
  and its note record every attempt and code with dates; §9.6 is reconciled explicitly without
  pretending the user-agent substitution was nothing; a standing prohibition on substituting a user
  agent to reach any Cochrane URL is in §6.2, §9 and SU9; and the claims carry "Syntax unverified at
  scope time" throughout. Nothing in round 3 touched any of this.

**R1 closure summary: 7 of 7 still closed**, and none reopened by round 3's changes.

---

## 11. Verdicts on the declared assumptions and unresolved decisions

Thirty-one declared items. Where R1 and R2 already ruled and nothing changed, I concur without
restating their reasoning.

**Unchanged and still accepted, non-blocking:** A1, A3, A4, SA2, SA3, SU1, SU2, SU3, SU5, EA2, EA3,
EA4. **Unchanged and still deadline-bound:** A2 (before extraction), U3/EU1 (before screening),
U4/EU3 (before extraction), U5/EU4 (before screening).

- **U2 / EU2 — BLOCKING before search execution.** Unchanged and correctly carried in four places,
  each stating that the decision is now taken with one route-level yield figure visible and that the
  owner should record the rationale. D12's refusal to substitute the pec deck stands.
- **SA1 (term coverage is the most likely defect) — correct self-assessment, and correct a third
  time.** R1 found M-3 and M-4; R2 found M-7; this round finds nothing further in the strings, but
  only because I did not call Europe PMC. SA1 should stay live for SBLA-009.
- **SU4 (Crossref Retraction Watch labs endpoint) — accepted, and stale in the artifact's favour.**
  R2 found it up on 2026-09-12 where the candidate records 502/504 on 2026-09-11. I did not re-test.
  SU6 already predicts exactly this.
- **SU6 (everything is a dated observation and must be re-verified) — accepted, and now doing more
  work than before.** It carries the round-3 caveat that the measured GET boundary is not a published
  figure and may move. That is the correct home for it and is why round 3 was right not to mint a new
  ID. Its exception list agrees with the file header; the handoff's third copy does not (M-12).
- **SU7 (no verified Europe PMC proximity operator) — accept as recorded.** Non-blocking for search;
  blocking for any claim that E1 and S2 retrieve comparably. Untested by me. Interacts with M-7.
- **SU8 / SE-U2 (the strict `evidencePacketSchema` cannot hold the mandated records) — accurate,
  correctly routed to Codex, and BLOCKING before SBLA-009 writes an evidence packet**, not before it
  searches. I confirmed the schema facts myself. Decide together with SE-U1.
- **SU9 (Cochrane Search Manager grammar unverified at scope time) — accept the status.** R2
  independently confirmed the grammar correct from the official page; the provenance concern
  survives, and the instruction to re-verify inside an authenticated Search Manager session before
  running C1 is right regardless, because a help page documents a UI and not CENTRAL's retrieval
  behaviour.
- **SE-U1 (`sourceSchema` has no preprint type or status) — accurate, confirmed by me, correctly
  routed. Blocking before SBLA-009 records a preprint source.**
- **EA1 (the four-way record outcome is exhaustive) — sound as a screening rule; blocked downstream
  by SE-U2 and internally contradicted by §1.2 (M-9).**

One observation on the handoff's _Known uncertainties_ section rather than on any item: its
"Unresolved scope decisions" table lists U1–U5 and SE-U1, and does not list SU7, SU8, SU9 or SE-U2,
which is the round-1 set. I considered raising it and decided against it, and say so rather than
leaving the reasoning invisible. The four omitted items are stated twice elsewhere in the same
handoff with their owners and deadlines — in _Constraints_ at `:292-299` and in "What is still open
after round 3, and who owns it" at `:374-379` — and criterion 12 enumerates them explicitly as the
round-2 additions. Nothing blocking is lost to a reader of the handoff, the section's other two
subsections do carry SU1–SU6 and the round-3 POST single-point-of-failure, and the table's heading
claims no exhaustiveness. Consolidating the four into that table would improve the document and I
would welcome it in the next round that owns the handoff, but on this artifact it is below the
threshold at which I would record a finding, and inventing one would not be a fair reading.

---

## 12. Out-of-scope observation routed to Codex

Not a defect in the candidate, and I have no authority to act on it.

### 12.1 The coordination ledger records a wrong SHA-256 for the search strategy

`docs/runbooks/current-work.md` at `6d8b7d45d2073838e29a0cb7344503336b941eec`, in the closed-claim
row for "SBLA-008 R2 research remediation", records:

> Search-strategy blob `8ae5e937c30cfe37dc0f95c931627537298bca07`, 1,090 lines, SHA-256
> `a08a97d4191298eec6e39fa71b1305e358adccf1bda76ec54b537e45dd3f902e`

The blob ID and the line count are correct. **The SHA-256 is not.** The true value at this candidate
is `7e0629d57425fb85e5fd9da88f5cb71e544d7b531f61e5a9da870efba0bfdcf3`, computed three ways that all
agree: `sha256sum` on the worktree file, `git cat-file blob 8ae5e937… | sha256sum`, and the byte
lengths match at 135,478 so no line-ending normalisation is in play (`.gitattributes` sets
`* text=auto eol=lf`). I then tried every plausible way the recorded value could be right and none of
them is: it is not the file with CRLF endings, not the SHA-256 of the Git object including its
header, not the content minus its trailing newline, not the file at `383b632` (which is `1371ef72…`,
as R2 recorded correctly), not the file at `56068c2` (`9c5d63f4…`, as R1 recorded correctly), and it
matches **no blob anywhere in the candidate tree**. The handoff SHA-256 in the same ledger row is
correct, as is every other identity in it.

**Why it matters, and why it is not a finding against this candidate.** That row is the closure
record a later reader would use to pin the artifact, and CLAUDE.md makes Codex's trusted-checkout
result the boundary evidence for a restricted-role commit. A checksum that matches nothing is worse
than no checksum, because it will read as a mismatch to whoever checks it next and will cast doubt on
a candidate that is in fact exactly what the row says it is. But the ledger is Codex's artifact, not
the candidate's: `docs/runbooks/current-work.md` is outside both Claude roles' write boundaries, and
the candidate itself records **no** SHA-256 for either file it changed, deliberately and with its
reasoning stated. The candidate is not responsible for the error and could not have prevented or
corrected it.

**Recommended action for Codex:** recompute and correct that one field in the ledger row, and check
whether the same slip affected any other recorded checksum. Nothing about the commit, the tree, the
blob, the boundary or the verification result changes.

---

## 13. What must be resolved before SBLA-009 begins

**Nothing blocks acceptance of this candidate.** The items below gate later stages, unchanged from R1
and R2 except where noted.

**Before search execution — one item.**

1. **U2 / EU2.** Whether Exercise Y may be widened, taken as an explicit revised scope file with a
   date and a reason, and recorded together with the fact that one route-level yield figure was
   visible when it was taken.

**Before an evidence packet is written — three items, none inside the Claude roles' write
boundaries.**

2. **SE-U2 / SU8.** How `awaiting-full-text`, duplicates, a retrieved total, platform version,
   `querytranslation` and failures are recorded given the strict `evidencePacketSchema`.
3. **SE-U1.** How preprints are typed and status-tracked.
4. Decide 2 and 3 together; they are one schema decision for Codex on an owner ruling.

**Before screening — U3 / EU1, U5 / EU4, and M-9. Before extraction — A2 and U4 / EU3.**

**At execution time —** SU7 and M-7 together, when Europe PMC is reachable; SU9 before C1's `#9` line
is run; U1 / SU3 for Terminologia Anatomica; and a confirmation that E-utilities POST still works
before S2 is relied upon, which the handoff itself flags as the single point of failure D14 knowingly
created.

**Carried for the next round that owns the relevant paths —** M-6's residue in the questions file and
eligibility plan, M-8, M-10, and the two new Minor findings M-11 and M-12.

---

## 14. Remaining uncertainties in this review

Stated so nobody reads coverage into this report that it does not have.

1. **I made no Europe PMC call at all.** Route E1 is unverified by me in every respect: I did not
   confirm the amended string parses, did not re-observe `version 6.9`, and could not quantify M-7.
   This was a deliberate choice to observe no question-level yield on the one route where a
   question-level count already exists. R1 reproduced the pre-remediation E1 on 2026-09-11; R2 could
   not reach the service at all; the post-remediation string remains confirmed by nobody but its
   author.
2. **I observed no question-level yield and therefore cannot assess actual retrieval.** Every
   composite I ran carried the zero-yield anchor and every length probe used nonsense tokens. Whether
   these strings retrieve the right records is unknown to this review and unknowable at the `scope`
   stage. SA1 remains the right place to push.
3. **The 4,121/4,122 boundary is my measurement and the candidate's, not NCBI's published figure.**
   Both of us observed it on single dates from single clients. I did read NCBI's documentation
   (NBK25499) and confirm that it recommends POST for long queries without publishing a threshold, so
   the absence of a published number is itself verified. The limit is a server-side property that may
   move; §5.0's conservative margin handles that correctly, and SU6 carries it.
4. **I did not verify Cochrane CENTRAL's behaviour**, only the help page's access behaviour from two
   clients. I did not read the page's contents and make no independent statement about the Search
   Manager grammar beyond citing R2's verification of it.
5. **`pnpm verify` passed under my own hand but is not boundary evidence.** Per CLAUDE.md the
   role-path boundary result must come from Codex or CI with `--repository`. That evidence is
   recorded in the coordination claim; I did not produce it and do not restate it as mine.
6. **I did not test PROSPERO or SportRxiv syntax** (SU1, SU2), FIPAT (U1/SU3), the Crossref
   Retraction Watch labs endpoint (SU4), or the master plan's own external references (SU5). The
   candidate already carries all of them as unverified or time-bounded.
7. **I did not re-run R2's validator fixture matrix.** I confirmed only that the real content
   validator passes with this report present at its final path. Nothing in this candidate touches
   `scripts/content/validate.mjs`, and R2's out-of-scope observation about the exemption being keyed
   on suffix rather than on the documented `<task-id>-r<number>.md` form remains open for Codex,
   unchanged.
8. **The M-3 term counts the handoff attributes to R1 were not re-run by me**, as they were not by
   the author. They are correctly attributed to R1 with an exact locator and flagged "not re-run by
   this role", which is the right handling of a borrowed figure.
9. **I did not attempt to falsify the scientific architecture afresh.** Q1, Q2, the estimand, the
   tier hierarchy, the exercise definitions and the contradiction plan are unchanged since R1 in
   substance; I read them in full, re-checked them against criteria 3–5 and 9, and concur with R1's
   and R2's assessments rather than re-deriving them.

---

## 15. Checks run in this session, with real output

Repository checks, run by me in `C:\src\s008r3`:

- `git rev-parse HEAD` → `d1a77071e0a794c537c24e4b30bfcf3b1016063e`
- `git rev-parse HEAD^{tree}` → `6e2506553a92ab78068afd23940cce5ec23d61fa`
- `git rev-parse HEAD^` → `383b63244aabb19404046dbd4a5aeb1589175346`
- `git diff --name-status 383b632 HEAD` → two lines, both `M`, both under `research/`
- `git diff --shortstat 383b632 HEAD` → `2 files changed, 770 insertions(+), 152 deletions(-)`
- `git diff --check 383b632 HEAD` → no output, exit 0
- `git diff --name-only 383b632 HEAD -- research/questions research/screening` → empty
- `git cat-file -t 6d8b7d45…` → `commit`; `git rev-parse codex/SBLA-007-review-coordination` →
  `6d8b7d45d2073838e29a0cb7344503336b941eec`
- `git cat-file -t f910736d…` → `commit`, subject "docs: correct SBLA-008 R2 remediation base"
- `git diff eefefd2 HEAD -- reviews/evidence/SBLA-008-r1.md` → empty
- `git diff --word-diff --ignore-all-space 5d51959 eefefd2 -- reviews/evidence/SBLA-008-r1.md` →
  empty
- `sha256sum` on the four candidate files and both prior reports → recorded in the header block
- `wc -l` on the four candidate files → 435 / 1,090 / 623 / 1,287
- Node extraction comparing all ten fenced `text` blocks at `383b632` and `HEAD` → all byte-identical
- `corepack pnpm install --frozen-lockfile` → "Done in 6.2s using pnpm v11.24.0"
- `corepack pnpm verify` → **exit 0**; 16 unit test files / **234 tests**, 3 portability files /
  **17 tests**, `astro check` 55 files 0 errors 0 warnings 0 hints, "Content validation passed: 0
  records.", graph and evidence validation pass, `astro build` 1 page, "Foundation contract passed",
  asset spike and decision gates pass, `prettier --check .` "All matched files use Prettier code
  style!"
- `node scripts/content/validate.mjs` with this report present at its final path → "Content
  validation passed: 0 records.", exit 0

External checks, run by me on 2026-09-13 against official endpoints, every composite carrying the
documented zero-yield anchor and every length probe using nonsense tokens only: **16 reproduced**
(§5.1), including all six per-string URL measurements, both S2 transports, the byte-exact 4,121/4,122
boundary, the 96-character prefix, the GET/POST `esearchresult` byte-identity, the NBK25499
quotation, and the schema facts; **1 re-observation confirming an open Minor's basis** (§5.4,
Cochrane); **0 divergences from the artifact**; **6 carried as unverified** (§14).

Not run by me, stated plainly rather than implied: any Europe PMC call, `pnpm test:e2e`,
`pnpm test:a11y`, `pnpm test:visual`, `pnpm test:performance`, and the role-path boundary checker
with `--repository`.

---

## 16. Files written by this review

`reviews/evidence/SBLA-008-r3.md` — this file, and nothing else. The candidate commit, the four
research files, `reviews/evidence/SBLA-008-r1.md`, `reviews/releases/`, `content/`,
`content-drafts/`, schemas, scripts, tests, configuration and `docs/runbooks/current-work.md` are all
unmodified. A `node_modules/` directory was created in this worktree by `pnpm install` to run the
repository gate; it is gitignored and `.prettierignore`d, was never staged, and appears in no diff.
`pnpm-lock.yaml` is unchanged.
