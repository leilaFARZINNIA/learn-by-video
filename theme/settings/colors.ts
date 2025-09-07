// theme/settings.ts
export const settings = {
  light: {
  

    // --- Surfaces
    bg:        "#F8FAFC",
    cardBg:    "#FFFFFF",
    border:    "#E2E8F0",
    cardShadow:"rgba(2, 6, 23, 0.06)",

    // --- Text
    text:      "#0B1220",
    muted:     "#64748B",
    textMuted: "#64748B",

    // --- Inputs
    inputBg:    "#FFFFFF",
    inputBorder:"#D0D7E2",

    // --- Buttons
    buttonBg:   "#2563EB",
    buttonText: "#FFFFFF",
    accentBg:   "#2563EB",
    accentText: "#FFFFFF",
    dangerBg:   "#DC2626",
    dangerText: "#FFFFFF",

    // --- Misc
    soft: "#EEF2F6",

    // --- Theme toggle
    toggleTrackOff:"#E2E8F0",
    toggleTrackOn: "#2563EB",  
    toggleThumb:   "#FFFFFF",
    toggleBorder:  "#CBD5E1",
    toggleShadow:  "rgba(2, 6, 23, 0.20)",

   
    settings: {} as any,
  },

  dark: {
   

    // Surfaces
    bg:        "#0B1220",
    cardBg:    "#0F172A",
    border:    "#1E293B",
    cardShadow:"rgba(0, 0, 0, 0.50)",

    // Text
    text:      "#E2E8F0",
    muted:     "#94A3B8",
    textMuted: "#94A3B8",

    // Inputs
    inputBg:    "#0B1220",
    inputBorder:"#334155",

    // Buttons
    buttonBg:   "#E2E8F0",
    buttonText: "#0B1220",
    accentBg:   "#E2E8F0",  
    accentText: "#0B1220",  
    dangerBg:   "#EF4444",
    dangerText: "#FFFFFF",

    // Misc
    soft: "#111827",

    // Theme toggle
    toggleTrackOff:"#1F2937",
    toggleTrackOn: "#2563EB",
    toggleThumb:   "#0B1220",
    toggleBorder:  "#334155",
    toggleShadow:  "rgba(0, 0, 0, 0.45)",

    settings: {} as any,
  },
} as const;



export type Settings = typeof settings.light;
