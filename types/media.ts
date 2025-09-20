export interface TranscriptLine {
  time: number;
  text: string;
}

export type Transcript = string | TranscriptLine[] | null | undefined;

export interface Media {
  media_id: string;
  media_title: string;
  media_description?: string | null;
  course_id: string;
  media_url: string;
  media_transcript?: Transcript;
}
