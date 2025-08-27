import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import type { CourseType } from "../types";
import { useDashboardStyles } from "./styles";

export default function HeaderCard({
  name,
  id,
  type,
}: {
  name: string;
  id: string;
  type: CourseType;
}) {
  const icon =
    type === "Video"
      ? "movie-open-play"
      : type === "Podcast"
      ? "podcast"
      : "file-document-outline";

  const { colors } = useTheme();
  const headerColors = (colors as any).dashboarddetail.header;
  const s = useDashboardStyles();


  const gradient = headerColors.gradientsByType[type];
  const iconColor = headerColors.iconColor;

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.headerCard}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <MaterialCommunityIcons name={icon as any} size={28} color={iconColor} />
        <View>
          <Text style={s.headerTitle}>{name}</Text>
          <Text style={s.headerSub}>
            Type: {type} • ID: {id}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
