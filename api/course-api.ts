import { Course } from "../types/course";
import api from "./axiosClient";

export async function fetchCourses(): Promise<Course[]> {
  const { data } = await api.get("/courses");
  return data;
}

export async function fetchCourseById(courseId: string): Promise<Course> {
  const { data } = await api.get(`/courses/${courseId}`);
  return data;
}

export async function fetchCoursesByType(type: string): Promise<Course[]> {
  const { data } = await api.get("/courses", { params: { type } });
  return data;
}
