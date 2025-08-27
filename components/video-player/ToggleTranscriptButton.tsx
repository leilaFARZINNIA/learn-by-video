// components/ToggleTranscriptButton.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';



export default function ToggleTranscriptButton({ showTranscript, onPress, pressed }: any) {

  const { colors } = useTheme();
  const videoplayer = (colors as any).videoplayer;
 
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => pressed(true)}
      onPressOut={() => pressed(false)}
      style={{
        marginTop: 18,
        paddingHorizontal: 20,
        paddingVertical: 11,
        borderRadius: 18,
        backgroundColor:  videoplayer.bottomSectionBg,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: videoplayer.toggleBtnBgBoxShadow,
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.11,
        shadowRadius: 11,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: videoplayer.toggleborder,
        ...(pressed ? { backgroundColor: videoplayer.toggleBtnBgP, transform: [{ scale: 0.97 }] } : {})
      }}
      activeOpacity={0.85}
    >
      <MaterialCommunityIcons
        name={showTranscript ? "chevron-up-circle" : "chevron-down-circle"}
        size={22}
        color={videoplayer.toggeltext}
        style={{
          marginRight: 1,
          transform: [{ rotate: showTranscript ? '180deg' : '0deg' }],
        }}
      />
      <Text style={{
        fontWeight: '700',
        color: videoplayer.toggeltext,
        marginLeft: 8,
        fontSize: 16,
        letterSpacing: 0.07,
      }}>
        {showTranscript ? "Hide Transcript" : "Show Transcript"}
      </Text>
    </TouchableOpacity>
  );
}
