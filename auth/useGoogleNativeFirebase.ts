// auth/useGoogleNativeFirebase.ts
import { auth } from "@/utils/firebase";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
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

// Safer access to Expo extra in dev-client & production
function getExtra(): any {
  // SDK 51+ uses expoConfig; older has manifest/manifest2 fallbacks in dev
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

export function useGoogleNativeFirebase(
  onSignedIn?: () => Promise<void> | void
): {
  request: ReturnType<typeof useAuthRequest>[0];
  loginWithGoogle: () => Promise<void>;
  googleReady: boolean;
} {
  const extra = getExtra();

  // Pick platform client id
  const clientId: string =
    Platform.OS === "ios" ? extra.googleClientIdIos : extra.googleClientIdAndroid;

  if (!clientId || !clientId.endsWith(".apps.googleusercontent.com")) {
    console.warn("[auth] Invalid/missing Google clientId in app config:", clientId);
  }

  // Build correct redirect for each platform
  // ANDROID MUST USE /oauth2redirect/google  (single slash after :)
  const scheme = toReversedScheme(clientId);
  const redirectUri =
    Platform.OS === "android"
      ? `${scheme}:/oauth2redirect/google`
      : `${scheme}:/oauthredirect`;

  console.log("[auth] platform =", Platform.OS);
  console.log("[auth] clientId =", clientId);
  console.log("[auth] scheme =", scheme);
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

  useEffect(() => {
    if (request?.url) console.log("[auth] auth URL =", request.url);
    else console.log("[auth] auth URL not ready yet");
  }, [request]);

  const loginWithGoogle = async (): Promise<void> => {
    if (!request) {
      console.log("[auth] Google request not ready yet");
      return;
    }

    await WebBrowser.warmUpAsync();
    try {
      console.log("[auth] about to promptAsync (native)");
      let res = await promptAsync({
        useProxy: false,
        preferEphemeralSession: Platform.OS === "ios",
      } as any);
      console.log("[auth] prompt result raw =", JSON.stringify(res, null, 2));

      // If the native flow didn't return success, try proxy on Android for diagnostics
      if (res?.type !== "success") {
        if (Platform.OS === "android") {
          console.log("[auth] retry with useProxy=true (diagnostic)");
          const res2 = await promptAsync({ useProxy: true } as any);
          console.log("[auth] prompt result (proxy) =", JSON.stringify(res2, null, 2));
          if (res2?.type !== "success") return;
          res = res2;
        } else {
          return;
        }
      }

      const code = (res.params as Record<string, string>)?.code;
   
      const codeVerifier: string | undefined = request?.codeVerifier;

      if (!code || !codeVerifier) {
        console.log("[auth] Missing code or codeVerifier", { hasCode: !!code, hasVerifier: !!codeVerifier });
        return;
      }

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

      const json = (await r.json()) as {
        id_token?: string;
        access_token?: string;
        error?: string;
        error_description?: string;
        [k: string]: any;
      };

      if (!r.ok) {
        console.log("[auth] token exchange failed:", json?.error, json?.error_description, json);
        return;
      }

      const idToken = json.id_token;
      const accessToken = json.access_token;
      console.log("[auth] have idToken?", !!idToken, "have accessToken?", !!accessToken);

      if (!idToken && !accessToken) {
        console.log("[auth] No idToken/accessToken in token response");
        return;
      }

      // Sign-in to Firebase with whichever token we have
      const cred = GoogleAuthProvider.credential(idToken ?? undefined, accessToken ?? undefined);
      await signInWithCredential(auth, cred);
      console.log("[auth] signInWithCredential OK");

      await onSignedIn?.();
    } catch (e: any) {
      console.log("[auth] token exchange error:", e?.message ?? e);
    } finally {
      await WebBrowser.coolDownAsync();
    }
  };

  return { request, loginWithGoogle, googleReady: !!request };
}
