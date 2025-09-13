// app/contact/index.tsx
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import ContactForm from "./ContactForm";

export default function ContactScreen() {
  const { colors } = useTheme();
  const ui = (colors as any).contact;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: ui.bg }}
        contentContainerStyle={{ padding: 20, alignItems: "center" }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={Platform.OS === "ios" ? "on-drag" : "interactive"}
      >
        <ContactForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
