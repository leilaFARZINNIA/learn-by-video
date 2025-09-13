// theme/colors/home.ts

export const homeColors = {
    light: {
     
      background:   '#DFF6F3',
      topSectionBg:'#DFF6F3',
      middleSectionBg: '#F9FAFB',
      bottomSectionBg : '#e3f9f4',
      textPrimary:'#000',
      ttextSecondary: '#555',
    
    },
  
    dark: {


   
      background:      '#0F172A', 
      topSectionBg:    '#1E293B', 
      middleSectionBg: '#111827', 
      bottomSectionBg: '#1E293B', 
      textPrimary:     '#E5E7EB', 
      textSecondary: '#D0D8E0',

     
    },
  } as const;
  
  export type HomeTheme = typeof homeColors.light;
  