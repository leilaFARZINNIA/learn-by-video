import React from "react";
import { Platform, useWindowDimensions } from "react-native";


import RenderHTML from "react-native-render-html";

type Props = {
  html: string;                 
  maxWidth?: number;           
  baseFontSize?: number;        
  lineHeight?: number;          
  bgColor?: string;            
};


const classesStyles = {
  "ql-align-center": { textAlign: "center" as const },
  "ql-align-right": { textAlign: "right" as const },
  "ql-align-justify": { textAlign: "justify" as const },

  "ql-font-serif": { fontFamily: Platform.select({ ios: "Times New Roman", android: "serif", default: "serif" }) },
  "ql-font-monospace": { fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }) },

  "ql-size-small": { fontSize: 12 },
  "ql-size-large": { fontSize: 20 },
  "ql-size-huge":  { fontSize: 26 },
};


const tagsStyles = {
  h1: { fontSize: 24, fontWeight: "700" as const, marginBottom: 6 },
  h2: { fontSize: 20, fontWeight: "700" as const, marginBottom: 6 },
  h3: { fontSize: 18, fontWeight: "700" as const, marginBottom: 6 },
  p:  { marginBottom: 8 },
  li: { marginVertical: 4 },
};


const QUILL_MINIMAL_CSS = `
.ql-align-center { text-align: center; }
.ql-align-right { text-align: right; }
.ql-align-justify { text-align: justify; }

.ql-font-serif { font-family: "Times New Roman", Times, serif; }
.ql-font-monospace { font-family: Menlo, Consolas, monospace; }

.ql-size-small { font-size: 12px; }
.ql-size-large { font-size: 20px; }
.ql-size-huge  { font-size: 26px; }


h1 { font-size: 24px; font-weight: 700; margin: 0 0 6px; }
h2 { font-size: 20px; font-weight: 700; margin: 0 0 6px; }
h3 { font-size: 18px; font-weight: 700; margin: 0 0 6px; }
p  { margin: 0 0 8px; line-height: 1.6; }
li { margin: 4px 0; }
`;

export default function RichHtml({
  html,
  maxWidth,
  baseFontSize = 16,
  lineHeight = 24,
  bgColor,
}: Props) {
  if (Platform.OS === "web") {

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: QUILL_MINIMAL_CSS }} />
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth ?? "100%",
            lineHeight: `${lineHeight}px`,
            fontSize: baseFontSize,
          }}
          
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </>
    );
  }


  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 36, maxWidth ?? width - 36);

  return (
    <RenderHTML
      contentWidth={contentWidth}
      source={{ html: html || "<p></p>" }}
      baseStyle={{
        fontSize: baseFontSize,
        lineHeight,
      
        backgroundColor: bgColor,
      }}
      classesStyles={classesStyles}
      tagsStyles={tagsStyles}
      defaultTextProps={{ selectable: true }}
    />
  );
}
