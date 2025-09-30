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

  // SSR-safe imports
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

  // CSS + direction + stability
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

    const ensureStyle = (id: string) => {
      let style = document.getElementById(id) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = id;
        document.head.appendChild(style);
      }
      return style!;
    };


    const ltrStyle = ensureStyle("quill-ltr-style");
    ltrStyle.innerHTML = `
      .ql-editor {
        line-height: 1.8;
        direction: ${ltr ? "ltr" : "rtl"};
        text-align: ${ltr ? "left" : "right"};
        padding-bottom: 80px;
      }
    `;

    
    const stable = ensureStyle("quill-stability-style");
    stable.innerHTML = `
      #quill-host{
        contain: layout paint;
        isolation: isolate;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
        height: 100%;
      }
      #quill-host .ql-container,
      #quill-host .ql-editor{
        height: 100%;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      #quill-host .ql-container.ql-snow { border: none; }
      #quill-host .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #e5e7eb; }
    `;
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


  useEffect(() => {
    if (!mounted || !isClient) return;
    const fixButtons = () =>
      document.querySelectorAll<HTMLButtonElement>(".ql-toolbar button").forEach((b) => {
        if (!b.type || b.type.toLowerCase() === "submit") b.type = "button";
      });
    const t = setTimeout(fixButtons, 0);
    return () => clearTimeout(t);
  }, [mounted, isClient]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ font: ["sans", "serif", "monospace"] }],
        [{ size: ["12px", "14px", "16px", "18px", "24px", "32px"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
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
    <div id="quill-host" style={{ height }}>
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

  // handshake 
  const [wvReady, setWvReady] = useState(false);
  const pendingHtml = useRef<string | null>(null);
  const lastHtmlFromWv = useRef<string>("");

  useEffect(() => {
    if (!ref.current) return;
    const htmlStr = value ?? "";
    if (!wvReady) {
      pendingHtml.current = htmlStr;
      return;
    }
    if (htmlStr === lastHtmlFromWv.current) return; 
    ref.current.postMessage(JSON.stringify({ type: "set", html: htmlStr }));
  }, [value, wvReady]);

  const html = useMemo(() => {
    const dirRule = `direction:${ltr ? "ltr" : "rtl"};text-align:${ltr ? "left" : "right"};`;
    return `<!doctype html><html><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
<style>
  html,body{height:100%;margin:0;background:#fff}
  #wrap{height:100%;display:flex;flex-direction:column}
  #toolbar{flex:0 0 auto}
  #clip{flex:1 1 auto;border-radius:12px;overflow:hidden}
  .ql-container.ql-snow{height:100%;border:none}
  .ql-toolbar.ql-snow{border:none;border-bottom:1px solid #e5e7eb}
  .ql-editor{
    line-height:1.8;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
    ${dirRule};
    padding-bottom:80px; 
  }
  
  #clip, #editor, .ql-container{ -webkit-transform: translateZ(0); transform: translateZ(0); will-change: transform; }
</style>
</head><body>
<div id="wrap">
  <div id="toolbar">
    <select class="ql-font"><option selected></option><option value="serif"></option><option value="monospace"></option></select>
    <select class="ql-size"><option value="12px">12</option><option value="14px">14</option><option selected value="16px">16</option><option value="18px">18</option><option value="24px">24</option><option value="32px">32</option></select>
    <button type="button" class="ql-bold"></button><button type="button" class="ql-italic"></button>
    <button type="button" class="ql-underline"></button><button type="button" class="ql-strike"></button>
    <select class="ql-color"></select><select class="ql-background"></select>
    <button type="button" class="ql-list" value="ordered"></button><button type="button" class="ql-list" value="bullet"></button>
    <select class="ql-align"></select>
    <button type="button" class="ql-link"></button><button type="button" class="ql-clean"></button>
  </div>
  <div id="clip"><div id="editor"></div></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.min.js"></script>
<script>
  const Font = Quill.import('formats/font'); Font.whitelist=['sans','serif','monospace']; Quill.register(Font,true);
  const Size = Quill.import('attributors/style/size'); Size.whitelist=['12px','14px','16px','18px','24px','32px']; Quill.register(Size,true);

  const quill = new Quill('#editor',{ theme:'snow', placeholder:${JSON.stringify(placeholder)}, modules:{ toolbar:'#toolbar', clipboard:{ matchVisual:true } } });

  const post = (m)=>window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify(m));

 
  post({type:'ready'});

  
  let lastSent = '';
  quill.on('text-change', function(){
    const html = quill.root.innerHTML;
    if (html === lastSent) return;
    lastSent = html;
    post({type:'change', html});
  });


  const applyHtml = (h) => {
    const cur = quill.root.innerHTML;
    const next = h || '';
    if (cur === next) return;
    const sel = quill.getSelection();
    quill.clipboard.dangerouslyPasteHTML(next);
    if (sel) quill.setSelection(sel);
    lastSent = next;
  };

  const onMsg = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'set') applyHtml(msg.html);
    } catch(_) {}
  };
  window.addEventListener('message', onMsg);
  document.addEventListener('message', onMsg);
</script>
</body></html>`;
  }, [placeholder, ltr]);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "ready") {
        setWvReady(true);
        if (pendingHtml.current != null && ref.current) {
          ref.current.postMessage(JSON.stringify({ type: "set", html: pendingHtml.current }));
          pendingHtml.current = null;
        }
      } else if (msg.type === "change") {
        lastHtmlFromWv.current = msg.html ?? "";
        onChange(lastHtmlFromWv.current);
      }
    } catch {}
  };

 
  return (
    <View style={{ borderRadius:12, overflow:"visible", borderWidth:0.5, borderColor:"#d0d4db", height }}>
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
        setSupportMultipleWindows={false}
        scrollEnabled
      />
    </View>
  );
}
