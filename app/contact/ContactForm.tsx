// app/contact/ContactForm.tsx
import { useAuth } from "@/auth/auth-context";
import DebugBadge from "@/components/contact/DebugBadge";
import Field from "@/components/contact/Field";
import SubmitButton from "@/components/contact/SubmitButton";
import TextArea from "@/components/contact/TextArea";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/context/ThemeContext";
import { sendContact } from "@/lib/service";
import { isValidEmail } from "@/lib/validation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, Platform, StyleSheet, Text, TextInput, View } from "react-native";

const DEBUG = true;
const TAG = "[contact]";

export default function ContactForm() {
  const { colors } = useTheme();
  const ui = (colors as any).contact;
  const { user } = useAuth();
  const toast = useToast();

  // Prefill
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [sending, setSending] = useState(false);

  // UX
  const [touched, setTouched] = useState<Record<"name" | "email" | "title" | "desc", boolean>>({
    name: false,
    email: false,
    title: false,
    desc: false,
  });

  // Anti-spam
  const [honey, setHoney] = useState("");
  const openedAt = useRef(Date.now());

  // Layout (debug)
  const cardLayout = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const btnLayout = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Validation
  const nameInvalid = name.trim().length < 2;
  const emailInvalid = !isValidEmail(email);
  const titleInvalid = title.trim().length < 3;
  const descInvalid = desc.trim().length < 10;

  const canSubmit = useMemo(
    () => !nameInvalid && !emailInvalid && !titleInvalid && !descInvalid,
    [nameInvalid, emailInvalid, titleInvalid, descInvalid]
  );

  const descMax = 4000;
  const descLen = desc.trim().length;

  useEffect(() => {
    if (!DEBUG) return;
    const t = new Date().toISOString().split("T")[1]?.replace("Z", "");
    console.log(`${TAG} ${t} state`, {
      canSubmit,
      sending,
      nameLen: name.trim().length,
      emailValid: !emailInvalid,
      titleLen: title.trim().length,
      descLen,
    });
  }, [name, email, title, descLen, canSubmit, sending, emailInvalid]);

  function onCardLayout(e: LayoutChangeEvent) {
    const { x, y, width, height } = e.nativeEvent.layout;
    cardLayout.current = { x, y, w: width, h: height };
  }
  function onBtnLayout(e: LayoutChangeEvent) {
    const { x, y, width, height } = e.nativeEvent.layout;
    btnLayout.current = { x, y, w: width, h: height };
  }

  async function onSubmit() {
    if (!canSubmit) {
      toast.error("Please complete the form correctly.");
      setTouched({ name: true, email: true, title: true, desc: true });
      return;
    }
    if (honey) return; // bot caught
    if (Date.now() - openedAt.current < 3000) {
      toast.error("Please wait a moment before sending.");
      return;
    }

    try {
      setSending(true);
      await sendContact({
        name: name.trim(),
        email: email.trim(),
        title: title.trim(),
        description: desc.trim(),
      });
      toast.success("Message sent. We’ll get back to you!");
      setTitle("");
      setDesc("");
      setTouched({ name: false, email: false, title: false, desc: false });
    } catch (e: any) {
      const code = e?.code as string | undefined;
      let msg = "Failed to send message.";
      if (code === "functions/invalid-argument") msg = "Please complete the form correctly.";
      else if (code === "functions/resource-exhausted") msg = "Too many submissions. Try later.";
      else if (code === "functions/failed-precondition") msg = "Server is preparing an index. Try again in a minute.";
      else if (code === "functions/internal") msg = "Server error. Please try again later.";
      else if (e?.message) msg = e.message;
      toast.error(msg);
    } finally {
      setSending(false);
    }
  }

  const disabled = sending || !canSubmit;

  return (
    <View style={{ width: "100%", maxWidth: 720 }} onLayout={onCardLayout}>
      <View style={[styles.card, styles.cardShadow, { backgroundColor: ui.cardBg, borderColor: ui.border }]}>
        <Text style={[styles.title, { color: ui.text }]}>Contact us</Text>
        <Text style={{ color: ui.textMuted, marginBottom: 16 }}>Send your request and we’ll reply via email.</Text>

        {/* Full name */}
        <Field
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          invalid={nameInvalid}
          touched={touched.name}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          ui={ui}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          maxLength={120}
        />

        {/* Email */}
        <Field
          label="Email"
          value={email}
          onChangeText={(v) => setEmail(v.replace(/\s/g, ""))}
          placeholder="john@example.com"
          invalid={emailInvalid}
          touched={touched.email}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          ui={ui}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          maxLength={200}
          helpText={touched.email && emailInvalid ? "Invalid email." : undefined}
          helpTextColor={ui.dangerText}
        />

        {/* Title */}
        <Field
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="How can we help?"
          invalid={titleInvalid}
          touched={touched.title}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          ui={ui}
          returnKeyType="next"
          maxLength={160}
          helpText={touched.title && titleInvalid ? "Title is too short." : undefined}
          helpTextColor={ui.dangerText}
        />

        {/* Description */}
        <TextArea
          label="Description"
          value={desc}
          onChangeText={setDesc}
          placeholder="Describe your request..."
          invalid={descInvalid}
          touched={touched.desc}
          onBlur={() => setTouched((t) => ({ ...t, desc: true }))}
          ui={ui}
          maxLength={descMax}
          onSubmitEditing={onSubmit}
          footerLeft={
            touched.desc && descInvalid ? (
              <Text style={[styles.helpText, { color: ui.dangerText }]}>Description must be at least 10 characters.</Text>
            ) : (
              <Text style={[styles.helpText, { color: ui.textMuted }]}>Please include as many details as possible.</Text>
            )
          }
          footerRight={<Text style={[styles.helpText, { color: ui.textMuted }]}>{descLen}/{descMax}</Text>}
        />

        {/* Honeypot (hidden) */}
        <TextInput
          value={honey}
          onChangeText={setHoney}
          style={{ height: 0, width: 0, padding: 0, margin: 0, opacity: 0 }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />

        {/* Submit */}
        <SubmitButton
          onLayout={onBtnLayout}
          onPress={onSubmit}
          disabled={disabled}
          sending={sending}
          ui={ui}
          testID="contact-submit"
          label="Send message"
        />

        {DEBUG && (
          <DebugBadge
            ui={ui}
            canSubmit={canSubmit}
            sending={sending}
            nameLen={name.trim().length}
            emailValid={!emailInvalid}
            titleLen={title.trim().length}
            descLen={desc.trim().length}
            cardW={cardLayout.current.w}
            cardH={cardLayout.current.h}
            btnW={btnLayout.current.w}
            btnH={btnLayout.current.h}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, padding: 20 },
  cardShadow: Platform.select({
    ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
    android: { elevation: 3 },
    default: { boxShadow: "0 10px 24px rgba(2,6,23,0.08)" } as any,
  }),
  title: { fontSize: 22, fontWeight: "900", marginBottom: 6, letterSpacing: 0.2 },
  helpText: { fontSize: 12, marginTop: 6 },
});
