// src/components/login/ProviderTabs.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from '../../context/ThemeContext';

export type ProviderTab = "google" | "email";

type Props = {
  active: ProviderTab;
  onChange: (tab: ProviderTab) => void;
};

export default function ProviderTabs({ active, onChange }: Props) {
  const { colors } = useTheme();
  const login = (colors as any).login;

  return (
    <View style={[s.tabs, { backgroundColor: login.segmentBg }]}>
      <Pressable
        onPress={() => onChange("google")}
        style={[s.tab, active === "google" && { backgroundColor: login.segmentActiveBg }]}
      >
        <Text
          style={[s.tabText, { color: login.textMuted }, active === "google" && { color: login.text }]}
        >
          Google
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChange("email")}
        style={[s.tab, active === "email" && { backgroundColor: login.segmentActiveBg }]}
      >
        <Text
          style={[s.tabText, { color: login.textMuted }, active === "email" && { color: login.text }]}
        >
          Email
        </Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
    borderRadius: 999,
    padding: 6,
  },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  tabText: { fontWeight: "800" },
});
