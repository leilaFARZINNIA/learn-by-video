// api/auth-api.ts
import api from "./axiosClient";

export type CheckResp = {
  exists: boolean;
  has_password?: boolean;
  provider?: string | null;
};

export type Me = {
  email: string | null;
  name: string | null;
  avatar?: string | null;
};

export async function checkEmail(email: string): Promise<CheckResp> {
  const { data } = await api.get<CheckResp>("/auth/check", { params: { email } });
  return data;
}


export async function getMe(): Promise<Me> {
  const { data } = await api.get<Me>("/me");
  return data;
}


export async function changeUsername(username: string): Promise<void> {
  await api.patch("/me/username", { username });
}

export async function logout(): Promise<void> {
 
  const { signOut } = await import("firebase/auth");
  const { auth } = await import("@/utils/firebase.web");
  await signOut(auth);
}
