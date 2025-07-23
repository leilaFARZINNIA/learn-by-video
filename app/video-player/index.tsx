
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Header from '../../components/videoPlayer/ Header';
import ToggleTranscriptButton from '../../components/videoPlayer/ToggleTranscriptButton';
import Transcript from '../../components/videoPlayer/Transcript';
import VideoPlayer from '../../components/videoPlayer/VideoPlayer';
import { HIGHLIGHT_WORDS, TRANSCRIPT } from '../../constants/videoPlayer/transcriptData';
import { useTheme } from '../../context/ThemeContext';
import { responsive } from '../../theme/videoPlayer/responsive';

export default function VideoTranscriptScreen() {
  
  const videoRef = useRef<Video>(null);
  const { url, title } = useLocalSearchParams<{ title?: string; url?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const { colors } = useTheme();

  // Animationswert für das Transcript (ein-/ausblenden)
  const transcriptAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(transcriptAnim, {
      toValue: showTranscript ? 1 : 0,
      duration: 330,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [showTranscript]);

  // Video-Handler für Autoplay und Pausenstatus
  const handleLoaded = () => {
    setIsLoading(false);
    setTimeout(() => {
      videoRef.current?.playAsync();
      setIsPaused(false);
    }, 200);
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPaused(!status.isPlaying);
    }
  };

  // Animationswerte für das Transcript
  const transcriptOpacity = transcriptAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const transcriptTranslate = transcriptAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  // Haupt-Renderbereich (flexibel mit Theme/Styles)
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.videoPlayerBg, // Hintergrund aus Theme
      overflow: 'hidden',
    }}>
      {/* Kopfzeile mit Filmtitel */}
      <Header title={title} />

      <View
        style={{
          alignItems: 'center',
          width: '100%',
          flex: !showTranscript ? 1 : undefined,
          justifyContent: !showTranscript ? 'center' : undefined,
        }}>
        {/* Videoplayer-Komponente */}
        <VideoPlayer
          videoRef={videoRef}
          url={url}
          isLoading={isLoading}
          handleLoaded={handleLoaded}
          handlePlaybackStatusUpdate={handlePlaybackStatusUpdate}
          setIsLoading={setIsLoading}
        />

        {/* Button zum Ein-/Ausblenden des Transkripts */}
        <ToggleTranscriptButton
          showTranscript={showTranscript}
          onPress={() => setShowTranscript(!showTranscript)}
          pressed={setPressed}
        />

        {/* Animiertes Transkript — eingeblendet bei Bedarf */}
        <Animated.View
          pointerEvents={showTranscript ? "auto" : "none"}
          style={{
            width: responsive.cardWidth,
            backgroundColor: colors.cardBg,
            borderRadius: responsive.cardRadius,
            shadowColor: colors.transcriptshadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.13,
            shadowRadius: 14,
            elevation: 9,
            borderWidth: 1.5,
            borderColor: colors.transcriptBorder,
            padding: responsive.cardPadding,
            marginBottom: 34,
            alignSelf: 'center',
            marginTop: showTranscript ? 18 : -40,
            maxHeight: responsive.cardWidth * 0.8,
            opacity: transcriptOpacity,
            transform: [{ translateY: transcriptTranslate }],
            height: showTranscript ? undefined : 0,
          }}
        >
          {showTranscript && (
            <Transcript
              transcript={TRANSCRIPT}
              highlightWords={HIGHLIGHT_WORDS}
            />
          )}
        </Animated.View>
        {/* Abstand nach unten (atmend auf Mobile) */}
        <View style={{ height: 24 }} />
      </View>
    </View>
  );
}
