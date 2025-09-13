// hooks/useIsAdmin.ts
import { auth } from "@/utils/firebase";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";


export function useIsAdmin(): boolean | null {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          if (mounted) setIsAdmin(false);
          return;
        }
        // Force refresh so recent claim changes are seen immediately
        const token = await getIdTokenResult(u, true);
        const admin = !!(token.claims as any)?.admin;
        if (mounted) setIsAdmin(admin);
      } catch (err) {
        console.log("[useIsAdmin] error:", err);
        if (mounted) setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return isAdmin;
}
