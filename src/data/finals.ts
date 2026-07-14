// Thai final-consonant categories (มาตราตัวสะกด) for Chinese speakers.
// 韵尾辅音数据。共 9 类：แม่ ก กา（无韵尾）+ 8 种实际韵尾。

export type FinalKey =
  | "none"
  | "k"
  | "t"
  | "p"
  | "ng"
  | "n"
  | "m"
  | "y"
  | "w";

export interface FinalExample {
  thai: string;
  zh: string;
}

export interface FinalGroup {
  key: FinalKey;
  thName: string;      // แม่ ก กา / แม่กก ...
  zhName: string;      // 无韵尾 / -k 韵尾 ...
  ipa: string | null;  // /k̚/, /t̚/, ...
  short: string;       // -k / -t / -p / -ng / -n / -m / -y / -w / —
  consonants: string[];// พยัญชนะที่ออกเสียงเป็นตัวสะกด
  primary: string | null; // ตัวสะกดหลักที่ใช้ในผู้เริ่มเรียน
  desc: string;        // 中文简介
  examples: FinalExample[];
}

export const FINALS: FinalGroup[] = [
  {
    key: "none",
    thName: "แม่ ก กา",
    zhName: "无韵尾",
    ipa: null,
    short: "—",
    consonants: [],
    primary: null,
    desc: "音节没有韵尾辅音，元音自然结束。",
    examples: [
      { thai: "กา", zh: "乌鸦" },
      { thai: "ดู", zh: "看" },
      { thai: "โต", zh: "大" },
    ],
  },
  {
    key: "k",
    thName: "แม่กก",
    zhName: "-k 韵尾",
    ipa: "/k̚/",
    short: "-k",
    consonants: ["ก", "ข", "ค", "ฆ"],
    primary: "ก",
    desc: "音节末尾发不送气、不爆破的 k 音（类似广东话“食”尾）。",
    examples: [
      { thai: "มาก", zh: "多/很" },
      { thai: "เลข", zh: "数字" },
      { thai: "โรค", zh: "疾病" },
    ],
  },
  {
    key: "t",
    thName: "แม่กด",
    zhName: "-t 韵尾",
    ipa: "/t̚/",
    short: "-t",
    consonants: [
      "จ","ช","ซ","ฎ","ฏ","ฐ","ฑ","ฒ","ด","ต","ถ","ท","ธ","ศ","ษ","ส",
    ],
    primary: "ด",
    desc: "音节末尾发不爆破的 t 音，舌尖抵上齿龈后收住。",
    examples: [
      { thai: "ปิด", zh: "关" },
      { thai: "รถ", zh: "车" },
      { thai: "โกรธ", zh: "生气" },
    ],
  },
  {
    key: "p",
    thName: "แม่กบ",
    zhName: "-p 韵尾",
    ipa: "/p̚/",
    short: "-p",
    consonants: ["บ", "ป", "พ", "ฟ", "ภ"],
    primary: "บ",
    desc: "音节末尾发不爆破的 p 音，双唇闭合后收住。",
    examples: [
      { thai: "ชอบ", zh: "喜欢" },
      { thai: "รูป", zh: "图/形状" },
      { thai: "ภาพ", zh: "图像" },
    ],
  },
  {
    key: "ng",
    thName: "แม่กง",
    zhName: "-ng 韵尾",
    ipa: "/ŋ/",
    short: "-ng",
    consonants: ["ง"],
    primary: "ง",
    desc: "鼻音韵尾 ŋ，类似普通话“东”的 ng。",
    examples: [
      { thai: "มอง", zh: "看/望" },
      { thai: "กาง", zh: "撑开" },
      { thai: "แดง", zh: "红色" },
    ],
  },
  {
    key: "n",
    thName: "แม่กน",
    zhName: "-n 韵尾",
    ipa: "/n/",
    short: "-n",
    consonants: ["ญ", "ณ", "น", "ร", "ล", "ฬ"],
    primary: "น",
    desc: "鼻音韵尾 n，类似普通话“安”的 n。",
    examples: [
      { thai: "กิน", zh: "吃" },
      { thai: "คุณ", zh: "您" },
      { thai: "อาหาร", zh: "食物" },
    ],
  },
  {
    key: "m",
    thName: "แม่กม",
    zhName: "-m 韵尾",
    ipa: "/m/",
    short: "-m",
    consonants: ["ม"],
    primary: "ม",
    desc: "鼻音韵尾 m，双唇闭合发音（普通话没有，粤语有）。",
    examples: [
      { thai: "ลม", zh: "风" },
      { thai: "ถาม", zh: "问" },
      { thai: "เต็ม", zh: "满" },
    ],
  },
  {
    key: "y",
    thName: "แม่เกย",
    zhName: "-y 韵尾",
    ipa: "/j/",
    short: "-y",
    consonants: ["ย"],
    primary: "ย",
    desc: "半元音韵尾 j，类似普通话“爱”结尾的 i 音。",
    examples: [
      { thai: "สวย", zh: "美" },
      { thai: "คุย", zh: "聊天" },
      { thai: "ขาย", zh: "卖" },
    ],
  },
  {
    key: "w",
    thName: "แม่เกอว",
    zhName: "-w 韵尾",
    ipa: "/w/",
    short: "-w",
    consonants: ["ว"],
    primary: "ว",
    desc: "半元音韵尾 w，类似普通话“奥”结尾的 u 音。",
    examples: [
      { thai: "เร็ว", zh: "快" },
      { thai: "ขาว", zh: "白色" },
      { thai: "หิว", zh: "饿" },
    ],
  },
];

// Builder 用的主要韵尾（初学者版）— แต่ละ key 对应主要辅音
export const PRIMARY_FINAL_CONSONANTS: { key: FinalKey; char: string; label: string }[] = [
  { key: "k", char: "ก", label: "-k" },
  { key: "t", char: "ด", label: "-t" },
  { key: "p", char: "บ", label: "-p" },
  { key: "ng", char: "ง", label: "-ng" },
  { key: "n", char: "น", label: "-n" },
  { key: "m", char: "ม", label: "-m" },
  { key: "y", char: "ย", label: "-y" },
  { key: "w", char: "ว", label: "-w" },
];

// Reverse lookup: consonant char used as final -> which group
export function finalGroupOf(char: string): FinalGroup | null {
  if (!char) return FINALS[0];
  return FINALS.find((g) => g.consonants.includes(char)) ?? null;
}

// 小型词库：只登记已确认释义的音节。
// 未在此表中的组合视为“可发音但不是常用词”，不猜测意思。
export const VOCAB: Record<string, string> = {
  "กา": "乌鸦",
  "ดู": "看",
  "โต": "大",
  "มา": "来",
  "ดี": "好",
  "นา": "田",
  "มาก": "多/很",
  "เลข": "数字",
  "โรค": "疾病",
  "ปิด": "关",
  "รถ": "车",
  "โกรธ": "生气",
  "ชอบ": "喜欢",
  "รูป": "图/形状",
  "ภาพ": "图像",
  "มอง": "看/望",
  "กาง": "撑开",
  "แดง": "红色",
  "กิน": "吃",
  "คุณ": "您",
  "อาหาร": "食物",
  "ลม": "风",
  "ถาม": "问",
  "เต็ม": "满",
  "สวย": "美",
  "คุย": "聊天",
  "ขาย": "卖",
  "เร็ว": "快",
  "ขาว": "白色",
  "หิว": "饿",
  "บ้าน": "家",
  "บาน": "开(花)",
  "ไป": "去",
  "กัน": "互相/一起",
  "กาน": "枝干",
  "บ้า": "疯",
  "ป่า": "森林",
  "ปา": "扔",
};

export function lookupVocab(syllable: string): string | null {
  return VOCAB[syllable] ?? null;
}

// Live / dead syllable classification (คำเป็น / คำตาย)
// 简化规则：韵尾为 k/t/p → 死音；无韵尾且元音短 → 死音；其余为活音。
export function liveOrDead(
  finalKey: FinalKey,
  vowelLength: "short" | "long",
): "live" | "dead" {
  if (finalKey === "k" || finalKey === "t" || finalKey === "p") return "dead";
  if (finalKey === "none" && vowelLength === "short") return "dead";
  return "live";
}