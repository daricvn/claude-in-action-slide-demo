import type { Component } from 'solid-js';
import {
  Radar,
  Wand2,
  Network,
  Workflow,
  FolderGit2,
  Coins,
  BrainCircuit,
  Map as MapIcon,
  Route,
} from 'lucide-solid';

/** A single content slide (1–9). Slide 0 is the bespoke hero. */
export interface Slide {
  /** Large lucide icon shown at the top of the card. */
  icon: Component<{ size?: number; class?: string; 'stroke-width'?: number }>;
  title: string;
  bullets: string[];
  insight: string;
}

/**
 * Nine content slides. Copy is written for senior engineers working in
 * large / enterprise codebases — actionable, not fluff.
 */
export const SLIDES: Slide[] = [
  {
    icon: Radar,
    title: 'Investigate Large Projects at Enterprise Scope',
    bullets: [
      'Start from north-star files: ARCHITECTURE.md, README, package.json, tsconfig, CI/infra configs.',
      'Search aggressively, then ask Claude to "explain this in the context of the whole system".',
      'Map service boundaries and data flow before touching a single line.',
      'Trace one real request end-to-end to ground your mental model in reality.',
      'Build a glossary of domain terms and code ownership before you edit.',
    ],
    insight: 'Understand the system’s shape before changing its substance.',
  },
  {
    icon: Coins,
    title: 'Skills to Optimise Token Usage',
    bullets: [
      'Return distilled answers, not raw file dumps.',
      'Search narrowly and read the slice you need — not the whole file.',
      'Compress sub-agent output before it re-enters the main context.',
      'Prune stale context and summarize long threads aggressively.',
      'Cache north-star facts in memory instead of re-deriving them.',
    ],
    insight: 'Tokens are budget — spend them on reasoning, not re-reading.',
  },
  {
    icon: MapIcon,
    title: 'ARCHITECTURE.md',
    bullets: [
      'One map of the system: boundaries, data flow, and key decisions.',
      'Link to source-of-truth files instead of duplicating them.',
      'Record trade-offs and rejected options, not just the final shape.',
      'Keep it the agent’s first read — optimise for machine and human.',
      'Update it in the same PR that changes the architecture.',
    ],
    insight: 'ARCHITECTURE.md is the highest-leverage file in the repo.',
  },
  {
    icon: Route,
    title: 'When to Use CLAUDE.md, Skills, or Rules',
    bullets: [
      'CLAUDE.md is always-on context — keep it under ~200 lines.',
      'Past 200 lines, extract stable workflows into Skills.',
      'Skills are invokable, reusable procedures with their own docs.',
      'Rules and hooks are automated enforcement the harness runs, not you.',
      'Link out from CLAUDE.md; don’t inline what you can reference.',
    ],
    insight: 'CLAUDE.md is a router, not a manual.',
  },
  {
    icon: Wand2,
    title: 'Adjust the Skill — Don’t Just Use It',
    bullets: [
      'Treat skills as living templates: fork and tune them to your stack.',
      'Encode team conventions into the skill itself, not into every prompt.',
      'When a skill drifts, patch its instructions — never just the output.',
      'Version skills like code: review diffs and keep a changelog.',
      'Promote a repeated ad-hoc prompt into a durable, named skill.',
    ],
    insight: 'A skill you never edit is a skill you don’t yet trust.',
  },
  {
    icon: Network,
    title: 'Spawn Sub-Agents for Corresponding Tasks',
    bullets: [
      'Decompose by boundary: one agent per service, concern, or repo.',
      'Give each agent a narrow brief and crisp success criteria.',
      'Run read-only investigators in parallel; serialize the writers.',
      'Pass distilled findings up the chain, not raw transcripts.',
      'Verify every sub-agent’s "done" — re-run its gate yourself.',
    ],
    insight: 'Sub-agents multiply throughput only when scope is bounded.',
  },
  {
    icon: Workflow,
    title: 'Dynamic Workflows',
    bullets: [
      'Let the plan branch on findings, not follow a fixed script.',
      'Gate each phase: investigate → plan → implement → verify.',
      'Re-plan the moment evidence contradicts your assumption.',
      'Capture decisions inline so the workflow stays resumable.',
      'Match effort to blast radius: shallow for reversible, deep for risky.',
    ],
    insight: 'The workflow adapts to the code — not the code to the workflow.',
  },
  {
    icon: FolderGit2,
    title: 'Use Claude in Multi-Repo Environments',
    bullets: [
      'Keep a workspace manifest: repos, owners, and entry points.',
      'Resolve cross-repo contracts — APIs, schemas, events — first.',
      'Change the producer and every consumer in lockstep; never half-ship.',
      'Use worktrees or parallel clones to isolate concurrent changes.',
      'Centralize shared conventions in one place every agent can read.',
    ],
    insight: 'In multi-repo, the contract is the codebase.',
  },
  {
    icon: BrainCircuit,
    title: 'Memory MCP Servers (mempalace)',
    bullets: [
      'Persist durable facts: architecture, decisions, owners, gotchas.',
      'Store the *why*, not just the what — rationale outlives the code.',
      'Recall before answering questions about past work or decisions.',
      'Link related memories into a navigable knowledge graph.',
      'Verify recalled facts against the code — memory goes stale.',
    ],
    insight: 'Memory turns every session into a continuation, not a restart.',
  },
];
