// app/admin/components/ActionBtn.tsx
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Platform, Pressable, Text } from "react-native";
import { styles } from "./styles";

type BtnKind = "ghost" | "primary" | "danger";

export default function ActionBtn({
  label, onPress, kind = "ghost",
}: {
  label: string;
  onPress: () => void;
  kind?: BtnKind;
}) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  const base =
    kind === "ghost"
      ? { bg: "transparent", text: admin.text, border: admin.border }
      : kind === "primary"
      ? { bg: admin.primary, text: "#FFFFFF", border: admin.primary }
      : { bg: "transparent", text: admin.danger, border: admin.danger };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => ([
        styles.btnSm,
        {
          backgroundColor:
            kind === "ghost"
              ? hovered && Platform.OS === "web" ? admin.soft : "transparent"
              : base.bg,
          borderColor: base.border,
          opacity: pressed ? 0.9 : 1,
        },
      ])}
    >
      <Text style={{ color: base.text, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}
