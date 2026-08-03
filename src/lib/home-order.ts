// 首页 (Home) presentation-only selectors.
// Source of truth stays in src/data/thai.ts — these are derived, non-mutating copies.
import { CONSONANTS, VOWELS, type Consonant, type ConsonantClass, type Vowel } from "@/data/thai";

/** Canonical Thai alphabetical order ก–ฮ (44 letters) used only for the Home page. */
export const HOME_CONSONANT_ORDER = [
  "ก","ข","ฃ","ค","ฅ","ฆ","ง","จ","ฉ","ช","ซ","ฌ","ญ","ฎ","ฏ","ฐ","ฑ","ฒ","ณ","ด",
  "ต","ถ","ท","ธ","น","บ","ป","ผ","ฝ","พ","ฟ","ภ","ม","ย","ร","ล","ว","ศ","ษ","ส",
  "ห","ฬ","อ","ฮ",
] as const;

/** Derived array (never mutates CONSONANTS) sorted by ก–ฮ display order. */
export const homeConsonants: Consonant[] = [...CONSONANTS].sort(
  (a, b) => HOME_CONSONANT_ORDER.indexOf(a.char as never) - HOME_CONSONANT_ORDER.indexOf(b.char as never),
);

/** Derived array in the project's existing lesson order (ะ → า → ิ → ี → ึ → ื → ุ → ู → …). */
export const homeVowels: Vowel[] = [...VOWELS];

export type VowelKind = "short" | "long" | "diph";

export function vowelKind(v: Vowel): VowelKind {
  if (v.zhName.startsWith("复合")) return "diph";
  return v.length;
}

export const VOWEL_KIND_LABEL: Record<VowelKind, { zh: string; th: string; colorVar: string }> = {
  short: { zh: "短元音", th: "สั้น", colorVar: "--class-mid" },
  long: { zh: "长元音", th: "ยาว", colorVar: "--class-low" },
  diph: { zh: "复合元音", th: "ประสม", colorVar: "--class-high" },
};

export const CLASS_LEGEND: { cls: ConsonantClass; zh: string; th: string }[] = [
  { cls: "mid", zh: "中", th: "กลาง" },
  { cls: "high", zh: "高", th: "สูง" },
  { cls: "low", zh: "低", th: "ต่ำ" },
];
