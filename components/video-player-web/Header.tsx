import React from 'react';
import { FaPlayCircle } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  vars: any;
  videoTitle: string;
  colors: any;
}

export default function Header({ vars, videoTitle }: HeaderProps) {
      const { colors } = useTheme();
      const videoplayer = (colors as any).videoplayer;
  return (
    <div style={{
      width: vars.CARD_WIDTH,
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: 18,
      marginBottom: 10,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.4s cubic-bezier(.6,0,.45,1)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      }}>
        <FaPlayCircle size={vars.HEADER_FONT} color={ videoplayer.iconTimeTag} />
        <span style={{
          fontWeight: 800,
          fontFamily: 'serif',
          letterSpacing: 0.3,
          color:  videoplayer.headerTitle,
          fontSize: vars.HEADER_FONT,
          textShadow:  videoplayer.headerTitleShadow,
          marginLeft: 4,
        }}>
          {videoTitle}
        </span>
      </div>
      <div style={{
        height: 3,
        background: videoplayer.headerBar,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 8,
        width: '40%',
        alignSelf: 'center',
      }} />
    </div>
  );
}
