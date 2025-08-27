
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function FilmListItem({
  text,
  index,
  isLast,
  onPress,
  color,
  fontSize,
  dividerColor,
  icon,
}: {
  text: string;
  index: number;
  isLast: boolean;
  onPress: () => void;
  color: string;
  fontSize: number;
  dividerColor: string;
  icon?: React.ReactNode;
}) {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}
        style={{ borderRadius: 6 }}
      >
        <Text style={{
          marginVertical: 4,
          fontFamily: 'PatrickHand',
          color,
          fontSize,
          textAlign: 'left',
        }}>
          {index + 1}. {text}
        </Text>
      </TouchableOpacity>
      {!isLast && (
        <View
          style={{
            height: 1,
            backgroundColor: dividerColor,
            opacity: 0.3,
            borderRadius: 2,
            marginVertical: 2,
          }}
        />
      )}
    </View>
  );
}
