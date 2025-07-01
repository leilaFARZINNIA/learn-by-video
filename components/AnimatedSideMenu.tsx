import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useResponsive } from '../constants/responsive';
import { useTheme } from '../context/ThemeContext';

interface Props {
  animatedValue: Animated.Value;
  onClose: () => void;
}

export default function AnimatedSideMenu({ animatedValue, onClose }: Props) {
  const { colors } = useTheme();
  const {
    isMobile,
    iconSize,
    middleFontSize: fontSize,
    gap: spacing,
  } = useResponsive();

  const menuWidth = isMobile ? 280 : 340;

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-menuWidth, 0],
  });

  const menuItems = [
    { label: 'Home', icon: 'home-outline' },
    { label: 'About', icon: 'information-circle-outline' },
    { label: 'Contact', icon: 'call-outline' },
    { label: 'Settings', icon: 'settings-outline' },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.topSectionBg,
          width: menuWidth,
          transform: [{ translateX }],
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        },
      ]}
    >
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={iconSize - 10} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={[styles.menuItems, { gap: spacing }]}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => console.log(item.label)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: spacing,
              paddingHorizontal: spacing + 4,
              backgroundColor: colors.middleSectionBg,
              borderRadius: 12,
            }}
          >
            <Ionicons name={item.icon} size={iconSize - 6} color={colors.textPrimary} style={{ marginRight: spacing }} />
            <Text style={{ fontSize, color: colors.textPrimary, fontFamily: 'Inter' }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    paddingTop: 60,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    zIndex: 10,
  },
  menuItems: {
    marginTop: 50,
  },
});
