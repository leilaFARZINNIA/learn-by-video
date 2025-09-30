// src/hooks/useTranscript.ts
import { alignTranscript, fetchTranscript, TranscriptOut } from "@/api/transcript";
import { useCallback, useEffect, useState } from "react";

export function useTranscript(mediaId?: string, opts?: { autoAlignWhen?: "have-duration"; durationSec?: number }) {
  const [data, setData] = useState<TranscriptOut | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!mediaId) return;
    setLoading(true);
    try {
      const t = await fetchTranscript(mediaId);
      setData(t);
      if (opts?.autoAlignWhen === "have-duration" && t.status !== "ready" && (opts.durationSec ?? 0) > 0) {
        const aligned = await alignTranscript(mediaId, opts.durationSec!);
        setData(aligned);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [mediaId, opts?.autoAlignWhen, opts?.durationSec]);

  useEffect(() => { load(); }, [load]);

  return { transcript: data, loading, reload: load };
}
