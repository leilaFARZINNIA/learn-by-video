// api/mediaApi.ts

import { Media } from '../types/media';

const BASE_URL = "http://172.20.10.3:8000"; // Basis-URL für das Backend

// Holt alle Medien für einen bestimmten Kurs
export async function fetchMediasByCourse(courseId: string): Promise<Media[]> {
  const res = await fetch(`${BASE_URL}/courses/${courseId}/medias`);
  if (!res.ok) throw new Error("Fehler beim Laden der Medien für diesen Kurs");
  return await res.json();
}

// Holt die Detaildaten zu einem bestimmten Medium (über media_id)
export async function fetchMediaById(mediaId: string): Promise<Media> {
  const res = await fetch(`${BASE_URL}/medias/${mediaId}`);
  if (!res.ok) throw new Error("Fehler beim Laden der Mediendetails");
  return await res.json();
}
