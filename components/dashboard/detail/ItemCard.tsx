import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import type { LessonItem } from "../types";
import { useDashboardStyles } from "./styles";

export default function ItemCard({
  item, onEdit, onDelete,
}: { item: LessonItem; onEdit: (it: LessonItem) => void; onDelete: (id: string) => void }) {
  const { colors } = useTheme();
  const itemColors = (colors as any).dashboarddetail.itemCard;
  const s = useDashboardStyles();

  return (
    <View style={s.card}>
      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle}>{item.title}</Text>
        <Text style={s.cardMeta}>
          {item.kind.toUpperCase()} • {item.fileName ?? "Unnamed file"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity onPress={() => onEdit(item)} style={s.editBtn}>
          <MaterialCommunityIcons name="pencil" size={18} color={itemColors.editIcon} />
          <Text style={s.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={s.deleteBtn}>
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={itemColors.deleteIcon} />
          <Text style={s.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
