import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface VideoPlayerProps {
  videoUrl: string;
  vars: any;
  isLoading: boolean;
  handleLoaded: () => void;
  setIsLoading: (v: boolean) => void;
  colors: any;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export default function VideoPlayer({
  videoUrl, vars, isLoading, handleLoaded, setIsLoading, videoRef
}: any) {
    const { colors } = useTheme();
    
  return (
    <div style={{
      width: vars.CARD_WIDTH,
      background: colors.videoBg,
      borderRadius: vars.CARD_RADIUS,
      overflow: 'hidden',
      boxShadow: '0 11px 20px 0 rgba(64,96,133,0.19)',
      border: colors.videoBorder,
      alignItems: 'center',
      marginBottom: 18,
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.4s cubic-bezier(.6,0,.45,1)',
    }}>
      <div style={{
        width: '100%',
        height: vars.CARD_HEIGHT,
        borderRadius: vars.CARD_RADIUS,
        overflow: 'hidden',
        background: colors.videoBg,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.4s cubic-bezier(.6,0,.45,1)',
      }}>
        <video
          ref={videoRef}
          src={videoUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: colors.videoBg,
          }}
          controls
          onLoadedData={handleLoaded}
          onLoadStart={() => setIsLoading(true)}
          onError={() => setIsLoading(false)}
          poster="https://dummyimage.com/600x338/eef4fa/ccc"
        />
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: colors.loaderBoxBg,
            zIndex: 99,
          }}>
            <div className="loader" style={{ marginBottom: 8 }} />
            <span style={{
              color: colors.loadingText,
              fontWeight: 600,
              fontSize: 15,
              marginTop: 8,
              letterSpacing: 0.3,
            }}>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
