---
title: Roadmap
description: Current status of the prototype, the shipped surface, and the deferred work tracked in the architecture decision records.
---

Memoturn is at the **architecture + working prototype** stage. All planned prototype milestones
are built and tested: 48 end-to-end tests covering the memory layer, two-node distribution, and
a real-etcd lease lifecycle. The stack is proven on Kubernetes — the Helm chart deploys to kind
with MinIO and auth, all HTTP benchmarks pass, and the chaos test holds: deleting the data-plane
pod yields a fresh pod with no PersistentVolume serving the same data with the same token in
about 15 seconds. See [deployment](/deployment/).

Performance numbers on this page and in the repository are p50 prototype measurements (single
node, in-process object store), reproducible with `cargo run --release -p memoturn-bench`.

## Shipped surface

- **Typed agent memory** — `namespace > profile > memory`, where a profile is one database.
  Idempotent content-addressed ingest, supersession by topic key, hybrid recall (keyword + topic
  + vector, reciprocal-rank fused), sessions, forget. See [memories](/memories/) and
  [recall](/recall/).
- **Opt-in node services** — server-side [extraction](/extraction/) (`/extract`, 503 when
  unconfigured) and [auto-embedding](/embeddings/), both outside the write path.
- **Multi-model substrate** — documents on JSONB, KV with TTL, vectors, the transcript layer,
  and the SQL escape hatch, all in one database per profile. See [data model](/data-model/).
- **Branching** — O(1) copy-on-write forks, checkpoints, rewind, and auto-expiring burner
  branches. See [branching](/branching/).
- **Distribution** — object storage as the source of truth, single writer per database with
  lease + epoch fencing, write forwarding, replica reads with `txid`/`min_txid`. See
  [architecture](/architecture/) and [consistency](/consistency/).
- **Access surfaces** — [REST API](/api-rest/), [CLI](/cli/),
  [TypeScript SDK](/sdk-typescript/), [Python SDK](/sdk-python/), and [MCP server](/mcp/).
- **Operations** — auth (per-database and namespace JWTs, platform key), Helm chart, env-var
  node [configuration](/configuration/). See [security](/security/).

## Deferred work

These items are tracked in the architecture decision records at
[github.com/memoturn/db](https://github.com/memoturn/db) (`docs/adr/`). No dates are attached;
the ordering below reflects dependency, not commitment.

### Storage and engine

- **Lazy page-fault VFS for databases over 16 MB.** The prototype restores whole databases on
  cold wake, which is the right trade for tiny per-profile databases; larger databases need
  page-granular faulting from object storage.
- **Point-in-time-recovery retention and GC of superseded segments.** Branch and rewind exist;
  a retention policy for the immutable segment log does not yet.
- **Durable-mode writes via low-latency object-storage tiers.** Today durability is a
  segment-shipping window plus explicit `sync`; a synchronous durable mode depends on
  low-latency storage classes.

### Branching and lifecycle

- **Three-way branch merge.** Out of scope for v1 by decision: agents fork-and-promote or
  fork-and-discard. Merge matters once branches host long-lived divergent work.
- **Whole-database TTL for ephemeral profiles on multi-node clusters.** Burner branches already
  expire; expiring an entire profile database needs cluster-wide sweep coordination.

### Distribution and operations

- **Cross-region replication** — bucket cross-region replication plus remote read replicas.
- **Per-tenant KMS encryption** of segments and manifests.
- **Kubernetes operator and CRDs**, replacing chart-level wiring for fleet operations. See
  [scaling](/scaling/) and [observability](/observability/).
- **gRPC transport for the node mesh.** HTTP suffices at prototype scale.
- **Billing pipeline** beyond the current usage counters.
- **Namespace as a first-class catalog column.** Profiles are databases named
  `{ns}--{profile}`; the convention upgrades to a catalog column with a one-time split.

### Assistant

- **The full built-in assistant** — natural-language query, schema and index advice, and an ops
  copilot. The design is shipped (`docs/architecture/06-mcp-and-assistant.md`); the CLI's `ask`
  command is a stub today and says so. Recall answer synthesis (turning recalled memories into a
  prose answer) lands here too, in the control plane rather than the data path.

## Sequencing

The data plane is deliberately small and the invariants are fixed: object storage as the source
of truth, single writer with epoch fencing, `txid` on every read. Deferred items either extend
the manifest layer (VFS, GC, merge, TTL), the control plane (operator, billing, catalog,
assistant), or the deployment story (cross-region, KMS) — none change the wire protocol in
[api-rest](/api-rest/). Items land when they are provable with the same end-to-end rigor as the
existing 48-test suite, not before.
