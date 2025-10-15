import React from "react";
import { Linking, Platform, useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";

type Props = {
  html: string;
  maxWidth?: number;
  baseFontSize?: number; // px
  lineHeight?: number;   // px
  bgColor?: string;
};


function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return String(h);
}

export default function RichHtml({
  html,
  maxWidth,
  baseFontSize = 16,
  lineHeight = 24,
  bgColor,
}: Props) {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 36, maxWidth ?? width - 36);


  if (Platform.OS === "web") {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: maxWidth ?? "100%",
          lineHeight: `${lineHeight}px`,
          fontSize: baseFontSize,
          backgroundColor: bgColor,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

 
  const [h, setH] = React.useState(20);
  const key = React.useMemo(() => hashStr(html || ""), [html]);

  const htmlDoc = React.useMemo(() => {
   
    const QUILL_MIN_CSS = `
.ql-align-center { text-align:center; }
.ql-align-right { text-align:right; }
.ql-align-justify { text-align:justify; }
.ql-direction-rtl { direction:rtl; text-align:right; }
${Array.from({length:9}).map((_,i)=>`.ql-indent-${i}{margin-left:${i*16}px;}`).join("\n")}
.ql-font-serif{ font-family:"Times New Roman",Times,serif; }
.ql-font-monospace{ font-family:Menlo,Consolas,monospace; }
.ql-font-sans{ font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; }
a{ color:#2563EB; text-decoration:underline; }
blockquote{ border-left:3px solid #CBD5E1; padding-left:10px; margin:8px 0; font-style:italic; }
pre{ padding:8px; border-radius:8px; overflow:hidden; font-family:Menlo,Consolas,monospace; background:#f8fafc; }
code{ font-family:Menlo,Consolas,monospace; }
ul,ol{ padding-left:18px; }
p{ margin:0 0 8px; }
h1{ font-size:24px; font-weight:700; margin:0 0 6px; }
h2{ font-size:20px; font-weight:700; margin:0 0 6px; }
h3{ font-size:18px; font-weight:700; margin:0 0 6px; }
u,ins{ text-decoration:underline; }
s,del{ text-decoration:line-through; }`;


    return `<!doctype html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css"/>
<style>
  :root { --base: ${baseFontSize}px; --lh: ${lineHeight}px; }
  html,body { height:100%; margin:0; background: transparent; }
  .host { font-size: var(--base); line-height: var(--lh); color: #0f172a; }
  /* قفل پهنا تا متن از عرض کانتینر خارج نشه */
  .root { width: 100%; box-sizing: border-box; }
  /* quill editor body: */
  .ql-container.ql-snow { border: none; }
  .ql-editor { padding: 0; }
  ${QUILL_MIN_CSS}
</style>
</head>
<body class="host">
  <div class="root ql-snow">
    <div class="ql-editor" id="content">${html || ""}</div>
  </div>
<script>
  const send = (m) => window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(m));


  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href]');
    if (a && a.href) {
      e.preventDefault();
      send({ type:'link', href:a.href });
    }
  }, true);

  
  const postHeight = () => {
    const h = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    send({ type:'height', h });
  };

  window.addEventListener('load', postHeight);
  const ro = new ResizeObserver(() => { postHeight(); });
  ro.observe(document.body);
  const mo = new MutationObserver(() => { postHeight(); });
  mo.observe(document.getElementById('content'), { childList:true, subtree:true, attributes:true, characterData:true });
  setTimeout(postHeight, 0);
</script>
</body></html>`;
  }, [html, baseFontSize, lineHeight]);

  const onMessage = React.useCallback((e: any) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "height" && typeof msg.h === "number") {
        setH(Math.max(20, Math.ceil(msg.h)));
      } else if (msg.type === "link" && msg.href) {
        Linking.openURL(msg.href).catch(() => {});
      }
    } catch {}
  }, []);

  return (
    <WebView
      key={key}
      originWhitelist={["*"]}
      source={{ html: htmlDoc }}
      onMessage={onMessage}
      // ظاهر
      style={{ width: contentWidth, height: h, backgroundColor: "transparent" }}
      containerStyle={{ backgroundColor: bgColor }}
      // تنظیمات
      javaScriptEnabled
      domStorageEnabled
      automaticallyAdjustContentInsets={false}
      setSupportMultipleWindows={false}
      overScrollMode="never"
      scrollEnabled={false}   // چون auto-height داریم
      // iOS بهتر
      allowsLinkPreview
      // Android
      nestedScrollEnabled={false}
    />
  );
}
