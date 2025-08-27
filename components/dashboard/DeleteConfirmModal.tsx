import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  visible: boolean;
  courseName?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({ visible, courseName, onCancel, onConfirm }: Props) {
  const { colors } = useTheme();
  const modalColors = (colors as any).dashboardColors.deleteModal;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: modalColors.overlayBg }]}>
        <View style={[styles.sheet, { backgroundColor: modalColors.sheetBg }]}>
          <Text style={[styles.title, { color: modalColors.title }]}>Delete course?</Text>
          <Text style={[styles.info, { color: modalColors.info }]}>
            Are you sure you want to delete {courseName ? `"${courseName}"` : "this course"}? This action can't be undone.
          </Text>

          <View style={styles.row}>
          <Pressable style={[styles.action, styles.cancel,{ backgroundColor: modalColors.cancelBg }]} onPress={onCancel}>
              <Text style={[styles.actionText, { color: modalColors.cancelText }]}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.action} onPress={onConfirm}>
              <LinearGradient
                colors={modalColors.deleteGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionBg}
              >
                <Text style={[styles.actionText, { color: modalColors.deleteText }]}>Delete</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  sheet: { borderRadius: 18, padding: 16, width: "100%", maxWidth: 480 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  info: { fontSize: 13, marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  action: { flex: 1, borderRadius: 14, overflow: "hidden" },
  actionBg: { paddingVertical: 12, alignItems: "center" },
  actionText: { fontWeight: "700", fontSize: 15 },
  cancel: { backgroundColor: "#E5E7EB", justifyContent: "center", alignItems: "center" },
});
