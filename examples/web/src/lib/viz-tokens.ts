/**
 * open-helplines Visualization Design Tokens
 * CVD-safe palette based on Okabe & Ito (2008) + Paul Tol extended
 *
 * Source: docs/design/visualization-tokens.md (authored by uiux-viz)
 *
 * @license Apache-2.0
 */

export const vizTokens = {
  colors: {
    category: {
      suicide_prevention: { light: '#E69F00', dark: '#F5C842' },
      mental_health:      { light: '#56B4E9', dark: '#7ECBF3' },
      domestic_violence:  { light: '#009E73', dark: '#00C48D' },
      sexual_violence:    { light: '#CC9900', dark: '#F5C842' },
      substance_abuse:    { light: '#0072B2', dark: '#338FD4' },
      youth:              { light: '#D55E00', dark: '#E87330' },
      lgbtq:              { light: '#CC79A7', dark: '#E09CC7' },
      veterans:           { light: '#757575', dark: '#A0A0A0' },
      elder:              { light: '#44AA99', dark: '#5EC8B6' },
      grief:              { light: '#332288', dark: '#5544BB' },
      general_crisis:     { light: '#88CCEE', dark: '#A8DCFF' },
      other:              { light: '#BBBBBB', dark: '#888888' },
    },
    sequential: {
      blue: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
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
      primary:   { light: '#0f172a', dark: '#f1f5f9' },
      secondary: { light: '#475569', dark: '#94a3b8' },
      disabled:  { light: '#94a3b8', dark: '#4b5563' },
    },
    interactive: {
      'focus-ring':    { light: '#3b82f6', dark: '#60a5fa' },
      'hover-bg':      { light: '#f1f5f9', dark: '#1e293b' },
      'active-tab':    { light: '#0ea5e9', dark: '#38bdf8' },
      'active-tab-bg': { light: '#e0f2fe', dark: '#0c2d4a' },
    },
  },
  globe: {
    column: {
      heightScale: 'log' as const,
      heightMin: 0.01,
      heightMax: 0.35,
      radiusBottom: 0.5,
      radiusTop: 0.5,
      segments: 6,
      opacity: 0.85,
      blendMode: 'screen' as const,
      glowIntensity: 1.5,
    },
    pointCloud: {
      sizeAttenuation: true,
      pointSize: 0.5,
      minZoomActivation: 1.2,
    },
    atmosphere: {
      color: '#38bdf8',
      opacity: 0.15,
    },
    camera: {
      initialAltitude: 2.5,
      minAltitude: 0.3,
      maxAltitude: 4.0,
      autoRotateSpeed: 0.5,
    },
  },
  network: {
    node: {
      country:       { shape: 'circle',  r: 16 },
      category:      { shape: 'hexagon', r: 12 },
      language:      { shape: 'diamond', r: 10 },
      contact_method:{ shape: 'square',  r: 10 },
    },
    edge: {
      minWidth: 1,
      maxWidth: 4,
      baseOpacity: 0.4,
      highlightOpacity: 0.8,
      dimOpacity: 0.08,
    },
    force: {
      chargeStrength: -120,
      linkDistance: 80,
      collideRadius: 24,
      centerStrength: 0.05,
      mobile: {
        chargeStrength: -80,
        linkDistance: 60,
        nodeScaleFactor: 1.3,
      },
    },
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      verySlow: '1000ms',
    },
    globe: {
      autoRotateSpeed: 0.5,
      hoverTransition: '300ms ease',
      columnRiseDuration: '800ms',
      reducedMotion: {
        autoRotateSpeed: 0,
        columnRiseDuration: '0ms',
      },
    },
    heatmap: {
      frameIntervalMs: 200,
      fastFrameIntervalMs: 100,
      slowFrameIntervalMs: 400,
    },
    network: {
      nodeFadeDuration: '200ms',
      forceSimulationDecay: 0.028,
    },
  },
} as const;

export type VizCategoryKey = keyof typeof vizTokens.colors.category;
export type VizColorMode = 'light' | 'dark';

/**
 * Returns the CVD-safe color for a given helpline category.
 */
export function getCategoryColor(
  category: VizCategoryKey | string,
  mode: VizColorMode = 'dark'
): string {
  const key = category as VizCategoryKey;
  return vizTokens.colors.category[key]?.[mode] ?? vizTokens.colors.category.other[mode];
}

/**
 * Maps a helpline count to globe column height using log scale.
 * Returns a value in [0.01, 0.35].
 */
export function mapCountToColumnHeight(count: number, maxCount: number): number {
  if (count <= 0 || maxCount <= 0) return 0;
  const logCount = Math.log(count + 1);
  const logMax = Math.log(maxCount + 1);
  const normalized = logCount / logMax;
  return vizTokens.globe.column.heightMin + normalized * (vizTokens.globe.column.heightMax - vizTokens.globe.column.heightMin);
}

/**
 * Maps a helpline count to a sequential blue color.
 */
export function mapCountToBlueColor(count: number, maxCount: number): string {
  if (maxCount <= 0) return vizTokens.colors.sequential.blue[300];
  const ratio = Math.log(count + 1) / Math.log(maxCount + 1);
  if (ratio < 0.2) return vizTokens.colors.sequential.blue[300];
  if (ratio < 0.4) return vizTokens.colors.sequential.blue[400];
  if (ratio < 0.6) return vizTokens.colors.sequential.blue[500];
  if (ratio < 0.8) return vizTokens.colors.sequential.blue[600];
  return vizTokens.colors.sequential.blue[700];
}
