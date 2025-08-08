
export type ResponsiveVars = {
    CARD_WIDTH: number;
    CARD_HEIGHT: number;
    CARD_RADIUS: number;
    HEADER_FONT: number;
    TITLE_FONT: number;
    TIME_FONT: number;
    TRANSCRIPT_FONT: number;
    CARD_PADDING: number;
    LINE_SPACING: number;
  };
  
  export function getResponsiveVars(width: number, showTranscript: boolean): ResponsiveVars {
    let CARD_WIDTH: number, CARD_HEIGHT: number;
    if (showTranscript) {
      CARD_WIDTH = width >= 800 ? 470 : width >= 600 ? 390 : width >= 430 ? Math.min(width * 0.95, 300) : Math.max(width * 0.90, 210);
    } else {
      CARD_WIDTH = width >= 800 ? 600 : width >= 600 ? 500 : width >= 430 ? Math.min(width * 0.97, 410) : Math.max(width * 0.95, 335);
    }
    CARD_HEIGHT = Math.floor(CARD_WIDTH * 9 / 16);
  
    return {
      CARD_WIDTH,
      CARD_HEIGHT,
      CARD_RADIUS: width >= 700 ? 34 : width >= 600 ? 30 : width >= 430 ? 22 : 16,
      HEADER_FONT: width >= 700 ? 27 : width >= 430 ? 23 : 17,
      TITLE_FONT: width >= 700 ? 22 : width >= 430 ? 18.5 : 16,
      TIME_FONT: width >= 700 ? 15.5 : width >= 430 ? 13.8 : 12,
      TRANSCRIPT_FONT: width >= 700 ? 17 : width >= 430 ? 15 : 13,
      CARD_PADDING: width >= 700 ? 34 : width >= 430 ? 22 : 12,
      LINE_SPACING: width >= 700 ? 2 : width >= 430 ? 10 : 6,
    };
  }
  