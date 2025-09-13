// app/contact/components/SubmitButton.tsx
import React from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onPress: () => void;
  disabled: boolean;
  sending: boolean;
  ui: any;
  testID?: string;
  label?: string;
  onLayout?: any;
};

export default function SubmitButton({ onPress, disabled, sending, ui, testID, label = "Send", onLayout }: Props) {
  const btnColors = disabled
    ? { bg: ui.buttonBgDisabled, border: ui.buttonBorderDisabled ?? ui.buttonBgDisabled, text: ui.buttonTextDisabled }
    : { bg: ui.buttonBg, border: ui.buttonBg, text: ui.buttonText };

  const webCursorStyle = Platform.OS === "web" ? ({ cursor: disabled ? "not-allowed" : "pointer" } as any) : undefined;

  return (
    <Pressable
      testID={testID}
      onLayout={onLayout}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed, hovered }) => [
        styles.btn,
        { backgroundColor: btnColors.bg, borderColor: btnColors.border, opacity: pressed && !disabled ? 0.92 : 1 },
        hovered && Platform.OS === "web" && !disabled ? { opacity: 0.96 } : null,
        webCursorStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: sending }}
    >
      {sending ? (
        <View style={styles.btnInner}>
          <ActivityIndicator size="small" color={btnColors.text} />
          <Text style={[styles.btnText, { color: btnColors.text, marginLeft: 8 }]}>Sending…</Text>
        </View>
      ) : (
        <Text style={[styles.btnText, { color: btnColors.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, marginTop: 10 },
  btnInner: { flexDirection: "row", alignItems: "center" },
  btnText: { fontWeight: "900", fontSize: 15, letterSpacing: 0.3 },
});
