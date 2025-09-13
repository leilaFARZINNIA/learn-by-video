// components/VideoPlayer.tsx
import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { responsive } from '../../theme/video-player/responsive';

export default function VideoPlayer({
  
  videoRef, url, isLoading, handleLoaded, handlePlaybackStatusUpdate, setIsLoading,
}: any) {
  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;
  return (
    <View style={{
      width: responsive.cardWidth,
      backgroundColor: videoplayer .videoBg,
      borderRadius: responsive.cardRadius,
      overflow: 'hidden',
      shadowColor: '0 11px 20px 0 rgba(64,96,133,0.19)',
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 0.19,
      shadowRadius: 20,
      elevation: 13,
      borderWidth: 1.8,
      borderColor: videoplayer .videoBorder,
      alignItems: 'center',
      marginBottom: 18,
      marginTop: 8,
    }}>
      <View style={{
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: responsive.cardRadius,
        overflow: 'hidden',
        backgroundColor: videoplayer .videoBg,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Video
          ref={videoRef}
          source={{ uri: url }}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100%',
            height: '100%',
            borderRadius: responsive.cardRadius,
            backgroundColor:videoplayer .videoBg,
            
          }}
          resizeMode={ResizeMode.COVER}
          useNativeControls={true}
          shouldPlay={false}
          onLoadStart={() => setIsLoading(true)}
          onLoad={handleLoaded}
          onError={() => setIsLoading(false)}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          progressUpdateIntervalMillis={150}  
        />
        {isLoading && (
          <View style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: videoplayer .loaderBoxBg,
            zIndex: 99,
          }}>
            <ActivityIndicator size="large" color={videoplayer .loadingText} />
            <Text style={{
              color: videoplayer.loadingText,
              fontWeight: '600',
              fontSize: 15,
              marginTop: 8,
              letterSpacing: 0.3,
            }}>Loading...</Text>
          </View>
        )}
      </View>
    </View>
  );
}
