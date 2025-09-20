// src/api/courses.ts
import api from "./axiosClient";

/* ---------------------------------- Types --------------------------------- */

export type CourseType = "Video" | "Podcast" | "Text";

export type CourseTypeDB = "video" | "podcast" | "text";


export interface ApiCourse {
  course_id: string;
  course_title: string;
  course_description?: string | null;
  course_type: CourseTypeDB; // "video" | "podcast" | "text"
}


export interface UICourse {
  id: string;
  name: string;
  description?: string | null;
  type: CourseType; // "Video" | "Podcast" | "Text"
  active?: boolean;
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
});

/* --------------------------------- Queries -------------------------------- */

export async function fetchCourses(params?: {
  type?: CourseType; // UI type (Video/Podcast/Text)
}): Promise<ApiCourse[]> {
  const q = params?.type ? { type: params.type } : undefined; 
  const { data } = await api.get<ApiCourse[]>("/courses", { params: q });
  return data;
}


export async function fetchCourseById(courseId: string): Promise<ApiCourse> {
  const { data } = await api.get<ApiCourse>(`/courses/${courseId}`);
  return data;
}


export async function fetchCoursesByType(
  type: CourseType
): Promise<ApiCourse[]> {
  const { data } = await api.get<ApiCourse[]>("/courses", { params: { type } });
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
    course_type: input.type,
  };
  const { data } = await api.post<ApiCourse>("/courses", payload);
  return data;
}


export async function updateCourse(
  courseId: string,
  patch: Partial<{
    title: string;
    description?: string | null;
    type: CourseType;
  }>
): Promise<ApiCourse> {
  const body: Record<string, unknown> = {};
  if (patch.title !== undefined) body.course_title = patch.title;
  if (patch.description !== undefined) body.course_description = patch.description;
  if (patch.type !== undefined) body.course_type = patch.type;
  const { data } = await api.patch<ApiCourse>(`/courses/${courseId}`, body);
  return data;
}


export async function deleteCourse(courseId: string): Promise<void> {
  await api.delete(`/courses/${courseId}`);
}

/* --------------------------- UI-friendly Helpers --------------------------- */

export async function fetchCoursesUI(params?: {
  type?: CourseType;
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
  patch: Partial<{ title: string; description?: string | null; type: CourseType }>
): Promise<UICourse> {
  const updated = await updateCourse(courseId, patch);
  return toUICourse(updated);
}
