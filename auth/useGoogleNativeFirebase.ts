// auth/useGoogleNativeFirebase.ts
import { auth } from "@/utils/firebase";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Google endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

// Turn a Google client id into the reversed scheme Google expects
function toReversedScheme(googleClientId: string): string {
  // "xxx.apps.googleusercontent.com" -> "com.googleusercontent.apps.xxx"
  return `com.googleusercontent.apps.${googleClientId.replace(
    ".apps.googleusercontent.com",
    ""
  )}`;
}

export function useGoogleNativeFirebase(
  onSignedIn?: () => Promise<void> | void
): {
  request: ReturnType<typeof useAuthRequest>[0];
  loginWithGoogle: () => Promise<void>;
  googleReady: boolean;
} {
  const extra: any = (Constants as any).expoConfig?.extra ?? {};

  // Pick platform client id
  const clientId: string =
    Platform.OS === "ios" ? extra.googleClientIdIos : extra.googleClientIdAndroid;

  // Build correct redirect for each platform
  // NOTE: Android must use "/oauth2redirect/google"
  const scheme = toReversedScheme(clientId);
  const redirectUri =
    Platform.OS === "android"
      ? `${scheme}:/oauth2redirect/google`
      : `${scheme}:/oauthredirect`;

  console.log("[auth] platform =", Platform.OS);
  console.log("[auth] clientId =", clientId);
  console.log("[auth] redirectUri =", redirectUri);

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      responseType: ResponseType.Code, // PKCE code flow
      usePKCE: true,
      scopes: ["openid", "email", "profile"],
      extraParams: { prompt: "select_account" },
    },
    discovery
  );

  const loginWithGoogle = async (): Promise<void> => {
    if (!request) {
      console.log("[auth] Google request not ready yet");
      return;
    }

    // Use the native flow (no Expo proxy)
    const res = await promptAsync({
      // TS types vary across SDKs; cast keeps it compatible
      useProxy: false,
      preferEphemeralSession: Platform.OS === "ios",
    } as any);

    console.log("[auth] prompt result =", res?.type, (res as any)?.error);
    if (res?.type !== "success") return;

    const code = (res.params as Record<string, string>)?.code;
    const codeVerifier = (request as unknown as { codeVerifier?: string })
      ?.codeVerifier;

    if (!code || !codeVerifier) {
      console.log("[auth] Missing code or codeVerifier");
      return;
    }

    try {
      // Exchange code -> tokens (PKCE)
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

      const json = (await r.json()) as {
        id_token?: string;
        access_token?: string;
        [k: string]: any;
      };

      if (!r.ok) {
        console.log("[auth] token exchange failed:", json);
        return;
      }

      const idToken = json.id_token;
      console.log("[auth] have idToken?", !!idToken, "len=", idToken?.length);
      if (!idToken) return;

      // Firebase sign-in with Google ID token
      const cred = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, cred);
      console.log("[auth] signInWithCredential OK");

      await onSignedIn?.();
    } catch (e: any) {
      console.log("[auth] token exchange error:", e?.message ?? e);
    }
  };

  return { request, loginWithGoogle, googleReady: !!request };
}
