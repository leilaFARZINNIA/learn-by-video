// components/video-player-web/TranscriptCard.tsx
import { pickActiveIndex, shouldAutoScroll, toSec } from '@/utils/autoScroll';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { normalizeTranscript } from '../../utils/normalizeTranscript';

interface TranscriptCardProps {
  showTranscript: boolean;
  transcript: string | any[];
  vars: any;
  colors?: any;
  highlightWords: string[];
  currentTime?: number;           // seconds
  onSeek?: (sec: number) => void;
}

function fmt(sec?: number) {
  const s = Math.max(0, Math.floor(sec ?? 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function TranscriptCard({
  showTranscript,
  transcript,
  vars,
  colors,
  highlightWords,
  currentTime = 0,
  onSeek,
}: TranscriptCardProps) {
  const theme = useTheme();
  const videoplayer = colors ?? ((theme.colors as any)?.videoplayer || {});

  
  const HARD_BAND_TOP = 160;          // px
  const HARD_BAND_BOTTOM = 190;       // px
  const SNAP_TOP_MARGIN = 110;        // px
  const COOLDOWN_MS = 1300;           
  const FRAME_THROTTLE_MS = 500;     
  const OUTSIDE_STREAK = 3;          

  const items = useMemo(() => {
    const arr = normalizeTranscript(transcript) as any[];
    return [...arr].sort((a, b) => toSec(a.time) - toSec(b.time));
  }, [transcript]);

  const HL = useMemo(
    () => new Set(highlightWords.map((w) => String(w).trim().toLowerCase())),
    [highlightWords]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  const activeIdxRef = useRef(-1);
  const [activeIdxState, setActiveIdxState] = useState(-1);

  
  const lastManualRef = useRef(0);
  const programmaticRef = useRef(false);


  const lastAutoAtRef = useRef(0);
  const outsideCountRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;
    const onUser = () => { if (!programmaticRef.current) lastManualRef.current = Date.now(); };
    cont.addEventListener('scroll', onUser, { passive: true });
    cont.addEventListener('wheel', onUser, { passive: true });
    cont.addEventListener('touchmove', onUser, { passive: true });
    return () => {
      cont.removeEventListener('scroll', onUser);
      cont.removeEventListener('wheel', onUser);
      cont.removeEventListener('touchmove', onUser);
    };
  }, []);

  useEffect(() => {
    if (!items.length || !showTranscript) return;

    // throttle
    const nowTick = Date.now();
    if (nowTick - lastTickRef.current < FRAME_THROTTLE_MS) return;
    lastTickRef.current = nowTick;


    if (!shouldAutoScroll(lastManualRef.current, 900)) return;

    const idx = pickActiveIndex(items.map((it) => it.time), currentTime);


    if (idx !== activeIdxRef.current) {
      activeIdxRef.current = idx;
      setActiveIdxState(idx);
    }

    const cont = containerRef.current;
    const rowEl = rowRefs.current[idx];
    if (!cont || !rowEl) return;


    const contRect = cont.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();

    const rowTopInCont = cont.scrollTop + (rowRect.top - contRect.top);
    const rowBottomInCont = rowTopInCont + rowEl.offsetHeight;


    const bandTopAbs = cont.scrollTop + HARD_BAND_TOP;
    const bandBottomAbs = cont.scrollTop + cont.clientHeight - HARD_BAND_BOTTOM;

    const above = rowTopInCont < bandTopAbs;
    const below = rowBottomInCont > bandBottomAbs;

    if (!(above || below)) {
      outsideCountRef.current = 0;
      return;
    }

    outsideCountRef.current += 1;

    const now = Date.now();
    const cooldownOk = now - lastAutoAtRef.current >= COOLDOWN_MS;

    if (outsideCountRef.current >= OUTSIDE_STREAK && cooldownOk) {
      const target = Math.max(rowTopInCont - SNAP_TOP_MARGIN, 0);
      programmaticRef.current = true;
      cont.scrollTo({ top: target, behavior: 'smooth' });
      lastAutoAtRef.current = now;
      outsideCountRef.current = 0;
      window.setTimeout(() => { programmaticRef.current = false; }, 280);
    }
  }, [currentTime, items, showTranscript]);

  return (
    <div
      ref={containerRef}
      style={{
        width: vars.CARD_WIDTH,
        height: showTranscript ? vars.CARD_HEIGHT / 1.7 : 0,
        background: videoplayer.cardBg,
        borderRadius: vars.CARD_RADIUS,
        boxShadow: videoplayer.transcriptshadow,
        border: videoplayer.transcriptBorder,
        padding: showTranscript ? vars.CARD_PADDING : 0,
        marginBottom: 35,
        alignSelf: 'center',
        marginTop: 10,
        transition: 'all 0.35s cubic-bezier(.65,0,.35,1)',
        opacity: showTranscript ? 1 : 0.08,
        overflow: 'auto',
        pointerEvents: showTranscript ? 'auto' : 'none',
        display: 'block',
      }}
    >
      {showTranscript && (
        <div>
          <div style={{
            fontWeight: 700,
            color: videoplayer.transcriptTitle,
            marginBottom: 14,
            fontFamily: 'serif',
            letterSpacing: 0.2,
            fontSize: vars.TITLE_FONT,
          }}>Transcript</div>

          {items.map((item: any, idx: number) => {
            const sec = toSec(item.time);
            const isActive = idx === activeIdxState;

            return (
              <React.Fragment key={idx}>
                <div
                  ref={(el) => { rowRefs.current[idx] = el; }}
                  onClick={() => onSeek?.(sec)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexWrap: 'nowrap',
                    minHeight: vars.TRANSCRIPT_FONT + 19,
                    marginBottom: vars.LINE_SPACING,
                    padding: '2px 6px 2px 0',
                    borderRadius: 8,
                    background: isActive
                      ? (videoplayer.activeRowBg || 'rgba(0,0,0,0.04)')
                      : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {/* time chip */}
                  <div
                    onClick={(e) => { e.stopPropagation(); onSeek?.(sec); }}
                    title="Seek to time"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      background: videoplayer.timeTag,
                      borderRadius: 8,
                      padding: '3px 10px',
                      marginRight: 12,
                      minWidth: vars.TIME_FONT * 4.1,
                      alignSelf: 'flex-start',
                      marginTop: 2,
                      userSelect: 'none',
                    }}
                  >
                    <FaClock size={vars.TIME_FONT - 1} color={videoplayer.iconTimeTag} />
                    <span style={{
                      fontSize: vars.TIME_FONT,
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: videoplayer.transcriptTitle,
                      marginLeft: 6,
                    }}>
                      {fmt(sec)}
                    </span>
                  </div>

                  {/* words */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    color: videoplayer.transcriptText,
                    marginTop: 0.5,
                    minWidth: 0,
                  }}>
                    {item.text.map((w: string, j: number) => {
                      const clean = String(w);
                      const norm = clean.replace(/[\.,!?;:]/g, '').toLowerCase();
                      const hit = HL.has(norm);
                      return (
                        <span
                          key={`${clean}-${j}`}
                          style={{
                            color: hit ? videoplayer.highlight : videoplayer.transcriptText,
                            fontWeight: hit ? 700 : 500,
                            fontSize: vars.TRANSCRIPT_FONT,
                            borderRadius: Math.floor(vars.TRANSCRIPT_FONT * 0.48),
                            padding: hit ? `0 ${vars.TRANSCRIPT_FONT * 0.45}px` : 0,
                            margin: hit ? `0 ${vars.TRANSCRIPT_FONT * 0.29}px 1.5px 0` : '0',
                            background: hit ? videoplayer.highlightBg : 'transparent',
                            border: hit ? videoplayer.highlightBorder : undefined,
                            display: 'inline-block',
                            transition: 'all 0.18s',
                          }}
                        >
                          {clean + ' '}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* divider */}
                {idx !== items.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      background: videoplayer.divider,
                      margin: '15px 0',
                      width: '88%',
                      alignSelf: 'flex-end',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
