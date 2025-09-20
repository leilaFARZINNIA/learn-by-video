
export { default as AddCourseModal } from "../../components/dashboard/AddCourseModal";
export { default as DeleteConfirmModal } from "../../components/dashboard/DeleteConfirmModal";
export * from "../../components/dashboard/types";
import { useEffect } from "react";
import { default as CourseCard } from "../../components/dashboard/CourseCard";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import type { ApiCourse } from "../../api/course-api";
import { createCourse as apiCreateCourse, deleteCourse as apiDeleteCourse, fetchCourses as apiFetchCourses } from "../../api/course-api";
import AddCourseModal from "../../components/dashboard/AddCourseModal";
import DeleteConfirmModal from "../../components/dashboard/DeleteConfirmModal";
import { useGradients } from "../../components/dashboard/gradients";
import { Course, CourseType } from "../../components/dashboard/types";
import { useTheme } from "../../context/ThemeContext";


export default function DashboardScreen() {

  const toUIType = (t: ApiCourse["course_type"]) => (t[0].toUpperCase() + t.slice(1)) as CourseType;
const apiToUI = (c: ApiCourse): Course => ({
  id: c.course_id,
  name: c.course_title,
  description: c.course_description ?? undefined,
  type: toUIType(c.course_type),
  active: true,
  gradient: pickRandomGradient(),
});

  const { gradientsByType, pickRandomGradient } = useGradients();
  const { colors } = useTheme();
  const dashboard = (colors as any).dashboardColors;
  const [courses, setCourses] = useState<Course[]>([]);
  type AddCoursePayload = /*unresolved*/ any
  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  // Delete modal
  const [delOpen, setDelOpen] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const countOf = (t: CourseType) => courses.filter((c) => c.type === t).length;
  const openAdd = () => setAddOpen(true);
  const { isDesktop } = useBreakpoint();
  const columns = isDesktop ? 2 : 1;

  useEffect(() => {
    (async () => {
      try {
        const rows = await apiFetchCourses();
        setCourses(rows.map(apiToUI));
      } catch (e: any) {
        console.warn("load courses failed:", e?.message);
      }
    })();
  }, []);

  const handleAdd = async ({ name, type, active, description }: AddCoursePayload) => {
    const n = countOf(type) + 1;
    const finalName = (name ?? "").trim() || `${type} ${n}`;
    try {
      const created = await apiCreateCourse({ title: finalName, description, type });
      const ui = apiToUI(created);
      ui.active = active;
      ui.gradient = pickRandomGradient();
      setCourses(prev => [ui, ...prev]);
      setAddOpen(false);
    } catch (e: any) {
      console.warn("create failed:", e?.message);
    }
  };
  
  const toggleCourse = (id: string) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  const askDelete = (id: string) => {
    setDelId(id);
    setDelOpen(true);
  };

  const confirmDelete = () => {
    if (!delId) return;
  
    void (async () => {
      try {
        await apiDeleteCourse(delId);                      
        setCourses(prev => prev.filter(c => c.id !== delId)); 
      } catch (e: any) {
        console.warn("delete failed:", e?.message);
      } finally {
        setDelId(null);
        setDelOpen(false); 
      }
    })();
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: dashboard.screenBg }}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerRow}>
        <View>
          <Text style={{ flex: 1, backgroundColor: dashboard.screenBg }}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: dashboard.header.subtitle }]}>Welcome, Claudia Alves!</Text>
        </View>
        <Pressable onPress={openAdd} style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}>
          <LinearGradient  colors={dashboard.addBtn.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.addBtnBg}>
          <Text style={[styles.addBtnText, { color: dashboard.addBtn.text }]}>Add Course</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <FlatList
        key={`cols-${columns}`}                
        data={courses}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        columnWrapperStyle={columns > 1 ? { gap: 16 } : undefined} 
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onToggle={() => toggleCourse(item.id)}
            onDelete={() => askDelete(item.id)}
          />
        )}
      />

      <AddCourseModal visible={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
      <DeleteConfirmModal
        visible={delOpen}
        courseName={courses.find((c) => c.id === delId)?.name}
        onCancel={() => setDelOpen(false)}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 
  headerRow: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  subtitle: { fontSize: 14, marginTop: 4 },
  addBtn: { borderRadius: 14, overflow: "hidden" },
  addBtnBg: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  addBtnText: {  fontWeight: "700", fontSize: 14 },
});
