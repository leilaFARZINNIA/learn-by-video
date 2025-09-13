import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ColorValue, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useGradients } from "../../components/dashboard/gradients";
import { useTheme } from "../../context/ThemeContext";
import type { Course } from "./types";


function useBlockablePress(onPress?: () => void) {
  const blockedRef = useRef(false);

  const blockNextPress = useCallback(() => {
    blockedRef.current = true;
  }, []);

  const handlePress = useCallback(() => {
    if (blockedRef.current) {
      blockedRef.current = false; 
      return;
    }
    onPress?.();
  }, [onPress]);

  return { handlePress, blockNextPress };
}

type Props = {
  course: Course;
  onToggle: () => void;
  onDelete: () => void;
};

export default function CourseCard({ course, onToggle, onDelete }: Props) {
  const { gradientsByType } = useGradients();
  const gradient = course.gradient || gradientsByType[course.type];
  const statusLabel = course.active ? "Published" : "Unpublished";
  const actionLabel = course.active ? "Unpublish" : "Publish";

  const { colors: themeColors } = useTheme();
  const dashboard = (themeColors as any).dashboardColors;

  const goDetail = () =>
    router.push({
      pathname: "/dashboard/[id]",
      params: { id: course.id, name: course.name, type: course.type },
    });

 
  const { handlePress, blockNextPress } = useBlockablePress(goDetail);

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      <LinearGradient
        colors={gradient as [ColorValue, ColorValue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { shadowColor: dashboard.card.shadow }]}
      >
        <Text style={[styles.cardTitle, { color: dashboard.card.title }]}>{course.name}</Text>

        
        <Pressable
          style={[styles.deleteBtn, { backgroundColor: dashboard.card.deleteBg }]}
          hitSlop={10}
          onPress={() => {
            blockNextPress();
            onDelete();
          }}
          onPressIn={blockNextPress}
        >
          <Text style={[styles.deleteText, { color: dashboard.card.deleteText }]}>Delete</Text>
        </Pressable>

        {course.description ? (
          <Text style={[styles.cardHint, { color: dashboard.card.hint }]} numberOfLines={2}>
            {course.description}
          </Text>
        ) : (
          <Text style={[styles.cardHint, { color: dashboard.card.hint }]} numberOfLines={1}>
            {course.type}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View>
            <Text style={[styles.cardAction, { color: dashboard.card.action }]}>{actionLabel}</Text>
            <Text style={[styles.cardStatus, { color: dashboard.card.status }]}>{statusLabel}</Text>
          </View>

        
          <View
            onStartShouldSetResponder={() => {
              blockNextPress();
              return true;
            }}
            onMoveShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
          >
            <Switch
              value={course.active}
              onValueChange={() => {
                blockNextPress();
                onToggle();
              }}
             
              // @ts-ignore
              onClick={(e) => {
                if (e?.stopPropagation) e.stopPropagation();
                blockNextPress();
              }}
            />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    borderRadius: 16,
    padding: 16,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, paddingRight: 60 },
  cardHint: { opacity: 0.85, fontSize: 13 },
  cardFooter: { marginTop: "auto", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardAction: { fontWeight: "700", fontSize: 14 },
  cardStatus: { opacity: 0.85, fontSize: 12, marginTop: 2 },
  deleteBtn: { position: "absolute", top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  deleteText: { fontSize: 12, fontWeight: "700" },
});
