

export const about= {
    light: {
     
    
        aboutBg:    'linear-gradient(180deg, #f7fbff 0%, #eaf4fb 100%)',    
        primary:    '#2178d5',      
        primaryLight: '#8ec8f8',    
        menuText:   '#1858a3',      
        menuBg:     '#e5f1fd',     
        bannerBg:   'rgba(103, 176, 255, 0.82)',  
        headerText: '#162036',     
        white:      '#fff',       
        text:       '#232b3b',      
        transparent:'transparent',
        gradient:   'linear-gradient(180deg, #eaf4fb 0%, #d2e6fa 100%)', 
        shadow:     '#70b8f6',      
        accent:     '#00c6fb',      
        success:    '#43e77c',      
        warning:    '#ffc93c',    
        error:      '#ff5c72',  
    
    },
  
    dark: {


   
        aboutBg:    '#212935',
        primary:    '#3994e6',
        primaryLight: '#60b5f7',
        menuText:   '#a6cfff',
        menuBg:     '#1b2432',
        bannerBg:   'rgba(37, 74, 117, 0.92)',
        headerText: '#eaf6ff',
        white:      '#1d2433',
        text:       '#d5e7fa',
        transparent:'transparent',
        gradient:   'linear-gradient(180deg, #1c2331 0%, #212c3a 100%)',
        shadow:     '#255687',
        accent:     '#12d1ff',
        success:    '#28df99',
        warning:    '#ffe082',
        error:      '#ff8a99', 

     
    },
  } as const;
  
  export type About = typeof about.light;
  