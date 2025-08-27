
export type CourseType = "Video" | "Podcast" | "Text";
export type ItemKind   = "video" | "audio" | "text";



export type Course = {
  id: string;
  type: CourseType;
  name: string;
  active: boolean;
  gradient: string[];
  description?: string;
};



export type LessonItem = {
  id: string;
  title: string;
  kind: ItemKind;  
  fileUri: string;
  fileName?: string | null;
};