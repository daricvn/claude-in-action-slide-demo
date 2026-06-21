import type { Component } from "solid-js";
import {
  Building2,
  Workflow,
  FolderGit2,
  Network,
  Layers,
  Coins,
  MonitorPlay,
  BrainCircuit,
  MessageCircleQuestionMark,
} from "lucide-solid";

/** A single content slide (1–8). Slide 0 is the bespoke hero. */
export interface Slide {
  /** Large lucide icon shown at the top of the card. */
  icon: Component<{ size?: number; class?: string; "stroke-width"?: number }>;
  title: string;
  bullets: string[];
  insight?: string;
}

/**
 * Eight content slides, ordered to the talk agenda. Copy is written for senior
 * engineers working in large / enterprise codebases — actionable, not fluff.
 */
export const SLIDES: Slide[] = [
  {
    icon: Building2,
    title: "Why Enterprise-Scale AI Assistance Needs More Than Prompts",
    bullets: [
      "Prompts don’t scale: every session restarts from zero context.",
      "Enterprise code spans repos, services, and years of decisions.",
      "A one-off prompt can’t hold architecture, conventions, or ownership.",
      "You need durable context, reusable workflows, and bounded agents.",
      'Shift from "ask the model" to "engineer the system around it".',
    ],
    insight: "At scale, the bottleneck is context, not the prompt.",
  },
  {
    icon: Workflow,
    title: "Building Reusable Claude Workflows for Large Projects",
    bullets: [
      "Promote repeated prompts into named, versioned Skills.",
      "Gate the work in phases: investigate → plan → implement → verify.",
      "Encode team conventions into the workflow, not into every message.",
      "Let the plan branch on findings instead of following a fixed script.",
      "Review workflow diffs like code; keep a changelog.",
    ],
    insight: "A workflow you reuse beats a prompt you rewrite.",
  },
  {
    icon: FolderGit2,
    title: "Investigating Multi-Repo Systems Effectively",
    bullets: [
      "Start from north-star files: ARCHITECTURE.md, README, configs.",
      "Keep a workspace manifest: repos, owners, and entry points.",
      "Resolve cross-repo contracts — APIs, schemas, events — first.",
      "Trace one real request end-to-end across services to ground reality.",
      "Map service boundaries and data flow before touching a line.",
    ],
    insight: "In multi-repo, the contract is the codebase.",
  },
  {
    icon: Network,
    title: "Using Sub-Agents for Dynamic Task Orchestration",
    bullets: [
      "Decompose by boundary: one agent per service, concern, or repo.",
      "Give each agent a narrow brief and crisp success criteria.",
      "Run read-only investigators in parallel; serialize the writers.",
      "Pass distilled findings up the chain, not raw transcripts.",
      'Verify every sub-agent’s "done" — re-run its gate yourself.',
    ],
    insight: "Sub-agents multiply throughput only when scope is bounded.",
  },
  {
    icon: Layers,
    title: "Organizing Context: Files, Skills, Rules & Memory",
    bullets: [
      "ARCHITECTURE.md — one map of boundaries, data flow, and decisions.",
      "CLAUDE.md — always-on router: keep it lean, link don’t inline.",
      "Skills — invokable, reusable procedures with their own docs.",
      "Rules & hooks — automated enforcement the harness runs, not you.",
      "Memory MCP (mempalace) — persist the *why* across sessions.",
    ],
    insight: "Context engineering is the real interface to the model.",
  },
  {
    icon: Coins,
    title: "Optimizing Tokens & Avoiding Context Bloat",
    bullets: [
      "Return distilled answers, not raw file dumps.",
      "Search narrowly and read the slice you need — not the whole file.",
      "Compress sub-agent output before it re-enters the main context.",
      "Prune stale context and summarize long threads aggressively.",
      "Cache north-star facts in memory instead of re-deriving them.",
      "Caveman skill — terse output style, ~75% fewer tokens, full accuracy.",
    ],
    insight: "Tokens are budget — spend them on reasoning, not re-reading.",
  },
  {
    icon: MonitorPlay,
    title: "Demo: AI Web Slide — Workflow in Action",
    bullets: [
      "This deck was built by the workflow it describes.",
      "Skills + sub-agents scaffolded slides, layout, and animation.",
      "Memory MCP held design tokens and architecture across sessions.",
      "Watch the loop run live: investigate → plan → implement → verify.",
      "The same pattern scales from a slide deck to an enterprise monorepo.",
    ],
    insight: "The workflow is the product — watch it build itself.",
  },
  {
    icon: BrainCircuit,
    title: "Mindset Shift & Key Takeaways",
    bullets: [
      "Stop treating Claude as a prompt tool — start engineering the entire system around it.",
      "Build reusable workflows, not one-off prompts.",
      "Master context: Clean threads, strong ARCHITECTURE.md, CLAUDE.md, and Mempalace.",
      "Use sub-agents + dynamic orchestration instead of monolithic chats.",
      "Optimize ruthlessly — tokens, structure, and verification are non-negotiable.",
      "Treat Claude as a powerful junior colleague you manage, not a magic oracle.",
    ],
    insight: "Scale comes from the system you build around the model.",
  },
  {
    icon: MessageCircleQuestionMark,
    title: "Questions & Answers",
    bullets: [],
  },
];
