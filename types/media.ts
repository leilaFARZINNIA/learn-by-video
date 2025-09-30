export type TranscriptLine = { time: number; text: string };

export type TranscriptObject = { html: string; cues?: TranscriptLine[] };
export type Transcript = string | TranscriptLine[] | TranscriptObject;

export interface Media {
  media_id: string;
  media_title: string;
  media_description?: string | null;
  course_id: string;
  media_url: string;
  media_transcript?: Transcript | null;
}
