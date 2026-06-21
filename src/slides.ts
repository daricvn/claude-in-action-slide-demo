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
  Balloon,
} from "lucide-solid";

export type IconComponent = Component<{
  size?: number;
  class?: string;
  "stroke-width"?: number;
}>;

/**
 * Structural model for the deck: one icon per content slide (1–10). Slide 0
 * (hero) is bespoke in `App.tsx`. Slide *text* (title/bullets/insight) is
 * localized in `i18n.ts` (`SlideText`); `SLIDE_ICONS[i]` aligns by index with
 * `t().slides[i]`. New slide = append an icon here + a `SlideText` entry per
 * locale in `i18n.ts` + a `VARIANTS[]` entry in `App.tsx`. Keep arrays aligned.
 */
export const SLIDE_ICONS: IconComponent[] = [
  Building2,
  Workflow,
  FolderGit2,
  Network,
  Layers,
  Coins,
  MonitorPlay,
  BrainCircuit,
  Balloon,
  MessageCircleQuestionMark,
];

/** Number of content slides (excludes the hero). */
export const SLIDE_COUNT = SLIDE_ICONS.length;
