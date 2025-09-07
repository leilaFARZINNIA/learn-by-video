// src/components/login/GoogleButton.tsx
import React, { JSX, memo, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

export type GoogleButtonProps = Readonly<{
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void | Promise<void>;
  text?: string;
  fullWidth?: boolean;
  style?: any;
  accessibilityLabel?: string;
  testID?: string;
}>;

/** Official multicolor Google "G" glyph (SVG) */
function GoogleGlyph({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityRole="image" focusable={false}>
      {/* Red */}
      <Path
        fill="#EA4335"
        d="M24 9.5c3.35 0 6.37 1.16 8.75 3.43l6.55-6.55C35.71 2.8 30.34 1 24 1 14.62 1 6.45 6.36 2.72 14.2l7.65 5.93C12.02 14.64 17.51 9.5 24 9.5z"
      />
      {/* Yellow */}
      <Path
        fill="#FBBC05"
        d="M46.5 24c0-1.8-.2-3.53-.58-5.2H24v9.88h12.65c-.54 2.93-2.19 5.41-4.67 7.1l7.17 5.56C43.54 37.77 46.5 31.47 46.5 24z"
      />
      {/* Green */}
      <Path
        fill="#34A853"
        d="M11.41 28.92a14.47 14.47 0 0 1-.76-4.92c0-1.71.27-3.35.76-4.92l-7.65-5.93C1.9 15.78 0.5 19.68 0.5 24s1.4 8.22 3.76 10.84l7.15-5.92z"
      />
      {/* Blue */}
      <Path
        fill="#4285F4"
        d="M24 46.99c6.13 0 11.28-2.02 15.05-5.47l-7.17-5.56C29.7 37.42 27.1 38.5 24 38.5c-6.49 0-11.98-5.14-13.63-10.63l-7.15 5.92C6.95 41.64 14.62 47 24 47z"
      />
    </Svg>
  );
}

function GoogleButton({
  loading = false,
  disabled = false,
  onPress,
  style,
  text = "Continue with Google",
  fullWidth = true,
  accessibilityLabel = "Continue with Google",
  testID,
}: GoogleButtonProps): JSX.Element {
  const { colors } = useTheme();
  const login = (colors as any).login;

  const isDisabled = disabled || loading;

  // animation
  const scale = useRef(new Animated.Value(1)).current;
  const [isFocused, setFocused] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const animateTo = useCallback(
    (to: number) =>
      Animated.spring(scale, {
        toValue: to,
        useNativeDriver: true,
        friction: 7,
        tension: 180,
      }).start(),
    [scale]
  );

  const onPressIn = useCallback(() => {
    if (!isDisabled) animateTo(0.98);
  }, [animateTo, isDisabled]);

  const onPressOut = useCallback(() => {
    animateTo(1);
  }, [animateTo]);

  const containerStyle: StyleProp<ViewStyle> = [
    s.container,
    fullWidth && { width: "100%" },
    {
      transform: [{ scale }],
      shadowColor: login.shadow ?? "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: isHovered || isFocused ? 3 : 1,
    },
  ];

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        hitSlop={8}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={isDisabled}
        testID={testID}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(Platform.OS === "web"
          ? { onHoverIn: () => setHovered(true), onHoverOut: () => setHovered(false) }
          : {})}
        android_ripple={
          Platform.OS === "android"
            ? { color: login.ripple ?? "rgba(0,0,0,0.08)", borderless: false }
            : undefined
        }
        style={({ pressed }) => [
          s.btn,
          { backgroundColor: login.googleBtnBg, borderColor: login.border },
          isFocused && {
            borderColor: login.focusRing ?? "#2563EB",
            borderWidth: 2,
            shadowColor: login.focusRing ?? "#2563EB",
            shadowOpacity: 0.25,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 0 },
            elevation: 2,
          },
          isDisabled && { opacity: 0.6 },
          Platform.OS === "web" && { cursor: isDisabled ? "not-allowed" : "pointer" },
          pressed && Platform.OS !== "android" && !isDisabled && { opacity: 0.9 },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={login.text} />
        ) : (
          <View style={s.content}>
            <GoogleGlyph size={18} />
            <Text style={[s.text, { color: login.text }]} numberOfLines={1}>
              {text}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    borderRadius: 12,
  },
  btn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: { fontWeight: "800" },
});

export default memo(GoogleButton) as React.NamedExoticComponent<GoogleButtonProps>;
