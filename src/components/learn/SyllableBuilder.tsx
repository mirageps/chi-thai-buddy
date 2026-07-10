import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2 } from "lucide-react";
import { CONSONANTS, VOWELS, TONES, classLabel } from "@/data/thai";
import { speakThai, isSpeechSupported } from "@/lib/speech";

export function SyllableBuilder() {
  const [cIdx, setCIdx] = useState(0); // ก
  const [vIdx, setVIdx] = useState(1); // า
  const [tIdx, setTIdx] = useState(0); // no tone

  const consonant = CONSONANTS[cIdx];
  const vowel = VOWELS[vIdx];
  const tone = TONES[tIdx];

  const syllable = useMemo(() => {
    // Render vowel with consonant, then insert tone mark after the consonant
    const base = vowel.render(consonant.char);
    if (!tone.symbol) return base;
    // Insert tone symbol right after the consonant char (index of consonant.char in base)
    const idx = base.indexOf(consonant.char);
    if (idx < 0) return base + tone.symbol;
    return (
      base.slice(0, idx + consonant.char.length) +
      tone.symbol +
      base.slice(idx + consonant.char.length)
    );
  }, [consonant, vowel, tone]);

  return (
    <div className="flex flex-col gap-6">
      {/* Preview */}
      <Card className="flex flex-col items-center gap-4 bg-[image:var(--gradient-hero)] p-8 text-primary-foreground shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-widest opacity-80">
          你的音节 / พยางค์ของคุณ
        </p>
        <div className="font-thai text-8xl font-bold drop-shadow-lg">
          {syllable}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => speakThai(syllable)}
          disabled={!isSpeechSupported()}
        >
          <Volume2 className="mr-1 h-4 w-4" />
          播放发音 / ฟังเสียง
        </Button>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Badge variant="secondary" className="font-thai">
            {consonant.char} · {consonant.zhSound}
          </Badge>
          <Badge variant="secondary" className="font-thai">
            {vowel.form} · {vowel.zhSound}
          </Badge>
          <Badge variant="secondary">
            {tone.zhName} {tone.arrow}
          </Badge>
        </div>
      </Card>

      {/* Selectors */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SelectorGroup
          title="辅音 / พยัญชนะ"
          colorVar="--consonant"
          items={CONSONANTS.map((c, i) => ({
            key: i,
            label: c.char,
            sub: classLabel(c.cls).zh,
            cls: c.cls,
          }))}
          selected={cIdx}
          onSelect={setCIdx}
          coded
        />
        <SelectorGroup
          title="元音 / สระ"
          colorVar="--vowel"
          items={VOWELS.map((v, i) => ({
            key: i,
            label: v.form,
            sub: v.zhName,
          }))}
          selected={vIdx}
          onSelect={setVIdx}
        />
        <SelectorGroup
          title="声调 / วรรณยุกต์"
          colorVar="--tone"
          items={TONES.map((t, i) => ({
            key: i,
            label: t.symbol ? `ก${t.symbol}` : "ก",
            sub: `${t.zhName} ${t.arrow}`,
          }))}
          selected={tIdx}
          onSelect={setTIdx}
        />
      </div>
    </div>
  );
}

interface Item {
  key: number;
  label: string;
  sub: string;
  cls?: "mid" | "high" | "low";
}

function SelectorGroup({
  title,
  colorVar,
  items,
  selected,
  onSelect,
  coded,
}: {
  title: string;
  colorVar: string;
  items: Item[];
  selected: number;
  onSelect: (i: number) => void;
  coded?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-3 p-4 shadow-[var(--shadow-card)]">
      <h3
        className="text-sm font-semibold"
        style={{ color: `var(${colorVar})` }}
      >
        {title}
      </h3>
      <ScrollArea className="h-64">
        <div className="grid grid-cols-4 gap-2 pr-3">
          {items.map((it) => {
            const active = it.key === selected;
            let bg = "";
            if (coded && it.cls) {
              if (it.cls === "mid") bg = "border-l-4 border-l-[color:var(--class-mid)]";
              else if (it.cls === "high") bg = "border-l-4 border-l-[color:var(--class-high)]";
              else bg = "border-l-4 border-l-[color:var(--class-low)]";
            }
            return (
              <button
                key={it.key}
                onClick={() => onSelect(it.key)}
                className={`font-thai flex flex-col items-center rounded-md border p-2 text-lg transition-colors ${bg} ${
                  active
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : "hover:bg-muted"
                }`}
                title={it.sub}
              >
                <span>{it.label}</span>
                <span className="font-cn mt-1 text-[10px] leading-tight text-muted-foreground">
                  {it.sub}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}