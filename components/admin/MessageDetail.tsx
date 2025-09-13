// app/components/admin/MessageDetail.tsx
import ActionBtn from "@/components/admin/ActionBtn";
import Chip from "@/components/admin/Chip";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Status = "new" | "open" | "done";
type DetailItem = {
  id: string;
  name: string;
  email: string;
  title: string;
  status: Status;
  createdAtMs: number;
  description: string;
};

export default function MessageDetail({
  visible,
  loading,
  item,
  onClose,
  onMarkOpen,
  onMarkDone,
  onDelete,
  fmtRelative,
}: {
  visible: boolean;
  loading: boolean;
  item: DetailItem | null;
  onClose: () => void;
  onMarkOpen: () => void;
  onMarkDone: () => void;
  onDelete: () => void;
  fmtRelative: (ms: number) => string;
}) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable style={s.backdrop} onPress={onClose} />

      {/* Centered card */}
      <View style={s.centerWrap} pointerEvents="box-none">
        <View style={[s.card, { backgroundColor: admin.cardBg, borderColor: admin.border }]}>
          {loading || !item ? (
            <View style={s.loadingWrap}>
              <ActivityIndicator />
            </View>
          ) : (
            <>
              {/* Header */}
              <View style={s.headerRow}>
                <Text style={[s.title, { color: admin.text }]} numberOfLines={3}>
                  {item.title}
                </Text>
                <Chip status={item.status} />
              </View>

              <Text style={[s.meta, { color: admin.textMuted }]}>
                {item.name} • {item.email} • {fmtRelative(item.createdAtMs)}
              </Text>

              {/* Body */}
              <ScrollView style={s.body} contentContainerStyle={{ paddingVertical: 8 }}>
                <Text style={{ color: admin.text, lineHeight: 22 }}>{item.description}</Text>
              </ScrollView>

              {/* Actions */}
              <View style={s.actionsRow}>
                {item.status !== "open" && <ActionBtn label="Mark open" onPress={onMarkOpen} />}
                {item.status !== "done" && <ActionBtn label="Mark done" onPress={onMarkDone} kind="primary" />}
                <ActionBtn label="Delete" onPress={onDelete} kind="danger" />

                <Pressable
                  onPress={onClose}
                  style={({ pressed, hovered }) => [
                    s.btn,
                    {
                      borderColor: admin.border,
                      backgroundColor:
                        hovered && Platform.OS === "web" ? admin.soft : "transparent",
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={{ color: admin.text, fontWeight: "800" }}>Close</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    position: "absolute",
    inset: 0 as any,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "94%",
    maxWidth: 820,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 12 },
      },
      android: { elevation: 6 },
      default: { boxShadow: "0 16px 40px rgba(2,6,23,0.18)" } as any,
    }),
  },
  loadingWrap: { paddingVertical: 36, alignItems: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "900", flex: 1, paddingRight: 10 },
  meta: { marginTop: 6 },
  body: { maxHeight: 420, marginTop: 10 },
  actionsRow: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
});
