import { useIsAdmin } from "@/hooks/useIsAdmin";
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useAuth } from "../../auth/auth-context";
import { useTheme } from '../../context/ThemeContext';
import { MENU_ITEMS } from './menuData';
import styles from './styles';




type Props = {
  expanded: boolean;
  hoveredMenu: number | null;
  setHoveredMenu: (idx: number | null) => void;
  onMenuPress: (idx: number) => void;
  selectedMenu: number | null;
  webPointer: ViewStyle;
  items: typeof MENU_ITEMS;
};

export default function MenuItems({
  expanded,
  hoveredMenu,
  setHoveredMenu,
  onMenuPress,
  selectedMenu,
  webPointer,
  items, 
}: Props) {
  const { colors} = useTheme();
  const menu = (colors as any).menu;
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin(); // true | false | null

  console.log("🔄 MenuContent user:", user);

  
  let filteredItems = items;

  if (user) {
    filteredItems = items.filter(i => i.route !== "/login");
    
      if (isAdmin === true) {
        filteredItems = filteredItems.map(i =>
          i.route === "/dashboard"
            ? {
                ...i,
                label: "Admin dashboard",
                route: "/admin",
                icon: <FontAwesome5 name="shield-alt" size={24} />,
              }
            : i
        );
      }

    filteredItems.push({
      icon: <FontAwesome5 name="sign-out-alt" size={24} />,
      label: "Logout",
      route: "/logout"
    });
  } else {
    filteredItems = items.filter(i => i.route !== "/dashboard");
  }

  console.log("User:", user);
  console.log("Filtered Items:", filteredItems.map(i => i.label));

  
  return (
    <>
      {filteredItems.map((item, idx) => {
        const viewProps =
          Platform.OS === 'web'
            ? {
                onMouseEnter: () => expanded && setHoveredMenu(idx),
                onMouseLeave: () => expanded && setHoveredMenu(null),
                style: [
                  styles.row,
                  hoveredMenu === idx && expanded ? { backgroundColor: menu.menuHoverBg } : {},
                  selectedMenu === idx && expanded ? { backgroundColor: menu.menuActiveBg } : {},
                  webPointer,
                ] as ViewStyle[],
              }
            : {
                style: [
                  styles.row,
                  hoveredMenu === idx && expanded ? { backgroundColor: menu.menuHoverBg } : {},
                  selectedMenu === idx && expanded ? { backgroundColor: menu.menuActiveBg } : {},
                ] as ViewStyle[],
              };

        return (
          <View key={idx} {...viewProps}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              onPress={() => {
                if (item.label === "Logout") {
                  logout();
                } else if (item.route) {
                  router.push(item.route as any);
                }
              }}
              
              activeOpacity={0.85}
            >
             
              {React.cloneElement(item.icon, { color: menu.menuIcon })}
              {expanded && <Text style={[styles.label, { color: menu.menuLabel }]}>{item.label}</Text>}
            </TouchableOpacity>
          </View>
        );
      })}
    </>
  );
}
