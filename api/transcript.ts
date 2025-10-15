// src/api/transcript.ts
import api from "./axiosClient";

export type TranscriptSegment = { start_ms: number; end_ms: number; text: string };
export type TranscriptOut = {
  status: "empty" | "partial" | "ready" | string;
  html?: string | null;
  segments?: TranscriptSegment[] | null;
  ok?: boolean;
  language?: string | null;
};

export async function saveTranscriptHtml(mediaId: string, html: string, language?: string) {
  const { data } = await api.put<TranscriptOut>(`/medias/${mediaId}/transcript_html`, { html, language });
  return data;
}

export async function alignTranscript(mediaId: string, duration_sec: number) {
  const { data } = await api.post<TranscriptOut>(`/medias/${mediaId}/align`, { duration_sec });
  return data;
}

export async function fetchTranscript(mediaId: string) {
  const { data } = await api.get<TranscriptOut>(`/medias/${mediaId}/transcript`, {
    params: { _ts: Date.now() },   
    headers: { "Cache-Control": "no-store" },
  });
  return data;
}
