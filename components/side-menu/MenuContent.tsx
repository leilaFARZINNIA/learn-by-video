import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../../auth/auth-context";
import { useTheme } from '../../context/ThemeContext';
import { HISTORY_ITEMS } from './menuData';
import styles from './styles';


type MenuContentProps = {
  expanded: boolean;
  selectedMenu: number | null;
  setSelectedMenu: (idx: number) => void;
  selectedHistory: number | null;
  setSelectedHistory: (idx: number) => void;
  onMenuPress: (idx: number) => void;
  items: { icon: React.JSX.Element; label: string; route: string }[];
  
};

export default function MenuContent({
  expanded,
  selectedMenu,
  setSelectedMenu,
  selectedHistory,
  setSelectedHistory,
  onMenuPress,
  items,
}: MenuContentProps) {
  const { colors } = useTheme();
  const menu = (colors as any).menu;
  const { user, logout } = useAuth();
  console.log("🔄 MenuContent user:", user);


let filteredItems = items;

if (user) {
  filteredItems = items.filter(i => i.route !== "/login");
  filteredItems.push({
    icon: <FontAwesome5 name="sign-out-alt" size={24} />,
    label: "Logout",
    route: "/logout"
  });
} else {
  filteredItems = items.filter(i => i.route !== "/dashboard");
}


console.log("User in MenuContent:", user);
console.log("Filtered Menu Items:", filteredItems.map(i => i.label));



  return (

    
    <>
       {filteredItems.map((item, idx)  => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.row,
            selectedMenu === idx && expanded ? { backgroundColor: menu.menuActiveBg } : null,
          ]}
        
          onPress={() => {
            if (item.route === "/logout") {
              logout();
            } else {
              router.push(item.route as any);

            }
          }}
          

          activeOpacity={0.85}
        >
         
          {React.cloneElement(item.icon, { color: menu.menuIcon })}
          {expanded && <Text style={[styles.label, { color: menu.menuLabel }]}>{item.label}</Text>}
        </TouchableOpacity>
      ))}
      {expanded && <View style={[styles.divider, { backgroundColor: menu.dividerMenu }]} />}
      {expanded && (
        <>
          <Text style={[styles.sectionTitle, { color: menu.sectionTitle }]}>Painter History</Text>
          <ScrollView style={styles.historyContainer} contentContainerStyle={{ paddingBottom: 30 }}>
          {HISTORY_ITEMS.map((item, idx) => (
  <TouchableOpacity
    key={item.id}
    style={[
      styles.historyItem,
      { backgroundColor: selectedHistory === idx ? menu.historyActiveBg : menu.historyBg }
    ]}
    onPress={() => setSelectedHistory(idx)}
    activeOpacity={0.85}
  >
    <FontAwesome5 name="paint-brush" size={18} color={menu.menuIcon} style={{ marginRight: 9 }} />
    <View>
      <Text style={[styles.historyTitle, { color: menu.historyTitle }]}>{item.title}</Text>
      <Text style={[styles.historyDate, { color: menu.historyDate }]}>{item.date}</Text>
    </View>
  </TouchableOpacity>
))}

          </ScrollView>
        </>
      )}
    </>
  );
}
