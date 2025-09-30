// src/components/common/HtmlBlock.native.tsx
import React from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

export default function HtmlBlock({ html }: { html?: string | null }) {
  const { width } = useWindowDimensions();
  if (!html) return null;
  return <RenderHTML contentWidth={width - 36} source={{ html }} />;
}
