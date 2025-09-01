import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React from "react";
import { Text, View } from "react-native";

function fmt(millis?: number) {
  if (millis == null) return "0:00";
  const total = Math.floor(millis / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TimeSlider({
  colors,
  position,
  duration,
  onSlidingStart,
  onValueChange,
  onSlidingComplete,
}: {
  colors: any;
  position: number;
  duration: number;
  onSlidingStart: () => void;
  onValueChange: (v: number) => void;
  onSlidingComplete: (v: number) => void;
}) {
  const durationSafe = duration || 1;
  return (
    <View style={{ marginTop: 6 }}>
      <Slider
        style={{ width: "100%", height: 28 }}
        value={position}
        minimumValue={0}
        maximumValue={durationSafe}
        onSlidingStart={onSlidingStart}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={colors.blue}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.blue}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4, alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={{ fontSize: 12, color: colors.textMuted }}>{fmt(position)}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={{ fontSize: 12, color: colors.textMuted }}>{fmt(durationSafe)}</Text>
        </View>
      </View>
    </View>
  );
}
