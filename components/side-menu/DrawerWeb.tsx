// components/Drawer/DrawerWeb.tsx
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, Pressable, ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useAuth } from "../../auth/auth-context";
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../CustomHeaderProps';
import { MENU_ITEMS } from './menuData';
import MenuItems from './MenuItems';
import styles from './styles';

import { deleteHistory, fetchHistory, type HistoryItem } from '@/api/history';

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

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryMediaId, setSelectedHistoryMediaId] = useState<string | null>(null);

  const { colors } = useTheme();
  const menu = (colors as any).menu;
  const router = useRouter();
  const { user } = useAuth();

  const menuItemsToShow = MENU_ITEMS.filter(item => {
    if (!user && item.route === "/dashboard") return false;
    if (user && item.route === "/login") return false;
    return true;
  });

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

  
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!expanded || !user) return;
      try {
        setHistoryLoading(true);
        const rows = await fetchHistory({ limit: 50 });
        if (!cancelled) setHistory(rows);
      } catch {
      
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [expanded, user]);

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

  const goToHistoryItem = (it: HistoryItem) => {
    const k = (it.kind || "").toLowerCase();
    const href =
      k === "video"   ? `/video/${it.media_id}`   :
      k === "podcast" ? `/podcast/${it.media_id}` :  
                        `/text/${it.media_id}`;
    router.push(href as any);
  };
  

  const removeHistory = async (mediaId: string) => {
    try {
      await deleteHistory(mediaId); 
      setHistory(prev => prev.filter(h => h.media_id !== mediaId));
      if (selectedHistoryMediaId === mediaId) setSelectedHistoryMediaId(null);
    } catch {
     
    }
  };

  return (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      minHeight: windowHeight,
      backgroundColor: menu.background,
    }}>
      {/* HEADER */}
      <View style={{ width: '100%', position: 'absolute', left: 0, top: 0, zIndex: 1200 }}>
        <CustomHeader toggleSidebar={toggleSidebar} isSidebarOpen={expanded} />
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
            backgroundColor: menu.sidebarBg,
            borderRightColor: menu.sidebarBorder,
            shadowColor: menu.sidebarShadow,
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
              <Feather name="sidebar" size={26} color={menu.sidebarToggleIcon} />
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
              style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
            >
              <Feather name="sidebar" size={24} color={menu.sidebarToggleIcon} />
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
            router.push(menuItemsToShow[idx].route as any);
          }}
          selectedMenu={selectedMenu}
          webPointer={webPointer}
          items={menuItemsToShow}
        />

        {expanded && <View style={[styles.divider, { backgroundColor: menu.dividerMenu }]} />}

        {/* HISTORY */}
        {expanded && user && (
          <>
            <Text style={[styles.sectionTitle, { color: menu.sectionTitle }]}>History</Text>
            <ScrollView style={styles.historyContainer} contentContainerStyle={{ paddingBottom: 30 }}>
              {historyLoading && (
                <Text style={{ color: menu.historyDate, paddingHorizontal: 12, paddingVertical: 6 }}>
                  Loading…
                </Text>
              )}

              {!historyLoading && history.length === 0 && (
                <Text style={{ color: menu.historyDate, paddingHorizontal: 12, paddingVertical: 6 }}>
                  No items yet
                </Text>
              )}

              {!historyLoading && history.map((item) => {
                const isSelected = selectedHistoryMediaId === item.media_id;
                const dateLabel = new Date(item.updated_at).toLocaleDateString();
                const iconName =
                  item.kind === 'video'   ? 'play-circle' :
                  item.kind === 'podcast' ? 'headphones'  : 'file-alt';

                return (
                  <View
                    key={item.media_id}
                    style={[
                      styles.historyItem,
                      { backgroundColor: isSelected ? menu.historyActiveBg : menu.historyBg }
                    ]}
                  >
                    <TouchableOpacity
                      style={[{ flexDirection: 'row', alignItems: 'center', flex: 1 }, webPointer]}
                      activeOpacity={0.8}
                      onPress={() => { setSelectedHistoryMediaId(item.media_id); goToHistoryItem(item); }}
                    >
                      <FontAwesome5 name={iconName as any} size={18} color={menu.menuIcon} style={{ marginRight: 9 }} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text numberOfLines={1} style={[styles.historyTitle, { color: menu.historyTitle }]}>
                          {item.media_title}
                        </Text>
                        <Text style={[styles.historyDate, { color: menu.historyDate }]}>
                          {dateLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => removeHistory(item.media_id)}
                      style={{ paddingHorizontal: 8, paddingVertical: 6 }}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Feather name="trash-2" size={16} color={menu.historyDate} />
                    </TouchableOpacity>
                  </View>
                );
              })}
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
