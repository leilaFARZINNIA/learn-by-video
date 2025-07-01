import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 420;

  return {
    isMobile,
    logoSize: isMobile ? Math.min(width * 0.25, 120) : Math.min(width * 0.18, 140),
    fontSize: isMobile ? Math.min(width * 0.07, 26) : Math.min(width * 0.06, 32),
    iconSize: isMobile ? 50 : 60,
    labelFontSize: isMobile ? 12 : 14,
    middleFontSize: isMobile ? 14 : 18,
    gap: isMobile ? 10 : 16,
  };
};
