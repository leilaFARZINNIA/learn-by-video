import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { isMobile } from '../../theme/about/responsive';

const INFO = [
  { title: 'Our Mission', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { title: 'Our History', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { title: 'Our Team', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
];

export default function InfoSection() {
  const { colors } = useTheme();


  const dynamicStyles = {
    infoContainer: {
      backgroundColor: colors.transparent,
      shadowColor: colors.transparent,
    },
    header: {
      color: colors.headerText,
    },
    title: {
      color: colors.menuText,
    },
    text: {
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
    },
    buttonText: {
      color: colors.white,
    },
  };

  return (
    <View style={[styles.infoContainer, dynamicStyles.infoContainer]}>
      <Text style={[styles.header, dynamicStyles.header]}>Company Standard</Text>
      <View style={styles.row}>
        {INFO.map((item) => (
          <View key={item.title} style={styles.column}>
            <Text style={[styles.title, dynamicStyles.title]}>{item.title}</Text>
            <Text style={[styles.text, dynamicStyles.text]}>{item.text}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={[styles.button, dynamicStyles.button]}>
        <Text style={[styles.buttonText, dynamicStyles.buttonText]}>CALL ACTION</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    padding: isMobile ? 20 : 100,
    paddingTop: isMobile ? 100 : 100,
    width: '90%',
    alignSelf: 'center',
    maxWidth: isMobile ? 420 : 1200,
    borderRadius: 0,
  },
  header: {
    fontSize: isMobile ? 17 : 24,
    fontWeight: 'bold',
    marginBottom: isMobile ? 8 : 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(70,170,255,0.10)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  row: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'flex-start' : 'space-between',
    marginBottom: isMobile ? 14 : 20,
  },
  column: {
    flex: 1,
    marginHorizontal: isMobile ? 0 : 20,
    minWidth: isMobile ? 0 : 170,
    marginBottom: isMobile ? 14 : 0,
  },
  title: {
    fontSize: isMobile ? 13 : 16,
    fontWeight: 'bold',
    marginBottom: isMobile ? 3 : 5,
    textShadowColor: 'rgba(70,170,255,0.06)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  text: {
    fontSize: isMobile ? 10.5 : 14,
    letterSpacing: 0.1,
    lineHeight: isMobile ? 14 : 20,
  },
  button: {
    marginTop: isMobile ? 10 : 18,
    paddingVertical: isMobile ? 8 : 10,
    paddingHorizontal: isMobile ? 32 : 22,
    borderRadius: isMobile ? 14 : 20,
    alignSelf: isMobile ? 'stretch' : 'flex-start',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: isMobile ? 13 : 15,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
