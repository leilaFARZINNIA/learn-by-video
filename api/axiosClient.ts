// src/api/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getAuthToken } from "../utils/authToken";

// ---- Base URL resolution ----
const envUrl = process.env.EXPO_PUBLIC_API_URL;

function resolveExpoHostFallback(): string | null {
 
  const hostUri = (Constants as any)?.expoConfig?.hostUri as string | undefined
               ?? (Constants as any)?.manifest2?.extra?.expoClient?.hostUri as string | undefined;
  if (hostUri) {

    const host = hostUri.split(":")[0];
    if (host && /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      return `http://${host}:8080`;
    }
  }
  return null;
}

function getBaseUrl() {
  if (envUrl && envUrl.trim()) return envUrl.trim();
  if (Platform.OS === "android") return "http://10.0.2.2:8080"; // Android Emulator

  return resolveExpoHostFallback() ?? "http://localhost:8080";
}

export const BASE_URL = getBaseUrl();

// ---- Axios instance ----
const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});


console.log("[axios] API_URL =", process.env.EXPO_PUBLIC_API_URL, "BASE_URL =", BASE_URL);


axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken().catch(() => null);
    config.headers = config.headers ?? {};

    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
      console.log("[axios] set Authorization Bearer (len) =", token.length);
    } else {
      console.log("[axios] NO token, skipping Authorization");
    }

    try {
      console.log("📡 [REQUEST]", {
        method: config.method,
        baseURL: config.baseURL,
        url: config.url,
        hasToken: !!token,
      });
    } catch {}

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ [REQUEST ERROR]", {
      message: error.message,
      configUrl: (error.config as any)?.url,
    });
    return Promise.reject(error);
  }
);


axiosClient.interceptors.response.use(
  (response) => {
    try {
      console.log("✅ [RESPONSE]", {
        url: response.config?.url,
        status: response.status,
        hasData: response.data !== undefined,
      });
    } catch {}
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.error("❌ [RESPONSE ERROR]", {
      url: (error.config as any)?.url,
      status,
      message: error.message,
      data,
    });



    return Promise.reject(error);
  }
);

export default axiosClient;
