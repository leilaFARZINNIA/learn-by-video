// app/login/index.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../auth/auth-context";
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from "../../theme/home/responsive";

import EmailAuthForm from "../../components/login/EmailAuthForm";
import GoogleButton from "../../components/login/GoogleButton";
import Hero from "../../components/login/Hero";
import ProviderTabs, { ProviderTab } from "../../components/login/ProviderTabs";

export default function LoginPage() {

  const { logoSize, fontSize } = useResponsive();
  const { colors } = useTheme();
  const login = (colors as any).login;
  const { user, loading, loginWithGoogle, refreshUser } = useAuth();

  const [providerTab, setProviderTab] = useState<ProviderTab>("google");
  const [googleBusy, setGoogleBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user]);

  const onGoogle = async () => {
    if (googleBusy) return;
    setErr(null);
    try {
      setGoogleBusy(true);
      await loginWithGoogle();
    } catch {
      setErr("Google sign-in was cancelled or failed.");
    } finally {
      setGoogleBusy(false);
    }
  };

  const onEmailSuccess = async () => {
    await refreshUser();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (user) return null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={[s.page, { backgroundColor: login.bg }]}>
          <Hero logoSize={logoSize} fontSize={fontSize} />
          <View style={[s.card, { backgroundColor: login.cardBg, borderColor: login.border }]}>
            <ProviderTabs active={providerTab} onChange={setProviderTab} />

            {providerTab === "google" && (
            <>
               
                <GoogleButton
                  fullWidth
                  loading={googleBusy}
                  
                  // disabled={!googleReady || googleBusy}
                  disabled={googleBusy}
                  onPress={async () => {
                    console.log("[auth] Google button pressed");
                    if (googleBusy) return;
                    setGoogleBusy(true);
                    try {
                      await loginWithGoogle();
                      console.log("[auth] loginWithGoogle finished");
                    } finally {
                      setGoogleBusy(false);
                    }
                  }}
                />



              {!!err && <Text style={[s.err, { color: login.error }]}>{err}</Text>}
            </>
          )}


            {providerTab === "email" && <EmailAuthForm onSuccess={onEmailSuccess} />}

            <Text style={[s.legal, { color: login.textMuted }]}>
              By continuing you agree to our <Text style={[s.link, { color: login.link }]}>Terms</Text> &{" "}
              <Text style={[s.link, { color: login.link }]}>Privacy</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 64,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    borderRadius: 18,
    padding: 22,
    gap: 16,
    borderWidth: 1,
  },
  link: { fontWeight: "800", textDecorationLine: "underline" },
  legal: { textAlign: "center", fontSize: 12, marginTop: 4 },
  err: { fontWeight: "800", textAlign: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
