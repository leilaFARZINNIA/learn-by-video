// app/podcast/[media_id].tsx
import { upsertHistory } from "@/api/history";
import { fetchMediaById } from "@/api/media-api";
import Controls from "@/components/podcast/Controls";
import PodcastAvatar from "@/components/podcast/PodcastAvatar";
import TimeSlider from "@/components/podcast/TimeSlider";
import TranscriptList from "@/components/podcast/TranscriptList";
import { HIGHLIGHT_WORDS } from "@/constants/media/transcript-highlight";
import { useTheme } from "@/context/ThemeContext";
import { useResponsiveContainerStyle } from "@/theme/podcast/responsive";
import { AutoItem, autoTimeTranscript } from "@/utils/autoTimecode";
import { useAutoStopMedia } from "@/utils/mediaLifecycle";
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";


export default function PodcastScreen() {
  const { colors } = useTheme();
  const podcast = (colors as any).podcast;
  const containerStyle = useResponsiveContainerStyle({});
  const { media_id } = useLocalSearchParams<{ media_id?: string }>();
  const soundRef = useRef<Audio.Sound | null>(null);
  useAutoStopMedia({ soundRef, mode: "unload" });

  const [media, setMedia] = useState<any>(null);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(1); // ms
  const [position, setPosition] = useState(0); // ms
  const [isSeeking, setIsSeeking] = useState(false);
  const wasPlayingRef = useRef(false);

  const postedOnceRef = useRef(false);
  const lastPostMsRef = useRef(0);
  const [html, setHtml] = useState<string>("");


  // ---------- fetch media ----------
  useEffect(() => {
    if (!media_id) return;
    setLoadingMedia(true);
    setError(null);
    fetchMediaById(String(media_id))
      .then((m) => setMedia(m))
      .catch((e) => setError(e?.message ?? "Fetch error"))
      .finally(() => setLoadingMedia(false));
  }, [media_id]);

  // ---------- audio mode ----------
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

  // ---------- load sound ----------
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!media?.media_url) return;
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: media.media_url },
          { shouldPlay: false, progressUpdateIntervalMillis: 300 }
        );
        if (!mounted) return;
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate(onStatus);
        const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
        if (status.isLoaded) {
          setIsLoaded(true);
          setDuration(status.durationMillis ?? 1);
          setPosition(status.positionMillis ?? 0);
          postHistory(status.positionMillis ?? 0, status.durationMillis ?? 1, true);
        }
      } catch (e) {
        console.warn("Failed to load audio:", e);
      }
    })();
    return () => {
      postHistory(position, duration, true);
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current = null;
      }
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media?.media_url]);

  

  // ---------- playback status ----------
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

  // ---------- helpers ----------
  const msToSec = (ms: number) => Math.max(1, Math.floor((ms ?? 0) / 1000));

  const postHistory = (posMs: number, durMs: number, force = false) => {
    if (!media_id) return;
    const now = Date.now();
    if (!force && now - lastPostMsRef.current < 15000) return; // throttle 15s
    lastPostMsRef.current = now;

    const progress_sec = msToSec(posMs);
    const duration_sec = msToSec(durMs || duration);
    if (!postedOnceRef.current) postedOnceRef.current = true;

    upsertHistory({ media_id: String(media_id), progress_sec, duration_sec }).catch((e) =>
      console.warn("history upsert (podcast) failed:", e?.message)
    );
  };

  // ---------- periodic upsert while playing ----------
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => postHistory(position, duration, false), 15000);
    return () => clearInterval(t);
  }, [isPlaying, position, duration]);

  // ---------- controls ----------
  const togglePlay = async () => {
    const s = soundRef.current;
    if (!s) return;
    const status = await s.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) await s.pauseAsync();
    else {
      await s.playAsync();
      postHistory(status.positionMillis ?? 0, status.durationMillis ?? duration, true);
    }
  };

  const seekBy = async (deltaMs: number) => {
    const s = soundRef.current;
    if (!s) return;
    const st = await s.getStatusAsync();
    if (!st.isLoaded) return;
    const next = Math.min(Math.max((st.positionMillis ?? 0) + deltaMs, 0), st.durationMillis ?? 1);
    await s.setPositionAsync(next);
    postHistory(next, st.durationMillis ?? duration, true);
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
    postHistory(value, duration, true);
    if (wasPlayingRef.current) await s.playAsync();
  };
  const jumpTo = async (sec?: number) => {
    if (!Number.isFinite(sec)) return;
    if (!soundRef.current) return;
    const ms = Math.max(0, Math.floor((sec ?? 0) * 1000));
    await soundRef.current.setPositionAsync(ms);
    postHistory(ms, duration, true);
  };

  // ---------- transcript (AUTO TIMING) ----------
  const transcriptItems: AutoItem[] = useMemo(() => {
    const d = msToSec(duration);
    return autoTimeTranscript(media?.media_transcript, d);
  }, [media?.media_transcript, duration]);

  // ---------- UI ----------
  if (loadingMedia)
    return <View style={[styles.center, { backgroundColor: podcast.bg }]}><ActivityIndicator /></View>;
  if (error || !media)
    return <View style={[styles.center, { backgroundColor: podcast.bg }]}><Text style={{ color: podcast.text }}>{error ?? "Media not found"}</Text></View>;

  const title = media.media_title ?? "Podcast";
  const art = media.media_cover || media.thumbnail_url || null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: podcast.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 40, alignItems: "center" }}>
      <View style={containerStyle}>
        {/* Header */}
        <View style={{
          width: "100%", backgroundColor: podcast.card, borderRadius: 18, padding: 16,
          shadowColor: podcast.shadow, shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
          elevation: 3, marginBottom: 16,
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
          width: "100%", backgroundColor: podcast.card, borderRadius: 18, padding: 16,
          shadowColor: podcast.shadow, shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
        }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: podcast.text, marginBottom: 8 }}>Transcript</Text>
          <TranscriptList
            colors={podcast}
            items={transcriptItems}
            highlightWords={HIGHLIGHT_WORDS}
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
