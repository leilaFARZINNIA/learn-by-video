// src/hooks/useBreakpoint.ts
import { useWindowDimensions } from "react-native";

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    isPhone: width < 480,
    isTablet: width >= 480 && width < 900,
    isDesktop: width >= 900,
  };
}
