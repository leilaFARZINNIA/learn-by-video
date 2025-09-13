// app/contact/lib/validation.ts
export const isValidEmail = (raw: string) => {
    const e = raw.trim();
    const parts = e.split("@");
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    if (!local || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
    if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
    if (!domain || domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;
    if (domain.startsWith("-") || domain.endsWith("-")) return false;
    if (!/^[A-Za-z0-9.-]+$/.test(domain)) return false;
    const lastDot = domain.lastIndexOf(".");
    if (lastDot < 1 || lastDot === domain.length - 1) return false;
    const tld = domain.slice(lastDot + 1);
    if (!/^[A-Za-z]{2,63}$/.test(tld)) return false;
    return true;
  };
  