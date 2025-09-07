// auth/useGoogleNativeFirebase.ts
import { auth } from "@/utils/firebase";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  type AuthCredential,
} from "firebase/auth";
import { useEffect } from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Google endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

// "xxx.apps.googleusercontent.com" -> "com.googleusercontent.apps.xxx"
function toReversedScheme(googleClientId: string): string {
  return `com.googleusercontent.apps.${googleClientId.replace(
    ".apps.googleusercontent.com",
    ""
  )}`;
}

// Safer access to Expo extra (SDK 51+ / dev-client fallback)
function getExtra(): any {
  // @ts-ignore
  return (
    (Constants as any).expoConfig?.extra ??
    // @ts-ignore
    (Constants as any).manifest2?.extra ??
    // @ts-ignore
    (Constants as any).manifest?.extra ??
    {}
  );
}

type HookReturn = {
  request: ReturnType<typeof useAuthRequest>[0];
  loginWithGoogle: () => Promise<void>;
  googleReady: boolean;
  /** NEW: build a credential for native reauthentication (iOS/Android) */
  getGoogleReauthCredential: () => Promise<AuthCredential | null>;
};

export function useGoogleNativeFirebase(onSignedIn?: () => Promise<void> | void): HookReturn {
  const extra = getExtra();

  // Pick platform client id
  const clientId: string =
    Platform.OS === "ios" ? extra.googleClientIdIos : extra.googleClientIdAndroid;

  if (!clientId || !clientId.endsWith(".apps.googleusercontent.com")) {
    console.warn("[auth] Invalid/missing Google clientId in app config:", clientId);
  }

  // Build redirect for each platform
  // ANDROID MUST USE /oauth2redirect/google (single slash after :)
  const scheme = toReversedScheme(clientId);
  const redirectUri =
    Platform.OS === "android"
      ? `${scheme}:/oauth2redirect/google`
      : `${scheme}:/oauthredirect`;

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      responseType: ResponseType.Code, // PKCE
      usePKCE: true,
      scopes: ["openid", "email", "profile"],
      extraParams: { prompt: "select_account" },
    },
    discovery
  );

  useEffect(() => {
    if (request?.url) console.log("[auth] auth URL =", request.url);
  }, [request]);

  /** ---------- helpers ---------- */

  // Run Google screen and exchange code -> tokens
  const runGoogleFlowAndExchange = async (): Promise<{
    idToken?: string;
    accessToken?: string;
  } | null> => {
    if (!request) return null;

    await WebBrowser.warmUpAsync();
    try {
      let res = await promptAsync({
        useProxy: false,
        preferEphemeralSession: Platform.OS === "ios",
      } as any);

      // (Optional) fallback diagnostic proxy on Android
      if (res?.type !== "success" && Platform.OS === "android") {
        const res2 = await promptAsync({ useProxy: true } as any);
        if (res2?.type === "success") res = res2;
      }
      if (res?.type !== "success") return null;

      const code = (res.params as Record<string, string>)?.code;
      const codeVerifier: string | undefined = (request as any)?.codeVerifier;
      if (!code || !codeVerifier) return null;

      // Exchange the code for tokens
      const body = new URLSearchParams({
        client_id: clientId,
        code,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      });

      const r = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const json = await r.json();
      if (!r.ok) {
        console.log("[auth] token exchange failed:", json?.error, json?.error_description);
        return null;
      }

      return { idToken: json?.id_token, accessToken: json?.access_token };
    } catch (e: any) {
      console.log("[auth] token exchange error:", e?.message ?? e);
      return null;
    } finally {
      await WebBrowser.coolDownAsync();
    }
  };

  /** ---------- API exported by hook ---------- */

  // Sign in to Firebase
  const loginWithGoogle = async (): Promise<void> => {
    const tokens = await runGoogleFlowAndExchange();
    if (!tokens?.idToken && !tokens?.accessToken) return;

    const cred = GoogleAuthProvider.credential(
      tokens.idToken ?? undefined,
      tokens.accessToken ?? undefined
    );
    await signInWithCredential(auth, cred);
    await onSignedIn?.();
  };

  // NEW: Build a credential for reauthentication (native only)
  const getGoogleReauthCredential = async (): Promise<AuthCredential | null> => {
    try {
      const tokens = await runGoogleFlowAndExchange();
      if (!tokens?.idToken && !tokens?.accessToken) return null;
      return GoogleAuthProvider.credential(
        tokens.idToken ?? undefined,
        tokens.accessToken ?? undefined
      );
    } catch {
      return null;
    }
  };

  return { request, loginWithGoogle, googleReady: !!request, getGoogleReauthCredential };
}
