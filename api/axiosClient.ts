// src/api/axiosClient.ts
import { getAuthToken } from "@/utils/authToken";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

// ---- Base URL resolution ----
const envUrl = process.env.EXPO_PUBLIC_API_URL;

function resolveExpoHostFallback(): string | null {
  const hostUri =
    (Constants as any)?.expoConfig?.hostUri ??
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      return `http://${host}:8080`;
    }
  }
  return null;
}

function getBaseUrl() {
  const raw = (envUrl ?? "").trim();

  
  if (raw) {
    if (
      Platform.OS === "android" &&
      /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?/i.test(raw)
    ) {
      return raw
        .replace("localhost", "10.0.2.2")
        .replace("127.0.0.1", "10.0.2.2");
    }
    return raw;
  }


  if (Platform.OS === "android") return "http://10.0.2.2:8080"; 
  return resolveExpoHostFallback() ?? "http://localhost:8080";
}


export const BASE_URL = getBaseUrl();

// ---- Axios instance ----
const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

if (__DEV__) {
  console.log("[axios] API_URL =", envUrl, "BASE_URL =", BASE_URL);
}

// ---- Request interceptor: attach Firebase ID token ----
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken().catch(() => null);
    config.headers = config.headers ?? {};

    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
      if (__DEV__) console.log("[axios] → attach Authorization (present)");
    } else if (__DEV__) {
      console.log("[axios] → no token");
    }

    if (__DEV__) {
      try {
        console.log("📡 [REQUEST]", {
          method: config.method,
          url: `${config.baseURL}${config.url}`,
          hasToken: !!token,
        });
      } catch {}
    }

    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error("❌ [REQUEST ERROR]", {
        message: error.message,
        url: (error.config as any)?.url,
      });
    }
    return Promise.reject(error);
  }
);

// ---- Response interceptor: single refresh on 401 ----
axiosClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      try {
        console.log("✅ [RESPONSE]", {
          url: response.config?.url,
          status: response.status,
          hasData: response.data !== undefined,
        });
      } catch {}
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const original = error.config as any;

    if (__DEV__) {
      console.error("❌ [RESPONSE ERROR]", {
        url: original?.url,
        status,
        message: error.message,
        data: error.response?.data,
      });
    }

    if (status === 401 && original && !original.__retried) {
      original.__retried = true;
      try {
        const fresh = await getAuthToken(true);
        if (fresh) {
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${fresh}`;
          if (__DEV__) console.log("[axios] ↻ retry with refreshed token");
          return axiosClient.request(original);
        }
      } catch (e) {
        if (__DEV__) console.warn("[axios] refresh token failed", e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
