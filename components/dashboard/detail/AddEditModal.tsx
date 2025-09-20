import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ellipsizeSmart } from "../../../utils/ellipsize";
import type { CourseType, ItemKind, LessonItem } from "../types";
import { ALLOWED, isAllowed, isMediaType, MAX_SIZE_BYTES } from "./allowed";
import RichTextEditor from "./RichTextEditor";
import { useDashboardStyles } from "./styles";

type Mode = "add" | "edit";

type Props = {
  visible: boolean;
  mode: Mode;
  courseType: CourseType; // "Video" | "Podcast" | "Text"
  initial?: LessonItem | null;
  onClose: () => void;
  onSubmit: (item: LessonItem) => void;
};

export default function AddEditModal({
  visible,
  mode,
  courseType,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const s = useDashboardStyles();
  const { colors } = useTheme();
  const ui = (colors as any).dashboarddetail;
  const { isPhone, isDesktop } = useBreakpoint();

  const isMedia = courseType === "Video" || courseType === "Podcast";
  const kind: ItemKind =
    courseType === "Video" ? "video" : courseType === "Podcast" ? "audio" : "text";

  const [title, setTitle] = useState("");
  // media
  const [fileUri, setFileUri] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();
  // transcript
  const [tMode, setTMode] = useState<"none" | "file" | "text">("none");
  const [transcriptVttUri, setTranscriptVttUri] = useState<string | undefined>();
  const [transcriptText, setTranscriptText] = useState("");
  // text lesson
  const [contentMd, setContentMd] = useState("");

  useEffect(() => {
    if (!visible) return;
    setTitle(initial?.title ?? "");
    if (isMedia) {
      setFileUri(initial?.fileUri);
      setFileName(initial?.fileName ?? undefined);
      setTMode(
        initial?.transcriptText ? "text" : initial?.transcriptVttUri ? "file" : "none"
      );
      setTranscriptVttUri(initial?.transcriptVttUri);
      setTranscriptText(initial?.transcriptText ?? "");
      setContentMd("");
    } else {
      setContentMd(initial?.contentMd ?? "");
      setFileUri(undefined);
      setFileName(undefined);
      setTMode("none");
      setTranscriptVttUri(undefined);
      setTranscriptText("");
    }
  }, [visible, initial, isMedia]);

  const label = isMedia
    ? courseType === "Video"
      ? "Video file"
      : "Audio file"
    : "Content";
  const icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"] = isMedia
    ? courseType === "Video"
      ? "movie-open"
      : "music-note"
    : "file-document-outline";
  const choose = isMedia
    ? `Choose ${courseType === "Video" ? "video" : "audio"} file`
    : "Type or paste your text…";

     const acceptMainMimes = useMemo(() => {
         return courseType === "Video"
          ? ["video/*"]
          : ["audio/*", "video/mp4", "application/mp4"]; 
      }, [courseType]);

  const pickMainFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: acceptMainMimes });
    if (res.canceled || !res.assets?.length) return;
    const f = res.assets[0];

    if (!isMediaType(courseType)) return;

    const check = isAllowed(courseType, f);
    if (!check.ok) {
      const mb = Math.round(MAX_SIZE_BYTES / 1024 / 1024);
      let reason = "";
      if (!check.extOk) reason += `• Extension not allowed\n`;
      if (!check.mimeOk && f.mimeType) reason += `• MIME not allowed (${f.mimeType})\n`;
      if (!check.sizeOk) reason += `• File too large (> ${mb}MB)\n`;
      const allowedList = ALLOWED[courseType].exts.join(", ");
      Alert.alert(
        "Unsupported file",
        `Please upload a valid ${courseType.toLowerCase()} file.\nAllowed: ${allowedList}\n\n${reason.trim()}`
      );
      return;
    }

    setFileUri(f.uri);
    setFileName(f.name ?? "file");
  };

  const pickTranscriptFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["text/vtt", "application/x-subrip", "text/plain"],
    });
    if (res.canceled || !res.assets?.length) return;
    const f = res.assets[0];
    setTranscriptVttUri(f.uri);
  };

  const hasMeaningfulHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;

  const canSubmit =
    title.trim().length > 0 &&
    (isMedia
      ? !!fileUri &&
        (tMode === "none" ||
          (tMode === "file" ? !!transcriptVttUri : hasMeaningfulHtml(transcriptText)))
      : hasMeaningfulHtml(contentMd));

  const handleSubmit = () => {
    if (!canSubmit) return;
    const id = initial?.id ?? `${Date.now()}`;

    const item: LessonItem = isMedia
      ? {
          id,
          title: title.trim(),
          kind,
          fileUri: fileUri!,
          fileName: fileName ?? null,
          transcriptText: tMode === "text" ? transcriptText : undefined, // HTML
        }
      : {
          id,
          title: title.trim(),
          kind: "text",
          contentMd, // HTML
        };

    onSubmit(item);
  };

 
  const mainBtnLabel = ellipsizeSmart(fileName ?? choose, {
    maxWords: 3,
    maxChars: isDesktop ? 34 : 22,
  });
  const transcriptBtnLabel = ellipsizeSmart(
    transcriptVttUri ? "Transcript selected" : "Choose .srt/.vtt/.txt",
    { maxWords: 3, maxChars: isDesktop ? 34 : 22 }
  );

const allowedList = isMedia ? ALLOWED[courseType as "Video" | "Podcast"].exts.join(", ") : "";
const sizeMB = Math.round(MAX_SIZE_BYTES / (1024 * 1024));
const uploadHint = isMedia
  ? `${courseType} accepted: ${allowedList} · up to ${sizeMB}MB`   
  : "Type or paste your lesson content.";


  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>
            {mode === "edit" ? `Edit ${courseType}` : `Add ${courseType}`}
          </Text>

          {/* Title */}
          <Text style={s.label}>Title</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="name" style={s.input} />

          {/* Content */}
          <Text style={[s.label, { marginTop: 10 }]}>{label}</Text>

          {isMedia ? (
            <>
            <Pressable onPress={pickMainFile} style={s.pickBtn}>
              <MaterialCommunityIcons name={icon} size={18} color={ui.modal.iconPrimary} />
            
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={s.pickText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  accessibilityLabel={fileName ?? choose}
                >
                  {mainBtnLabel}
                </Text>
              </View>
            </Pressable>

           
                <Text
                style={{ marginTop: 6, fontSize: 12, color: ui.modal.textMuted ?? "#6b7280" }}
                numberOfLines={2}
                accessibilityLabel={uploadHint}
              >
                {uploadHint}
              </Text>
            </>
            ) : (

            
            
       
            <View
              style={{
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 0.5,
                borderColor: "#d0d4db",
              }}
            >
              <RichTextEditor value={contentMd} onChange={setContentMd} height={260} ltr />
            </View>
          )}

          {/* Transcript for media */}
          {isMedia && (
            <>
              <Text style={[s.label, { marginTop: 12 }]}>Transcript (optional)</Text>

              <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                {(["none", "text"] as const).map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setTMode(m)}
                    style={[
                      {
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        backgroundColor: "#eef1f6",
                      },
                      tMode === m && { backgroundColor: "#dfe6f7" },
                    ]}
                  >
                    <Text
                      style={[
                        { fontSize: 12, opacity: 0.9 },
                        tMode === m && { fontWeight: "700" },
                      ]}
                    >
                      {m.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {tMode === "file" && (
                <Pressable onPress={pickTranscriptFile} style={s.pickBtn}>
                  <MaterialCommunityIcons
                    name="subtitles-outline"
                    size={18}
                    color={ui.modal.iconPrimary}
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={s.pickText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      accessibilityLabel={
                        transcriptVttUri ? "Transcript selected" : "Choose .srt/.vtt/.txt"
                      }
                    >
                      {transcriptBtnLabel}
                    </Text>
                  </View>
                </Pressable>
              )}

              {tMode === "text" && (
                <View
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    borderWidth: 0.5,
                    borderColor: "#d0d4db",
                  }}
                >
                  <RichTextEditor
                    value={transcriptText}
                    onChange={setTranscriptText}
                    height={180}
                    placeholder="Type transcript…"
                    ltr
                  />
                </View>
              )}
            </>
          )}

          {/* Actions */}
          <View style={s.actions}>
            <Pressable style={[s.action, s.cancel]} onPress={onClose}>
              <Text style={{ fontWeight: "700", color: ui.modal.textPrimary }}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[s.action, !canSubmit ? s.disabled : s.primary]}
              disabled={!canSubmit}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: !canSubmit ? ui.modal.textMuted : ui.modal.textOnPrimary,
                }}
              >
                {mode === "edit" ? "Save" : "Add"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
