import { fetchMediaById } from "@/api/media-api";
import RichHtml from "@/components/text/RichHtml";
import { useTheme } from "@/context/ThemeContext";
import { useResponsiveContainerStyle } from "@/theme/text/responsive";
import { normalizeTranscript as normalizeTranscriptItems, TranscriptItem } from "@/utils/normalizeTranscript";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TextScreen() {
  const { colors } = useTheme();
  const textcolors = (colors as any).text;
  const { media_id } = useLocalSearchParams<{ media_id?: string }>();
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerStyle = useResponsiveContainerStyle({});

  useEffect(() => {
    if (!media_id) return;
    setLoading(true);
    setError(null);
    fetchMediaById(String(media_id))
      .then((m) => setMedia(m))
      .catch((e) => setError(e?.message ?? "Fetch error"))
      .finally(() => setLoading(false));
  }, [media_id]);

  
  const htmlFromTimed: string = useMemo(() => {
    const items: TranscriptItem[] = normalizeTranscriptItems(media?.media_transcript as any);
    if (!items?.length) return "";
    const text = items.map(it => (it.text || []).join(" ")).filter(Boolean).join(" ");
    return `<p>${text.replace(/\s+/g, " ").trim()}</p>`;
  }, [media?.media_transcript]);

  const isHtmlString = typeof media?.media_transcript === "string";
  const html = isHtmlString ? (media?.media_transcript as string) : htmlFromTimed;
  const htmlPatched = useMemo(() => {
    if (!html) return "";
   
    const target = Platform.OS === "ios" ? "Menlo" : "monospace";
    return html.replace(/font-family\s*:\s*monospace/gi, `font-family: ${target}`);
  }, [html]);
  useEffect(() => {
    console.log("MOBILE_HTML1", (html || "").slice(0, 300));
  }, [html]);
  

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: textcolors.bg }]}>
        <ActivityIndicator />
      </View>
    );

  if (error || !media)
    return (
      <View style={[styles.center, { backgroundColor: textcolors.bg }]}>
        <Text style={{ color: textcolors.text }}>{error ?? "Media not found"}</Text>
      </View>
    );

  const title = media.media_title ?? "Text";
  const description = media.media_description ?? "";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: textcolors.bg }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40, alignItems: "center" }}
    >
      <View style={containerStyle}>
        {/* Header card */}
        <View style={[styles.card, { backgroundColor: textcolors.card, shadowColor: textcolors.shadow }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                backgroundColor: "#F2F4FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="file-text" size={26} color="#2563EB" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: textcolors.text }} numberOfLines={2}>
                {title}
              </Text>
              {!!description && (
                <Text style={{ marginTop: 4, color: "#64748B" }} numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Content card */}
        <View style={[styles.card, { backgroundColor: textcolors.card, shadowColor: textcolors.shadow }]}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: textcolors.text, marginBottom: 8 }}>Text</Text>

          
         


           

          {html?.trim() ? (
             
             console.log("MOBILE_HTML2", (html || "").slice(0, 300)) ,
            <RichHtml
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
