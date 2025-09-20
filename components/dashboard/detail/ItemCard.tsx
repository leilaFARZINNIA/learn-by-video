import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ellipsizeSmart } from "../../../utils/ellipsize";
import type { LessonItem } from "../types";
import { useDashboardStyles } from "./styles";

type Props = {
  item: LessonItem;
  onEdit: (it: LessonItem) => void;
  onDelete: (id: string) => void;
};

export default function ItemCard({ item, onEdit, onDelete }: Props) {
  const { colors } = useTheme();
  const itemColors = (colors as any).dashboarddetail.itemCard;
  const s = useDashboardStyles();
  const { isDesktop, isPhone } = useBreakpoint();

  const iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    item.kind === "video" ? "movie-open"
    : item.kind === "audio" ? "music-note"
    : "file-document-outline";

  const kindLabel = item.kind === "video" ? "VIDEO" : item.kind === "audio" ? "AUDIO" : "TEXT";

  const hasTranscript =
    item.kind !== "text" && (!!item.transcriptText || !!item.transcriptVttUri);

  const textPreview =
    item.kind === "text" && item.contentMd ? item.contentMd.replace(/\s+/g, " ").trim() : "";


  const titleShort = ellipsizeSmart(item.title, {
    maxWords: 2,
    maxChars: isDesktop ? 28 : 16,
  });

  const fileNameShort = ellipsizeSmart(item.fileName ?? "File selected", {
    maxWords: 2,
    maxChars: isDesktop ? 24 : 14,
  });

  const previewShort = ellipsizeSmart(textPreview, {
    maxWords: isDesktop ? 8 : 6,
    maxChars: isDesktop ? 60 : 36,
  });

  return (
    <View style={[s.card, { alignItems: "center" }]}>
      
      <View style={{ flex: 1, minWidth: 0 }}>
       
        <Text
          style={[
            s.cardTitle,
            { fontSize: isPhone ? 15 : 16, lineHeight: isPhone ? 20 : 22 },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityLabel={item.title}
        >
          {titleShort}
        </Text>

        {/* Meta row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 6,
            minWidth: 0,
          }}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={16}
            color={itemColors.metaIcon ?? itemColors.editIcon}
          />
          <Text style={[s.cardMeta, { fontSize: 12 }]}>{kindLabel}</Text>

          {item.kind !== "text" && (
            <View
              style={{
                flexShrink: 1,
                minWidth: 0,
                maxWidth: isDesktop ? "60%" : "45%",
              }}
            >
              <Text
                style={[s.cardMeta, { fontSize: 12 }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                accessibilityLabel={item.fileName ?? undefined}
              >
                {" • "}{fileNameShort}
              </Text>
            </View>
          )}

          {hasTranscript && (
            <View
              style={{
                marginLeft: 6,
                paddingHorizontal: 8,
                paddingVertical: Platform.OS === "web" ? 2 : 3,
                borderRadius: 8,
                backgroundColor: itemColors.hasTranscriptBg,
            
                flexShrink: 0, 

              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <MaterialCommunityIcons
                  name="subtitles-outline"
                  size={14}
                  color={itemColors.hasTranscriptText}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: itemColors.hasTranscriptText,
                  }}
                >
                  Transcript
                </Text>
              </View>
            </View>
          )}
        </View>

       
        {item.kind === "text" && !!textPreview && (
          <Text
            style={[s.cardMeta, { marginTop: 4, fontSize: 12 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityLabel={textPreview}
          >
            {previewShort}
          </Text>
        )}
      </View>

     
      <View
        style={{
          flexDirection: "row",
          gap: isPhone ? 6 : 8,
          flexShrink: 0,
          alignItems: "center",
          alignSelf: "flex-start", 
        }}
      >
        
        {isPhone ? (
          <>
            <TouchableOpacity onPress={() => onEdit(item)} style={s.editBtn}>
              <MaterialCommunityIcons name="pencil" size={18} color={itemColors.editIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={s.deleteBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={itemColors.deleteIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => onEdit(item)} style={s.editBtn}>
              <MaterialCommunityIcons name="pencil" size={18} color={itemColors.editIcon} />
              <Text style={s.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={s.deleteBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={itemColors.deleteIcon} />
              <Text style={s.deleteText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
