import { useAuth } from "@/auth/auth-context";
import { AccentBtn, DangerBtn, PrimaryBtn } from "@/components/settings/account/Buttons";
import ConfirmDeleteModal from "@/components/settings/account/ConfirmDeleteModal";
import { HelperText, LabeledInput, PwRules } from "@/components/settings/account/Inputs";
import SectionCard from "@/components/settings/account/SectionCard";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/context/ThemeContext";
import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View, } from "react-native";

// Firebase
import { auth } from "@/utils/firebase";
import {
  EmailAuthProvider,
  deleteUser,
  linkWithCredential,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PW = 64;
function passwordProblems(pw: string, avoid?: string[]) {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (pw.length > MAX_PW) return "Password is too long.";
  const lc = pw.toLowerCase();
  if ((avoid ?? []).some((w) => w && lc.includes(w.toLowerCase())))
    return "Choose a stronger password (too common).";
  return null;
}
function notify(msg: string) {
  if (Platform.OS === "android") {
    // @ts-ignore
    const { ToastAndroid } = require("react-native");
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert("Info", msg);
  }
}

export default function AccountSettingsScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const ui = (colors as any).settings;
  const { user, refreshUser, logout } = useAuth();

  const providers = useMemo(
    () => (auth.currentUser?.providerData ?? []).map((p) => p.providerId),
    [user]
  );
  const hasPassword = providers.includes("password");
  const hasGoogle = providers.includes("google.com");
  const googleOnly = hasGoogle && !hasPassword && providers.length === 1;

  // Username
  const [name, setName] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);

  // Set password (for Google-only)
  const [np1, setNp1] = useState("");
  const [np2, setNp2] = useState("");
  const [settingPw, setSettingPw] = useState(false);

  // Change password (for password users)
  const [cpCur, setCpCur] = useState("");
  const [cp1, setCp1] = useState("");
  const [cp2, setCp2] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  // Delete account
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText.trim().toUpperCase() === "DELETE";
  const [delPass, setDelPass] = useState("");
  const [deleting, setDeleting] = useState(false);

  const avoidWords = useMemo(
    () => [user?.email?.split("@")[0] ?? "", user?.name ?? ""],
    [user]
  );

  if (!auth.currentUser) return null;

  /* ---------- actions ---------- */
  const onSaveName = async () => {
    const displayName = name.trim();
    if (!displayName) return notify("Enter a valid name.");
    try {
      setSavingName(true);
      await updateProfile(auth.currentUser!, { displayName });
      await refreshUser();
      toast.success("Name saved.");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save name.");
    } finally {
      setSavingName(false);
    }
  };

  const onSetPassword = async () => {
    if (settingPw) return;
    if (np1 !== np2) return toast.error("Passwords do not match.");
    const prob = passwordProblems(np1, avoidWords);
    if (prob) return notify(prob);
    try {
      setSettingPw(true);
      const email = auth.currentUser?.email;
      if (!email) return notify("No email on account.");
      const cred = EmailAuthProvider.credential(email, np1);
      await linkWithCredential(auth.currentUser!, cred);
      await refreshUser();
      toast.success("Password set. You can now also sign in with email/password.");
    } catch (e: any) {
      const code = e?.code ?? "";
      if (code === "auth/credential-already-in-use" || code === "auth/email-already-in-use") {
        toast.error("That email is already linked to another password account.");
      } else if (code === "auth/requires-recent-login") {
        toast.error("Please sign in again and retry.");
      } else {
        toast.error(e?.message ?? "Failed to set password.");
      }
    } finally {
      setSettingPw(false);
      setNp1("");
      setNp2("");
    }
  };

  const onChangePassword = async () => {
    if (changingPw) return;
    if (!cpCur) return toast.error("Enter your current password.");
    if (cp1 !== cp2) return toast.error("New passwords do not match.");
    const p = passwordProblems(cp1, avoidWords);
    if (p) return toast.error(p);

    try {
      setChangingPw(true);
      const email = auth.currentUser?.email!;
      const cred = EmailAuthProvider.credential(email, cpCur);
      await reauthenticateWithCredential(auth.currentUser!, cred);
      await updatePassword(auth.currentUser!, cp1);
      toast.success("Password changed.");
      setCpCur(""); setCp1(""); setCp2("");
    } catch (e: any) {
      const code = e?.code ?? "";
      if (code === "auth/wrong-password") toast.error("Current password is incorrect.");
      else if (code === "auth/too-many-requests") toast.error("Too many attempts. Try again later.");
      else toast.error(e?.message ?? "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  };

  const onDeleteAccount = async () => {
    if (!canDelete) return;
    try {
      setDeleting(true);
      const providers = (auth.currentUser?.providerData ?? []).map((p) => p.providerId);
      const hasPassword = providers.includes("password");
      if (hasPassword && delPass) {
        const cred = EmailAuthProvider.credential(auth.currentUser?.email!, delPass);
        await reauthenticateWithCredential(auth.currentUser!, cred);
      }
      await deleteUser(auth.currentUser!);
      setConfirmOpen(false);
      toast.success("Account deleted.");
      await logout();
    } catch (e: any) {
      const code = e?.code ?? "";
      if (code === "auth/requires-recent-login") toast.error("Please sign in again and retry.");
      else if (code === "auth/wrong-password")  toast.error("Password is incorrect.");
      else toast.error(e?.message ?? "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={{ flex: 1, backgroundColor: ui.bg }} contentContainerStyle={{ padding: 18, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: 520, gap: 16 }}>
          {/* Account method */}
          <SectionCard title="Account" subtitle="Sign-in method">
            <HelperText>
              Signed in with{" "}
              <Text style={{ fontWeight: "800", color: ui.text }}>
                {googleOnly ? "Google" : hasPassword && hasGoogle ? "Email & Google" : "Email/password"}
              </Text>
            </HelperText>
          </SectionCard>

          {/* Username */}
          <SectionCard title="Username">
            <LabeledInput label="Username" value={name} onChangeText={setName} placeholder="your_name" />
            <PrimaryBtn title={savingName ? "Saving..." : "Save username"} onPress={onSaveName} disabled={savingName || !name.trim()} />
          </SectionCard>

          {/* Set password (Google-only) */}
          {googleOnly && (
            <SectionCard title="Set a password" subtitle="Allow email/password login too">
              <LabeledInput label="New password (min 8 chars)" value={np1} onChangeText={setNp1} secureTextEntry />
              <LabeledInput label="Repeat new password" value={np2} onChangeText={setNp2} secureTextEntry />
              <AccentBtn title={settingPw ? "Saving..." : "Set password"} onPress={onSetPassword} disabled={settingPw || !np1 || !np2} />
              <PwRules />
            </SectionCard>
          )}

          {/* Change password */}
          {hasPassword && (
            <SectionCard title="Change password">
              <LabeledInput label="Current password" value={cpCur} onChangeText={setCpCur} secureTextEntry />
              <LabeledInput label="New password (min 8 chars)" value={cp1} onChangeText={setCp1} secureTextEntry />
              <LabeledInput label="Repeat new password" value={cp2} onChangeText={setCp2} secureTextEntry />
              <AccentBtn title={changingPw ? "Saving..." : "Change password"} onPress={onChangePassword} disabled={changingPw} />
              <PwRules />
            </SectionCard>
          )}

          {/* Danger Zone */}
          <SectionCard title="Danger Zone" subtitle="Irreversible actions">
            <DangerBtn title="Delete account permanently" onPress={() => setConfirmOpen(true)} />
          </SectionCard>
        </View>
      </ScrollView>

      <ConfirmDeleteModal
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onDeleteAccount}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
        needPassword={hasPassword}
        delPass={delPass}
        setDelPass={setDelPass}
        deleting={deleting}
        canDelete={canDelete}
      />
    </KeyboardAvoidingView>
  );
}
