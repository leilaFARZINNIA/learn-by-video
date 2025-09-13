// app/contact/components/TextArea.tsx
import React, { ReactNode, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  invalid?: boolean;
  touched?: boolean;
  ui: any;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void; // maps to return key on hardware kb
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
};

export default function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  invalid,
  touched,
  ui,
  maxLength,
  onBlur,
  onFocus,
  onSubmitEditing,
  footerLeft,
  footerRight,
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
      <Text style={[styles.label, { color: ui.text }]}>{label}</Text>
      <View style={[wrapStyles, { paddingVertical: 6 }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={ui.textMuted}
          multiline
          numberOfLines={6}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          style={[styles.textareaInner, { color: ui.text }]}
          maxLength={maxLength}
          textAlignVertical="top"
          returnKeyType="send"
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      <View style={styles.rowBetween}>
        {footerLeft ?? <Text style={[styles.helpText, { color: ui.textMuted }]}>Please include as many details as possible.</Text>}
        {footerRight}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "800", marginBottom: 8 },
  inputWrap: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, justifyContent: "center" },
  textareaInner: {
    minHeight: 140,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 0,
    backgroundColor: "transparent",
    ...Platform.select({ web: { outlineStyle: "none" as any, boxShadow: "none" as any } }),
  },
  helpText: { fontSize: 12, marginTop: 6 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
