import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, RotateCcw } from "lucide-react";
import type { VocabWord } from "@/data/vocab";
import { SpeakButton } from "./SpeakButton";
import type { ProgressMap } from "@/lib/vocab-store";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function VocabReview({
  words,
  progress,
  onMark,
}: {
  words: VocabWord[];
  progress: ProgressMap;
  onMark: (id: string, mastered: boolean) => void;
}) {
  const [question, setQuestion] = useState<VocabWord | null>(null);
  const [options, setOptions] = useState<VocabWord[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const nextQuestion = useCallback(() => {
    if (words.length < 4) return;
    const pool = words.filter((w) => !progress[w.id]?.mastered);
    const source = pool.length >= 1 ? pool : words;
    const q = pick(source);
    const others: VocabWord[] = [];
    while (others.length < 3) {
      const o = pick(words);
      if (o.id !== q.id && !others.some((x) => x.id === o.id)) others.push(o);
    }
    const all = [...others, q].sort(() => Math.random() - 0.5);
    setQuestion(q);
    setOptions(all);
    setPicked(null);
  }, [words, progress]);

  useEffect(() => {
    if (!question) nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.length]);

  if (words.length < 4 || !question) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        单词太少，先去词库添加。
        <span className="font-thai">คำศัพท์ยังน้อย ลองเพิ่มในคลังคำศัพท์</span>
      </Card>
    );
  }

  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    const correct = id === question.id;
    onMark(question.id, correct);
    setStreak((s) => {
      const v = correct ? s + 1 : 0;
      setBest((b) => Math.max(b, v));
      return v;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-primary">
          <Flame className="h-4 w-4" /> 连续答对 {streak}
        </span>
        <span className="text-muted-foreground">最佳 {best}</span>
      </div>

      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-xs text-muted-foreground">
          这个词是什么意思？· <span className="font-thai">คำนี้แปลว่าอะไร</span>
        </p>
        <div className="flex items-center gap-3">
          <p className="font-thai text-4xl leading-[1.4] font-semibold">{question.thai}</p>
          <SpeakButton text={question.thai} size="lg" />
        </div>
        <p className="text-sm text-[color:var(--text-secondary)]">{question.pron}</p>
      </Card>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const isRight = o.id === question.id;
          const state = !picked
            ? "idle"
            : isRight
              ? "right"
              : o.id === picked
                ? "wrong"
                : "idle";
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              className={`min-h-[52px] rounded-xl border px-4 text-base font-medium transition-colors ${
                state === "right"
                  ? "border-[color:var(--vowel)] bg-[color:var(--vowel)]/20 text-foreground"
                  : state === "wrong"
                    ? "border-destructive bg-destructive/15 text-foreground"
                    : "border-border bg-card hover:bg-accent"
              }`}
            >
              {o.zh}
            </button>
          );
        })}
      </div>

      {picked && (
        <Button className="min-h-[48px] w-full" onClick={nextQuestion}>
          <RotateCcw className="mr-1 h-4 w-4" /> 下一题 / ข้อต่อไป
        </Button>
      )}
    </div>
  );
}
