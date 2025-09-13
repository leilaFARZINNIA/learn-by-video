import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import type { LessonItem } from "../types";
import { useDashboardStyles } from "./styles";

export default function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: LessonItem;
  onEdit: (it: LessonItem) => void;
  onDelete: (id: string) => void;
}) {
  const { colors } = useTheme();
  const itemColors = (colors as any).dashboarddetail.itemCard;
  const s = useDashboardStyles();

  const iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    item.kind === "video" ? "movie-open" : item.kind === "audio" ? "music-note" : "file-document-outline";
  const kindLabel = item.kind === "video" ? "VIDEO" : item.kind === "audio" ? "AUDIO" : "TEXT";

  const hasTranscript = item.kind !== "text" && (!!item.transcriptText || !!item.transcriptVttUri);
  const textPreview =
    item.kind === "text" && item.contentMd ? item.contentMd.replace(/\s+/g, " ").trim() : "";

  return (
    <View style={s.card}>
      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle}>{item.title}</Text>

        {/* Meta row */}
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <MaterialCommunityIcons
            name={iconName}
            size={16}
            color={itemColors.metaIcon ?? itemColors.editIcon}
          />
          <Text style={s.cardMeta}>{kindLabel}</Text>

          {item.kind !== "text" && (
            <Text style={s.cardMeta}> • {item.fileName ?? "File selected"}</Text>
          )}

          {hasTranscript && (
            <View
              style={{
                marginLeft: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: itemColors.badgeBg ?? "#eef1f6",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <MaterialCommunityIcons
                  name="subtitles-outline"
                  size={14}
                  color={itemColors.badgeText ?? itemColors.deleteIcon}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: itemColors.badgeText ?? itemColors.deleteIcon,
                  }}
                >
                  Transcript
                </Text>
              </View>
            </View>
          )}
        </View>

        {item.kind === "text" && !!textPreview && (
          <Text style={[s.cardMeta, { marginTop: 4 }]} numberOfLines={2}>
            {textPreview}
          </Text>
        )}
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
