// src/api/axiosClient.ts
import { getAuthToken } from "@/utils/authToken";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

// ========= Base URL Resolution =========

const ENV_API = (process.env.EXPO_PUBLIC_API_URL ?? "").trim();

const ENV_LAN = (process.env.EXPO_PUBLIC_LAN_BASE_URL ?? "http://172.20.10.4:8080").trim();

function inferExpoLanBase(): string | null {
  try {
    const c: any = Constants as any;
    const hostUri: string | undefined =
      c?.expoConfig?.hostUri ||
      c?.manifest2?.extra?.expoClient?.hostUri ||
      c?.manifest?.hostUri ||
      c?.debuggerHost; // "192.168.x.x:19000"

    if (hostUri) {
      const host = hostUri.split(":")[0];
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        return `http://${host}:8080`;
      }
    }
  } catch {}
  return null;
}

function normalizeBase(u: string) {
  if (!u) return "";
  return /^https?:\/\//i.test(u) ? u : `http://${u}`;
}

function swapBase(inputUrl: string, newBase: string): string {
  const base = new URL(normalizeBase(newBase));
  try {
    const u = new URL(inputUrl);
    u.protocol = base.protocol;
    u.host = base.host; // hostname + :port
    return u.toString();
  } catch {
    // fallback
    return inputUrl.replace(/^https?:\/\/[^/]+/i, base.origin);
  }
}

// localhost → LAN mapping for native
function mapLocalhostForNative(url: string): string {
  if (!/^https?:\/\//i.test(url)) return url;
  if (!/(localhost|127\.0\.0\.1)/i.test(url)) return url;

  if (Platform.OS === "android") {
    // Android Emulator
    return url.replace(/\/\/(localhost|127\.0\.0\.1)/i, "//10.0.2.2");
  }

  if (Platform.OS === "ios") {
    const lan = ENV_LAN || inferExpoLanBase() || "http://172.20.10.4:8080";
    return swapBase(url, lan);
  }

  return url;
}

function getBaseUrl() {
  
  if (Platform.OS === "web") {
    return ENV_API || "http://localhost:8080";
  }


  if (ENV_API) {
    return mapLocalhostForNative(ENV_API);
  }

  
  if (Platform.OS === "android") return "http://10.0.2.2:8080";

  return ENV_LAN || inferExpoLanBase() || "http://localhost:8080";
}

export const BASE_URL = getBaseUrl();

// ========= Axios Instance =========

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
  console.log("[axios] API_URL =", ENV_API, "LAN_BASE =", ENV_LAN, "BASE_URL =", BASE_URL);
}

// ========= Interceptors =========

// Request: attach token + dev logs
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

// Response: simple retry on 401
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
