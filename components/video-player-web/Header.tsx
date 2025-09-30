import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { ellipsizeSmart } from "../../utils/ellipsize";

interface HeaderProps {
  vars: any;                 // { CARD_WIDTH, HEADER_FONT, ... }
  videoTitle?: string;
  colors: any;
}

export default function Header({ vars, videoTitle }: HeaderProps) {
  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;


  const raw = (videoTitle ?? "Film").trim() || "Film";
  const hasSpaces = /\s/.test(raw);
  const isExtreme = raw.length > 160;
  const display = hasSpaces && !isExtreme
    ? raw
    : ellipsizeSmart(raw, { maxWords: 12, maxChars: 120 });

  return (
    <div
      style={{
        width: vars.CARD_WIDTH,
        alignSelf: "center",
        alignItems: "center",
        marginTop: 18,
        marginBottom: 10,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.4s cubic-bezier(.6,0,.45,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: 'center',
          gap: 5,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0, 
        }}
      >
        <FaPlayCircle size={vars.HEADER_FONT} color={videoplayer.iconTimeTag} />
        <span
          title={raw}
          aria-label={raw}
          style={{
            fontWeight: 800,
            fontFamily: "serif",
            letterSpacing: 0.3,
            color: videoplayer.headerTitle,
            fontSize: vars.HEADER_FONT,
            textShadow: videoplayer.headerTitleShadow,
            marginLeft: 4,
            
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            flexShrink: 1,
            display: "inline-block",
               textAlign: 'center',
 
  
 

 
          }}
        >
          {display}
        </span>
      </div>

      <div
        style={{
          height: 3,
          background: videoplayer.headerBar,
          borderRadius: 20,
          marginTop: 10,
          marginBottom: 8,
          width: "40%",
          alignSelf: "center",
        }}
      />
    </div>
  );
}
