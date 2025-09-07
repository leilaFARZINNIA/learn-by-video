// app/index.tsx (HomeScreen)
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StatusBar, StyleSheet, Text, View } from "react-native";

import SvgComponent from "../components/home/LogoLearnByVideo";
import MenuButton from "../components/home/MenuButton";

import { useTheme } from "../context/ThemeContext";
import { useResponsive } from "../theme/home/responsive";

export default function HomeScreen() {
  const { colors } = useTheme();
  const home = (colors as any).home;
  const {
    logoSize,
    fontSize,
    iconSize,
    labelFontSize,
    middleFontSize,
    gap,
    columns,
    itemWidth, // `${number}%` from hook
  } = useResponsive();

  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: menuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const buttons = [
    { id: "1", label: "Video", icon: "movie-open-play", iconColor: "#ff9800" },
    { id: "2", label: "Podcast", icon: "podcast", iconColor: "#e91e63" },
    { id: "3", label: "Text", icon: "file-document-outline", iconColor: "#283593" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: home.background }]}>
      <StatusBar barStyle="dark-content" />
      

      {/* Top / Logo */}
      <View style={[styles.topSection, { backgroundColor: home.topSectionBg }]}>
        <View style={[styles.rowContainer, { gap }]}>
          <SvgComponent width={logoSize} height={logoSize} />
          <View style={styles.textBlock}>
            <Text style={[styles.titleText, { fontSize }]}>LEARN</Text>
            <Text style={[styles.titleText, { fontSize }]}>BY VIDEO</Text>
          </View>
        </View>
      </View>

      {/* Subtitle */}
      <View style={[styles.middleSection, { backgroundColor: home.middleSectionBg }]}>
        <Text style={[styles.middleText, { fontSize: middleFontSize, color: home.textSecondary }]}>
          Choose your favorite way to learn.
        </Text>
      </View>

      {/* Buttons grid (keeps your grid approach) */}
      <View style={[styles.bottomSection, { backgroundColor: home.bottomSectionBg }]}>
        <View
          style={[
            styles.grid,
            { justifyContent: columns > 1 ? "space-between" : "center" },
          ]}
        >
          {buttons.map((btn) => (
            <View
              key={btn.id}
              style={[
                styles.gridItem,
                { width: itemWidth as `${number}%` }, // ensure RN accepts percentage
              ]}
            >
              <MenuButton
                icon={
                  <MaterialCommunityIcons
                    name={btn.icon as any}
                    size={iconSize}
                    color={btn.iconColor}
                  />
                }
                label={btn.label}
                iconSize={iconSize}
                fontSize={labelFontSize}
                color={home.textPrimary}
                onPress={() => {
                  if (btn.id === "1") router.push("/course?type=video");
                  if (btn.id === "2") router.push("/course?type=podcast");
                  if (btn.id === "3") router.push("/course?type=text");
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column" },

  topSection: { flex: 3, justifyContent: "center", alignItems: "center" },
  rowContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  textBlock: { justifyContent: "center" },
  titleText: {
    fontFamily: "Caprasimo",
    color: "rgba(151, 241, 255, 0.92)",
    textAlign: "left",
    textShadowColor: "#000",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },

  middleSection: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
  middleText: { textAlign: "center", fontFamily: "PatrickHand", paddingHorizontal: 16 },

  bottomSection: {
    flex: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 16,
  },
  
  gridItem: {
    paddingHorizontal: 2,   
         
    marginBottom: 6,        
    alignItems: "center",
  },
  
});
