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
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 800);
  const vars = getResponsiveVars(windowWidth, showTranscript);
  const {  colors} = useTheme();
  const videoplayer = (colors as any).videoplayer;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { media_id } = useLocalSearchParams<{ media_id?: string }>();
  console.log("media_id param:", media_id);



  // Listener für Fenstergröße hinzufügen/entfernen

  
  useEffect(() => {
    if (!media_id) return;
    setIsLoading(true);
    fetchMediaById(media_id)
    .then(data => {
      console.log("Fetched media data: ", data); 
      setMedia(data);
      setLoading(false);
    })
      .catch(err => {
        setIsLoading(false);
        console.error("fetch error", err);
      });
  }, [media_id]);
  

  if (loading) return <div>Loading…</div>;
if (!media) return <div>Error: Media not found</div>;






 
  const handleLoaded = () => {
    setIsLoading(false);
    setTimeout(() => {
      videoRef.current?.play();
    }, 200);
  };


  
  return (
    <div style={{
      minHeight: '100vh',
      background: videoplayer.videoPlayerBg,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Kopfzeile mit Titel */}
      <Header vars={vars} videoTitle={media.media_title} colors={videoplayer} />
      <div style={{ alignItems: 'center', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Videoplayer */}
        <VideoPlayer
          videoUrl={media.media_url}
          vars={vars}
          isLoading={isLoading}
          handleLoaded={handleLoaded}
          setIsLoading={setIsLoading}
          colors={videoplayer}
          videoRef={videoRef}
        />
        {/* Umschaltknopf für Transcript */}
        <ToggleTranscriptButton
          showTranscript={showTranscript}
          pressed={pressed}
          setPressed={setPressed}
          onClick={() => setShowTranscript((v) => !v)}
          colors={videoplayer}
        />
        {/* Transcript Bereich */}
        <TranscriptCard
          showTranscript={showTranscript}
          transcript={media.media_transcript ?? []}
          vars={vars}
          colors={videoplayer}
          highlightWords={HIGHLIGHT_WORDS}
        />
        {/* Abstand unten */}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
  
};

export default VideoTranscriptScreen;
