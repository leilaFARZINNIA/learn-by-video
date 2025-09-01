import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

function pickAvatarPair(seed: string) {
  const pairs: Array<[string, string]> = [
    ["#E0F2FE", "#BFDBFE"], // sky
    ["#EDE9FE", "#DDD6FE"], // violet
    ["#FEF3C7", "#FDE68A"], // amber
    ["#FCE7F3", "#FBCFE8"], // pink
    ["#DCFCE7", "#BBF7D0"], // green
    ["#FFE4E6", "#FECDD3"], // rose
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return pairs[h % pairs.length];
}

export default function PodcastAvatar({
  title,
  art,
  playing,
  size = 112,
}: {
  title: string;
  art?: string | null;
  playing: boolean;
  size?: number;
}) {
  const { colors } = useTheme();
  const podcast = (colors as any).podcast;

  if (art) {
    return <Image source={{ uri: art }} style={{ width: size, height: size, borderRadius: 18, marginRight: 14, backgroundColor: podcast.border }} />;
  }

  const [base, ring] = pickAvatarPair(title || "Podcast");
  const bar1 = useRef(new Animated.Value(0.6)).current;
  const bar2 = useRef(new Animated.Value(0.3)).current;
  const bar3 = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (playing) {
      const mk = (v: Animated.Value, min: number, max: number, delay = 0) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(v, { toValue: max, duration: 420, delay, useNativeDriver: true }),
            Animated.timing(v, { toValue: min, duration: 380, useNativeDriver: true }),
          ])
        );
      loop = Animated.parallel([mk(bar1, 0.35, 1, 0), mk(bar2, 0.2, 0.9, 120), mk(bar3, 0.4, 1, 60)]);
      loop.start();
    } else {
      bar1.stopAnimation(); bar2.stopAnimation(); bar3.stopAnimation();
      bar1.setValue(0.55); bar2.setValue(0.35); bar3.setValue(0.75);
    }
    return () => { loop?.stop(); };
  }, [playing]);

  const barW = Math.max(6, Math.floor(size / 18));
  const barGap = Math.max(4, Math.floor(size / 28));
  const barMaxH = Math.floor(size * 0.55);

  return (
    <View style={{
      marginRight: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: podcast.border,
      overflow: "hidden",
      borderRadius: 18,
      width: size,
      height: size,
      backgroundColor: ring
    }}>
      <View style={{
        position: "absolute",
        left: 6, right: 6, top: 6, bottom: 6,
        borderRadius: (size - 12) / 2,
        backgroundColor: base,
        borderWidth: 1,
        borderColor: podcast.border,
      }} />
      <View style={{
        position: "absolute",
        left: size * 0.24, right: size * 0.24, top: size * 0.24, bottom: size * 0.24,
        borderRadius: (size - size * 0.48) / 2,
        backgroundColor: (podcast as any).avatarInner || "rgba(255,255,255,0.67)",
        borderWidth: 1,
        borderColor: (podcast as any).avatarInnerBorder || "rgba(0,0,0,0.06)",
      }} />
      <View style={{ position: "absolute", bottom: size * 0.2, left: 0, right: 0, alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          {[bar1, bar2, bar3].map((v, i) => (
            <Animated.View key={i} style={{ width: barW, height: barMaxH, marginHorizontal: barGap / 2, justifyContent: "flex-end", transform: [{ scaleY: v }] }}>
              <View style={{ height: "100%", width: "100%", backgroundColor: podcast.blueDark, borderRadius: 9999, opacity: 0.9 }} />
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}
