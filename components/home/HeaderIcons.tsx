import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../theme/home/responsive';

interface Props {
 
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;

}

export default function HeaderIcons({ leftElement, rightElement }: Props) {
  const { colors } = useTheme();
  const { iconSize, gap } = useResponsive();

  return (
    <View style={[styles.container, { padding: gap }]}>
     
     <View>
    {leftElement}
  </View>
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
