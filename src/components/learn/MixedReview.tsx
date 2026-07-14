import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RefreshCw, Volume2, Shuffle } from "lucide-react";
import {
  CONSONANTS,
  VOWELS,
  TONES,
  sample,
  type Consonant,
  type Vowel,
  type Tone,
} from "@/data/thai";
import { FINALS } from "@/data/finals";
import { speakThai, isSpeechSupported } from "@/lib/speech";

type Kind = "consonant" | "vowel" | "final" | "tone";

interface MixedQ {
  kind: Kind;
  prompt: string;
  promptSub?: string;
  speakText: string;
  answer: string;
  options: string[];
  accentVar: string;
}

function pickKind(): Kind {
  const r = Math.random();
  if (r < 0.25) return "consonant";
  if (r < 0.5) return "vowel";
  if (r < 0.75) return "final";
  return "tone";
}

function makeMixed(): MixedQ {
  const kind = pickKind();
  if (kind === "consonant") {
    const [c] = sample(CONSONANTS, 1) as Consonant[];
    const wrong = sample(
      CONSONANTS.filter((x) => x.zhMeaning !== c.zhMeaning),
      3,
    ) as Consonant[];
    const options = [c, ...wrong]
      .map((x) => x.zhMeaning)
      .sort(() => Math.random() - 0.5);
    return {
      kind,
      prompt: c.char,
      promptSub: c.name,
      speakText: c.name,
      answer: c.zhMeaning,
      options,
      accentVar: "--consonant",
    };
  }
  if (kind === "vowel") {
    const [v] = sample(VOWELS, 1) as Vowel[];
    const wrong = sample(
      VOWELS.filter((x) => x.zhName !== v.zhName),
      3,
    ) as Vowel[];
    const options = [v, ...wrong]
      .map((x) => `${x.zhName} (${x.zhSound})`)
      .sort(() => Math.random() - 0.5);
    return {
      kind,
      prompt: v.form,
      speakText: v.render("อ"),
      answer: `${v.zhName} (${v.zhSound})`,
      options,
      accentVar: "--vowel",
    };
  }
  if (kind === "final") {
    const [f] = sample(FINALS, 1);
    const ex = f.examples[Math.floor(Math.random() * f.examples.length)];
    const wrong = sample(
      FINALS.filter((x) => x.key !== f.key),
      3,
    );
    const options = [f, ...wrong]
      .map((x) => `${x.zhName} · ${x.thName}`)
      .sort(() => Math.random() - 0.5);
    return {
      kind,
      prompt: ex.thai,
      promptSub: ex.zh,
      speakText: ex.thai,
      answer: `${f.zhName} · ${f.thName}`,
      options,
      accentVar: "--final",
    };
  }
  const [t] = sample(TONES, 1) as Tone[];
  const wrong = sample(
    TONES.filter((x) => x.zhName !== t.zhName),
    3,
  ) as Tone[];
  const options = [t, ...wrong]
    .map((x) => `${x.zhName} ${x.arrow}`)
    .sort(() => Math.random() - 0.5);
  return {
    kind,
    prompt: `ก${t.symbol}`,
    promptSub: t.name,
    speakText: `กา${t.symbol}`,
    answer: `${t.zhName} ${t.arrow}`,
    options,
    accentVar: "--tone",
  };
}

const KIND_LABEL: Record<Kind, string> = {
  consonant: "辅音 / พยัญชนะ",
  vowel: "元音 / สระ",
  final: "韵尾 / ตัวสะกด",
  tone: "声调 / วรรณยุกต์",
};

export function MixedReview() {
  const [q, setQ] = useState<MixedQ>(() => makeMixed());
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);

  const nextQ = useCallback(() => {
    setQ(makeMixed());
    setPicked(null);
  }, []);

  // Auto-speak on new question (only if browser supports)
  useEffect(() => {
    if (isSpeechSupported()) speakThai(q.speakText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handlePick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    setTotal((t) => t + 1);
    if (opt === q.answer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center justify-between text-sm">
        <span className="text-muted-foreground">
          得分 / คะแนน:{" "}
          <span className="font-semibold text-foreground">
            {score} / {total}
          </span>
          {streak > 1 && (
            <span className="ml-2 text-[color:var(--accent)]">🔥 {streak}</span>
          )}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setScore(0);
            setTotal(0);
            setStreak(0);
            nextQ();
          }}
        >
          <RefreshCw className="mr-1 h-3 w-3" /> 重置
        </Button>
      </div>

      <Card className="flex w-full max-w-md flex-col items-center gap-3 p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            style={{
              borderColor: `var(${q.accentVar})`,
              color: `var(${q.accentVar})`,
            }}
          >
            <Shuffle className="mr-1 h-3 w-3" />
            {KIND_LABEL[q.kind]}
          </Badge>
        </div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          听并选择 / ฟังแล้วเลือก
        </p>
        <div
          className="font-thai text-8xl font-bold"
          style={{ color: `var(${q.accentVar})` }}
        >
          {q.prompt}
        </div>
        {q.promptSub && (
          <div className="font-thai text-lg text-muted-foreground">
            {q.promptSub}
          </div>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => speakThai(q.speakText)}
          disabled={!isSpeechSupported()}
        >
          <Volume2 className="mr-1 h-4 w-4" />
          再听一次 / ฟังอีกครั้ง
        </Button>
      </Card>

      <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
        {q.options.map((opt) => {
          const isCorrect = opt === q.answer;
          const isPicked = picked === opt;
          let cls = "";
          if (picked) {
            if (isCorrect) cls = "border-[color:var(--vowel)] bg-[color:var(--vowel)]/10";
            else if (isPicked) cls = "border-destructive bg-destructive/10";
          }
          return (
            <Button
              key={opt}
              variant="outline"
              onClick={() => handlePick(opt)}
              className={`h-auto min-h-14 justify-between whitespace-normal py-3 text-left ${cls}`}
            >
              <span className="flex-1">{opt}</span>
              {picked && isCorrect && (
                <CheckCircle2 className="h-5 w-5 text-[color:var(--vowel)]" />
              )}
              {picked && isPicked && !isCorrect && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </Button>
          );
        })}
      </div>

      {picked && (
        <Button onClick={nextQ} size="lg" className="w-full max-w-md">
          下一题 / ข้อถัดไป →
        </Button>
      )}

      {!isSpeechSupported() && (
        <p className="text-center text-xs text-muted-foreground">
          您的浏览器不支持语音功能 · เบราว์เซอร์ของคุณไม่รองรับเสียง
        </p>
      )}
    </div>
  );
}