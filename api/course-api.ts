// src/api/courses.ts
import api from "./axiosClient";

/* ---------------------------------- Types --------------------------------- */

export type CourseType = "Video" | "Podcast" | "Text";
export type CourseTypeDB = "video" | "podcast" | "text";

export interface ApiCourse {
  course_id: string;
  course_title: string;
  course_description?: string | null;
  course_type: CourseTypeDB;   // "video" | "podcast" | "text"
  active: boolean;             // ← REQUIRED
}

export interface UICourse {
  id: string;
  name: string;
  description?: string | null;
  type: CourseType;            // "Video" | "Podcast" | "Text"
  active: boolean;             
  gradient?: any;
}

/* ------------------------------- Type Mappers ------------------------------ */
export const toDBType = (t: CourseType): CourseTypeDB =>
  t.toLowerCase() as CourseTypeDB;

export const toUIType = (t: CourseTypeDB): CourseType =>
  (t.charAt(0).toUpperCase() + t.slice(1)) as CourseType;

export const toUICourse = (c: ApiCourse): UICourse => ({
  id: c.course_id,
  name: c.course_title,
  description: c.course_description ?? undefined,
  type: toUIType(c.course_type),
  active: c.active,
});

/* --------------------------------- Queries -------------------------------- */

export async function fetchCourses(params?: {
  type?: CourseType;     // UI type (Video/Podcast/Text)
  public?: boolean;      
}): Promise<ApiCourse[]> {
  const q: Record<string, any> = {};
  if (params?.type) q.type = params.type;   
  if (params?.public) q.public = true;

  const { data } = await api.get<ApiCourse[]>("/courses", { params: q });
  return data;
}

export async function fetchCourseById(courseId: string): Promise<ApiCourse> {
  const { data } = await api.get<ApiCourse>(`/courses/${courseId}`);
  return data;
}

export async function fetchCoursesByType(
  type: string,
  opts?: { public?: boolean }
) {
  const params: Record<string, any> = { type };
  if (opts?.public) params.public = true; 

  const { data } = await api.get("/courses", { params });
  return data; 
}

/* -------------------------------- Mutations -------------------------------- */

export async function createCourse(input: {
  title: string;
  description?: string | null;
  type: CourseType; // "Video" | "Podcast" | "Text"
}): Promise<ApiCourse> {
  const payload = {
    course_title: input.title,
    course_description: input.description ?? null,
    course_type: toDBType(input.type),  // ← lowercase 
  };
  const { data } = await api.post<ApiCourse>("/courses", payload);
  return data;
}

export async function updateCourse(
  courseId: string,
  patch: Partial<{
    title: string;
    description: string | null;
    type: CourseType;
    active: boolean;               
  }>
): Promise<ApiCourse> {
  const body: Record<string, unknown> = {};
  if (patch.title !== undefined) body.course_title = patch.title;
  if (patch.description !== undefined) body.course_description = patch.description;
  if (patch.type !== undefined) body.course_type = toDBType(patch.type);
  if (patch.active !== undefined) body.active = patch.active;

  const { data } = await api.patch<ApiCourse>(`/courses/${courseId}`, body);
  return data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await api.delete(`/courses/${courseId}`);
}

/* --------------------------- UI-friendly Helpers --------------------------- */

export async function fetchCoursesUI(params?: {
  type?: CourseType;
  public?: boolean;
}): Promise<UICourse[]> {
  const rows = await fetchCourses(params);
  return rows.map(toUICourse);
}

export async function createCourseUI(input: {
  title: string;
  description?: string | null;
  type: CourseType;
}): Promise<UICourse> {
  const created = await createCourse(input);
  return toUICourse(created);
}

export async function fetchCourseByIdUI(courseId: string): Promise<UICourse> {
  const row = await fetchCourseById(courseId);
  return toUICourse(row);
}

export async function updateCourseUI(
  courseId: string,
  patch: Partial<{ title: string; description: string | null; type: CourseType; active: boolean }>
): Promise<UICourse> {
  const updated = await updateCourse(courseId, patch);
  return toUICourse(updated);
}
