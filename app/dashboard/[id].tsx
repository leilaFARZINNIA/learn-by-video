import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import {
  createMediaForCourse,
  deleteMedia,
  fetchMediasByCourse,
  updateMedia,
} from "../../api/media-api";
import AddEditModal from "../../components/dashboard/detail/AddEditModal";
import { ALLOWED, isMediaType } from "../../components/dashboard/detail/allowed";
import HeaderCard from "../../components/dashboard/detail/HeaderCard";
import ItemCard from "../../components/dashboard/detail/ItemCard";
import { useDashboardStyles } from "../../components/dashboard/detail/styles";
import type { CourseType, LessonItem } from "../../components/dashboard/types";
import { useTheme } from "../../context/ThemeContext";
import type { Media, TranscriptLine } from "../../types/media";


export default function CourseDetailScreen() {
  const params = useLocalSearchParams<{ id: string; name?: string; type?: CourseType }>();
  const courseId = String(params.id); 
  const courseName = (params.name ?? "Course").toString();
  const courseType = (params.type ?? "Video") as CourseType;
  const s = useDashboardStyles();
  const { colors } = useTheme();
  const detailColors = (colors as any).dashboarddetail.detail;
  const kindFromCourseType = (t: CourseType) =>
    t === "Video" ? "video" : t === "Podcast" ? "audio" : "text";
  
  const linesToCues = (lines: TranscriptLine[]) =>
    lines.map((l, i) => ({
      start: l.time,
      end: lines[i + 1]?.time ?? l.time + 3, 
      text: l.text,
    }));
  
  const cuesToLines = (cues: LessonItem["cues"] | undefined) =>
    (cues ?? []).map(c => ({ time: Math.round(c.start), text: c.text }));
  
  /** Media (backend) -> LessonItem (UI) */
  const mediaToItem = (m: Media): LessonItem => ({
    id: m.media_id,
    title: m.media_title,
    kind: kindFromCourseType(courseType),
    fileUri: m.media_url || undefined,
    fileName: m.media_url ? m.media_url.split("/").pop() ?? null : null,
    transcriptText: typeof m.media_transcript === "string" ? m.media_transcript : undefined,
    cues: Array.isArray(m.media_transcript) ? linesToCues(m.media_transcript as TranscriptLine[]) : undefined,
    contentMd: courseType === "Text" && typeof m.media_transcript === "string" ? m.media_transcript : undefined,
  });


  const load = async () => {
    try {
      const rows = await fetchMediasByCourse(courseId);
      setItems(rows.map(mediaToItem));
    } catch (e: any) {
      Alert.alert("Load failed", e?.message ?? "Cannot load items");
    }
  };
  
  React.useEffect(() => {
    if (courseId) void load();
  }, [courseId]);
  

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

  const upsertItem = async (saved: LessonItem) => {
    try {
      if (editTarget) {
      
        const updated = await updateMedia(saved.id, {
          title: saved.title,
          description: undefined,
          url: saved.fileUri,
          transcript:
            courseType === "Text"
              ? (saved.contentMd ?? saved.transcriptText)
              : (saved.cues?.length ? cuesToLines(saved.cues) : saved.transcriptText),
        });
        setItems(prev => prev.map(p => (p.id === saved.id ? mediaToItem(updated) : p)));
        Alert.alert("Done", "Item updated.");
      } else {
       
        const created = await createMediaForCourse(courseId, {
          title: saved.title,
          description: undefined,
          url: saved.fileUri ?? "",
          transcript:
            courseType === "Text"
              ? (saved.contentMd ?? saved.transcriptText ?? "")
              : (saved.cues?.length ? cuesToLines(saved.cues) : saved.transcriptText),
        });
        setItems(prev => [mediaToItem(created), ...prev]);
        Alert.alert("Done", "Item added.");
      }
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Cannot save item");
    } finally {
      setModalOpen(false);
    }
  };
  

  const removeItem = (id: string) => {
    const doDelete = async () => {
      try {
        await deleteMedia(id);
        setItems(prev => prev.filter(i => i.id !== id));
      } catch (e: any) {
        Alert.alert("Delete failed", e?.message ?? "Cannot delete item");
      }
    };
  
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to delete this item?")) {
        void doDelete();
      }
      return;
    }
  
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void doDelete() },
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
