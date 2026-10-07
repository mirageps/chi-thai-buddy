// 练习 / แบบฝึกหัด: fill-in-the-blank items. "_" marks the missing part.
export type BlankType = "initial" | "vowel" | "final";

export interface PracticeBlank {
  type: BlankType;
  masked: string;
  answer: string;
}

export interface PracticeWord {
  word: string;
  zh: string;
  read: string;
  blanks: PracticeBlank[];
}

const b = (type: BlankType, masked: string, answer: string): PracticeBlank => ({ type, masked, answer });

export const PRACTICE_WORDS: PracticeWord[] = [
  { word: "บ้าน", zh: "家", read: "baan", blanks: [b("initial", "_้าน", "บ"), b("final", "บ้า_", "น"), b("vowel", "บ้_น", "า")] },
  { word: "ปาก", zh: "嘴", read: "paak", blanks: [b("initial", "_าก", "ป"), b("final", "ปา_", "ก"), b("vowel", "ป_ก", "า")] },
  { word: "นก", zh: "鸟", read: "nok", blanks: [b("initial", "_ก", "น"), b("final", "น_", "ก")] },
  { word: "แมว", zh: "猫", read: "maew", blanks: [b("initial", "แ_ว", "ม"), b("final", "แม_", "ว"), b("vowel", "_มว", "แ")] },
  { word: "น้ำ", zh: "水", read: "naam", blanks: [b("initial", "_้ำ", "น")] },
  { word: "รถ", zh: "车", read: "rot", blanks: [b("initial", "_ถ", "ร"), b("final", "ร_", "ถ")] },
  { word: "มือ", zh: "手", read: "mue", blanks: [b("initial", "_ือ", "ม")] },
  { word: "ปลา", zh: "鱼", read: "plaa", blanks: [b("vowel", "ปล_", "า")] },
  { word: "ไก่", zh: "鸡", read: "kai", blanks: [b("initial", "ไ_่", "ก"), b("vowel", "_ก่", "ไ")] },
  { word: "กิน", zh: "吃", read: "kin", blanks: [b("initial", "_ิน", "ก"), b("final", "กิ_", "น"), b("vowel", "ก_น", "ิ")] },
  { word: "ดี", zh: "好", read: "dii", blanks: [b("initial", "_ี", "ด"), b("vowel", "ด_", "ี")] },
  { word: "หมู", zh: "猪", read: "muu", blanks: [b("vowel", "หม_", "ู")] },
  { word: "ช้าง", zh: "大象", read: "chaang", blanks: [b("initial", "_้าง", "ช"), b("final", "ช้า_", "ง"), b("vowel", "ช้_ง", "า")] },
  { word: "เด็ก", zh: "孩子", read: "dek", blanks: [b("initial", "เ_็ก", "ด"), b("final", "เด็_", "ก"), b("vowel", "_ด็ก", "เ")] },
  { word: "ฟัน", zh: "牙齿", read: "fan", blanks: [b("initial", "_ัน", "ฟ"), b("final", "ฟั_", "น"), b("vowel", "ฟ_น", "ั")] },
  { word: "ลม", zh: "风", read: "lom", blanks: [b("initial", "_ม", "ล"), b("final", "ล_", "ม")] },
  { word: "นอน", zh: "睡觉", read: "naawn", blanks: [b("initial", "_อน", "น"), b("final", "นอ_", "น")] },
  { word: "ขาย", zh: "卖", read: "khaai", blanks: [b("initial", "_าย", "ข"), b("final", "ขา_", "ย"), b("vowel", "ข_ย", "า")] },
  { word: "สวย", zh: "美丽", read: "suai", blanks: [b("final", "สว_", "ย")] },
  { word: "โต๊ะ", zh: "桌子", read: "to", blanks: [b("initial", "โ_๊ะ", "ต"), b("vowel", "_ต๊ะ", "โ")] },
  { word: "งู", zh: "蛇", read: "nguu", blanks: [b("initial", "_ู", "ง"), b("vowel", "ง_", "ู")] },
  { word: "ยาง", zh: "橡胶", read: "yaang", blanks: [b("initial", "_าง", "ย"), b("final", "ยา_", "ง")] },
];

export const POOLS: Record<BlankType, string[]> = {
  initial: ["ก", "ข", "ค", "ง", "จ", "ช", "ด", "ต", "ท", "น", "บ", "ป", "พ", "ฟ", "ม", "ย", "ร", "ล", "ว", "ส", "ห"],
  final: ["น", "ก", "ง", "ม", "ย", "ว", "ด", "บ", "ถ"],
  vowel: ["า", "ิ", "ี", "ุ", "ู", "ั", "ื", "เ", "แ", "โ", "ไ"],
};

export const BLANK_LABEL: Record<BlankType, { zh: string; th: string }> = {
  initial: { zh: "首辅音", th: "พยัญชนะต้น" },
  vowel: { zh: "元音", th: "สระ" },
  final: { zh: "韵尾", th: "ตัวสะกด" },
};

/** Display a vowel/consonant option with ◌ where a consonant would sit. */
export function optionLabel(type: BlankType, s: string): string {
  if (type !== "vowel") return s;
  if ("เแโไใ".includes(s)) return `${s}◌`;
  return `◌${s}`;
}
