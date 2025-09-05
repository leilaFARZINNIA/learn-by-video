// auth/auth-context.tsx
import { clearAuthToken, setAuthToken } from "@/utils/authToken";
import {
  auth,
  onAuthStateChanged,
  signInWithGoogleWeb,
  signOut,
  type FirebaseUser,
} from "@/utils/firebase";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useGoogleNativeFirebase } from "./useGoogleNativeFirebase";

type User =
  | {
      email?: string | null;
      name?: string | null;
      avatar?: string | null;
    }
  | null;

type Ctx = {
  user: User;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  googleReady: boolean; // NEW
};

const AuthCtx = createContext<Ctx>({} as any);

function mapUser(u: FirebaseUser | null): User {
  if (!u) return null;
  return { email: u.email, name: u.displayName, avatar: u.photoURL };
}

async function cacheIdToken(u: FirebaseUser | null) {
  if (!u) {
    await clearAuthToken();
    return;
  }
  try {
    const t = await u.getIdToken(true);
    if (t) await setAuthToken(t);
  } catch {
    /* ignore */
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const booted = useRef(false);

  const refreshUser = async () => {
    const u = auth.currentUser;
    setUser(mapUser(u));
    await cacheIdToken(u);
  };

  // get googleReady from hook
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

  const loginWithGoogle = async () => {
    if (Platform.OS === "web") {
      await signInWithGoogleWeb();
      await refreshUser();
      return;
    }
    try {
      await loginNative();
    } catch (e) {
      console.warn("[auth] native google login failed:", e);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      await clearAuthToken();
      setUser(null);
    }
  };

  return (
    <AuthCtx.Provider
      value={{ user, loading, loginWithGoogle, logout, refreshUser, googleReady }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
