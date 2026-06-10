---
title: Security & tokens
description: Ed25519-signed JWTs, per-database and namespace tokens, structural profile isolation, and network security in Kubernetes.
---

Memoturn's isolation story has two layers: **structural** — a profile is its own database file,
and no data-plane operation can touch two profiles — and **token-based** — short-lived
Ed25519-signed JWTs that widen authorization only, never the data plane's reach.

## Auth modes

Auth is **off by default** in dev; the node logs a loud warning at startup. Enable it for any
shared deployment:

```bash
MEMOTURN_AUTH=on MEMOTURN_PLATFORM_KEY=... memoturnd
```

With auth on, the node signs per-database JWTs with an Ed25519 key. Signing-key precedence:
`MEMOTURN_AUTH_KEY` (base64 PKCS#8 — in production, mounted from a Kubernetes Secret) → a local
file under the data dir → object storage → generate and persist. The object-storage fallback is
what lets tokens survive disposable pods. See [Configuration](/configuration/) for all auth
variables.

## Token kinds

| Token | Covers | Posture |
| --- | --- | --- |
| **Per-database token** | exactly one profile's database | the agent posture — an agent is locked to the one profile it serves |
| **Namespace token** (`ns` claim) | every profile under one namespace, including its control routes | the orchestrator posture — mint per-profile tokens, checkpoint memories, list profiles |
| **Platform key** | control-plane operations: provision databases, mint tokens | operators and provisioning code only |
| **Cluster key** | node-internal hops (write forwarding) | never leaves the cluster |

Scopes are `read`, `write`, and `admin`: recall and get need `read`; ingest, forget, and
session-end need `write`. Tokens are short-lived (default TTL 3600 s).

```bash
# per-database token: one agent, one profile
memoturn --platform-key ... token create acme--alice --scope write

# namespace token: every profile under acme — the orchestrator posture
memoturn --platform-key ... token create-ns acme --scope write --ttl 3600
```

The same mints are available over HTTP (`POST /v1/databases/{db}/tokens`,
`POST /v1/namespaces/{ns}/tokens`) — see [REST API](/api-rest/).

## Stateless verification

Gateways verify JWTs statelessly with the Ed25519 public key — no auth-service round-trip on the
data path. Nodes additionally enforce lease epochs on every write, so a stolen-but-valid token
still cannot make a zombie writer dangerous (see [Consistency](/consistency/)).

## Structural isolation

A profile boundary is a database file. There is no query, filter, join, or recall operation that
spans two profiles — the isolation is not a row-level policy that could be bypassed, it is the
shape of the storage. A namespace token widens which profiles a caller may address, one at a
time; it does not create any cross-profile operation. See [Profiles](/profiles/).

Two further structural guards:

- **Reserved tables.** Everything Memoturn manages inside a database — `__memoturn_kv`,
  `__memoturn_docs_{collection}`, `__memoturn_memories*` — carries the `__memoturn_` prefix and
  is unreachable from user SQL. The SQL endpoint cannot mutate reserved tables directly.
- **Per-tenant object-store prefixes.** Each database's segments and manifests live under its own
  prefix in the bucket.

## Network security in Kubernetes

The Helm deployment design (see [Deployment](/deployment/)):

- **TLS everywhere**, issued by cert-manager at the ingress.
- **JWT verification at the gateway**, before requests reach the data plane.
- **NetworkPolicies isolate tiers**: only gateways reach data-plane ports; only the data plane
  reaches etcd and the object store.
- **Secrets via Kubernetes Secrets** (External Secrets Operator compatible for enterprise). The
  chart consumes `auth.existingSecret` (keys `PLATFORM_KEY`, `CLUSTER_KEY`) and an optional
  `ai.existingSecret` for extraction/embedding keys.

## Data residency

A database's **primary region is chosen at creation**. Regions are independent cells — each with
its own etcd, gateways, data plane, and regional object-storage bucket — so the cell model maps
directly onto residency requirements: a profile created in the EU cell stays in the EU cluster
and its EU bucket. The global control plane sits on the provisioning path, never the data path.

## Operational notes

- Set `MEMOTURN_PLATFORM_KEY` explicitly anywhere tokens must outlive a single process; an unset
  key is generated per run and logged with a warning.
- Per-tenant encryption keys wrapped by cloud KMS are planned for enterprise — see
  [Roadmap](/roadmap/).
