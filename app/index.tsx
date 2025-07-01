import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AnimatedSideMenu from '../components/AnimatedSideMenu';
import HeaderIcons from '../components/HeaderIcons';
import MenuButton from '../components/MenuButton';
import ToggleThemeButton from '../components/ToggleThemeButton';
import { useResponsive } from '../constants/responsive';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const {
    logoSize,
    fontSize,
    iconSize,
    labelFontSize,
    middleFontSize,
    gap,
  } = useResponsive();

  const [menuOpen, setMenuOpen] = useState(false);

  // Animated Value for drawer animation
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: menuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const buttons = [
    { id: '1', label: 'DEUTSCHER FILM', icon: require('../assets/images/german-film.png') },
    { id: '2', label: 'ENGLISH FILM', icon: require('../assets/images/english-film.png') },
    { id: '3', label: 'DEUTSCHER PODCAST', icon: require('../assets/images/german_microphone.png') },
    { id: '4', label: 'ENGLISH PODCAST', icon: require('../assets/images/english_microphone.png') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Side Menu with animation */}
      <AnimatedSideMenu animatedValue={animatedValue} onClose={() => setMenuOpen(false)} />

      {/* Header icons */}
      <HeaderIcons
        onMenuPress={() => setMenuOpen(true)}
        rightElement={<ToggleThemeButton />}
      />

      {/* Logo and Title */}
      <View style={[styles.topSection, { backgroundColor: colors.topSectionBg }]}>
        <View style={[styles.rowContainer, { gap }]}>
          <Image
            source={require('../assets/images/logo_LearnbyVideo.png')}
            style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
          />
          <View style={styles.textBlock}>
            <Text style={[styles.titleText, { fontSize }]}>LEARN</Text>
            <Text style={[styles.titleText, { fontSize }]}>BY VIDEO</Text>
          </View>
        </View>
      </View>

      {/* Middle Text */}
      <View style={[styles.middleSection, { backgroundColor: colors.middleSectionBg }]}>
        <Text style={[styles.middleText, { fontSize: middleFontSize, color: colors.textSecondary }]}>
          Choose your favorite way to learn.
        </Text>
      </View>

      {/* Bottom Buttons Grid */}
      <View style={[styles.bottomSection, { backgroundColor: colors.bottomSectionBg }]}>
        <View style={styles.grid}>
          {buttons.map((btn) => (
            <MenuButton
              key={btn.id}
              icon={btn.icon}
              label={btn.label}
              iconSize={iconSize}
              fontSize={labelFontSize}
              color={colors.textPrimary}
              onPress={() => console.log(btn.label)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { flex: 3, justifyContent: 'center', alignItems: 'center' },
  rowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  textBlock: { justifyContent: 'center' },
  titleText: {
    fontFamily: 'RubikOne',
    color: 'rgba(151, 241, 255, 0.92)',
    textAlign: 'left',
    textShadowColor: '#000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
  middleSection: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1,
  },
  middleText: {
    textAlign: 'center',
    fontFamily: 'Inter',
    paddingHorizontal: 16,
  },
  bottomSection: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
