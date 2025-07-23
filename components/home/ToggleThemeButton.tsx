import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../theme/home/responsive';


const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();

  const animation = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  const switchWidth = isMobile ? 48 : 60;
  const switchHeight = isMobile ? 24 : 30;
  const thumbSize = isMobile ? 18 : 24;
  const iconSize = isMobile ? 14 : 18;
  const padding = 3;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const thumbPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [padding, switchWidth - thumbSize - padding],
  });

  const switchBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ddd', '#444'],
  });

  const thumbColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#222'],
  });

  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Animated.View
        style={[
          styles.switchBackground,
          {
            width: switchWidth,
            height: switchHeight,
            borderRadius: switchHeight,
            backgroundColor: switchBackgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              left: thumbPosition,
              backgroundColor: thumbColor,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={isDarkMode ? "moon-waning-crescent" : "white-balance-sunny"}
            size={iconSize}
            color={isDarkMode ? "#fff" : "#ffb300"}
          />

        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ToggleThemeButton;

const styles = StyleSheet.create({
  switchBackground: {
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
