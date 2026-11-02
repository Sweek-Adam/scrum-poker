export const COFFEE = "☕";
export const UNSURE = "?";

export const DEFAULT_DECK = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", UNSURE, COFFEE];

export const DECK_PRESETS: { name: string; values: string[] }[] = [
  { name: "Fibonacci", values: DEFAULT_DECK },
  { name: "Suite modifiée", values: ["0", "½", "1", "2", "3", "5", "8", "13", "20", "40", "100", UNSURE, COFFEE] },
  { name: "T-shirt", values: ["XS", "S", "M", "L", "XL", "XXL", UNSURE, COFFEE] },
  { name: "Puissances de 2", values: ["1", "2", "4", "8", "16", "32", "64", UNSURE, COFFEE] },
  { name: "Jours", values: ["0.5j", "1j", "2j", "3j", "5j", "10j", UNSURE, COFFEE] },
];

/** Cards that carry no estimate and must stay out of the statistics. */
export function numericValue(value: string): number | null {
  if (value === UNSURE || value === COFFEE) return null;
  const normalized = value.replace("½", "0.5").replace(",", ".").replace(/[^\d.]/g, "");
  if (!normalized) return null;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseDeckInput(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(/[,\n;]/)
    .map((part) => part.trim())
    .filter((part) => {
      if (!part || seen.has(part)) return false;
      seen.add(part);
      return true;
    })
    .slice(0, 24);
}
