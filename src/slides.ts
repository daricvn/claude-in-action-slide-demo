import type { Component } from "solid-js";
import {
  LayoutList,
  Building2,
  Workflow,
  FolderGit2,
  Network,
  Layers,
  GitMerge,
  Plug,
  Gauge,
  MonitorPlay,
  BrainCircuit,
  MessageCircleQuestionMark,
  Heart,
} from "lucide-solid";

export type IconComponent = Component<{
  size?: number;
  class?: string;
  "stroke-width"?: number;
}>;

/**
 * Structural model for the deck: one icon per content slide. Slide 0 (hero) is
 * bespoke in `App.tsx`. Slide *text* (title/bullets/insight) is localized in
 * `i18n.ts` (`SlideText`); `SLIDE_ICONS[i]` aligns by index with `t().slides[i]`.
 * New slide = append an icon here + a `SlideText` entry per locale in `i18n.ts`
 * + a `VARIANTS[]` entry in `App.tsx`. Keep arrays aligned.
 */
export const SLIDE_ICONS: IconComponent[] = [
  LayoutList,                // 0: Agenda
  Building2,                 // 1: Why Enterprise-Scale AI...
  Workflow,                  // 2: Building Reusable Skills
  FolderGit2,                // 3: Durable Memory Systems
  Network,                   // 4: Semantic Codebase Navigation
  Layers,                    // 5: Tiered Sub-Agent Pipelines
  GitMerge,                  // 6: Advanced Orchestration (fan-out)
  Plug,                      // 7: MCP Ecosystem (connectors)
  Gauge,                     // 8: Optimizing Tokens
  MonitorPlay,               // 9: Demo
  BrainCircuit,              // 10: Mindset Shift & Takeaways
  MessageCircleQuestionMark, // 11: Q&A
  Heart,                     // 12: Thank You
];

/** Number of content slides (excludes the hero). */
export const SLIDE_COUNT = SLIDE_ICONS.length;
