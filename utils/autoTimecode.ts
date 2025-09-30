// src/utils/autoTiming.ts


const htmlToPlain = (html: string) =>
  String(html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();


const splitIntoSentences = (text: string) =>
  String(text ?? "")
    .replace(/\s+/g, " ")
    .split(/(?<=[\.!\?])\s+|\n+/g)
    .map((s) => s.trim())
    .filter(Boolean);

export type AutoItem = { time: number; text: string[] };

const dedupeTimes = (items: AutoItem[]) => {
  let last = -1;
  return items.map((it) => {
    let t = it.time;
    if (t <= last) t = last + 1;
    last = t;
    return { ...it, time: t };
  });
};


export function autoTimeTranscript(transcript: unknown, durationSec: number): AutoItem[] {
 
  if (Array.isArray(transcript)) {
    const ok = transcript.every(
      (l: any) =>
        typeof l?.time === "number" &&
        (Array.isArray(l.text) || typeof l.text === "string")
    );
    if (ok) {
      return (transcript as any[]).map((l) => ({
        time: Math.max(0, Math.floor(l.time)),
        text: Array.isArray(l.text) ? l.text : [String(l.text ?? "")],
      }));
    }
  }

  
  const plain = htmlToPlain(String(transcript ?? ""));
  if (!plain) return [];

  const sents = splitIntoSentences(plain);
  if (!sents.length) return [];

  const totalLen = sents.reduce((a, s) => a + s.length, 0) || 1;
  const secs = Math.max(1, Math.floor(durationSec || 1));

  let acc = 0;
  const items: AutoItem[] = sents.map((s) => {
    const start = Math.floor((acc / totalLen) * secs);
    acc += s.length;
    return { time: start, text: [s] };
  });

  return dedupeTimes(items);
}
