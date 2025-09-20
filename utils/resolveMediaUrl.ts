// utils/resolvePlayableUrl.ts
import Constants from "expo-constants";
import { Platform } from "react-native";

type ResolveOptions = {
  baseForRelative?: string;
  lanBaseOverride?: string; // e.g. "http://172.20.10.4:8080" or "https://xyz.ngrok.io"
};

const DEFAULT_LAN_BASE = (process.env.EXPO_PUBLIC_LAN_BASE_URL || "http://172.20.10.4:8080").trim().replace(/\/+$/, "");
const API_BASE_ENV = (process.env.EXPO_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");

function inferExpoDevBase(): string | undefined {
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
  return undefined;
}

function normalizeBase(base: string): string {
  const b = base.trim().replace(/\/+$/, "");
  return /^https?:\/\//i.test(b) ? b : `http://${b}`;
}

function joinUrl(base: string, path: string): string {
  if (!base) return path;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function swapBase(inputUrl: string, newBase: string): string {
  const base = normalizeBase(newBase);
  try {
    const u = new URL(inputUrl);
    const b = new URL(base);
    u.protocol = b.protocol;
    u.host = b.host; // hostname + :port
    return u.toString();
  } catch {
    return inputUrl.replace(/^https?:\/\/[^/]+/i, base);
  }
}

function collapseDoubleSlashes(u: string): string {
  // keep "http://", "https://", only collapse in the path
  return u.replace(/([^:]\/)\/+/g, "$1");
}

export function resolvePlayableUrl(raw?: string, opts?: ResolveOptions): string | undefined {
  if (!raw) return raw;
  let url = raw.trim();

  // Protocol-relative URLs (e.g., //cdn.example.com/video.mp4)
  if (/^\/\//.test(url)) {
    const base = opts?.baseForRelative || API_BASE_ENV || inferExpoDevBase() || DEFAULT_LAN_BASE;
    const proto = base?.startsWith("https") ? "https:" : "http:";
    url = `${proto}${url}`;
  }

  // Relative → absolute
  if (/^\/(?!\/)/.test(url)) {
    const base =
      opts?.baseForRelative ||
      API_BASE_ENV ||
      inferExpoDevBase() ||
      DEFAULT_LAN_BASE;
    url = joinUrl(base, url);
  }

  // If absolute and not localhost/127, we can bail early (unless override forced)
  if (/^https?:\/\//i.test(url) && !/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
    if (opts?.lanBaseOverride) {
      url = swapBase(url, opts.lanBaseOverride);
    }
    return collapseDoubleSlashes(url);
  }

  // Map localhost → emulator/lan
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
    if (Platform.OS === "android") {
      url = url.replace(/\/\/(localhost|127\.0\.0\.1)/i, "//10.0.2.2");
    } else if (Platform.OS === "ios") {
      const lanBase = opts?.lanBaseOverride || inferExpoDevBase() || DEFAULT_LAN_BASE;
      url = swapBase(url, lanBase);
    }
  }

  if (opts?.lanBaseOverride) {
    url = swapBase(url, opts.lanBaseOverride);
  }

  return collapseDoubleSlashes(url);
}
