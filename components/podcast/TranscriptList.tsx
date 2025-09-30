import { HIGHLIGHT_WORDS } from "@/constants/media/transcript-highlight";
import { computeAutoScrollTarget, pickActiveIndex, shouldAutoScroll } from "@/utils/autoScroll";
import type { TranscriptItem } from "@/utils/normalizeTranscript";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, ScrollView, Text } from "react-native";

function fmtFromSec(sec?: number) {
  const s = Math.max(0, Math.floor(sec ?? 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function TranscriptList({
  colors,
  items,
  currentTimeSec,
  onSeek,
  maxHeight = 360,
}: {
  colors: any;
  items: TranscriptItem[];
  currentTimeSec: number; // seconds
  onSeek?: (sec: number) => void;
  maxHeight?: number;
  highlightWords?: string[];
}) {
  // sort defensively
  const data = useMemo(
    () => [...(items || [])].sort((a, b) => (a.time ?? 0) - (b.time ?? 0)),
    [items]
  );

  const HL = useMemo(() => new Set(HIGHLIGHT_WORDS.map((w) => String(w).trim().toLowerCase())), []);

  const scrollRef = useRef<ScrollView | null>(null);
  const rowTops = useRef<number[]>([]);
  const rowHeights = useRef<number[]>([]);
  const viewportHRef = useRef(0);
  const scrollYRef = useRef(0);
  const lastManualRef = useRef(0);
  const programmaticRef = useRef(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
    if (!programmaticRef.current) lastManualRef.current = Date.now();
  };

  useEffect(() => {
    if (!data.length) return;

    const idx = pickActiveIndex(data.map((it) => it.time), currentTimeSec, 0.05);
    if (idx !== activeIdx) setActiveIdx(idx);

    const target = computeAutoScrollTarget({
      rowTops: rowTops.current,
      rowHeights: rowHeights.current,
      viewportTop: scrollYRef.current,
      viewportHeight: viewportHRef.current || 0,
      activeIndex: idx,
      config: { alignMode: "smart", comfort: 90, margin: 16, tolerance: 18 },
    });

    if (target != null && shouldAutoScroll(lastManualRef.current, 900) && scrollRef.current) {
      programmaticRef.current = true;
      scrollRef.current.scrollTo({ y: target, animated: true });
      setTimeout(() => (programmaticRef.current = false), 260);
    }
  }, [currentTimeSec, data.length]);

  return (
    <ScrollView
      ref={(r) => { scrollRef.current = r; }}
      style={{ maxHeight }}
      contentContainerStyle={{ paddingBottom: 6 }}
      onLayout={(e) => (viewportHRef.current = e.nativeEvent.layout.height)}
      onScroll={onScroll}
      onScrollBeginDrag={() => { lastManualRef.current = Date.now(); }}
      onMomentumScrollBegin={() => { lastManualRef.current = Date.now(); }}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator
    >
      {data.length === 0 ? (
        <Text style={{ color: colors.textMuted }}>No transcript provided.</Text>
      ) : (
        data.map((it, idx) => {
          const isActive = idx === activeIdx;
          return (
            <Pressable
              key={idx}
              android_ripple={{ color: colors.border }}
              onPress={() => onSeek?.(it.time ?? 0)}
              onLayout={(e) => {
                rowTops.current[idx] = e.nativeEvent.layout.y;
                rowHeights.current[idx] = e.nativeEvent.layout.height;
              }}
              style={[
                { paddingVertical: 2, paddingRight: 6, borderRadius: 8, marginBottom: 6 },
                isActive && { backgroundColor: colors.lineActive },
              ]}
            >
              {/* time chip */}
              {Number.isFinite(it.time) && (
                <Text style={{
                  fontSize: 12,
                  fontVariant: ["tabular-nums"],
                  backgroundColor: colors.timeChipBg || colors.blueSoft,
                  color: colors.blueDark,
                  paddingHorizontal: 6,
                  paddingVertical: Platform.select({ web: 2, default: 1 }),
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: colors.timeChipBorder || colors.blueSoft,
                  overflow: "hidden",
                  alignSelf: "flex-start",
                  marginBottom: 4,
                }}>
                  <Ionicons name="time-outline" size={12} color={colors.blueDark} />{" "}
                  {fmtFromSec(it.time)}
                </Text>
              )}

              {/* words */}
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.paragraph }}>
                {Array.isArray(it.text)
                  ? it.text.map((w, i) => {
                      const original = String(w);
                      const match = original.replace(/[.,!?;:]/g, "").toLowerCase();
                      const hit = HL.has(match);
                      if (hit) {
                        return (
                          <Text
                            key={`${original}-${i}`}
                            style={{
                              fontWeight: "700",
                              backgroundColor: '#eaf7d3',
                              color: '#257600',
                              paddingHorizontal: 6,
                              paddingVertical: Platform.select({ web: 2, default: 1 }),
                              borderRadius: 6,
                              marginRight: 4,
                             
                              
                              overflow: "hidden",
                            }}
                          >
                            {original + " "}
                          </Text>
                        );
                      }
                      return original + " ";
                    })
                  : String(it.text ?? "")}
              </Text>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}
