import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from '../../../context/ThemeContext';
import { useDashboardStyles } from "./styles";




export default function AddEditModal({
  visible, mode, courseType, title, pickedName,
  onChangeTitle, onPickFile, onCancel, onSubmit, submitDisabled,
}: {
  visible: boolean;
  mode: "add" | "edit";
  courseType: "Video" | "Podcast" | "Text";
  title: string;
  pickedName?: string | null;
  onChangeTitle: (v: string) => void;
  onPickFile: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
}) {
  const label = courseType === "Video" ? "Video file" : courseType === "Podcast" ? "Audio file" : "Text file";
  const icon  = courseType === "Video" ? "movie-open" : courseType === "Podcast" ? "music-note" : "file-document-outline";
  const choose = `Choose ${courseType === "Video" ? "video" : courseType === "Podcast" ? "audio" : "text"} file`;
  const { colors } = useTheme();
  const dashboardColors = (colors as any).dashboarddetail;
  const s = useDashboardStyles();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>{mode === "edit" ? "Edit Item" : `Add ${courseType === "Text" ? "Text File" : courseType}`}</Text>

          <Text style={s.label}>Title</Text>
          <TextInput value={title} onChangeText={onChangeTitle} placeholder="name" style={s.input} />

          <Text style={[s.label, { marginTop: 10 }]}>{label}</Text>
          <TouchableOpacity onPress={onPickFile} style={s.pickBtn}>
            <MaterialCommunityIcons name={icon as any} size={18} color={dashboardColors.modal.iconPrimary}  />
            <Text style={s.pickText}>{pickedName ?? choose}</Text>
          </TouchableOpacity>

          <View style={s.actions}>
            <TouchableOpacity style={[s.action, s.cancel]} onPress={onCancel}>
              <Text style={{ fontWeight: "700",  color: dashboardColors.modal.textPrimary }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.action, submitDisabled ? s.disabled : s.primary]}
              onPress={onSubmit}
              disabled={submitDisabled}
            >
              <Text style={{ fontWeight: "700",  color: submitDisabled
          ? dashboardColors.modal.textMuted  
          : dashboardColors.modal.textOnPrimary, }}>
                {mode === "edit" ? "Save" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
