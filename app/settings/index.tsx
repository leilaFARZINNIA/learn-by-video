import { useAuth } from "@/auth/auth-context";
import AccountSummaryCard from "@/components/settings/AccountSummaryCard";
import SectionCard from "@/components/settings/SectionCard";
import SettingRow from "@/components/settings/SettingRow";
import ToggleThemeButton from "@/components/settings/ToggleThemeButton";
import { useTheme } from "@/context/ThemeContext";
import { useResponsive } from "@/theme/settings/responsive";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const { colors, isDarkMode } = useTheme();
  const ui = (colors as any).settings;
  const { user } = useAuth();
  const { pick } = useResponsive();

  // Layout responsive tokens
  const layout = useMemo(() => ({
    padding:       pick(18, 22, 28),
    contentMax:    pick(520, 720, 960),
    gap:           pick(16, 18, 20),
    sectionGap:    pick(14, 16, 18),
    colWidth:      pick<"100%" | number>("100%", "100%"), 
  }), [pick]);

  return (
    <ScrollView
      contentContainerStyle={{ padding: layout.padding, paddingBottom: layout.padding + 24, alignItems: "center" }}
      style={{ flex: 1, backgroundColor: ui.bg }}
    >
      <View style={{ width: "100%", maxWidth: layout.contentMax }}>
        {/* Page header */}
        <View style={{ marginBottom: layout.gap }}>
          <Text style={[styles.pageTitle, { color: ui.text }]}>Settings</Text>
          <Text style={{ color: ui.textMuted, marginTop: 4 }}>
            Manage your account and appearance preferences.
          </Text>
        </View>

        {/* Grid container */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: layout.gap }}>
          {/* Account (full width) */}
          <View style={{ width: "100%" }}>
            {user ? (
              <AccountSummaryCard user={user} onEdit={() => router.push("/settings/account")} />
            ) : null}
          </View>

          {/* Appearance / Theme (responsive column) */}
          <SectionCard
            title="Theme"
            subtitle="Choose how the app looks."
            style={{ width: layout.colWidth }}
          >
            <SettingRow
              label={isDarkMode ? "Dark" : "Light"}
              right={<ToggleThemeButton />}
            />
          </SectionCard>

    
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 22, fontWeight: "900" },
});
