// src/components/login/ProviderTabs.tsx
import * as Haptics from "expo-haptics";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export type ProviderTab = "google" | "email";

type Props = {
  
  active: ProviderTab;
  onChange: (tab: ProviderTab) => void;
  testID?: string;
};

const TABS: ProviderTab[] = ["google", "email"];
const PAD = 4; // padding داخلی ریل

function ProviderTabs({ active, onChange, testID }: Props) {
  const { colors } = useTheme();
  const login = (colors as any).login;

  // عرض واقعی هر تب را نگه می‌داریم
  const [widths, setWidths] = useState<number[]>([0, 0]);
  const setWidthAt = (i: number, w: number) =>
    setWidths((prev) => (prev[i] === w ? prev : prev.map((x, idx) => (idx === i ? w : x))));

 
  const activeIdx = useMemo(() => TABS.indexOf(active), [active]);


  const idxAnim = useRef(new Animated.Value(activeIdx)).current;
  useEffect(() => {
    Animated.timing(idxAnim, {
      toValue: activeIdx,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true, 
    }).start();
  }, [activeIdx, idxAnim]);

  const offsets = useMemo<number[]>(
    () => [PAD, PAD + (widths[0] || 0)],
    [widths[0]]
  );

 
  const translateX =
    widths.every((w) => w > 0)
      ? idxAnim.interpolate({
          inputRange: [0, 1],
          outputRange: offsets,
        })
      : 0;

  const handlePress = (tab: ProviderTab) => {
    if (tab === active) return;
    Haptics.selectionAsync().catch(() => {});
    onChange(tab);
  };


  const indicatorW = Math.max(0, (widths[activeIdx] || 0) - PAD * 2);

  return (
    <View
      testID={testID}
      accessibilityRole="tablist"
      accessibilityLabel="Choose sign-in method"
      style={[
        styles.wrap,
        { backgroundColor: login.segmentBg, borderColor: login.border },
      ]}
      {...(Platform.OS === "web" ? { tabIndex: 0 as any } : {})}
    >
     
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            width: indicatorW,
            backgroundColor: login.segmentActiveBg,
            transform: widths.every((w) => w > 0) ? [{ translateX }] : undefined,
          },
        ]}
      />

      {TABS.map((tab, i) => {
        const selected = tab === active;
        return (
          <Pressable
            key={tab}
            onLayout={(e) => setWidthAt(i, e.nativeEvent.layout.width)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab === "google" ? "Google sign-in" : "Email sign-in"}
            accessibilityHint="Switch sign-in method"
            onPress={() => handlePress(tab)}
            android_ripple={{ color: login.ripple ?? "rgba(0,0,0,0.06)" }}
            style={({ pressed }) => [
              styles.tab,
              pressed && { transform: [{ scale: 0.98 }] },
              Platform.OS === "web" && { cursor: "pointer" },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: selected ? login.text : login.textMuted },
              ]}
              numberOfLines={1}
            >
              {tab === "google" ? "Google" : "Email"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 999,
    padding: PAD,
    borderWidth: 1,
    overflow: "hidden", 
  },
  indicator: {
    position: "absolute",
    top: PAD,
    bottom: PAD,
    left: PAD,
    borderRadius: 999,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14, 
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: { fontWeight: "800" },
});

export default memo(ProviderTabs);
