import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 420;

  return {
    isMobile,
    width,
    height,
    logoSize: isMobile ? Math.min(width * 0.25, 120) : Math.min(width * 0.18, 140),
    fontSize: isMobile ? Math.min(width * 0.07, 26) : Math.min(width * 0.06, 32),
    iconSize: isMobile ? 40 : 50,
    labelFontSize: isMobile ? 16 : 14,
    middleFontSize: isMobile ? 18 : 24,
    gap: isMobile ? 10 : 16,
  
  };
};
