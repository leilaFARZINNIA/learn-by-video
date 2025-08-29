// src/api/mediaApi.ts
import api from "./axiosClient";

import type { Media } from "../types/media";

export async function fetchMediasByCourse(courseId: string): Promise<Media[]> {
  const { data } = await api.get<Media[]>(`/courses/${courseId}/medias`);
  return data;
}

export async function fetchMediaById(mediaId: string): Promise<Media> {
  const { data } = await api.get<Media>(`/medias/${mediaId}`);
  return data;
}
