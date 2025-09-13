import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import AddEditModal from "../../components/dashboard/detail/AddEditModal";
import { ALLOWED, isMediaType } from "../../components/dashboard/detail/allowed";
import HeaderCard from "../../components/dashboard/detail/HeaderCard";
import ItemCard from "../../components/dashboard/detail/ItemCard";
import { useDashboardStyles } from "../../components/dashboard/detail/styles";
import type { CourseType, LessonItem } from "../../components/dashboard/types";
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
  const [editTarget, setEditTarget] = useState<LessonItem | null>(null);

  const helperText = useMemo(() => {
    if (isMediaType(courseType)) {
      const list = ALLOWED[courseType].exts.join(", ");
      if (courseType === "Video")
        return `Upload videos as separate items (one file per item).\nAllowed: ${list}`;
      return `Upload podcast audios as separate items.\nAllowed: ${list}`;
    }
    // Text
    return `Create text lessons as separate items.\nNo file needed — paste and edit your text.`;
  }, [courseType]);

  const openAddModal  = () => { setEditTarget(null); setModalOpen(true); };
  const openEditModal = (it: LessonItem) => { setEditTarget(it); setModalOpen(true); };
  const closeModal    = () => setModalOpen(false);

  const upsertItem = (saved: LessonItem) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === saved.id);
      if (i >= 0) { const copy = prev.slice(); copy[i] = saved; return copy; }
      return [saved, ...prev];
    });
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
        <MaterialCommunityIcons name="plus" size={28} color={detailColors.fab.icon} />
      </TouchableOpacity>

      <AddEditModal
        visible={modalOpen}
        mode={editTarget ? "edit" : "add"}
        courseType={courseType}
        initial={editTarget ?? null}
        onClose={closeModal}
        onSubmit={upsertItem}
      />
    </SafeAreaView>
  );
}
