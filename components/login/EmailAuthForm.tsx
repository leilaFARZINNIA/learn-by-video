// src/components/login/EmailAuthForm.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { app } from "../../utils/firebase";
import PasswordPolicyCard from "./PasswordPolicyCard";

export type EmailMode = "signin" | "register";

type Props = { onSuccess: () => Promise<void> | void };

const MIN_LEN = 8;
const MAX_LEN = 64;

export default function EmailAuthForm({ onSuccess }: Props) {
  const { colors } = useTheme();
  const login = (colors as any).login;

  const [emailMode, setEmailMode] = useState<EmailMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const title = emailMode === "signin" ? "Sign in" : "Create account";
  const auth = getAuth(app);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);

  const passwordError = useMemo(() => {
    if (emailMode !== "register") return null;
    if (pass.length > 0 && pass.length < MIN_LEN)
      return `Password must be at least ${MIN_LEN} characters.`;
    if (pass.length > MAX_LEN)
      return `Password must be at most ${MAX_LEN} characters.`;
    if (confirm.length > 0 && pass !== confirm) return "Passwords do not match.";
    return null;
  }, [emailMode, pass, confirm]);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (!emailValid) return false;
    if (emailMode === "signin") return pass.length > 0;
    // register
    const baseOk =
      name.trim().length > 0 &&
      pass.length >= MIN_LEN &&
      pass.length <= MAX_LEN &&
      pass === confirm;
    return baseOk;
  }, [busy, emailValid, emailMode, name, pass, confirm]);

  const onSubmitEmail = async () => {
    if (!canSubmit) return;
    setErr(null);

    const normalizedEmail = email.trim().toLowerCase();

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
      {/* Segmented control */}
      <View style={[s.segment, { backgroundColor: login.segmentBg }]}>
        <Pressable
          onPress={() => {
            setEmailMode("signin");
            setErr(null);
          }}
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
          onPress={() => {
            setEmailMode("register");
            setErr(null);
          }}
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
          autoComplete="name"
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
        autoComplete="email"
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

      {/* Password */}
      <View style={{ position: "relative" }}>
        <TextInput
          value={pass}
          onChangeText={setPass}
          placeholder="Password"
          placeholderTextColor={login.textMuted}
          secureTextEntry={!showPass}
          autoComplete={emailMode === "register" ? "new-password" : "current-password"}
          style={[
            s.input,
            {
              paddingRight: 44,
              backgroundColor: login.inputBg,
              borderColor: login.inputBorder,
              color: login.text,
            },
          ]}
          returnKeyType={emailMode === "signin" ? "go" : "next"}
          onSubmitEditing={emailMode === "signin" ? onSubmitEmail : undefined}
        />
        <Pressable onPress={() => setShowPass((v) => !v)} style={s.eyeBtn} hitSlop={10}>
          <Ionicons name={showPass ? "eye-off" : "eye"} size={18} color={login.textMuted} />
        </Pressable>
      </View>

      {/* Confirm password (register only) */}
      {emailMode === "register" && (
        <View style={{ position: "relative" }}>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat password"
            placeholderTextColor={login.textMuted}
            secureTextEntry={!showPass2}
            autoComplete="new-password"
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
          <Pressable onPress={() => setShowPass2((v) => !v)} style={s.eyeBtn} hitSlop={10}>
            <Ionicons name={showPass2 ? "eye-off" : "eye"} size={18} color={login.textMuted} />
          </Pressable>
        </View>
      )}

      {/* Inline errors */}
      {!!(err || passwordError) && (
        <Text style={[s.err, { color: login.error }]}>{err ?? passwordError}</Text>
      )}

     
      {emailMode === "register" && <PasswordPolicyCard />}

      {/* Submit */}
      <Pressable
        onPress={onSubmitEmail}
        disabled={!canSubmit}
        style={[
          s.primaryBtn,
          {
            backgroundColor: canSubmit ? login.buttonBg : login.disabledBg ?? "#cbd5e1",
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSubmit, busy }}
      >
        {busy ? (
          <ActivityIndicator color={login.buttonText} />
        ) : (
          <Text style={[s.primaryBtnText, { color: login.buttonText }]}>{title}</Text>
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
    ...(Platform.OS === "web" ? { cursor: "pointer" } : null),
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
