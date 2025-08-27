import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetchCoursesByType } from "../../api/course-api";
import NotebookList from "../../components/courselist/shared/NotebookList";
import { Course } from "../../types/course";

export default function CourseListScreen() {
  const { type = "video" } = useLocalSearchParams<{ type?: string }>();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const TITLE = { video: "VIDEOS", podcast: "PODCASTS", text: "TEXTS" }[type] ?? "COURSES";
  const ICON = (
    {
      video: require("../../assets/images/filmicon.png"),
      podcast: require("../../assets/images/podcast.png"),
      text: require("../../assets/images/text.png"),
    } as const
  )[type] ?? require("../../assets/images/filmicon.png");

  useEffect(() => {
    setLoading(true);
    fetchCoursesByType(type).then(setCourses).finally(() => setLoading(false));
  }, [type]);

  if (loading) return <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}><Text>Loading…</Text></View>;

  return (
    <NotebookList
      title={TITLE}
      iconSource={ICON}
      items={courses.map(c => ({ id: c.course_id, title: c.course_title, type: type as "video" | "podcast" | "text" }))}
      onItemPress={(item) => router.push({
        pathname: "/course/[course_id]",
        params: {
          course_id: String(item.id),
          type,
          title: item.title,
        },
      })}     
    />
  );
}
