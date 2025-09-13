// src/utils/firebase.web.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseConfig } from "./firebase.config";

// App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth
export const auth: Auth = getAuth(app);

// Google Provider (web)
export const GoogleProvider = new GoogleAuthProvider();

// Web-only Google sign in
export async function signInWithGoogleWeb() {
  return signInWithPopup(auth, GoogleProvider);
}


export {
  createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signOut, updateProfile,
  type FirebaseUser
};

