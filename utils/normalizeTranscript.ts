// utils/normalizeTranscript.ts

export type TranscriptItem = {
    time: number;
    text: string[];
  };
  
  export function normalizeTranscript(transcript: string | any[]): TranscriptItem[] {
    if (Array.isArray(transcript)) {
      
      return transcript.map(item => ({
        ...item,
        text: Array.isArray(item.text)
          ? item.text
          : typeof item.text === "string"
            ? item.text.split(" ")
            : []
      }));
    }
    if (typeof transcript === "string" && transcript.trim() !== "") {
      return [{
        time: 0,
        text: transcript.split(" "),
      }];
    }
    return [];
  }
  