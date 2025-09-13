// components/ui/Buttons.tsx
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";

type BtnProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  block?: boolean;            
};

type Palette = { bg: string; border: string; text: string };

function BaseBtn({
  title,
  onPress,
  disabled,
  palette,
  block = true,             
}: BtnProps & { palette: Palette }) {
  const webCursor =
    Platform.OS === "web"
      ? ({ cursor: disabled ? "not-allowed" : "pointer" } as any)
      : undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={(state) => {
        const pressed = state.pressed;
        const hovered = Platform.OS === "web" ? (state as any).hovered : false;

        return [
          styles.btn,
          block ? styles.block : styles.inline, // ← شرطی شد
          {
            backgroundColor: palette.bg,
            borderColor: palette.border,
            opacity: disabled ? 0.85 : pressed ? 0.92 : hovered ? 0.96 : 1,
          },
          // فیکس iOS: وقتی pressed نیست، اصلاً transform نفرست
          pressed && !disabled ? { transform: [{ scale: 0.98 }] } : null,
          webCursor,
        ];
      }}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.btnText, { color: palette.text }]}>{title}</Text>
    </Pressable>
  );
}

export function PrimaryBtn({ title, onPress, disabled, block }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  const pal: Palette = disabled
    ? {
        bg: ui.buttonBgDisabled ?? "#E2E8F0",
        border: ui.buttonBorderDisabled ?? ui.buttonBgDisabled ?? "#E2E8F0",
        text: ui.buttonTextDisabled ?? "#64748B",
      }
    : { bg: ui.buttonBg, border: ui.buttonBg, text: ui.buttonText };

  return <BaseBtn title={title} onPress={onPress} disabled={disabled} palette={pal} block={block} />;
}

export function AccentBtn({ title, onPress, disabled, block }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  const pal: Palette = disabled
    ? {
        bg: ui.accentBgDisabled ?? ui.accentBg,
        border: ui.accentBgDisabled ?? ui.accentBg,
        text: ui.accentTextDisabled ?? ui.accentText,
      }
    : { bg: ui.accentBg, border: ui.accentBg, text: ui.accentText };

  return <BaseBtn title={title} onPress={onPress} disabled={disabled} palette={pal} block={block} />;
}

export function DangerBtn({ title, onPress, disabled, block }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  const pal: Palette = disabled
    ? {
        bg: ui.dangerBgDisabled ?? ui.dangerBg,
        border: ui.dangerBgDisabled ?? ui.dangerBg,
        text: ui.dangerTextDisabled ?? ui.dangerText,
      }
    : { bg: ui.dangerBg, border: ui.dangerBg, text: ui.dangerText };

  return <BaseBtn title={title} onPress={onPress} disabled={disabled} palette={pal} block={block} />;
}

export function GhostBtn({ title, onPress, disabled, block }: BtnProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  const pal: Palette = disabled
    ? { bg: "transparent", border: ui.border, text: ui.textMuted ?? ui.text }
    : { bg: "transparent", border: ui.border, text: ui.text };

  return <BaseBtn title={title} onPress={onPress} disabled={disabled} palette={pal} block={block} />;
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
  },
 
  block: { width: "100%", alignSelf: "stretch" },
  inline: { alignSelf: "flex-start" },
  btnText: { fontWeight: "900" },
});
