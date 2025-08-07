import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { isMobile } from '../../theme/about/responsive';

export default function BannerBox() {
  const { colors } = useTheme();


  const dynamic = {
    bannerBox: {
      backgroundColor: colors.bannerBg,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.19,
      shadowRadius: 36,
      elevation: 24,
    },
    circleBox: {
      backgroundColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.25,
      shadowRadius: 40,
      elevation: 28,
    },
    aboutText: {
      color: colors.white,
    },
    subtitle: {
      color: colors.primaryLight,
      fontSize: isMobile ? 10 : 14,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: isMobile ? 3 : 8,
    },
    ellipseImg: {
      shadowColor: colors.primaryLight,
    },
    blueCircle: {
      backgroundColor: colors.primary,
      shadowColor: colors.shadow,
    },
  };

  return (
    <View style={[styles.bannerBox, dynamic.bannerBox]}>
      <View style={[styles.circleBox, dynamic.circleBox]}>
        <Text style={[styles.aboutText, dynamic.aboutText]}>
          About{'\n'}Standard
        </Text>
      </View>
      <View style={styles.ellipseContainer}>
        <Image
          source={require('../../assets/images/ellipse-office.png')}
          style={[styles.ellipseImg, dynamic.ellipseImg]}
          resizeMode="cover"
        />
        <View style={[styles.blueCircle, dynamic.blueCircle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerBox: {
    height: isMobile ? 110 : 160,
    borderBottomLeftRadius: isMobile ? 30 : 54,
    borderTopLeftRadius: isMobile ? 30 : 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isMobile ? 90 : 100,
    position: 'relative',
    justifyContent: 'flex-start',
    width: '100%',
    alignSelf: 'center',
    minHeight: isMobile ? 110 : 160,
  },
  circleBox: {
    position: 'absolute',
    left: isMobile ? 24 : 92,
    top: isMobile ? -5 : -24,
    width: isMobile ? 120 : 200,
    height: isMobile ? 120 : 200,
    borderRadius: isMobile ? 60 : 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.14,
    shadowRadius: 15,
    elevation: 10,
    paddingVertical: 8,
  },
  aboutText: {
    fontSize: isMobile ? 19 : 30,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: isMobile ? 24 : 36,
  },
  ellipseContainer: {
    position: 'absolute',
    right: isMobile ? 50 : 295,
    top: isMobile ? 25 : -15,
    width: isMobile ? 125 : 450,
    height: isMobile ? 70 : 220,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  ellipseImg: {
    width: isMobile ? 200 : 450,
    height: isMobile ? 130 : 220,
    borderRadius: isMobile ? 100 : 110,
    backgroundColor: 'rgba(11, 44, 76, 0.05)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  blueCircle: {
    position: 'absolute',
    bottom: isMobile ? -40 : -20,
    left: '20%',
    transform: [{ translateX: isMobile ? -10 : -20 }],
    width: isMobile ? 20 : 40,
    height: isMobile ? 20 : 40,
    borderRadius: isMobile ? 10 : 20,
    zIndex: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 5,
  },
});
