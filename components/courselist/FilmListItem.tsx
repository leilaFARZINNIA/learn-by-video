import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ellipsizeSmart } from "../../utils/ellipsize";

type Props = {
  text: string;
  index: number;
  isLast: boolean;
  onPress: () => void;
  color: string;
  fontSize: number;
  dividerColor: string;
  icon?: React.ReactNode;
  maxWords?: number;
  maxChars?: number;
};

export function FilmListItem({
  text,
  index,
  isLast,
  onPress,
  color,
  fontSize,
  dividerColor,
  icon,
  maxWords,
  maxChars,
}: Props) {
  const { isPhone } = useBreakpoint();


  const raw = (text ?? "").trim();
  const hasSpaces = /\s/.test(raw);


  const fallbackWords = maxWords ?? (isPhone ? 6 : 12);
  const fallbackChars = maxChars ?? (isPhone ? 72 : 120);
  const isExtreme = raw.length > (isPhone ? 180 : 280); 


  const display = hasSpaces && !isExtreme
    ? raw 
    : ellipsizeSmart(raw, { maxWords: fallbackWords, maxChars: fallbackChars });

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}
        style={{ borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 8 }}
      >
        {icon ? <View style={{ width: 20, alignItems: "center" }}>{icon}</View> : null}

        <Text
          style={{
            marginVertical: 4,
            fontFamily: "PatrickHand",
            color,
            fontSize,
            textAlign: "left",
            flexShrink: 1,
            minWidth: 0, 
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityLabel={`${index + 1}. ${raw}`}
        >
          {index + 1}. {display}
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
