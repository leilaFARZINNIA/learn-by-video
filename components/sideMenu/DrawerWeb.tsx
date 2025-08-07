// components/Drawer/DrawerWeb.tsx
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, Pressable, ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../CustomHeaderProps';
import { HISTORY_ITEMS, MENU_ITEMS } from './menuData';
import MenuItems from './MenuItems';
import styles from './styles';

const SIDEBAR_COLLAPSED = 54;
const SIDEBAR_EXPANDED = 220;
const HEADER_HEIGHT = 64;

export default function DrawerWeb({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const sidebarAnim = useRef(new Animated.Value(SIDEBAR_COLLAPSED)).current;
  const [marginLeftAnim] = useState(() => new Animated.Value(SIDEBAR_COLLAPSED));
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);
  const { colors } = useTheme();
  const router = useRouter();


  const toggleSidebar = () => {
    const newVal = expanded ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
    Animated.timing(sidebarAnim, {
      toValue: newVal,
      duration: 220,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
    setIsHovered(false);
  };

  useEffect(() => {
    Animated.timing(marginLeftAnim, {
      toValue: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const webPointer: ViewStyle = Platform.OS === 'web' ? { cursor: 'pointer' as const } : {};

  const getLogoBarStyle = (expanded: boolean): ViewStyle => ({
    width: '100%',
    paddingVertical: 18,
    paddingLeft: expanded ? 2 : 0,
    paddingRight: expanded ? 8 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: expanded ? 'space-between' : 'center',
    marginBottom: 16,
  });

  return (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      minHeight: windowHeight,
      backgroundColor: colors.background,
    }}>
      {/* HEADER */}
      <View style={{ width: '100%', position: 'absolute', left: 0, top: 0, zIndex: 1200 }}>
        <CustomHeader
          toggleSidebar={toggleSidebar}
          isSidebarOpen={expanded}
          
        />
      </View>
      {/* SIDEBAR */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            width: sidebarAnim,
            left: 0,
            top: HEADER_HEIGHT,
            height: windowHeight - HEADER_HEIGHT,
            zIndex: 999,
            position: 'absolute',
            backgroundColor: colors.sidebarBg,
            borderRightColor: colors.sidebarBorder,
            shadowColor: colors.sidebarShadow,
          }
        ]}
      >
        {/* LOGO */}
        <View style={getLogoBarStyle(expanded)}>
          <Pressable
            onPress={!expanded ? toggleSidebar : undefined}
            onHoverIn={() => !expanded && setIsHovered(true)}
            onHoverOut={() => !expanded && setIsHovered(false)}
            style={{
              width: expanded ? 'auto' : '100%',
              alignItems: 'center',
              justifyContent: expanded ? 'flex-start' : 'center',
              paddingLeft: expanded ? 16 : 0,
            }}
          >
            {isHovered && !expanded ? (
              <Feather name="sidebar" size={26} color={colors.sidebarToggleIcon} />
            ) : (
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 30, height: 30, borderRadius: 4 }}
                resizeMode="contain"
              />
            )}
          </Pressable>
          {expanded && (
            <TouchableOpacity
              onPress={toggleSidebar}
              activeOpacity={0.85}
              style={{
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Feather name="sidebar" size={24} color={colors.sidebarToggleIcon} />
            </TouchableOpacity>
          )}
        </View>
        {/* MENU ITEMS */}
        <MenuItems
            expanded={expanded}
            hoveredMenu={hoveredMenu}
            setHoveredMenu={setHoveredMenu}
            onMenuPress={(idx) => {
              setSelectedMenu(idx);
              router.push(MENU_ITEMS[idx].route as any);


              
            }}
            selectedMenu={selectedMenu}
            webPointer={webPointer}
        />
        {expanded && <View style={[styles.divider, { backgroundColor: colors.dividerMenu }]} />}
        {/* PAINTER HISTORY */}
        {expanded && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Painter History</Text>
            <ScrollView style={styles.historyContainer} contentContainerStyle={{ paddingBottom: 30 }}>
              {HISTORY_ITEMS.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.historyItem,
                    { backgroundColor: selectedHistory === idx ? colors.historyActiveBg : colors.historyBg },
                    webPointer
                  ]}
                  onPress={() => setSelectedHistory(idx)}
                  activeOpacity={0.8}
                >
                  <FontAwesome5 name="paint-brush" size={18} color={colors.menuIcon} style={{ marginRight: 9 }} />
                  <View>
                    <Text style={[styles.historyTitle, { color: colors.historyTitle }]}>{item.title}</Text>
                    <Text style={[styles.historyDate, { color: colors.historyDate }]}>{item.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </Animated.View>
      {/* CONTENT */}
      <Animated.View style={{ flex: 1, marginLeft: marginLeftAnim, marginTop: HEADER_HEIGHT }}>
        {children}
      </Animated.View>
    </View>
  );
}
