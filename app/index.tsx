import { ToggleThemeButton } from '@/components/ToggleThemeButton';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function HomeScreen() {
  const { text, setText, toggleTheme } = useAppContext();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Enter Text:</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type something..."
        placeholderTextColor={colors.border}
        style={[styles.input, { color: colors.text, borderColor: colors.primary }]}
      />
      <ToggleThemeButton />
      <View style={{ height: 20 }} />
      <Button title="Go to Second Screen" onPress={() => router.push('/second')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  label: {
    fontSize: 18, marginBottom: 10,
  },
  input: {
    borderWidth: 1, padding: 10, width: '100%', marginBottom: 20, borderRadius: 8,
  },
});
