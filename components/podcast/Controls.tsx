import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { ActivityIndicator, Animated, Pressable, View } from "react-native";

export default function Controls({
  colors,
  isLoaded,
  isPlaying,
  isBuffering,
  onTogglePlay,
  onBack15,
  onFwd30,
}: {
  colors: any;
  isLoaded: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  onTogglePlay: () => void;
  onBack15: () => void;
  onFwd30: () => void;
}) {
  return (
    <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <CircleIconButton bg={colors.blueSoft} onPress={onBack15}>
        <Ionicons name="play-back" size={20} color={colors.blueDark} />
      </CircleIconButton>

      <PlayPauseButton
        colors={colors}
        playing={isPlaying}
        disabled={!isLoaded}
        buffering={isBuffering}
        onPress={onTogglePlay}
      />

      <CircleIconButton bg={colors.blueSoft} onPress={onFwd30}>
        <Ionicons name="play-forward" size={20} color={colors.blueDark} />
      </CircleIconButton>
    </View>
  );
}

function CircleIconButton({ bg, onPress, children }: { bg: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} android_ripple={{ color: "#00000022", borderless: true }} style={{
      width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center",
      backgroundColor: bg, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    }}>
      {children}
    </Pressable>
  );
}

function PlayPauseButton({
  colors,
  playing,
  disabled,
  buffering,
  onPress,
}: {
  colors: any;
  playing: boolean;
  disabled?: boolean;
  buffering?: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleIn = () =>
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 6, tension: 140 }).start();
  const handleOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 140 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={handleIn} onPressOut={handleOut} disabled={disabled} android_ripple={{ color: colors.blueSoft }}>
      <Animated.View style={{
        width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center",
        elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
        backgroundColor: playing ? colors.blueDark : colors.blue,
        transform: [{ scale }],
        opacity: disabled ? 0.6 : 1,
      }}>
        {buffering ? <ActivityIndicator color="#FFFFFF" /> : <Ionicons name={playing ? "pause" : "play"} size={28} color="#FFFFFF" />}
      </Animated.View>
    </Pressable>
  );
}
