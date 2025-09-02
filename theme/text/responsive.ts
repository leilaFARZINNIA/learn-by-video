import { useMemo } from "react";
import { Platform, useWindowDimensions, type DimensionValue } from "react-native";

type Breakpoints = { md: number; lg: number; xl: number };
type WebWidths   = { base?: number; md?: number; lg?: number; xl?: number };
type Options = {
  phoneMax?: number;
  breakpoints?: Breakpoints;
  webWidths?: WebWidths;
  expandOnTablet?: boolean;
};

const DEFAULT_BPS  = { md: 768, lg: 1024, xl: 1280 };
const DEFAULT_WEBW = { base: 420, md: 640, lg: 840, xl: 960 };

export function useResponsiveMaxWidth(opts: Options = {}) {
  const { width } = useWindowDimensions();
  const phoneMax = opts.phoneMax ?? 420;
  const bps  = { ...DEFAULT_BPS, ...(opts.breakpoints ?? {}) };
  const webW = { ...DEFAULT_WEBW, ...(opts.webWidths ?? {}) };

  return useMemo(() => {
    const isWeb = Platform.OS === "web";
    const isTablet = width >= 768;
    if (!isWeb) {
      if (!(opts.expandOnTablet && isTablet)) return phoneMax;
    }
    if (width >= bps.xl) return webW.xl!;
    if (width >= bps.lg) return webW.lg!;
    if (width >= bps.md) return webW.md!;
    return webW.base!;
  }, [width, phoneMax, bps.md, bps.lg, bps.xl, webW.base, webW.md, webW.lg, webW.xl, opts.expandOnTablet]);
}

export function useResponsiveContainerStyle(opts?: Options) {
  const maxWidth = useResponsiveMaxWidth(opts);
  const full: DimensionValue = "100%";
 
  return useMemo(
    () => ({ width: full, maxWidth, alignSelf: "center" as const }),
    [maxWidth]
  );
}
