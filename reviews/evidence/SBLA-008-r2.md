# Evidence review: SBLA-008 vertical-slice scope, round 2 (complete-artifact recheck)

**Task:** SBLA-008 — Vertical-slice research questions, PICO/PECO, search strings, inclusion and
exclusion plan. Round 2 recheck of the complete remediated artifact, per the CLAUDE.md stop rule
("After FAIL, one bounded remediation is followed by one complete-artifact recheck").
**Reviewer role:** Claude Review (Account B), independent adversarial evidence review, round 2.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). Fresh review
session. I did not author, remediate, or contribute to any SBLA-008 candidate, and I received none of
the authoring role's reasoning beyond the committed artifacts (§9.10).
**Review date:** 2026-09-12
**Reviewer worktree:** `C:\src\s008r2`
**Reviewer branch:** `claude-review/SBLA-008-r2`
**Reviewer write path:** `reviews/evidence/SBLA-008-r2.md` (sole permitted path; nothing else written)

**Reviewed candidate commit:** `383b63244aabb19404046dbd4a5aeb1589175346` _(immutable)_
**Reviewed candidate tree:** `975f154a164aa6779107c1b9f7ad4e820ba46793` _(immutable)_
**Candidate parent:** `2de2a3ef428139cbe20f934bb98fad8190d16d20` _("fix: allow evidence review
Markdown reports")_
**Review coordination claim:** `4a1501452d860ddd106a9b7d764e1a6f9f4584ad` on branch
`codex/SBLA-007-review-coordination` _(verified as a Git object; contents verified — see §2.3)_
**Prior round:** `reviews/evidence/SBLA-008-r1.md`, verdict FAIL, 0 Critical / 2 Important / 5 Minor

Reviewed file blobs and SHA-256 checksums, recomputed in this session at the candidate commit:

- `research/questions/SBLA-008-vertical-slice.md` — blob `62067b94b0fbaf64afa124316ef352b5b37fb920`,
  SHA-256 `17f8e5acf2bcf08f2e2efa76d68f9618b2e1964d508aaeab86317bee7762eb22`, 435 lines
- `research/searches/SBLA-008-search-strategy.md` — blob `e433130dfdafae6ce8e5b7503ac2e27a746d7ac2`,
  SHA-256 `1371ef726692cae0e2f13f58ee83380f3dc9efa2f6d9d626ad49626f9e03e42a`, 969 lines
- `research/screening/SBLA-008-eligibility-plan.md` — blob `88c220224d8859758bd7fa7a9dafb57df3a1d16c`,
  SHA-256 `5fc3363e933e1855cf77596dd3576e5356773749eab31e45d225aa147d78560c`, 623 lines
- `research/packets/SBLA-008-handoff.md` — blob `75423c4782a231e147cfdc95d7b03fed81c8f74f`,
  SHA-256 `f9fdd2796ccd590a29b702927645868d14651ccb958624739e0676bfae3b6a12`, 790 lines

Immutable R1 report as it stands at the candidate commit — blob
`9db00fdc07e575ad9c45d02b2796d68cb622b84d`, SHA-256
`0cd5aaa37769a9458b48343d4aa4487b45c4371540e46e30241f44882546376d`, 772 lines. Byte-identical to the
report at `eefefd20`, which is what the handoff claims. Verified.

---

## Verdict

**Verdict: FAIL.**
**Critical: 0 · Important: 2 · Minor: 5 · Out-of-scope observation routed to Codex: 1**

PASS requires zero Critical and zero Important findings (CLAUDE.md review stop rule; AGENTS.md;
`operating-policy.json` `passRequiresZeroImportant: true`). Two Important findings stand.

**All seven R1 findings are closed.** I re-tested every one against the current files and every one is
genuinely remediated — several beyond what R1 asked for. The two Important findings below are **new**,
and one of them was **created by the remediation itself**:

- **I-3** — the S2 precision-arm string, after the M-3/M-4 term additions, can no longer be executed by
  the API path §5.0 documents. NCBI returns **HTTP 414 Request-URI Too Long** with an empty body. The
  anchored GET URL grew from 3,803 characters (pre-remediation, HTTP 200) to 4,137 (HTTP 414). Nothing
  in the artifact records this, the §9 failure matrix has no row for it, and §5.0 still calls the web
  and API paths "equivalent". The `querytranslation` string that §5.0 makes mandatory and calls "the
  only artifact that proves what PubMed actually ran" cannot be obtained for S2 by any route the file
  names.
- **I-4** — the handoff's own acceptance criteria and its §13.6-mandated "Files created or modified"
  section still describe round 1. Criterion 2 states a parent commit that is **not** the candidate's
  parent; criterion 1 points at the round-1 ledger claim; criterion 12 omits the four unresolved items
  this round added; and "Files created or modified" says "Modified: **none**" in a round that modified
  four files, with round-1 line counts. The handoff's own criterion 13 — "This handoff stands alone" —
  is not met on its own terms.

**Read this FAIL narrowly.** The scoping is excellent and its scientific architecture is unchanged and
sound. I independently re-executed **twenty-four** external platform, vocabulary and repository checks
against official endpoints; **every substantive claim reproduced**, several to the exact integer, and
one — the entire Cochrane Search Manager grammar that R1 could not reach and that the candidate
conservatively downgraded to "unverified" — I was able to confirm in full from the official page
(§3.4). Both Important findings are documentation-level and cheap: I-3 needs a documented POST
execution path plus a failure-matrix row; I-4 needs the handoff's tail sections brought into line with
sections it already states correctly 450 lines earlier. Neither touches the questions, the estimand,
the outcome hierarchy, the evidence fencing, or the contradiction plan.

This report is append-only and is never edited. A further round would be `-r3`.

---

## 1. What this review is, and what it deliberately is not

This is the `scope`-stage complete-artifact recheck for SBLA-008 (§9.8 step 1). SBLA-009 owns `search`
onward.

**I reviewed the complete artifact, not the diff.** I read all four research files in full at the
candidate commit, `reviews/evidence/SBLA-008-r1.md` in full,
`reviews/releases/SBLA-008-validation-remediation-handoff.md`, `CLAUDE.md`, `AGENTS.md`,
`docs/product/master-plan.md` in full, `docs/runbooks/operating-policy.json`,
`src/lib/content/schemas.ts`, `scripts/content/validate.mjs`, `scripts/foundation/scan-records.mjs`,
and `tests/unit/foundation-adapters.test.ts`. The diff was used only to establish provenance and to
locate what the remediation changed.

**I did not execute the planned SBLA-009 evidence review.** I collected no identifier, opened no
record, screened nothing, and cite no study. No statement in this report is a scientific finding about
anatomy, exercise, or training.

**I did not repair the artifact** (CLAUDE.md). Every finding below returns to the authoring role.

**Boundary discipline on my own external calls.** Every PubMed and Europe PMC composite I submitted
carried the documented nonsense zero-yield anchor — `AND zzzqqqnonsenseanchor[tiab]` for PubMed,
`AND (TITLE_ABS:"zzzqqqnonsenseanchor")` for Europe PMC (search strategy §5.0) — so the platform parses
the whole string while the count is structurally zero. **I observed no question-level yield at any
point**, and I did not re-run the unanchored E1 composite that R1 reproduced. Where I needed to size a
URL-length threshold I used a purely synthetic query of nonsense tokens, never a topical one.

**Cochrane access.** I did not substitute a user agent, send credentials, crawl, or follow links. I
sent single plain requests with two clients' own defaults and report exactly what each returned (§3.4).

---

## 2. Methods and reproduction

### 2.1 Environment

- Repository worktree `C:\src\s008r2` at the candidate commit, working tree clean.
- Node on `PATH` is `v24.14.0`, below the `>=24.20.0 <25` engine floor, and `pnpm` is not on `PATH`.
  The pinned runtime **is** available on this host: Node `v24.20.0` via `fnm`
  (`~/AppData/Roaming/fnm/node-versions/v24.20.0/installation`) and pnpm `11.24.0` via `corepack`.
- I therefore **did** run the full repository gate, unlike R1. See §2.2.

### 2.2 Repository checks, all run by me

| Check                     | Command, exactly as run                                   | Result                                                                                        |
| ------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Candidate commit          | `git rev-parse 383b632…^{commit}`                         | `383b63244aabb19404046dbd4a5aeb1589175346`                                                    |
| Candidate tree            | `git rev-parse 383b632^{tree}`                            | `975f154a164aa6779107c1b9f7ad4e820ba46793`                                                    |
| Candidate parent          | `git rev-parse 383b632^`                                  | `2de2a3ef428139cbe20f934bb98fad8190d16d20`                                                    |
| Boundary                  | `git diff --name-status 383b632^ 383b632`                 | Exactly four entries, all `M`, all the four claimed research paths. Nothing else              |
| Diff size                 | `git diff --shortstat 383b632^ 383b632`                   | `4 files changed, 772 insertions(+), 237 deletions(-)`                                        |
| Whitespace                | `git diff --check 383b632^ 383b632`                       | No output, **exit 0**                                                                         |
| Formatter                 | `prettier --check` on the four paths + the R1 report      | **Pass**, exit 0 — "All matched files use Prettier code style!"                               |
| Install                   | `corepack pnpm install --frozen-lockfile`                 | Pass; lockfile supply-chain policy pass, 628 entries                                          |
| **Full gate**             | `corepack pnpm verify` under Node 24.20.0                 | **Pass, exit 0** — see below                                                                  |
| Checksums                 | `sha256sum` on the four files and the R1 report           | Recorded in the header block above                                                            |
| R1 report immutability    | `git diff eefefd2 383b632 -- reviews/evidence/…r1.md`     | Empty — byte-unchanged, as the handoff claims                                                 |
| R1 report formatting edit | `git diff --word-diff --ignore-all-space 5d51959 eefefd2` | Empty — the `eefefd20` change is **whitespace-only**; no finding, severity or verdict altered |

`pnpm verify` real output, abbreviated: format check, lint and `astro check` (55 files, 0 errors, 0
warnings, 0 hints); `vitest run tests/unit` — **16 test files, 234 tests passed**;
`node scripts/content/validate.mjs` — "Content validation passed: 0 records.";
`scripts/graph/validate.mjs` — pass; `scripts/evidence/status.mjs` — pass; `astro build` — 1 page
built; portability suite — **3 files, 17 tests passed**; `scripts/foundation/verify.mjs` — "Foundation
contract passed"; `scripts/assets/spike.mjs` and `scripts/assets/decision.mjs` — pass. Exit 0.

**Independence caveat, stated because CLAUDE.md requires it.** I ran `pnpm verify` from my own mutable
role branch. Per CLAUDE.md, that is **not** admissible as independent role-path boundary evidence; the
boundary result must come from Codex or CI executing the checker from a trusted checkout with
`--repository`. That evidence exists and I did not produce it: the coordination claim `4a150145…`
records Codex's own full `pnpm verify` on this exact commit (234 unit tests, 17 portability tests, all
gates) and that "The trusted Claude Research boundary passes." My run corroborates the repository gate;
Codex's run is the boundary evidence.

### 2.3 The external coordination claim, verified

`git cat-file -t 4a15014` returns `commit`. `git rev-parse codex/SBLA-007-review-coordination`
resolves to `4a1501452d860ddd106a9b7d764e1a6f9f4584ad`, so the claim is the branch head. Its diff
amends `docs/runbooks/current-work.md` and records exactly one active claim:

| Field            | Recorded value                             | Matches my assignment |
| ---------------- | ------------------------------------------ | --------------------- |
| Task             | SBLA-008 evidence review R2 recheck        | Yes                   |
| Role             | Claude Review (account B)                  | Yes                   |
| Branch           | `claude-review/SBLA-008-r2`                | Yes                   |
| Worktree         | `C:\src\s008r2`                            | Yes                   |
| Base commit      | `383b63244aabb19404046dbd4a5aeb1589175346` | Yes                   |
| Started          | 2026-09-12 17:23 EDT                       | —                     |
| Expected handoff | `reviews/evidence/SBLA-008-r2.md`          | Yes                   |
| Paths owned      | `reviews/evidence/SBLA-008-r2.md`          | Yes — exactly one     |

The same commit closes the Account A remediation claim and records its result. The claim is
`exact-append-only-report-path` scoped, as `operating-policy.json` requires, and it was recorded by
Codex on the coordination branch, not by me. I did not edit the ledger and cannot.

### 2.4 What I could not reproduce, and therefore carry as unverified

- **Europe PMC route E1.** The REST `search` endpoint
  (`https://www.ebi.ac.uk/europepmc/webservices/rest/search`) returned **HTTP 503 Service Temporarily
  Unavailable** (nginx/1.17.7) to my anchored E1 parse test on 2026-09-12, and again on the single
  documented retry. A trivial one-term query to the same endpoint also returned 503, so the service
  itself was down, not my query; `https://europepmc.org/RestfulWebService` still returns HTTP 200. This
  is exactly the failure the candidate anticipates in §6.1 ("On a non-200 … retry once … if it still
  fails, record the route as **not executed**"), so I follow its own rule and record E1 as **not
  executed by me**. The candidate's E1 claims are therefore neither confirmed nor disconfirmed in this
  round. R1 did reproduce the E1 `version 6.9` and `hitCount 334` on 2026-09-11.
- **Terminologia Anatomica / FIPAT.** `https://fipat.library.dal.ca/ta2/` — `fetch failed`, connection
  error. This **reproduces** the candidate's U1/SU3 observation.
- **PROSPERO and SportRxiv query syntax** (SU1, SU2). Not re-tested; the candidate already carries both
  as unverified, so re-testing could not change a verdict.
- **Whether the four exercise MeSH descriptors missing from E1 can be added** (M-7) — untestable while
  Europe PMC is down.

---

## 3. Independent external verification

Every call below was made by me on **2026-09-12** against the platform's own official endpoint. None is
evidence about anatomy or training; all are statements about query languages, controlled vocabularies
and HTTP behaviour.

### 3.1 Reproduced exactly

1. **Verified vocabulary fact V1 — confirmed, and more strongly than R1 stated it.** NLM MeSH SPARQL
   (`https://id.nlm.nih.gov/mesh/sparql`): a query for every topical descriptor with a tree number
   beginning `A02.633.567.775` returns **13 bindings, all of them D010369** — the descriptor itself
   across MeSH year-versions 2015 through 2026. A query for `?d meshv:broaderDescriptor mesh:D010369`
   returns **zero bindings**. `Pectoralis Muscles` D010369 has no narrower descriptor, and has not had
   one in eleven MeSH years. The questions file §2 V1 and search strategy §3.1 are correct.
2. **Entry terms.** `https://id.nlm.nih.gov/mesh/lookup/details?descriptor=D010369` returns terms
   "Pectoralis Muscles", "Pectoral Muscle", "Pectoralis Major", "Pectoralis Major Muscle", "Pectoralis
   Minor", "Pectoralis Minor Muscle" — entry terms, not descriptors, exactly as the questions file §2
   states.
3. **Descriptor lookups reproduce the §3.1 table row for row.** Exact-match lookups against
   `https://id.nlm.nih.gov/mesh/lookup/descriptor`: `Pectoralis Muscles` → `D010369`;
   `Pectoralis Major` → `[]`; `Bench Press` → `[]`; `Muscle Hypertrophy` → `[]`; `Strength Training` →
   `[]`; `Resistance Training` → `D055070`. Every value matches.
4. **The entry-term trap.** Anchored, `"Pectoralis Major"[mh]` returns the term in
   `warninglist.quotedphrasesnotfound`; `"Pectoralis Muscles"[mh]` and `"Pectoralis Muscles"[mh:noexp]`
   both parse clean. The questions file §2 is correct as written.
5. **Decision D4's PubMed half — my strongest falsification target, and it holds.** Anchored against
   E-utilities `esearch`: `"Retraction of Publication"[pt]` parses but lands in `quotedphrasesnotfound`,
   while `"Retracted Publication"[pt]`, `"Published Erratum"[pt]`, `"Expression of Concern"[pt]` and
   `"Preprint"[pt]` all parse with every warning list empty. §3.3 and D4 are exactly right, and dropping
   the value for PubMed while recording it as a platform difference is the correct response.
6. **Proximity and subset syntax.** `"cross-sectional area"[tiab:~0]`, `"bench press"[tiab:~0]` and
   `systematic[sb]` all parse clean under the anchor, with `querytranslation` echoing the tags. §3.2's
   account of the quoted-phrase trap and its `~0` fix is accurate.
7. **Five of the six PubMed strings parse.** S1, S3, S4, S5 and S6, submitted verbatim with the
   documented anchor to the documented GET endpoint, each returned HTTP 200, `count` 0,
   `errorlist.fieldsnotfound` `[]`, `warninglist.quotedphrasesnotfound` `[]`, and
   `errorlist.phrasesnotfound` holding the anchor **and nothing else** — precisely the pass criterion
   §5.0 specifies. §5.0's stated criterion is itself empirically correct. **S2 is the exception and is
   finding I-3.**
8. **ClinicalTrials.gov API v2.** `/api/v2/version` returns `apiVersion 2.0.5` and
   `dataTimestamp 2026-09-11T09:00:04` — identical to row 9, timestamp included. A deliberately invalid
   Essie area returns **HTTP 400** with `Error parsing query in Other terms: Unknown area name:` —
   reproducing the candidate's own method for validating `AREA[...]` grammar.
9. **OpenAlex citation direction, reproduced to the integer.** `W2741809807` reports
   `referenced_works_count: 54` and `cited_by_count: 1257`. `filter=cites:` → **1253** with
   `x_query.oql` "works where it cites (W2741809807)"; `filter=cited_by:` → **44** with oql "works where
   it's cited by (W2741809807)"; `filter=referenced_works:` → **1253**, identical to `cites:`. Every
   number and every direction claim in §3.4 is correct, including the warning that the shortfalls are
   unindexed references.
10. **UBERON:0002381 via EMBL-EBI OLS4.** Label "pectoralis major"; cross-references include `FMA:9627`,
    `NCIT:C33284`, `MA:0002354`, `SCTID:181624003`, `UMLS:C0585574`. Both identifier anchors in the
    questions file §2 resolve.
11. **`https://europepmc.org/searchsyntax` returns HTTP 404.** Row 7 is correct that it is not a current
    URL.
12. **Crossref routes.** `query.bibliographic` and `from-update-date:` filters return HTTP 200;
    `update-type:retraction` returned HTTP 429 (rate limit) on my call, which is transient, not a
    contradiction of row 10.
13. **FIPAT unreachable.** Connection failure, reproducing U1/SU3.

### 3.2 Diverged from the artifact, in the artifact's favour

14. **The Crossref Retraction Watch labs endpoint is up today.**
    `https://api.labs.crossref.org/data/retractionwatch` returned **HTTP 200** to me, where the
    candidate records HTTP 502 then 504 on 2026-09-11 (SU4). This is not a defect — it is SU6 behaving
    exactly as predicted ("every verification is a 2026-09-11 observation … all of it must be re-verified
    at execution time"), one day later. SU4's "unavailable" status is already stale, and the fallback
    ladder the candidate built for it was nevertheless the correct conservative response. SBLA-009 should
    re-check rather than assume either state.

### 3.3 Repository-side downstream compatibility, re-checked line by line

15. **`evidencePacketSchema` is exactly as both the candidate and R1 describe it.**
    `src/lib/content/schemas.ts:419-460` — `.strict()`, with `searches[]` a `.strict()` object of
    exactly `database`, `query`, `searchedAt`, `resultCount`; `includedSourceIds: string[]`; and
    `exclusions[]` a `.strict()` object of exactly `sourceId` and `reason`. There is no field for a
    retrieved total, for duplicates, or for `awaiting-full-text`. **SU8 and SE-U2 are accurate, and the
    gap they name is real.**
16. **SE-U1 is accurate.** `sourceSchema.type` (`:301-311`) has no `preprint` member, and
    `publication.status` (`:378-385`) is
    `current | corrected | expression-of-concern | retracted | superseded`, again with no preprint state.
17. **The evidence-packet superRefine** additionally forbids a source appearing in both
    `includedSourceIds` and `exclusions[]`, which is consistent with the plan's one-terminal-state rule
    but does not supply the missing fourth state.

### 3.4 The Cochrane claims R1 could not reach — now independently confirmed

This is the most substantive new verification in this round, and it cuts in the candidate's favour.

**Access behaviour, two clients, same machine, same minute.** I sent one plain `GET` for
`https://www.cochranelibrary.com/search-manager-help` with each client's own default `User-Agent`, no
substitution, no credentials:

| Client                        | Default `User-Agent` | Result                       |
| ----------------------------- | -------------------- | ---------------------------- |
| `curl 8.19.0` (Git Bash)      | `curl/8.19.0`        | **HTTP 419**, 0 bytes, twice |
| Node 24.20.0 `fetch` (undici) | `node`               | **HTTP 200**, 253,665 bytes  |

The curl result **reproduces the author's 419 of 2026-09-12 and R1's independent 419 exactly**. The
Node result shows the edge filter is client-specific, not a blanket block: the page is served to a
default client that is not curl. This extends, rather than contradicts, the candidate's own conclusion
that "the block response is not stable" — it is unstable across clients as well as across days. It does,
however, falsify one sentence the candidate built on it (finding M-10).

**Grammar, read once from the official page and compared with §6.2.** Every C1 syntax claim the
candidate downgraded to "Syntax unverified at scope time" is **correct**:

| Candidate claim (§6.2, §3.3, §3.5)                                                                                                      | Official page text                                                                                                                                                         | Verdict     |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `[mh vaccines]` explodes; `[mh ^vaccines]` does not; phrases need quotes                                                                | "By default, the term will be exploded Example: [mh vaccines] … insert a caret, ^, in front of the term Example: [mh ^vaccines] … put the phrase in quotes"                | **Correct** |
| `NEXT` is adjacency; `NEAR` and `NEAR/x` are proximity                                                                                  | "Supports use of NEAR, NEAR/X and NEXT … NEAR Finds the terms when they are within 6 words of each other"                                                                  | **Correct** |
| Wildcard root ≥ 3 characters; wildcards not allowed inside a quoted phrase                                                              | "the word root must be at least 3 characters. Do NOT use wildcards in quoted phrases, if using wildcards use NEXT operator"                                                | **Correct** |
| Field labels `:ti :ab :kw :au :pt :so :doi …`, combinable as `:ti,ab,kw`                                                                | "separate field labels using commas (:ti,ab,kw)"; `:so`, `:doi`, `:crg`, `:au`, `:pt` all documented                                                                       | **Correct** |
| `:kw` includes MeSH but without explosion                                                                                               | ":kw Keywords … Limit includes MeSH terms but does not allow for MeSH term explosion"                                                                                      | **Correct** |
| `:pt` values include `Retracted publication`, `Retraction of publication`, `Expression of concern`, `Preprint`, `Trial registry record` | All five appear under "Available publication types"; `:pt` is "Used only in CENTRAL"                                                                                       | **Correct** |
| §3.5 — only PubMed, MEDLINE and ClinicalTrials.gov records carry MeSH in CENTRAL                                                        | "only records from Pubmed, Medline and ClinicalTrials.gov have MeSH terms assigned. When searching with MeSH in CENTRAL only records from these sources will be retrieved" | **Correct** |

**What this means.** SU9's _correctness_ risk is retired: the CENTRAL half of D4, the `#5` wildcard rule
the author self-corrected, and the §3.5 MeSH caveat are all accurate. SU9's _provenance_ concern
survives — a page read once with a substituted user agent was not verification when it was made, and the
candidate is right to say so. The downgrade was honest and over-conservative in the safe direction, and
the instruction to re-verify inside an authenticated Search Manager session at SBLA-009 remains correct,
because the help page documents a UI, not CENTRAL's actual retrieval behaviour.

### 3.5 Reproduced from the candidate's own recorded checks

18. **The fenced-block integrity check reproduces exactly.** Re-implementing the handoff's described
    script: **10 fenced `text` blocks**, every one structurally balanced — parentheses net 0, brackets
    net 0, even quote count in all ten. The handoff's recorded result is accurate.
19. **The M-3 term counts reconcile.** The handoff records "`pectoral fly` 5, `pectoral flye` 4,
    `pec fly` 5, `pec flye` 4 — present in S2, S3, E1 (and C1 in `NEXT` form)". Literal quoted
    occurrences file-wide are 4 / 3 / 4 / 3; adding the one C1 `NEXT`-form occurrence each yields exactly
    5 / 4 / 5 / 4. The counting basis is not spelled out, but the figures reconcile on the reading the
    row's own parenthetical supplies, and the substantive claim is independently confirmed in §4 below.
    **Not a finding.**

---

## 4. Closure status of every R1 finding

Re-tested against the current files, not against the diff or the author's closure map.

### I-1 — the executed Europe PMC composite described as not executed → **CLOSED**

- **No denial survives.** A repository-wide grep of `research/` for "no composite question query",
  "composite question query was executed", "no search was", "no search has been" returns **zero
  matches**. R1 named three sentences; none remains.
- **The label is fixed.** Search strategy §0 now defines a fourth category, **Route-level composite
  count**, distinct from **Index diagnostic**, and states that exactly one exists.
- **The record is complete.** §4.2 gives database, route, endpoint, query, `searchedAt` 2026-09-11,
  `resultCount` 334, platform `version 6.9`, and "Identifiers examined: none — `resultType=idlist`".
- **§4.1 is now clean.** The single-term table carries a sentence stating that the composite count is
  _not_ in it and is recorded separately.
- **It is carried forward, not orphaned.** §5.0 "Carry-in from scope time" requires SBLA-009 to record it
  as its own `evidencePacketSchema.searches` row _and_ to record the amended string's run as a second
  row — "Two rows, two dates, two counts." Questions file §8 item 1 repeats the requirement.
- **The U2 consequence is stated in all four files** — questions §3 and the U2 row, search strategy §4.3,
  handoff "Known uncertainties" and D13 — each saying plainly that U2 is now being decided with one
  route-level yield figure visible, and each noting that the single-term counts that actually motivate
  widening Y were observed _before_ the composite ran.
- **The disclosure is protected.** §4.2 ends: "This disclosure stays in the file. It is not to be
  deleted, softened, or demoted to a footnote in any later revision."
- **D13 is rewritten** and now reads "bounded diagnostics were run deliberately; one of them was a
  search, and was mislabelled."

This is a complete and honest closure. R1's explicit instruction "do not delete the disclosure" was
followed.

### I-2 — plan mandates records the strict `evidencePacketSchema` cannot hold → **CLOSED as a declaration**

R1 asked for a declared unresolved item naming Codex, plus a corrected §8.3. Both delivered:

- **SE-U2** added at eligibility plan §8, naming the gap, stating it is not resolvable by this role, and
  routing it to Codex on an owner decision.
- **SU8** added at search strategy §10 for the search-record half.
- **§8.3 rewritten.** It now separates "what the **search record** must contain" (§9.8 step 2) from "what
  the **evidence packet** can hold", marks Platform version, `querytranslation` and Failures as "**No
  home in the schema**", and states outright that "R1 finding I-2 is correct that this section was the
  one that was wrong."
- **§6.4 added** to the eligibility plan, mapping all four states onto the packet and stating without
  smoothing that "the rule 3 arithmetic closes in the **screening log** … it does **not** close inside
  the packet, and it is not machine-checkable there."

I verified the schema facts myself (§3.3): the descriptions are accurate. The underlying schema defect
correctly remains open for Codex, which is what R1 intended. **One residue:** §1.2's reconciliation
formula was not brought into line with the four-state model — see M-9.

### M-1 — wrong exclusion-code count and unexplained numbering gap → **CLOSED**

I counted the definition rows myself: §5.1 six, §5.2 six, §5.3 three, §5.4 seven, §5.5 six = **28**. The
plan now says 28 (§5) and the handoff says "twenty-eight" (line 339) and explicitly records that
"thirty-one" was wrong by three. §5.3 now carries a paragraph explaining that `E-OUT-3` and `E-OUT-4` are
permanently reserved and why, tying it to EA3's stability requirement.

### M-2 — duplicate as both state and exclusion code → **CLOSED**

§6.4 states the decision explicitly — "**yes, duplicates go in `exclusions[]`**" under `E-REC-1` — gives
the reason (it is the only per-record structure the packet has, so a duplicate omitted from it vanishes
and the arithmetic stops closing), and instructs the screener not to also record a substantive code. §5's
preamble now says the one-primary-code rule "covers duplicates as well".

### M-3 — `pectoral fly` / `pec fly` spellings absent → **CLOSED, beyond the ask**

R1 asked for four forms in S2, S3 and E1. Programmatic extraction of the committed strings finds **all
eight** forms — `pectoral fly`, `pectoral flies`, `pectoral flye`, `pectoral flyes`, `pec fly`,
`pec flies`, `pec flye`, `pec flyes` — present in **S2 (8/8), S3 (8/8) and E1 (8/8)**, and C1
additionally carries `(pec NEXT fly*)`, `(pec NEXT flies)`, `(pectoral NEXT fly*)` and
`(pectoral NEXT flies)`. I confirmed all eight appear verbatim as `[tiab:~0]` phrases in PubMed's
returned `querytranslation` for the amended S2.

### M-4 — E1's exercise term set thinner than S2's → **CLOSED for free text**

Programmatic comparison of the two exercise blocks: S2's exercise block carries **48** `[tiab:~0]`
phrases; E1's carries **50** `TITLE_ABS:` phrases. The set difference _S2 minus E1_ is **empty** —
complete free-text parity. The two E1 extras, `multijoint` and `singlejoint`, exist in S2 as unquoted
`[tiab]` tokens, so they are covered on both sides. The file also self-declares the one asymmetry that
adding terms cannot fix (ordered `TITLE_ABS` phrases versus order-independent `[tiab:~0]`) and records it
as SU7. **One residue:** the MeSH sub-block is not at parity and that is not declared — see M-7.

### M-5 — Cochrane claims unreproducible and retrieval method imprecise → **CLOSED, both limbs**

R1 offered an either/or; the author did both.

- **Method recorded exactly.** §2's row-6 note states the sequence — plain `curl` → HTTP 403 on
  2026-09-11; the same single request re-sent with a browser `User-Agent` → HTTP 200, "page read once,
  and made no further request to that domain — no crawl, no link following, no search, and no retrieval
  of any record"; plain `curl` → HTTP 419 twice on 2026-09-12; R1's independent 419.
- **§9.6 reconciled in writing**, with the distinction drawn explicitly (retrieval of _content_ versus
  reading one public documentation page), and without pretending the user-agent substitution was
  nothing: "Substituting a `User-Agent` is nonetheless a workaround of the platform's own client filter,
  and this file does not pretend otherwise."
- **A narrower standing rule for SBLA-009** is set: "**do not substitute a user agent to reach any
  Cochrane URL**", repeated in §6.2's fallback.
- **The claims are downgraded.** §6.2, the CENTRAL half of D4 (§3.3) and the §3.5 caveat all now carry
  "Syntax unverified at scope time" and **SU9**, and the file states "no independent confirmation of the
  Cochrane Search Manager grammar exists at scope time, and this file claims none."

The remediation is exactly what R1 asked for. I add, as a matter of record, that the grammar is now
independently confirmed correct (§3.4), and that one sentence in the justification over-generalises
(M-10).

### Self-disclosed defects the review did not raise → both verified

- **C1 `#5` wildcard rule violation.** The file discloses that `fl*` breached its own three-character root
  rule and was replaced by `fly*` plus an explicit `flies`. I scanned every fenced block for wildcard
  roots shorter than three characters: **none remain**. The official page confirms the rule (§3.4) and
  confirms that wildcards belong with `NEXT`, which is what `#5` does.
- **SU7, Europe PMC proximity.** Recorded, not solved, and routed to SBLA-009 — the correct handling.

**R1 closure summary: 7 of 7 closed.** Two of them (M-3, M-4) were closed more thoroughly than requested,
and two defects the review missed were self-disclosed rather than fixed quietly.

---

## 5. Criterion-by-criterion result

Against the fourteen acceptance criteria the candidate states at
`research/packets/SBLA-008-handoff.md` "Acceptance criteria".

1. **Boundary — PASS.** Four paths, all modifications, all the claimed research files, matching the
   ledger claim. Nothing outside `research/`.
2. **Base — FAIL as the criterion is written.** The criterion states the parent is
   `0752d5021da72eed840f61ae06f6c1966906c177`. The candidate's parent is
   `2de2a3ef428139cbe20f934bb98fad8190d16d20`. The _artifact's_ provenance is sound — the handoff's
   "Round 2" Inputs section names `2de2a3e…` correctly, and the commit chain table is accurate — but the
   criterion a reviewer is told to apply is wrong. This is finding **I-4**.
3. **Two questions with structured fields — PASS.** Q1 decomposes into Q1a/Q1b/Q1c with a full PICO/PECO
   field table in which inapplicable cells are marked not-applicable **with a stated reason** rather than
   left blank or faked. Q2 carries P, I, C, O, T, setting, design eligibility and a fully specified
   estimand (§5.4) covering population, treatment and comparator conditions, endpoint, population-level
   summary, design contrast, intercurrent events with a preferred treatment-policy strategy, missing
   data, training-variable equating and measurement timing. Unchanged from R1 and still correct.
4. **Outcome hierarchy with priority order and hard limits — PASS.** Six rows; only tier 1 may support a
   hypertrophy claim; tier 4 EMG carries the mandatory §2.2 qualifier; tier 5 "never a reason to prefer
   either exercise"; harms are a mandatory parallel tier including zero-event and not-reported states.
   Rules H1–H3 close the remaining routes, including the §2.2 prohibition on reading "no significant
   difference" as equivalence.
5. **Exercise definitions reproducible — PASS.** Defining attributes / recorded modifiers / distinct
   conditions, plus the four-step thin-description procedure in eligibility §2.3 that resolves
   uncertainty _away_ from the index set.
6. **Search strings complete, copyable, valid — PASS with I-3 attached.** Five of six PubMed strings
   independently reproduced as parsing clean under the anchor. All ten fenced blocks are structurally
   balanced. The strings are copyable as written and the web execution path is intact. What fails is the
   documented **API** execution path for S2 — **I-3**.
7. **Every route records platform, query, filters, dates, dedup, updates, failure and fallback — PASS
   with I-3 attached.** §8.1 date semantics including the `[edat]`/`[crdt]`-versus-`[dp]` distinction for
   update runs; §8.2 five-step dedup ladder with the weakest key last and fuzzy matches flagged rather
   than merged; §8.3 now correctly separates the two recording contracts; §8.4 update cadence; §9 a
   thirteen-row failure matrix in which "not executed" is never recorded as zero results. The matrix has
   **no row for HTTP 414** — I-3.
8. **Screening rules operational — PASS with M-9 attached.** Design eligibility per question and per
   outcome tier; systematic reviews as signposts and contradiction sources only; language, publication
   status, multi-report linkage, §9.7-consistent retraction handling, the lawful acquisition ladder and
   `awaiting-full-text`; conflict resolution; one primary code per exclusion, 28 codes verified. The
   residue is §1.2's stale reconciliation formula — **M-9**.
9. **Deliberate contradiction search — PASS.** Five named targets including measurement-invalidity
   evidence; S4 runs unconditionally and is logged under the same rules as S1–S3;
   registry-to-publication reconciliation with a 24-month unpublished threshold; both-directions citation
   chaining; reference-list mining of opposing syntheses; retraction sweep before synthesis; limitations
   and conflicts extracted as fields; "searched and found nothing" recorded as a result distinct from
   "not run". Ten anti-cherry-picking rules in eligibility §6.1 and eight guards in search strategy §7.3.
   Unchanged and still the artifact's strongest section.
10. **Facts and methodology distinguishable — PASS, and improved.** Four labels now, not three; the
    eighteen-row verification log still gives URL, what was checked and what was observed; and row 6 is
    now explicitly marked as the one row a reader cannot reproduce. Counts borrowed from R1 are
    attributed to R1 with an exact locator (`reviews/evidence/SBLA-008-r1.md`, finding M-3, lines
    519–532 — I verified that range is M-3) and flagged "not re-run by this role".
11. **What was and was not run stated exactly; no scientific conclusion — PASS.** The R1 failure is
    repaired (I-1 above). On the second half I re-tested independently: a pattern scan of all four files
    for assertive constructions ("studies show", "has been shown to", "is more effective", "produces
    greater", "is superior", "proven to", "demonstrates that", "the data show") returns **zero matches**;
    a scan for universal certainty language returns only three hits, all of them process rules ("Null
    results are reported, always"), none scientific; and a scan for assertive sentences pairing an
    anatomical or exercise term with a causal verb returns one prose hit, which is the _question_ being
    asked, not an assertion. Borderline statements do exist — "a 1RM bench-press gain after bench-press
    training is partly practice", "acute swelling contaminates short intervals", "cross-education between
    limbs can contaminate the contrast" — and I considered each: all three are methodological cautions
    derived from master-plan §2.2's prohibitions, all are hedged or confidence-lowering, and none is
    offered as a finding about training. The criterion holds.
12. **Assumptions and unresolved decisions labelled with a named resolver — PASS on the files, FAIL as
    the criterion is written.** The files carry A1–A4, U1–U5, SA1–SA3, SU1–SU9, EA1–EA4, EU1–EU4, SE-U1
    and SE-U2 — thirty-three items, each typed and assigned, several with an explicit deadline. The
    criterion still lists "SU1–SU6 … SE-U1", omitting the four items this round added, which the same
    handoff elsewhere says it added. Part of **I-4**.
13. **Handoff stands alone — FAIL.** It uses the §13.6 headings, records two rounds' bases and ledger
    claims, gives thirteen numbered decisions with rejected alternatives, states plainly that
    `pnpm verify` could not run and shows the real engine error, and discloses the temporary
    `node_modules` junction. But its "Files created or modified" section and its acceptance criteria
    describe round 1 and contradict its own earlier sections. A reader with no other context is
    misinformed by the two sections the §13.6 contract makes load-bearing. **I-4**.
14. **Formatting and hygiene — PASS, and stronger than R1 could establish.** `git diff --check` across the
    candidate range is clean, exit 0. Prettier `--check` passes on all four paths **and** on the R1
    report — run by me, not asserted. Full `pnpm verify` passes, exit 0, under the pinned runtime.

**Criteria result: 11 PASS, 3 FAIL (criteria 2, 12 and 13 — all three are finding I-4).** Criteria 6, 7
and 8 pass on their own terms while carrying findings below.

---

## 6. The validator repair, verified as the remediation handoff requires

`reviews/releases/SBLA-008-validation-remediation-handoff.md` asks the R2 recheck to confirm four
things. I tested each by driving `loadAndValidateRecords()` against isolated fixture trees outside the
repository, so nothing in the candidate was touched.

The repair is four lines in `scripts/content/validate.mjs:36-38`: `isIgnored()` additionally skips a path
when `relativePath.startsWith('reviews/evidence/')` **and** the basename matches `/-r[1-9]\d*\.md$/i`.

| Fixture path                         | Result       | Expected |
| ------------------------------------ | ------------ | -------- |
| `reviews/evidence/SBLA-008-r1.md`    | **exempt**   | yes      |
| `reviews/evidence/SBLA-008-r2.md`    | **exempt**   | yes      |
| `reviews/evidence/SBLA-008-r12.md`   | **exempt**   | yes      |
| `reviews/evidence/notes.md`          | **rejected** | yes      |
| `reviews/evidence/SBLA-008-r0.md`    | **rejected** | yes      |
| `reviews/evidence/SBLA-008-r01.md`   | **rejected** | yes      |
| `reviews/evidence/SBLA-008-r1.txt`   | **rejected** | yes      |
| `reviews/evidence/SBLA-008-r1.md.md` | **rejected** | yes      |
| `research/packets/rogue.md`          | **rejected** | yes      |
| `content-drafts/muscles/draft.md`    | **rejected** | yes      |

Rejections all emit `RECORD_EXTENSION_UNSUPPORTED` at the exact path.

1. **The documented evidence-review Markdown path passes content validation — CONFIRMED.** Both in
   fixture and in reality: `pnpm verify` passes on the candidate with `reviews/evidence/SBLA-008-r1.md`
   present, printing "Content validation passed: 0 records." I additionally ran
   `node scripts/content/validate.mjs` in this worktree with **this report present at its final path**:
   "Content validation passed: 0 records.", exit 0. `reviews/evidence/SBLA-008-r2.md` is exempt by the
   same rule, in the real repository and not only in fixture.
2. **Arbitrary Markdown is still rejected — CONFIRMED.** `notes.md` fails exactly as the handoff's
   acceptance criterion requires. Round numbering does start at one: `-r0.md` is rejected.
3. **Structured review records are still parsed and validated — CONFIRMED.** A valid review JSON record
   placed beside the Markdown report validates and is counted (`records=1`, kind `review`); a YAML review
   record likewise. A record with `verdict: 'maybe'` is rejected `SCHEMA_INVALID` at `:verdict`, and a
   `pass` verdict carrying an unresolved `important` finding is rejected by `reviewRecordSchema`'s own
   refinement — "A passing review cannot have unresolved blocking findings". The repair did not weaken
   review-record validation.
4. **Claude role write authority is not broadened — CONFIRMED.** The change is confined to `isIgnored()`
   in the content validator. It touches no write-boundary checker, no policy file, and no role path list.
   `docs/runbooks/operating-policy.json` `writeBoundaries` is unchanged.

**Residual looseness, routed to Codex as an observation, not a finding against this candidate.** The
exemption keys on the `-r<positive integer>.md` **suffix** alone, not on the documented
`<task-id>-r<number>.md` form. These are also exempt: `reviews/evidence/arbitrary-r1.md`,
`reviews/evidence/-r1.md`, `reviews/evidence/SBLA-008-R3.MD` (the regex is case-insensitive), and
`reviews/evidence/nested/SBLA-009-r1.md` (the prefix test does not bound directory depth). None of this
admits _arbitrary_ Markdown, so the handoff's stated acceptance criterion holds and I do not treat it as
a defect. Whether the exemption should additionally require a task-id shape is Codex's call. See §9.

---

## 7. Findings

### Critical

None.

### Important

#### I-3 — The amended S2 string cannot be executed by the API path the plan documents; NCBI returns HTTP 414

**What the plan says.** Search strategy §5.0 gives "Two equivalent execution paths, both to be
recorded", the second being:

> **API:**
> `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=<url-encoded query>`,
> collapsing internal newlines to single spaces. Read `count` and `querytranslation`.

§5.0 also makes `querytranslation` mandatory and calls it "the only artifact that proves what PubMed
actually ran"; §8.3 repeats it as "Mandatory. It is the only proof of what PubMed actually executed."
§5.0's pass criterion for the anchored test begins "A string passes when the platform returns HTTP 200".

**What actually happens.** I submitted the committed S2 string (search strategy §5.2), newlines
collapsed, with the documented anchor appended, to the documented GET endpoint:

```
S2 documented GET: url length 4137 -> HTTP 414 Request-URI Too Long, Content-Length: 0
```

Three consecutive attempts, all HTTP 414 with an empty body. Response headers identify the origin as
NCBI's own server — `Server: Apache`, `Strict-Transport-Security: max-age=31536000; includeSubDomains;
preload`, `Referrer-Policy: origin-when-cross-origin`, `X-Ua-Compatible: IE=Edge` — and the same request
from `curl` returns the identical `HTTP/1.1 414 Request-URI Too Long` with the same headers. This is
NCBI rejecting the URI, not a local proxy.

**It is a length limit, and the remediation crossed it.** A synthetic bisection using only nonsense
OR-terms (no topical query, no yield observed) locates the threshold between 3,680 characters (HTTP 200)
and 4,490 (HTTP 414). Measuring the same string at both commits:

| S2, anchored, documented GET URL | Length    | Result       |
| -------------------------------- | --------- | ------------ |
| Pre-remediation, `56068c2`       | **3,803** | **HTTP 200** |
| Post-remediation, `383b632`      | **4,137** | **HTTP 414** |

I ran both. The pre-remediation string still executes and returns `count=0`, `fieldsnotfound: []`,
`quotedphrasesnotfound: []`. The M-3 and M-4 term additions — correct fixes, made for good reasons —
pushed S2 past NCBI's GET limit. S1 (2,973) and every other string remain under it.

**The recorded verification is true but its transport is not recorded.** §5.2 states that the amended S2
"was re-checked the same day with the §5.0 anchored zero-yield parse test: HTTP 200, `count` 0,
`errorlist.fieldsnotfound` empty, `warninglist.quotedphrasesnotfound` empty, `errorlist.phrasesnotfound`
holding the anchor and nothing else, and all eight added forms present verbatim as `[tiab:~0]` phrases in
the returned `querytranslation`." **Every one of those assertions is true and I reproduced all of them**
— but only by `POST` to `esearch.fcgi` with the query in the form body, which the file does not document
anywhere. A shorter anchor does not save it: the handoff's variant token is nine encoded characters
shorter and the URL is still over the limit.

**Why this is Important rather than Minor.**

1. §18 states SBLA-008's pass condition as "Review report passes scope, **reproducibility**, and
   contradiction-search criteria". A documented execution path that cannot execute the plan's central
   precision-arm query is a direct failure against a named acceptance dimension.
2. The two paths are asserted to be "equivalent" and both "to be recorded". For S2 one of them cannot be
   run at all, so that sentence is false as written.
3. §5.0's own pass criterion — "the platform returns HTTP 200" — is unsatisfiable for S2 on the
   documented API path, so the file's acceptance test contradicts the file's execution instructions.
4. The mandatory artifact is lost. `querytranslation` is obtainable from E-utilities; §5.0 names no other
   source for it. An executor following the file literally cannot produce, for S2, the one record the
   file calls the only proof of what PubMed ran.
5. The failure is silent and undiagnosable from the file. HTTP 414 with a zero-length body appears in no
   row of the §9 failure matrix, which does anticipate rate limiting and phrase-index decomposition. The
   plausible wrong reactions — concluding the string is malformed, or trimming terms to make it fit —
   would undo M-3 and M-4.
6. It is a regression introduced by this round and disclosed nowhere, in a round whose purpose was to
   repair accuracy defects.

**Why this is not Critical.** No scientific content is affected; the web execution path documented
immediately above the API path is unaffected; the fix is small and entirely inside Claude Research's
write boundary; and the substantive verification claim is true and independently reproducible.

**What the authoring role should do.** Record the `POST` form of the E-utilities call in §5.0 as the
required transport for strings over roughly 3,700 URL-encoded characters, note which strings that
currently affects, add an HTTP 414 row to the §9 failure matrix with `POST` as its fallback, state in
§5.2 which transport produced the recorded S2 result, and soften "two equivalent execution paths" to
reflect that they are not equivalent for every string. If the reviewer or owner prefers, splitting S2
into recorded sub-searches combined by history number is an alternative, but it changes the recording
contract and should not be chosen silently.

#### I-4 — The handoff's acceptance criteria and "Files created or modified" section describe round 1, not the committed candidate

The handoff is explicit that this matters: "Two rounds wrote these files. Both are recorded, because a
reviewer checking the boundary needs the claim that covers the commit they are looking at." Its Inputs
and Constraints sections do this correctly. Its tail sections do not.

**Evidence — the §13.6-mandated "Files created or modified" section.**

- `research/packets/SBLA-008-handoff.md:686` — "Created, all new, all committed in **one commit**".
- `:688-692` — a table of the four paths with line counts **414 / 746 / 552**.
- `:695` — "**Modified: none.** Deleted: **none.**"
- Actual, at the candidate: `git diff --name-status 2de2a3e 383b632` returns **four `M` entries**, and
  the files are **435 / 969 / 623 / 790** lines. `wc -l` and `git rev-parse <commit>:<path>` both
  confirm.
- The same document contradicts this at `:150-152`: "Exactly four files. **Round 1 created all four;
  round 2 modified the same four** and created, deleted and renamed nothing."

**Evidence — the acceptance criteria a reviewer is directed to apply.**

- Criterion 1 — "Check `git show --stat` on the commit against the ledger claim at
  `09f9ba4cfb4b505612035cb6c463b37a75a279ce`." That is the **round-1** research claim. The claim covering
  this commit is `247096a76affca6cc0040a71842997ef2d933a2b`, which the handoff itself names correctly at
  `:80-88`. The path check the criterion prescribes cannot be performed against the named claim.
- Criterion 2 — "**Base.** The commit's parent is `0752d5021da72eed840f61ae06f6c1966906c177`." The
  candidate's parent is `2de2a3ef428139cbe20f934bb98fad8190d16d20`. **The criterion is false for the
  commit it gates.** The handoff states the correct round-2 base at `:70-75`.
- Criterion 12 — lists "A1–A4, U1–U5, SA1–SA3, **SU1–SU6**, EA1–EA4, EU1–EU4, **SE-U1**". The same
  handoff at `:189-190` says "SU7, SU8, SU9 and SE-U2 were added during the remediation round". A
  reviewer checking criterion 12 as written would not look for, and would not verify, the four items that
  are this round's principal deliverable under I-2.

**Why this is Important rather than Minor.**

1. Two of the handoff's own acceptance criteria are wrong about the artifact they gate, and one of them —
   the base-commit check — is simply false. Applied literally, criterion 2 fails.
2. This is the mechanism by which the repository's integrity model actually operates. CLAUDE.md requires
   the next task to "start only from the commit it names"; AGENTS.md requires handoffs to cite exact
   commits; `operating-policy.json` fixes `restrictedRoleDiffBase` and
   `builderClaimCloses: "immutable-handoff-commit"`. A handoff that misidentifies its own base and its
   own ledger claim undermines the one artifact those rules rely on.
3. The §13.6 "Files created or modified" section states the **opposite of what happened** in a round
   whose entire content was modification, and does so 530 lines after the same document states it
   correctly. The handoff's criterion 13 — "This handoff stands alone" — is therefore not met.
4. It is not one stale number. It is eight stale statements across three required sections, in a round
   remediating M-1, which was a stale number. The pattern is that round-2 edits were applied to the body
   and not to the sections that certify the body.

**Why this is not Critical.** Every stale statement is contradicted by a correct statement elsewhere in
the same file; git is authoritative and was consulted; nothing scientific, methodological or
boundary-related is actually wrong; and the fix is mechanical.

**What the authoring role should do.** Update "Files created or modified" to state the round-2 truth —
four files modified, with the current line counts and, ideally, the blob or SHA-256 checksums so a
reviewer can pin them. Rewrite criteria 1 and 2 to name the commit under review, its parent `2de2a3e…`,
and the ledger claim `247096a7…` that covers it, keeping the round-1 pair alongside if both are wanted.
Extend criterion 12 to SU1–SU9 and SE-U1/SE-U2. Then re-read the remaining criteria against the committed
artifact rather than against round 1.

### Minor

Recorded with impact and follow-up destination, per CLAUDE.md. None of these blocks acceptance on its
own, and each is explicitly justified as nonblocking below.

#### M-6 — All three research files carry round-1 provenance, and the search strategy's header contradicts its own body

`research/questions/SBLA-008-vertical-slice.md:11-12`,
`research/searches/SBLA-008-search-strategy.md:7-8` and
`research/screening/SBLA-008-eligibility-plan.md:6-7` each state "Base commit:
`0752d5021da72eed840f61ae06f6c1966906c177`" and "Date written: 2026-09-11". The committed versions were
authored on 2026-09-12 from base `2de2a3ef…`; the questions file gained 21 lines, the search strategy 223
and the eligibility plan 71.

The search strategy is the sharper case: its header reads "**Date written and date of every verification
below: 2026-09-11**". The body contradicts this in five places — §2 row 6 records a 2026-09-12 fetch,
§5.2, §5.3 and §6.1 each record a 2026-09-12 anchored re-check, §4.1 carries R1's 2026-09-12 probes — and
**SU6 itself names the exception**: "Every verification is a 2026-09-11 observation, **except the
2026-09-12 re-checks recorded in §5.2, §5.3 and §6.1**."

**Impact.** Bounded but real. Dating every verification is this file's core integrity mechanism, and its
header now asserts a blanket date its own body disproves. A reader who trusts the header will mis-date
four verifications and will believe the files were written against a base they were not. It is
nonblocking because the body is correct everywhere the header is wrong, SU6 states the exception
explicitly, and git settles the base commit in one command. **Destination:** SBLA-008 remediation, with
I-4, which is the same root cause.

#### M-7 — E1's MeSH sub-block is still not at parity with S2's, and the omission is not declared under a heading that claims parity

`research/searches/SBLA-008-search-strategy.md:§6.1` states: "**Exercise block parity with S2 (M-4).** The
second block now carries every free-text exercise term from S2's exercise block … alongside the two MeSH
descriptors", then names one residual asymmetry and says "One asymmetry is **not** removable by adding
terms" (SU7, word order).

There is a second one, and it _is_ removable by adding terms. Extracting both blocks: S2's exercise
concept carries six MeSH descriptors — `Resistance Training`, `Weight Lifting`, `Exercise`,
`Exercise Therapy`, `Exercise Test`, `Athletic Performance` — while E1's carries two,
`Resistance Training` and `Weight Lifting`. `Exercise` D015444, `Exercise Therapy` D005081,
`Exercise Test` D005080 and `Athletic Performance` D054874 are absent from E1 and their absence is stated
nowhere.

**Impact.** Small and possibly zero, and I say so rather than inflating it. A Europe PMC record indexed
under one of the four missing descriptors but carrying no matching free-text exercise phrase in title or
abstract is reachable by S2's exercise block and not by E1's. Working against that: E1 imposes **no
outcome-concept block at all**, where S2 requires one, so E1 is broader than S2 in a larger dimension
than it is narrower in this one; and I could not quantify the effect because Europe PMC was returning 503
throughout this session (§2.4). The defect is therefore one of declaration rather than of retrieval: a
heading that says "parity", followed by an enumeration of residual asymmetries that omits one, on the
route §4.3 designates as most likely to hold whatever evidence exists for Exercise Y. Nonblocking because
the free-text parity R1 asked for is complete and verified, and because the direction of the residual
effect is unclear rather than adverse. **Destination:** SBLA-008 remediation — either add the four
`MESH:` terms or state in §6.1 why they are deliberately omitted; if Europe PMC's `MESH:` handling of
them cannot be verified, record it with SU7.

#### M-8 — The handoff and §5.0 disagree about the zero-yield anchor that was actually used

`research/searches/SBLA-008-search-strategy.md:416-417` defines the anchor as
`AND zzzqqqnonsenseanchor[tiab]` for PubMed and `AND (TITLE_ABS:"zzzqqqnonsenseanchor")` for Europe PMC,
and calls it "the test to use whenever a string is amended at scope time".
`research/packets/SBLA-008-handoff.md:560` records "each composite anchored with
`AND zzzqqqnonsense[tiab]`" and `:565` records the Europe PMC anchor as "real string
`AND (TITLE:"zzzqqqnonsense")`". Two mismatches: a different token, and a different Europe PMC field
(`TITLE` versus `TITLE_ABS`).

**Impact.** Bounded. Both tokens are nonsense and both fields are valid, so the result is unaffected and I
reproduced the substantive outcome with the §5.0 form for S1 and S3–S6. But §5.0's own contract is to
record "the string exactly as submitted, before any URL encoding", and here the two files give two
different submitted strings for the same test, so the exact call cannot be reconstructed. It is
nonblocking because the check's outcome is reproducible under either anchor. **Destination:** SBLA-008
remediation; make the handoff quote the §5.0 anchor verbatim, or state that two different anchors were
used on the two dates.

#### M-9 — §1.2's reconciliation formula omits `awaiting-full-text` and contradicts rule 3, §4.5, EA1 and the new §6.4

`research/screening/SBLA-008-eligibility-plan.md:67-68` states: "**Counts must reconcile.** Retrieved −
duplicates − stage-1 exclusions − stage-3 exclusions = included. A discrepancy is a defect, not a
rounding issue."

Four other places in the same file make `awaiting-full-text` a fourth terminal state that this formula
does not account for: §4.5 ("It is **not** an exclusion and **not** an inclusion"; "the count of
`awaiting-full-text` records is reported alongside the inclusion count"); §6.1 rule 3 ("Every retrieved
record ends in exactly one state: duplicate, excluded with a code, `awaiting-full-text`, or included");
EA1 (that four-way outcome is exhaustive); and the newly written §6.4, which tabulates all four states.
The formula is unchanged from the R1 candidate — `git show 56068c2` returns the identical two lines — so
the remediation round rewrote §6.4 around the four-state model without reconciling §1.2 to it.

**Impact.** Whenever the `awaiting-full-text` count is non-zero — which §4.5 says is expected, and whose
size §4.5 makes a reason to lower certainty — §1.2's equation cannot balance. A screener applying §1.2
literally is told that this "is a defect, not a rounding issue", and the cheapest way to make it balance
is to push `awaiting-full-text` records into an exclusion bucket, which is precisely the failure §4.5
exists to prevent ("collapsing it into 'excluded' makes the review look more complete than it is"). This
is nonblocking because the governing reading is unambiguous — three later, more specific statements agree
against one earlier one, and §6.4 tabulates the correct model explicitly — so a screener reading the file
whole will not be misled. It is recorded because R1's M-2 was the same class of defect and because a
one-line formula is exactly the kind of thing a screener applies without re-reading §6.4.
**Destination:** SBLA-008 remediation, before any record is screened; add the `− awaiting-full-text`
term, or point §1.2 at rule 3 and §6.4.

#### M-10 — §2's row-6 note generalises a curl-specific block into a claim that no reader can reproduce it, which is false

`research/searches/SBLA-008-search-strategy.md:105-107` concludes the row-6 note: "So the block response
is not stable even across two days for the same class of client, and **no reader can be told 're-run this
call and compare'** — the standard every other row in this log meets." §6.2 opens by calling row 6 "a
single reading **no reader can reproduce**".

On 2026-09-12 — the same date as the author's 419 and R1's 419 — I sent a single plain `GET` for the same
URL from two clients on one machine within four seconds of each other, with neither client's `User-Agent`
substituted:

| Client                        | Default `User-Agent` | Result                      |
| ----------------------------- | -------------------- | --------------------------- |
| `curl 8.19.0`                 | `curl/8.19.0`        | HTTP 419, 0 bytes, twice    |
| Node 24.20.0 `fetch` (undici) | `node`               | **HTTP 200, 253,665 bytes** |

The curl result reproduces the author's and R1's exactly. The Node result falsifies the generalisation:
the edge filter is client-specific, not a blanket block, and a reader _can_ be told to re-run and compare.
I then compared the page against §6.2, §3.3 and §3.5 and **every C1 syntax claim is correct** (§3.4).

**Impact.** Entirely in the conservative direction, which is why it is Minor and not more. The downgrade
to SU9 and "Syntax unverified at scope time" was honest when made and remains the right status for the
author's own reading; the standing rule against substituting a user agent is correct and should stay; and
the instruction to re-verify inside an authenticated Search Manager session is right regardless, because
the help page documents a UI rather than CENTRAL's retrieval behaviour. What the sentence costs is
accuracy — it states as fact something a reviewer disproves in one call — and it tells SBLA-009 that a
cheap verification route is closed when it is not. **Destination:** SBLA-008 remediation, or SBLA-009 when
it discharges SU9; narrow the sentence to what was observed ("plain `curl` was blocked on both dates;
other clients may not be"), and consider recording that the grammar has since been independently
confirmed.

---

## 8. Verdicts on the declared assumptions and unresolved decisions

Thirty-three declared items. I re-checked each against the current files. Blocking severity is stated
against the pipeline stage each one actually gates. Where R1 already ruled and nothing changed, I concur
without restating its reasoning.

**Unchanged from R1 and still accepted, non-blocking:** A1, A3, A4, SA2, SA3, SU1, SU2, SU3, SU5, EA2,
EA3, EA4. **Unchanged and still deadline-bound:** A2 (before extraction), U3/EU1 (before screening),
U4/EU3 (before extraction), U5/EU4 (before screening).

Changed, newly added, or worth restating:

- **U2 / EU2 — BLOCKING before search execution, and the urgency is now recorded in the artifact.** The
  files no longer merely assign it; they state in four places that it is being decided with one
  route-level yield figure visible and that the owner should record the decision with its rationale so a
  later reader can judge whether the 334 bore on it. That is the right handling of an irreversible
  disclosure, and D12's refusal to substitute the pec deck now — because it "would have made the searches
  look healthier while changing the question the owner asked for" — remains the correct call.
- **SA1 (term coverage is the most likely defect) — correct self-assessment, and it was again.** R1 found
  M-3 and M-4; this round finds M-7, a residue of the same kind. SA1 should stay live for SBLA-009.
- **SU4 (Crossref Retraction Watch labs endpoint) — accepted, but already stale.** The endpoint returned
  HTTP 200 to me today (§3.2). Non-blocking either way; the verified fallbacks are adequate and §9.7's
  rule that publication stays blocked until a check succeeds is the right default.
- **SU6 (everything is a 2026-09-11 observation and must be re-verified) — accepted, and independently
  validated twice in one day.** SU4's endpoint came back up and the Cochrane block changed behaviour by
  client. SU6 is doing real work and must be kept. Note that the search strategy's own header contradicts
  SU6's exception clause — M-6.
- **SU7 (no verified Europe PMC proximity operator) — accept as recorded. Non-blocking for search;
  blocking for any claim that E1 and S2 retrieve comparably.** Self-identified during remediation, which
  is the right instinct. I could not test it: Europe PMC was down (§2.4). Interacts with M-7.
- **SU8 / SE-U2 (the strict `evidencePacketSchema` cannot hold the mandated records) — accurate,
  correctly routed to Codex, and BLOCKING before SBLA-009 writes an evidence packet**, not before it
  searches. I confirmed the schema facts myself (§3.3). These are I-2's declaration and they discharge
  what R1 asked for. Decide them together with SE-U1: all three are the same class and should be one
  Codex decision.
- **SU9 (Cochrane Search Manager grammar unverified at scope time) — accept the status, with a material
  update.** The grammar is now independently confirmed correct (§3.4), so SU9's correctness risk is
  retired and only its provenance concern remains. It stays blocking before `#9` of C1 is run — the
  file's own instruction, to confirm the `:pt` value inside the Search Manager or drop the line rather
  than run it blind, is still right, because a help page is not CENTRAL's behaviour.
- **SE-U1 (`sourceSchema` has no preprint type or status) — accurate, confirmed by me, correctly routed.
  Blocking before SBLA-009 records a preprint source**, not before it searches.
- **EA1 (the four-way record outcome is exhaustive) — sound as a screening rule; blocked downstream by
  SE-U2 and internally contradicted by §1.2 (M-9).**

---

## 9. Out-of-scope observations routed to Codex

Neither is a defect in the candidate, and I have no authority to act on either.

1. **The evidence-review Markdown exemption is keyed on suffix, not on the documented report form.**
   `scripts/content/validate.mjs:36-38` exempts any `reviews/evidence/**` basename matching
   `/-r[1-9]\d*\.md$/i`. It therefore also exempts `arbitrary-r1.md`, `-r1.md`, `SBLA-008-R3.MD` and
   `nested/SBLA-009-r1.md`. The remediation handoff's constraint was to "Match only the documented
   append-only `<task-id>-r<number>.md` report form"; the implementation matches the `-r<number>.md` half
   of it. Its stated acceptance criteria all hold — arbitrary Markdown such as `notes.md` is still
   rejected, `-r0.md` is rejected, structured records are still validated — so this is a question of how
   tightly Codex wants the pattern bound, not a failure. Verified in §6.
2. **The repository still does not require a structured review record beside a Markdown report.** The
   remediation handoff already names this as a known uncertainty and calls it "a separate data-model
   decision". I confirmed that `reviewRecordSchema` exists, validates, and enforces its own refinements
   including "A passing review cannot have unresolved blocking findings", but that nothing requires one to
   accompany a report. Recording it so the decision is not lost.

**On the reviewer-authored formatting edit to the R1 report.** Commit `eefefd20` changed two lines of
`reviews/evidence/SBLA-008-r1.md` after it was committed. Review reports are append-only, so I checked it
strictly: `git diff --word-diff --ignore-all-space 5d51959 eefefd2` on that path is **empty**, i.e. the
change is whitespace-only — leading indentation removed from two continuation lines inside inline code
spans. No finding, severity, path, or verdict was altered, and the edit is disclosed in both the
coordination ledger and the handoff. The report has been byte-stable since. I record this as verified and
benign rather than as a finding, and note that the cleaner pattern would have been to add the path to
`.prettierignore`, as the repository already does for five other immutable Account-B reports.

---

## 10. What must be resolved before SBLA-009 begins

**Before this candidate can be accepted — two items, both with the authoring role.**

1. **I-3.** Document the working execution path for S2 and add the HTTP 414 failure row.
2. **I-4.** Bring the handoff's "Files created or modified" section and acceptance criteria 1, 2 and 12
   into line with the committed candidate.

**Before search execution — one item, unchanged from R1.**

3. **U2 / EU2.** Whether Exercise Y may be widened, taken as an explicit revised scope file with a date
   and a reason, and recorded together with the fact that one route-level yield figure was visible when it
   was taken.

**Before an evidence packet is written — three items, none of them inside the Claude roles' write
boundaries.**

4. **SE-U2 / SU8.** How `awaiting-full-text`, duplicates, a retrieved total, platform version,
   `querytranslation` and failures are recorded given the strict `evidencePacketSchema`.
5. **SE-U1.** How preprints are typed and status-tracked.
6. Decide 4 and 5 together; they are one schema decision for Codex on an owner ruling.

**Before screening — U3 / EU1, U5 / EU4, and M-9. Before extraction — A2 and U4 / EU3.**

Everything else is non-blocking and correctly carried.

---

## 11. Remaining uncertainties in this review

Stated so nobody reads coverage into this report that it does not have.

1. **Europe PMC route E1 is unverified by me.** The REST `search` endpoint returned HTTP 503 to every
   request throughout this session, including a trivial one-term probe, so the service was down. I could
   not run the anchored E1 parse test, could not confirm the amended E1 string parses, and could not
   quantify M-7. R1 reproduced the pre-remediation E1 on 2026-09-11; the post-remediation string is
   confirmed by nobody but its author.
2. **The Cochrane grammar is confirmed; CENTRAL's behaviour is not.** §3.4 verifies what the official help
   page says. It does not verify that CENTRAL behaves as documented, and in particular it does not verify
   that `[pt "Retraction of publication"]` retrieves anything in CENTRAL. SU9's execution-time instruction
   stands.
3. **I did not test PROSPERO or SportRxiv syntax** (SU1, SU2), or re-test FIPAT beyond confirming the
   connection failure. The candidate already carries all three as unverified.
4. **I observed no question-level yield and therefore cannot assess actual retrieval.** Every composite I
   ran carried the zero-yield anchor. Whether these strings retrieve the right records is unknown to this
   review and unknowable at the `scope` stage; SA1 remains the right place to push.
5. **`pnpm verify` passed under my own hand but is not boundary evidence.** Per CLAUDE.md the role-path
   boundary result must come from Codex or CI with `--repository`. That evidence is recorded in the
   coordination claim; I did not produce it and do not restate it as mine.
6. **The 3,680–4,490 character window for the E-utilities GET limit is my measurement, not NCBI's
   documented figure.** I did not open NCBI's API documentation in this session and make no claim about
   what it states. The HTTP 414 for S2 is directly observed and reproduced by two clients; the exact
   threshold is approximate.
7. **The M-3 term counts in the handoff reconcile on a reconstruction, not on a stated method.** §3.5 item
   19 gives the reconstruction. If the author's script counted differently, the figures may differ for a
   reason I have not identified. I did not treat it as a finding.
8. **I did not re-verify the master plan's own external references** (GRADE, Cochrane Handbook, PRISMA,
   CONSORT), matching the candidate's SU5 position.

---

## 12. Checks run in this session, with real output

Repository checks, run by me in `C:\src\s008r2`:

- `git rev-parse 383b632^{commit}` → `383b63244aabb19404046dbd4a5aeb1589175346`
- `git rev-parse 383b632^{tree}` → `975f154a164aa6779107c1b9f7ad4e820ba46793`
- `git rev-parse 383b632^` → `2de2a3ef428139cbe20f934bb98fad8190d16d20`
- `git diff --name-status 383b632^ 383b632` → four lines, all `M`, all under `research/`
- `git diff --shortstat 383b632^ 383b632` → `4 files changed, 772 insertions(+), 237 deletions(-)`
- `git diff --check 383b632^ 383b632` → no output, exit 0
- `git cat-file -t 4a15014` → `commit`; `git rev-parse codex/SBLA-007-review-coordination` →
  `4a1501452d860ddd106a9b7d764e1a6f9f4584ad`
- `git diff eefefd2 383b632 -- reviews/evidence/SBLA-008-r1.md` → empty
- `git diff --word-diff --ignore-all-space 5d51959 eefefd2 -- reviews/evidence/SBLA-008-r1.md` → empty
- `sha256sum` on the four candidate files and the R1 report → recorded in the header block
- `corepack pnpm install --frozen-lockfile` → Done in 18.9s using pnpm v11.24.0
- `corepack pnpm verify` → **exit 0**; 16 unit test files / **234 tests**, 3 portability files / **17
  tests**, `astro check` 55 files 0 errors 0 warnings 0 hints, "Content validation passed: 0 records.",
  graph and evidence validation pass, `astro build` 1 page, "Foundation contract passed", asset spike and
  decision gates pass
- `prettier --check` on the four research paths and the R1 report → "All matched files use Prettier code
  style!", exit 0
- Validator fixture probes against `loadAndValidateRecords()` on isolated trees → results tabulated in §6

External checks, run by me on 2026-09-12 against official endpoints, every composite carrying the
documented zero-yield anchor: **24 reproduced** (§3.1, §3.3, §3.4, §3.5), **1 diverged in the artifact's
favour** (§3.2, Crossref Retraction Watch up), **1 new reproducible failure** (§7, I-3, S2 HTTP 414),
**4 carried as unverified** (§2.4).

Not run by me, stated plainly rather than implied: `pnpm test:e2e`, `pnpm test:a11y`, `pnpm test:visual`,
`pnpm test:performance`, and the role-path boundary checker with `--repository`.

---

## 13. Files written by this review

`reviews/evidence/SBLA-008-r2.md` — this file, and nothing else. The candidate commit, the four research
files, `reviews/evidence/SBLA-008-r1.md`, `reviews/releases/`, `content/`, `content-drafts/`, schemas,
scripts, tests, configuration and `docs/runbooks/current-work.md` are all unmodified. A `node_modules/`
directory was created in this worktree by `pnpm install` to run the repository gate; it is gitignored, was
never staged, and appears in no diff.
