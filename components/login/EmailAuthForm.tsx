// src/components/login/EmailAuthForm.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

// 🔑 Firebase
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../../utils/firebase";

export type EmailMode = "signin" | "register";

type Props = {
  onSuccess: () => Promise<void> | void;
};

export default function EmailAuthForm({ onSuccess }: Props) {
  const { colors } = useTheme();
  const login = (colors as any).login;

  const [emailMode, setEmailMode] = useState<EmailMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const title = useMemo(
    () => (emailMode === "signin" ? "Sign in" : "Create account"),
    [emailMode]
  );

  const auth = getAuth(app);

  const onSubmitEmail = async () => {
    if (busy) return;
    setErr(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      setErr("Please enter a valid email.");
      return;
    }
    if (pass.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (emailMode === "register" && !name.trim()) {
      setErr("Please enter your name.");
      return;
    }

    try {
      setBusy(true);
      if (emailMode === "signin") {
        await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          pass
        );
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
      }
      await onSuccess();
    } catch (e: any) {
      console.error("[EmailAuthForm] error:", e);
      const detail =
        e?.code || e?.message || "Operation failed. Please try again.";
      setErr(String(detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ width: "100%", gap: 10 }}>
      {/* Segment */}
      <View style={[s.segment, { backgroundColor: login.segmentBg }]}>
        <Pressable
          onPress={() => setEmailMode("signin")}
          style={[
            s.segmentBtn,
            emailMode === "signin" && { backgroundColor: login.segmentActiveBg },
          ]}
        >
          <Text
            style={[
              s.segmentText,
              { color: login.textMuted },
              emailMode === "signin" && { color: login.text },
            ]}
          >
            Sign in
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setEmailMode("register")}
          style={[
            s.segmentBtn,
            emailMode === "register" && {
              backgroundColor: login.segmentActiveBg,
            },
          ]}
        >
          <Text
            style={[
              s.segmentText,
              { color: login.textMuted },
              emailMode === "register" && { color: login.text },
            ]}
          >
            Register
          </Text>
        </Pressable>
      </View>

      {emailMode === "register" && (
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={login.textMuted}
          autoCapitalize="words"
          style={[
            s.input,
            {
              backgroundColor: login.inputBg,
              borderColor: login.inputBorder,
              color: login.text,
            },
          ]}
          returnKeyType="next"
        />
      )}

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
        placeholderTextColor={login.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[
          s.input,
          {
            backgroundColor: login.inputBg,
            borderColor: login.inputBorder,
            color: login.text,
          },
        ]}
        returnKeyType="next"
      />

      <View style={{ position: "relative" }}>
        <TextInput
          value={pass}
          onChangeText={setPass}
          placeholder="Password"
          placeholderTextColor={login.textMuted}
          secureTextEntry={!showPass}
          style={[
            s.input,
            {
              paddingRight: 44,
              backgroundColor: login.inputBg,
              borderColor: login.inputBorder,
              color: login.text,
            },
          ]}
          returnKeyType="go"
          onSubmitEditing={onSubmitEmail}
        />
        <Pressable
          onPress={() => setShowPass((v) => !v)}
          style={s.eyeBtn}
          hitSlop={10}
        >
          <Ionicons
            name={showPass ? "eye-off" : "eye"}
            size={18}
            color={login.textMuted}
          />
        </Pressable>
      </View>

      {!!err && <Text style={[s.err, { color: login.error }]}>{err}</Text>}

      <Pressable
        onPress={onSubmitEmail}
        style={[s.primaryBtn, { backgroundColor: login.buttonBg }]}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color={login.buttonText} />
        ) : (
          <Text style={[s.primaryBtnText, { color: login.buttonText }]}>
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  segment: {
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
    padding: 4,
    borderRadius: 999,
  },
  segmentBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  segmentText: { fontWeight: "800" },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: 12,
    padding: 6,
    borderRadius: 999,
  },
  primaryBtn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryBtnText: { fontWeight: "900" },
  err: { fontWeight: "800", textAlign: "center" },
});
