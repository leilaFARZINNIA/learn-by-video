// utils/mediaLifecycle.ts
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';

type MediaMode = 'pause' | 'unload';


type AsyncMediaLike = {
  pauseAsync?: () => Promise<any>;
  stopAsync?: () => Promise<any>;
  unloadAsync?: () => Promise<any>;
};

type HtmlVideo = HTMLVideoElement;

type Opts = {
  soundRef?: React.RefObject<AsyncMediaLike | null>;
  videoRef?: React.RefObject<AsyncMediaLike | null>;
  htmlVideoRef?: React.RefObject<HtmlVideo | null>;
  mode?: MediaMode; // default: 'pause'
};


export function useAutoStopMedia({
  soundRef,
  videoRef,
  htmlVideoRef,
  mode = 'pause',
}: Opts) {
  const cleanup = React.useCallback(async () => {
    // Sound (expo-av)
    try {
      const s = soundRef?.current;
      if (s) {
        if (mode === 'unload' && s.unloadAsync) await s.unloadAsync();
        else if (s.stopAsync) await s.stopAsync();
        else if (s.pauseAsync) await s.pauseAsync();
      }
    } catch {}

    // Video (expo-av / expo-video-like)
    try {
      const v = videoRef?.current;
      if (v) {
        if (mode === 'unload' && v.unloadAsync) await v.unloadAsync();
        else if (v.stopAsync) await v.stopAsync();
        else if (v.pauseAsync) await v.pauseAsync();
      }
    } catch {}


    try {
      const hv = htmlVideoRef?.current;
      if (hv) {
        hv.pause();
        if (mode === 'unload') {
        
          hv.removeAttribute('src');
          hv.load();
        }
      }
    } catch {}
  }, [soundRef, videoRef, htmlVideoRef, mode]);


  useFocusEffect(
    React.useCallback(() => {
      return () => {
       
        void cleanup();
      };
    }, [cleanup])
  );


  React.useEffect(() => {
    return () => {
      void cleanup();
    };
  }, [cleanup]);
}

export function useAutoStopHtmlVideo(
  ref: React.RefObject<HTMLVideoElement | null>,
  mode: MediaMode = 'pause'
) {
  useAutoStopMedia({ htmlVideoRef: ref, mode });
}
