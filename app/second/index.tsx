import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function SecondScreen() {
  const { text } = useAppContext();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>You entered:</Text>
      <Text style={[styles.value, { color: colors.primary }]}>{text || '(empty)'}</Text>
      <View style={{ height: 20 }} />
      <Button title="Back to Home" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  text: {
    fontSize: 20,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
