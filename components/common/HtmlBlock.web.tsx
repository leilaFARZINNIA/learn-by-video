// src/components/common/HtmlBlock.web.tsx
import DOMPurify from "dompurify";
import React from "react";

export default function HtmlBlock({ html }: { html?: string | null }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
