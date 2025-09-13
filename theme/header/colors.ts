

export const header= {
    light: {
     
    

        headerBg:'#f8fafc',
        headerShadow: '#001028',
        headerIcon: '#007aff',
        headerTitleP: '#1a2845',
    
    },
  
    dark: {


   
        headerBg: '#17202b',
        headerShadow: '#000b18',
        headerIcon: '#3db0ff',
        headerTitleP: '#e9f2fb',

     
    },
  } as const;
  
  export type Header = typeof header.light;
  