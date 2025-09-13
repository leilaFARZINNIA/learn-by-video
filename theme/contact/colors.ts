
export const contact = {
    light: {
      bg: "#F7F9FC",
      cardBg: "#FFFFFF",
      border: "#E5E7EB",
      text: "#0F172A",
      textMuted: "#64748B",
  
      inputBg: "#FFFFFF",
      inputBorder: "#E5E7EB",
  
    

          // --- Buttons (Primary)
    buttonBg:            "#2563EB",   // blue-600
    buttonText:          "#FFFFFF",
    buttonBgDisabled:    "#E2E8F0",   // slate-200
    buttonBorderDisabled:"#CBD5E1",   // slate-300
    buttonTextDisabled:  "#64748B",   // slate-500
  
      soft: "#F1F5F9",
      ringFocus: "#3B82F6",
      danger: "#EF4444",
      dangerText: "#B91C1C",
  
      contact: {} as any,
    },
  
    dark: {
      bg: "#0B1220",
      cardBg: "#0F172A",
      border: "#1F2937",
      text: "#E5E7EB",
      textMuted: "#94A3B8",
  
      inputBg: "#0B1220",
      inputBorder: "#334155",


      buttonBg:            "#3B82F6",   
      buttonText:          "#FFFFFF",
      buttonBgDisabled:    "#475569",   // slate-600
      buttonBorderDisabled:"#334155",   // slate-700
      buttonTextDisabled:  "#64748B",  
  
      soft: "#111827",
      ringFocus: "#60A5FA",
      danger: "#F87171",
      dangerText: "#FCA5A5",
  
      contact: {} as any,
    },
  } as const;
  
  export type Contact = typeof contact.light;
  