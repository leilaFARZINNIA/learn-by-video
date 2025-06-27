import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useAppContext();
  const { colors } = useTheme();

  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? '#f5dd4b' : '#fff'}
        trackColor={{ false: '#ccc', true: '#81b0ff' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
  },
});
