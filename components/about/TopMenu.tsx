import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { isMobile } from '../../theme/about/responsive';

const MENUS = ['Hotage', 'Sanagt', 'Canous', 'WOOHOOIT'];

export default function TopMenu() {
  const { colors} = useTheme();
  const about = (colors as any).about;


  const dynamic = {
    menuBtn: {
      backgroundColor: about.menuBg,
      shadowColor: about.menuText,
    },
    menuText: {
      color: about.menuText,
    },
  };

  return (
    <View style={styles.topMenu}>
      {MENUS.map((item) => (
        <TouchableOpacity key={item} style={[styles.menuBtn, dynamic.menuBtn]}>
          <Text style={[styles.menuText, dynamic.menuText]}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: isMobile ? 10 : 5,
    paddingRight: isMobile ? 12 : 32,
    position: 'absolute',
    top: isMobile ? 5 : 0,
    right: 0,
    zIndex: 10,
    width: '100%',
  },
  menuBtn: {
    marginLeft: isMobile ? 8 : 22,
    paddingVertical: isMobile ? 4 : 8,
    paddingHorizontal: isMobile ? 8 : 12,
    borderRadius: isMobile ? 8 : 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    fontSize: isMobile ? 10 : 15,
    fontWeight: '500',
  },
});
