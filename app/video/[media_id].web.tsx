// (video-player-web)
import { upsertHistory } from '@/api/history';
import { useAutoStopMedia } from '@/utils/mediaLifecycle';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchMediaById } from '../../api/media-api';
import Header from '../../components/video-player-web/Header';
import ToggleTranscriptButton from '../../components/video-player-web/ToggleTranscriptButton';
import TranscriptCard from '../../components/video-player-web/TranscriptCard';
import VideoPlayer from '../../components/video-player-web/VideoPlayer';
import { HIGHLIGHT_WORDS } from '../../constants/media/transcript-highlight';
import { useTheme } from '../../context/ThemeContext';
import { getResponsiveVars } from '../../theme/video-player-web/responsive';


import { AutoItem, autoTimeTranscript } from '@/utils/autoTimecode';

const THROTTLE_SECONDS = 10;

const VideoTranscriptScreen: React.FC = () => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 800
  );
  const vars = getResponsiveVars(windowWidth, showTranscript);
  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;
  const htmlVideoRef = useRef<HTMLVideoElement>(null);
  useAutoStopMedia({ htmlVideoRef, mode: 'unload' });

  const [isLoading, setIsLoading] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState<number | undefined>();

  const lastSentRef = useRef(0);
  const sentOnceRef = useRef(false);
  const { media_id } = useLocalSearchParams<{ media_id?: string }>();

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!media_id) return;
    setIsLoading(true);
    fetchMediaById(media_id)
      .then((data) => {
        setMedia(data);
        setLoading(false);
        upsertHistory({ media_id: String(media_id), progress_sec: 0, duration_sec: 0 }).catch(() => {});
      })
      .catch((err) => {
        setIsLoading(false);
        console.error('fetch error', err);
      });
  }, [media_id]);

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

  useEffect(() => {
    const v = htmlVideoRef.current;
    if (!v) return;

    const onTime = () => {
      const sec = v.currentTime || 0;
      setCurrentSec(sec);
      if (!v.paused && !v.ended) maybeSendHistory(sec, false);
    };

    const onLoadedMeta = () => {
      setDurationSec(isFinite(v.duration) ? Math.floor(v.duration) : undefined);
      if (!sentOnceRef.current) maybeSendHistory(v.currentTime || 0, true);
    };

    const onPause = () => maybeSendHistory(v.currentTime || 0, true);
    const onEnded = () => maybeSendHistory(v.duration || v.currentTime || 0, true);

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('seeking', onTime);
    v.addEventListener('loadedmetadata', onLoadedMeta);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);

    const onBeforeUnload = () => maybeSendHistory(v.currentTime || 0, true);
    const onVisibility = () => { if (document.hidden) maybeSendHistory(v.currentTime || 0, true); };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('seeking', onTime);
      v.removeEventListener('loadedmetadata', onLoadedMeta);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [media?.media_url, media_id, durationSec]);

 
  const autoItems: AutoItem[] = useMemo(() => {
    const d = Math.max(1, Math.floor(durationSec ?? 1));
    return autoTimeTranscript(media?.media_transcript, d);
  }, [media?.media_transcript, durationSec]);

  if (loading) return <div>Loading…</div>;
  if (!media) return <div>Error: Media not found</div>;

  const handleLoaded = () => {
    setIsLoading(false);
    setTimeout(() => { htmlVideoRef.current?.play().catch(() => {}); }, 200);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: videoplayer.videoPlayerBg,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Header vars={vars} videoTitle={media.media_title} colors={videoplayer} />
      <div style={{ alignItems: 'center', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <VideoPlayer
          videoUrl={media.media_url}
          vars={vars}
          isLoading={isLoading}
          handleLoaded={handleLoaded}
          setIsLoading={setIsLoading}
          colors={videoplayer}
          videoRef={htmlVideoRef}
        />

        <ToggleTranscriptButton
          showTranscript={showTranscript}
          pressed={pressed}
          setPressed={setPressed}
          onClick={() => setShowTranscript((v) => !v)}
          colors={videoplayer}
        />

  
        <TranscriptCard
          showTranscript={showTranscript}
          transcript={autoItems}
          vars={vars}
          colors={videoplayer}
          highlightWords={HIGHLIGHT_WORDS}
          currentTime={currentSec}
          onSeek={(sec) => {
            if (htmlVideoRef.current) {
              htmlVideoRef.current.currentTime = Math.max(0, sec || 0);
              htmlVideoRef.current.play().catch(() => {});
            }
          }}
        />
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};

export default VideoTranscriptScreen;
