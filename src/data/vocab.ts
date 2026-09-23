// 泰语常用单词库 / คลังคำศัพท์ภาษาไทย
// 本地静态数据，无需任何外部服务（中国大陆无需 VPN）。

export type Difficulty = "basic" | "inter" | "adv";

export type VocabWord = {
  id: string;
  thai: string;
  /** 发音（拼音近似标注）/ คำอ่านเทียบพินอิน */
  pron: string;
  /** 中文释义 */
  zh: string;
  difficulty: Difficulty;
  /** 分类 / หมวด */
  category: string;
  /** 用户自建单词 */
  custom?: boolean;
};

export const DIFFICULTY_META: Record<
  Difficulty,
  { zh: string; th: string; colorVar: string }
> = {
  basic: { zh: "基础", th: "พื้นฐาน", colorVar: "--vowel" },
  inter: { zh: "进阶", th: "กลาง", colorVar: "--final" },
  adv: { zh: "高级", th: "สูง", colorVar: "--tone" },
};

export const VOCAB_CATEGORIES = [
  { key: "greeting", zh: "问候", th: "การทักทาย" },
  { key: "people", zh: "人物", th: "ผู้คน" },
  { key: "food", zh: "饮食", th: "อาหาร" },
  { key: "number", zh: "数字", th: "ตัวเลข" },
  { key: "travel", zh: "出行", th: "การเดินทาง" },
  { key: "daily", zh: "日常", th: "ชีวิตประจำวัน" },
] as const;

export const VOCAB: VocabWord[] = [
  // 问候
  { id: "w-sawatdi", thai: "สวัสดี", pron: "sà-wàt-dii", zh: "你好", difficulty: "basic", category: "greeting" },
  { id: "w-khopkhun", thai: "ขอบคุณ", pron: "khɔ̀ɔp-khun", zh: "谢谢", difficulty: "basic", category: "greeting" },
  { id: "w-khotot", thai: "ขอโทษ", pron: "khɔ̌ɔ-thôot", zh: "对不起", difficulty: "basic", category: "greeting" },
  { id: "w-sabaidi", thai: "สบายดี", pron: "sà-baai-dii", zh: "我很好", difficulty: "basic", category: "greeting" },
  { id: "w-laokon", thai: "ลาก่อน", pron: "laa-kɔ̀ɔn", zh: "再见", difficulty: "basic", category: "greeting" },
  { id: "w-yindi", thai: "ยินดี", pron: "yin-dii", zh: "很高兴", difficulty: "inter", category: "greeting" },

  // 人物
  { id: "w-phom", thai: "ผม", pron: "phǒm", zh: "我（男性）", difficulty: "basic", category: "people" },
  { id: "w-chan", thai: "ฉัน", pron: "chǎn", zh: "我（女性）", difficulty: "basic", category: "people" },
  { id: "w-khun", thai: "คุณ", pron: "khun", zh: "你", difficulty: "basic", category: "people" },
  { id: "w-phuean", thai: "เพื่อน", pron: "phʉ̂an", zh: "朋友", difficulty: "basic", category: "people" },
  { id: "w-khru", thai: "ครู", pron: "khruu", zh: "老师", difficulty: "basic", category: "people" },
  { id: "w-nakrian", thai: "นักเรียน", pron: "nák-rian", zh: "学生", difficulty: "inter", category: "people" },
  { id: "w-khropkhrua", thai: "ครอบครัว", pron: "khrɔ̂ɔp-khrua", zh: "家庭", difficulty: "adv", category: "people" },

  // 饮食
  { id: "w-kinkhao", thai: "กินข้าว", pron: "kin-khâao", zh: "吃饭", difficulty: "basic", category: "food" },
  { id: "w-nam", thai: "น้ำ", pron: "náam", zh: "水", difficulty: "basic", category: "food" },
  { id: "w-khao", thai: "ข้าว", pron: "khâao", zh: "米饭", difficulty: "basic", category: "food" },
  { id: "w-aroi", thai: "อร่อย", pron: "à-rɔ̀i", zh: "好吃", difficulty: "basic", category: "food" },
  { id: "w-phet", thai: "เผ็ด", pron: "phèt", zh: "辣", difficulty: "basic", category: "food" },
  { id: "w-kafae", thai: "กาแฟ", pron: "kaa-fɛɛ", zh: "咖啡", difficulty: "basic", category: "food" },
  { id: "w-phonlamai", thai: "ผลไม้", pron: "phǒn-lá-máai", zh: "水果", difficulty: "inter", category: "food" },
  { id: "w-ranahan", thai: "ร้านอาหาร", pron: "ráan-aa-hǎan", zh: "餐厅", difficulty: "adv", category: "food" },

  // 数字
  { id: "w-nueng", thai: "หนึ่ง", pron: "nʉ̀ng", zh: "一", difficulty: "basic", category: "number" },
  { id: "w-song", thai: "สอง", pron: "sɔ̌ɔng", zh: "二", difficulty: "basic", category: "number" },
  { id: "w-sam", thai: "สาม", pron: "sǎam", zh: "三", difficulty: "basic", category: "number" },
  { id: "w-si", thai: "สี่", pron: "sìi", zh: "四", difficulty: "basic", category: "number" },
  { id: "w-ha", thai: "ห้า", pron: "hâa", zh: "五", difficulty: "basic", category: "number" },
  { id: "w-sip", thai: "สิบ", pron: "sìp", zh: "十", difficulty: "basic", category: "number" },
  { id: "w-roi", thai: "ร้อย", pron: "rɔ́ɔi", zh: "百", difficulty: "inter", category: "number" },

  // 出行
  { id: "w-pai", thai: "ไป", pron: "pai", zh: "去", difficulty: "basic", category: "travel" },
  { id: "w-ma", thai: "มา", pron: "maa", zh: "来", difficulty: "basic", category: "travel" },
  { id: "w-rotfai", thai: "รถไฟ", pron: "rót-fai", zh: "火车", difficulty: "inter", category: "travel" },
  { id: "w-rotmae", thai: "รถเมล์", pron: "rót-mee", zh: "公交车", difficulty: "inter", category: "travel" },
  { id: "w-sanambin", thai: "สนามบิน", pron: "sà-nǎam-bin", zh: "机场", difficulty: "adv", category: "travel" },
  { id: "w-rongraem", thai: "โรงแรม", pron: "roong-rɛɛm", zh: "酒店", difficulty: "inter", category: "travel" },
  { id: "w-thanon", thai: "ถนน", pron: "thà-nǒn", zh: "马路", difficulty: "inter", category: "travel" },

  // 日常
  { id: "w-ban", thai: "บ้าน", pron: "bâan", zh: "家、房子", difficulty: "basic", category: "daily" },
  { id: "w-ngoen", thai: "เงิน", pron: "ngən", zh: "钱", difficulty: "basic", category: "daily" },
  { id: "w-wanni", thai: "วันนี้", pron: "wan-níi", zh: "今天", difficulty: "basic", category: "daily" },
  { id: "w-phrungni", thai: "พรุ่งนี้", pron: "phrûng-níi", zh: "明天", difficulty: "inter", category: "daily" },
  { id: "w-rian", thai: "เรียน", pron: "rian", zh: "学习", difficulty: "basic", category: "daily" },
  { id: "w-thamngan", thai: "ทำงาน", pron: "tham-ngaan", zh: "工作", difficulty: "inter", category: "daily" },
  { id: "w-chop", thai: "ชอบ", pron: "chɔ̂ɔp", zh: "喜欢", difficulty: "basic", category: "daily" },
  { id: "w-khaochai", thai: "เข้าใจ", pron: "khâo-jai", zh: "明白、懂", difficulty: "inter", category: "daily" },
  { id: "w-suai", thai: "สวย", pron: "sǔai", zh: "漂亮", difficulty: "basic", category: "daily" },
  { id: "w-mak", thai: "มาก", pron: "mâak", zh: "很、非常", difficulty: "basic", category: "daily" },
];

export function categoryLabel(key: string): { zh: string; th: string } {
  const found = VOCAB_CATEGORIES.find((c) => c.key === key);
  return found ? { zh: found.zh, th: found.th } : { zh: "我的单词", th: "คำของฉัน" };
}
