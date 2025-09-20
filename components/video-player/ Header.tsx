// components/Header.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { responsive } from "../../theme/video-player/responsive";
import { ellipsizeSmart } from "../../utils/ellipsize";

export default function Header({ title }: { title?: string }) {
  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;
  const { isPhone, isDesktop } = useBreakpoint();


  const raw = (title ?? "Film").trim() || "Film";
  const hasSpaces = /\s/.test(raw);
  const fallbackWords = isPhone ? 6 : 12;
  const fallbackChars = isDesktop ? 80 : 56;

  const displayTitle = hasSpaces ? raw : ellipsizeSmart(raw, { maxWords: fallbackWords, maxChars: fallbackChars });

  return (
    <View
      style={{
        width: responsive.cardWidth,
        alignSelf: "center",
        alignItems: "center",
        marginTop: 18,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, maxWidth: "100%" }}>
        <MaterialCommunityIcons
          name="play-circle"
          size={responsive.headerFont}
          color={videoplayer.headerBar}
        />
        <Text
          style={{
            fontWeight: "800",
            fontFamily: "serif",
            letterSpacing: 0.3,
            color: videoplayer.headerTitle,
            fontSize: responsive.headerFont,
            textShadowColor: videoplayer.headerTitleShadow,
            textShadowRadius: 6,
            textShadowOffset: { width: 0, height: 3 },
            marginLeft: 4,
           
            flexShrink: 1,
            minWidth: 0,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityLabel={raw}
        >
          {displayTitle}
        </Text>
      </View>

      <View
        style={{
          height: 3,
          backgroundColor: videoplayer.headerBar,
          borderRadius: 20,
          marginTop: 10,
          marginBottom: 8,
          width: "40%",
          alignSelf: "center",
        }}
      />
    </View>
  );
}
