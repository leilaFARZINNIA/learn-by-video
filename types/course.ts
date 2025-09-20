// src/types/course.ts
export type CourseType = "Video" | "Podcast" | "Text";
export type CourseTypeDB = "video" | "podcast" | "text";


export interface ApiCourse {
  course_id: string;
  course_title: string;
  course_description?: string | null;
  course_type: CourseTypeDB;
}


export interface UICourse {
  id: string;
  name: string;
  description?: string | null;
  type: CourseType;
  active: boolean;
  gradient: any; 
}

export const toUI = (c: ApiCourse): UICourse => ({
  id: c.course_id,
  name: c.course_title,
  description: c.course_description ?? undefined,
  type: (c.course_type[0].toUpperCase() + c.course_type.slice(1)) as CourseType,
  active: true,
  gradient: [], 
});
