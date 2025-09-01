import { useAutoStopMedia } from '@/utils/mediaLifecycle';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { fetchMediaById } from '../../api/media-api';
import Header from '../../components/video-player-web/Header';
import ToggleTranscriptButton from '../../components/video-player-web/ToggleTranscriptButton';
import TranscriptCard from '../../components/video-player-web/TranscriptCard';
import VideoPlayer from '../../components/video-player-web/VideoPlayer';
import { HIGHLIGHT_WORDS } from '../../constants/video-player/transcript-highlight';
import { useTheme } from '../../context/ThemeContext';
import { getResponsiveVars } from '../../theme/video-player-web/responsive';

const VideoTranscriptScreen: React.FC = () => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 800
  );
  const vars = getResponsiveVars(windowWidth, showTranscript);

  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;

  const htmlVideoRef = useRef<HTMLVideoElement>(null);
  useAutoStopMedia({htmlVideoRef, mode: 'unload' });

  const [isLoading, setIsLoading] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentSec, setCurrentSec] = useState(0); 

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
      })
      .catch((err) => {
        setIsLoading(false);
        console.error('fetch error', err);
      });
  }, [media_id]);

  
  useEffect(() => {
    const v = htmlVideoRef.current;
    if (!v) return;

    const onTime = () => setCurrentSec(v.currentTime || 0);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('seeking', onTime);
    v.addEventListener('loadedmetadata', onTime);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('seeking', onTime);
      v.removeEventListener('loadedmetadata', onTime);
    };
  }, [media?.media_url]); 

  if (loading) return <div>Loading…</div>;
  if (!media) return <div>Error: Media not found</div>;

  const handleLoaded = () => {
    setIsLoading(false);
    setTimeout(() => {
      htmlVideoRef.current?.play();
    }, 200);
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

      <div
        style={{
          alignItems: 'center',
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
          transcript={media.media_transcript ?? []}
          vars={vars}
          colors={videoplayer}
          highlightWords={HIGHLIGHT_WORDS}
          currentTime={currentSec}                         
          onSeek={(sec) => { if (htmlVideoRef.current) { htmlVideoRef.current.currentTime = Math.max(0, sec || 0); htmlVideoRef.current.play(); } }}
          
          
        
       
          
          
         
        />

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};

export default VideoTranscriptScreen;
