import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type BtnProps = { title: string; onPress: () => void; disabled?: boolean };

export function PrimaryBtn({ title, onPress, disabled }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: ui.buttonBg, borderColor: ui.buttonBg, opacity: disabled ? 0.85 : 1 },
        pressed && !disabled && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={[styles.btnText, { color: ui.buttonText }]}>{title}</Text>
    </Pressable>
  );
}

export function AccentBtn({ title, onPress, disabled }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: ui.accentBg, borderColor: ui.accentBg, opacity: disabled ? 0.85 : 1 },
        pressed && !disabled && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={[styles.btnText, { color: ui.accentText }]}>{title}</Text>
    </Pressable>
  );
}

export function GhostBtn({ title, onPress, disabled }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: "transparent", borderColor: ui.border }]}
    >
      <Text style={[styles.btnText, { color: ui.text }]}>{title}</Text>
    </Pressable>
  );
}

export function DangerBtn({ title, onPress, disabled }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: ui.dangerBg, borderColor: ui.dangerBg, opacity: disabled ? 0.85 : 1 }]}
    >
      <Text style={[styles.btnText, { color: ui.dangerText }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 14,
    width: "100%",
    alignSelf: "stretch",
  },
  btnText: { fontWeight: "900" },
});
