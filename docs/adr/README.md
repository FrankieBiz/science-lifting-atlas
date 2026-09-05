# Architecture decision records

Decisions that alter the canonical product plan require an ADR and owner
approval. An ADR is immutable once accepted: to change a decision, write a new
ADR that supersedes it and update the older record's Status line to point at it.

## Format

Every ADR carries: `Status`, `Date`, `Task`, then **Context**, **Decision**,
**Consequences**, **Alternatives considered**, and **Reversal cost**. Status is
one of `Proposed`, `Accepted`, `Superseded by NNNN`, or `Rejected`.

Where an ADR relies on an external fact — a provider quota, a limit, a price —
it must cite the source URL and the date it was read. Master plan §11.8 forbids
copying assumed limits from model memory.

## Index

| ADR                                                    | Title                                                    | Status   |
| ------------------------------------------------------ | -------------------------------------------------------- | -------- |
| [0001](0001-static-first-architecture.md)              | Static-first application architecture                    | Accepted |
| [0002](0002-content-data-and-graph.md)                 | Content data model and graph generation                  | Accepted |
| [0003](0003-hosting-and-asset-delivery.md)             | Hosting and asset delivery                               | Accepted |
| [0004](0004-analytics.md)                              | Analytics in Release 1                                   | Accepted |
| [0005](0005-zero-cost-infrastructure-model.md)         | $0/month infrastructure model at three traffic scenarios | Accepted |
| [0006](0006-execution-quality-and-validation-gates.md) | Execution quality and validation gates                   | Proposed |

## Recorded external facts

[`provider-quotas.json`](provider-quotas.json) holds every provider quota these
ADRs depend on, with source URL and access date, so the numbers can be
re-verified without re-reading the prose. Re-verify by the `reverifyBy` date it
records.
