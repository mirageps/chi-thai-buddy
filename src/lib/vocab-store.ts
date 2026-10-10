// 背单词进度与自建单词的本地存储（localStorage，浏览器原生，无外部服务）
import { useCallback, useEffect, useState } from "react";
import { VOCAB, registerCustomCategories, type Difficulty, type VocabCategory, type VocabWord } from "@/data/vocab";

const KEY_PROGRESS = "vocab.progress.v1";
const KEY_CUSTOM = "vocab.custom.v1";
const KEY_CATS = "vocab.categories.v1";

export type WordProgress = {
  /** 已掌握 */
  mastered: boolean;
  /** 复习次数 */
  reviews: number;
  /** 最后复习时间 (ms) */
  lastReviewed?: number;
};

export type ProgressMap = Record<string, WordProgress>;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — ignore */
  }
}

export function useVocabStore() {
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [custom, setCustom] = useState<VocabWord[]>([]);
  const [categories, setCategories] = useState<VocabCategory[]>([]);

  useEffect(() => {
    setProgress(readJSON<ProgressMap>(KEY_PROGRESS, {}));
    setCustom(readJSON<VocabWord[]>(KEY_CUSTOM, []));
    const cats = readJSON<VocabCategory[]>(KEY_CATS, []);
    registerCustomCategories(cats);
    setCategories(cats);
    setHydrated(true);
  }, []);

  const words: VocabWord[] = hydrated ? [...custom, ...VOCAB] : VOCAB;

  const mark = useCallback((id: string, mastered: boolean) => {
    setProgress((prev) => {
      const cur = prev[id];
      const next: ProgressMap = {
        ...prev,
        [id]: {
          mastered,
          reviews: (cur?.reviews ?? 0) + 1,
          lastReviewed: Date.now(),
        },
      };
      writeJSON(KEY_PROGRESS, next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    writeJSON(KEY_PROGRESS, {});
  }, []);

  const addWord = useCallback(
    (input: {
      thai: string;
      pron: string;
      zh: string;
      difficulty: Difficulty;
      category?: string;
      newCategory?: { zh: string; th: string };
    }) => {
      let category = input.category || "mine";
      if (input.newCategory && (input.newCategory.zh.trim() || input.newCategory.th.trim())) {
        const zh = input.newCategory.zh.trim() || input.newCategory.th.trim();
        const th = input.newCategory.th.trim() || zh;
        const cat: VocabCategory = { key: `cat-${Date.now()}`, zh, th };
        category = cat.key;
        setCategories((prev) => {
          const next = [...prev, cat];
          registerCustomCategories(next);
          writeJSON(KEY_CATS, next);
          return next;
        });
      }
      const word: VocabWord = {
        id: `my-${Date.now()}`,
        thai: input.thai.trim(),
        pron: input.pron.trim(),
        zh: input.zh.trim(),
        difficulty: input.difficulty,
        category,
        custom: true,
      };
      setCustom((prev) => {
        const next = [word, ...prev];
        writeJSON(KEY_CUSTOM, next);
        return next;
      });
      return word;
    },
    [],
  );

  const removeWord = useCallback((id: string) => {
    setCustom((prev) => {
      const next = prev.filter((w) => w.id !== id);
      writeJSON(KEY_CUSTOM, next);
      return next;
    });
  }, []);

  const masteredCount = Object.values(progress).filter((p) => p.mastered).length;

  return {
    hydrated,
    words,
    custom,
    categories,
    progress,
    masteredCount,
    mark,
    resetProgress,
    addWord,
    removeWord,
  };
}
