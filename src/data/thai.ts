// Thai learning data for Chinese speakers
// zh = 中文说明, pinyin = 拼音提示 for sound

export type ConsonantClass = "mid" | "high" | "low";

export interface Consonant {
  char: string;
  name: string;         // ก ไก่
  romanized: string;    // ko kai
  meaning: string;      // Thai meaning of the mnemonic word
  zhMeaning: string;    // 中文含义
  zhSound: string;      // 中文拼音近似发音
  cls: ConsonantClass;
  initialSound: string; // used for syllable building
}

export const CONSONANTS: Consonant[] = [
  { char: "ก", name: "ก ไก่", romanized: "ko kai", meaning: "ไก่", zhMeaning: "鸡", zhSound: "g（如'哥'）", cls: "mid", initialSound: "g" },
  { char: "ข", name: "ข ไข่", romanized: "kho khai", meaning: "ไข่", zhMeaning: "蛋", zhSound: "k（送气'科'）", cls: "high", initialSound: "kh" },
  { char: "ฃ", name: "ฃ ขวด", romanized: "kho khuat", meaning: "ขวด (เลิกใช้)", zhMeaning: "瓶子（已废弃）", zhSound: "k（送气）", cls: "high", initialSound: "kh" },
  { char: "ค", name: "ค ควาย", romanized: "kho khwai", meaning: "ควาย", zhMeaning: "水牛", zhSound: "k（送气）", cls: "low", initialSound: "kh" },
  { char: "ฅ", name: "ฅ คน", romanized: "kho khon", meaning: "คน (เลิกใช้)", zhMeaning: "人（已废弃）", zhSound: "k（送气）", cls: "low", initialSound: "kh" },
  { char: "ฆ", name: "ฆ ระฆัง", romanized: "kho rakhang", meaning: "ระฆัง", zhMeaning: "钟", zhSound: "k（送气）", cls: "low", initialSound: "kh" },
  { char: "ง", name: "ง งู", romanized: "ngo ngu", meaning: "งู", zhMeaning: "蛇", zhSound: "ng（鼻音）", cls: "low", initialSound: "ng" },
  { char: "จ", name: "จ จาน", romanized: "cho chan", meaning: "จาน", zhMeaning: "盘子", zhSound: "j（如'知'不送气）", cls: "mid", initialSound: "j" },
  { char: "ฉ", name: "ฉ ฉิ่ง", romanized: "cho ching", meaning: "ฉิ่ง", zhMeaning: "小铙钹", zhSound: "ch（送气）", cls: "high", initialSound: "ch" },
  { char: "ช", name: "ช ช้าง", romanized: "cho chang", meaning: "ช้าง", zhMeaning: "大象", zhSound: "ch（送气）", cls: "low", initialSound: "ch" },
  { char: "ซ", name: "ซ โซ่", romanized: "so so", meaning: "โซ่", zhMeaning: "链子", zhSound: "s（如'思'）", cls: "low", initialSound: "s" },
  { char: "ฌ", name: "ฌ เฌอ", romanized: "cho choe", meaning: "เฌอ (ต้นไม้)", zhMeaning: "树", zhSound: "ch（送气）", cls: "low", initialSound: "ch" },
  { char: "ญ", name: "ญ หญิง", romanized: "yo ying", meaning: "หญิง", zhMeaning: "女人", zhSound: "y（如'耶'）", cls: "low", initialSound: "y" },
  { char: "ฎ", name: "ฎ ชฎา", romanized: "do chada", meaning: "ชฎา", zhMeaning: "王冠", zhSound: "d（如'的'）", cls: "mid", initialSound: "d" },
  { char: "ฏ", name: "ฏ ปฏัก", romanized: "to patak", meaning: "ปฏัก", zhMeaning: "尖刺", zhSound: "d/t（不送气）", cls: "mid", initialSound: "t" },
  { char: "ฐ", name: "ฐ ฐาน", romanized: "tho than", meaning: "ฐาน", zhMeaning: "基座", zhSound: "t（送气）", cls: "high", initialSound: "th" },
  { char: "ฑ", name: "ฑ มณโฑ", romanized: "tho montho", meaning: "มณโฑ", zhMeaning: "曼陀（人名）", zhSound: "t（送气）", cls: "low", initialSound: "th" },
  { char: "ฒ", name: "ฒ ผู้เฒ่า", romanized: "tho phuthao", meaning: "ผู้เฒ่า", zhMeaning: "老人", zhSound: "t（送气）", cls: "low", initialSound: "th" },
  { char: "ณ", name: "ณ เณร", romanized: "no nen", meaning: "เณร", zhMeaning: "小沙弥", zhSound: "n（如'呢'）", cls: "low", initialSound: "n" },
  { char: "ด", name: "ด เด็ก", romanized: "do dek", meaning: "เด็ก", zhMeaning: "小孩", zhSound: "d（如'的'）", cls: "mid", initialSound: "d" },
  { char: "ต", name: "ต เต่า", romanized: "to tao", meaning: "เต่า", zhMeaning: "乌龟", zhSound: "d/t（不送气）", cls: "mid", initialSound: "t" },
  { char: "ถ", name: "ถ ถุง", romanized: "tho thung", meaning: "ถุง", zhMeaning: "袋子", zhSound: "t（送气）", cls: "high", initialSound: "th" },
  { char: "ท", name: "ท ทหาร", romanized: "tho thahan", meaning: "ทหาร", zhMeaning: "士兵", zhSound: "t（送气）", cls: "low", initialSound: "th" },
  { char: "ธ", name: "ธ ธง", romanized: "tho thong", meaning: "ธง", zhMeaning: "旗子", zhSound: "t（送气）", cls: "low", initialSound: "th" },
  { char: "น", name: "น หนู", romanized: "no nu", meaning: "หนู", zhMeaning: "老鼠", zhSound: "n（如'呢'）", cls: "low", initialSound: "n" },
  { char: "บ", name: "บ ใบไม้", romanized: "bo baimai", meaning: "ใบไม้", zhMeaning: "树叶", zhSound: "b（如'不'）", cls: "mid", initialSound: "b" },
  { char: "ป", name: "ป ปลา", romanized: "po pla", meaning: "ปลา", zhMeaning: "鱼", zhSound: "b/p（不送气）", cls: "mid", initialSound: "p" },
  { char: "ผ", name: "ผ ผึ้ง", romanized: "pho phueng", meaning: "ผึ้ง", zhMeaning: "蜜蜂", zhSound: "p（送气'颇'）", cls: "high", initialSound: "ph" },
  { char: "ฝ", name: "ฝ ฝา", romanized: "fo fa", meaning: "ฝา", zhMeaning: "盖子", zhSound: "f（如'发'）", cls: "high", initialSound: "f" },
  { char: "พ", name: "พ พาน", romanized: "pho phan", meaning: "พาน", zhMeaning: "托盘", zhSound: "p（送气）", cls: "low", initialSound: "ph" },
  { char: "ฟ", name: "ฟ ฟัน", romanized: "fo fan", meaning: "ฟัน", zhMeaning: "牙齿", zhSound: "f（如'发'）", cls: "low", initialSound: "f" },
  { char: "ภ", name: "ภ สำเภา", romanized: "pho samphao", meaning: "สำเภา", zhMeaning: "帆船", zhSound: "p（送气）", cls: "low", initialSound: "ph" },
  { char: "ม", name: "ม ม้า", romanized: "mo ma", meaning: "ม้า", zhMeaning: "马", zhSound: "m（如'妈'）", cls: "low", initialSound: "m" },
  { char: "ย", name: "ย ยักษ์", romanized: "yo yak", meaning: "ยักษ์", zhMeaning: "夜叉", zhSound: "y（如'耶'）", cls: "low", initialSound: "y" },
  { char: "ร", name: "ร เรือ", romanized: "ro ruea", meaning: "เรือ", zhMeaning: "船", zhSound: "r（弹舌）", cls: "low", initialSound: "r" },
  { char: "ล", name: "ล ลิง", romanized: "lo ling", meaning: "ลิง", zhMeaning: "猴子", zhSound: "l（如'了'）", cls: "low", initialSound: "l" },
  { char: "ว", name: "ว แหวน", romanized: "wo waen", meaning: "แหวน", zhMeaning: "戒指", zhSound: "w（如'我'的w）", cls: "low", initialSound: "w" },
  { char: "ศ", name: "ศ ศาลา", romanized: "so sala", meaning: "ศาลา", zhMeaning: "亭子", zhSound: "s（如'思'）", cls: "high", initialSound: "s" },
  { char: "ษ", name: "ษ ฤๅษี", romanized: "so ruesi", meaning: "ฤๅษี", zhMeaning: "隐士", zhSound: "s（如'思'）", cls: "high", initialSound: "s" },
  { char: "ส", name: "ส เสือ", romanized: "so suea", meaning: "เสือ", zhMeaning: "老虎", zhSound: "s（如'思'）", cls: "high", initialSound: "s" },
  { char: "ห", name: "ห หีบ", romanized: "ho hip", meaning: "หีบ", zhMeaning: "箱子", zhSound: "h（如'哈'）", cls: "high", initialSound: "h" },
  { char: "ฬ", name: "ฬ จุฬา", romanized: "lo chula", meaning: "จุฬา (ว่าว)", zhMeaning: "朱拉风筝", zhSound: "l（如'了'）", cls: "low", initialSound: "l" },
  { char: "อ", name: "อ อ่าง", romanized: "o ang", meaning: "อ่าง", zhMeaning: "盆", zhSound: "喉塞/元音载体", cls: "mid", initialSound: "" },
  { char: "ฮ", name: "ฮ นกฮูก", romanized: "ho nokhuk", meaning: "นกฮูก", zhMeaning: "猫头鹰", zhSound: "h（如'哈'）", cls: "low", initialSound: "h" },
];

export interface Vowel {
  form: string;         // display form using ○ placeholder
  romanized: string;
  zhName: string;
  zhSound: string;
  ipa: string;          // 音标 (IPA-like) 用于发音说明
  forms: string;        // 书写形式 (带 อ) เช่น "อะ / อั"
  length: "short" | "long";
  // How to render with a consonant (● represents consonant)
  render: (c: string) => string;
}

export const VOWELS: Vowel[] = [
  { form: "◌ะ", romanized: "a", zhName: "短 a", zhSound: "阿（短促）", ipa: "a", forms: "อะ / อั", length: "short", render: (c) => `${c}ะ` },
  { form: "◌า", romanized: "aa", zhName: "长 a", zhSound: "啊（拉长）", ipa: "aa", forms: "อา", length: "long", render: (c) => `${c}า` },
  { form: "◌ิ", romanized: "i", zhName: "短 i", zhSound: "衣（短）", ipa: "i", forms: "อิ", length: "short", render: (c) => `${c}ิ` },
  { form: "◌ี", romanized: "ii", zhName: "长 i", zhSound: "衣（长）", ipa: "ii", forms: "อี", length: "long", render: (c) => `${c}ี` },
  { form: "◌ึ", romanized: "ue", zhName: "短 ɯ", zhSound: "近似'呃'（短）", ipa: "ʉ", forms: "อึ", length: "short", render: (c) => `${c}ึ` },
  { form: "◌ื", romanized: "uee", zhName: "长 ɯ", zhSound: "近似'呃'（长）", ipa: "ʉʉ", forms: "อื / อือ", length: "long", render: (c) => `${c}ือ` },
  { form: "◌ุ", romanized: "u", zhName: "短 u", zhSound: "乌（短）", ipa: "u", forms: "อุ", length: "short", render: (c) => `${c}ุ` },
  { form: "◌ู", romanized: "uu", zhName: "长 u", zhSound: "乌（长）", ipa: "uu", forms: "อู", length: "long", render: (c) => `${c}ู` },
  { form: "เ◌ะ", romanized: "e", zhName: "短 e", zhSound: "诶（短）", ipa: "e", forms: "เอะ / เอ็", length: "short", render: (c) => `เ${c}ะ` },
  { form: "เ◌", romanized: "ee", zhName: "长 e", zhSound: "诶（长）", ipa: "ee", forms: "เอ", length: "long", render: (c) => `เ${c}` },
  { form: "แ◌ะ", romanized: "ae", zhName: "短 ɛ", zhSound: "扁口'诶'（短）", ipa: "ɛ", forms: "แอะ / แอ็", length: "short", render: (c) => `แ${c}ะ` },
  { form: "แ◌", romanized: "aae", zhName: "长 ɛ", zhSound: "扁口'诶'（长）", ipa: "ɛɛ", forms: "แอ", length: "long", render: (c) => `แ${c}` },
  { form: "โ◌ะ", romanized: "o", zhName: "短 o", zhSound: "哦（短）", ipa: "o", forms: "โอะ", length: "short", render: (c) => `โ${c}ะ` },
  { form: "โ◌", romanized: "oo", zhName: "长 o", zhSound: "哦（长）", ipa: "oo", forms: "โอ", length: "long", render: (c) => `โ${c}` },
  { form: "เ◌าะ", romanized: "aw", zhName: "短 ɔ", zhSound: "喔（短）", ipa: "ɔ", forms: "เอาะ / อ็อ", length: "short", render: (c) => `เ${c}าะ` },
  { form: "◌อ", romanized: "aaw", zhName: "长 ɔ", zhSound: "喔（长）", ipa: "ɔɔ", forms: "ออ", length: "long", render: (c) => `${c}อ` },
  { form: "เ◌อะ", romanized: "oe", zhName: "短 ə", zhSound: "呃/儿（短）", ipa: "ə", forms: "เออะ / เอิ", length: "short", render: (c) => `เ${c}อะ` },
  { form: "เ◌อ", romanized: "oee", zhName: "长 ə", zhSound: "呃/儿（长）", ipa: "əə", forms: "เออ / เอิ", length: "long", render: (c) => `เ${c}อ` },
  { form: "เ◌ียะ", romanized: "ia", zhName: "短 ia", zhSound: "呀（短）", ipa: "ia", forms: "เอียะ", length: "short", render: (c) => `เ${c}ียะ` },
  { form: "เ◌ีย", romanized: "iaa", zhName: "长 ia", zhSound: "呀（长）", ipa: "iaa", forms: "เอีย", length: "long", render: (c) => `เ${c}ีย` },
  { form: "เ◌ือะ", romanized: "uea", zhName: "短 ɯa", zhSound: "呃啊（短）", ipa: "ʉa", forms: "เอือะ", length: "short", render: (c) => `เ${c}ือะ` },
  { form: "เ◌ือ", romanized: "ueaa", zhName: "长 ɯa", zhSound: "呃啊（长）", ipa: "ʉaa", forms: "เอือ", length: "long", render: (c) => `เ${c}ือ` },
  { form: "◌ัวะ", romanized: "ua", zhName: "短 ua", zhSound: "哇（短）", ipa: "ua", forms: "อัวะ", length: "short", render: (c) => `${c}ัวะ` },
  { form: "◌ัว", romanized: "uaa", zhName: "长 ua", zhSound: "哇（长）", ipa: "uaa", forms: "อัว", length: "long", render: (c) => `${c}ัว` },
  { form: "ไ◌", romanized: "ai", zhName: "复合 ai", zhSound: "爱", ipa: "ai", forms: "ไอ", length: "short", render: (c) => `ไ${c}` },
  { form: "ใ◌", romanized: "ai", zhName: "复合 ai (ใ)", zhSound: "爱（另一写法）", ipa: "ai", forms: "ใอ", length: "short", render: (c) => `ใ${c}` },
  { form: "เ◌า", romanized: "ao", zhName: "复合 ao", zhSound: "奥", ipa: "ao", forms: "เอา", length: "short", render: (c) => `เ${c}า` },
  { form: "◌ำ", romanized: "am", zhName: "复合 am", zhSound: "安/唵", ipa: "am", forms: "อำ", length: "short", render: (c) => `${c}ำ` },
];

export interface Tone {
  mark: string;         // ◌่ ◌้ ...
  symbol: string;       // ่
  name: string;         // ไม้เอก
  zhName: string;       // 声调名
  zhDesc: string;
  toneName: string;     // low/falling/high/rising
  arrow: string;        // visual indicator
}

export const TONES: Tone[] = [
  { mark: "—", symbol: "", name: "เสียงสามัญ", zhName: "平声", zhDesc: "无标记，声调平稳（中调）", toneName: "mid", arrow: "→" },
  { mark: "◌่", symbol: "่", name: "ไม้เอก", zhName: "低声", zhDesc: "声调下降至低平", toneName: "low", arrow: "↘" },
  { mark: "◌้", symbol: "้", name: "ไม้โท", zhName: "降声", zhDesc: "高降调，从高降到低", toneName: "falling", arrow: "⤵" },
  { mark: "◌๊", symbol: "๊", name: "ไม้ตรี", zhName: "高声", zhDesc: "高平调（较少用）", toneName: "high", arrow: "↑" },
  { mark: "◌๋", symbol: "๋", name: "ไม้จัตวา", zhName: "升声", zhDesc: "先降后升，像问句", toneName: "rising", arrow: "↗" },
];

// utility: pick random items
export function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function classLabel(cls: ConsonantClass): { zh: string; th: string } {
  if (cls === "mid") return { zh: "中辅音", th: "อักษรกลาง" };
  if (cls === "high") return { zh: "高辅音", th: "อักษรสูง" };
  return { zh: "低辅音", th: "อักษรต่ำ" };
}