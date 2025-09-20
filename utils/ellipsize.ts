
function sliceGraphemes(s: string, n: number) {
  return Array.from(s).slice(0, n).join("");
}

export type EllipsizeOpts = {
  maxWords?: number;   
  maxChars?: number;     
  respectGraphemes?: boolean; 
  separatorRegex?: RegExp;   
};

export function ellipsizeSmart(
  input: string | null | undefined,
  opts: EllipsizeOpts = {}
): string {
  const {
    maxWords = 2,
    maxChars = 16,
    respectGraphemes = true,
    separatorRegex = /\s+/,
  } = opts;

  const s = (input ?? "").trim();
  if (!s) return "";

  const cut = (str: string, n: number) => {
    if (n <= 1) return "…";
    if (str.length <= n) return str;
    return (respectGraphemes ? sliceGraphemes(str, n - 1) : str.slice(0, n - 1)) + "…";
  };

  const parts = s.split(separatorRegex).filter(Boolean);

  if (parts.length > 1) {
 
    const byWords = parts.slice(0, maxWords).join(" ");
    if (parts.length > maxWords) {
   
      return byWords.length > maxChars ? cut(byWords, maxChars) : byWords + "…";
    }

    return s.length > maxChars ? cut(s, maxChars) : s;
  }


  return cut(s, maxChars);
}
