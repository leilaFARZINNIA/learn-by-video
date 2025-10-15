import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import type { WebViewMessageEvent } from "react-native-webview";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type Props = {
  /** HTML string (controlled) */
  value: string;
  /** Called with HTML on every content change */
  onChange: (html: string) => void;
  /** Editor viewport height (px) — default: 260 */
  height?: number;
  /** Placeholder text — default: "Type here…" */
  placeholder?: string;
  /** Layout direction — default: true (LTR) */
  ltr?: boolean;
  /** Readonly mode */
  readOnly?: boolean;
  /** Auto focus cursor when mounted (web/native) */
  autoFocus?: boolean;
  /** Extra className for web root (ignored on native) */
  className?: string;
};

/** small helper */
const ensureHtml = (v?: string | null) => (typeof v === "string" ? v : "");

/** simple uniq id for DOM nodes (web) */
const useUID = () =>
  useMemo(() => `rte-${Math.random().toString(36).slice(2, 9)}`, []);

/* ------------------------------------------------------------------ */
/* Entry                                                               */
/* ------------------------------------------------------------------ */
export default function RichTextEditor(props: Props) {
  if (Platform.OS === "web") return <WebEditor {...props} />;
  return <NativeEditor {...props} />;
}

/* ================================================================== */
/* Web (ReactQuill + Quill v2)                                        */
/* ================================================================== */
function WebEditor({
  value,
  onChange,
  height = 260,
  placeholder = "Type here…",
  ltr = true,
  readOnly,
  autoFocus,
  className,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isClient = typeof window !== "undefined";

  // SSR-safe imports
  const ReactQuill = useMemo(() => {
    if (!isClient) return null as any;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("react-quill-new");
    return mod.default ?? mod;
  }, [isClient]);

  const Quill = useMemo(() => {
    if (!isClient) return null as any;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("quill");
    return mod.default ?? mod;
  }, [isClient]);

  

  // unique ids for this instance
  const hostId = useUID();
  const toolbarId = `${hostId}-toolbar`;
  const ltrStyleId = `${hostId}-ltr-style`;
  const stableStyleId = `${hostId}-stable-style`;
  const labelsStyleId = `${hostId}-size-labels`;

  // Inject CSS + assets once
  useEffect(() => {
    if (!mounted || !isClient) return;

    const ensureLink = (id: string, href: string) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    ensureLink("quill-snow-css", "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css");

    const ensureStyle = (id: string, css: string) => {
      let node = document.getElementById(id) as HTMLStyleElement | null;
      if (!node) {
        node = document.createElement("style");
        node.id = id;
        document.head.appendChild(node);
      }
      node.textContent = css;
    };

    // direction / spacing
    ensureStyle(
      ltrStyleId,
      `
      #${hostId} .ql-editor {
        line-height: 1.8;
        direction: ${ltr ? "ltr" : "rtl"};
        text-align: ${ltr ? "left" : "right"};
        padding-bottom: 80px;
      }
    `
    );

    // performance / stability
    ensureStyle(
      stableStyleId,
      `
      #${hostId} {
        contain: layout paint;
        isolation: isolate;
        will-change: transform;
        transform: translateZ(0);
        height: 100%;
      }
      #${hostId} .ql-container,
      #${hostId} .ql-editor {
        height: 100%;
        transform: translateZ(0);
      }
      #${hostId} .ql-container.ql-snow { border: none; }
      #${hostId} .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #e5e7eb; }
    `
    );

    // labels for px sizes in Snow theme
    ensureStyle(
      labelsStyleId,
      `
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before { content: "12"; }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before { content: "14"; }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before { content: "16"; }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before { content: "18"; }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before { content: "24"; }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before { content: "32"; }
      .ql-snow .ql-picker.ql-size .ql-picker-item:not([data-value])::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before { content: "Normal"; }
    `
    );
  }, [mounted, isClient, ltr, hostId, ltrStyleId, stableStyleId, labelsStyleId]);

  // Quill whitelists: fonts + px sizes (StyleAttributor)

const quillReady = useMemo(() => {
  if (!Quill) return false;

  const Font = Quill.import("formats/font");
  Font.whitelist = ["sans", "serif", "monospace"];
  Quill.register(Font, true);

 
  const Size = Quill.import("attributors/style/size");
  Size.whitelist = ["12px", "14px", "16px", "18px", "24px", "32px"];
  Quill.register(Size, true);

  return true;
}, [Quill]);


  // Prevent form submit by toolbar buttons
  useEffect(() => {
    if (!mounted || !isClient) return;
    const fix = () =>
      document
        .querySelectorAll<HTMLButtonElement>(`#${toolbarId} button`)
        .forEach((b) => {
          if (!b.type || b.type.toLowerCase() === "submit") b.type = "button";
        });
    const t = setTimeout(fix, 0);
    return () => clearTimeout(t);
  }, [mounted, isClient, toolbarId]);

  // Quill modules / formats
  const modules = useMemo(
    () => ({
      toolbar: `#${toolbarId}`,
      clipboard: { matchVisual: true },
      keyboard: true,
    }),
    [toolbarId]
  );

  const formats = useMemo(
    () => [
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
    ],
    []
  );

  
  if (!mounted || !ReactQuill || !quillReady) return <div style={{ height }} />;


  const htmlValue = ensureHtml(value);

  return (
    <div id={hostId} style={{ height }} className={className}>
      {/* custom toolbar (labels are numeric) */}
      <div id={toolbarId} className="ql-toolbar ql-snow">
        <select className="ql-font">
          <option value="sans"></option>
          <option value="serif"></option>
          <option value="monospace"></option>
        </select>

        <select className="ql-size">
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <select className="ql-color" />
        <select className="ql-background" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <select className="ql-align" />
        <button className="ql-link" />
        <button className="ql-clean" />
      </div>

      <ReactQuill
        theme="snow"
        value={htmlValue}
        onChange={(html: string) => onChange(ensureHtml(html))}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        readOnly={!!readOnly}
        style={{ height: "calc(100% - 42px)" }} // 42px ≈ toolbar height
        preserveWhitespace={true}
        
        autoFocus={!!autoFocus}
      />
    </div>
  );
}

/* ================================================================== */
/* Native (WebView + Quill v2 inside)                                 */
/* ================================================================== */
function NativeEditor({
  value,
  onChange,
  height = 260,
  placeholder = "Type here…",
  ltr = true,
  readOnly,
  autoFocus,
}: Props) {
  const { WebView } = useMemo(() => require("react-native-webview"), []);
  const ref = useRef<any>(null);

  const [wvReady, setWvReady] = useState(false);
  const pendingHtml = useRef<string | null>(null);
  const lastHtmlFromWv = useRef<string>("");

  // Sync external value → editor
  useEffect(() => {
    if (!ref.current) return;
    const htmlStr = ensureHtml(value);
    if (!wvReady) {
      pendingHtml.current = htmlStr;
      return;
    }
    if (htmlStr === lastHtmlFromWv.current) return;
    ref.current.postMessage(JSON.stringify({ type: "set", html: htmlStr }));
  }, [value, wvReady]);

  // Editor HTML (Quill + Snow)
  const htmlDoc = useMemo(() => {
    const dirRule = `direction:${ltr ? "ltr" : "rtl"};text-align:${ltr ? "left" : "right"};`;
    const readOnlyFlag = !!readOnly;
    const autoFocusFlag = !!autoFocus;

    return `<!doctype html><html><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
<style>
  html,body{height:100%;margin:0;background:#fff}
  #wrap{height:100%;display:flex;flex-direction:column}
  #toolbar{flex:0 0 auto; ${readOnlyFlag ? "display:none;" : ""}}
  #clip{flex:1 1 auto;border-radius:12px;overflow:hidden}
  .ql-container.ql-snow{height:100%;border:none}
  .ql-toolbar.ql-snow{border:none;border-bottom:1px solid #e5e7eb}
  .ql-editor{
    line-height:1.8;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
    ${dirRule}
    padding-bottom:80px;
  }
  #clip, #editor, .ql-container{ -webkit-transform: translateZ(0); transform: translateZ(0); will-change: transform; }
</style>
</head><body>
<div id="wrap">
  <div id="toolbar">
    <select class="ql-font"><option value="sans"></option><option value="serif"></option><option value="monospace"></option></select>
    <select class="ql-size"><option value="12px">12</option><option value="14px">14</option><option value="16px">16</option><option value="18px">18</option><option value="24px">24</option><option value="32px">32</option></select>
    <button type="button" class="ql-bold"></button>
    <button type="button" class="ql-italic"></button>
    <button type="button" class="ql-underline"></button>
    <button type="button" class="ql-strike"></button>
    <select class="ql-color"></select>
    <select class="ql-background"></select>
    <button type="button" class="ql-list" value="ordered"></button>
    <button type="button" class="ql-list" value="bullet"></button>
    <select class="ql-align"></select>
    <button type="button" class="ql-link"></button>
    <button type="button" class="ql-clean"></button>
  </div>
  <div id="clip"><div id="editor"></div></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.min.js"></script>
<script>
  const post = (m) => window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(m));

  const Font = Quill.import('formats/font'); Font.whitelist=['sans','serif','monospace']; Quill.register(Font,true);
  const Size = Quill.import('attributors/style/size'); Size.whitelist=['12px','14px','16px','18px','24px','32px']; Quill.register(Size,true);

  const quill = new Quill('#editor',{
    theme:'snow',
    readOnly: ${readOnlyFlag ? "true" : "false"},
    placeholder: ${JSON.stringify(placeholder)},
    modules:{ toolbar:'#toolbar', clipboard:{ matchVisual:true } }
  });

  // autofocus (در صورت نیاز)
  if (${autoFocusFlag ? "true" : "false"}) {
    setTimeout(() => {
      quill.focus();
    }, 0);
  }

  // notify ready
  post({type:'ready'});

  // change handler (avoid echo loops)
  let lastSent = '';
  quill.on('text-change', function(){
    const html = quill.root.innerHTML || '';
    if (html === lastSent) return;
    lastSent = html;
    post({type:'change', html});
  });

  // apply external html
  const applyHtml = (h) => {
    const next = (h || '');
    const cur = quill.root.innerHTML || '';
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
  }, [placeholder, ltr, readOnly, autoFocus]);

  // events from WebView
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
        const html = ensureHtml(msg.html);
        lastHtmlFromWv.current = html;
        onChange(html);
      }
    } catch {
      // ignore
    }
  };

  return (
    <View style={{ borderRadius: 12, overflow: "visible", borderWidth: 0.5, borderColor: "#d0d4db", height }}>
      <WebView
        ref={ref}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        source={{ html: htmlDoc }}
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
