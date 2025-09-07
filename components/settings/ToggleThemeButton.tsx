import { useTheme } from "@/context/ThemeContext";

import { useResponsive } from "@/theme/settings/responsive";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

const ToggleThemeButton = ({ style }: { style?: ViewStyle }) => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const color = (colors as any).settings;
  const { isMobile } = useResponsive();

  const progress = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;



  const { pick } = useResponsive();
  const W  = pick(56, 64, 72);
  const H  = pick(28, 32, 36);
  const P  = 3;
  const TH = H - P * 2;

  



  useEffect(() => {
    Animated.timing(progress, {
      toValue: isDarkMode ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const trackBg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [color.toggleTrackOff, color.toggleTrackOn],
  });

  const trackBorder = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [color.toggleBorder, color.toggleBorder],
  });

  const thumbX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [P, W - TH - P],
  });

  const thumbBg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [color.toggleThumb, color.toggleThumb],
  });

  return (
    <TouchableOpacity
      accessibilityRole="switch"
      accessibilityState={{ checked: isDarkMode }}
      onPress={toggleTheme}
      activeOpacity={0.9}
      style={style}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: W,
            height: H,
            borderRadius: H,
            backgroundColor: trackBg,
            borderColor: trackBorder,
          },
          { shadowColor: color.cardShadow },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: TH,
              height: TH,
              borderRadius: TH / 2,
              left: thumbX,
              backgroundColor: thumbBg,
              shadowColor: color.toggleShadow,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ToggleThemeButton;

const styles = StyleSheet.create({
  track: {
    borderWidth: 1,
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  thumb: {
    position: "absolute",
    top: 3,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
