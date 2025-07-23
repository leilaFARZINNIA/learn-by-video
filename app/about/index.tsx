import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const AboutScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://ui-avatars.com/api/?name=About+Page',
        }}
        style={styles.avatar}
      />
      <Text style={styles.title}>About This App</Text>
      <Text style={styles.description}>
        This is a simple About page built with React Native and TypeScript.
        {'\n\n'}
        You can use this template for your own projects!
      </Text>
      <Text style={styles.footer}>Made by YourName, 2025</Text>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#555',
  },
  footer: {
    fontSize: 12,
    color: '#aaa',
    position: 'absolute',
    bottom: 20,
  },
});
