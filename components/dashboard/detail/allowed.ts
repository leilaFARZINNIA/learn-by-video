import type { CourseType } from "../types";
export type MediaCourseType = Exclude<CourseType, "Text">;

export const ALLOWED: Record<MediaCourseType, { exts: string[]; mimes: string[] }> = {
  Video:   { exts:["mp4","mov","m4v","webm","mkv"], mimes:["video/mp4","video/quicktime","video/x-m4v","video/webm","video/x-matroska"] },
  Podcast: { exts:["mp3","m4a","aac","wav","ogg"],   mimes:["audio/mpeg","audio/mp4","audio/aac","audio/wav","audio/ogg"] },
} as const;

export const ALLOWED_TRANSCRIPT = {
  exts:["vtt","srt","txt"],
  mimes:["text/vtt","application/x-subrip","text/plain"],
} as const;

export const MAX_SIZE_BYTES = 200 * 1024 * 1024;
export const getExt = (n?: string|null) => (n?.split(".").pop() || "").toLowerCase();


export function isMediaType(t: CourseType): t is MediaCourseType {
  return t === "Video" || t === "Podcast";
}

export function isAllowed(
  courseType: MediaCourseType,
  file: { name?: string | null; mimeType?: string | null; size?: number | null }
){
  const allow = ALLOWED[courseType];
  const extOk  = allow.exts.includes(getExt(file.name));
  const mimeOk = file.mimeType ? allow.mimes.includes(file.mimeType) : true;
  const sizeOk = file.size == null || file.size <= MAX_SIZE_BYTES;
  return { ok: extOk && mimeOk && sizeOk, extOk, mimeOk, sizeOk };
}
