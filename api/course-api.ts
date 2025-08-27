// api/courseApi.ts
import { Course } from '../types/course';

const BASE_URL = "http://localhost:8000";

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error("Fehler beim Laden der Kurse");
  return await res.json();
}

export async function fetchCourseById(courseId: string): Promise<Course> {
  const res = await fetch(`${BASE_URL}/courses/${courseId}`);
  if (!res.ok) throw new Error("Fehler beim Laden des Kurses");
  return await res.json();
}


export async function fetchCoursesByType(type: string): Promise<Course[]> {
  const res = await fetch(`${BASE_URL}/courses?type=${encodeURIComponent(type)}`);
  if (!res.ok) throw new Error(`Fehler beim Laden der ${type}-Kurse`);
  return await res.json();
}
