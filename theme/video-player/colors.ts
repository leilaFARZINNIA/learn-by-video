// theme/colors/home.ts

export const videoplayer = {
    light: {
     
        videoPlayerBg:'#fafdff',
        cardBg: 'rgba(255,255,255,0.96)',
        headerBar:'#7cb8ff',
        headerTitle:'#1a2845',
        headerTitleShadow:'0px 3px 6px #e0e9fa',
        toggleBtnBgP:'#e2eefd',
        toggleBtnBg:'#f8fbff',
        toggleBtnBgBoxShadow: '0 7px 11px 0 rgba(83,139,247,0.11)',
        toggleborder: '1.5px solid rgba(255,255,255,0.65)',
        toggeltext: '#2173d6',
        transcriptText: '#222',
        transcriptTitle:'#222',
        timeTag:'#e6f0fc',
        iconTimeTag:"#2173d6",
        highlightBg :'#eaf7d3',
        highlight:'#257600',
        highlightBorder:'#257600',
        divider:'#f2f7ff',
        videoBg:'#fff',
        videoBorder:'1.8px solidrgb(191, 223, 255)',
        loaderBoxBg:'rgba(255,255,255,0.22)',
        loadingText:'#2173d6',
        transcriptBorder:'rgba(255,255,255,0.65)',
        transcriptshadow:'0 3px 28px -6px rgba(64, 96, 133, 0.17)',
    
    },
  
    dark: {


   
        videoPlayerBg: '#212935',
        cardBg: '#273043',
        headerBar: '#4e6e99',
        headerTitle: '#b5cdfd', 
        headerTitleShadow: '0px 3px 6px #213044', 
        toggleBtnBgP:      '#263145',          
        toggleBtnBg:       '#253047',           
        toggleBtnBgBoxShadow: '#1c2232',  
        toggleborder: 'rgba(31, 43, 67, 0.74)',
        toggeltext:  '#b5cdfd', 
        transcriptText: '#c6d3e2',
        transcriptTitle: '#b5cdfd',
        timeTag: '#253247',
        iconTimeTag: '#b5cdfd',
        highlightBg: '#2d4709',
        highlight: '#a8ec84',
        highlightBorder: '#537f33',
        divider: '#b5cdfd',
        videoBg: '#273043', 
        videoBorder: '#4e6e99', 
        loaderBoxBg: 'rgba(34, 47, 63, 0.33)', 
        loadingText: '#b5cdfd', 
        transcriptBorder: 'rgba(31, 43, 67, 0.74)',     
        transcriptshadow: '#1c2232',  
     

     
    },
  } as const;
  
  export type Videoplayer = typeof videoplayer.light;
  