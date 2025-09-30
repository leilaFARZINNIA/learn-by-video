// src/api/history.ts
import api from "./axiosClient";

export type HistoryKind = "video" | "podcast" | "text";

export type HistoryItem = {
  id: string;            
  media_id: string;      
  media_title: string;
  kind?: HistoryKind | null;
  progress_sec: number;
  duration_sec: number;
  updated_at: string;    // ISO
  course_id?: string;
  course_title?: string;
};

export async function fetchHistory(opts?: { limit?: number }): Promise<HistoryItem[]> {
  const limit = opts?.limit ?? 50;
  const { data } = await api.get<HistoryItem[]>("/me/history", { params: { limit } });
  return data;
}


export async function deleteHistory(mediaId: string): Promise<void> {
  await api.delete(`/me/history/${encodeURIComponent(mediaId)}`);
}


export async function upsertHistory(input: {
  media_id: string;
  progress_sec: number;
  duration_sec: number;
}): Promise<void> {
  await api.post("/me/history", input);
}
