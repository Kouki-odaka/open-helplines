import type { Config } from 'tailwindcss';
import { vizTokens } from './src/lib/viz-tokens';

/**
 * Tailwind config with CVD-safe design tokens from visualization-tokens.md.
 * Colors support both light and dark modes via CSS variables (class-based dark mode).
 */
const tailwindConfig: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Globe-specific surface colors (dark mode values)
        globe: {
          bg:    vizTokens.colors.surface['globe-bg'].dark,
          ocean: vizTokens.colors.surface['globe-ocean'].dark,
          land:  vizTokens.colors.surface['globe-land'].dark,
        },
        // Panel colors (dark mode)
        panel: {
          bg:     vizTokens.colors.surface['panel-bg'].dark,
          border: vizTokens.colors.surface['panel-border'].dark,
        },
        // Navbar (dark mode)
        navbar: {
          bg:     vizTokens.colors.surface['navbar-bg'].dark,
          border: vizTokens.colors.surface['navbar-border'].dark,
        },
        // Interactive
        interactive: {
          'focus':     vizTokens.colors.interactive['focus-ring'].dark,
          'hover':     vizTokens.colors.interactive['hover-bg'].dark,
          'tab':       vizTokens.colors.interactive['active-tab'].dark,
          'tab-bg':    vizTokens.colors.interactive['active-tab-bg'].dark,
        },
        // Sequential blue (for Globe/Heatmap gradients)
        'seq-blue': {
          ...vizTokens.colors.sequential.blue,
        },
        // Sequential green
        'seq-green': {
          ...vizTokens.colors.sequential.green,
        },
        // Category colors (dark mode, for badges and nodes)
        category: {
          'suicide-prevention': vizTokens.colors.category.suicide_prevention.dark,
          'mental-health':      vizTokens.colors.category.mental_health.dark,
          'domestic-violence':  vizTokens.colors.category.domestic_violence.dark,
          'substance-abuse':    vizTokens.colors.category.substance_abuse.dark,
          'youth':              vizTokens.colors.category.youth.dark,
          'lgbtq':              vizTokens.colors.category.lgbtq.dark,
          'veterans':           vizTokens.colors.category.veterans.dark,
          'general-crisis':     vizTokens.colors.category.general_crisis.dark,
          'other':              vizTokens.colors.category.other.dark,
        },
      },
      fontFamily: {
        sans: [
          'Inter var',
          'Noto Sans',
          'Noto Sans JP',
          'Noto Sans Arabic',
          'Noto Sans Simplified Chinese',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Noto Sans Mono',
          'monospace',
        ],
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'pulse-gentle': 'pulse 3s ease-in-out infinite',
      },
      backgroundImage: {
        'globe-gradient': `radial-gradient(ellipse at center, ${vizTokens.colors.surface['globe-bg'].dark} 0%, #000000 100%)`,
      },
    },
  },
  plugins: [],
} satisfies Config;

export default tailwindConfig;
