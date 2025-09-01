export const podcast = {
  light: {
    // Surfaces
    bg: "#F9FAFB",
    card: "#FFFFFF",
    border: "#E5E7EB",
    lineActive: "#F3F4F6",
    shadow: "#000000",

    // Text
    text: "#111827",
    textMuted: "#6B7280",
    paragraph: "#374151",

    // Primary (controls, slider, play)
    blue: "#2563EB",
    blueDark: "#1D4ED8",
    blueSoft: "#DBEAFE",       // icon buttons bg
    blueSoftBorder: "#BFDBFE", // ripples / light borders

    // Highlight chips (to match video transcript)
    greenSoft: "#DCFCE7",
    greenText: "#065F46",
    greenBorder: "#86EFAC",

    // Avatar internals
    avatarInner: "rgba(255,255,255,0.67)", // "#FFFFFFAA"
    avatarInnerBorder: "rgba(0,0,0,0.06)", // "#00000010"

    // Convenience aliases 
    ripple: "#BFDBFE",        
    timeChipBg: "#DBEAFE",
    timeChipBorder: "#BFDBFE",
  },

  dark: {
    // Surfaces
    bg: "#0B1220",
    card: "#111827",
    border: "#1F2937",
    lineActive: "#1F2937",
    shadow: "#000000",

    // Text
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    paragraph: "#CBD5E1",

    // Primary (controls, slider, play)
    blue: "#2563EB",         
    blueDark: "#1D4ED8",
    blueSoft: "#1E3A8A",     
    blueSoftBorder: "#1E40AF",

    // Highlight chips
    greenSoft: "#064E3B",     
    greenText: "#86EFAC",
    greenBorder: "#14532D",

    // Avatar internals
    avatarInner: "rgba(255,255,255,0.12)",
    avatarInnerBorder: "rgba(0,0,0,0.35)",

    // Convenience aliases 
    ripple: "#1E40AF",
    timeChipBg: "#1E3A8A",
    timeChipBorder: "#1E40AF",
  },
} as const;

export type Podcast = typeof podcast.light;
