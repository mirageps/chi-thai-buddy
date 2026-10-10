import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, X, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpeakButton } from "@/components/vocab/SpeakButton";
import { speakThai } from "@/lib/speech";
import { sample } from "@/data/thai";
import { Link } from "@tanstack/react-router";
import { useVocabStore } from "@/lib/vocab-store";
import {
  PRACTICE_WORDS,
  POOLS,
  BLANK_LABEL,
  makeBlanks,
  optionLabel,
  type PracticeBlank,
  type PracticeWord,
} from "@/data/practice";

const TOTAL = 10;

interface Question {
  word: PracticeWord;
  blank: PracticeBlank;
  options: string[];
}

type Source = "mix" | "learned" | "basic";
const SOURCES: { key: Source; zh: string; th: string }[] = [
  { key: "mix", zh: "综合", th: "ผสมผสาน" },
  { key: "learned", zh: "已学单词", th: "คำที่เรียนแล้ว" },
  { key: "basic", zh: "基础词库", th: "คำพื้นฐาน" },
];

function makeSet(learned: PracticeWord[], source: Source): Question[] {
  let pool: PracticeWord[];
  if (source === "learned") pool = sample(learned, Math.min(TOTAL, learned.length));
  else if (source === "basic" || !learned.length) pool = sample(PRACTICE_WORDS, TOTAL);
  else {
    const fromLearned = sample(learned, Math.min(Math.ceil(TOTAL / 2), learned.length));
    const used = new Set(fromLearned.map((w) => w.word));
    const rest = sample(PRACTICE_WORDS.filter((w) => !used.has(w.word)), TOTAL - fromLearned.length);
    pool = sample([...fromLearned, ...rest], TOTAL);
  }
  return pool.map((word) => {
    const blank = word.blanks[Math.floor(Math.random() * word.blanks.length)];
    const distract = sample(POOLS[blank.type].filter((x) => x !== blank.answer), 3);
    return { word, blank, options: sample([blank.answer, ...distract], 4) };
  });
}

function Masked({ text, fill, state }: { text: string; fill?: string; state: "idle" | "right" | "wrong" }) {
  const [before, after] = text.split("_");
  const color =
    state === "right" ? "text-[color:var(--practice-ok)]" : state === "wrong" ? "text-destructive" : "text-primary";
  return (
    <span className="font-thai text-6xl font-bold leading-none tracking-wide">
      {before}
      <span className={`${color} ${fill ? "" : "underline decoration-dashed underline-offset-8"}`}>{fill ?? "◌"}</span>
      {after}
    </span>
  );
}

export function PracticeMode() {
  const { words, progress, hydrated } = useVocabStore();
  const [source, setSource] = useState<Source>("mix");
  const learned = useMemo<PracticeWord[]>(
    () =>
      hydrated
        ? words
            .filter((w) => progress[w.id] && (progress[w.id].reviews > 0 || progress[w.id].mastered))
            .map((w) => ({ word: w.thai, zh: w.zh, read: w.pron, blanks: makeBlanks(w.thai) }))
            .filter((w) => w.blanks.length > 0)
        : [],
    [words, progress, hydrated],
  );
  const [qs, setQs] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const restart = useCallback(() => {
    setQs(makeSet(learned, source));
    setIdx(0);
    setPicked(null);
    setResults([]);
  }, [learned, source]);

  useEffect(() => {
    if (hydrated) restart();
  }, [hydrated, source]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = qs.length;
  const tabs = (
    <div className="glass-frosted mx-auto mb-3 flex max-w-3xl gap-1 rounded-xl border p-1">
      {SOURCES.map((s) => (
        <Button
          variant="ghost"
          key={s.key}
          type="button"
          onClick={() => setSource(s.key)}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-lg px-1 text-xs font-semibold transition-colors ${
            source === s.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>
            {s.zh}
            {s.key === "learned" && ` ${learned.length}`}
          </span>
          <span className="font-thai text-[10px] font-normal opacity-80">{s.th}</span>
        </Button>
      ))}
    </div>
  );

  if (hydrated && source === "learned" && !learned.length)
    return (
      <>
        {tabs}
        <Card className="mx-auto max-w-3xl p-6 text-center shadow-[var(--shadow-card)]">
          <p className="text-4xl">📚</p>
          <p className="mt-2 font-semibold">还没有已学单词</p>
          <p className="font-thai text-sm text-muted-foreground">ยังไม่มีคำที่เรียนแล้ว ลองไปจำคำศัพท์ก่อนนะ</p>
          <Button asChild className="mt-4 min-h-[44px]">
            <Link to="/vocab">
              去背单词 <span className="font-thai ml-1 text-xs opacity-80">ไปจำคำศัพท์</span>
            </Link>
          </Button>
        </Card>
      </>
    );

  if (!qs.length) return <>{tabs}<Card className="mx-auto h-64 max-w-3xl" /></>;

  // Summary
  if (results.length === total && picked === null) {
    const score = results.filter(Boolean).length;
    const msg =
      score >= 9 ? ["太棒了！", "ยอดเยี่ยมมาก!"] : score >= 6 ? ["做得不错！", "ทำได้ดี!"] : ["继续加油！", "สู้ต่อไปนะ!"];
    return (
      <>
      {tabs}
      <Card className="mx-auto max-w-3xl p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="mb-5 text-center">
          <p className="text-5xl font-bold text-primary">
            {score} <span className="text-2xl text-muted-foreground">/ {total}</span>
          </p>
          <p className="mt-2 font-semibold">
            {msg[0]} <span className="font-thai text-sm text-muted-foreground">{msg[1]}</span>
          </p>
        </div>
        <ul className="mb-5 divide-y rounded-xl border">
          {qs.map((q, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2.5">
              {results[i] ? (
                <Check className="h-4 w-4 shrink-0 text-[color:var(--practice-ok)]" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-destructive" />
              )}
              <span className="font-thai text-xl font-semibold">{q.word.word}</span>
              <span className="text-sm text-muted-foreground">
                {q.word.zh} · {q.word.read}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{BLANK_LABEL[q.blank.type].zh}</span>
            </li>
          ))}
        </ul>
        <Button onClick={restart} className="min-h-[44px] w-full">
          <RotateCcw className="mr-1.5 h-4 w-4" />
          再练一组 <span className="font-thai ml-1 text-xs opacity-80">เริ่มรอบใหม่</span>
        </Button>
      </Card>
      </>
    );
  }

  const q = qs[idx];
  const answered = picked !== null;
  const correct = picked === q.blank.answer;
  const label = BLANK_LABEL[q.blank.type];

  const choose = (opt: string) => {
    if (answered) return;
    setPicked(opt);
    setResults((r) => [...r, opt === q.blank.answer]);
    speakThai(q.word.word);
  };

  const next = () => {
    setPicked(null);
    if (idx + 1 < total) setIdx(idx + 1);
  };

  return (
    <>
    {tabs}
    <Card className="mx-auto max-w-3xl p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold">
          第 {idx + 1} / {total} 题 <span className="font-thai text-xs text-muted-foreground">ข้อ {idx + 1}</span>
        </span>
        <span className="rounded-full border px-2.5 py-0.5 text-xs">
          补全{label.zh} · <span className="font-thai">{label.th}</span>
        </span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${((idx + (answered ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <div className={`mb-6 flex flex-col items-center gap-3 text-center ${answered && !correct ? "animate-[shake_0.35s]" : ""}`}>
        <Masked
          text={q.blank.masked}
          fill={answered ? q.blank.answer : undefined}
          state={!answered ? "idle" : correct ? "right" : "wrong"}
        />
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{q.word.zh}</span>
          <span className="text-muted-foreground">· {q.word.read}</span>
          <SpeakButton text={q.word.word} size="sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {q.options.map((opt) => {
          const isAns = opt === q.blank.answer;
          const isPicked = opt === picked;
          const cls = !answered
            ? "hover:border-primary"
            : isAns
              ? "border-[color:var(--practice-ok)] bg-[color:color-mix(in_oklab,var(--practice-ok)_15%,transparent)]"
              : isPicked
                ? "border-destructive bg-destructive/10"
                : "opacity-50";
          return (
            <Button
              variant="outline"
              key={opt}
              type="button"
              onClick={() => choose(opt)}
              disabled={answered}
              className={`glass-clear font-thai min-h-[64px] rounded-xl border-2 text-3xl font-semibold transition-colors ${cls}`}
            >
              {optionLabel(q.blank.type, opt)}
            </Button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm">
            {correct ? "✓ 正确 / ถูกต้อง" : "✗ 错误 / ผิด"}{" "}
            <span className="font-thai font-semibold">{q.word.word}</span>
          </p>
          <Button onClick={next} className="min-h-[44px]">
            {idx + 1 < total ? "下一题" : "查看结果"}
            <span className="font-thai ml-1 text-xs opacity-80">{idx + 1 < total ? "ข้อถัดไป" : "ดูผล"}</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
    </>
  );
}
