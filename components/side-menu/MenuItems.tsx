import React from 'react';
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
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
};

export default function MenuItems({
  expanded,
  hoveredMenu,
  setHoveredMenu,
  onMenuPress,
  selectedMenu,
  webPointer,
}: Props) {
  const { colors } = useTheme();

  return (
    <>
      {MENU_ITEMS.map((item, idx) => {
        const viewProps =
          Platform.OS === 'web'
            ? {
                onMouseEnter: () => expanded && setHoveredMenu(idx),
                onMouseLeave: () => expanded && setHoveredMenu(null),
                style: [
                  styles.row,
                  hoveredMenu === idx && expanded ? { backgroundColor: colors.menuHoverBg } : {},
                  selectedMenu === idx && expanded ? { backgroundColor: colors.menuActiveBg } : {},
                  webPointer,
                ] as ViewStyle[],
              }
            : {
                style: [
                  styles.row,
                  hoveredMenu === idx && expanded ? { backgroundColor: colors.menuHoverBg } : {},
                  selectedMenu === idx && expanded ? { backgroundColor: colors.menuActiveBg } : {},
                ] as ViewStyle[],
              };

        return (
          <View key={idx} {...viewProps}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              onPress={() => onMenuPress(idx)}
              activeOpacity={0.85}
            >
             
              {React.cloneElement(item.icon, { color: colors.menuIcon })}
              {expanded && <Text style={[styles.label, { color: colors.menuLabel }]}>{item.label}</Text>}
            </TouchableOpacity>
          </View>
        );
      })}
    </>
  );
}
