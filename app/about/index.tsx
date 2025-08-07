import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BannerBox from '../../components/about/BannerBox';
import InfoSection from '../../components/about/InfoSection';
import TopMenu from '../../components/about/TopMenu';
import { useTheme } from '../../context/ThemeContext';
import { SCREEN_HEIGHT } from '../../theme/about/responsive';

export default function AboutStandard() {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.aboutBg }}>
      <View style={[styles.container, { backgroundColor: colors.aboutBg }]}>
        <TopMenu />
        <BannerBox />
        <InfoSection />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
    alignItems: 'center',
    width: '100%',
  },
});
