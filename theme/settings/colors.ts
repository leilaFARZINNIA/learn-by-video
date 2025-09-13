// theme/settings.ts
export const settings = {
  light: {
    // --- Surfaces (match Contact)
    bg:         "#F7F9FC",
    cardBg:     "#FFFFFF",
    border:     "#E5E7EB",
    cardShadow: "rgba(2, 6, 23, 0.08)",

    // --- Text
    text:       "#0F172A",   // slate-900
    muted:      "#64748B",   // slate-500
    textMuted:  "#64748B",

    // --- Inputs
    inputBg:     "#FFFFFF",
    inputBorder: "#E5E7EB",

    // --- Buttons (Primary)
    buttonBg:            "#2563EB",   // blue-600
    buttonText:          "#FFFFFF",
    buttonBgDisabled:    "#E2E8F0",   // slate-200
    buttonBorderDisabled:"#CBD5E1",   // slate-300
    buttonTextDisabled:  "#64748B",   // slate-500

    accentBg:            "#2563EB",
    accentText:          "#FFFFFF",
    accentBgDisabled:    "#CBD5E1",
    accentTextDisabled: "#64748B",

    // --- Buttons (Danger)
    dangerBg:            "#EF4444",   // red-500
    dangerText:          "#FFFFFF",
    dangerBgDisabled:    "#FCA5A5",   // red-300
    dangerTextDisabled:  "#7F1D1D",

    // --- Misc
    soft: "#F1F5F9",
    ringFocus: "#3B82F6",   // blue-500

    // --- Theme toggle
    toggleTrackOff: "#E2E8F0",
    toggleTrackOn:  "#2563EB",
    toggleThumb:    "#FFFFFF",
    toggleBorder:   "#CBD5E1",
    toggleShadow:   "rgba(2, 6, 23, 0.20)",

    settings: {} as any,
  },

  dark: {
    // --- Surfaces (match Contact)
    bg:         "#0B1220",
    cardBg:     "#0F172A",   // slate-900
    border:     "#1F2937",   // gray-800
    cardShadow: "rgba(0, 0, 0, 0.50)",

    // --- Text
    text:       "#E5E7EB",   // gray-200
    muted:      "#94A3B8",   // slate-400
    textMuted:  "#94A3B8",

    // --- Inputs
    inputBg:     "#0B1220",
    inputBorder: "#334155",  // slate-700

    // --- Buttons (Primary)
    buttonBg:            "#3B82F6",   
    buttonText:          "#FFFFFF",
    buttonBgDisabled:    "#475569",   // slate-600
    buttonBorderDisabled:"#334155",   // slate-700
    buttonTextDisabled:  "#64748B",   // slate-500

    // --- Buttons (Accent)
    accentBg:            "#3B82F6",
    accentText:          "#FFFFFF",
    accentBgDisabled:    "#475569",
    accentTextDisabled:  "#64748B",

    // --- Buttons (Danger)
    dangerBg:            "#EF4444",
    dangerText:          "#FFFFFF",
    dangerBgDisabled:    "#7F1D1D",
    dangerTextDisabled:  "#FCA5A5",

    // --- Misc
    soft: "#111827",
    ringFocus: "#60A5FA",  // blue-400

    // --- Theme toggle
    toggleTrackOff: "#1F2937",
    toggleTrackOn:  "#3B82F6",
    toggleThumb:    "#0B1220",
    toggleBorder:   "#334155",
    toggleShadow:   "rgba(0, 0, 0, 0.45)",

    settings: {} as any,
  },
} as const;

export type Settings = typeof settings.light;
