import { Badge, BrandMark, Button } from "@memoturn/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { DOCS_PUBLIC_URL, GITHUB_URL } from "../lib/public-urls.ts";

export const Route = createFileRoute("/")({
	component: Landing,
});

const QUICKSTART_URL = `${DOCS_PUBLIC_URL}/quickstart/`;
const USE_CASES_URL = `${DOCS_PUBLIC_URL}/use-cases/`;

// The surfaces that hit one memory API — the database ships every client.
const BACKENDS = ["MCP", "TypeScript", "Python", "CLI", "Kubernetes", "S3-compatible"];

// The canonical three-leg grid. DESIGN.md permits the identical-card-grid
// exception only at a count of three; everything else lives in the ledger.
const FEATURES = [
	{
		eyebrow: "shared",
		title: "One profile, every agent",
		body: "Each user, team, or persona gets an isolated memory profile that all of their agents read and write. Isolation is structural — namespace > profile > memory — and no data ever crosses a profile boundary.",
		tags: ["namespaces", "profiles", "isolation"],
	},
	{
		eyebrow: "evolving",
		title: "Memory that updates without forgetting",
		body: "Typed memories — facts, events, instructions, tasks — with supersession by topic: a new fact replaces the old one on the same topic and keeps the history. Ingest is idempotent; forget is explicit.",
		tags: ["supersession", "topic_key", "idempotent"],
	},
	{
		eyebrow: "relevant",
		title: "Recall that ranks, not greps",
		body: "Hybrid recall fuses full-text, topic, and vector search with reciprocal-rank fusion and channel attribution — and returns empty when nothing matches, instead of guessing.",
		tags: ["FTS5", "vector ANN", "rank fusion"],
	},
];

// The rest of the surface, rendered as a hairline ledger rather than a
// second card grid (no four-up / six-up grids per DESIGN.md).
const CAPABILITIES = [
	{
		label: "database per profile",
		body: "Every profile is its own tiny libSQL database — provisioned in microseconds, hibernating to object storage at near-zero cost when idle, holding memories, documents, KV, vectors, and transcripts in one unit.",
		tags: ["libSQL", "17 µs provision", "tiering"],
	},
	{
		label: "burner branches",
		body: "O(1) copy-on-write forks of an agent's whole memory. Checkpoint before a risky run, rewind if it learned garbage, branch a session and let it expire — branching is a manifest write, not a data copy.",
		tags: ["checkpoint", "rewind", "copy-on-write"],
	},
	{
		label: "multi-model API",
		body: "Document collections on JSONB, KV namespaces with TTL, vector search, and a SQL escape hatch — one consistency model across all of it, with every read disclosing its `txid`.",
		tags: ["docs / KV / SQL", "vectors", "txid"],
	},
	{
		label: "object storage is truth",
		body: "Committed transactions ship as immutable segments to object storage; nodes are disposable, replicas stream the log, and writer leases with epoch fencing make zombie writers harmless.",
		tags: ["segment log", "etcd leases", "epoch fencing"],
	},
	{
		label: "extraction & embeddings, opt-in",
		body: "Bring your own pipeline by default, or opt in per node: server-side extraction distills raw transcripts into typed memories, and auto-embedding adds the vector channel to bare-text ingest — both outside the write path.",
		tags: ["extraction", "voyage / openai", "off the write path"],
	},
	{
		label: "self-hosted",
		body: "A Rust data plane and one Helm chart, on any Kubernetes — EKS, GKE, AKS, or your own metal — with any S3-compatible object store. MCP server, CLI, and TypeScript/Python SDKs included.",
		tags: ["Helm", "multi-cloud", "MCP + SDKs"],
	},
];

// What you build with the primitives above. A numbered ledger, not a second
// card grid — DESIGN.md spends the identical-card-grid exception on FEATURES.
const USE_CASES = [
	{
		label: "Assistants that actually remember",
		body: "Facts and preferences persist across every session and every agent the user touches — and a new fact about their diet supersedes the old one instead of contradicting it.",
		tags: ["facts", "supersession", "cross-agent"],
	},
	{
		label: "Multi-agent fleets with shared state",
		body: "Planner, researcher, and executor agents read and write one profile — each contribution attributed, nothing leaking between users, because the boundary is a database file.",
		tags: ["shared profile", "isolation", "attribution"],
	},
	{
		label: "Safe experimentation on live memory",
		body: "Snapshot an agent's mind before a risky run, let it learn, and rewind or promote — burner branches are O(1), copy-on-write, and auto-expire.",
		tags: ["burner branches", "rewind", "PITR"],
	},
	{
		label: "Per-session scratch state",
		body: "Task memories attach to a session and expire on TTL; the verbatim transcript layer keeps every turn searchable until you end the session — no cleanup job.",
		tags: ["sessions", "TTL", "transcripts"],
	},
	{
		label: "Tool-native memory over MCP",
		body: "Agents ingest and recall memory as MCP tools — no SDK in the loop required — with the same namespace tokens and profile boundaries as every other surface.",
		tags: ["MCP", "memory_recall", "tokens"],
	},
	{
		label: "SaaS agents at tenant scale",
		body: "Millions of tiny databases on disposable nodes: one per user, near-zero cost idle, single-writer SQL semantics with failover under fifteen seconds.",
		tags: ["DB-per-tenant", "tiering", "leases"],
	},
];

function Landing() {
	return (
		<>
			<section
				aria-labelledby="hero-heading"
				className="relative overflow-hidden bg-background"
				style={{
					backgroundImage:
						"linear-gradient(to right, var(--rule-faint) 1px, transparent 1px), linear-gradient(to bottom, var(--rule-faint) 1px, transparent 1px)",
					backgroundSize: "96px 96px",
					backgroundPosition: "center",
					WebkitMaskImage: "radial-gradient(ellipse 88% 78% at 50% 45%, #000 50%, transparent 100%)",
					maskImage: "radial-gradient(ellipse 88% 78% at 50% 45%, #000 50%, transparent 100%)",
				}}
			>
				<div className="page-wrap relative max-w-6xl! pt-24 pb-22">
					<div className="mb-8 inline-flex items-center gap-3">
						<BrandMark gradient className="size-7 shrink-0" />
						<Badge
							variant="outline"
							className="border-primary/30 bg-foam dark:bg-primary/10 font-medium text-[0.6875rem] tracking-[0.08em] text-primary uppercase"
						>
							open source · Apache-2.0
						</Badge>
					</div>
					<h1
						id="hero-heading"
						className="display-title max-w-[22ch] text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-sea-ink dark:text-foreground"
					>
						Memory for AI agents, in a database built for it.
					</h1>
					<p className="mt-7 max-w-[56ch] text-pretty text-base leading-[1.55] text-sea-ink-soft dark:text-muted-foreground sm:text-lg">
						Memoturn gives every user, team, or agent persona an isolated memory profile all of their agents share — typed memories with
						supersession, hybrid recall, and a tiny per-profile database you can checkpoint, fork, and rewind. Self-hosted, on any Kubernetes.
					</p>
					<div className="mt-9 flex flex-wrap items-center gap-3">
						<Button asChild size="lg">
							<a href={QUICKSTART_URL} className="no-underline">
								Read the quickstart
							</a>
						</Button>
						<Button asChild variant="ghost" size="lg" className="group text-muted-foreground hover:text-foreground">
							<a href={GITHUB_URL} className="no-underline" target="_blank" rel="noreferrer">
								Star on GitHub
								<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
							</a>
						</Button>
					</div>
					<dl className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
						<div className="inline-flex items-center gap-1.5">
							<span aria-hidden className="size-1 rounded-full bg-primary/70" />
							<dt className="sr-only">License</dt>
							<dd>Apache-2.0</dd>
						</div>
						<div className="inline-flex items-center gap-1.5">
							<span aria-hidden className="size-1 rounded-full bg-primary/70" />
							<dt className="sr-only">Ingest latency</dt>
							<dd>ingest p50 3.9 ms</dd>
						</div>
						<div className="inline-flex items-center gap-1.5">
							<span aria-hidden className="size-1 rounded-full bg-primary/70" />
							<dt className="sr-only">Recall latency</dt>
							<dd>recall p50 11.7 ms</dd>
						</div>
						<div className="inline-flex items-center gap-1.5">
							<span aria-hidden className="size-1 rounded-full bg-primary/70" />
							<dt className="sr-only">Branching</dt>
							<dd>branch in O(1)</dd>
						</div>
					</dl>
				</div>
			</section>

			<section aria-label="Client surfaces" className="border-y border-border/60 bg-background">
				<div className="page-wrap max-w-6xl! py-6">
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
						<span className="kicker">speaks</span>
						<ul className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0">
							{BACKENDS.map((name, idx) => (
								<li key={name} className="inline-flex items-center gap-x-5">
									<span className="text-[15px] font-medium tracking-[-0.005em] text-foreground">{name}</span>
									{idx < BACKENDS.length - 1 ? <span aria-hidden className="size-1 rounded-full bg-border" /> : null}
								</li>
							))}
						</ul>
						<span className="ml-auto font-mono text-xs tracking-[0.04em] text-muted-foreground">
							<span aria-hidden className="text-primary">
								↳{" "}
							</span>
							one memory surface
						</span>
					</div>
				</div>
			</section>

			<section aria-labelledby="why-heading" className="bg-background">
				<div className="page-wrap max-w-6xl! py-24">
					<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end">
						<div>
							<p className="kicker mb-4">why memoturn</p>
							<p
								id="why-heading"
								className="display-title max-w-[32ch] text-balance text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-sea-ink dark:text-foreground"
							>
								Agents remember in app code today: a vector store here, a KV cache there, transcripts somewhere else — and nothing forgets
								correctly.
							</p>
						</div>
						<p className="max-w-[44ch] text-pretty text-[0.9375rem] leading-[1.65] text-sea-ink-soft dark:text-muted-foreground">
							Agent memory is not a vector store with extra steps. Memoturn moves memory into the database: typed records that supersede
							instead of duplicate, recall that fuses keyword, topic, and vector signals, and one profile boundary no data ever crosses —
							in one unit that replicates, branches, and rewinds together.
						</p>
					</div>
				</div>
			</section>

			<section aria-labelledby="features-heading" className="relative overflow-hidden border-y border-border/60 bg-sand dark:bg-card/40">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-0 opacity-[0.06]"
					style={{ backgroundImage: "var(--pattern-topo)", backgroundSize: "360px 360px", backgroundPosition: "-120px -60px" }}
				/>
				<div className="page-wrap relative max-w-6xl! py-24">
					<div className="mb-12 grid max-w-[60ch] gap-3">
						<p className="kicker">what you get</p>
						<h2
							id="features-heading"
							className="display-title text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-sea-ink dark:text-foreground"
						>
							A memory database, every layer open.
						</h2>
						<p className="max-w-[56ch] text-[0.9375rem] leading-[1.6] text-sea-ink-soft dark:text-muted-foreground">
							Typed memories, hybrid recall, and branching aren't an app-side library — they're database semantics you can inspect,
							self-host, and operate. Open source, top to bottom.
						</p>
					</div>
					<div className="grid border-t border-l border-[--rule] bg-background md:grid-cols-3">
						{FEATURES.map((f, i) => (
							<article
								key={f.eyebrow}
								className="group/card flex flex-col gap-4 border-r border-b border-[--rule] bg-background dark:bg-card pt-8 pr-7 pb-9 pl-7 transition-colors hover:bg-foam dark:hover:bg-muted/40 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-420"
								style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
							>
								<p className="kicker text-primary">{f.eyebrow}</p>
								<h3 className="display-title text-[1.375rem] font-bold leading-tight tracking-tight text-sea-ink dark:text-foreground">
									{f.title}
								</h3>
								<p className="text-[0.90625rem] leading-[1.6] text-sea-ink-soft dark:text-muted-foreground">{f.body}</p>
								<div className="mt-auto flex flex-wrap gap-1.5 border-t border-dashed border-[--rule] pt-4.5">
									{f.tags.map((tag) => (
										<span key={tag} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[0.6875rem] tracking-tight text-primary">
											{tag}
										</span>
									))}
								</div>
							</article>
						))}
					</div>
					<div className="mt-10">
						<p className="kicker mb-4">also in the database</p>
						<div className="border-t border-x border-[--rule] bg-background">
							{CAPABILITIES.map((c) => (
								<div
									key={c.label}
									className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-[--rule] px-7 py-5 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-baseline"
								>
									<p className="kicker text-primary">{c.label}</p>
									<p className="text-[0.90625rem] leading-[1.6] text-sea-ink dark:text-foreground">{c.body}</p>
									<div className="flex flex-wrap gap-1.5 sm:justify-end">
										{c.tags.map((tag) => (
											<span key={tag} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[0.6875rem] tracking-tight text-primary">
												{tag}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section aria-labelledby="use-cases-heading" className="bg-background">
				<div className="page-wrap max-w-6xl! py-24">
					<div className="mb-12 grid max-w-[60ch] gap-3">
						<p className="kicker">what you build</p>
						<h2
							id="use-cases-heading"
							className="display-title text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-sea-ink dark:text-foreground"
						>
							Memory primitives, composed into real agents.
						</h2>
						<p className="max-w-[56ch] text-[0.9375rem] leading-[1.6] text-sea-ink-soft dark:text-muted-foreground">
							The same profile, supersession, recall, and branching primitives back a range of agents — from personal assistants to
							multi-tenant fleets — all on infrastructure you own.
						</p>
					</div>
					<div className="border-t border-x border-[--rule] bg-background">
						{USE_CASES.map((u, i) => (
							<div
								key={u.label}
								className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-[--rule] px-7 py-5 sm:grid-cols-[2rem_13rem_minmax(0,1fr)_auto] sm:items-baseline"
							>
								<p className="font-mono text-[0.8125rem] tracking-tight text-muted-foreground tabular-nums">
									{String(i + 1).padStart(2, "0")}
								</p>
								<p className="font-semibold text-[0.9375rem] leading-snug tracking-tight text-sea-ink dark:text-foreground">{u.label}</p>
								<p className="text-[0.90625rem] leading-[1.6] text-sea-ink-soft dark:text-muted-foreground">{u.body}</p>
								<div className="flex flex-wrap gap-1.5 sm:justify-end">
									{u.tags.map((tag) => (
										<span key={tag} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[0.6875rem] tracking-tight text-primary">
											{tag}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="mt-8">
						<a
							href={USE_CASES_URL}
							className="group inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.04em] text-muted-foreground no-underline transition-colors hover:text-foreground"
						>
							See all use cases
							<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
						</a>
					</div>
				</div>
			</section>

			<section
				aria-labelledby="closing-heading"
				className="atoll-band relative isolate overflow-hidden bg-[image:var(--gradient-atoll)] text-(--on-gradient-fg)"
			>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-0 mix-blend-screen opacity-[0.16]"
					style={{ backgroundImage: "var(--pattern-topo-light)", backgroundSize: "460px 460px" }}
				/>
				<div className="page-wrap relative max-w-245 py-24 text-center">
					<div className="mx-auto mb-6 flex justify-center text-(--on-gradient-fg)">
						<BrandMark className="size-24 [filter:drop-shadow(0_6px_18px_rgba(0,0,0,0.28))] transition-transform duration-2400 ease-(--ease-tide,cubic-bezier(0.16,1,0.3,1)) hover:rotate-360 motion-reduce:transition-none" />
					</div>
					<p className="kicker mb-4 text-(--on-gradient-fg-soft)">ready when you are</p>
					<h2
						id="closing-heading"
						className="display-title mx-auto max-w-[22ch] text-balance text-[clamp(1.875rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
					>
						Give your agents memory on infrastructure you own.
					</h2>
					<p className="mx-auto mt-5 max-w-[56ch] text-pretty text-base leading-[1.55] text-(--on-gradient-fg-soft) sm:text-lg">
						Open source, Apache-2.0. Run `memoturnd` for a local node, or one Helm chart on any Kubernetes for production.
					</p>
					<div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
						<Button asChild size="lg" className="bg-(--on-gradient-fg) text-sea-ink hover:bg-(--on-gradient-fg)/90 hover:text-sea-ink">
							<a href={QUICKSTART_URL} className="no-underline">
								Get started
							</a>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="border-(--on-gradient-border) bg-(--on-gradient-button-bg) text-(--on-gradient-fg) hover:border-(--on-gradient-fg) hover:bg-(--on-gradient-button-bg) hover:text-(--on-gradient-fg)"
						>
							<a href={GITHUB_URL} className="no-underline" target="_blank" rel="noreferrer">
								Star on GitHub
							</a>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
