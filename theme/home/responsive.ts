// theme/home/responsive.ts
import { Platform, useWindowDimensions, type DimensionValue } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const BP_SM = 640;
  const BP_LG = 1024;

  const isMobile = !isWeb && width < 420;

  let columns = 1;
  if (isWeb) columns = width >= BP_LG ? 3 : width >= BP_SM ? 2 : 1;


  const itemWidth: DimensionValue = `${100 / columns}%`;

  return {
    isWeb, isMobile, width, height,
    columns, itemWidth,
    logoSize: Math.min(width * (isMobile ? 0.5 : 0.18), isMobile ? 120 : 150),
    fontSize: Math.min(width * (isMobile ? 0.07 : 0.06), isMobile ? 35 : 42),
    iconSize: isMobile ? 40 : 60,
    labelFontSize: isMobile ? 20 : 20,
    middleFontSize: isMobile ? 22 : 26,
    gap: isMobile ? 10 : 16,
  };
};
