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
  Sparkles,
  MessageCircleQuestionMark,
  Balloon,
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
      "Turn repeated prompts into named, versioned Skills",
      "Structure phases clearly: Investigate → Plan → Implement → Verify",
      "Encode team standards once in the workflow, not in every message",
      "Make workflows adaptive — let them branch based on findings",
      "Treat workflows like code: version them, review diffs, maintain changelog",
    ],
    insight:
      "A reusable workflow beats rewriting prompts. Try Caveman + NeoLabHQ/context-engineering-kit.",
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
      "Decompose by boundary: one agent per service, layer, or repo",
      "Give each a narrow scope and clear success criteria",
      "Run investigators in parallel, serialize writers",
      "Pass distilled summaries up, never raw output",
      "Always verify 'done' yourself — never fully trust",
    ],
    insight:
      "Well-bounded sub-agents multiply power. Loose ones create chaos and explode token usage.",
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
      "Demand distilled answers, never raw dumps",
      "Search narrowly — load only the needed slice",
      "Compress sub-agent outputs before re-injecting",
      "Cache stable facts in Mempalace",
      "Master Caveman skill: terse, high-signal output",
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
      "Engineer the system around Claude, not just prompt it",
      "Build reusable workflows instead of one-off prompts",
      "Master context: ARCHITECTURE.md, CLAUDE.md, Skills & Mempalace",
      "Use bounded sub-agents + ruthless token optimization",
      "Treat Claude as a junior colleague you manage, not magic",
    ],
    insight: "Scale comes from the system you build around the model.",
  },
  {
    icon: Balloon,
    title: "Fun to Know",
    bullets: [
      '/caveman ultra — max compression. Normal: "I\'d be happy to help! The error likely occurs because the token has expired and…" → Ultra: "Token expired. Fix TTL."',
      "Cavecrew — specialist sub-agents: builder, investigator, reviewer.",
      "NeoLabHQ/context-engineering-kit — architecture, TDD & brainstorming templates.",
      '"Hack" Opus: inject Fable 5 system prompt to unlock its full reasoning — https://github.com/sgup/ai/blob/main/Fable5.md',
    ],
    insight: "The ecosystem around Claude moves fast — stay curious.",
  },
  {
    icon: MessageCircleQuestionMark,
    title: "Questions & Answers",
    bullets: [],
  },
];
