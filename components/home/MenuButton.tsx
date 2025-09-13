import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Props {
  icon: React.ReactNode;   
  label: string;
  iconSize: number;
  fontSize: number;
  color: string;
  onPress: () => void;
}

export default function MenuButton({
  icon,
  label,
  iconSize,
  fontSize,
  color,
  onPress,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        
        <View style={{ marginBottom: 8 }}>
          {icon}
        </View>
        <Text style={[styles.label, { fontSize, color }]}>{label}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    marginHorizontal: '2.5%',
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'PatrickHand',
  },
});
