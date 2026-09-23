import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check, X } from "lucide-react";
import { DIFFICULTY_META, type VocabWord } from "@/data/vocab";
import { SpeakButton } from "./SpeakButton";
import type { ProgressMap } from "@/lib/vocab-store";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function VocabFlashcard({
  words,
  progress,
  onMark,
}: {
  words: VocabWord[];
  progress: ProgressMap;
  onMark: (id: string, mastered: boolean) => void;
}) {
  const [seed, setSeed] = useState(0);
  const deck = useMemo(() => shuffle(words), [words, seed]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = deck[i];
  const done = i >= deck.length;

  const next = (mastered: boolean) => {
    if (word) onMark(word.id, mastered);
    setFlipped(false);
    setI((v) => v + 1);
  };

  if (done || !word) {
    return (
      <Card className="space-y-4 p-8 text-center">
        <p className="text-lg font-medium">本轮完成！<span className="font-thai">จบรอบแล้ว</span></p>
        <p className="text-sm text-muted-foreground">
          已掌握 {Object.values(progress).filter((p) => p.mastered).length} 个单词
        </p>
        <Button
          className="min-h-[44px]"
          onClick={() => {
            setSeed((s) => s + 1);
            setI(0);
            setFlipped(false);
          }}
        >
          <RotateCcw className="mr-1 h-4 w-4" /> 再来一轮 / เริ่มรอบใหม่
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        {i + 1} / {deck.length}
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label="翻转卡片 / พลิกการ์ด"
        className="w-full"
      >
        <Card
          className="flex min-h-[240px] flex-col items-center justify-center gap-3 border-0 p-6 text-center shadow-[var(--fc-shadow)]"
          style={{
            backgroundColor: "var(--fc-vowel)",
            color: "var(--fc-text-primary)",
          }}
        >
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: "rgb(255 255 255 / 0.55)", color: "var(--fc-text-secondary)" }}
          >
            {DIFFICULTY_META[word.difficulty].zh}
          </span>

          <p className="font-thai text-5xl leading-[1.4] font-semibold">{word.thai}</p>

          {flipped ? (
            <div className="space-y-1">
              <p className="text-sm" style={{ color: "var(--fc-text-secondary)" }}>
                发音：{word.pron}
              </p>
              <p className="text-2xl font-medium">{word.zh}</p>
            </div>
          ) : (
            <p className="text-xs" style={{ color: "var(--fc-text-muted)" }}>
              点击查看释义 / แตะเพื่อดูความหมาย
            </p>
          )}

          <div className="pt-1">
            <SpeakButton text={word.thai} />
          </div>
        </Card>
      </button>

      <div className="flex gap-3">
        <Button variant="outline" className="min-h-[48px] flex-1" onClick={() => next(false)}>
          <X className="mr-1 h-4 w-4" /> 未掌握 / ยังจำไม่ได้
        </Button>
        <Button className="min-h-[48px] flex-1" onClick={() => next(true)}>
          <Check className="mr-1 h-4 w-4" /> 已掌握 / จำได้
        </Button>
      </div>
    </div>
  );
}
