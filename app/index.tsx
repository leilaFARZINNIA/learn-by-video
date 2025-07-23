import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View
} from 'react-native';
import HeaderIcons from '../components/home/HeaderIcons';
import SvgComponent from '../components/home/LogoLearnByVideo';
import MenuButton from '../components/home/MenuButton';
import ToggleThemeButton from '../components/home/ToggleThemeButton';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../theme/home/responsive';




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
  const router = useRouter();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: menuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const buttons = [
    { id: '1', label: 'DEUTSCHER FILM', icon: 'movie-open-play', iconColor: '#ff9800'}, 
    { id: '2', label: 'ENGLISH FILM', icon: 'movie-open-play', iconColor: '#e91e63' },   
    { id: '3', label: 'DEUTSCHER PODCAST', icon: 'google-podcast', iconColor: '#283593' },
    { id: '4', label: 'ENGLISH PODCAST', icon: 'google-podcast', iconColor: '#009688' }, 
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <HeaderIcons
       
        rightElement={<ToggleThemeButton />}
      />
      <View style={[styles.topSection, { backgroundColor: colors.topSectionBg }]}>
        <View style={[styles.rowContainer, { gap }]}>
        <SvgComponent width={logoSize} height={logoSize} />

          <View style={styles.textBlock}>
            <Text style={[styles.titleText, { fontSize }]}>LEARN</Text>
            <Text style={[styles.titleText, { fontSize }]}>BY VIDEO</Text>
          </View>
        </View>
      </View>
      <View style={[styles.middleSection, { backgroundColor: colors.middleSectionBg }]}>
        <Text style={[styles.middleText, { fontSize: middleFontSize, color: colors.textSecondary }]}>
          Choose your favorite way to learn.
        </Text>
      </View>
      <View style={[styles.bottomSection, { backgroundColor: colors.bottomSectionBg }]}>
        <View style={styles.grid}>
          {buttons.map((btn) => (
            <MenuButton
              key={btn.id}
              icon={
                <MaterialCommunityIcons
                  name={btn.icon as any}
                  size={iconSize}
                  color={btn.iconColor}
                />
              }
              label={btn.label}
              iconSize={iconSize}
              fontSize={labelFontSize}
              color={colors.textPrimary}
              onPress={() => {
                if (btn.id === '1') router.push('/deutscher-film');
               
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column' },
  topSection: { flex: 3, justifyContent: 'center', alignItems: 'center',},
  rowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  textBlock: { justifyContent: 'center' },
  titleText: {
    fontFamily: 'Caprasimo',
    
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
    fontFamily: 'PatrickHand',
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
