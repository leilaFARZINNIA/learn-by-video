// src/components/dashboard/detail/HeaderCard.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, Text, View, type TextStyle } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ellipsizeSmart } from "../../../utils/ellipsize";
import type { CourseType } from "../types";
import { useDashboardStyles } from "./styles";

type Props = {
  name: string;
  id: string;
  type: CourseType;
};

export default function HeaderCard({ name, id, type }: Props) {
  const iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    type === "Video" ? "movie-open-play"
    : type === "Podcast" ? "podcast"
    : "file-document-outline";

  const { colors } = useTheme();
  const headerColors = (colors as any).dashboarddetail.header;
  const s = useDashboardStyles();
  const { isPhone, isDesktop } = useBreakpoint();

  const gradient = headerColors.gradientsByType[type];
  const iconColor = headerColors.iconColor;

  
  const titleText = (name ?? "").trim();
  const idShort = ellipsizeSmart(id, {
    maxWords: 3,
    maxChars: isDesktop ? 36 : 22,
  });

  
  const webBreakWord: TextStyle =
    Platform.OS === "web" ? ({ wordBreak: "break-word" } as unknown as TextStyle) : {};

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.headerCard}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />

        <View style={{ flex: 1, minWidth: 0 }}>
          
          <Text
            style={[s.headerTitle, { fontSize: isPhone ? 18 : 20 }, webBreakWord]}
            numberOfLines={isPhone ? 1 : 2}
            ellipsizeMode="tail"
            accessibilityLabel={titleText}
          >
            {titleText}
          </Text>

          <Text
            style={[s.headerSub, { fontSize: isPhone ? 12 : 13 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityLabel={`Type: ${type} • ID: ${id}`}
          >
            Type: {type}{"  "}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
