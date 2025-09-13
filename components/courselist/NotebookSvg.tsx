import React from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';


interface NotebookSvgProps {
  width?: number | string;
  height?: number | string;
  bgColor?: string;     // Hintergrundfarbe der gesamten Seite
  paperColor?: string;  // Papierfarbe des Notizblocks
  borderColor?: string; // Randfarbe
  borderWidth?: number; // Randbreite
  style?: any;
  gradientColors : [string, string],
}

const NotebookSvg: React.FC<NotebookSvgProps> = ({
  width = 220,
  height = 330,
  bgColor = '#008cb4',       // Standard-Hintergrundfarbe (optional)
  paperColor = '#008cb6',    // Standard-Papierfarbe (optional)
  borderColor = '#008cb4',   // Standard-Randfarbe (optional)
  borderWidth = 2,
  style,
  gradientColors,
  ...props
}) => (
  <Svg
    viewBox="0 0 300 450"
    width={width}
    height={height}
    style={style}
    {...props}
  >
    {/* Hintergrund der Seite (optional, kann entfernt werden) */}
    <Rect x="0" y="0" width="300" height="450" fill={bgColor} />

    <Defs>
    <LinearGradient id="paperGradient" x1="0" y1="0" x2="1" y2="1">
    <Stop offset="0%" stopColor={gradientColors[0]} />
    <Stop offset="100%" stopColor={gradientColors[1]} />
  </LinearGradient>
      </Defs>

    {/* Papierform des Notizblocks (innen) */}
    <Path
       fill="url(#paperGradient)"
      stroke={borderColor}
      strokeWidth={borderWidth}
      d="M97.2 105c-8.1.4-14.8 1.2-15.4 1.8-.8.8-.6 2 .6 4.5 2 4.3 2 7.7.2 12.1-3 7.3-10.3 9.6-16.7 5.3-4.6-3.1-5.6-6.3-4.1-13.6 1.7-8 1-9.3-4.2-8.6-2.2.3-9.2 1-15.4 1.5-6.2.5-11.7 1.2-12.2 1.5-1.3.8-1.3 48.1.1 79.7 1.2 28.9-.4 161-2.2 180.8-.6 6.3-1.2 17.9-1.2 25.7-.2 13.8-.1 14.2 2.3 16.8 3.9 4.2 7.2 5.4 17.2 6.5 10.9 1.1 171.4 1.2 201.6.1l20.2-.7 3-2.9c4.5-4.3 5.4-10.6 4.5-32-.4-9.9-.8-49.7-.9-88.5-.1-38.8-.5-96.6-1-128.5l-.9-57.9-2.4-2.4c-1.9-1.9-3.1-2.3-5.6-1.9-1.8.3-7.7.9-13.2 1.2-14.2.9-13.8.7-13 6.5 1.2 8.9-4.2 15.2-13.1 15.4-7.5.2-11.4-5.7-11.4-17.3v-5.4l-10.7.6c-12.3.7-14.2 1.7-12.5 6.6 2.1 6-1.7 13.4-7.7 15.2-5 1.5-9.9.5-13.3-2.6-3.2-3-3.8-4.8-4.1-13l-.2-6-6-.3c-3.3-.2-9.2-.1-13.2.3l-7.1.7.1 5.1c.4 17-9.9 25.8-20.2 17.2-4.4-3.8-5.5-8.2-4.1-16.2.9-5.3.9-6.8-.2-7.4-.7-.5-1.7-.8-2.3-.7-.5.1-7.4.4-15.3.8z"
    />

  </Svg>
);

export default NotebookSvg;

