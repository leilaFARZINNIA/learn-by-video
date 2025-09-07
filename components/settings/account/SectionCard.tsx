import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type Props = ViewProps & { title: string; subtitle?: string; children: React.ReactNode };

export default function SectionCard({ title, subtitle, style, children, ...rest }: Props) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  return (
    <View
      {...rest}
      style={[
        styles.card,
        { backgroundColor: ui.cardBg, borderColor: ui.border, shadowColor: ui.cardShadow },
        style,
      ]}
    >
      <Text style={[styles.title, { color: ui.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: ui.textMuted }]}>{subtitle}</Text> : null}
      <View style={{ height: 8 }} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  title: { fontSize: 15, fontWeight: "900" },
  subtitle: { fontSize: 12, fontWeight: "600" },
});
