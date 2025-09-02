// screens/SettingsScreen.tsx
import { useResponsiveContainerStyle } from "@/theme/settings/responsive";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Mode = "system" | "dark";

export default function SettingsScreen() {
  // پالت ثابت (هماهنگ با استایل اپ)
  const ACCENT = "#2563EB";
  const palette = {
    bg: "#F7FAFC",
    card: "#FFFFFF",
    text: "#0F172A",
    subtext: "#475569",
    border: "#E5E7EB",
    shadow: "#000",
    accent: ACCENT,
    soft: "#EEF2FF",
    danger: "#DC2626",
  };

  const containerStyle = useResponsiveContainerStyle();

  // Theme (System/Dark)
  const [mode, setMode] = useState<Mode>("system");

  // Account - Username
  const [username, setUsername] = useState("leila_f");
  const [savingUsername, setSavingUsername] = useState(false);

  // Account - Password
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const passOk = newPass.length >= 8 && newPass === newPass2 && !!oldPass;

  // Account - Email
  const [currentEmail] = useState<string>("leila@example.com"); // معمولاً از API میاد
  const [newEmail, setNewEmail] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const [emailPass, setEmailPass] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailOk =
    emailRegex.test(newEmail) &&
    newEmail === newEmail2 &&
    newEmail.toLowerCase() !== currentEmail.toLowerCase() &&
    emailPass.length >= 6;

  // Danger Zone
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  // --- Actions (TODO: API hookup) ---
  const saveUsername = async () => {
    try {
      setSavingUsername(true);
      // TODO: await api.updateUsername({ username })
    } finally {
      setSavingUsername(false);
    }
  };

  const changePassword = async () => {
    // TODO: await api.changePassword({ oldPass, newPass })
    setOldPass("");
    setNewPass("");
    setNewPass2("");
  };

  const changeEmail = async () => {
    try {
      setSavingEmail(true);
      // TODO: await api.requestEmailChange({ newEmail, password: emailPass })
      // سرور ایمیل تأیید به newEmail ارسال می‌کند.
      setNewEmail("");
      setNewEmail2("");
      setEmailPass("");
    } finally {
      setSavingEmail(false);
    }
  };

  const deleteAccount = async () => {
    setConfirmOpen(false);
    // TODO: re-auth + DELETE /me  (grace period سمت سرور)
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40, alignItems: "center" }}
    >
      <View style={containerStyle}>
        {/* Theme */}
        <Card palette={palette} title="Theme">
          <PillGroup>
            <Pill
              active={mode === "system"}
              onPress={() => setMode("system")}
              label="System"
              icon="monitor"
              palette={palette}
            />
            <Pill
              active={mode === "dark"}
              onPress={() => setMode("dark")}
              label="Dark"
              icon="moon"
              palette={palette}
            />
          </PillGroup>
        </Card>

        {/* Account */}
        <Card palette={palette} title="Account">
          {/* Username */}
          <Field label="Username">
            <Input
              palette={palette}
              value={username}
              onChangeText={setUsername}
              placeholder="your_username"
              autoCapitalize="none"
            />
            <PrimaryButton
              title={savingUsername ? "Saving..." : "Save username"}
              onPress={saveUsername}
              disabled={!username.trim() || savingUsername}
              palette={palette}
              style={{ marginTop: 10 }}
            />
          </Field>

          <Divider palette={palette} />

          {/* Change password */}
          <Field label="Change password">
            <Input
              palette={palette}
              value={oldPass}
              onChangeText={setOldPass}
              placeholder="Current password"
              secureTextEntry
            />
            <Input
              palette={palette}
              value={newPass}
              onChangeText={setNewPass}
              placeholder="New password (min 8 chars)"
              secureTextEntry
              style={{ marginTop: 8 }}
            />
            <Input
              palette={palette}
              value={newPass2}
              onChangeText={setNewPass2}
              placeholder="Repeat new password"
              secureTextEntry
              style={{ marginTop: 8 }}
            />
            {!passOk && (oldPass || newPass || newPass2) ? (
              <Helper palette={palette}>
                Password must be at least 8 characters and both entries must match.
              </Helper>
            ) : null}

            <PrimaryButton
              title="Change password"
              onPress={changePassword}
              disabled={!passOk}
              palette={palette}
              style={{ marginTop: 10 }}
              variant="secondary"
            />
          </Field>

          <Divider palette={palette} />

          {/* Change email */}
          <Field label="Change email">
            <Text style={{ color: palette.subtext, marginBottom: 6, fontSize: 12 }}>
              Current: <Text style={{ fontWeight: "700", color: palette.text }}>{currentEmail}</Text>
            </Text>

            <Input
              palette={palette}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="New email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              palette={palette}
              value={newEmail2}
              onChangeText={setNewEmail2}
              placeholder="Repeat new email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ marginTop: 8 }}
            />
            <Input
              palette={palette}
              value={emailPass}
              onChangeText={setEmailPass}
              placeholder="Account password (for security)"
              secureTextEntry
              style={{ marginTop: 8 }}
            />

            {(!emailRegex.test(newEmail) || newEmail !== newEmail2) && (newEmail || newEmail2) ? (
              <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>
                Enter a valid email and make sure both match.
              </Text>
            ) : null}

            <PrimaryButton
              title={savingEmail ? "Sending confirmation..." : "Change email"}
              onPress={changeEmail}
              disabled={!emailOk || savingEmail}
              palette={palette}
              style={{ marginTop: 10 }}
              variant="secondary"
            />
            <Text style={{ color: palette.subtext, fontSize: 12, marginTop: 6 }}>
              We’ll email a confirmation link to your new address. Your email won’t change until it’s verified.
            </Text>
          </Field>
        </Card>

        {/* Danger Zone */}
        <Card palette={palette} title="Danger Zone">
          <DangerButton
            title="Delete account permanently"
            onPress={() => setConfirmOpen(true)}
            palette={palette}
          />
        </Card>
      </View>

      {/* Confirm Delete */}
      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: palette.card }]}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>Delete account?</Text>
            <Text style={{ color: palette.subtext, marginBottom: 12 }}>
              غیرقابل‌بازگشت است. برای تأیید، کلمه‌ی <Text style={{ fontWeight: "700" }}>DELETE</Text> را تایپ کنید.
            </Text>
            <Input value={confirmText} onChangeText={setConfirmText} palette={palette} placeholder="DELETE" />
            <View style={{ height: 12 }} />
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              <GhostButton title="Cancel" onPress={() => setConfirmOpen(false)} palette={palette} />
              <DangerButton title="Delete" onPress={deleteAccount} palette={palette} disabled={!canDelete} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ---------------- UI primitives ---------------- */

function Card({ palette, title, children }: { palette: any; title: string; children: React.ReactNode }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.card,
          shadowColor: palette.shadow,
          borderColor: palette.border,
        },
      ]}
    >
      <Text style={{ fontSize: 15, fontWeight: "800", color: palette.text, marginBottom: 10 }}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: "#475569", marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
}

function Input({ palette, style, ...props }: any) {
  return (
    <TextInput
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: Platform.OS === "web" ? "#FFF" : "rgba(255,255,255,0.92)",
          color: palette.text,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 14,
        },
        style,
      ]}
      placeholderTextColor="#94A3B8"
    />
  );
}

function Helper({ palette, children }: any) {
  return <Text style={{ color: palette.subtext, fontSize: 12, marginTop: 6 }}>{children}</Text>;
}

function PillGroup({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F8FAFC",
        borderRadius: 999,
        padding: 4,
        gap: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        alignSelf: "flex-start",
      }}
    >
      {children}
    </View>
  );
}

function Pill({
  active,
  label,
  onPress,
  icon,
  palette,
}: {
  active?: boolean;
  label: string;
  icon?: "moon" | "monitor";
  onPress?: () => void;
  palette: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 999,
          backgroundColor: active ? palette.soft : "transparent",
          borderWidth: active ? 1 : 0,
          borderColor: active ? "#C7D2FE" : "transparent",
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      {icon === "monitor" && <Feather name="monitor" size={14} color={active ? palette.text : "#475569"} />}
      {icon === "moon" && <Feather name="moon" size={14} color={active ? palette.text : "#475569"} />}
      <Text style={{ color: active ? palette.text : "#475569", fontWeight: active ? "800" : "600" }}>{label}</Text>
    </Pressable>
  );
}

function PrimaryButton({
  title,
  onPress,
  disabled,
  palette,
  variant = "primary",
  style,
}: {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  palette: any;
  variant?: "primary" | "secondary";
  style?: any;
}) {
  let bg = variant === "primary" ? palette.accent : "#3B82F6";
  let border = bg;
  const text = "#FFF";
  if (disabled) {
    bg = "#CBD5E1";
    border = "#CBD5E1";
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.9 : 1 }, style]}
    >
      <Text style={{ color: text, fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}

function GhostButton({ title, onPress, palette }: any) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, { backgroundColor: "transparent", borderColor: palette.border }]}>
      <Text style={{ color: palette.text, fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}

function DangerButton({ title, onPress, palette, disabled }: any) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: "#DC2626", borderColor: "#DC2626", opacity: disabled ? 0.85 : 1 }]}
    >
      <Text style={{ color: "#FFF", fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}

function Divider({ palette }: { palette: any }) {
  return <View style={{ height: 1, backgroundColor: palette.border, opacity: 0.8, marginVertical: 14 }} />;
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 16,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 16,
    borderWidth: 1,
  },
  btn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "900", marginBottom: 6 },
});
