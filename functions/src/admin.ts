import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { z } from "zod";

if (!getApps().length) initializeApp();
const db = getFirestore();


function assertAdmin(req: any): { uid: string } {
  const uid = req.auth?.uid as string | undefined;
  const token = req.auth?.token as any | undefined;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");
  if (!token?.admin && token?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin only.");
  }
  return { uid };
}

/* ─────────────── Admin: Set/Unset Claim (bootstrap) ─────────────── */
const SetAdminSchema = z.object({
  targetUid: z.string().min(1),
  makeAdmin: z.boolean().default(true),
 
  secret: z.string().optional(),
});

export const setAdminClaim = onCall(
  { region: "europe-west3", cors: true, timeoutSeconds: 10, memory: "256MiB" },
  async (req) => {
    const { targetUid, makeAdmin, secret } = SetAdminSchema.parse(req.data ?? {});
    const callerIsAdmin = req.auth?.token?.admin === true || req.auth?.token?.role === "admin";
    const setupSecret = process.env.ADMIN_SETUP_SECRET;


    if (!callerIsAdmin) {
      if (!setupSecret || !secret || secret !== setupSecret) {
        throw new HttpsError("permission-denied", "Admin only.");
      }
    }

    await getAuth().setCustomUserClaims(targetUid, { admin: makeAdmin });
    return { ok: true };
  }
);

/* ─────────────── List Contacts ─────────────── */
const ListSchema = z.object({
  pageSize: z.number().int().min(1).max(50).optional().default(20),
  cursor: z.number().int().optional(),
  status: z.enum(["new", "open", "done"]).optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  q: z.string().trim().max(120).optional(),
});

type ContactDoc = {
  name: string;
  email: string;
  title: string;
  description: string;
  createdAtMs: number;
  createdAt?: FirebaseFirestore.Timestamp | null;
  status: "new" | "open" | "done";
  ip?: string;
  ua?: string;
  userId?: string | null;
  updatedAt?: FirebaseFirestore.FieldValue;
  updatedBy?: string | null;
};

export const adminListContacts = onCall(
  { region: "europe-west3", cors: true, timeoutSeconds: 15, memory: "256MiB" },
  async (req) => {
    const { uid } = assertAdmin(req);
    const p = ListSchema.parse(req.data ?? {});

    let qRef: FirebaseFirestore.Query = db.collection("contactMessages");
    if (p.status) qRef = qRef.where("status", "==", p.status);
    qRef = qRef.orderBy("createdAtMs", p.order);
    if (p.cursor !== undefined) {
      qRef = p.order === "desc"
        ? qRef.where("createdAtMs", "<", p.cursor)
        : qRef.where("createdAtMs", ">", p.cursor);
    }

    const snap = await qRef.limit(p.pageSize + 1).get();
    let docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as ContactDoc) }));

    if (p.q) {
      const qq = p.q.toLowerCase();
      docs = docs.filter((d) =>
        [d.name, d.email, d.title].some((v) => (v || "").toLowerCase().includes(qq))
      );
    }

    const hasMore = docs.length > p.pageSize;
    const items = hasMore ? docs.slice(0, p.pageSize) : docs;
    const nextPageToken = hasMore ? items[items.length - 1].createdAtMs : null;

    return {
      items: items.map((d) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        title: d.title,
        status: d.status,
        createdAtMs: d.createdAtMs,
      })),
      nextPageToken,
    };
  }
);

/* ─────────────── Get One ─────────────── */
const GetSchema = z.object({ id: z.string().min(1) });

export const adminGetContact = onCall(
  { region: "europe-west3", cors: true, timeoutSeconds: 10, memory: "256MiB" },
  async (req) => {
    assertAdmin(req);
    const { id } = GetSchema.parse(req.data ?? {});
    const ref = db.collection("contactMessages").doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new HttpsError("not-found", "Message not found.");
    return { id: doc.id, ...(doc.data() as ContactDoc) };
  }
);

/* ─────────────── Update Status ─────────────── */
const UpdateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "open", "done"]),
});

export const adminUpdateContactStatus = onCall(
  { region: "europe-west3", cors: true, timeoutSeconds: 10, memory: "256MiB" },
  async (req) => {
    const { uid } = assertAdmin(req);
    const { id, status } = UpdateStatusSchema.parse(req.data ?? {});
    const ref = db.collection("contactMessages").doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new HttpsError("not-found", "Message not found.");
    await ref.update({ status, updatedAt: FieldValue.serverTimestamp(), updatedBy: uid });
    return { ok: true };
  }
);

/* ─────────────── Delete ─────────────── */
const DeleteSchema = z.object({ id: z.string().min(1) });

export const adminDeleteContact = onCall(
  { region: "europe-west3", cors: true, timeoutSeconds: 10, memory: "256MiB" },
  async (req) => {
    assertAdmin(req);
    const { id } = DeleteSchema.parse(req.data ?? {});
    await db.collection("contactMessages").doc(id).delete();
    return { ok: true };
  }
);


export const adminStats = onCall(
  { region: "europe-west3", cors: true, timeoutSeconds: 15, memory: "256MiB" },
  async (req) => {
    assertAdmin(req);
    const [n, o, d] = await Promise.all([
      db.collection("contactMessages").where("status", "==", "new").get(),
      db.collection("contactMessages").where("status", "==", "open").get(),
      db.collection("contactMessages").where("status", "==", "done").get(),
    ]);
    return { total: n.size + o.size + d.size, byStatus: { new: n.size, open: o.size, done: d.size } };
  }
);
