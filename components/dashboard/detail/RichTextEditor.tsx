// components/dashboard/detail/RichTextEditor.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import type { WebViewMessageEvent } from "react-native-webview";

type Props = {
  value: string;                     // HTML
  onChange: (html: string) => void;
  height?: number;                   // default 260
  placeholder?: string;              // default "Type here…"
  ltr?: boolean;                     // default true
};

export default function RichTextEditor({
  value,
  onChange,
  height = 260,
  placeholder = "Type here…",
  ltr = true,                       
}: Props) {
  if (Platform.OS === "web") {
    return (
      <WebEditor
        value={value}
        onChange={onChange}
        height={height}
        placeholder={placeholder}
        ltr={ltr}
      />
    );
  }
  return (
    <NativeEditor
      value={value}
      onChange={onChange}
      height={height}
      placeholder={placeholder}
      ltr={ltr}
    />
  );
}

/* -------------------- Web (react-quill-new + quill@2) -------------------- */
function WebEditor({ value, onChange, height, placeholder, ltr }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isClient = typeof window !== "undefined";

  // SSR-safe
  const ReactQuill = useMemo(() => {
    if (!isClient) return null as any;
    const mod = require("react-quill-new");
    return mod.default ?? mod;
  }, [isClient]);

  const Quill = useMemo(() => {
    if (!isClient) return null as any;
    const mod = require("quill");
    return mod.default ?? mod;
  }, [isClient]);

  // CSS Quill + LTR
  useEffect(() => {
    if (!mounted || !isClient) return;
    const ensureLink = (id: string, href: string) => {
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    };
    ensureLink("quill-snow-css", "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css");

    if (!document.getElementById("quill-ltr-style")) {
      const style = document.createElement("style");
      style.id = "quill-ltr-style";
      style.innerHTML = `
        .ql-editor { line-height: 1.8; direction: ${ltr ? "ltr" : "rtl"}; text-align: ${ltr ? "left" : "right"}; }
      `;
      document.head.appendChild(style);
    } else {
     
      const style = document.getElementById("quill-ltr-style") as HTMLStyleElement;
      style.innerHTML = `.ql-editor { line-height: 1.8; direction: ${ltr ? "ltr" : "rtl"}; text-align: ${ltr ? "left" : "right"}; }`;
    }
  }, [mounted, isClient, ltr]);


  useEffect(() => {
    if (!mounted || !Quill) return;
    const Font = Quill.import("formats/font");
    Font.whitelist = ["sans", "serif", "monospace"];
    Quill.register(Font, true);

    const Size = Quill.import("attributors/style/size");
    Size.whitelist = ["12px", "14px", "16px", "18px", "24px", "32px"];
    Quill.register(Size, true);
  }, [mounted, Quill]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ font: ["sans", "serif", "monospace"] }],
        [{ size: ["12px", "14px", "16px", "18px", "24px", "32px"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],                          // بدون direction
        ["link", "clean"],
      ],
      clipboard: { matchVisual: true },
    }),
    []
  );

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
  ];

  if (!mounted || !ReactQuill) return <div style={{ height }} />;

  return (
    <div style={{ height }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(html: string) => onChange(html)}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ height: "100%" }}
      />
    </div>
  );
}

/* -------------------- Native (WebView + Quill@2) -------------------- */
function NativeEditor({ value, onChange, height, placeholder, ltr }: Props) {
  const { WebView } = useMemo(() => require("react-native-webview"), []);
  const ref = useRef<any>(null);
  const initial = useRef(value);

  // sync prop → WebView
  useEffect(() => {
    if (!ref.current) return;
    if (value === initial.current) return;
    ref.current.postMessage(JSON.stringify({ type: "set", html: value ?? "" }));
  }, [value]);

  const html = useMemo(() => {
    const initialHtml = JSON.stringify(initial.current || "");
    const dirRule = `direction: ${ltr ? "ltr" : "rtl"}; text-align: ${ltr ? "left" : "right"};`;
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
  <style>
    html, body { height:100%; margin:0; padding:0; background:#fff; }
    #editor { height: 100%; }
    .ql-container.ql-snow { height: 100%; border: none; }
    .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #e5e7eb; }
    .ql-editor { line-height: 1.8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; ${dirRule} }
  </style>
</head>
<body>
  <div id="toolbar">
    <select class="ql-font">
      <option selected></option>
      <option value="serif"></option>
      <option value="monospace"></option>
    </select>
    <select class="ql-size">
      <option value="12px">12</option>
      <option value="14px">14</option>
      <option selected value="16px">16</option>
      <option value="18px">18</option>
      <option value="24px">24</option>
      <option value="32px">32</option>
    </select>
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-strike"></button>
    <select class="ql-color"></select>
    <select class="ql-background"></select>
    <button class="ql-list" value="ordered"></button>
    <button class="ql-list" value="bullet"></button>
    <select class="ql-align"></select>
    <!-- بدون ql-direction -->
    <button class="ql-link"></button>
    <button class="ql-clean"></button>
  </div>
  <div id="editor"></div>

  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.min.js"></script>
  <script>
    const Font = Quill.import('formats/font');
    Font.whitelist = ['sans','serif','monospace'];
    Quill.register(Font, true);
    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['12px','14px','16px','18px','24px','32px'];
    Quill.register(Size, true);

    const quill = new Quill('#editor', {
      theme: 'snow',
      placeholder: ${JSON.stringify(placeholder)},
      modules: { toolbar: '#toolbar', clipboard: { matchVisual: true } }
    });

    const initialHtml = ${initialHtml};
    if (initialHtml) quill.root.innerHTML = initialHtml;

    quill.on('text-change', function() {
      const html = quill.root.innerHTML;
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'change', html }));
    });

    window.addEventListener('message', function(e){
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'set') quill.root.innerHTML = msg.html || '';
      } catch(err){}
    });
  </script>
</body>
</html>`;
  }, [placeholder, ltr]);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "change") onChange(msg.html ?? "");
    } catch {}
  };

  return (
    <View style={{ borderRadius: 12, overflow: "hidden", borderWidth: 0.5, borderColor: "#d0d4db", height }}>
      <WebView
        ref={ref}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        source={{ html }}
        onMessage={onMessage}
        hideKeyboardAccessoryView
        keyboardDisplayRequiresUserAction={false}
        automaticallyAdjustContentInsets={false}
        overScrollMode="never"
      />
    </View>
  );
}
