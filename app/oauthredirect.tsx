// app/oauthredirect/index.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../auth/auth-context";
import { setAuthToken } from "../utils/authToken";

export default function OAuthRedirect() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      console.log("[oauthredirect] token =", token);
      if (typeof token === "string" && token.length > 10) {
        await setAuthToken(token);         
      }
      await refreshUser();    
      router.replace("/");
    })();
  }, [token]);

  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", gap:8 }}>
      <ActivityIndicator />
      <Text>Completing sign-in…</Text>
    </View>
  );
}
