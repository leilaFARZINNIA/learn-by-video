import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export function LabeledInput({
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  return (
    <View>
      <Text style={[styles.label, { color: ui.text }]}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={ui.textMuted}
        style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text }]}
      />
    </View>
  );
}

export function HelperText({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  return <Text style={{ color: ui.textMuted, fontSize: 12 }}>{children}</Text>;
}

export function PwRules() {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  return (
    <Text style={{ color: ui.textMuted, fontSize: 12, marginTop: 6 }}>
      • Minimum length: 8 (recommended: 12+){"\n"}
      • Accepts all characters (spaces & Unicode allowed){"\n"}
      • No forced pattern rules (no mandatory symbol/number mix){"\n"}
      • Avoid your name/email or common passwords{"\n"}
      • Max length: 64
    </Text>
  );
}

const styles = StyleSheet.create({
  input: { height: 46, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
  label: { fontSize: 12, fontWeight: "800", marginBottom: 6 },
});
