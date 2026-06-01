# open-helplines デザイントークン定義

> **Status:** Draft v1.0 — 2026-06-02  
> **Author:** UI/UX Designer Agent (uiux-viz)  
> **用途:** `examples/web/tailwind.config.ts` + `src/lib/colors.ts` への注入用  
> **参照:** `visualization.md` §5 デザインシステム

---

## 1. カラートークン（CVD-safe）

### 1.1 カテゴリ識別色（12色、Okabe-Ito + Tol拡張）

```json
{
  "colors": {
    "category": {
      "suicide_prevention": {
        "light": "#E69F00",
        "dark": "#F5C842",
        "label": "Suicide Prevention"
      },
      "mental_health": {
        "light": "#56B4E9",
        "dark": "#7ECBF3",
        "label": "Mental Health"
      },
      "domestic_violence": {
        "light": "#009E73",
        "dark": "#00C48D",
        "label": "Domestic Violence"
      },
      "sexual_violence": {
        "light": "#CC9900",
        "dark": "#F5C842",
        "label": "Sexual Violence"
      },
      "substance_abuse": {
        "light": "#0072B2",
        "dark": "#338FD4",
        "label": "Substance Abuse"
      },
      "youth": {
        "light": "#D55E00",
        "dark": "#E87330",
        "label": "Youth"
      },
      "lgbtq": {
        "light": "#CC79A7",
        "dark": "#E09CC7",
        "label": "LGBTQ+"
      },
      "veterans": {
        "light": "#757575",
        "dark": "#A0A0A0",
        "label": "Veterans"
      },
      "elder": {
        "light": "#44AA99",
        "dark": "#5EC8B6",
        "label": "Elder"
      },
      "grief": {
        "light": "#332288",
        "dark": "#5544BB",
        "label": "Grief"
      },
      "general_crisis": {
        "light": "#88CCEE",
        "dark": "#A8DCFF",
        "label": "General Crisis"
      },
      "other": {
        "light": "#BBBBBB",
        "dark": "#888888",
        "label": "Other"
      }
    }
  }
}
```

### 1.2 Sequential パレット（Globe / Heatmap グラデーション）

```json
{
  "colors": {
    "sequential": {
      "blue": {
        "50":  "#f0f9ff",
        "100": "#e0f2fe",
        "200": "#bae6fd",
        "300": "#7dd3fc",
        "400": "#38bdf8",
        "500": "#0ea5e9",
        "600": "#0284c7",
        "700": "#0369a1",
        "800": "#075985",
        "900": "#0c4a6e"
      },
      "green": {
        "50":  "#f0fdf4",
        "100": "#dcfce7",
        "200": "#bbf7d0",
        "300": "#86efac",
        "400": "#4ade80",
        "500": "#22c55e",
        "600": "#16a34a",
        "700": "#15803d",
        "800": "#166534",
        "900": "#14532d"
      }
    }
  }
}
```

### 1.3 セマンティックカラー（背景・サーフェス・テキスト）

```json
{
  "colors": {
    "surface": {
      "globe-bg": {
        "light": "#f8fafc",
        "dark": "#0a0e1a"
      },
      "globe-ocean": {
        "light": "#dbeafe",
        "dark": "#1a2744"
      },
      "globe-land": {
        "light": "#e2e8f0",
        "dark": "#1e3a5f"
      },
      "panel-bg": {
        "light": "#ffffff",
        "dark": "#111827"
      },
      "panel-border": {
        "light": "#e5e7eb",
        "dark": "#374151"
      },
      "navbar-bg": {
        "light": "#ffffff",
        "dark": "#0f172a"
      },
      "navbar-border": {
        "light": "#f1f5f9",
        "dark": "#1e293b"
      }
    },
    "text": {
      "primary": {
        "light": "#0f172a",
        "dark": "#f1f5f9"
      },
      "secondary": {
        "light": "#475569",
        "dark": "#94a3b8"
      },
      "disabled": {
        "light": "#94a3b8",
        "dark": "#4b5563"
      },
      "on-dark-bg": {
        "light": "#f1f5f9",
        "dark": "#f1f5f9"
      }
    },
    "interactive": {
      "focus-ring": {
        "light": "#3b82f6",
        "dark": "#60a5fa"
      },
      "hover-bg": {
        "light": "#f1f5f9",
        "dark": "#1e293b"
      },
      "active-tab": {
        "light": "#0ea5e9",
        "dark": "#38bdf8"
      },
      "active-tab-bg": {
        "light": "#e0f2fe",
        "dark": "#0c2d4a"
      }
    }
  }
}
```

### 1.4 Tailwind config.ts 注入例

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { vizTokens } from './src/lib/viz-tokens'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // カテゴリ色
        category: vizTokens.colors.category,
        // Sequential
        'seq-blue': vizTokens.colors.sequential.blue,
        'seq-green': vizTokens.colors.sequential.green,
        // セマンティック
        surface: vizTokens.colors.surface,
        'text-token': vizTokens.colors.text,
        interactive: vizTokens.colors.interactive,
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
    },
  },
  plugins: [],
} satisfies Config
```

---

## 2. タイポグラフィトークン

```json
{
  "typography": {
    "scale": {
      "xs":   { "size": "0.75rem",  "lineHeight": "1rem",     "use": "データラベル・フッター" },
      "sm":   { "size": "0.875rem", "lineHeight": "1.25rem",  "use": "Tooltip・フィルタUI" },
      "base": { "size": "1rem",     "lineHeight": "1.625rem", "use": "本文・サイドパネル" },
      "lg":   { "size": "1.125rem", "lineHeight": "1.75rem",  "use": "セクション見出し" },
      "xl":   { "size": "1.25rem",  "lineHeight": "1.75rem",  "use": "ページ副見出し" },
      "2xl":  { "size": "1.5rem",   "lineHeight": "2rem",     "use": "ページ見出し" },
      "4xl":  { "size": "2.25rem",  "lineHeight": "2.5rem",   "use": "Landing ヒーロー" }
    },
    "weight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "letterSpacing": {
      "normal": "0em",
      "wide":   "0.025em",
      "wider":  "0.05em"
    },
    "maxLineLength": "70ch",
    "paragraphSpacing": "1em"
  }
}
```

---

## 3. スペーシング・シャドウ・ボーダートークン

```json
{
  "spacing": {
    "1":  "0.25rem",
    "2":  "0.5rem",
    "3":  "0.75rem",
    "4":  "1rem",
    "6":  "1.5rem",
    "8":  "2rem",
    "12": "3rem",
    "16": "4rem",
    "24": "6rem"
  },
  "borderRadius": {
    "sm":   "0.25rem",
    "md":   "0.375rem",
    "lg":   "0.5rem",
    "xl":   "0.75rem",
    "full": "9999px"
  },
  "shadow": {
    "tooltip": "0 2px 8px rgba(0,0,0,0.15)",
    "panel":   "0 4px 24px rgba(0,0,0,0.12)",
    "navbar":  "0 1px 3px rgba(0,0,0,0.08)"
  },
  "border": {
    "width": {
      "default": "1px",
      "medium":  "2px"
    }
  }
}
```

---

## 4. アニメーション・モーション トークン

```json
{
  "animation": {
    "duration": {
      "fast":    "150ms",
      "normal":  "300ms",
      "slow":    "500ms",
      "verySlow":"1000ms"
    },
    "easing": {
      "ease":       "cubic-bezier(0.4, 0, 0.2, 1)",
      "easeIn":     "cubic-bezier(0.4, 0, 1, 1)",
      "easeOut":    "cubic-bezier(0, 0, 0.2, 1)",
      "spring":     "cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    "globe": {
      "autoRotateSpeed":  "0.5",
      "hoverTransition":  "300ms ease",
      "columnRiseDuration": "800ms spring",
      "reducedMotion": {
        "autoRotateSpeed": "0",
        "columnRiseDuration": "0ms"
      }
    },
    "heatmap": {
      "frameInterval": "200ms",
      "fastFrameInterval": "100ms",
      "slowFrameInterval": "400ms",
      "reducedMotion": {
        "autoPlay": false
      }
    },
    "network": {
      "nodeFadeOut": "opacity 200ms ease",
      "forceSimulationDecay": "0.028"
    }
  }
}
```

---

## 5. ネットワーク Graph トークン

```json
{
  "network": {
    "node": {
      "country": {
        "shape": "circle",
        "r": 16,
        "fill": "colors.category.mental_health.light",
        "stroke": "#ffffff",
        "strokeWidth": 2
      },
      "category": {
        "shape": "hexagon",
        "r": 12,
        "fill": "colors.category[name].light",
        "stroke": "#ffffff",
        "strokeWidth": 1.5
      },
      "language": {
        "shape": "diamond",
        "r": 10,
        "fill": "colors.category.suicide_prevention.light",
        "stroke": "#ffffff",
        "strokeWidth": 1
      },
      "contact_method": {
        "shape": "square",
        "r": 10,
        "fill": "colors.category.domestic_violence.light",
        "stroke": "#ffffff",
        "strokeWidth": 1
      }
    },
    "edge": {
      "minWidth": 1,
      "maxWidth": 4,
      "baseOpacity": 0.4,
      "highlightOpacity": 0.8,
      "dimOpacity": 0.08
    },
    "force": {
      "chargeStrength": -120,
      "linkDistance": 80,
      "collideRadius": 24,
      "centerStrength": 0.05,
      "mobile": {
        "chargeStrength": -80,
        "linkDistance": 60,
        "nodeScaleFactor": 1.3
      }
    }
  }
}
```

---

## 6. Globe 固有トークン

```json
{
  "globe": {
    "column": {
      "heightScale": "log",
      "heightMin": 0.01,
      "heightMax": 0.35,
      "radiusBottom": 0.5,
      "radiusTop": 0.5,
      "segments": 6,
      "opacity": 0.85,
      "blendMode": "screen",
      "glowIntensity": 1.5
    },
    "pointCloud": {
      "sizeAttenuation": true,
      "pointSize": 0.5,
      "minZoomActivation": 1.2
    },
    "atmosphere": {
      "color": "#38bdf8",
      "opacity": 0.15
    },
    "camera": {
      "initialAltitude": 2.5,
      "minAltitude": 0.3,
      "maxAltitude": 4.0,
      "autoRotateSpeed": 0.5
    }
  }
}
```

---

## 7. src/lib/viz-tokens.ts 実装テンプレート

```typescript
/**
 * open-helplines Visualization Design Tokens
 * CVD-safe palette based on Okabe & Ito (2008) + Paul Tol extended
 * @license Apache-2.0
 */
export const vizTokens = {
  colors: {
    category: {
      suicide_prevention:  { light: '#E69F00', dark: '#F5C842' },
      mental_health:       { light: '#56B4E9', dark: '#7ECBF3' },
      domestic_violence:   { light: '#009E73', dark: '#00C48D' },
      sexual_violence:     { light: '#CC9900', dark: '#F5C842' },
      substance_abuse:     { light: '#0072B2', dark: '#338FD4' },
      youth:               { light: '#D55E00', dark: '#E87330' },
      lgbtq:               { light: '#CC79A7', dark: '#E09CC7' },
      veterans:            { light: '#757575', dark: '#A0A0A0' },
      elder:               { light: '#44AA99', dark: '#5EC8B6' },
      grief:               { light: '#332288', dark: '#5544BB' },
      general_crisis:      { light: '#88CCEE', dark: '#A8DCFF' },
      other:               { light: '#BBBBBB', dark: '#888888' },
    },
    sequential: {
      blue: {
        50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
        400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
        800: '#075985', 900: '#0c4a6e',
      },
      green: {
        50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
        400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
        800: '#166534', 900: '#14532d',
      },
    },
    surface: {
      'globe-bg':      { light: '#f8fafc', dark: '#0a0e1a' },
      'globe-ocean':   { light: '#dbeafe', dark: '#1a2744' },
      'globe-land':    { light: '#e2e8f0', dark: '#1e3a5f' },
      'panel-bg':      { light: '#ffffff', dark: '#111827' },
      'panel-border':  { light: '#e5e7eb', dark: '#374151' },
      'navbar-bg':     { light: '#ffffff', dark: '#0f172a' },
      'navbar-border': { light: '#f1f5f9', dark: '#1e293b' },
    },
    text: {
      primary:    { light: '#0f172a', dark: '#f1f5f9' },
      secondary:  { light: '#475569', dark: '#94a3b8' },
      disabled:   { light: '#94a3b8', dark: '#4b5563' },
    },
    interactive: {
      'focus-ring':    { light: '#3b82f6', dark: '#60a5fa' },
      'hover-bg':      { light: '#f1f5f9', dark: '#1e293b' },
      'active-tab':    { light: '#0ea5e9', dark: '#38bdf8' },
      'active-tab-bg': { light: '#e0f2fe', dark: '#0c2d4a' },
    },
  },
} as const

export type VizCategoryKey = keyof typeof vizTokens.colors.category
export type VizColorMode = 'light' | 'dark'

/**
 * カテゴリキーから現在の color mode の色を返す
 * @example getCategoryColor('mental_health', 'dark') // '#7ECBF3'
 */
export function getCategoryColor(
  category: VizCategoryKey,
  mode: VizColorMode = 'light'
): string {
  return vizTokens.colors.category[category][mode]
}

/**
 * helpline 数を Globe の柱高さ (0.0 - 1.0) にマッピング (対数スケール)
 */
export function mapCountToHeight(count: number, maxCount: number): number {
  if (count <= 0 || maxCount <= 0) return 0
  const logCount = Math.log(count + 1)
  const logMax = Math.log(maxCount + 1)
  return Math.min(0.01 + (logCount / logMax) * 0.34, 0.35)
}
```

---

*トークン定義 EOF — `se-viz` による `tailwind.config.ts` + `src/lib/viz-tokens.ts` への実装を依頼。*
