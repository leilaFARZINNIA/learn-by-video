import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

interface ToggleTranscriptButtonProps {
  showTranscript: boolean;
  pressed: boolean;
  setPressed: (v: boolean) => void;
  onClick: () => void;
  colors: any;
}

export default function ToggleTranscriptButton({ showTranscript, pressed, setPressed, onClick}: ToggleTranscriptButtonProps) {
    const { colors } = useTheme();
  return (
    <button
      style={{
        marginTop: 18,
        padding: '11px 20px',
        borderRadius: 18,
        background: pressed ? colors.toggleBtnBgP : colors.toggleBtnBg,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        boxShadow: colors.toggleBtnBgBoxShadow,
        alignSelf: 'center',
        border: colors.toggleborder,
        cursor: 'pointer',
        transform: pressed ? 'scale(0.97)' : undefined,
        transition: 'all 0.11s',
        outline: 'none',
        userSelect: 'none',
      }}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {showTranscript ? (
        <FaChevronUp size={22} color={colors.iconTimeTag} style={{ marginRight: 3, transition: 'transform 0.22s', transform: showTranscript ? 'rotate(180deg)' : 'none' }} />
      ) : (
        <FaChevronDown size={22} color={colors.iconTimeTag} style={{ marginRight: 3 }} />
      )}
      <span style={{
        fontWeight: 700,
        color: colors.toggeltext,
        marginLeft: 8,
        fontSize: 16,
        letterSpacing: 0.07,
      }}>
        {showTranscript ? "Hide Transcript" : "Show Transcript"}
      </span>
    </button>
  );
}
