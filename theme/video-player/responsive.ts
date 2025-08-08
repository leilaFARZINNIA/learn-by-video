

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const responsive = {
  cardWidth: (() => {
    if (width >= 800) return 600;
    if (width >= 600) return 500;
    if (width >= 430) return Math.min(width * 0.97, 410);
    return Math.max(width * 0.95, 335);
  })(),
  cardRadius: width >= 700 ? 34 : width >= 600 ? 30 : width >= 430 ? 22 : 16,
  headerFont: width >= 700 ? 27 : width >= 430 ? 23 : 17,
  titleFont: width >= 700 ? 22 : width >= 430 ? 18.5 : 16,
  timeFont: width >= 700 ? 15.5 : width >= 430 ? 13.8 : 12,
  transcriptFont: width >= 700 ? 17 : width >= 430 ? 15 : 13,
  cardPadding: width >= 700 ? 34 : width >= 430 ? 22 : 12,
  lineSpacing: width >= 700 ? 16 : width >= 430 ? 10 : 6,
};
