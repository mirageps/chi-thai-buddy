import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { VocabLearn } from "@/components/vocab/VocabLearn";
import { VocabFlashcard } from "@/components/vocab/VocabFlashcard";
import { VocabLibrary } from "@/components/vocab/VocabLibrary";
import { VocabReview } from "@/components/vocab/VocabReview";
import { useVocabStore } from "@/lib/vocab-store";

export const Route = createFileRoute("/vocab")({
  head: () => ({
    meta: [
      { title: "背单词 — 学泰语" },
      { name: "description", content: "泰语单词学习、单词卡、词库与复习。" },
      { property: "og:title", content: "背单词 — 学泰语" },
      { property: "og:description", content: "泰语单词学习、单词卡、词库与复习。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VocabPage,
});

const TABS = [
  { key: "learn", zh: "学习", th: "เรียน" },
  { key: "card", zh: "单词卡", th: "แฟลชการ์ด" },
  { key: "lib", zh: "词库", th: "คลังคำ" },
  { key: "review", zh: "复习", th: "ทบทวน" },
] as const;
type Tab = (typeof TABS)[number]["key"];

function VocabPage() {
  const [tab, setTab] = useState<Tab>("learn");
  const s = useVocabStore();

  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-2xl font-bold sm:text-3xl">
            背单词 <span className="font-thai text-lg opacity-90">ท่องศัพท์</span>
          </h1>
          <p className="text-sm opacity-90">
            已掌握 {s.masteredCount} / {s.words.length} 个单词
          </p>
        </>
      }
    >
      <div className="mb-5 grid grid-cols-4 gap-1 rounded-2xl border border-border bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{t.zh}</span>
            <span className="font-thai text-[10px] opacity-80">{t.th}</span>
          </button>
        ))}
      </div>

      {tab === "learn" && <VocabLearn words={s.words} progress={s.progress} onMark={s.mark} />}
      {tab === "card" && <VocabFlashcard words={s.words} progress={s.progress} onMark={s.mark} />}
      {tab === "lib" && (
        <VocabLibrary words={s.words} progress={s.progress} onAdd={s.addWord} onRemove={s.removeWord} />
      )}
      {tab === "review" && <VocabReview words={s.words} progress={s.progress} onMark={s.mark} />}
    </AppLayout>
  );
}
