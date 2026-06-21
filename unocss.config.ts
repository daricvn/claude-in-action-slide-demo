import { defineConfig } from '@unocss/vite';
import { presetWind3 } from '@unocss/preset-wind3';

/**
 * UnoCSS configuration for the "Claude in Action" deck.
 *
 * presetWind3 gives us Tailwind-compatible utilities we rely on heavily:
 * backdrop-blur, blur-3xl, shadow-2xl, ring, gradients, transforms.
 *
 * Shortcuts encode the glassmorphism design system once so slides stay
 * declarative and consistent.
 */
export default defineConfig({
  presets: [presetWind3()],

  theme: {
    fontFamily: {
      sans: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    colors: {
      // Brand accents used across orbs, gradients and highlights.
      cosmic: '#05050A',
      cyanGlow: '#67E8F9',
      violetGlow: '#C084FC',
      emeraldGlow: '#6EE7B7',
    },
  },

  shortcuts: {
    // The hero / content card. Frosted fill, soft border + ring.
    // NOTE: blur kept modest (16px). A larger radius re-blurs the live animated
    // canvas behind the card every frame — the main perf cliff. Fill bumped to
    // /8 to keep the frosted look readable at the lower blur.
    glass:
      'bg-white/8 backdrop-blur-lg border border-white/10 shadow-2xl ring-1 ring-white/5',
    // Small frosted badge used for the "Key Insight" pill and nav controls.
    'glass-pill':
      'bg-white/8 backdrop-blur-md border border-white/10 ring-1 ring-white/5',
    // Gradient text used for titles.
    'text-gradient':
      'bg-gradient-to-b from-cyanGlow via-white to-violetGlow bg-clip-text text-transparent',
  },
});
