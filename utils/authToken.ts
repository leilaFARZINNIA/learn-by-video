// src/utils/authToken.ts
import { Platform } from "react-native";
let inMemoryToken: string | null = null;

// Web fallback
function webGet() {
  try { return localStorage.getItem("auth_token"); } catch { return null; }
}
function webSet(t: string) {
  try { localStorage.setItem("auth_token", t); } catch {}
}
function webClear() {
  try { localStorage.removeItem("auth_token"); } catch {}
}

export async function setAuthToken(t: string) {
  inMemoryToken = t;
  if (Platform.OS === "web") {
    webSet(t);
  } else {
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync("auth_token", t);
  }
  console.log("[authToken] set, length=", t?.length);
}

export async function getAuthToken(): Promise<string | null> {
  if (inMemoryToken) return inMemoryToken;
  let t: string | null = null;
  if (Platform.OS === "web") {
    t = webGet();
  } else {
    const SecureStore = await import("expo-secure-store");
    t = await SecureStore.getItemAsync("auth_token");
  }
  inMemoryToken = t;
  console.log("[authToken] get =>", t ? "present" : "null");
  return t;
}

export async function clearAuthToken() {
  inMemoryToken = null;
  if (Platform.OS === "web") webClear();
  else {
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync("auth_token");
  }
  console.log("[authToken] cleared");
}
