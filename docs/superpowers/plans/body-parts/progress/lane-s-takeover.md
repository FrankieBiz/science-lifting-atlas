# Lane S takeover of Lane L region tasks

The owner directed fully autonomous operation, and Lane L had not started its
region tasks. Lane S is taking Lane L's region tasks from the **end** of the
Lane L order (XLRHandy §2) so that, if Lane L resumes at the start of its list,
the two meet in the middle without editing the same file.

Before starting any region below, check `git log FrankieBiz/body-parts-atlas`
for its merge and `git branch --list 'bp/R-*'` for an open branch.

| Region         | Status                       |
| -------------- | ---------------------------- |
| ankle-and-foot | done (merged with this note) |

Each merged region is removed from the QUERY_SNAPSHOT in
`tests/unit/body-parts-registry.test.ts` by its R task, because revised
queries intentionally differ from the T1 originals.
| Q1 | scripts written; browser run BLOCKED, see Q1.md |
