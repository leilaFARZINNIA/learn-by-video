import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 420;

  return {
    isMobile,
    iconSize: isMobile ? 90 : 110,
    headerFontSize: isMobile ? 35 : 45,
    middleFontSize: isMobile ? 26: 30,
    gap: isMobile ? 16 : 20,
    paperPadding: isMobile ? 14 : 30,
    borderRadius: isMobile ? 14 : 24,
    verticalSpace: isMobile ? 10 : 20,
    aspectRatio: 1.5,
    contentPadding: isMobile ? 12 : 24,
    papermaxWidth: isMobile ? 430:510,
    marginBottom: isMobile?  -80:-130
  };
};
