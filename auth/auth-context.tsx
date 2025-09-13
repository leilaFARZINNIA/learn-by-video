// auth/auth-context.tsx
import { clearAuthToken, setAuthToken } from "@/utils/authToken";
import {
  auth,
  onAuthStateChanged,
  signInWithGoogleWeb,
  signOut,
  type FirebaseUser,
} from "@/utils/firebase";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { useGoogleNativeFirebase } from "./useGoogleNativeFirebase";

type User =
  | { email?: string | null; name?: string | null; avatar?: string | null }
  | null;

type Ctx = {
  user: User;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  googleReady: boolean;
};

const AuthCtx = createContext<Ctx>({} as any);

function mapUser(u: FirebaseUser | null): User {
  return u ? { email: u.email, name: u.displayName, avatar: u.photoURL } : null;
}

async function cacheIdToken(u: FirebaseUser | null) {
  if (!u) return clearAuthToken();
  try {
    const t = await u.getIdToken(true);
    if (t) await setAuthToken(t);
  } catch {/* ignore */}
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const booted = useRef(false);

  const refreshUser = useCallback(async () => {
    const u = auth.currentUser;
    setUser(mapUser(u));
    await cacheIdToken(u);
  }, []);

  // از هوک نیتیو (onSignedIn => refreshUser)
  const { loginWithGoogle: loginNative, googleReady } = useGoogleNativeFirebase(refreshUser);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(mapUser(fbUser));
      await cacheIdToken(fbUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (Platform.OS === "web") {
      setLoading(true);
      try {
        await signInWithGoogleWeb();
        await refreshUser();
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!googleReady) {
      console.log("[auth] Google request not ready yet");
      return;
    }

    setLoading(true);
    try {
      await loginNative(); // refreshUser توسط هوک بعد از sign-in صدا زده می‌شود
    } catch (e) {
      console.warn("[auth] native google login failed:", e);
    } finally {
      setLoading(false);
    }
  }, [googleReady, loginNative, refreshUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      await clearAuthToken();
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, loginWithGoogle, logout, refreshUser, googleReady }),
    [user, loading, loginWithGoogle, logout, refreshUser, googleReady]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
