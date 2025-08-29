// src/components/login/Hero.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from '../../context/ThemeContext';
import SvgComponent from "../home/LogoLearnByVideo";

type Props = {
  logoSize: number;
  fontSize: number;
  subtitle?: string;
};

export default function Hero({ logoSize, fontSize, subtitle = "Sign in to continue learning" }: Props) {
  const { colors } = useTheme();
  const login = (colors as any).login;

  return (
    <View style={s.hero}>
      <SvgComponent width={logoSize} height={logoSize} />
      <View style={s.textBlock}>
        <Text style={[s.titleText, { fontSize }]}>LEARN</Text>
        <Text style={[s.titleText, { fontSize }]}>BY VIDEO</Text>
        <Text style={[s.subtitle, { color: login.textMuted }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    marginBottom: 12,
  },
  textBlock: { justifyContent: "center" },
  titleText: {
    fontFamily: "Caprasimo",
    color: "rgba(151, 241, 255, 0.92)",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 12,
    textAlign: "center",
    fontWeight: "700",
  },
});
