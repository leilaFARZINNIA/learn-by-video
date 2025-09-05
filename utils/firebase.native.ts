// src/utils/firebase.native.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
  initializeAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseConfig } from "./firebase.config";

// App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth with AsyncStorage persistence (fallback اگر قبلا init شده)
let _auth: Auth;
try {
  _auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  _auth = getAuth(app);
}
export const auth = _auth;

// Provider
export const GoogleProvider = new GoogleAuthProvider();

// Web-only function
export async function signInWithGoogleWeb(): Promise<never> {
  throw new Error("[signInWithGoogleWeb] Web only. Use expo-auth-session on mobile.");
}

// Re-exports
export {
  createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signOut, updateProfile,
  type FirebaseUser
};

