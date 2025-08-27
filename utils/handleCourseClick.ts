import { Router } from "expo-router";
import { Course } from "../types/course";

export function handleCourseClick(router: Router, course: Course) {
  router.push({
    pathname: '/course',
    params: { course_id: course.course_id },
  });
}
