// auth/account.ts
import { auth } from "@/utils/firebase";
import {
    deleteUser,
    EmailAuthProvider,
    linkWithCredential,
    reauthenticateWithCredential,
    sendEmailVerification,
    updateEmail,
    updatePassword,
} from "firebase/auth";

export function getProviderFlags() {
  const u = auth.currentUser;
  const providers = u?.providerData?.map(p => p.providerId) ?? [];
  return {
    hasPassword: providers.includes("password"),
    hasGoogle: providers.includes("google.com"),
  };
}


export async function setInitialPassword(newPassword: string) {
  const u = auth.currentUser;
  if (!u?.email) throw new Error("No user/email");
  const cred = EmailAuthProvider.credential(u.email, newPassword);
  await linkWithCredential(u, cred);
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const u = auth.currentUser;
  if (!u?.email) throw new Error("No user/email");
  const cred = EmailAuthProvider.credential(u.email, currentPassword);
  await reauthenticateWithCredential(u, cred);
  await updatePassword(u, newPassword);
}

export async function changeEmail(currentPassword: string, newEmail: string) {
  const u = auth.currentUser;
  if (!u?.email) throw new Error("No user/email");
  const cred = EmailAuthProvider.credential(u.email, currentPassword);
  await reauthenticateWithCredential(u, cred);
  await updateEmail(u, newEmail);
  await sendEmailVerification(u); 
}

export async function removeAccount(currentPassword?: string) {
  const u = auth.currentUser;
  if (!u?.email) throw new Error("No user/email");
  if (currentPassword) {
    const cred = EmailAuthProvider.credential(u.email, currentPassword);
    await reauthenticateWithCredential(u, cred);
  }
  await deleteUser(u);
}
