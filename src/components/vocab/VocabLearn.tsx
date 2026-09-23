import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DIFFICULTY_META, VOCAB_CATEGORIES, categoryLabel, type VocabWord } from "@/data/vocab";
import { SpeakButton } from "./SpeakButton";
import type { ProgressMap } from "@/lib/vocab-store";

export function VocabLearn({
  words,
  progress,
  onMark,
}: {
  words: VocabWord[];
  progress: ProgressMap;
  onMark: (id: string, mastered: boolean) => void;
}) {
  const [cat, setCat] = useState<string>("greeting");
  const [index, setIndex] = useState(0);

  const list = useMemo(
    () => words.filter((w) => (cat === "mine" ? w.custom : w.category === cat)),
    [words, cat],
  );
  const word = list[Math.min(index, Math.max(list.length - 1, 0))];

  const tabs = [...VOCAB_CATEGORIES, { key: "mine", zh: "我的单词", th: "คำของฉัน" }];

  return (
    <div className="space-y-4">
      <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map((c) => {
          const active = c.key === cat;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => {
                setCat(c.key);
                setIndex(0);
              }}
              className={`min-h-[40px] shrink-0 snap-start rounded-full border px-4 text-sm font-medium transition-colors ${
                active
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.zh} <span className="font-thai text-[11px] opacity-70">{c.th}</span>
            </button>
          );
        })}
      </div>

      {!word ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          这个分类还没有单词。<span className="font-thai">ยังไม่มีคำศัพท์ในหมวดนี้</span>
        </Card>
      ) : (
        <>
          <Card className="space-y-4 p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>
                {categoryLabel(word.category).zh} ·{" "}
                <span className="font-thai">{categoryLabel(word.category).th}</span>
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                style={{ backgroundColor: `var(${DIFFICULTY_META[word.difficulty].colorVar})` }}
              >
                {DIFFICULTY_META[word.difficulty].zh}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <p className="font-thai text-4xl leading-[1.4] font-semibold">{word.thai}</p>
              <SpeakButton text={word.thai} size="lg" />
            </div>
            <p className="text-sm text-[color:var(--text-secondary)]">发音：{word.pron}</p>
            <p className="text-xl font-medium">{word.zh}</p>

            <Button
              variant={progress[word.id]?.mastered ? "default" : "outline"}
              className="min-h-[44px] w-full"
              onClick={() => onMark(word.id, !progress[word.id]?.mastered)}
            >
              <Check className="mr-1 h-4 w-4" />
              {progress[word.id]?.mastered ? "已掌握 / จำได้แล้ว" : "标记已掌握 / ทำเครื่องหมายว่าจำได้"}
            </Button>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="min-h-[44px] flex-1"
              disabled={index <= 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> 上一个
            </Button>
            <span className="text-sm text-muted-foreground">
              {Math.min(index + 1, list.length)} / {list.length}
            </span>
            <Button
              variant="outline"
              className="min-h-[44px] flex-1"
              disabled={index >= list.length - 1}
              onClick={() => setIndex((i) => Math.min(list.length - 1, i + 1))}
            >
              下一个 <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
