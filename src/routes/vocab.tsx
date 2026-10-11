import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, Plus } from "lucide-react";
import { AddWordDialog } from "@/components/vocab/AddWordDialog";
import { AppLayout } from "@/components/layout/AppLayout";
import { LearningCategoryCard } from "@/components/layout/LearningCategoryCard";
import { VocabLearn } from "@/components/vocab/VocabLearn";
import { VocabFlashcard } from "@/components/vocab/VocabFlashcard";
import { VocabLibrary } from "@/components/vocab/VocabLibrary";
import { VocabReview } from "@/components/vocab/VocabReview";
import { VOCAB_CATEGORIES, type VocabCategory } from "@/data/vocab";
import { useVocabStore } from "@/lib/vocab-store";

export const Route = createFileRoute("/vocab")({
  head: () => ({
    meta: [
      { title: "背单词 — 学泰语" },
      { name: "description", content: "按分类学习泰语单词：学习、单词卡、词库与复习。" },
      { property: "og:title", content: "背单词 — 学泰语" },
      { property: "og:description", content: "按分类学习泰语单词：学习、单词卡、词库与复习。" },
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

const COLORS = ["--consonant", "--vowel", "--final", "--tone"];

function VocabPage() {
  const [tab, setTab] = useState<Tab>("learn");
  const [cat, setCat] = useState<string | null>(null);
  const [level, setLevel] = useState<"root" | "choose" | "cats">("root");
  const [addOpen, setAddOpen] = useState(false);
  const s = useVocabStore();

  const cats: (VocabCategory & { desc: string })[] = useMemo(
    () => [
      ...VOCAB_CATEGORIES.map((c) => ({ ...c, desc: "常用词汇 · คำศัพท์ใช้บ่อย" })),
      ...s.categories.map((c) => ({ ...c, desc: "自建分类 · หมวดที่สร้างเอง" })),
      { key: "mine", zh: "我的单词", th: "คำของฉัน", desc: "未分类的自建单词 · คำที่เพิ่มเอง" },
    ],
    [s.categories],
  );
  const allCat = { key: "all", zh: "全部单词", th: "คำศัพท์ทั้งหมด", desc: "" };

  const filtered = useMemo(
    () => (!cat || cat === "all" ? s.words : s.words.filter((w) => w.category === cat)),
    [s.words, cat],
  );
  const current = cat === "all" ? allCat : cats.find((c) => c.key === cat);
  const masteredAll = s.masteredCount;

  const open = (key: string) => {
    setCat(key);
    setTab("learn");
    window.scrollTo({ top: 0 });
  };

  const BackBar = ({ onBack, title, sub }: { onBack: () => void; title: string; sub: string }) => (
    <div className="mb-3 flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="返回 / ย้อนกลับ"
        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="font-thai text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );

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
      {!current && level === "root" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            选择学习内容 · <span className="font-thai">เลือกหัวข้อที่ต้องการเรียน</span>
          </p>
          <button type="button" className="block w-full text-left" onClick={() => setLevel("choose")}>
            <LearningCategoryCard
              zh="单词"
              th="คำศัพท์"
              desc={`全部词汇与分类学习 · 已掌握 ${masteredAll}/${s.words.length}`}
              colorVar="--vowel"
              stat={String(s.words.length)}
              emphasis
            />
          </button>
        </div>
      )}

      {!current && level === "choose" && (
        <div className="space-y-3">
          <BackBar onBack={() => setLevel("root")} title="单词" sub={`คำศัพท์ · ${s.words.length} คำ`} />
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" className="text-left" onClick={() => open("all")}>
              <LearningCategoryCard
                zh="全部单词"
                th="เรียนคำศัพท์ทั้งหมด"
                desc={`所有分类混合学习 · 已掌握 ${masteredAll}/${s.words.length}`}
                colorVar="--consonant"
                stat={String(s.words.length)}
              />
            </button>
            <button type="button" className="text-left" onClick={() => setLevel("cats")}>
              <LearningCategoryCard
                zh="按分类学习"
                th="เลือกเรียนตามหมวดหมู่"
                desc="选择一个分类专注学习 · เลือกหมวดที่สนใจ"
                colorVar="--final"
                stat={String(cats.length)}
              />
            </button>
          </div>
        </div>
      )}

      {!current && level === "cats" && (
        <div className="space-y-3">
          <BackBar onBack={() => setLevel("choose")} title="按分类学习" sub="เลือกเรียนตามหมวดหมู่" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cats.map((c, i) => {
              const list = s.words.filter((w) => w.category === c.key);
              const done = list.filter((w) => s.progress[w.id]?.mastered).length;
              return (
                <button key={c.key} type="button" className="text-left" onClick={() => open(c.key)}>
                  <LearningCategoryCard
                    zh={c.zh}
                    th={c.th}
                    desc={`${c.desc} · 已掌握 ${done}/${list.length}`}
                    colorVar={COLORS[i % COLORS.length]}
                    stat={String(list.length)}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {current && (
        <>
          <BackBar
            onBack={() => setCat(null)}
            title={current.zh}
            sub={`${current.th} · ${filtered.length} คำ`}
          />


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

          {tab === "learn" && (
            <VocabLearn fixedCategory words={filtered} progress={s.progress} onMark={s.mark} />
          )}
          {tab === "card" && <VocabFlashcard words={filtered} progress={s.progress} onMark={s.mark} />}
          {tab === "lib" && (
            <VocabLibrary
              key={current.key}
              words={filtered}
              progress={s.progress}
              onAdd={s.addWord}
              onRemove={s.removeWord}
              customCategories={s.categories}
              defaultCategory={current.key}
            />
          )}
          {tab === "review" && <VocabReview words={filtered} progress={s.progress} onMark={s.mark} />}
        </>
      )}

      <button
        type="button"
        onClick={() => setAddOpen(true)}
        aria-label="添加单词 / เพิ่มคำศัพท์"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95 sm:right-6"
      >
        <Plus className="h-6 w-6" />
      </button>
      <AddWordDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={s.addWord}
        customCategories={s.categories}
        defaultCategory={current?.key}
      />
    </AppLayout>
  );
}
