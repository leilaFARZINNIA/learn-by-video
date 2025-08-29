// src/components/login/GoogleButton.tsx
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useTheme } from '../../context/ThemeContext';

type Props = {
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export default function GoogleButton({ loading, disabled, onPress, style }: Props) {
  const { colors } = useTheme();
  const login = (colors as any).login;

  return (
    <Pressable
      onPress={onPress}
      style={[
        s.googleBtn,
        { backgroundColor: login.googleBtnBg, borderColor: login.border },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <AntDesign name="google" size={18} color={login.googleIcon} />
          <Text style={[s.googleText, { color: login.text }]}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  googleBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  googleText: { fontWeight: "800" },
});
