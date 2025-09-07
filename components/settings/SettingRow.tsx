import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  helpText?: string;
  right: React.ReactNode; 
};

export default function SettingRow({ label, helpText, right }: Props) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: ui.text }]}>{label}</Text>
        <View>{right}</View>
      </View>
      {helpText ? <Text style={{ color: ui.textMuted, fontSize: 12, marginTop: 6 }}>{helpText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 14, fontWeight: "700" },
});
