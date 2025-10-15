import { fetchMediaById } from "@/api/media-api";
import { fetchTranscript, TranscriptOut } from "@/api/transcript";
import RichHtml from "@/components/text/RichHtml";
import { useTheme } from "@/context/ThemeContext";
import { useResponsiveContainerStyle } from "@/theme/text/responsive";
import { normalizeTranscript as normalizeTranscriptItems, TranscriptItem } from "@/utils/normalizeTranscript";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

function looksLikeHtml(s: string) { return /<\/?[a-z][\s\S]*>/i.test(s); }
function parseIfJsonString(s: unknown) {
  if (typeof s !== "string") return s;
  const t = s.trim(); if (!t) return s;
  if (t.startsWith("{") || t.startsWith("[")) { try { return JSON.parse(t); } catch { return s; } }
  return s;
}
function buildHtmlFromSegments(segments?: { text?: string }[] | null) {
  if (!segments?.length) return "";
  return segments.map(s => (s.text ?? "").trim()).filter(Boolean).map(line => `<p>${line}</p>`).join("\n");
}
function hashStr(s: string) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h<<5)-h + s.charCodeAt(i); h |= 0; } return String(h); }

export default function TextScreen() {
  const { colors } = useTheme();
  const textcolors = (colors as any).text;
  const { media_id } = useLocalSearchParams<{ media_id?: string }>();
  const [media, setMedia] = useState<any>(null);
  const [transcript, setTranscript] = useState<TranscriptOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerStyle = useResponsiveContainerStyle({});

  useEffect(() => {
    if (!media_id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchMediaById(String(media_id)),
      fetchTranscript(String(media_id)).catch(() => null), 
    ])
      .then(([m, t]) => { setMedia(m); setTranscript(t); })
      .catch((e) => setError(e?.message ?? "Fetch error"))
      .finally(() => setLoading(false));
  }, [media_id]);

  const mt = useMemo(() => parseIfJsonString(media?.media_transcript), [media?.media_transcript]);

  const htmlPreferred: string = useMemo(() => {
    if (transcript?.html && transcript.html.trim()) return transcript.html;   // 1) HTML 
    if (typeof mt === "string" && looksLikeHtml(mt)) return mt;               // 2) HTML 
    const segHtml = buildHtmlFromSegments(transcript?.segments ?? null);      // 3) segments
    if (segHtml) return segHtml;
    try {                                                                    
      const items: TranscriptItem[] = normalizeTranscriptItems(mt as any);
      if (items?.length) {
        return items.map(it => (it.text || []).join(" ").trim())
                    .filter(Boolean)
                    .map(line => `<p>${line}</p>`)
                    .join("\n");
      }
    } catch {}
    return "";
  }, [transcript, mt]);

  const htmlPatched = useMemo(() => {
    if (!htmlPreferred) return "";
    const target = Platform.OS === "ios" ? "Menlo" : "monospace";
    return htmlPreferred.replace(/font-family\s*:\s*monospace/gi, `font-family: ${target}`);
  }, [htmlPreferred]);

 
  useEffect(() => {
    console.log("[TEXT] html first120 =", (htmlPatched || "").slice(0, 120));
  }, [htmlPatched]);

  const renderKey = useMemo(() => hashStr(htmlPatched), [htmlPatched]);

  if (loading)
    return <View style={[styles.center, { backgroundColor: textcolors.bg }]}><ActivityIndicator /></View>;

  if (error || !media)
    return <View style={[styles.center, { backgroundColor: textcolors.bg }]}><Text style={{ color: textcolors.text }}>{error ?? "Media not found"}</Text></View>;

  const title = media.media_title ?? "Text";
  const description = media.media_description ?? "";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: textcolors.bg }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40, alignItems: "center" }}>
      <View style={containerStyle}>
        {/* Header card */}
        <View style={[styles.card, { backgroundColor: textcolors.card, shadowColor: textcolors.shadow }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: "#F2F4FF", alignItems: "center", justifyContent: "center" }}>
              <Feather name="file-text" size={26} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: textcolors.text }} numberOfLines={2}>{title}</Text>
              {!!description && <Text style={{ marginTop: 4, color: "#64748B" }} numberOfLines={2}>{description}</Text>}
            </View>
          </View>
        </View>

        {/* Content card */}
        <View style={[styles.card, { backgroundColor: textcolors.card, shadowColor: textcolors.shadow }]}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: textcolors.text, marginBottom: 8 }}>Text</Text>

          {htmlPatched?.trim() ? (
            <RichHtml
              key={renderKey}                       // remount تضمینی
              html={htmlPatched}
              baseFontSize={16}
              lineHeight={24}
              bgColor={textcolors.card}
            />
          ) : (
            <Text style={{ color: "#64748B" }}>No text available.</Text>
          )}
        </View>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 16,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 16,
  },
});
