// Central Thai syllable composition based on vowel patterns (拼写规则).
// 唯一的拼音节组合函数：Result Card 与详细面板必须共用此结果。
//
// 注意：Placeholder 顺序仅为设计说明；实际输出按泰文正字法与 Unicode 顺序拼装。

import { VOWELS, TONES, CONSONANTS } from "@/data/thai";

export type ToneMark =
  | "none"
  | "maiEk"
  | "maiTho"
  | "maiTri"
  | "maiChattawa";

export interface ToneShape {
  toneMark: ToneMark;
  symbol: string; // ่ ้ ๊ ๋ or ""
  zhLabel: string; // 无声调符号 / 第一声调符号 ...
  thLabel: string; // ไม่มีรูปวรรณยุกต์ / ไม้เอก ...
}

export const TONE_SHAPES: ToneShape[] = [
  { toneMark: "none", symbol: "", zhLabel: "无声调符号", thLabel: "ไม่มีรูปวรรณยุกต์" },
  { toneMark: "maiEk", symbol: "\u0E48", zhLabel: "第一声调符号", thLabel: "ไม้เอก ่" },
  { toneMark: "maiTho", symbol: "\u0E49", zhLabel: "第二声调符号", thLabel: "ไม้โท ้" },
  { toneMark: "maiTri", symbol: "\u0E4A", zhLabel: "第三声调符号", thLabel: "ไม้ตรี ๊" },
  { toneMark: "maiChattawa", symbol: "\u0E4B", zhLabel: "第四声调符号", thLabel: "ไม้จัตวา ๋" },
];

// Map TONES index (data/thai.ts) to structural ToneMark
export function toneMarkFromIndex(i: number): ToneMark {
  const t = TONES[i];
  switch (t?.symbol) {
    case "\u0E48": return "maiEk";
    case "\u0E49": return "maiTho";
    case "\u0E4A": return "maiTri";
    case "\u0E4B": return "maiChattawa";
    default: return "none";
  }
}

export function toneShapeOf(mark: ToneMark): ToneShape {
  return TONE_SHAPES.find((t) => t.toneMark === mark) ?? TONE_SHAPES[0];
}

// Vowel patterns keyed by index in VOWELS array (from data/thai.ts).
// open(I,T)    = 无韵尾时的写法
// closed(I,T,F) = 有韵尾时的写法（undefined 表示不支持加韵尾）
export interface VowelPattern {
  id: string;
  index: number;
  length: "short" | "long";
  supportsFinal: boolean;
  open: (I: string, T: string) => string;
  closed?: (I: string, T: string, F: string) => string;
}

// helper: mai taikhu (ไม้ไต่คู้) ็. 仅在无声调符号时使用。
const MAI_TAIKHU = "\u0E47";

export const VOWEL_PATTERNS: VowelPattern[] = [
  // 0 ◌ะ short-a
  {
    id: "short-a", index: 0, length: "short", supportsFinal: true,
    open: (I, T) => `${I}${T}\u0E30`,
    // closed: I + ั + T + F (กัก, กัน, ลัย)
    closed: (I, T, F) => `${I}\u0E31${T}${F}`,
  },
  // 1 ◌า long-a
  {
    id: "long-a", index: 1, length: "long", supportsFinal: true,
    open: (I, T) => `${I}${T}\u0E32`,
    closed: (I, T, F) => `${I}${T}\u0E32${F}`,
  },
  // 2 ◌ิ short-i
  {
    id: "short-i", index: 2, length: "short", supportsFinal: true,
    open: (I, T) => `${I}\u0E34${T}`,
    closed: (I, T, F) => `${I}\u0E34${T}${F}`,
  },
  // 3 ◌ี long-i
  {
    id: "long-i", index: 3, length: "long", supportsFinal: true,
    open: (I, T) => `${I}\u0E35${T}`,
    closed: (I, T, F) => `${I}\u0E35${T}${F}`,
  },
  // 4 ◌ึ short-ue
  {
    id: "short-ue", index: 4, length: "short", supportsFinal: true,
    open: (I, T) => `${I}\u0E36${T}`,
    closed: (I, T, F) => `${I}\u0E36${T}${F}`,
  },
  // 5 ◌ื long-uee : open uses ือ, closed drops อ
  {
    id: "long-uee", index: 5, length: "long", supportsFinal: true,
    open: (I, T) => `${I}\u0E37${T}\u0E2D`,
    closed: (I, T, F) => `${I}\u0E37${T}${F}`,
  },
  // 6 ◌ุ short-u
  {
    id: "short-u", index: 6, length: "short", supportsFinal: true,
    open: (I, T) => `${I}\u0E38${T}`,
    closed: (I, T, F) => `${I}\u0E38${T}${F}`,
  },
  // 7 ◌ู long-u
  {
    id: "long-u", index: 7, length: "long", supportsFinal: true,
    open: (I, T) => `${I}\u0E39${T}`,
    closed: (I, T, F) => `${I}\u0E39${T}${F}`,
  },
  // 8 เ◌ะ short-e: closed uses ไม้ไต่คู้ when no tone, otherwise replaced by tone
  {
    id: "short-e", index: 8, length: "short", supportsFinal: true,
    open: (I, T) => `\u0E40${I}${T}\u0E30`,
    closed: (I, T, F) =>
      T === ""
        ? `\u0E40${I}${MAI_TAIKHU}${F}` // เด็ก, เป็น
        : `\u0E40${I}${T}${F}`,           // เก๊ก
  },
  // 9 เ◌ long-e
  {
    id: "long-e", index: 9, length: "long", supportsFinal: true,
    open: (I, T) => `\u0E40${I}${T}`,
    closed: (I, T, F) => `\u0E40${I}${T}${F}`,
  },
  // 10 แ◌ะ short-ae
  {
    id: "short-ae", index: 10, length: "short", supportsFinal: true,
    open: (I, T) => `\u0E41${I}${T}\u0E30`,
    closed: (I, T, F) =>
      T === ""
        ? `\u0E41${I}${MAI_TAIKHU}${F}` // แข็ง
        : `\u0E41${I}${T}${F}`,
  },
  // 11 แ◌ long-ae
  {
    id: "long-ae", index: 11, length: "long", supportsFinal: true,
    open: (I, T) => `\u0E41${I}${T}`,
    closed: (I, T, F) => `\u0E41${I}${T}${F}`,
  },
  // 12 โ◌ะ short-o: closed drops entire vowel (กก, นม, ลม)
  {
    id: "short-o", index: 12, length: "short", supportsFinal: true,
    open: (I, T) => `\u0E42${I}${T}\u0E30`,
    closed: (I, T, F) => `${I}${T}${F}`,
  },
  // 13 โ◌ long-o
  {
    id: "long-o", index: 13, length: "long", supportsFinal: true,
    open: (I, T) => `\u0E42${I}${T}`,
    closed: (I, T, F) => `\u0E42${I}${T}${F}`,
  },
  // 14 เ◌าะ short-aw: closed unsupported (ก็อก 规则复杂，暂不猜测)
  {
    id: "short-aw", index: 14, length: "short", supportsFinal: false,
    open: (I, T) => `\u0E40${I}${T}\u0E32\u0E30`,
  },
  // 15 ◌อ long-aw
  {
    id: "long-aw", index: 15, length: "long", supportsFinal: true,
    open: (I, T) => `${I}${T}\u0E2D`,
    closed: (I, T, F) => `${I}${T}\u0E2D${F}`,
  },
  // 16 เ◌อะ short-oe: closed uses เ◌ิ (เงิน)
  {
    id: "short-oe", index: 16, length: "short", supportsFinal: true,
    open: (I, T) => `\u0E40${I}${T}\u0E2D\u0E30`,
    closed: (I, T, F) => `\u0E40${I}\u0E34${T}${F}`,
  },
  // 17 เ◌อ long-oee: closed uses เ◌ิ; if final = ย → เ◌ย
  {
    id: "long-oee", index: 17, length: "long", supportsFinal: true,
    open: (I, T) => `\u0E40${I}${T}\u0E2D`,
    closed: (I, T, F) =>
      F === "\u0E22"
        ? `\u0E40${I}${T}\u0E22`               // เคย, เนย
        : `\u0E40${I}\u0E34${T}${F}`,          // เดิน, เกิน
  },
  // 18 เ◌ียะ short-ia: closed unsupported
  {
    id: "short-ia", index: 18, length: "short", supportsFinal: false,
    open: (I, T) => `\u0E40${I}${T}\u0E35\u0E22\u0E30`,
  },
  // 19 เ◌ีย long-ia
  {
    id: "long-ia", index: 19, length: "long", supportsFinal: true,
    open: (I, T) => `\u0E40${I}${T}\u0E35\u0E22`,
    closed: (I, T, F) => `\u0E40${I}${T}\u0E35\u0E22${F}`,
  },
  // 20 เ◌ือะ short-uea: closed unsupported
  {
    id: "short-uea", index: 20, length: "short", supportsFinal: false,
    open: (I, T) => `\u0E40${I}${T}\u0E37\u0E2D\u0E30`,
  },
  // 21 เ◌ือ long-uea
  {
    id: "long-uea", index: 21, length: "long", supportsFinal: true,
    open: (I, T) => `\u0E40${I}${T}\u0E37\u0E2D`,
    closed: (I, T, F) => `\u0E40${I}${T}\u0E37\u0E2D${F}`,
  },
  // 22 ◌ัวะ short-ua: closed unsupported
  {
    id: "short-ua", index: 22, length: "short", supportsFinal: false,
    open: (I, T) => `${I}${T}\u0E31\u0E27\u0E30`,
  },
  // 23 ◌ัว long-ua: closed drops ั (กวน, สวย)
  {
    id: "long-ua", index: 23, length: "long", supportsFinal: true,
    open: (I, T) => `${I}${T}\u0E31\u0E27`,
    closed: (I, T, F) => `${I}${T}\u0E27${F}`,
  },
  // 24 ไ◌  – final not allowed
  {
    id: "ai-mai-malai", index: 24, length: "short", supportsFinal: false,
    open: (I, T) => `\u0E44${I}${T}`,
  },
  // 25 ใ◌ – final not allowed
  {
    id: "ai-mai-muan", index: 25, length: "short", supportsFinal: false,
    open: (I, T) => `\u0E43${I}${T}`,
  },
  // 26 เ◌า – final not allowed
  {
    id: "ao", index: 26, length: "short", supportsFinal: false,
    open: (I, T) => `\u0E40${I}${T}\u0E32`,
  },
  // 27 ◌ำ – final not allowed
  {
    id: "am", index: 27, length: "short", supportsFinal: false,
    open: (I, T) => `${I}${T}\u0E4D`,
  },
];

export function vowelPatternByIndex(i: number): VowelPattern | undefined {
  return VOWEL_PATTERNS.find((p) => p.index === i);
}

export interface ComposedSyllable {
  text: string;
  initial: string;
  vowelIndex: number;
  vowelId: string;
  vowelLength: "short" | "long";
  final: string | null;
  hasFinal: boolean;
  toneMark: ToneMark;
  actualTone: null; // 未实现真实声调推导
  supported: boolean;
  warnings: string[];
}

export interface ComposeInput {
  initial: string;
  vowelIndex: number;
  final: string | null;
  toneIndex: number; // index into TONES
}

export function composeThaiSyllable(input: ComposeInput): ComposedSyllable {
  const pattern = vowelPatternByIndex(input.vowelIndex);
  const vowelMeta = VOWELS[input.vowelIndex];
  const toneMark = toneMarkFromIndex(input.toneIndex);
  const T = TONE_SHAPES.find((t) => t.toneMark === toneMark)?.symbol ?? "";
  const warnings: string[] = [];

  if (!pattern) {
    return {
      text: "",
      initial: input.initial,
      vowelIndex: input.vowelIndex,
      vowelId: "unknown",
      vowelLength: vowelMeta?.length ?? "short",
      final: input.final,
      hasFinal: !!input.final,
      toneMark,
      actualTone: null,
      supported: false,
      warnings: ["未收录的元音模板 / ยังไม่มี Vowel Pattern สำหรับสระนี้"],
    };
  }

  const hasFinal = !!input.final;

  // Case 1: no final consonant → always use open pattern
  if (!hasFinal) {
    return {
      text: pattern.open(input.initial, T),
      initial: input.initial,
      vowelIndex: input.vowelIndex,
      vowelId: pattern.id,
      vowelLength: pattern.length,
      final: null,
      hasFinal: false,
      toneMark,
      actualTone: null,
      supported: true,
      warnings,
    };
  }

  // Case 2: has final but vowel disallows extra final → unsupported
  if (!pattern.supportsFinal || !pattern.closed) {
    warnings.push(
      "当前版本暂不支持在此元音后添加其他韵尾 / เวอร์ชันปัจจุบันยังไม่รองรับการเพิ่มตัวสะกดหลังสระนี้",
    );
    return {
      text: pattern.open(input.initial, T),
      initial: input.initial,
      vowelIndex: input.vowelIndex,
      vowelId: pattern.id,
      vowelLength: pattern.length,
      final: input.final,
      hasFinal: true,
      toneMark,
      actualTone: null,
      supported: false,
      warnings,
    };
  }

  // Case 3: closed pattern
  return {
    text: pattern.closed(input.initial, T, input.final!),
    initial: input.initial,
    vowelIndex: input.vowelIndex,
    vowelId: pattern.id,
    vowelLength: pattern.length,
    final: input.final,
    hasFinal: true,
    toneMark,
    actualTone: null,
    supported: true,
    warnings,
  };
}

// Export CONSONANTS index by char for convenience in tests
export function consonantIndexOf(char: string): number {
  return CONSONANTS.findIndex((c) => c.char === char);
}

// -------------------------------------------------------------------
// Self-test suite: runs the spec cases and returns pass/fail list.
// 供开发者在控制台或测试中调用；不在生产 UI 中自动运行。
// -------------------------------------------------------------------
export interface TestCase {
  label: string;
  initial: string;
  vowelIndex: number;
  final: string | null;
  toneIndex: number;
  expected: string;
}

function v(id: string): number {
  return VOWEL_PATTERNS.find((p) => p.id === id)!.index;
}

export const SPEC_TESTS: TestCase[] = [
  // open
  { label: "ก+◌ะ = กะ", initial: "ก", vowelIndex: v("short-a"), final: null, toneIndex: 0, expected: "กะ" },
  { label: "ก+โ◌ะ = โกะ", initial: "ก", vowelIndex: v("short-o"), final: null, toneIndex: 0, expected: "โกะ" },
  { label: "ก+เ◌ะ = เกะ", initial: "ก", vowelIndex: v("short-e"), final: null, toneIndex: 0, expected: "เกะ" },
  { label: "ก+แ◌ะ = แกะ", initial: "ก", vowelIndex: v("short-ae"), final: null, toneIndex: 0, expected: "แกะ" },
  { label: "จ+เ◌อ = เจอ", initial: "จ", vowelIndex: v("long-oee"), final: null, toneIndex: 0, expected: "เจอ" },
  { label: "ต+◌ัว = ตัว", initial: "ต", vowelIndex: v("long-ua"), final: null, toneIndex: 0, expected: "ตัว" },
  // closed
  { label: "ก+◌ะ+ก = กัก", initial: "ก", vowelIndex: v("short-a"), final: "ก", toneIndex: 0, expected: "กัก" },
  { label: "ล+◌ะ+ย = ลัย", initial: "ล", vowelIndex: v("short-a"), final: "ย", toneIndex: 0, expected: "ลัย" },
  { label: "ก+◌ะ+น = กัน", initial: "ก", vowelIndex: v("short-a"), final: "น", toneIndex: 0, expected: "กัน" },
  { label: "ก+โ◌ะ+ก = กก", initial: "ก", vowelIndex: v("short-o"), final: "ก", toneIndex: 0, expected: "กก" },
  { label: "น+โ◌ะ+ม = นม", initial: "น", vowelIndex: v("short-o"), final: "ม", toneIndex: 0, expected: "นม" },
  { label: "ล+โ◌ะ+ม = ลม", initial: "ล", vowelIndex: v("short-o"), final: "ม", toneIndex: 0, expected: "ลม" },
  { label: "ด+เ◌ะ+ก = เด็ก", initial: "ด", vowelIndex: v("short-e"), final: "ก", toneIndex: 0, expected: "เด็ก" },
  { label: "ป+เ◌ะ+น = เป็น", initial: "ป", vowelIndex: v("short-e"), final: "น", toneIndex: 0, expected: "เป็น" },
  { label: "ข+แ◌ะ+ง = แข็ง", initial: "ข", vowelIndex: v("short-ae"), final: "ง", toneIndex: 0, expected: "แข็ง" },
  { label: "ง+เ◌อะ+น = เงิน", initial: "ง", vowelIndex: v("short-oe"), final: "น", toneIndex: 0, expected: "เงิน" },
  { label: "ด+เ◌อ+น = เดิน", initial: "ด", vowelIndex: v("long-oee"), final: "น", toneIndex: 0, expected: "เดิน" },
  { label: "ก+เ◌อ+น = เกิน", initial: "ก", vowelIndex: v("long-oee"), final: "น", toneIndex: 0, expected: "เกิน" },
  { label: "ค+เ◌อ+ย = เคย", initial: "ค", vowelIndex: v("long-oee"), final: "ย", toneIndex: 0, expected: "เคย" },
  { label: "น+เ◌อ+ย = เนย", initial: "น", vowelIndex: v("long-oee"), final: "ย", toneIndex: 0, expected: "เนย" },
  { label: "ก+◌ัว+น = กวน", initial: "ก", vowelIndex: v("long-ua"), final: "น", toneIndex: 0, expected: "กวน" },
  { label: "ส+◌ัว+ย = สวย", initial: "ส", vowelIndex: v("long-ua"), final: "ย", toneIndex: 0, expected: "สวย" },
  { label: "ก+◌า+ง = กาง", initial: "ก", vowelIndex: v("long-a"), final: "ง", toneIndex: 0, expected: "กาง" },
  { label: "ก+◌ิ+น = กิน", initial: "ก", vowelIndex: v("short-i"), final: "น", toneIndex: 0, expected: "กิน" },
  { label: "จ+◌ุ+ด = จุด", initial: "จ", vowelIndex: v("short-u"), final: "ด", toneIndex: 0, expected: "จุด" },
  { label: "ด+◌ู+ด = ดูด", initial: "ด", vowelIndex: v("long-u"), final: "ด", toneIndex: 0, expected: "ดูด" },
  { label: "ก+แ◌+ง = แกง", initial: "ก", vowelIndex: v("long-ae"), final: "ง", toneIndex: 0, expected: "แกง" },
  { label: "ก+โ◌+ง = โกง", initial: "ก", vowelIndex: v("long-o"), final: "ง", toneIndex: 0, expected: "โกง" },
  { label: "ข+◌อ+ง = ของ", initial: "ข", vowelIndex: v("long-aw"), final: "ง", toneIndex: 0, expected: "ของ" },
  { label: "ส+เ◌ีย+ง = เสียง", initial: "ส", vowelIndex: v("long-ia"), final: "ง", toneIndex: 0, expected: "เสียง" },
  { label: "ร+เ◌ือ+น = เรือน", initial: "ร", vowelIndex: v("long-uea"), final: "น", toneIndex: 0, expected: "เรือน" },
  // tones
  { label: "ก+◌า+่ = ก่า", initial: "ก", vowelIndex: v("long-a"), final: null, toneIndex: 1, expected: "ก\u0E48า" },
  { label: "บ+◌า+น+้ = บ้าน", initial: "บ", vowelIndex: v("long-a"), final: "น", toneIndex: 2, expected: "บ\u0E49าน" },
  { label: "ก+เ◌+ง+่ = เก่ง", initial: "ก", vowelIndex: v("long-e"), final: "ง", toneIndex: 1, expected: "เก\u0E48ง" },
  { label: "ก+โ◌+ง+่ = โก่ง", initial: "ก", vowelIndex: v("long-o"), final: "ง", toneIndex: 1, expected: "โก\u0E48ง" },
  { label: "ก+เ◌ะ+ก+๊ = เก๊ก", initial: "ก", vowelIndex: v("short-e"), final: "ก", toneIndex: 3, expected: "เก\u0E4Aก" },
];

export function runSpecTests(): { pass: number; fail: number; details: Array<{ label: string; ok: boolean; got: string; expected: string }> } {
  const details = SPEC_TESTS.map((tc) => {
    const r = composeThaiSyllable({
      initial: tc.initial,
      vowelIndex: tc.vowelIndex,
      final: tc.final,
      toneIndex: tc.toneIndex,
    });
    return { label: tc.label, ok: r.text === tc.expected, got: r.text, expected: tc.expected };
  });
  const pass = details.filter((d) => d.ok).length;
  return { pass, fail: details.length - pass, details };
}