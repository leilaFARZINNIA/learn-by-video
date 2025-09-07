// api/profile-api.ts
import api from "./axiosClient";

export function patchMe(payload: { username?: string; email?: string }) {
  return api.patch("/me", payload);
}

export function deleteMe() {
  return api.delete("/me");
}

export function syncEmail(email: string) {
  return api.post("/me/sync-email", { email });
}
