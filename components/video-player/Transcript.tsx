import { pickActiveIndex, shouldAutoScroll, toSec } from '@/utils/autoScroll';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { responsive } from '../../theme/video-player/responsive';
import { normalizeTranscript } from '../../utils/normalizeTranscript';

type TI = { time: number | string; text: string[] };

type Props = {
  transcript: string | any[];
  highlightWords?: string[];
  currentTime?: number;
  onSeek?: (sec: number) => void;

  height?: number;
  autoScrollLockMs?: number;
  minAutoScrollGapMs?: number;
  preIndexOffset?: number;
  viewPosition?: number;
};

function fmt(sec?: number) {
  const s = Math.max(0, Math.floor(sec ?? 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function Transcript({
  transcript,
  highlightWords = [],
  currentTime = 0,
  onSeek,

  height = 360,

  autoScrollLockMs = 150,
  minAutoScrollGapMs = 0,
  preIndexOffset = 1,
  viewPosition = 0.08,
}: Props) {
  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;

 
  const items: TI[] = useMemo(() => {
    const arr = normalizeTranscript(transcript) as TI[];
    return [...arr].sort((a, b) => toSec(a.time) - toSec(b.time));
  }, [transcript]);

  const times = useMemo(() => items.map(it => it.time), [items]);

  const HL = useMemo(
    () => new Set(highlightWords.map((w) => String(w).trim().toLowerCase())),
    [highlightWords]
  );


  const HEADER_H = Math.max(32, Math.round(responsive.titleFont + 20));        
  const ROW_H    = Math.max(34, Math.round(responsive.transcriptFont + 24));  
  const SEP_H    = 6;  


  const listRef = useRef<FlatList<TI>>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(-1);


  const lastUserScrollAt = useRef(0);
  const lastAutoAtRef = useRef(0);


  const getItemLayout = (_: ArrayLike<TI> | null | undefined, index: number) => ({
    length: ROW_H + SEP_H,
    offset: HEADER_H + (ROW_H + SEP_H) * index,
    index,
  });


  const onScrollBeginDrag = () => { lastUserScrollAt.current = Date.now(); };
  const onMomentumScrollBegin = () => { lastUserScrollAt.current = Date.now(); };
  const onScroll = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
  
  };

 
  useEffect(() => {
    if (!items.length) return;

    const nowSec = currentTime > 10000 ? currentTime / 1000 : currentTime;
    const idx = pickActiveIndex(times, nowSec, 0.03);

    if (idx !== activeIdxRef.current) {
      activeIdxRef.current = idx;
      setActiveIdx(idx);

      if (!shouldAutoScroll(lastUserScrollAt.current, autoScrollLockMs)) return;

      const target = Math.max(0, idx - preIndexOffset);
      const scrollTo = () => listRef.current?.scrollToIndex({ index: target, viewPosition, animated: true });

      try { scrollTo(); }
      catch { setTimeout(scrollTo, 50); }
      lastAutoAtRef.current = Date.now();
    }
  }, [currentTime, items.length, times, autoScrollLockMs, preIndexOffset, viewPosition]);

  const activeBg = videoplayer?.activeRowBg ?? 'rgba(0,0,0,0.06)';

  const renderItem = ({ item, index }: ListRenderItemInfo<TI>) => {
    const seconds = toSec(item.time);
    const isActive = index === activeIdx;

    return (
      <Pressable
        android_ripple={{ color: videoplayer?.divider ?? '#e5e7eb' }}
        onPress={() => onSeek?.(seconds)}
        style={[
          styles.rowWrap,
          { minHeight: ROW_H - 6 },
          isActive && { backgroundColor: activeBg, borderRadius: 8 },
        ]}
      >
        {/* time chip */}
        <Pressable
          onPress={() => onSeek?.(seconds)}
          style={[
            styles.timeChip,
            {
              backgroundColor: videoplayer.timeTag,
              minWidth: responsive.timeFont * 4.1,
              marginRight: 12,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            size={responsive.timeFont - 1}
            color={videoplayer.iconTimeTag}
          />
          <Text
            style={{
              fontSize: responsive.timeFont,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: videoplayer.transcriptTitle,
              marginLeft: 6,
            }}
          >
            {fmt(seconds)}
          </Text>
        </Pressable>

        {/* words */}
        <View style={styles.wordsWrap}>
          {item.text.map((raw: string, j: number) => {
            const clean = String(raw);
            const norm = clean.replace(/[\.,!?;:]/g, '').toLowerCase();
            const hit = HL.has(norm);
            return (
              <Text
                key={`${clean}-${j}`}
                style={{
                  color: hit ? videoplayer.highlight : videoplayer.transcriptText,
                  fontWeight: hit ? '700' : '500',
                  fontSize: responsive.transcriptFont,
                  borderRadius: Math.floor(responsive.transcriptFont * 0.48),
                  paddingHorizontal: hit ? responsive.transcriptFont * 0.45 : 0,
                  marginHorizontal: hit ? responsive.transcriptFont * 0.29 : 0,
                  marginBottom: hit ? 1.5 : 0,
                  backgroundColor: hit ? videoplayer.highlightBg : 'transparent',
                  borderWidth: hit ? 0.5 : 0,
                  borderColor: hit ? videoplayer.highlightBg : 'transparent',
                }}
              >
                {clean + ' '}
              </Text>
            );
          })}
        </View>
      </Pressable>
    );
  };

  if (!items.length) {
    return (
      <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: videoplayer.transcriptText, opacity: 0.7 }}>
          Transcript not available
        </Text>
      </View>
    );
  }

  return (
    <FlatList<TI>
      ref={listRef}
      data={items}
      keyExtractor={(_, i) => String(i)}
      style={{ height }}                                 
      contentContainerStyle={{ paddingTop: 0, paddingBottom: 12 }}
      showsVerticalScrollIndicator
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: SEP_H }} />} 
      getItemLayout={getItemLayout}
      initialNumToRender={30}
      maxToRenderPerBatch={40}
      windowSize={10}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      onMomentumScrollBegin={onMomentumScrollBegin}
      removeClippedSubviews={false}
      
      ListHeaderComponent={
        <View style={{ height: HEADER_H, justifyContent: 'flex-end' }}>
          <Text style={{
            fontWeight: '700',
            color: videoplayer.transcriptTitle,
            marginBottom: 14,
            fontFamily: 'serif',
            letterSpacing: 0.2,
            fontSize: responsive.titleFont,
            paddingHorizontal: 2,
          }}>
            Transcript
          </Text>
        </View>
      }
      onScrollToIndexFailed={({ index }) => {
        
        const rawOffset = HEADER_H + (ROW_H + SEP_H) * index;
        listRef.current?.scrollToOffset({ offset: rawOffset, animated: false });
        setTimeout(() => {
          listRef.current?.scrollToIndex({ index, viewPosition, animated: true });
        }, 50);
      }}
    />
  );
}

const styles = StyleSheet.create({
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'nowrap',
    paddingVertical: 6,
    paddingRight: 6,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  wordsWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    minWidth: 0,
  },
});
