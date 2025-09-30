// app/video/[media_id].tsx
import { upsertHistory } from '@/api/history';
import { HIGHLIGHT_WORDS } from '@/constants/media/transcript-highlight';
import { useAutoStopMedia } from '@/utils/mediaLifecycle';
import { resolvePlayableUrl } from "@/utils/resolveMediaUrl";
import { AVPlaybackStatus, Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { fetchMediaById } from '../../api/media-api';
import Header from '../../components/video-player/Header';
import ToggleTranscriptButton from '../../components/video-player/ToggleTranscriptButton';
import Transcript from '../../components/video-player/Transcript';
import VideoPlayer from '../../components/video-player/VideoPlayer';
import { useTheme } from '../../context/ThemeContext';
import { responsive } from '../../theme/video-player/responsive';


import { AutoItem, autoTimeTranscript } from '@/utils/autoTimecode';

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
  const [isLoading, setIsLoading] = useState(true);

  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState<number | undefined>(undefined);


  const transcriptAnim = useRef(new Animated.Value(0)).current;
  const lastSentRef = useRef(0);        
  const sentOnceRef = useRef(false);    
  const wasPlayingRef = useRef(false);  

  const THROTTLE_SECONDS = 10;

  const maybeSendHistory = (sec: number, force = false) => {
    if (!media_id) return;
    const rounded = Math.max(0, Math.floor(sec));
    if (force || rounded - lastSentRef.current >= THROTTLE_SECONDS) {
      upsertHistory({
        media_id: String(media_id),
        progress_sec: rounded,
        duration_sec: durationSec ?? 0,
      }).catch(() => {});
      lastSentRef.current = rounded;
      sentOnceRef.current = true;
    }
  };

  const handleLoaded = () => {
    setIsLoading(false);
    setTimeout(() => {
      videoRef.current?.playAsync();
      setIsPaused(false);
    }, 200);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    const sec = (status.positionMillis ?? 0) / 1000;
    const dur = status.durationMillis ? Math.floor(status.durationMillis / 1000) : undefined;

    setIsPaused(!status.isPlaying);
    setCurrentSec(sec);
    setDurationSec(dur);

    
    if (!sentOnceRef.current && media_id) {
      upsertHistory({
        media_id: String(media_id),
        progress_sec: Math.floor(sec),
        duration_sec: dur ?? 0,
      }).catch(() => {});
      sentOnceRef.current = true;
      lastSentRef.current = Math.floor(sec);
    }

    // throttled
    if (status.isPlaying) {
      maybeSendHistory(sec, false);
    }

 
    if (wasPlayingRef.current && !status.isPlaying) {
      maybeSendHistory(sec, true);
    }
    wasPlayingRef.current = status.isPlaying;
  };


  useEffect(() => {
    return () => {
      maybeSendHistory(currentSec, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSec, durationSec, media_id]);


  useEffect(() => {
    Animated.timing(transcriptAnim, {
      toValue: showTranscript ? 1 : 0,
      duration: 330,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [showTranscript, transcriptAnim]);

  
  useEffect(() => {
    if (!media_id) return;
    setIsLoading(true);
    fetchMediaById(media_id)
      .then((data) => {
        setMedia(data);
        setIsLoading(false);
      
        upsertHistory({
          media_id: String(media_id),
          progress_sec: 0,
          duration_sec: 0,
        }).catch(() => {});
      })
      .catch((err) => {
        setIsLoading(false);
        console.error('fetch error', err);
      });
  }, [media_id]);


  const autoItems: AutoItem[] = useMemo(() => {
    const d = Math.max(1, Math.floor(durationSec ?? 1));
    return autoTimeTranscript(media?.media_transcript, d);
  }, [media?.media_transcript, durationSec]);

  const transcriptOpacity = transcriptAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const transcriptTranslate = transcriptAnim.interpolate({ inputRange: [0, 1], outputRange: [32, 0] });

  if (isLoading || !media) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{isLoading ? 'Loading...' : 'Error: Media not found'}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: videoplayer.videoPlayerBg, overflow: 'hidden' }}>
      <Header title={media.media_title} />

      <View
        style={{
          alignItems: 'center',
          width: '100%',
          flex: !showTranscript ? 1 : undefined,
          justifyContent: !showTranscript ? 'center' : undefined,
        }}
      >
        <VideoPlayer
          videoRef={videoRef}
          url={resolvePlayableUrl(media.media_url)}
          isLoading={isLoading}
          handleLoaded={handleLoaded}
          handlePlaybackStatusUpdate={handlePlaybackStatusUpdate}
          setIsLoading={setIsLoading}
        />

        <ToggleTranscriptButton
          showTranscript={showTranscript}
          onPress={() => setShowTranscript(!showTranscript)}
          pressed={setPressed}
        />

        <Animated.View
          pointerEvents={showTranscript ? 'auto' : 'none'}
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
             
              transcript={autoItems as any}
              highlightWords={HIGHLIGHT_WORDS}
              currentTime={currentSec}
              onSeek={(sec) =>
                videoRef.current?.setPositionAsync(Math.max(0, Math.floor((sec ?? 0) * 1000)))
              }
              height={360}
            />
          )}
        </Animated.View>

        <View style={{ height: 24 }} />
      </View>
    </View>
  );
}
