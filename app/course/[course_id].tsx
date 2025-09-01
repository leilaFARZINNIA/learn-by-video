import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetchMediasByCourse } from "../../api/media-api";
import NotebookList from "../../components/courselist/shared/NotebookList";
import { Media } from "../../types/media";

export default function CourseDetailScreen() {
  const router = useRouter();
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const { course_id, type, title } =
    useLocalSearchParams<{ course_id: string; type?: string; title?: string }>();

  const TYPE_LABEL: Record<string, string> = {
    video: "VIDEOS",
    podcast: "PODCASTS",
    text: "TEXTS",
  };

  const listTitle =
    title
      ? `${title} — ${TYPE_LABEL[type ?? ""] ?? "COURSE"}`
      : TYPE_LABEL[type ?? ""] ?? "COURSE";

  useEffect(() => {
    if (!course_id) return;
    setLoading(true);
    fetchMediasByCourse(course_id)
      .then(setMedias)
      .finally(() => setLoading(false));
  }, [course_id]);

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    );

 
    return (
      <NotebookList
  title={listTitle}
  iconSource={
    type === "video"
      ? require("../../assets/images/filmicon.png")
      : type === "podcast"
      ? require("../../assets/images/podcast.png")
      : require("../../assets/images/text.png")
  }
  items={medias.map((m) => ({
    id: m.media_id,
    title: m.media_title,
    type: (type as "video" | "podcast" | "text") ?? "video",
  }))}


  
  
  onItemPress={(item) => {
    console.log("press", item.id);
    if (item.type === "video") router.push(`/video-player/${encodeURIComponent(String(item.id))}`);
    if (item.type === "text") router.push(`/video-player/${encodeURIComponent(String(item.id))}`);
    if (item.type === "podcast") router.push(`/podcast/${encodeURIComponent(String(item.id))}`);
    
  }}


  
/>

    );
  
  
}
