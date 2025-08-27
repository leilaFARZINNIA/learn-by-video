export interface Course {
    course_id: string;
    course_title: string;
    course_description?: string;
    course_type: "video" | "podcast" | "text"; 
  }
  