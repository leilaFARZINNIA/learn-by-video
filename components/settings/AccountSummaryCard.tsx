import { useTheme } from "@/context/ThemeContext";
import { useResponsive } from "@/theme/settings/responsive";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type SummaryUser = { name?: string | null; email?: string | null; avatar?: string | null; };
type Props = { user: SummaryUser; onEdit: () => void; };

export default function AccountSummaryCard({ user, onEdit }: Props) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  

  const initials =
    (user?.name || user?.email || "?")
      .trim()
      .split(/\s+/)
      .map((s) => s[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2) || "?";

    

  const { pick } = useResponsive();
  const avatarSize = pick(48, 56, 64);
  const btnHeight  = pick(44, 48, 52);
      

  return (
    <View style={[s.card, { backgroundColor: ui.cardBg, borderColor: ui.border }]}>
      <Text style={[s.title, { color: ui.text }]}>Account</Text>

      <View style={s.row}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={[s.avatar, { width: avatarSize, height: avatarSize }]} />
        ) : (
          <View style={[s.avatar, { width: avatarSize, height: avatarSize, backgroundColor: ui.soft }]}>
            <Text style={{ color: ui.text, fontWeight: "800" }}>{initials}</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={[s.name, { color: ui.text }]} numberOfLines={1}>
            {user?.name || "—"}
          </Text>
          <Text style={{ color: ui.textMuted }} numberOfLines={1}>
            {user?.email || "—"}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel="Edit account"
        style={({ pressed }) => [
          s.btn,
          {   height: btnHeight,
            width: "100%",          
            alignSelf: "stretch",     
            backgroundColor: ui.buttonBg,
            borderColor: ui.buttonBg, },
          pressed && { transform: [{ scale: 0.98 }] },
        ]}
      >
        <Text style={[s.btnText, { color: ui.buttonText }]}>Edit account</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  title: { fontSize: 15, fontWeight: "900" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { borderRadius: 999, alignItems: "center", justifyContent: "center" },
  name: { fontWeight: "800", marginBottom: 2 },
  btn: {
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginTop: 8,
    alignSelf: "flex-start", 
  },
  btnText: { fontWeight: "900" },
});
