
import { HIGHLIGHT_WORDS } from '@/constants/video-player/transcript-highlight';
import { useAutoStopMedia } from '@/utils/mediaLifecycle';
import { resolvePlayableUrl } from "@/utils/resolveMediaUrl";
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View, } from 'react-native';
import { fetchMediaById } from '../../api/media-api';
import Header from '../../components/video-player/ Header';
import ToggleTranscriptButton from '../../components/video-player/ToggleTranscriptButton';
import Transcript from '../../components/video-player/Transcript';
import VideoPlayer from '../../components/video-player/VideoPlayer';
import { useTheme } from '../../context/ThemeContext';
import { responsive } from '../../theme/video-player/responsive';


export default function VideoTranscriptScreen() {
  
  const videoRef = useRef<Video>(null);
  useAutoStopMedia({ videoRef, mode: 'unload' });
  const [showTranscript, setShowTranscript] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const { media_id } = useLocalSearchParams<{ media_id?: string }>();
  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;
  const [media, setMedia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true)
  const transcriptAnim = useRef(new Animated.Value(0)).current;
  const [currentSec, setCurrentSec] = useState(0);
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
      setCurrentSec((status.positionMillis ?? 0) / 1000);
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
  

  useEffect(() => {
    console.log('[Screen] currentSec=', currentSec);
  }, [currentSec]);

  useEffect(() => {
    if (!media_id) return;
    setIsLoading(true);
    fetchMediaById(media_id)
      .then(data => { setMedia(data); setIsLoading(false); })
      .catch(err => { setIsLoading(false); console.error("fetch error", err); });
  }, [media_id]);
  
 
  React.useEffect(() => {
    Animated.timing(transcriptAnim, {
      toValue: showTranscript ? 1 : 0,
      duration: 330,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [showTranscript]);

  if (isLoading || !media) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{isLoading ? "Loading..." : "Error: Media not found"}</Text>
      </View>
    );
  }
  

  // Haupt-Renderbereich (flexibel mit Theme/Styles)
  return (
    <View style={{
      flex: 1,
      backgroundColor: videoplayer.videoPlayerBg,
      overflow: 'hidden',
    }}>
      {/* Kopfzeile mit Filmtitel */}
      <Header title={media.media_title} />
  
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
          url={resolvePlayableUrl(media.media_url)}
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
            backgroundColor: videoplayer.cardBg,
            borderRadius: responsive.cardRadius,
            shadowColor: videoplayer.transcriptshadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.13,
            shadowRadius: 14,
            elevation: 9,
            borderWidth: 1.5,
            borderColor: videoplayer.transcriptBorder,
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
              transcript={media.media_transcript ?? ""}
              highlightWords={HIGHLIGHT_WORDS}
              currentTime={currentSec} 
              onSeek={(sec) => videoRef.current?.setPositionAsync(Math.max(0, Math.floor((sec ?? 0) * 1000)))}
              height={360}
                        
          
            />
          )}
        </Animated.View>
        <View style={{ height: 24 }} />
      </View>
    </View>
  );
  
}