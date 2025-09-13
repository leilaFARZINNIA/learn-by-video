// app/contact/components/DebugBadge.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  ui: any;
  canSubmit: boolean;
  sending: boolean;
  nameLen: number;
  emailValid: boolean;
  titleLen: number;
  descLen: number;
  cardW: number;
  cardH: number;
  btnW: number;
  btnH: number;
};

export default function DebugBadge({
  ui,
  canSubmit,
  sending,
  nameLen,
  emailValid,
  titleLen,
  descLen,
  cardW,
  cardH,
  btnW,
  btnH,
}: Props) {
  return (
    <View style={[styles.debugBadge, { backgroundColor: ui.soft, borderColor: ui.border }]}>
      <Text style={{ color: ui.text, fontSize: 11 }}>
        canSubmit: {String(canSubmit)} | sending: {String(sending)}
        {"\n"}
        name:{nameLen} email:{emailValid ? "✓" : "✗"} title:{titleLen} desc:{descLen}
        {"\n"}
        card: {cardW}×{cardH} | btn: {btnW}×{btnH}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  debugBadge: { marginTop: 12, borderWidth: 1, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8, alignSelf: "flex-start" },
});
