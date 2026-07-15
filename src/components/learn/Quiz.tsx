import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, RefreshCw, Volume2 } from "lucide-react";
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
import { speakThai } from "@/lib/speech";
import { useSpeechSupported } from "@/hooks/useSpeechSupported";

type Mode = "consonants" | "vowels" | "finals" | "tones";

interface Question {
  prompt: string;      // Thai symbol
  promptSub?: string;
  answer: string;      // Chinese answer
  options: string[];
  speakText: string;
}

function makeQuestion(mode: Mode): Question {
  if (mode === "consonants") {
    const [correct] = sample(CONSONANTS, 1) as Consonant[];
    const wrong = sample(
      CONSONANTS.filter((c) => c.zhMeaning !== correct.zhMeaning),
      3,
    ) as Consonant[];
    const options = [correct, ...wrong]
      .map((c) => c.zhMeaning)
      .sort(() => Math.random() - 0.5);
    return {
      prompt: correct.char,
      promptSub: correct.name,
      answer: correct.zhMeaning,
      options,
      speakText: correct.name,
    };
  }
  if (mode === "vowels") {
    const [correct] = sample(VOWELS, 1) as Vowel[];
    const wrong = sample(
      VOWELS.filter((v) => v.zhName !== correct.zhName),
      3,
    ) as Vowel[];
    const options = [correct, ...wrong]
      .map((v) => `${v.zhName} (${v.zhSound})`)
      .sort(() => Math.random() - 0.5);
    return {
      prompt: correct.form,
      answer: `${correct.zhName} (${correct.zhSound})`,
      options,
      speakText: correct.render("อ"),
    };
  }
  if (mode === "finals") {
    // Pick a random example from a random group; ask which group it belongs to.
    const [correct] = sample(FINALS, 1);
    const example =
      correct.examples[Math.floor(Math.random() * correct.examples.length)];
    const wrong = sample(
      FINALS.filter((f) => f.key !== correct.key),
      3,
    );
    const options = [correct, ...wrong]
      .map((f) => `${f.zhName} · ${f.thName}`)
      .sort(() => Math.random() - 0.5);
    return {
      prompt: example.thai,
      promptSub: example.zh,
      answer: `${correct.zhName} · ${correct.thName}`,
      options,
      speakText: example.thai,
    };
  }
  const [correct] = sample(TONES, 1) as Tone[];
  const wrong = sample(
    TONES.filter((t) => t.zhName !== correct.zhName),
    3,
  ) as Tone[];
  const options = [correct, ...wrong]
    .map((t) => `${t.zhName} ${t.arrow}`)
    .sort(() => Math.random() - 0.5);
  return {
    prompt: `ก${correct.symbol}`,
    promptSub: correct.name,
    answer: `${correct.zhName} ${correct.arrow}`,
    options,
    speakText: `กา${correct.symbol}`,
  };
}

export function Quiz({ mode }: { mode: Mode }) {
  const [q, setQ] = useState<Question>(() => makeQuestion(mode));
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setQ(makeQuestion(mode));
    setPicked(null);
    setScore(0);
    setTotal(0);
  }, [mode]);

  const accent = useMemo(
    () =>
      mode === "consonants"
        ? "text-[color:var(--consonant)]"
        : mode === "vowels"
          ? "text-[color:var(--vowel)]"
          : mode === "finals"
            ? "text-[color:var(--final)]"
            : "text-[color:var(--tone)]",
    [mode],
  );

  const handlePick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    setTotal((t) => t + 1);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const nextQ = () => {
    setQ(makeQuestion(mode));
    setPicked(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center justify-between text-sm">
        <span className="text-muted-foreground">
          得分 / คะแนน:{" "}
          <span className="font-semibold text-foreground">
            {score} / {total}
          </span>
        </span>
        <Button size="sm" variant="ghost" onClick={() => { setScore(0); setTotal(0); nextQ(); }}>
          <RefreshCw className="mr-1 h-3 w-3" /> 重置
        </Button>
      </div>

      <Card className="flex w-full max-w-md flex-col items-center gap-3 p-8 shadow-[var(--shadow-card)]">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          这是什么？ / นี่คืออะไร？
        </p>
        <div className={`font-thai text-8xl font-bold leading-[1.4] py-2 ${accent}`}>{q.prompt}</div>
        {q.promptSub && (
          <div className="font-thai text-lg leading-[1.5] text-muted-foreground">
            {q.promptSub}
          </div>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => speakThai(q.speakText)}
          disabled={!useSpeechSupported()}
        >
          <Volume2 className="mr-1 h-4 w-4" />
          听发音 / ฟัง
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
    </div>
  );
}