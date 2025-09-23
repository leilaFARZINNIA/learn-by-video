import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  ColorValue,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useGradients } from "../../components/dashboard/gradients";
import { useTheme } from "../../context/ThemeContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ellipsizeSmart } from "../../utils/ellipsize";
import type { Course } from "./types";

/* ---------- utils ---------- */
function useBlockablePress(onPress?: () => void) {
  const blockedRef = useRef(false);
  const blockNextPress = useCallback(() => { blockedRef.current = true; }, []);
  const handlePress = useCallback(() => {
    if (blockedRef.current) { blockedRef.current = false; return; }
    onPress?.();
  }, [onPress]);
  return { handlePress, blockNextPress };
}

type Props = {
  course: Course;
  onToggle: () => void;
  onDelete: () => void;
};

/* ---------- component ---------- */
export default function CourseCard({ course, onToggle, onDelete }: Props) {
  const { gradientsByType } = useGradients();
  const gradient = (course.gradient || gradientsByType[course.type]) as [ColorValue, ColorValue];
  const { colors: themeColors } = useTheme();
  const dashboard = (themeColors as any).dashboardColors;
  const { isPhone, isDesktop } = useBreakpoint();
  const goDetail = () =>
    router.push({ pathname: "/dashboard/[id]", params: { id: course.id, name: course.name, type: course.type } });
  const { handlePress, blockNextPress } = useBlockablePress(goDetail);
  const titleText = (course.name ?? "").trim(); 
  const descShort = ellipsizeSmart(course.description ?? "", {
    maxWords: isDesktop ? 20 : 12,
    maxChars: isDesktop ? 160 : 90,
  });
  
  const published = course.active;

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            shadowColor: dashboard.card.shadow,
            padding: isPhone ? 12 : 16,
            minHeight: isPhone ? 108 : 140,
            borderRadius: isPhone ? 14 : 16,
          },
        ]}
      >
      
      {isPhone ? (
  <>
    <View style={styles.headerRow}>
      <View style={{ flex: 1, minWidth: 0 }}>
      <Text
  style={[
    styles.cardTitle,
    {
      color: dashboard.card.title,
      fontSize: 16,
      lineHeight: 20,
      paddingRight: 56, 
      ...(Platform.OS === "web" ? ({ wordBreak: "break-word" } as any) : null),
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {titleText}
        </Text>


      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
       
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete course"
          style={[styles.iconBtn, { backgroundColor: "rgba(0,0,0,0.08)" }]}
          hitSlop={8}
          onPress={(e) => { (e as any)?.stopPropagation?.(); blockNextPress(); onDelete(); }}
          onPressIn={blockNextPress}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18}style={[ { color: dashboard.card.deleteText }]} />
        </Pressable>
       
        <Switch
          value={published}
          onValueChange={() => { blockNextPress(); onToggle(); }}
          ios_backgroundColor="rgba(0,0,0,0.15)"
          trackColor={{ false: "rgba(0,0,0,0.15)", true: "rgba(16,185,129,0.55)" }}
          thumbColor={published ? "#10b981" : "#f4f4f5"}
          style={{ transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }] }}
          // @ts-ignore (RN Web)
          onClick={(e) => { (e as any)?.stopPropagation?.(); blockNextPress(); }}
        />
      </View>
    </View>
   
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
      <Badge text={course.type} />
    </View>

    {!!course.description && (
      <Text style={[styles.cardHint, { color: dashboard.card.hint, fontSize: 12 }]} numberOfLines={1} ellipsizeMode="tail">
        {descShort}
      </Text>
    )}
  </>
        ) : (
        
          <>
            <View style={styles.headerRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
              <Text
  style={[
    styles.cardTitle,
    {
      color: dashboard.card.title,
      fontSize: 18,
      lineHeight: 24,
      paddingRight: 88, 
                ...(Platform.OS === "web" ? ({ wordBreak: "break-word" } as any) : null),
              },
            ]}
            numberOfLines={2}      // 👈 دسکتاپ دو خطه
            ellipsizeMode="tail"
          >
            {titleText}
          </Text>

              </View>
              <Pressable
                style={[styles.deleteBtn, { backgroundColor: dashboard.card.deleteBg }]}
                hitSlop={10}
                onPress={(e) => { (e as any)?.stopPropagation?.(); blockNextPress(); onDelete(); }}
                onPressIn={blockNextPress}
              >
                <Text style={[styles.deleteText, { color: dashboard.card.deleteText }]}>Delete</Text>
              </Pressable>
            </View>

            {!!course.description && (
              <Text
                style={[styles.cardHint, { color: dashboard.card.hint, fontSize: 13 }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {descShort}
              </Text>
            )}

            <View style={styles.footerRow}>
              <View style={styles.badgeRow}>
                <Badge text={course.type} />
                <Badge text={published ? "Published" : "Unpublished"} tone={published ? "success" : "neutral"} />
              </View>

              <View
                onStartShouldSetResponder={() => { blockNextPress(); return true; }}
                onMoveShouldSetResponder={() => true}
                onResponderTerminationRequest={() => false}
              >
                <Switch
                  value={published}
                  onValueChange={() => { blockNextPress(); onToggle(); }}
                  // @ts-ignore RN Web
                  onClick={(e) => { (e as any)?.stopPropagation?.(); blockNextPress(); }}
                />
              </View>
            </View>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

/* ---------- Badge ---------- */
function Badge({ text, tone = "neutral" }: { text: string; tone?: "neutral" | "success" | "danger" }) {
  const bg =
    tone === "success" ? "rgba(211, 226, 216, 0.43)" :
    tone === "danger"  ? "rgba(239,68,68,0.18)"  :
                         "rgba(0,0,0,0.12)";
  const fg =
    tone === "success" ? "#065f46" :
    tone === "danger"  ? "#7f1d1d"  :
                         "rgba(0,0,0,0.75)";
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: bg }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: fg }}>{text}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  cardTitle: { fontWeight: "700" },
  cardHint: { opacity: 0.9 },
  footerRow: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1, minWidth: 0 },
  deleteBtn: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  deleteText: { fontSize: 12, fontWeight: "700" },
  iconBtn: { borderRadius: 8, width: 28, height: 28, alignItems: "center", justifyContent: "center" },
});
