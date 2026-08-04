import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, Volume2 } from "lucide-react";
import {
  CONSONANTS,
  VOWELS,
  TONES,
  classLabel,
  type Consonant,
  type Vowel,
  type Tone,
} from "@/data/thai";
import { FINALS, type FinalGroup } from "@/data/finals";
import { speakThai } from "@/lib/speech";
import { useSpeechSupported } from "@/hooks/useSpeechSupported";

type Mode = "consonants" | "vowels" | "finals" | "tones";

interface Props {
  mode: Mode;
}

function classColor(cls: "mid" | "high" | "low") {
  // Flashcard keeps its own frozen palette (see --fc-* tokens in styles.css).
  if (cls === "mid") return "bg-[color:var(--fc-class-mid)] text-white";
  if (cls === "high") return "bg-[color:var(--fc-class-high)] text-white";
  return "bg-[color:var(--fc-class-low)] text-white";
}

export function Flashcard({ mode }: Props) {
  const source = useMemo(() => {
    if (mode === "consonants") return CONSONANTS;
    if (mode === "vowels") return VOWELS;
    if (mode === "finals") return FINALS;
    return TONES;
  }, [mode]);

  const [order, setOrder] = useState<number[]>(() =>
    source.map((_, i) => i),
  );
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = source[order[idx]];

  const speakCurrent = () => {
    if (mode === "consonants") {
      const c = current as Consonant;
      speakThai(c.name);
    } else if (mode === "vowels") {
      const v = current as Vowel;
      speakThai(v.render("อ"));
    } else if (mode === "finals") {
      const f = current as FinalGroup;
      const ex = f.examples[0]?.thai;
      if (ex) speakThai(ex);
    } else {
      const t = current as Tone;
      speakThai(`กา${t.symbol}`);
    }
  };

  const next = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % order.length);
  };
  const prev = () => {
    setFlipped(false);
    setIdx((i) => (i - 1 + order.length) % order.length);
  };
  const shuffle = () => {
    const arr = source.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    setIdx(0);
    setFlipped(false);
  };

  const accent =
    mode === "consonants"
      ? "from-[color:var(--fc-consonant)]"
      : mode === "vowels"
        ? "from-[color:var(--fc-vowel)]"
        : mode === "finals"
          ? "from-[color:var(--fc-final)]"
          : "from-[color:var(--fc-tone)]";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
        <span>
          {idx + 1} / {order.length}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={speakCurrent}
            disabled={!useSpeechSupported()}
            title="播放发音 / ฟังเสียง"
          >
            <Volume2 className="mr-1 h-4 w-4" />
            听
          </Button>
          <Button variant="ghost" size="sm" onClick={shuffle}>
            <Shuffle className="mr-2 h-4 w-4" />
            打乱 / สุ่ม
          </Button>
        </div>
      </div>

      <Card
        onClick={() => setFlipped((f) => !f)}
        className={`relative flex min-h-[22rem] w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${accent} to-card px-6 py-10 shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]`}
      >
        <div className="absolute right-3 top-3 text-xs text-white/70">
          <RotateCw className="h-4 w-4" />
        </div>

        {!flipped ? (
          <FrontFace mode={mode} item={current} />
        ) : (
          <BackFace mode={mode} item={current} />
        )}
      </Card>

      <div className="flex w-full max-w-md items-center justify-between gap-3">
        <Button variant="outline" onClick={prev} className="flex-1">
          <ChevronLeft className="mr-1 h-4 w-4" />
          上一个
        </Button>
        <Button onClick={() => setFlipped((f) => !f)} className="flex-1">
          翻卡 / พลิก
        </Button>
        <Button variant="outline" onClick={next} className="flex-1">
          下一个
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {mode === "consonants" && (
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Badge className="bg-[color:var(--fc-class-mid)] text-white">中辅音 อักษรกลาง</Badge>
          <Badge className="bg-[color:var(--fc-class-high)] text-white">高辅音 อักษรสูง</Badge>
          <Badge className="bg-[color:var(--fc-class-low)] text-white">低辅音 อักษรต่ำ</Badge>
        </div>
      )}
    </div>
  );
}

function FrontFace({ mode, item }: { mode: Mode; item: Consonant | Vowel | Tone | FinalGroup }) {
  if (mode === "consonants") {
    const c = item as Consonant;
    return (
      <div className="flex flex-col items-center gap-6 text-white">
        <span className="font-thai text-9xl font-bold leading-[1.4] drop-shadow-lg">{c.char}</span>
        <span className={`rounded-full px-3 py-1 text-xs ${classColor(c.cls)}`}>
          {classLabel(c.cls).zh}
        </span>
      </div>
    );
  }
  if (mode === "vowels") {
    const v = item as Vowel;
    return (
      <div className="flex flex-col items-center gap-6 text-white">
        <span className="font-thai text-8xl font-bold leading-[1.4] drop-shadow-lg">{v.form}</span>
        <span className="text-sm opacity-80">点击查看发音</span>
      </div>
    );
  }
  if (mode === "finals") {
    const f = item as FinalGroup;
    return (
      <div className="flex flex-col items-center gap-6 px-6 text-center text-white">
        <span className="font-thai text-6xl font-bold leading-[1.4] drop-shadow-lg">
          {f.thName}
        </span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
          {f.zhName}
          {f.ipa ? ` · ${f.ipa}` : ""}
        </span>
      </div>
    );
  }
  const t = item as Tone;
  return (
    <div className="flex flex-col items-center gap-6 text-white">
      <span className="font-thai text-8xl font-bold leading-[1.4] drop-shadow-lg">
        ก{t.symbol}
      </span>
      <span className="text-4xl">{t.arrow}</span>
    </div>
  );
}

function BackFace({ mode, item }: { mode: Mode; item: Consonant | Vowel | Tone | FinalGroup }) {
  if (mode === "consonants") {
    const c = item as Consonant;
    return (
      <div className="flex flex-col items-center gap-2 px-6 text-center text-white">
        <div className="font-thai text-4xl leading-[1.5]">{c.name}</div>
        <div className="text-sm italic opacity-80">{c.romanized}</div>
        <div className="mt-2 text-2xl font-semibold">{c.zhMeaning}</div>
        <div className="text-sm opacity-90">发音：{c.zhSound}</div>
        <div className={`mt-3 rounded-full px-3 py-1 text-xs ${classColor(c.cls)}`}>
          {classLabel(c.cls).zh} · {classLabel(c.cls).th}
        </div>
      </div>
    );
  }
  if (mode === "vowels") {
    const v = item as Vowel;
    return (
      <div className="flex flex-col items-center gap-2 text-center text-white">
        <div className="text-3xl font-bold">{v.zhName}</div>
        <div className="font-thai text-2xl leading-[1.5] opacity-90">示例：{v.render("ก")}</div>
        <div className="text-lg">发音：{v.zhSound}</div>
        <div className="text-xs opacity-80">
          {v.length === "short" ? "短元音 สระเสียงสั้น" : "长元音 สระเสียงยาว"}
        </div>
      </div>
    );
  }
  if (mode === "finals") {
    const f = item as FinalGroup;
    return (
      <div className="flex flex-col items-center gap-2 px-6 text-center text-white">
        <div className="text-2xl font-bold">{f.zhName}</div>
        <div className="font-thai text-xl leading-[1.5] opacity-90">{f.thName}</div>
        <div className="text-sm opacity-90">{f.desc}</div>
        {f.consonants.length > 0 && (
          <div className="font-thai text-lg leading-[1.5]">
            辅音：{f.consonants.join(" ")}
          </div>
        )}
        <div className="mt-1 flex flex-wrap justify-center gap-1 text-xs">
          {f.examples.map((ex) => (
            <span
              key={ex.thai}
              className="rounded-full bg-white/20 px-2 py-0.5"
            >
              <span className="font-thai">{ex.thai}</span> · {ex.zh}
            </span>
          ))}
        </div>
      </div>
    );
  }
  const t = item as Tone;
  return (
    <div className="flex flex-col items-center gap-2 text-center text-white">
      <div className="text-3xl font-bold">{t.zhName}</div>
      <div className="font-thai text-xl leading-[1.5] opacity-90">{t.name}</div>
      <div className="max-w-xs text-sm">{t.zhDesc}</div>
      <div className="mt-2 text-4xl">{t.arrow}</div>
    </div>
  );
}