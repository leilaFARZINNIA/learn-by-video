// components/ui/Avatar.tsx
import { useTheme } from "@/context/ThemeContext";
import React, { useMemo, useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

export type AvatarProps = {
  uri?: string | null;
  name?: string | null;
  email?: string | null;
  size?: number;
  ring?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

function AvatarCircle({
  uri,
  name,
  email,
  size = 32,
  ring = true,
  onPress,
  accessibilityLabel = "Open profile",
}: AvatarProps) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  const initials = useMemo(() => {
    const src = (name || email || "?").trim();
    const letters =
      src
        .split(/\s+/)
        .map((s) => s[0]?.toUpperCase() || "")
        .join("")
        .slice(0, 2) || "?";
    return letters;
  }, [name, email]);

  const [imgError, setImgError] = useState(false);
  const radius = size / 2;

  // ✅ آرایه‌ی استایل را به‌صورت StyleProp<ViewStyle> تایپ کردیم (بدون as const)
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: radius,
      borderWidth: ring ? 1 : 0,
      borderColor: ui.border,
      backgroundColor: ui.soft,
    },
  ];

  const content =
    uri && !imgError ? (
      <Image
        source={{ uri }}
        onError={() => setImgError(true)}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="cover"
        accessible={false}
      />
    ) : (
      <View style={[styles.fallback, { borderRadius: radius }]}>
        <Text style={{ color: ui.text, fontWeight: "800", fontSize: size * 0.38 }}>
          {initials}
        </Text>
      </View>
    );

  // یک رَپر واحد: اگر onPress هست از Pressable، وگرنه View
  const Wrapper: any = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={accessibilityLabel}
      hitSlop={onPress ? { top: 6, bottom: 6, left: 6, right: 6 } : undefined}
      style={containerStyle}
    >
      {content}
    </Wrapper>
  );
}

export default React.memo(AvatarCircle);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
