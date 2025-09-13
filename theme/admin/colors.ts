
export const admin = {
    light: {
        bg: "#F7F9FC",
        cardBg: "#FFFFFF",
        border: "#E5E7EB",
        text: "#0F172A",
        textMuted: "#64748B",
        soft: "#F1F5F9",
        ring: "#3B82F6",
        primary: "#2563EB",
        danger: "#EF4444",
        chip: {
          new:  { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
          open: { bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C" },
          done: { bg: "#ECFDF5", border: "#A7F3D0", text: "#047857" },
        },
      },
      dark: {
        bg: "#0B1220",
        cardBg: "#0F172A",
        border: "#334155",
        text: "#E5E7EB",
        textMuted: "#94A3B8",
        soft: "#111827",
        ring: "#60A5FA",
        primary: "#3B82F6",
        danger: "#F87171",
        chip: {
          new:  { bg: "#0B1A36", border: "#1E3A8A", text: "#93C5FD" },
          open: { bg: "#2B1705", border: "#EA580C", text: "#FDBA74" },
          done: { bg: "#0A231D", border: "#065F46", text: "#6EE7B7" },
        },
      },
  } as const;

  
  
  export type Admin = typeof admin.light;
  