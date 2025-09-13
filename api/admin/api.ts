// app/admin/api.ts
import { Counts, Item, Status } from "@/components/admin/types";
import { getFunctions, httpsCallable } from "firebase/functions";

const fns = getFunctions(undefined, "europe-west3");
const fnList   = httpsCallable(fns, "adminListContacts");
const fnGet    = httpsCallable(fns, "adminGetContact");
const fnUpdate = httpsCallable(fns, "adminUpdateContactStatus");
const fnDelete = httpsCallable(fns, "adminDeleteContact");
const fnStats  = httpsCallable(fns, "adminStats");

export async function listContacts(params: { status: Status; pageSize?: number; cursor?: number }) {
  const res: any = await fnList(params);
  return { items: res.data.items as Item[], nextPageToken: res.data.nextPageToken as number | null };
}

export async function getContact(params: { id: string }) {
  const res: any = await fnGet(params);
  return res.data as Item & { description: string };
}

export async function updateContactStatus(params: { id: string; status: Status }) {
  await fnUpdate(params);
}

export async function deleteContact(params: { id: string }) {
  await fnDelete(params);
}

export async function getStats(): Promise<{ byStatus: Counts }> {
  const res: any = await fnStats();
  return res.data as { byStatus: Counts };
}
