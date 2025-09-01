import { fetchMediaById } from "@/api/media-api";
import { useTheme } from "@/context/ThemeContext";
import { useAutoStopMedia } from '@/utils/mediaLifecycle';
import { normalizeTranscript as normalizeTranscriptItems, TranscriptItem } from "@/utils/normalizeTranscript";
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import PodcastAvatar from "@/components/podcast/PodcastAvatar";
import TimeSlider from "@/components/podcast/TimeSlider";
import Controls from "../../components/podcast/Controls";
import TranscriptList from "../../components/podcast/TranscriptList";

const PHONE_MAX_WIDTH = 420;

export default function PodcastScreen() {
  const { colors } = useTheme();
  const podcast = (colors as any).podcast;

  const { media_id } = useLocalSearchParams<{ media_id?: string }>();
  const soundRef = useRef<Audio.Sound | null>(null);
  useAutoStopMedia({ soundRef, mode: 'unload' });

  const [media, setMedia] = useState<any>(null);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(1);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const wasPlayingRef = useRef(false);

  // fetch media
  useEffect(() => {
    if (!media_id) return;
    setLoadingMedia(true);
    setError(null);
    fetchMediaById(String(media_id))
      .then((m) => setMedia(m))
      .catch((e) => setError(e?.message ?? "Fetch error"))
      .finally(() => setLoadingMedia(false));
  }, [media_id]);

  // audio mode
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // load sound
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!media?.media_url) return;
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: media.media_url },
          { shouldPlay: false, progressUpdateIntervalMillis: 250 }
        );
        if (!mounted) return;
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate(onStatus);
        const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
        if (status.isLoaded) {
          setIsLoaded(true);
          setDuration(status.durationMillis ?? 1);
        }
      } catch (e) {
        console.warn("Failed to load audio:", e);
      }
    })();
    return () => {
      mounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current = null;
      }
    };
  }, [media?.media_url]);

  // transcript items
  const transcriptItems: TranscriptItem[] = useMemo(
    () => normalizeTranscriptItems(media?.media_transcript as any),
    [media?.media_transcript]
  );

  // playback status
  const onStatus = (st: AVPlaybackStatus) => {
    if (!st.isLoaded) {
      setIsLoaded(false);
      if ("error" in st && st.error) console.warn(st.error);
      return;
    }
    setIsLoaded(true);
    setIsPlaying(st.isPlaying);
    setIsBuffering(st.isBuffering ?? false);
    setDuration(st.durationMillis ?? 1);
    if (!isSeeking) setPosition(st.positionMillis ?? 0);
  };

  // controls
  const togglePlay = async () => {
    const s = soundRef.current;
    if (!s) return;
    const status = await s.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) await s.pauseAsync();
    else await s.playAsync();
  };

  const seekBy = async (deltaMs: number) => {
    const s = soundRef.current;
    if (!s) return;
    const st = await s.getStatusAsync();
    if (!st.isLoaded) return;
    const next = Math.min(Math.max((st.positionMillis ?? 0) + deltaMs, 0), st.durationMillis ?? 1);
    await s.setPositionAsync(next);
  };

  const onSlidingStart = () => {
    wasPlayingRef.current = isPlaying;
    setIsSeeking(true);
  };
  const onValueChange = (value: number) => setPosition(value);
  const onSlidingComplete = async (value: number) => {
    const s = soundRef.current;
    if (!s) return;
    await s.setPositionAsync(value);
    setPosition(value);
    setIsSeeking(false);
    if (wasPlayingRef.current) await s.playAsync();
  };
  const jumpTo = async (sec?: number) => {
    if (!Number.isFinite(sec)) return;
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(Math.max(0, Math.floor((sec ?? 0) * 1000)));
  };

  if (loadingMedia) return <View style={[styles.center, { backgroundColor: podcast.bg }]}><ActivityIndicator /></View>;
  if (error || !media) return <View style={[styles.center, { backgroundColor: podcast.bg }]}><Text style={{ color: podcast.text }}>{error ?? "Media not found"}</Text></View>;

  const title = media.media_title ?? "Podcast";
  const art = media.media_cover || media.thumbnail_url || null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: podcast.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 40, alignItems: "center" }}>
      <View style={{ width: "100%", maxWidth: PHONE_MAX_WIDTH }}>
        {/* Header card */}
        <View style={{
          width: "100%",
          backgroundColor: podcast.card,
          borderRadius: 18,
          padding: 16,
          shadowColor: podcast.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          marginBottom: 16,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PodcastAvatar title={title} art={art} playing={isPlaying} size={112} />

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: podcast.text }} numberOfLines={2}>{title}</Text>

              <TimeSlider
                colors={podcast}
                position={position}
                duration={duration}
                onSlidingStart={onSlidingStart}
                onValueChange={onValueChange}
                onSlidingComplete={onSlidingComplete}
              />

              <Controls
                colors={podcast}
                isLoaded={isLoaded}
                isPlaying={isPlaying}
                isBuffering={isBuffering}
                onTogglePlay={togglePlay}
                onBack15={() => seekBy(-15000)}
                onFwd30={() => seekBy(30000)}
              />
            </View>
          </View>
        </View>

        {/* Transcript */}
        <View style={{
          width: "100%",
          backgroundColor: podcast.card,
          borderRadius: 18,
          padding: 16,
          shadowColor: podcast.shadow,
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: podcast.text, marginBottom: 8 }}>Transcript</Text>

          <TranscriptList
            colors={podcast}
            items={transcriptItems}
            currentTimeSec={(position ?? 0) / 1000}
            onSeek={jumpTo}
            maxHeight={360}
          />
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
