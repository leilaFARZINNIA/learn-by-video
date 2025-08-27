import { Feather } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomHeaderProps {
  title?: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function CustomHeader({ title = '', isSidebarOpen, toggleSidebar }: CustomHeaderProps) {
  const router = useRouter();
  const segments = useSegments();
  const {  colors} = useTheme();
  const header = (colors as any).header;

  const isRoot = segments.join('/') === '' || segments.join('/') === 'index';
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 600;

  return (
    <View style={[
      styles.header,
      { backgroundColor: header.headerBg, shadowColor: header.headerShadow },
      isMobile ? styles.mobile : styles.web
    ]}>
      <View style={styles.left}>
  {isMobile && (
    isRoot ? (
      <TouchableOpacity
        onPress={toggleSidebar}
        style={styles.iconBtn}
        accessibilityLabel={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        <Feather name={isSidebarOpen ? "x" : "menu"} size={26} color={header.headerIcon} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.iconBtn}
        accessibilityLabel="Back"
      >
        <Feather name="arrow-left" size={26} color={header.headerIcon} />
      </TouchableOpacity>
    )
  )}
</View>

      <Text
        numberOfLines={1}
        style={[
          styles.title,
          { color: header.headerTitleP },
          isMobile ? styles.titleMobile : styles.titleWeb
        ]}
      >
        {title}
      </Text>
      <View style={styles.right} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 100,
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    minHeight: 64,
    transitionProperty: 'box-shadow, background',
    transitionDuration: '220ms',
  },
  mobile: {
    height: 100,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  web: {
    height: 64,
    paddingHorizontal: 28,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 65,
  },
  right: {
    minWidth: 32,
  },
  iconBtn: {
    marginRight: 12,
    padding: 6,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titleMobile: {
    fontSize: 18,
  },
  titleWeb: {
    fontSize: 22,
  },
});
