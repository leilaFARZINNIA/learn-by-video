import { useMemo } from "react";
import { Platform, useWindowDimensions, type DimensionValue } from "react-native";

/** Breakpoints & container widths */
export type Breakpoints = { md: number; lg: number; xl: number };
export type WebWidths   = { base?: number; md?: number; lg?: number; xl?: number };
export type Options = {
  phoneMax?: number;
  breakpoints?: Breakpoints;
  webWidths?: WebWidths;
  expandOnTablet?: boolean; 
};

export const DEFAULT_BPS  = { md: 768, lg: 1024, xl: 1280 } as const;
export const DEFAULT_WEBW = { base: 420, md: 640, lg: 840, xl: 960 } as const;


export function useResponsive(opts: { breakpoints?: Breakpoints } = {}) {
  const { width, height } = useWindowDimensions();
  const bps = { ...DEFAULT_BPS, ...(opts.breakpoints ?? {}) };

  const isMobile  = width < bps.md;
  const isTablet  = width >= bps.md && width < bps.lg;
  const isDesktop = width >= bps.lg;
  const device    = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  /** انتخاب مقدار بر اساس سایز: pick(mobile, tablet?, desktop?) */
  const pick = <T,>(mobile: T, tablet?: T, desktop?: T): T => {
    if (isMobile) return mobile;
    if (isTablet) return (tablet ?? mobile);
    return (desktop ?? tablet ?? mobile);
  };

  return { width, height, isMobile, isTablet, isDesktop, device, pick, bps };
}


export function useResponsiveMaxWidth(opts: Options = {}) {
  const { width } = useWindowDimensions();
  const phoneMax = opts.phoneMax ?? 420;
  const bps  = { ...DEFAULT_BPS, ...(opts.breakpoints ?? {}) };
  const webW = { ...DEFAULT_WEBW, ...(opts.webWidths ?? {}) };

  return useMemo(() => {
    const isWeb = Platform.OS === "web";
    const isTablet = width >= bps.md;
    
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
  return useMemo(() => ({ width: full, maxWidth, alignSelf: "center" as const }), [maxWidth]);
}

export function useResponsiveNumber(mobile: number, tablet?: number, desktop?: number, opts?: { breakpoints?: Breakpoints }) {
  const { pick } = useResponsive({ breakpoints: opts?.breakpoints });
  return pick(mobile, tablet, desktop);
}
