// utils/autoScroll.ts
export type AlignMode = 'smart' | 'nearest' | 'top' | 'center';

export type AutoScrollConfig = {
  alignMode?: AlignMode;
  comfort?: number;
  margin?: number;
  tolerance?: number;
  eps?: number;          
};

export function toSec(t: any): number {
  if (typeof t === 'number' && Number.isFinite(t)) return t;
  if (typeof t === 'string') {
    const mmss = t.match(/^(\d+):(\d{1,2})$/);
    if (mmss) return parseInt(mmss[1], 10) * 60 + parseInt(mmss[2], 10);
    const n = Number(t);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

export function pickActiveIndex(times: any[], currentTimeSec: number, eps = 0.05): number {
  if (!Array.isArray(times) || times.length === 0) return 0;



  let idx = 0;
  for (let i = 0; i < times.length; i++) {
    const t = toSec(times[i]);
    if (currentTimeSec + eps >= t) idx = i; else break;
  }
  return idx;
}

export function computeAutoScrollTarget(params: {
  rowTops: number[];
  rowHeights?: number[];
  viewportTop: number;
  viewportHeight: number;
  activeIndex: number;
  config?: AutoScrollConfig;
}): number | null {
  const {
    rowTops, rowHeights = [],
    viewportTop, viewportHeight, activeIndex,
    config
  } = params;


  if (!Array.isArray(rowTops) || rowTops.length === 0) return null;
  if (activeIndex < 0 || activeIndex >= rowTops.length) return null;

  const y = rowTops[activeIndex];
  if (!Number.isFinite(y)) return null; 


  const h = Number.isFinite(rowHeights[activeIndex])
    ? (rowHeights[activeIndex] as number)
    : (Number.isFinite(rowHeights[0]) ? (rowHeights[0] as number) : 32);

  const alignMode = config?.alignMode ?? 'smart';
  const comfort = config?.comfort ?? 90;
  const margin = config?.margin ?? 16;
  const tolerance = config?.tolerance ?? 18;


  const lastTop = rowTops[rowTops.length - 1] ?? 0;
  const lastH = Number.isFinite(rowHeights[rowHeights.length - 1])
    ? (rowHeights[rowHeights.length - 1] as number)
    : h;
  const contentHeight = Math.max(0, lastTop + lastH);

  const contTop = viewportTop;
  const contBottom = contTop + viewportHeight;

  let targetTop: number | null = null;

  if (alignMode === 'top') {
    targetTop = y - margin;
  } else if (alignMode === 'center') {
    targetTop = y - (viewportHeight - h) / 2;
  } else if (alignMode === 'nearest') {
    const above = y < contTop + margin;
    const below = y + h > contBottom - margin;
    if (above) targetTop = y - margin;
    else if (below) targetTop = y + h - viewportHeight + margin;
  } else { // 'smart'
    const comfyTop = contTop + comfort;
    const comfyBottom = contBottom - comfort;
    const above = y < comfyTop;
    const below = y + h > comfyBottom;
    if (above) targetTop = y - Math.min(60, comfort);
    else if (below) targetTop = y + h - viewportHeight + Math.min(60, comfort);
  }

  if (targetTop == null) return null;

  
  targetTop = Math.min(
    Math.max(0, targetTop),
    Math.max(0, contentHeight - viewportHeight)
  );

  
  if (Math.abs(targetTop - contTop) < tolerance) return null;

  return targetTop;
}

export function shouldAutoScroll(lastManualScrollAt: number, lockMs = 900) {
  return Date.now() - lastManualScrollAt > lockMs;
}
