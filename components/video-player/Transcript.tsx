// components/Transcript.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { responsive } from '../../theme/video-player/responsive';
import { normalizeTranscript } from '../../utils/normalizeTranscript';


export default function Transcript({ transcript, highlightWords }: any) {
  const { colors } = useTheme();
  const normalizedTranscript = normalizeTranscript(transcript)
  return (
    <ScrollView style={{ flexGrow: 0 }} showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: 12 }}>
      <Text style={{
        fontWeight: '700',
        color: colors.transcriptTitle,
        marginBottom: 14,
        fontFamily: 'serif',
        letterSpacing: 0.2,
        fontSize: responsive.titleFont,
      }}>Transcript</Text>
       {normalizedTranscript.map((item, idx) => (
        <View key={idx}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
            flexWrap: 'nowrap',
            minHeight: responsive.transcriptFont + 19,
            marginBottom: responsive.lineSpacing
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.timeTag,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 3,
              marginRight: 12,
              minWidth: responsive.timeFont * 4.1,
              alignSelf: 'flex-start',
              marginTop: 2,
            }}>
              <MaterialCommunityIcons name="clock-outline" size={responsive.timeFont - 1} color={colors.iconTimeTag}/>
              <Text style={{ fontSize: responsive.timeFont, fontFamily: 'monospace', fontWeight: 'bold', color: colors.transcriptTitle, marginLeft: 3 }}>
                {`00:${String(item.time).padStart(2, '0')}`}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', minWidth: 0 }}>
            {item.text.map((word: string, j: number) => (
                <Text
                  key={j}
                  style={{
                    color:highlightWords.includes(word.replace(/[\.,!?]/g, "")) ? colors.highlight:colors.transcriptText,
                    fontWeight: highlightWords.includes(word.replace(/[\.,!?]/g, "")) ? '700' : '500',
                    fontSize: responsive.transcriptFont,
                    borderRadius: Math.floor(responsive.transcriptFont * 0.48),
                    paddingHorizontal: responsive.transcriptFont * 0.45,
                    marginHorizontal: responsive.transcriptFont * 0.29,
                    marginBottom: 1.5,
                    backgroundColor: highlightWords.includes(word.replace(/[\.,!?]/g, "")) ? colors.highlightBg : 'transparent',
                    borderWidth: highlightWords.includes(word.replace(/[\.,!?]/g, "")) ? 0.5 : 0,
                    borderColor: highlightWords.includes(word.replace(/[\.,!?]/g, "")) ? colors.highlightBg : 'transparent',
                  }}
                >
                  {word + ' '}
                </Text>
              ))}
            </View>
          </View>
          {idx !== transcript.length - 1 && (
            <View style={{
              height: 1,
              backgroundColor: colors.divider,
              marginVertical: 2,
              width: '88%',
              alignSelf: 'flex-end',
            }} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}
