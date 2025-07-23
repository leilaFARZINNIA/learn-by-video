import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import Header from '../../components/videoPlayerWeb/Header';
import ToggleTranscriptButton from '../../components/videoPlayerWeb/ToggleTranscriptButton';
import TranscriptCard from '../../components/videoPlayerWeb/TranscriptCard';
import VideoPlayer from '../../components/videoPlayerWeb/VideoPlayer';
import { HIGHLIGHT_WORDS, TRANSCRIPT } from '../../constants/videoPlayer/transcriptData';
import { useTheme } from '../../context/ThemeContext';
import { getResponsiveVars } from '../../theme/videoPlayerWeb/responsive';

const VideoTranscriptScreen: React.FC = () => {

  const { url, title } = useLocalSearchParams<{ title?: string; url?: string }>();
  const [showTranscript, setShowTranscript] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 800);
  const vars = getResponsiveVars(windowWidth, showTranscript);
  const { colors } = useTheme();


  // Listener für Fenstergröße hinzufügen/entfernen
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);


  const videoUrl = url || "https://www.w3schools.com/html/mov_bbb.mp4";
  const videoTitle = title || "Intro";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pressed, setPressed] = useState(false);

 
  const handleLoaded = () => {
    setIsLoading(false);
    setTimeout(() => {
      videoRef.current?.play();
    }, 200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.videoPlayerBg,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Kopfzeile mit Titel */}
      <Header vars={vars} videoTitle={videoTitle} colors={colors} />
      <div style={{ alignItems: 'center', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Videoplayer */}
        <VideoPlayer
          videoUrl={videoUrl}
          vars={vars}
          isLoading={isLoading}
          handleLoaded={handleLoaded}
          setIsLoading={setIsLoading}
          colors={colors}
          videoRef={videoRef}
        />
        {/* Umschaltknopf für Transcript */}
        <ToggleTranscriptButton
          showTranscript={showTranscript}
          pressed={pressed}
          setPressed={setPressed}
          onClick={() => setShowTranscript((v) => !v)}
          colors={colors}
        />
        {/* Transcript Bereich */}
        <TranscriptCard
          showTranscript={showTranscript}
          transcript={TRANSCRIPT}
          vars={vars}
          colors={colors}
          highlightWords={HIGHLIGHT_WORDS}
        />
        {/* Abstand unten */}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};

export default VideoTranscriptScreen;
