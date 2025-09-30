// src/api/mediaApi.ts
import type { Media, Transcript } from "../types/media";
import api from "./axiosClient";

/* ------------------------------- Types ------------------------------- */

export type MediaCreate = {
  title: string;
  description?: string;
  url?: string;
  transcript?: Transcript;
};

export type MediaPatch = Partial<MediaCreate>;

export type ListOpts = {
  limit?: number;  // default 100
  offset?: number; // default 0
};

/* ------------------------------- Queries ----------------------------- */

export async function fetchMediasByCourse(
  courseId: string,
  opts: ListOpts = {}
): Promise<Media[]> {
  const { limit = 100, offset = 0 } = opts;
  const { data } = await api.get<Media[]>(
    `/media/course/${encodeURIComponent(courseId)}`,
    { params: { limit, offset } }
  );
  return data;
}

export async function fetchMediaById(mediaId: string): Promise<Media> {
  const { data } = await api.get<Media>(
    `/media/${encodeURIComponent(mediaId)}`
  );
  return data;
}

/* ------------------------------ Mutations ---------------------------- */

export async function createMediaForCourse(
  courseId: string,
  input: MediaCreate
): Promise<Media> {
  const payload = {
    media_title: input.title,
    media_description: input.description ?? null,
    media_url: input.url ?? "",
    media_transcript: input.transcript ?? null,
    
  };
  const { data } = await api.post<Media>(
    `/media/course/${encodeURIComponent(courseId)}`,
    payload
  );
  return data;
}

export async function updateMedia(
  mediaId: string,
  patch: MediaPatch
  
): Promise<Media> {
  const body: Record<string, unknown> = {};
  if (patch.title !== undefined) body.media_title = patch.title;
  if (patch.description !== undefined) body.media_description = patch.description;
  if (patch.url !== undefined) body.media_url = patch.url;
  if (patch.transcript !== undefined) body.media_transcript = patch.transcript;

  const { data } = await api.patch<Media>(
    `/media/${encodeURIComponent(mediaId)}`,
    body
  );
  return data;
}

export async function deleteMedia(mediaId: string): Promise<void> {
  await api.delete(`/media/${encodeURIComponent(mediaId)}`);
}
