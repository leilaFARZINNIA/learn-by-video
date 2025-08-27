export const dashboardColors = {
  light: {
    screenBg: "#F5F7FB",
    header: {
      title: "#111827",
      subtitle: "#6B7280",
    },
    addBtn: {
      gradient: ["#6AA0FF", "#3C73F6"] as const,
      text: "#ffffff",
    },

    modal: {
      overlayBg: "rgba(0,0,0,0.35)",
      sheetBg: "#ffffff",
      title: "#111827",
      label: "#374151",
      inputBorder: "#E5E7EB",
      inputBg: "#F9FAFB",
      inputText: "#111827",

      chipBorder: "#E5E7EB",
      chipBg: "#ffffff",
      chipText: "#374151",

      chipActiveBorder: "#3C73F6",
      chipActiveBg: "#EEF2FF",
      chipTextActive: "#1D4ED8",

      cancelBg: "#E5E7EB",
      cancelText: "#111827",

      addGradient: ["#6AA0FF", "#3C73F6"] as const,
      addText: "#ffffff",
    },

    card: {
      shadow: "#000",
      title: "#0B1220",
      hint: "#0B1220",
      action: "#0B1220",
      status: "#0B1220",
      deleteBg: "rgba(255,255,255,0.35)",
      deleteText: "#991B1B",
    },

    deleteModal: {
      overlayBg: "rgba(0,0,0,0.35)",
      sheetBg: "#ffffff",
      title: "#111827",
      info: "#374151",

      cancelBg: "#E5E7EB",
      cancelText: "#111827",

      deleteGradient: ["#EF4444", "#DC2626"] as const,
      deleteText: "#ffffff",
    },

    gradientsByType: {
      Video:   ["#93C5FD", "#3B82F6"] as const,
      Podcast: ["#C4B5FD", "#8B5CF6"] as const,
      Text:    ["#FDE68A", "#F59E0B"] as const,
    },
    gradientPool: [
      ["#88B9FF", "#4E86F7"],
      ["#9B5AF7", "#5C35E4"],
      ["#FFD36A", "#F7A64A"],
      ["#6AD4FF", "#2F8FED"],
      ["#6EE7B7", "#3ABAB4"],
      ["#FCA5A5", "#F87171"],
      ["#FBCFE8", "#F472B6"],
      ["#C4B5FD", "#8B5CF6"],
      ["#FDE68A", "#F59E0B"],
      ["#93C5FD", "#3B82F6"],
      ["#A7F3D0", "#10B981"],
      ["#FECACA", "#EF4444"],
    ] as const,
  },

  dark: {
    screenBg: "#0F172A",
    header: {
      title: "#E5E7EB",
      subtitle: "#9CA3AF",
    },
    addBtn: {
      gradient: ["#3B82F6", "#1E40AF"] as const,
      text: "#F9FAFB",
    },

    modal: {
      overlayBg: "rgba(0,0,0,0.65)",
      sheetBg: "#1f2937",
      title: "#f3f4f6",
      label: "#d1d5db",
      inputBorder: "#374151",
      inputBg: "#111827",
      inputText: "#f3f4f6",

      chipBorder: "#374151",
      chipBg: "#111827",
      chipText: "#d1d5db",

      chipActiveBorder: "#2563eb",
      chipActiveBg: "#1e293b",
      chipTextActive: "#60a5fa",

      cancelBg: "#374151",
      cancelText: "#f3f4f6",

      addGradient: ["#3B82F6", "#1E40AF"] as const,
      addText: "#f9fafb",
    },

    card: {
      shadow: "#000",
      title: "#F3F4F6",
      hint: "#D1D5DB",
      action: "#E5E7EB",
      status: "#9CA3AF",
      deleteBg: "rgba(0,0,0,0.35)",
      deleteText: "#FCA5A5",
    },

    deleteModal: {
      overlayBg: "rgba(0,0,0,0.65)",
      sheetBg: "#1f2937",
      title: "#f3f4f6",
      info: "#d1d5db",

      cancelBg: "#374151",
      cancelText: "#f3f4f6",

      deleteGradient: ["#7F1D1D", "#DC2626"] as const,
      deleteText: "#ffffff",
    },

    gradientsByType: {
      Video:   ["#1E40AF", "#2563EB"] as const,
      Podcast: ["#5B21B6", "#7C3AED"] as const,
      Text:    ["#B45309", "#D97706"] as const,
    },
    gradientPool: [
      ["#1E3A8A", "#1D4ED8"],
      ["#6D28D9", "#7C3AED"],
      ["#92400E", "#D97706"],
      ["#0F766E", "#14B8A6"],
      ["#991B1B", "#DC2626"],
      ["#BE185D", "#EC4899"],
      ["#4C1D95", "#7C3AED"],
      ["#0369A1", "#0EA5E9"],
      ["#15803D", "#22C55E"],
    ] as const,
  },
} as const;

export type DashboardColors = typeof dashboardColors.light;
