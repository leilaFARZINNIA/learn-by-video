// components/Drawer/DrawerMobile.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../../auth/auth-context";
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../CustomHeaderProps';
import MenuContent from './MenuContent';
import { MENU_ITEMS } from './menuData';
import styles from './styles';


import { deleteHistory, fetchHistory, type HistoryItem } from '@/api/history';

const SIDEBAR_EXPANDED = 220;

export default function DrawerMobile({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

 
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryMediaId, setSelectedHistoryMediaId] = useState<string | null>(null);

  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_EXPANDED)).current;
  const { colors } = useTheme();
  const menu = (colors as any).menu;
  const router = useRouter();
  const { user } = useAuth();

  const menuItemsToShow = MENU_ITEMS.filter(item => {
    if (!user && item.route === "/dashboard") return false;
    if (user && item.route === "/login") return false;
    return true;
  });

  const openSidebar = () => {
    Animated.timing(sidebarAnim, { toValue: 0, duration: 260, useNativeDriver: true }).start();
    setExpanded(true);
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, { toValue: -SIDEBAR_EXPANDED, duration: 220, useNativeDriver: true })
      .start(() => setExpanded(false));
  };

  const toggleSidebar = () => (expanded ? closeSidebar() : openSidebar());

  
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
    <View style={{ flex: 1 }}>
      <CustomHeader isSidebarOpen={expanded} toggleSidebar={toggleSidebar} />

      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.sidebar,
            {
              width: SIDEBAR_EXPANDED,
              transform: [{ translateX: sidebarAnim }],
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              zIndex: 999,
              backgroundColor: menu.sidebarBg,
              borderRightColor: menu.sidebarBorder,
              shadowColor: menu.sidebarShadow,
            },
          ]}
        >
          <MenuContent
            expanded={expanded}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            onMenuPress={(idx) => {
              setSelectedMenu(idx);
              router.push(menuItemsToShow[idx].route as any);
              closeSidebar();
            }}
            items={menuItemsToShow}

         
            history={history}
            historyLoading={historyLoading}
            selectedHistoryMediaId={selectedHistoryMediaId}
            setSelectedHistoryMediaId={setSelectedHistoryMediaId}
            onDeleteHistory={removeHistory}
            onTapHistory={goToHistoryItem}
          />
        </Animated.View>

        {expanded && (
          <TouchableOpacity
            style={[styles.backdrop, { backgroundColor: menu.backdrop }]}
            activeOpacity={1}
            onPress={closeSidebar}
          />
        )}

        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </View>
  );
}
