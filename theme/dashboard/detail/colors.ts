// theme/colors/home.ts

export const dashboarddetail = {
    light: {
        screenBg: "#F7FAFC",
   
        modal: {
          iconPrimary: "#1D4ED8",
          textPrimary: "#0f172a",
          textMuted:   "#475569",
          textOnPrimary: "#ffffff",
          overlayBg: "rgba(0,0,0,0.35)",
          sheetBg: "#fff",
          sheetTitle: "#0f172a",
          label: "#334155",
          inputBorder: "#E5E7EB",
          inputBg: "#F9FAFB",
          inputText: "#0f172a",
          pickBg: "#EEF2FF",
          pickText: "#1D4ED8",
          cancelBg: "#E2E8F0",
          primaryBg: "#3B82F6",
          disabledBg: "#CBD5E1",
        },
      
       
        header: {
          gradientsByType: {
            Video:   ["#60A5FA", "#2563EB"] as const,   
            Podcast: ["#A78BFA", "#6D28D9"] as const,  
            Text:    ["#FACC15", "#D97706"] as const,   
          },
          
          iconColor: "#ffffff",
          title: "#fff",
          sub: "rgba(255,255,255,0.9)",
          shadow: "#000",
        },
      
       
        itemCard: {
          bg: "#fff",
          border: "#e2e8f0",
          title: "#0f172a",
          meta: "#475569",
             // 🔧 Edit
        editBg: "#DBEAFE",
        editText: "#1E3A8A",     
        editIcon: "#1D4ED8",     
        editBorder: "#BFDBFE",
    
        // 🔧 Delete
        deleteBg: "#FEE2E2",
        deleteText: "#991B1B",   
        deleteIcon: "#DC2626",   
        deleteBorder: "#FCA5A5",


        hasTranscriptBg:"#DBEAFE",
        hasTranscriptText:"#1E3A8A",
        },


      
       
        fab: {
          bg: "#2563EB",
          shadow: "#000",
         
        },
      
        helper: {
          text: "#64748b",
        },
    
        detail: {
          listEmptyText: "#64748b",
          fab: {
            icon: "#ffffff",
          },
        },
    
    },
  
    dark: {


   
        screenBg: "#1e293b",
  
        modal: {
          iconPrimary: "#b5cdfd",
          textPrimary: "#e9f2fb",
          textMuted:   "#9fb9d3",
          textOnPrimary: "#ffffff",
          overlayBg: "rgba(0,0,0,0.65)",
          sheetBg: "#1f2937",
          sheetTitle: "#f3f4f6",
          label: "#d1d5db",
          inputBorder: "#374151",
          inputBg: "#111827",
          inputText: "#f3f4f6",
          pickBg: "#1e293b",
          pickText: "#93c5fd",
          cancelBg: "#374151",
          primaryBg: "#2563eb",
          disabledBg: "#4b5563",
        },
      
        header: {
          gradientsByType: {
            Video:   ["#1E3A8A", "#1D4ED8"] as const,  
            Podcast: ["#5B21B6", "#7C3AED"] as const,  
            Text:    ["#B45309", "#D97706"] as const,
          },
          iconColor: "#ffffff",       
          title: "#f3f4f6",           
          sub: "rgba(229,231,235,0.75)", 
          shadow: "#000000", 
        },
      
        itemCard: {
          bg: "#273043",
          border: "#374151",
          title: "#f3f4f6",
          meta: "#9ca3af",
    
          editBg: "#1F2A44",
          editText: "#93C5FD",
          editIcon: "#93C5FD",
          editBorder: "#2B3A5C",
    
        
        deleteBg: "#3A0E10",
        deleteText: "#FCA5A5",
        deleteIcon: "#F87171",
        deleteBorder: "#4A1518",


        hasTranscriptBg:"#1F2A44",
        hasTranscriptText:"#93C5FD",
        },
      
        fab: {
          bg: "#3b82f6",
          shadow: "#000",
         
        },
      
        helper: {
          text: "#9ca3af",
        },
       
        detail: {
          listEmptyText: "#9fb9d3",
          fab: {
            icon: "#ffffff",
          },
        },
    

     
    },
  } as const;
  
  export type Dashboarddetail = typeof dashboarddetail.light;
  



