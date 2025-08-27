import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import AddEditModal from "../../components/dashboard/detail/AddEditModal";
import { ALLOWED, isAllowed, MAX_SIZE_BYTES } from "../../components/dashboard/detail/allowed";
import HeaderCard from "../../components/dashboard/detail/HeaderCard";
import ItemCard from "../../components/dashboard/detail/ItemCard";
import { useDashboardStyles } from "../../components/dashboard/detail/styles";
import type { CourseType, ItemKind, LessonItem } from "../../components/dashboard/types";
import { useTheme } from "../../context/ThemeContext";

export default function CourseDetailScreen() {
  const params = useLocalSearchParams<{ id: string; name?: string; type?: CourseType }>();
  const courseId = params.id;
  const courseName = (params.name ?? "Course").toString();
  const courseType = (params.type ?? "Video") as CourseType;
  const s = useDashboardStyles();
  const { colors } = useTheme();
  const detailColors = (colors as any).dashboarddetail.detail;

  const [items, setItems] = useState<LessonItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<{ uri: string; name?: string | null; kind: ItemKind } | null>(null);
  const [editTarget, setEditTarget] = useState<LessonItem | null>(null);

  const helperText = useMemo(() => {
    const list = ALLOWED[courseType].exts.join(", ");
    if (courseType === "Video")   return `Upload videos as separate items (one file per item).\nAllowed: ${list}`;
    if (courseType === "Podcast") return `Upload podcast audios as separate items.\nAllowed: ${list}`;
    return `Upload text documents as separate items.\nAllowed: ${list}`;
  }, [courseType]);

  const openAddModal = () => { setEditTarget(null); setTitle(""); setPicked(null); setModalOpen(true); };
  const openEditModal = (it: LessonItem) => { setEditTarget(it); setTitle(it.title); setPicked({ uri: it.fileUri, name: it.fileName, kind: it.kind }); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const pickFile = async () => {
    let typeList: string[] = [];
    if (courseType === "Video") typeList = ["video/*"];
    else if (courseType === "Podcast") typeList = ["audio/*"];
    else typeList = [
      "text/plain", "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/rtf", "text/markdown",
    ];

    const res = await DocumentPicker.getDocumentAsync({ type: typeList });
    if (res.canceled || !res.assets?.length) return;

    const f = res.assets[0];
    const check = isAllowed(courseType, f);
    if (!check.ok) {
      const mb = Math.round(MAX_SIZE_BYTES/1024/1024);
      let reason = "";
      if (!check.extOk) reason += `• Extension not allowed\n`;
      if (!check.mimeOk && f.mimeType) reason += `• MIME not allowed (${f.mimeType})\n`;
      if (!check.sizeOk) reason += `• File too large (> ${mb}MB)\n`;
      Alert.alert("Unsupported file",
        `Please upload a valid ${courseType.toLowerCase()} file.\nAllowed: ${ALLOWED[courseType].exts.join(", ")}\n\n${reason.trim()}`
      );
      return;
    }

    const kind: ItemKind = courseType === "Video" ? "video" : courseType === "Podcast" ? "audio" : "text";
    setPicked({ uri: f.uri, name: f.name, kind });
  };

  const submitDisabled = !picked || !title.trim();
  const submit = () => {
    if (submitDisabled || !picked) return;

    if (editTarget) {
      setItems(prev => prev.map(it => it.id === editTarget.id
        ? { ...it, title: title.trim(), kind: picked.kind, fileUri: picked.uri, fileName: picked.name ?? null }
        : it
      ));
    } else {
      setItems(prev => [...prev, {
        id: `${Date.now()}`,
        title: title.trim(),
        kind: picked.kind,
        fileUri: picked.uri,
        fileName: picked.name ?? null,
      }]);
    }
    setEditTarget(null);
    setModalOpen(false);
    Alert.alert("Done", editTarget ? "Item updated." : "Item added.");
  };

  const removeItem = (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setItems(prev => prev.filter(i => i.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <HeaderCard name={courseName} id={courseId} type={courseType} />
      <Text style={s.helper}>{helperText}</Text>

      <View style={{ paddingHorizontal: 16 }}>
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          contentContainerStyle={s.listContent}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: detailColors.listEmptyText, marginTop: 24 }}>
              Nothing here yet. Use the + button to add.
            </Text>
          }
          renderItem={({ item }) => (
            <ItemCard item={item} onEdit={openEditModal} onDelete={removeItem} />
          )}
        />
      </View>

      <TouchableOpacity onPress={openAddModal} style={s.fab}>
        <MaterialCommunityIcons name="plus" size={28}  color={detailColors.fab.icon} />
      </TouchableOpacity>

      <AddEditModal
        visible={modalOpen}
        mode={editTarget ? "edit" : "add"}
        courseType={courseType}
        title={title}
        pickedName={picked?.name ?? undefined}
        onChangeTitle={setTitle}
        onPickFile={pickFile}
        onCancel={closeModal}
        onSubmit={submit}
        submitDisabled={submitDisabled}
      />
    </SafeAreaView>
  );
}
