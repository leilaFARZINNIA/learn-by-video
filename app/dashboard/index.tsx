// app/(dashboard)/index.tsx  ← مسیر خودت را بگذار
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

import AddCourseModal from "@/components/dashboard/AddCourseModal";
import CourseCard from "@/components/dashboard/CourseCard";
import DeleteConfirmModal from "@/components/dashboard/DeleteConfirmModal";
import { useGradients } from "@/components/dashboard/gradients";
import { useTheme } from "@/context/ThemeContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";

import type { ApiCourse } from "@/api/course-api";
import {
  createCourse as apiCreateCourse,
  deleteCourse as apiDeleteCourse,
  fetchCourses as apiFetchCourses,
  updateCourse as apiUpdateCourse,
} from "@/api/course-api";

import type { Course, CourseType } from "@/components/dashboard/types";

export default function DashboardScreen() {
  const { isDesktop } = useBreakpoint();
  const columns = isDesktop ? 2 : 1;

  const { colors } = useTheme();
  const dashboard = (colors as any).dashboardColors;

  const { pickRandomGradient } = useGradients();

  const toUIType = (t: ApiCourse["course_type"]) =>
    (t[0].toUpperCase() + t.slice(1)) as CourseType; // "video"→"Video"

  const apiToUI = (c: ApiCourse): Course => ({
    id: c.course_id,
    name: c.course_title,
    description: c.course_description ?? undefined,
    type: toUIType(c.course_type),
    active: c.active,                
    gradient: pickRandomGradient(),
  });

  const [courses, setCourses] = useState<Course[]>([]);

  type AddCoursePayload = {
    name?: string;
    type: CourseType;
    description?: string;
    active?: boolean;
  };

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);

  const countOf = (t: CourseType) => courses.filter((c) => c.type === t).length;

  useEffect(() => {
    (async () => {
      try {
        // داشبورد خصوصی (لیست دوره‌های خود کاربر)
        const rows = await apiFetchCourses(); // اگر تابع پارامتر public دارد، اینجا public=false بفرست
        setCourses(rows.map(apiToUI));
      } catch (e: any) {
        console.warn("load courses failed:", e?.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async ({ name, type, active, description }: AddCoursePayload) => {
    const n = countOf(type) + 1;
    const finalName = (name ?? "").trim() || `${type} ${n}`;

    try {
   
      const created = await apiCreateCourse({
        title: finalName,
        description,
        type, 
      });

      let ui = apiToUI(created);

    
      if (active && !ui.active) {
        try {
          const updated = await apiUpdateCourse(ui.id, { active: true });
          ui = apiToUI(updated);
        } catch (e: any) {
          console.warn("activate-after-create failed:", e?.message);
        }
      }

      // prepend
      setCourses((prev) => [ui, ...prev]);
      setAddOpen(false);
    } catch (e: any) {
      console.warn("create failed:", e?.message);
    }
  };

  const toggleCourse = async (id: string) => {
   
    const current = courses.find((c) => c.id === id)?.active ?? false;
    const next = !current;

   
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, active: next } : c)));

    try {
      await apiUpdateCourse(id, { active: next });
     
    } catch (e: any) {
      console.warn("toggle failed, reverting:", e?.message);
     
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, active: current } : c)));
    }
  };

  const openAdd = () => setAddOpen(true);

  const askDelete = (id: string) => {
    setDelId(id);
    setDelOpen(true);
  };

  const confirmDelete = () => {
    if (!delId) return;

    void (async () => {
      try {
        await apiDeleteCourse(delId);
        setCourses((prev) => prev.filter((c) => c.id !== delId));
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
          <Text style={{ fontSize: 22, fontWeight: "800", color: dashboard.header.title }}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: dashboard.header.subtitle }]}>
            
            Welcome!
          </Text>
        </View>

        <Pressable onPress={openAdd} style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}>
          <LinearGradient
            colors={dashboard.addBtn.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addBtnBg}
          >
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
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: { fontSize: 14, marginTop: 4 },
  addBtn: { borderRadius: 14, overflow: "hidden" },
  addBtnBg: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  addBtnText: { fontWeight: "700", fontSize: 14 },
});
