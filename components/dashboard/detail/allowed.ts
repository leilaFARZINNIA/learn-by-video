import type { CourseType } from "../types";

export const ALLOWED = {
  Video:   { exts: ["mp4","mov","m4v","webm","mkv"], mimes: ["video/mp4","video/quicktime","video/x-m4v","video/webm","video/x-matroska"] },
  Podcast: { exts: ["mp3","m4a","aac","wav","ogg"],   mimes: ["audio/mpeg","audio/mp4","audio/aac","audio/wav","audio/ogg"] },
  Text:    { exts: ["txt","pdf","doc","docx","rtf","md"],
             mimes:["text/plain","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/rtf","text/markdown"] },
} as const;

export const MAX_SIZE_BYTES = 200 * 1024 * 1024;
export const getExt = (n?: string|null) => (n?.split(".").pop() || "").toLowerCase();

export function isAllowed(
  courseType: CourseType,
  file: { name?: string | null; mimeType?: string | null; size?: number | null }
){
  const allow = ALLOWED[courseType];
  const extOk  = allow.exts.includes(getExt(file.name));
  const mimeOk = file.mimeType ? allow.mimes.includes(file.mimeType) : true;
  const sizeOk = file.size == null || file.size <= MAX_SIZE_BYTES;
  return { ok: extOk && mimeOk && sizeOk, extOk, mimeOk, sizeOk };
}
