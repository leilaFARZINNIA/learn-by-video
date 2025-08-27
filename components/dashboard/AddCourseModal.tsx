import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import type { CourseType } from "./types";

type AddCoursePayload = {
  name: string;
  type: CourseType;
  active: boolean;
  description?: String;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: AddCoursePayload) => void;
};

export default function AddCourseModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CourseType>("Video");
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState<string>("");

  const { colors } = useTheme();
  const dashboard = (colors as any).dashboardColors;

  useEffect(() => {
    if (visible) {
      setName("");
      setType("Video");
      setActive(true);
      setDescription("");
    }
  }, [visible]);

  const handleAdd = () =>
    onSubmit({
      name: name.trim(),
      type,
      active,
      description: description.trim() || undefined,
    });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: dashboard.modal.overlayBg }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.center}
        >
          <View style={[styles.sheet, { backgroundColor: dashboard.modal.sheetBg }]}>
            <Text style={[styles.title, { color: dashboard.modal.title }]}>
              Add Course
            </Text>

            {/* Name */}
            <Text style={[styles.label, { color: dashboard.modal.label }]}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="course name"
              placeholderTextColor={dashboard.modal.textMuted}
              style={[
                styles.input,
                {
                  borderColor: dashboard.modal.inputBorder,
                  backgroundColor: dashboard.modal.inputBg,
                  color: dashboard.modal.inputText,
                },
              ]}
              returnKeyType="done"
            />

            {/* Details */}
            <Text style={[styles.label, { marginTop: 12, color: dashboard.modal.label }]}>
              Details
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add a short description or details…"
              placeholderTextColor={dashboard.modal.textMuted}
              style={[
                styles.input,
                styles.textarea,
                {
                  borderColor: dashboard.modal.inputBorder,
                  backgroundColor: dashboard.modal.inputBg,
                  color: dashboard.modal.inputText,
                },
              ]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="default"
            />

            {/* Type */}
            <Text style={[styles.label, { marginTop: 12, color: dashboard.modal.label }]}>
              Type
            </Text>
            <View style={styles.row}>
              {(["Video", "Podcast", "Text"] as CourseType[]).map((t) => {
                const activeType = type === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
                    style={[
                      styles.chip,
                      {
                        borderColor: activeType
                          ? dashboard.modal.chipActiveBorder
                          : dashboard.modal.chipBorder,
                        backgroundColor: activeType
                          ? dashboard.modal.chipActiveBg
                          : dashboard.modal.chipBg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: activeType
                            ? dashboard.modal.chipTextActive
                            : dashboard.modal.chipText,
                        },
                      ]}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Published */}
            <View
              style={[styles.row, { justifyContent: "space-between", marginTop: 12 }]}
            >
              <Text style={[styles.label, { color: dashboard.modal.label }]}>
                Published
              </Text>
              <Switch value={active} onValueChange={setActive} />
            </View>

            {/* Actions */}
            <View style={[styles.row, { marginTop: 16 }]}>
              {/* Cancel */}
              <Pressable style={[styles.action]} onPress={onClose}>
                <LinearGradient
                  colors={[dashboard.modal.cancelBg, dashboard.modal.cancelBg]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBg}
                >
                  <Text
                    style={[
                      styles.actionText,
                      { color: dashboard.modal.cancelText },
                    ]}
                  >
                    Cancel
                  </Text>
                </LinearGradient>
              </Pressable>

              {/* Add */}
              <Pressable style={styles.action} onPress={handleAdd}>
                <LinearGradient
                  colors={dashboard.modal.addGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBg}
                >
                  <Text
                    style={[styles.actionText, { color: dashboard.modal.addText }]}
                  >
                    Add
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  center: { width: "100%", alignItems: "center", justifyContent: "center" },
  sheet: { borderRadius: 18, padding: 16, width: "100%", maxWidth: 480 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  chipText: { fontWeight: "600", fontSize: 13 },
  action: { flex: 1, borderRadius: 14, overflow: "hidden" },
  actionBg: { paddingVertical: 12, alignItems: "center" },
  actionText: { fontWeight: "700", fontSize: 15 },
  textarea: { minHeight: 20, lineHeight: 20 },
});
