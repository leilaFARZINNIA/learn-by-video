// app/contact/components/Field.tsx
import React, { useState } from "react";
import { Platform, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  invalid?: boolean;
  touched?: boolean;
  helpText?: string;
  helpTextColor?: string;
  ui: any;
  autoComplete?: any;
  textContentType?: any;
  keyboardType?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  returnKeyType?: any;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Field({
  label,
  value,
  onChangeText,
  placeholder,
  invalid,
  touched,
  helpText,
  helpTextColor,
  ui,
  autoComplete,
  textContentType,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  returnKeyType,
  maxLength,
  onBlur,
  onFocus,
  onSubmitEditing,
  style,
}: Props) {
  const [focused, setFocused] = useState(false);

  const wrapStyles: any[] = [styles.inputWrap, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder }];
  if (focused) {
    wrapStyles.push({ borderColor: ui.ringFocus });
    if (Platform.OS === "web") wrapStyles.push({ boxShadow: `0 0 0 3px ${ui.ringFocus}33` } as any);
  }
  if (invalid && touched) wrapStyles.push({ borderColor: ui.danger });

  return (
    <View style={styles.field}>
      {!!label && <Text style={[styles.label, { color: ui.text }]}>{label}</Text>}
      <View style={[wrapStyles, style]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={ui.textMuted}
          // @ts-ignore
          autoComplete={autoComplete}
          textContentType={textContentType}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onSubmitEditing={onSubmitEditing}
          style={[styles.inputInner, { color: ui.text }]}
        />
      </View>
      {!!helpText && <Text style={[styles.helpText, { color: helpTextColor ?? ui.textMuted }]}>{helpText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "800", marginBottom: 8 },
  inputWrap: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, justifyContent: "center", minHeight: 48 },
  inputInner: {
    height: 46,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    ...Platform.select({ web: { outlineStyle: "none" as any, boxShadow: "none" as any } }),
  },
  helpText: { fontSize: 12, marginTop: 6 },
});
