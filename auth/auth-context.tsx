// auth/auth-context.tsx
import { clearAuthToken, setAuthToken } from "@/utils/authToken";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import api, { BASE_URL } from "../api/axiosClient";

WebBrowser.maybeCompleteAuthSession();

type User = {
  uid: string;
  email?: string;
  name?: string;
  avatar?: string;
} | null;

type Ctx = {
  user: User;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({} as any);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const booted = useRef(false);

  // -------------------------------
  // fetch user
  // -------------------------------
  const refreshUser = async () => {
    try {
      const { data } = await api.get("/api/me", { withCredentials: true });
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    refreshUser();
  }, []);

  // -------------------------------
  // Google Login
  // -------------------------------


  const redirectUri =
  Platform.OS === "web"
    ? `${window.location.origin}/oauthredirect`
    : AuthSession.makeRedirectUri({ scheme: "learnbyvideo", path: "oauthredirect" });

const loginWithGoogle = async () => {
  const authUrl = `${BASE_URL}/auth/google/start?redirect_uri=${encodeURIComponent(redirectUri)}`;
  if (Platform.OS === "web") {
    window.location.href = authUrl;
    return;
  }
  console.log("[auth] authUrl=", authUrl, "redirectUri=", redirectUri);
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "success" && result.url) {
    const parsed = Linking.parse(result.url);
    const tokenFromUrl = (parsed?.queryParams?.token as string) || "";
    console.log("[loginWithGoogle] tokenFromUrl len=", tokenFromUrl?.length);
    if (tokenFromUrl.length > 10) {
      await setAuthToken(tokenFromUrl);      // ← فالبک مطمئن
    }
    await refreshUser();
  } else {
    console.warn("⚠️ [loginWithGoogle] Cancelled or failed:", result.type);
  }
};


  // -------------------------------
  // Logout
  // -------------------------------
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      await clearAuthToken();   
      setUser(null);
    }
  };

  return (
    <AuthCtx.Provider value={{ user, loading, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
