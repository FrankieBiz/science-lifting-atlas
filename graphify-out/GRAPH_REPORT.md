# Graph Report - sciatlas  (2026-09-11)

## Corpus Check
- 150 files · ~306,382 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 713 nodes · 1075 edges · 50 communities (37 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output
- Token accounting note: semantic extraction was performed by separately metered
  agent sessions, so Graphify's local counters do not include their actual
  consumption. Treat the zero figure as **unavailable**, not free.

## Community Hubs (Navigation)
- Asset Scoring
- Blender Conversion
- Asset Benchmarking
- Toolchain Dependencies
- Mesh Mapping
- Static Server Portability
- Foundation Contract
- Content Schemas
- Asset Coverage Gates
- Verification Commands
- Content Validation
- Conversion Tests
- Architecture Decisions
- Content Validation Logic
- SBLA-006 and 007 Reviews
- Asset Decision Gate
- Role Boundary Checker
- Benchmark Tests
- Anatomy Asset Evidence
- SBLA-002 Governance Reviews
- Role Checker Tests
- Browser Benchmark Harness
- TypeScript Configuration
- SBLA-004 and 005 Reviews
- Claude Readiness
- Work Ledger and Plan
- Evidence Fixtures
- SBLA-003 Reviews
- Record Schema Tests
- Anatomy Asset Decision
- Operating Model
- Hosting Quotas
- Project Planning
- SBLA-001 Reviews
- Asset Gate Tests
- Windows Handoffs
- PLAN-001 Remediation
- Asset Candidate Selection
- Evidence Status Workflow
- Schema Design
- Asset License Notice
- Editorial Style
- Independent Review Policy
- Health Endpoint

## God Nodes (most connected - your core abstractions)
1. `scripts` - 26 edges
2. `vitest` - 23 edges
3. `main()` - 20 edges
4. `runFullBenchmark()` - 14 edges
5. `validatePerformanceRecord()` - 12 edges
6. `runCli()` - 12 edges
7. `deriveCriterionScore()` - 11 edges
8. `isRecord()` - 10 edges
9. `loadAndValidateRecords()` - 10 edges
10. `raw_glb_evidence()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `SBLA-005 Derived Anatomy Poster` --conceptually_related_to--> `Gate A Anatomy Asset Decision Validator`  [AMBIGUOUS]
  assets/derived/bodyparts3d/sbla005-poster.webp → reviews/releases/SBLA-006-r2.md
- `loadAndValidateRecords()` --calls--> `validateRecord()`  [EXTRACTED]
  scripts/content/validate.mjs → src/lib/content/schemas.ts
- `Chat-Only Source Transfer Fallback` --conceptually_related_to--> `SBLA-002 Claude Research Readiness Handoff`  [INFERRED]
  docs/runbooks/claude-environments.md → research/packets/SBLA-002-claude-research-readiness-handoff.md
- `Current Work Ledger` --references--> `PLAN-001 Round 1 Acceptance Review`  [EXTRACTED]
  docs/runbooks/current-work.md → reviews/releases/PLAN-001-r1.md
- `pnpm Workspace` --conceptually_related_to--> `SBLA-001 Repository Foundation Plan`  [INFERRED]
  pnpm-workspace.yaml → docs/superpowers/plans/2026-08-29-sbla-001-repository-foundation.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gate A Anatomy Asset Architecture** — anatomyassetdecision_gate_a, anatomyassetdecision_authoritative_2d, anatomyassetdecision_bodyparts3d_enhancement, anatomyassetdecision_2d_fallback [EXTRACTED 1.00]
- **BodyParts3D Selection Evidence Chain** — meshmapping_bodyparts3d_coverage, feasibility_bodyparts3d_conversion, conversionmanifest_bodyparts3d_artifacts, performance_bodyparts3d_glb [EXTRACTED 1.00]
- **Pectoralis Major Evidence Record** — recordsvalid_resistance_trial_source, recordsvalid_pec_major_claim, recordsvalid_evidence_packet, recordsvalid_claim_review, recordsvalid_claim_change [EXTRACTED 1.00]
- **Accepted Architecture Decisions** — adr_0001_static_first, adr_0002_content_graph, adr_0003_hosting_assets, docs_adr_0004_analytics, adr_0005_zero_cost, adr_0006_validation_gates [EXTRACTED 1.00]
- **SBLA-006 Hybrid Delivery Decision** — gate_a_asset_decision, two_d_authoritative_hybrid, two_d_text_fallback, bodyparts3d_4 [EXTRACTED 1.00]
- **SBLA-002 Readiness Evidence Artifacts** — docs_runbooks_claude_environments_readiness_record, sbla002_readiness_question, sbla002_readiness_extraction, sbla002_research_handoff, docs_runbooks_claude_environments_sbla002_acceptance [EXTRACTED 1.00]
- **PLAN-001 Acceptance Review Set** — execution_quality_correction_plan, execution_quality_design, plan001_builder_handoff, plan001_acceptance_criteria, plan001_round1_review, plan001_drift_detection_gap [EXTRACTED 1.00]
- **SBLA-007 Evidence Schema Delivery** — evidence_schemas_plan, evidence_schemas_design, docs_runbooks_current_work_ledger [EXTRACTED 0.90]
- **SBLA-002 Iterative Readiness and Acceptance Cycle** — sbla002_handoff, sbla002_round1_review, sbla002_round2_review, sbla002_round3_review, sbla002_round4_review, sbla002_round5_review [EXTRACTED 1.00]
- **SBLA-003 Review and Remediation Cycle** — sbla003_handoff, sbla003_round1_review, sbla003_internal_round1_review, sbla003_resource_collector_addendum, sbla003_round2_review [EXTRACTED 1.00]
- **Asset Evaluation to Gate A Decision Chain** — sbla004_handoff, sbla004_round2_review, sbla005_handoff, sbla005_round1_review, sbla006_handoff, sbla006_2d_authoritative_decision [EXTRACTED 1.00]
- **SBLA-006 Independent Acceptance Evidence** — sbla006_r1_review, sbla006_adversarial_mutation_battery, sbla006_primary_license_verification, sbla006_browser_acceptance, sbla006_r2_review [EXTRACTED 1.00]
- **SBLA-007 Validator Delivery** — sbla007_handoff, sbla007_shared_zod_authority, sbla007_validation_commands, sbla007_authoring_error_guide [EXTRACTED 1.00]
- **SBLA-007 Review and Remediation Chain** — sbla007_r1_review, sbla007_timestamp_ordering_defect, sbla007_change_review_date_defect, sbla007_causal_calibration_defect, sbla007_r2_review, sbla007_date_phrase_bypass, sbla007_trailing_calibration_regression [EXTRACTED 1.00]

## Communities (50 total, 7 thin omitted)

### Community 0 - "Asset Scoring"
Cohesion: 0.07
Nodes (54): ACCEPTED_LEGACY_LICENSE_SHA256, ASSET_SCORE_RUBRIC, CRITERION_CONTRACT_SHA256, DATE_FIELDS, deepFreeze(), deriveCoverageScore(), deriveCriterionScore(), deriveLicenseScore() (+46 more)

### Community 1 - "Blender Conversion"
Cohesion: 0.06
Nodes (56): accessor_values(), args_after_double_dash(), baseline_auth_probe(), clear_scene(), decoded_glb_structure(), digest(), digest_bytes(), external_source() (+48 more)

### Community 2 - "Asset Benchmarking"
Cohesion: 0.09
Nodes (48): aggregates(), BENCHMARK_PROTOCOL, bindPerformanceEvidence(), browserMeasurement(), BUDGETS, bytesPerComponent(), CAMERA_FIT_CONTRACT, componentBytes (+40 more)

### Community 3 - "Toolchain Dependencies"
Cohesion: 0.05
Nodes (42): devDependencies, astro, @astrojs/check, cookie, eslint, eslint-config-prettier, eslint-plugin-astro, eslint-plugin-jsx-a11y (+34 more)

### Community 4 - "Mesh Mapping"
Cohesion: 0.12
Nodes (29): prettier, ARCHIVES, argumentsFrom(), buildMeshMapping(), canonicalize(), crc32(), CRC32_TABLE, descendants() (+21 more)

### Community 5 - "Static Server Portability"
Cohesion: 0.10
Nodes (26): CONTENT_TYPES, filesystemErrorStatus(), isInside(), ADR-0003, respondToFilesystemError(), serveRequest(), serveStaticDirectory(), appendSameOriginReferences() (+18 more)

### Community 6 - "Foundation Contract"
Cohesion: 0.09
Nodes (24): EXPECTED_PACKAGE_MANAGER, hasOrderedVerifySteps(), REQUIRED_PATHS, REQUIRED_SCRIPTS, REQUIRED_VERIFY_STEPS, REQUIRED_WORKFLOW_SNIPPETS, validateFoundation(), FORBIDDEN_DOC_SNIPPETS (+16 more)

### Community 7 - "Content Schemas"
Cohesion: 0.07
Nodes (29): collections, certaintySchema, ChangeRecord, changeRecordSchema, checksumSchema, claimSchema, commonEntityFields, commonEntitySchema (+21 more)

### Community 8 - "Asset Coverage Gates"
Cohesion: 0.11
Nodes (16): vitest, COVERAGE_TARGETS, evaluateCoverage(), findUnexpectedRecordFiles(), FOUNDATION_PAGE_CONTRACT, FOUNDATION_PERFORMANCE_BUDGETS, FOUNDATION_VIEWPORTS, copyScript() (+8 more)

### Community 9 - "Verification Commands"
Cohesion: 0.08
Nodes (26): scripts, assets:benchmark, assets:conversion:contract, assets:coverage, assets:decision, assets:full-benchmark, assets:mesh-map, assets:spike (+18 more)

### Community 10 - "Content Validation"
Cohesion: 0.17
Nodes (16): isIgnored(), issue(), KIND_BY_PREFIX, kindForPath(), loadAndValidateRecords(), main(), parseRecordText(), printIssues() (+8 more)

### Community 11 - "Conversion Tests"
Cohesion: 0.14
Nodes (14): ArtifactFinals, baselineFixture(), conversionPath, MutableGlbDocument, receiptPath, runBaselineAuthProbe(), runPolicyProbe(), runPython() (+6 more)

### Community 12 - "Architecture Decisions"
Cohesion: 0.14
Nodes (18): ADR 0001 Static-first Architecture, ADR 0002 Content Data and Graph, ADR 0003 Hosting and Asset Delivery, ADR 0005 Zero-cost Infrastructure, ADR 0006 Execution Quality and Validation Gates, Architecture Decision Record Index, Cloudflare Pages Free, ADR 0004 Analytics in Release 1 (+10 more)

### Community 13 - "Content Validation Logic"
Cohesion: 0.22
Nodes (14): Certainty, ClaimRecord, SourceRecord, assertIsoDate(), issue(), lintClaimLanguage(), RecordGraph, validateAsOfDate() (+6 more)

### Community 14 - "SBLA-006 and 007 Reviews"
Cohesion: 0.16
Nodes (17): SBLA-006 Browser Acceptance Evidence, Gate A Packet Integrity Gap, DBCLS Primary License Verification, SBLA-006 Independent Review R1, SBLA-006 Independent Review R2, Unvalidated Gate A Declarative Guardrails, Evidence Record Error Authoring Guide, Categorical Causal Calibration Bypass (+9 more)

### Community 15 - "Asset Decision Gate"
Cohesion: 0.21
Nodes (14): EXPECTED_DECISION, EXPECTED_EVIDENCE_PATHS, EXPECTED_MISSING_TARGET_IDS, extractGatePacketDecisionDigest(), isNonEmptyString(), isRecord(), readJson(), resolveRepositoryRoot() (+6 more)

### Community 16 - "Role Boundary Checker"
Cohesion: 0.18
Nodes (13): allowedPaths, arguments_, changedEntries, changedPaths, execFileAsync, git(), issues, rawTokens (+5 more)

### Community 17 - "Benchmark Tests"
Cohesion: 0.18
Nodes (12): cameraFit, glbUrl, harnessUrl, manifestUrl, MutableProfile, MutableRecord, MutableRun, PerformanceAssessment (+4 more)

### Community 18 - "Anatomy Asset Evidence"
Cohesion: 0.19
Nodes (13): 2D/Text Fallback for Unmapped Targets, Authoritative 2D Semantic Vector and Text, Bounded BodyParts3D Enhancement, BodyParts3D CC BY 4.0 License, Gate A Anatomy Asset Decision, BodyParts3D Browser Benchmark, Published BodyParts3D Conversion Manifest, Pre-release Conversion Baseline Receipt (+5 more)

### Community 19 - "SBLA-002 Governance Reviews"
Cohesion: 0.17
Nodes (13): SBLA-002 Role-Path Boundary Gate Gap, SBLA-002 Claim Lifecycle Gap, SBLA-002 External Claude Readiness Gate Gap, SBLA-002 Agent Operating Model Handoff, SBLA-002 Operating-Model Contract Gap, SBLA-002 Round 1 Independent Review, SBLA-002 Round 2 Independent Review, SBLA-002 Round 3 Independent Review (+5 more)

### Community 20 - "Role Checker Tests"
Cohesion: 0.24
Nodes (12): checkerPath, commitFile(), commitSymlink(), createRepository(), execFileAsync, git(), operatingPolicyPath, removeAndCommit() (+4 more)

### Community 21 - "Browser Benchmark Harness"
Cohesion: 0.25
Nodes (7): @playwright/test, median(), parseObjStats(), runBenchmark(), SAMPLE, startServer(), validateSampleIdentity()

### Community 22 - "TypeScript Configuration"
Cohesion: 0.20
Nodes (9): astro/tsconfigs/strictest, compilerOptions, allowJs, checkJs, exactOptionalPropertyTypes, noUncheckedIndexedAccess, exclude, extends (+1 more)

### Community 23 - "SBLA-004 and 005 Reviews"
Cohesion: 0.24
Nodes (10): SBLA-004 Coverage Observation Gap, SBLA-004 Asset License Inventory and Sample Spike Handoff, SBLA-004 Placeholder License Validation Bypass, SBLA-004 Round 1 Acceptance Audit, SBLA-004 Round 2 Independent Review, SBLA-005 Candidate Benchmark Handoff, SBLA-005 Repeatability Threshold Validator Gap, SBLA-005 Round 1 Independent Account-B Review (+2 more)

### Community 24 - "Claude Readiness"
Cohesion: 0.22
Nodes (9): Chat-Only Source Transfer Fallback, Trusted Role Path Boundary Gate, Claude Environment Readiness Record, Repository-Capable Readiness Test, SBLA-002 Acceptance, Immutable Handoff Template, SBLA-002 Readiness Extraction, SBLA-002 Readiness Research Question (+1 more)

### Community 25 - "Work Ledger and Plan"
Cohesion: 0.31
Nodes (9): Current Work Ledger, Operating Policy, PLAN-001 Execution Quality Correction Plan, Execution Quality Correction Design, PLAN-001 Acceptance Criteria, PLAN-001 Builder Handoff, Operating-Contract Drift Detection Gap, PLAN-001 Round 1 Acceptance Review (+1 more)

### Community 26 - "Evidence Fixtures"
Cohesion: 0.22
Nodes (9): Evidence Graph Reference Validation Cases, Project Verification Command, Pectoralis Major Claim Change Record, Pectoralis Major Claim Review, Pectoralis Major Evidence Packet, Horizontal Adduction Joint Action, Pectoralis Major Horizontal Adduction Claim, Resistance-Training Trial Source (+1 more)

### Community 27 - "SBLA-003 Reviews"
Cohesion: 0.25
Nodes (9): SBLA-003 Netlify Capacity ADR Conflict, SBLA-003 Non-Root Asset Resolution Gap, SBLA-003 Architecture and Infrastructure ADR Handoff, SBLA-003 Internal Remediation Review, SBLA-003 Resource Collector Finding Addendum, SBLA-003 Resource Collector Parsing and Area Coverage Gap, SBLA-003 Round 1 Independent Review, SBLA-003 Round 2 Acceptance Audit (+1 more)

### Community 28 - "Record Schema Tests"
Cohesion: 0.25
Nodes (5): RECORD_KINDS, RecordKind, remediationForPath(), validateRecord(), fixtureUrl

### Community 29 - "Anatomy Asset Decision"
Cohesion: 0.33
Nodes (7): Anatomy Asset License Inventory, BodyParts3D 4.0, BodyParts3D Sample Manifest, Gate A Anatomy Asset Decision, SBLA-006 Asset Decision, 2D-authoritative Hybrid, 2D and Text Fallback

### Community 30 - "Operating Model"
Cohesion: 0.53
Nodes (6): Branch and Worktree Runbook, Claude Role Contract, Product Master Plan, Repository Operating Contract, Runbooks Index, Science-Based Lifting Atlas

### Community 31 - "Hosting Quotas"
Cohesion: 0.33
Nodes (6): Cloudflare Pages Free Static Hosting, Cloudflare R2 Storage, Cloudflare Web Analytics, GitHub Pages Portability Proof, Netlify Free Hosting Alternative, Hard No-Charge Boundary

### Community 32 - "Project Planning"
Cohesion: 0.40
Nodes (5): SBLA-006 Asset Decision Plan, SBLA-005 Candidate Benchmark Plan, Science-Based Lifting Atlas Design, SBLA-001 Repository Foundation Plan, pnpm Workspace

### Community 33 - "SBLA-001 Reviews"
Cohesion: 0.67
Nodes (4): SBLA-001 Repository Foundation Handoff, SBLA-001 Round 1 Independent Review, SBLA-001 Round 2 Independent Review, SBLA-001 Symlink Guard Gap

### Community 34 - "Asset Gate Tests"
Cohesion: 0.67
Nodes (3): SBLA-005 Derived Anatomy Poster, Gate A Adversarial Mutation Battery, Gate A Anatomy Asset Decision Validator

### Community 35 - "Windows Handoffs"
Cohesion: 0.67
Nodes (3): New-Device Agent Handoff, Windows Agent Environment Setup, Windows Transfer Handoff

### Community 36 - "PLAN-001 Remediation"
Cohesion: 1.00
Nodes (3): Operating-Contract Drift Validation Remediation, PLAN-001 Round 1 Remediation Handoff, PLAN-001 Round 2 Acceptance Review

## Ambiguous Edges - Review These
- `Gate A Anatomy Asset Decision Validator` → `SBLA-005 Derived Anatomy Poster`  [AMBIGUOUS]
  assets/derived/bodyparts3d/sbla005-poster.webp · relation: conceptually_related_to

## Knowledge Gaps
- **262 isolated node(s):** `name`, `version`, `private`, `type`, `packageManager` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 325 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Gate A Anatomy Asset Decision Validator` and `SBLA-005 Derived Anatomy Poster`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `vitest` connect `Asset Coverage Gates` to `Asset Scoring`, `Toolchain Dependencies`, `Mesh Mapping`, `Static Server Portability`, `Foundation Contract`, `Conversion Tests`, `Content Validation Logic`, `Asset Decision Gate`, `Role Boundary Checker`, `Benchmark Tests`, `Role Checker Tests`, `Browser Benchmark Harness`, `Record Schema Tests`?**
  _High betweenness centrality (0.344) - this node is a cross-community bridge._
- **Why does `scripts` connect `Verification Commands` to `Toolchain Dependencies`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Asset Scoring` be split into smaller, more focused modules?**
  _Cohesion score 0.06662770309760374 - nodes in this community are weakly interconnected._
- **Should `Blender Conversion` be split into smaller, more focused modules?**
  _Cohesion score 0.0647307924984876 - nodes in this community are weakly interconnected._
- **Should `Asset Benchmarking` be split into smaller, more focused modules?**
  _Cohesion score 0.08784313725490196 - nodes in this community are weakly interconnected._
