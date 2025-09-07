// constants/passwordPolicy.ts
export const PASSWORD_MIN = 8;          // hard min
export const PASSWORD_RECOMMENDED = 12; // for copy only
export const PASSWORD_MAX = 64;

export function isPasswordValid(p?: string) {
  const s = p ?? "";
  const len = [...s].length;          
  if (len < PASSWORD_MIN || len > PASSWORD_MAX) return false;
  if (!/\S/.test(s)) return false;    
  return true;
}
