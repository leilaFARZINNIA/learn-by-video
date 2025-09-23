// src/api/profile-api.ts
import api from "./axiosClient";


export type Me = {
  user_id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
};


export async function getMe(): Promise<Me> {
  const { data } = await api.get<Me>("/me");
  return data;
}

export function patchMe(payload: Partial<Pick<Me, "name" | "email">>) {
  return api.patch("/me", payload);
}

export function deleteMe() {
  return api.delete("/me");
}

export function syncEmail(email: string) {
  return api.post("/me/sync-email", { email });
}


export async function ensureUserSynced(): Promise<Me> {
  return getMe();
}
