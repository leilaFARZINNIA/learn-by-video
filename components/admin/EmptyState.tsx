// app/admin/components/EmptyState.tsx
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

export default function EmptyState({
  hasQuery, onClear,
}: {
  hasQuery: boolean;
  onClear: () => void;
}) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  return (
    <View style={{ alignItems: "center", paddingVertical: 32 }}>
      <Text style={{ color: admin.text, fontWeight: "900", fontSize: 16 }}>
        {hasQuery ? "No results" : "No messages yet"}
      </Text>
      <Text style={{ color: admin.textMuted, marginTop: 6 }}>
        {hasQuery ? "Try a different search." : "New messages will appear here."}
      </Text>
      {hasQuery && (
        <Pressable onPress={onClear} style={[styles.btnSm, { borderColor: admin.border, marginTop: 10 }]}>
          <Text style={{ color: admin.text }}>Clear search</Text>
        </Pressable>
      )}
    </View>
  );
}
