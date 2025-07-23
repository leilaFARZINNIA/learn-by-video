import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilmListItem } from '../../components/deutscherFilm/FilmListItem';
import NotebookSvg from '../../components/deutscherFilm/NotebookSvg';
import { Film, films, handleFilmClick } from '../../constants/deutscherFilm/filmsData';
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../theme/deutscherFilm/responsive';



export default function DeutscherFilmScreen() {
  const {
     iconSize, headerFontSize, papermaxWidth, aspectRatio,
    borderRadius, gap, contentPadding, middleFontSize,marginBottom
  } = useResponsive();

  const { colors } = useTheme();
  const router = useRouter();

  const paperWidth =papermaxWidth
  const paperHeight = paperWidth * aspectRatio;
  const padSides = paperWidth * 0.2;
  const padTop = paperHeight * 0.35;
  const padBottom = paperHeight * 0.1;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { marginBottom: marginBottom }]}>
        <Image
          source={require('../../assets/images/filmicon.png')}
          style={{ width: iconSize, height: iconSize, marginRight: gap / 2 }}
          resizeMode="contain"
        />
        <Text style={[styles.headerTitle, { fontSize: headerFontSize, color: colors.headersfilm}]}>
          FILME
        </Text>
      </View>

      <View style={{ width: paperWidth, height: paperHeight, alignSelf: 'center' }}>
        <NotebookSvg
          width={paperWidth}
          height={paperHeight}
          paperColor={colors.paper}
          borderColor={colors.border}
          bgColor="transparent"
          gradientColors={[colors.paperGradientStart, colors.paperGradientEnd]}
          style={{ borderRadius }}
        />
        <View
          style={{
            position: 'absolute',
            left: padSides,
            right: padSides,
            top: padTop,
            bottom: padBottom,
            zIndex: 2,
            justifyContent: 'flex-start',
          }}
          pointerEvents="box-none"
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: contentPadding }}
            showsVerticalScrollIndicator={false}
          >
            {films.map((item: Film, i: number) => (
              <FilmListItem
              key={item.id}
              text={item.title}
              index={i}
              isLast={i === films.length - 1}
              color={colors.listfilm}
              fontSize={middleFontSize}
              dividerColor={colors.border}
              onPress={() => {
                handleFilmClick(router, item);
              }}
            />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 32,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontFamily: 'PatrickHand',
    letterSpacing: 1,
  },
});
