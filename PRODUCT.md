---
authored_by: designer
author_date: 2026-05-02
revised: 2026-06-10 — repositioned for the agent-memory database (memoturn/memoturn); replaces the prior self-hostable agent-runtime product. Same day: folded in the hardening series (fail-closed auth, durable write mode, hardened Helm defaults, multi-node proof against real etcd)
source: "/impeccable teach refresh"
strength: strong
---

# Product

## Register

brand

## Users

**Primary: The Agent Builder.** A solo dev or staff engineer wiring memory into agent loops — an assistant that should remember a user across sessions, a fleet of agents that should share what they learn, a product where every tenant needs isolated agent state. They've hit the wall with app-side memory glue: a vector store here, a KV cache there, transcripts somewhere else, and nothing that forgets correctly. They arrive at Memoturn surfaces via direct link, an HN/X recommendation, GitHub, or a peer Slack drop. They're technically literate; they don't need embeddings, MCP, or recall defined for them. The decision driver is *can I give my agents real memory — shared per user, superseding instead of duplicating, recallable by relevance — with one ingest call today?* — a yes-or-no read in under a minute.

**Secondary: The Platform / Infra Owner.** Tech lead, platform, or risk owner evaluating Memoturn to hold agent memory for a team or product. Lives on the trust surfaces (isolation boundaries, fail-closed auth, data residency, self-hosting) and the operability surface: *is isolation structural, is object storage the source of truth, what happens when a node dies?* Decision driver: *does this run on infrastructure I control — one Helm chart on our cluster, our bucket — with per-profile isolation I can explain to security, and databases that cost nothing when idle?*

Both are technically literate. Neither needs MCP, vector search, or "supersession" defined beyond a sentence.

## Product Purpose

Memoturn is a **distributed agent-memory database** — open-source, Rust, self-hostable. It gives every user, team, or agent persona an isolated **memory profile** that all of their agents share: typed memories (facts, events, instructions, tasks) with **supersession** — newer facts replace older ones on the same topic, history preserved — idempotent content-addressed ingest, and **hybrid recall** (keyword + topic + vector, rank-fused). Profiles are organized `namespace > profile > memory`, and no data ever crosses a profile boundary, because each profile *is its own database* — a tiny libSQL unit, provisioned in microseconds, hibernating to object storage at near-zero cost when idle, holding memories, documents, KV, vectors, and transcripts together. Memory you can **checkpoint, fork, and rewind**: snapshot an agent's mind before a risky run, rewind if it learned garbage, **burner-branch** a session and let it expire. Object storage is the source of truth; nodes are disposable; writes ack on local commit by default, and an opt-in durable mode (`MEMOTURN_DURABILITY=durable`, or a per-request `Memoturn-Durability: durable` header) acks only after the segment is shipped to object storage. Production posture is fail-closed: auth on requires a platform key, write tokens are per-database Ed25519 JWTs, deleting a profile revokes its stale write tokens via deletion tombstones, a SQL guard walls user SQL off from reserved tables, and the request surface is bounded (body size, concurrency, control-endpoint rate, timeouts). The whole stack deploys with one Helm chart — hardened by default: non-root read-only-rootfs pods with all capabilities dropped, NetworkPolicy egress lockdown, a PodDisruptionBudget, a dedicated ServiceAccount, and a refusal to run multi-replica without etcd — to any Kubernetes. The thing app-side memory glue structurally can't give you: memory as database semantics — supersession, isolation, branching, and a consistency model (`txid`) — instead of library behavior. Apache-2.0. The marketing surface (this register) exists to **convert developers into people running the database** — a running `memoturnd`, a starred repo, a deployed chart.

Success is measurable: an Agent Builder who lands on `/`, scrolls once, and hits the quickstart or the GitHub repo (`github.com/memoturn/memoturn`). The hero CTA is the quickstart (run it); GitHub is the secondary, on the same surface but visually subordinate. There is no managed-signup funnel to optimize — the conversion is *adoption*, and beauty without a path to running the thing is failure. Every page is judged against that test.

## Brand Personality

**durable, precise, sovereign.**

- **Durable** — about the architecture, not a vibe. Maps to the literal mechanisms: committed transactions shipped as immutable segments to object storage (with an opt-in durable mode that acks only after the ship), nodes that can be deleted without losing a byte, checkpoints you can rewind to, supersession that keeps history instead of overwriting it. Pages should *feel* durable (small bundles, no animated lard, nothing that implies the state is fragile). Copy uses present-tense mechanical verbs ("ingested", "recalled", "superseded", "branched", "rewound", "hibernated").
- **Precise** — about a database you can inspect and reason about. Every claim names the primitive (profile, topic key, burner branch, segment, manifest, writer lease), the guarantee (supersession, idempotent ingest, `txid`, epoch fencing), the surface (HTTP, MCP tools, `@memoturn/sdk`, the `memoturn` CLI), or the artifact (`MEMOTURN_OBJECT_STORE`, the Helm chart). No abstractions where a concrete name fits. Receipts over adjectives: the Measured table (ingest p50 3.9 ms, recall p50 11.7 ms, branch 47 µs) is the voice, backed by the test receipt — 67 cross-crate integration tests, true multi-node distribution (ownership, forwarding, failover, fencing) exercised against a real etcd, and the kind chaos proof (`kubectl delete pod` on the data plane; a fresh pod with no PersistentVolume serves the same data with the same token in ~15 s).
- **Sovereign** — the deployment story. The memory is yours: open source, self-hosted, your Kubernetes, your bucket, no per-idle-minute bill — idle profiles hibernate to object storage and cost cents. Somewhere on every surface the ownership should land ("infrastructure you own", "any Kubernetes", "your object store"). A surface that reads like a hosted SaaS you rent is off-brand.

The voice is direct, technical, declarative. No hype words (`revolutionary`, `next-generation`, `unlock`, `empower`, `seamlessly`, `leverage`, `best-in-class`). No exclamation marks in marketing copy. No emojis on marketing surfaces. **Never name competitors** in marketing or docs copy — repo-wide convention; reference designs live in ADRs only.

### Voice on product surfaces

The voice does not stop at the marketing edge. The brand register's tone rules extend into every surface a user touches:

- **CLI / terminal output** (`memoturn` binary, install scripts, status lines). Mechanical declarative. Present tense for in-flight state ("ingesting", "restoring", "shipping segment"), past tense for completed events ("memory ingested", "fact superseded", "branch created", "rewound to checkpoint"). No prose framing ("Hi! Let's get you set up..."). One-line status, no banners. Functional symbols only: `▲ ⚓ ✓` are permitted; everything else is forbidden. No exclamation marks. Errors name the subsystem and the failure ("object store: connection refused", "extract: MEMOTURN_EXTRACT_API_KEY not set"), never apologize ("Sorry, something went wrong").
- **API + console error copy.** Name what failed. No apology, no "oops", no "uh oh". Format: `{subject} failed: {reason}` or `{subject} not found: {hint}`. Hints point to the next concrete action, not a help-center URL. Example: `Profile not found: check the namespace, or ingest a memory to create it.` Bad: `We couldn't find that profile. Please try again or contact support.`
- **Docs voice** (`apps/docs`). Reference voice, not tutorial-friendly. Assume the reader is the Agent Builder or Platform Owner; do not define MCP, embeddings, or vector search. Headings are noun phrases ("Typed memories", "Hybrid recall", "Burner branches"), not questions ("How does recall work?"). Examples are runnable; no pseudocode. The exception is the quickstart, which may use second-person imperative ("install the CLI", "run a node"), but only there.
- **Console / product UI microcopy.** Empty states name the action ("No memories yet — ingest one over HTTP, MCP, or the CLI."). Buttons use present-tense verbs ("Fork branch", "Rewind", "Forget", "Recall"), never gerunds ("Forking...") in resting state. Loading states may use the `-ing` form. Confirmations name the artifact ("Checkpoint saved", "Memory forgotten", "Branch created"), not the action ("Saved!").

A friendly "oops, something went wrong" error breaks the brand harder than a bad hero gradient does. Voice drift on a product surface is a brand bug.

## Anti-references

Memoturn must not look like any of the five standard AI-tool aesthetic families:

1. **Generic SaaS gradient-hero** (Cursor.com / Vercel-style). Big gradient hero, drop-shadowed product screenshot, identical 3-icon feature cards, "Trusted by" YC-logo strip. The dominant cliche of the category.
2. **AI-product neon-purple-on-black** (OpenAI / Replit-style). Cyberpunk dark mode, glowing edges, neural-net imagery, "the future of coding" positioning.
3. **Developer-tool brutalist-monospace** (HN-aesthetic). All-monospace, terminal-green-on-black, ASCII art, "NO JS" banners. Different cliche, still a cliche.
4. **Enterprise-AI navy-and-rounded** (IBM watsonx / Azure-AI-Foundry-style). Navy blue, oversized rounded corners, stock photo of a hand on a glass touchscreen, "Trusted by Fortune 500".
5. **AI-agent orchestrator glow** (the saturating family in the agent-memory / agent-platform space — deliberately unnamed here; it includes Memoturn's direct competitors). Glassmorphic tiles on a near-black or charcoal panel; pulsing animated accent borders in cyan / magenta / teal; agent avatars or cards with glow halos; faux-3D depth on every tile; an "agent activity" feed with status dots; three-column "control room" layouts. Distinct from family 2 because it leans cyan / teal-on-charcoal and is dashboard-shaped rather than landing-shaped. Memoturn is the closest neighbor to this family by category — *a memory layer for agent fleets* is one careless gradient away from it — so the visual distance has to be the largest. The dark control-room dashboard is especially tempting and especially off-limits; Memoturn's surfaces are light-first, hairline-bordered, and calm.

The brand has to find a sixth lane. Whenever a design move pulls toward any of these five, redesign the element with different structure. The category-reflex check (first-order: domain → palette; second-order: domain + anti-refs → aesthetic family) must come back ambiguous.

## Design Principles

1. **Lead with mechanism, not metaphor.** Name the primitive, the guarantee, the protocol, the license, the command. Specificity is what earns trust with the Agent Builder. If a sentence can be replaced with a generic equivalent without losing meaning, it's off-brand.
2. **Adoption is the test.** Beauty without a path to *running the database* — the quickstart, a running `memoturnd`, the repo — is failure. Every section has to defend its place against the question "does this move the reader toward running it?"
3. **Find the sixth lane.** All five standard AI-tool aesthetic families are anti-references. If the design starts to read as gradient-hero, neon-on-black, monospace-brutalist, navy-enterprise, or orchestrator-glow, redesign — don't tweak.
4. **The database is the demo.** A live indicator (a tail of memory-lifecycle events — fact ingested, recall rank-fused, fact superseded with history kept, branch created copy-on-write, profile hibernated to object storage) earns its place by *being* the proof. Supersession and branching are the thing to show: a fact evolving without losing history, a whole memory forked in O(1). Receipts beat adjectives: the Measured table is a design element, not an appendix. Static product screenshots don't make the cut. If a section claims durable or isolated without showing it, redesign or cut.
5. **Restraint is the visual gesture.** One heading face, one body face, one mono stack. One radius. Saying no to the second variant of anything is the brand. The discipline is what separates Memoturn from the five anti-reference lanes — those families are defined by their additive moves.
6. **The product surface is part of the brand.** The voice rules in this document apply to every user-touched surface: marketing pages, CLI output, API and console error copy, docs prose, in-app microcopy. A friendly "oops" error breaks the brand harder than a bad hero gradient. Treat voice drift on a product surface as a brand bug, not a copy nit.

## Accessibility & Inclusion

**WCAG 2.2 AA, reduced-motion respected.** Concrete commitments:

- AA contrast ratios on all body text and CTAs. The atoll-gradient closing band is the highest-risk surface; verify foam-light text on the lagoon-deep midpoint passes.
- Full keyboard navigation. Every interactive element reachable via tab; focus rings visible against both light and dark surfaces.
- `prefers-reduced-motion` honored on the tide-rotation hover. The mark may still hover-respond (color or scale shift) but the rotation is suppressed.
- No color-only signaling. Every status, memory type, or category cue carries a textual or shape redundancy.
- Type scale clamps to viewport but never below 14px on body copy.
- Form fields and buttons have visible focus states distinct from hover.

The Agent Builder is a power user, not necessarily a screen-reader user, but the surfaces are public — the floor still matters.
