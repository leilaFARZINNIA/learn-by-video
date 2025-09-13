import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useResponsive } from "../../../theme/courselist/responsive";
import { FilmListItem } from "../FilmListItem";
import NotebookSvg from "../NotebookSvg";

export type NotebookItem = {
  type: string; id: string; title: string 
};

type Props = {
  title: string;              
  iconSource: any;
           
  items: NotebookItem[];      
  onItemPress: (item: NotebookItem, index: number) => void;
};

export default function NotebookList({ title, iconSource, items, onItemPress }: Props) {
  const {  colors} = useTheme();
  const courselist = (colors as any).courselist ;
  const {
    iconSize, headerFontSize, papermaxWidth, aspectRatio,
    borderRadius, gap, contentPadding, middleFontSize, marginBottom
  } = useResponsive();

  const paperWidth = papermaxWidth;
  const paperHeight = paperWidth * aspectRatio;
  const padSides = paperWidth * 0.2;
  const padTop = paperHeight * 0.35;
  const padBottom = paperHeight * 0.1;

  return (
    <View style={[styles.root, { backgroundColor: courselist.background }]}>
      {/* Header */}
      <View style={[styles.header, { marginBottom }]}>
  {/* Icon */}
  <Image
    source={iconSource}
    style={{
      width: iconSize,
      height: iconSize,
      marginRight: gap / 2,
      resizeMode: "contain"
    }}
  />

  {/* Title */}
  <View style={{ flexShrink: 1, maxWidth: "55%" }}>
    <Text
      style={[
        styles.headerTitle,
        { fontSize: headerFontSize, color: courselist.headersfilm }
      ]}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {title}
    </Text>
  </View>
</View>


      {/* Notebook */}
      <View style={{ width: paperWidth, height: paperHeight, alignSelf: "center" }}>
        <NotebookSvg
          width={paperWidth}
          height={paperHeight}
          paperColor={courselist.paper}
          borderColor={courselist.border}
          bgColor="transparent"
          gradientColors={[courselist.paperGradientStart, courselist.paperGradientEnd]}
          style={{ borderRadius }}
        />
        <View style={{ position: "absolute", left: padSides, right: padSides, top: padTop, bottom: padBottom, zIndex: 2 }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: contentPadding }} showsVerticalScrollIndicator={false}>
            {items.map((it, i) => (
              <FilmListItem
                key={it.id}
                text={it.title}
                index={i}
                isLast={i === items.length - 1}
                color={courselist.listfilm}
                fontSize={middleFontSize}
                dividerColor={courselist.border}
                onPress={() => onItemPress(it, i)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "flex-start", paddingTop: 32 },
  header: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontWeight: "bold", fontFamily: "PatrickHand", letterSpacing: 1 },
});
