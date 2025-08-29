// src/theme/login/palette.ts
export const login = {
    light: {
      
      mint: "#DFF5EF",
      dark: "#111827",
      slate: "#64748B",
      stroke: "rgba(0,0,0,0.06)",
  
    
      bg: "#DFF5EF",            
      cardBg: "#FFFFFFCC",     
      text: "#111827",
      textMuted: "#64748B",
      border: "rgba(0,0,0,0.06)",
      inputBg: "#FFFFFF",
      inputBorder: "#E7EAF0",
      buttonBg: "#111827",
      buttonText: "#FFFFFF",
      googleBtnBg: "#FFFFFF",
      googleIcon: "#111827",
      link: "#2D86C5",
      segmentBg: "#F6F8FB",
      segmentActiveBg: "#FFFFFF",
      error: "#B91C1C",
    },
  
    dark: {
      
      mint: "#93DDC8",
      dark: "#0F172A",
      slate: "#475569",
      stroke: "rgba(255,255,255,0.08)",
  
      
      bg: "#0B1220",
      cardBg: "rgba(17,24,39,0.88)",
      text: "#E5E7EB",
      textMuted: "#94A3B8",
      border: "rgba(255,255,255,0.08)",
      inputBg: "rgba(255,255,255,0.06)",
      inputBorder: "rgba(255,255,255,0.18)",
      buttonBg: "#111827",
      buttonText: "#FFFFFF",
      googleBtnBg: "rgba(255,255,255,0.08)",
      googleIcon: "#E5E7EB",
      link: "#7CC2FF",
      segmentBg: "rgba(255,255,255,0.06)",
      segmentActiveBg: "rgba(255,255,255,0.12)",
      error: "#FCA5A5",
    },
  } as const;
  
  export type Login = typeof login.light;
  