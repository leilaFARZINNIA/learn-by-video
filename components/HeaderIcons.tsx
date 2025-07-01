import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useResponsive } from '../constants/responsive';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onMenuPress: () => void;
  rightElement?: React.ReactNode;
}

export default function HeaderIcons({ onMenuPress, rightElement }: Props) {
  const { colors } = useTheme();
  const { iconSize, gap } = useResponsive();

  return (
    <View style={[styles.container, { padding: gap }]}>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={iconSize} color={colors.textPrimary} />
      </TouchableOpacity>
      {rightElement && <View style={{ marginLeft: gap }}>{rightElement}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
