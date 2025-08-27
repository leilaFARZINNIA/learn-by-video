// theme/colors/home.ts

export const menu = {
    light: {
     
        background: '#DFF6F3',
        sidebarBg:            '#f8fafc',
        sidebarBorder:        '#e5e7eb',
        sidebarShadow:        '#001028',
        menuActiveBg:         '#bae6fd',
        menuHoverBg:          '#e0f2fe',
        menuLabel:            '#1e293b',
        menuIcon:             '#007aff',
        dividerMenu:              '#e5e7eb',
        sectionTitle:         '#64748b',
        historyBg:            '#f1f5f9',
        historyActiveBg:      '#ffe7b6',
        historyTitle:         '#0f172a',
        historyDate:          '#64748b',
        backdrop:             'rgba(16,32,80,0.12)',
        sidebarToggleIcon:    '#007aff',
    
    },
  
    dark: {


        background:      '#0F172A', 
        sidebarBg:         '#151c24',
        sidebarBorder:     '#243041',
        sidebarShadow:     '#000b18',
        menuActiveBg:      '#233a57',
        menuHoverBg:       '#18283c',
        menuLabel:         '#e9f2fb',
        menuIcon:          '#3db0ff',
        dividerMenu:       '#233048',
        sectionTitle:      '#9fb9d3',
        historyBg:         '#1c2530',
        historyActiveBg:   '#354563',
        historyTitle:      '#d3e3fa',
        historyDate:       '#6d88a8',
        backdrop:          'rgba(15,18,40,0.62)',
        sidebarToggleIcon: '#53a7ff',
   
        
     

     
    },
  } as const;
  
  export type Menu = typeof menu.light;
  