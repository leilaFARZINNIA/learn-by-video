import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { DangerBtn, GhostBtn } from "./Buttons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
  setConfirmText: (v: string) => void;
  needPassword: boolean;
  delPass: string;
  setDelPass: (v: string) => void;
  deleting?: boolean;
  canDelete: boolean;
};

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  confirmText,
  setConfirmText,
  needPassword,
  delPass,
  setDelPass,
  deleting,
  canDelete,
}: Props) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: ui.cardBg }]}>
          <Text style={[styles.title, { color: ui.text }]}>Delete account?</Text>
          <Text style={{ color: ui.textMuted, marginBottom: 8 }}>
            This cannot be undone. Type <Text style={{ fontWeight: "800", color: ui.text }}>DELETE</Text> to confirm.
          </Text>

          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="DELETE"
            placeholderTextColor={ui.textMuted}
            style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text }]}
          />
          {needPassword && (
            <TextInput
              value={delPass}
              onChangeText={setDelPass}
              placeholder="Account password"
              placeholderTextColor={ui.textMuted}
              secureTextEntry
              style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text, marginTop: 8 }]}
            />
          )}

            
              <View style={{ height: 10 }} />

              <View style={styles.rowBtns}>
                <View style={[styles.btnCol, { marginRight: 10 }]}>
                  <GhostBtn title="Cancel" onPress={onClose} /* block=default:true */ />
                </View>

                <View style={styles.btnCol}>
                  <DangerBtn
                    title={deleting ? "Deleting..." : "Delete"}
                    onPress={onConfirm}
                    disabled={!canDelete || !!deleting || (needPassword && !delPass)}
                    /* block=default:true */
                  />
                </View>
              </View>


        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  rowBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", 
  },
  btnCol: {
    flex: 1, 
  },
  card: { width: "100%", maxWidth: 440, borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: "900", marginBottom: 6 },
  input: { height: 46, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
});
