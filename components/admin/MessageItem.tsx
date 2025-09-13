// app/admin/components/MessageItem.tsx
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Pressable, Text, View } from "react-native";
import ActionBtn from "./ActionBtn";
import Chip from "./Chip";
import { styles } from "./styles";
import { Item } from "./types";

export default function MessageItem({
  item, onOpen, onMarkOpen, onMarkDone, onDelete, fmtRelative,
}: {
  item: Item;
  onOpen: () => void;
  onMarkOpen: () => void;
  onMarkDone: () => void;
  onDelete: () => void;
  fmtRelative: (ms: number) => string;
}) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  return (
    <View style={[styles.itemCard, styles.shadowSm, { backgroundColor: admin.cardBg, borderColor: admin.border }]}>
      <Pressable onPress={onOpen} style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontWeight: "900", fontSize: 15, color: admin.text }}>{item.title}</Text>
          <Chip status={item.status} />
        </View>
        <Text style={{ color: admin.textMuted, marginTop: 4 }}>
          {item.name} • {item.email}
        </Text>
        <Text style={{ color: admin.textMuted, fontSize: 12, marginTop: 2 }}>
          {fmtRelative(item.createdAtMs)}
        </Text>
      </Pressable>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
        {item.status !== "open" && <ActionBtn label="Mark open" onPress={onMarkOpen} />}
        {item.status !== "done" && <ActionBtn label="Mark done" onPress={onMarkDone} kind="primary" />}
        <ActionBtn label="Delete" onPress={onDelete} kind="danger" />
      </View>
    </View>
  );
}
