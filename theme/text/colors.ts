// theme/text.colors.ts
export const text = {
    light: {
     
      bg: "#F7FAFC",
      card: "#FFFFFF",
      border: "#E5E7EB",
      shadow: "#000000",
  
      
      text: "#0F172A",
      subtext: "#475569",
      muted: "#64748B",
  
   
      accent: "#2563EB",      
  
 
      highlightBg: "#EAF7D3",
      highlightText: "#257600",
  

      chipBg: "#E2E8F0",
      chipText: "#475569",
    },
  
    dark: {
   
      bg: "#0B1220",
      card: "#111827",
      border: "#2A3441",
      shadow: "#000000",
  
   
      text: "#F8FAFC",
      subtext: "#CBD5E1",
      muted: "#94A3B8",
  
 
      accent: "#60A5FA",
  
    
      highlightBg: "#1F3B12",
      highlightText: "#D9F99D",
  
   
      chipBg: "#1F2937",
      chipText: "#CBD5E1",
    },
  } as const;
  
  export type Text = typeof text.light;
  