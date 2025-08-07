import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { HISTORY_ITEMS, MENU_ITEMS } from './menuData';
import styles from './styles';

type MenuContentProps = {
  expanded: boolean;
  selectedMenu: number | null;
  setSelectedMenu: (idx: number) => void;
  selectedHistory: number | null;
  setSelectedHistory: (idx: number) => void;
  onMenuPress: (idx: number) => void;
  
};

export default function MenuContent({
  expanded,
  selectedMenu,
  setSelectedMenu,
  selectedHistory,
  setSelectedHistory,
  onMenuPress,
}: MenuContentProps) {
  const { colors } = useTheme();

  return (
    <>
      {MENU_ITEMS.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.row,
            selectedMenu === idx && expanded ? { backgroundColor: colors.menuActiveBg } : null,
          ]}
        
          onPress={() => onMenuPress(idx)}

          activeOpacity={0.85}
        >
         
          {React.cloneElement(item.icon, { color: colors.menuIcon })}
          {expanded && <Text style={[styles.label, { color: colors.menuLabel }]}>{item.label}</Text>}
        </TouchableOpacity>
      ))}
      {expanded && <View style={[styles.divider, { backgroundColor: colors.dividerMenu }]} />}
      {expanded && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Painter History</Text>
          <ScrollView style={styles.historyContainer} contentContainerStyle={{ paddingBottom: 30 }}>
          {HISTORY_ITEMS.map((item, idx) => (
  <TouchableOpacity
    key={item.id}
    style={[
      styles.historyItem,
      { backgroundColor: selectedHistory === idx ? colors.historyActiveBg : colors.historyBg }
    ]}
    onPress={() => setSelectedHistory(idx)}
    activeOpacity={0.85}
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
    </>
  );
}
