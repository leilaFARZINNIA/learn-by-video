// src/components/login/GoogleButton.tsx
import { AntDesign } from "@expo/vector-icons";
import React, { JSX, memo } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      style={({ pressed }) => [
        s.btn,
        fullWidth && { width: "100%" },
        { backgroundColor: login.googleBtnBg, borderColor: login.border },
        isDisabled && { opacity: 0.6 },
        pressed && !isDisabled && { transform: [{ scale: 0.98 }] },
        Platform.OS === "web" && { cursor: isDisabled ? "not-allowed" : "pointer" },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={login.text} />
      ) : (
        <View style={s.content}>
          <AntDesign name="google" size={18} color={login.googleIcon} />
          <Text style={[s.text, { color: login.text }]} numberOfLines={1}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: { fontWeight: "800" },
});


export default memo(GoogleButton) as React.NamedExoticComponent<GoogleButtonProps>;
