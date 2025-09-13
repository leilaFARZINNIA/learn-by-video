// app/admin/components/Chip.tsx
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";
import { Status } from "./types";

export default function Chip({ status }: { status: Status }) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;
  const c = admin.chip[status];

  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1, borderColor: c.border, backgroundColor: c.bg }}>
      <Text style={{ color: c.text, fontWeight: "800", fontSize: 12 }}>{status.toUpperCase()}</Text>
    </View>
  );
}
