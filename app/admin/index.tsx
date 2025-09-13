// app/admin/index.tsx
import AdminMessages from "@/components/admin/AdminMessages";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { ScrollView } from "react-native";

export default function AdminScreen() {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: admin.bg }} keyboardShouldPersistTaps="handled">
      <AdminMessages />
    </ScrollView>
  );
}
