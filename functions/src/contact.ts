import { getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { z } from "zod";

if (!getApps().length) initializeApp();
const db = getFirestore();

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(4000),
});

const redactEmail = (e?: string | null) =>
  (e || "").replace(/(^.).+(@.+$)/, (_m, a, b) => `${a}***${b}`) || "unknown";

function getClientIp(req: any): string {
  const xf = (req.rawRequest?.headers?.["x-forwarded-for"] as string | undefined) || "";
  const viaProxy = xf.split(",")[0]?.trim();
  return viaProxy || req.rawRequest?.ip || "unknown";
}

export const submitContactForm = onCall(
  { region: "europe-west3", cors: true, timeoutSeconds: 10, memory: "256MiB" },
  async (req) => {
    const started = Date.now();
    const ip = getClientIp(req);
    const ua = (req.rawRequest?.headers?.["user-agent"] as string | undefined) || "unknown";
    const authUid = req.auth?.uid ?? null;

    try {
      const parsed = ContactSchema.safeParse(req.data);
      if (!parsed.success) {
        throw new HttpsError("invalid-argument", "Invalid input.");
      }
      const d = parsed.data;

      // rate limit: max 3 per hour per IP
      const since = Date.now() - 60 * 60 * 1000;
      const rateQ = await db
        .collection("contactMessages")
        .where("ip", "==", ip)
        .where("createdAtMs", ">", since)
        .get();
      if (rateQ.size >= 3) {
        throw new HttpsError("resource-exhausted", "Too many submissions. Try later.");
      }

      const now = Date.now();
      const ref = await db.collection("contactMessages").add({
        name: d.name.trim(),
        email: d.email.toLowerCase(),
        title: d.title.trim(),
        description: d.description.trim(),
        createdAt: FieldValue.serverTimestamp(),
        createdAtMs: now,
        status: "new" as const,
        ip,
        ua,
        userId: authUid,
      });

      logger.info("submitContactForm:stored", {
        id: ref.id,
        emailRedacted: redactEmail(d.email),
        durationMs: Date.now() - started,
      });

      return { ok: true, id: ref.id };
    } catch (err: any) {
      const msg = String(err?.message || err || "");
      const needsIndex =
        msg.includes("The query requires an index") ||
        msg.includes("FAILED_PRECONDITION") ||
        (typeof err?.code === "number" && err.code === 9);
      if (needsIndex) {
        throw new HttpsError("failed-precondition", "Index is being prepared. Try again in a minute.");
      }
      if (err instanceof HttpsError) throw err;
      throw new HttpsError("internal", "Something went wrong. Please try again later.");
    }
  }
);
