// app/contact/lib/service.ts
import { app } from "@/utils/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

export type ContactPayload = { name: string; email: string; title: string; description: string };

export async function sendContact(payload: ContactPayload): Promise<void> {
  const functions = getFunctions(app, "europe-west3");
  const submit = httpsCallable(functions, "submitContactForm");
  await submit(payload);
}
