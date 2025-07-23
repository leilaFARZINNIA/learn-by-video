import React from 'react';
import { FaClock } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext';

interface TranscriptCardProps {
  showTranscript: boolean;
  transcript: any[];
  vars: any;
  colors: any;
  highlightWords: string[];
}

export default function TranscriptCard({ showTranscript, transcript, vars, highlightWords }: TranscriptCardProps) {
    const { colors } = useTheme();
  return (
    <div style={{
      width: vars.CARD_WIDTH,
      height: showTranscript ? vars.CARD_HEIGHT/1.7 : 0,
      background: colors.cardBg,
      borderRadius: vars.CARD_RADIUS,
      boxShadow: colors.transcriptshadow,
      border: colors.transcriptBorder,
      padding: showTranscript ? vars.CARD_PADDING : 0,
      marginBottom: 35,
      alignSelf: 'center',
      marginTop: 10,
      transition: 'all 0.35s cubic-bezier(.65,0,.35,1)',
      opacity: showTranscript ? 1 : 0.08,
      overflow: 'auto',
      pointerEvents: showTranscript ? 'auto' : 'none',
      display: 'block',
    }}>
      {showTranscript && (
        <div>
          <div style={{
            fontWeight: 700,
            color: colors.transcriptTitle,
            marginBottom: 14,
            fontFamily: 'serif',
            letterSpacing: 0.2,
            fontSize: vars.TITLE_FONT,
          }}>
            Transcript
          </div>
          {transcript.map((item, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                width: '100%',
                flexWrap: 'nowrap',
                minHeight: vars.TRANSCRIPT_FONT + 19,
                marginBottom: vars.LINE_SPACING,
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  background: colors.timeTag,
                  borderRadius: 8,
                  padding: '3px 10px',
                  marginRight: 12,
                  minWidth: vars.TIME_FONT * 4.1,
                  alignSelf: 'flex-start',
                  marginTop: 2,
                }}>

                <FaClock size={vars.TIME_FONT - 1} color={colors.iconTimeTag} />
                  
                  <span style={{
                    fontSize: vars.TIME_FONT,
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    color: colors.transcriptTitle,
                    marginLeft: 3
                  }}>
                    {`00:${String(item.time).padStart(2, '0')}`}
                  </span>
                </div>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  color: colors.transcriptText,
                  marginTop: 0.5,
                  minWidth: 0,
                }}>
                  {item.text.map((word: string, j: number) => (
                    <span
                      key={j}
                      style={{
                        color: highlightWords.includes(word) ? colors.highlight : colors.transcriptText,
                        fontWeight: highlightWords.includes(word) ? 700 : 500,
                        fontSize: vars.TRANSCRIPT_FONT,
                        borderRadius: Math.floor(vars.TRANSCRIPT_FONT * 0.48),
                        padding: `0 ${vars.TRANSCRIPT_FONT * 0.45}px`,
                        margin: `0 ${vars.TRANSCRIPT_FONT * 0.29}px 1.5px 0`,
                        background: highlightWords.includes(word) ? colors.highlightBg : 'transparent',
                        border: highlightWords.includes(word) ? colors.highlightBorder : undefined,
                        display: 'inline-block',
                        transition: 'all 0.18s',
                      }}
                    >
                      {word + ' '}
                    </span>
                  ))}
                </div>
              </div>
              {idx !== transcript.length - 1 && (
                <div style={{
                  height: 1,
                  background: colors.divider,
                  margin: '15px 0',
                  width: '88%',
                  alignSelf: 'flex-end',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
