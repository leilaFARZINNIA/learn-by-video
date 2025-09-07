import { useTheme } from "@/context/ThemeContext";
import { useResponsive } from "@/theme/settings/responsive";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type ToastType = "success" | "error" | "info";
type ToastState = { visible: boolean; message: string; type: ToastType; duration: number };

type ToastApi = {
  show: (message: string, opts?: { type?: ToastType; duration?: number }) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>({ visible: false, message: "", type: "info", duration: 2400 });

  const show = useCallback((message: string, opts?: { type?: ToastType; duration?: number }) => {
    setState({ visible: true, message, type: opts?.type ?? "info", duration: opts?.duration ?? 2400 });
  }, []);

  const api = useMemo<ToastApi>(() => ({
    show,
    success: (m, d) => show(m, { type: "success", duration: d }),
    error:   (m, d) => show(m, { type: "error",   duration: d }),
    info:    (m, d) => show(m, { type: "info",    duration: d }),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport state={state} onHide={() => setState(s => ({ ...s, visible: false }))} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

function ToastViewport({ state, onHide }: { state: ToastState; onHide: () => void }) {
  const { colors } = useTheme();
  const ui = (colors as any).settings;
  const { isMobile } = useResponsive();

  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (state.visible) {
      Animated.timing(anim, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      const t = setTimeout(() => hide(), state.duration);
      return () => clearTimeout(t);
    } else {
      Animated.timing(anim, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }).start();
    }
  }, [state.visible]);

  const hide = () => onHide();

  const bg =
    state.type === "success" ? "#16A34A" :
    state.type === "error"   ? "#EF4444" :
    Platform.OS === "web" ? ui.accentBg : "#2563EB";

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [isMobile ? 24 : -10, 0] });
  const opacity = anim;

  if (!state.visible) return null;

  return (
    <View pointerEvents="box-none" style={[styles.host, isMobile ? styles.hostBottom : styles.hostTop]}>
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: bg,
            transform: [{ translateY }],
            opacity,
            shadowColor: "#000",
          },
        ]}
      >
        <Pressable onPress={hide} style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
          <Text style={styles.text}>{state.message}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: "absolute", left: 0, right: 0, zIndex: 9999, alignItems: "center" },
  hostBottom: { bottom: 24 },
  hostTop: { top: 24 },
  toast: {
    borderRadius: 12,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    maxWidth: 720,
  },
  text: { color: "#fff", fontWeight: "800" },
});
