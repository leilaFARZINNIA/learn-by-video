// theme/colors/home.ts

export const courselist = {
    light: {
     
        background: '#DFF6F3',
        headersfilm:'#09849b',
        listfilm:'#09849b',
        paperGradientStart: '#e0f7fa',
        paperGradientEnd: '#80DEEA',
        paper: '#e0f7fa',
        border:'#00bcd4',
      
    
    },
  
    dark: {


        background: '#0F172A',
        headersfilm: '#FFFFFF',
        listfilm: '#FFFFFF',
        paperGradientStart: '#1E293B',
        paperGradientEnd: '#334155',
        paper: '#1F2937',
        border: '#3B82F6',


   


     
    },
  } as const;
  
  export type Courselist = typeof courselist.light;
  