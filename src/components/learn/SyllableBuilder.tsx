import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2, ChevronDown } from "lucide-react";
import { CONSONANTS, VOWELS, TONES, classLabel } from "@/data/thai";
import {
  FINALS,
  PRIMARY_FINAL_CONSONANTS,
  finalGroupOf,
  liveOrDead,
  lookupVocab,
  type FinalKey,
} from "@/data/finals";
import { speakThai } from "@/lib/speech";
import { useSpeechSupported } from "@/hooks/useSpeechSupported";

export function SyllableBuilder() {
  const [cIdx, setCIdx] = useState(0); // ก
  const [vIdx, setVIdx] = useState(1); // า
  const [fKey, setFKey] = useState<FinalKey>("none");
  const [tIdx, setTIdx] = useState(0); // no tone

  const consonant = CONSONANTS[cIdx];
  const vowel = VOWELS[vIdx];
  const tone = TONES[tIdx];
  const finalEntry =
    fKey === "none"
      ? null
      : PRIMARY_FINAL_CONSONANTS.find((f) => f.key === fKey) ?? null;
  const finalChar = finalEntry?.char ?? "";
  const finalGroup = finalChar ? finalGroupOf(finalChar) : FINALS[0];

  const syllable = useMemo(() => {
    // 1) vowel + initial consonant
    let s = vowel.render(consonant.char);
    // 2) insert tone symbol right after the initial consonant
    if (tone.symbol) {
      const idx = s.indexOf(consonant.char);
      if (idx < 0) s = s + tone.symbol;
      else
        s =
          s.slice(0, idx + consonant.char.length) +
          tone.symbol +
          s.slice(idx + consonant.char.length);
    }
    // 3) append final consonant if any
    if (finalChar) s = s + finalChar;
    return s;
  }, [consonant, vowel, tone, finalChar]);

  const meaning = lookupVocab(syllable);
  const liveDead = liveOrDead(fKey, vowel.length);
  const romanized = `${consonant.initialSound}${vowel.romanized}${
    finalGroup?.short && finalGroup.short !== "—" ? finalGroup.short.replace("-", "") : ""
  }`;

  return (
    <div className="flex flex-col gap-6">
      {/* Preview */}
      <Card className="flex flex-col items-center gap-4 bg-[image:var(--gradient-hero)] p-8 text-primary-foreground shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-widest opacity-80">
          你的音节 / พยางค์ของคุณ
        </p>
        <div className="font-thai text-8xl font-bold leading-[1.4] drop-shadow-lg py-4">
          {syllable}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => speakThai(syllable)}
          disabled={!useSpeechSupported()}
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
          {finalChar && (
            <Badge variant="secondary" className="font-thai">
              {finalChar} · {finalGroup?.short}
            </Badge>
          )}
          <Badge variant="secondary">
            {tone.zhName} {tone.arrow}
          </Badge>
        </div>
      </Card>

      {/* Details */}
      <Card className="grid gap-3 p-5 text-sm shadow-[var(--shadow-card)] sm:grid-cols-2">
        <DetailRow
          zh="起始辅音"
          th="พยัญชนะต้น"
          value={
            <>
              <span className="font-thai">{consonant.char}</span>{" "}
              <span className="text-muted-foreground">
                ({classLabel(consonant.cls).zh})
              </span>
            </>
          }
        />
        <DetailRow
          zh="元音"
          th="สระ"
          value={
            <>
              <span className="font-thai">{vowel.form}</span>{" "}
              <span className="text-muted-foreground">
                ({vowel.length === "short" ? "短" : "长"})
              </span>
            </>
          }
        />
        <DetailRow
          zh="韵尾"
          th="ตัวสะกด"
          value={
            finalChar ? (
              <span className="font-thai">
                {finalChar}{" "}
                <span className="text-muted-foreground">
                  ({finalGroup?.short})
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">无韵尾 / —</span>
            )
          }
        />
        <DetailRow
          zh="韵尾类别"
          th="มาตราตัวสะกด"
          value={
            <span className="font-thai">
              {finalGroup?.thName ?? "—"}{" "}
              <span className="text-muted-foreground">
                ({finalGroup?.zhName ?? "—"})
              </span>
            </span>
          }
        />
        <DetailRow
          zh="声调符号"
          th="รูปวรรณยุกต์"
          value={
            <>
              <span className="font-thai">
                {tone.symbol ? tone.symbol : "—"}
              </span>{" "}
              <span className="text-muted-foreground">
                ({tone.zhName} {tone.arrow})
              </span>
            </>
          }
        />
        <DetailRow
          zh="音节类型"
          th="คำเป็น/คำตาย"
          value={
            <span className="text-muted-foreground">
              {liveDead === "live" ? "活音 คำเป็น" : "死音 คำตาย"}
            </span>
          }
        />
        <DetailRow zh="罗马拼音" th="คำอ่าน" value={romanized} />
        <ExpandableDetailRow
          key={syllable}
          zh="中文意思"
          th="ความหมาย"
          value={
            meaning ? (
              <span className="font-semibold text-foreground">{meaning}</span>
            ) : (
              <div className="text-xs text-muted-foreground">
                可以发音，但不是常用或具有明确含义的泰语词。
                <br />
                <span className="font-thai">
                  สามารถออกเสียงได้ แต่ไม่ใช่คำศัพท์ที่ใช้ทั่วไป
                </span>
              </div>
            )
          }
        />
      </Card>

      {/* Selectors */}
      <p className="text-center text-xs text-muted-foreground">
        顺序 / ลำดับ:{" "}
        <span className="font-medium text-foreground">
          起始辅音 + 元音 + 韵尾（可选）+ 声调
        </span>
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <CollapsibleSelector
          title="① 辅音 / พยัญชนะต้น"
          colorVar="--consonant"
          defaultOpen
        >
          <SelectorGrid
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
        </CollapsibleSelector>
        <CollapsibleSelector
          title="② 元音 / สระ"
          colorVar="--vowel"
          defaultOpen
        >
          <SelectorGrid
            items={VOWELS.map((v, i) => ({
              key: i,
              label: v.form,
              sub: v.zhName,
            }))}
            selected={vIdx}
            onSelect={setVIdx}
          />
        </CollapsibleSelector>
        <CollapsibleSelector
          title="③ 韵尾 / ตัวสะกด（可选）"
          colorVar="--final"
          defaultOpen
        >
          <FinalSelector selected={fKey} onSelect={setFKey} />
        </CollapsibleSelector>
        <CollapsibleSelector title="④ 声调 / วรรณยุกต์" colorVar="--tone" defaultOpen>
          <SelectorGrid
            items={TONES.map((t, i) => ({
              key: i,
              label: t.symbol ? `ก${t.symbol}` : "ก",
              sub: `${t.zhName} ${t.arrow}`,
            }))}
            selected={tIdx}
            onSelect={setTIdx}
          />
        </CollapsibleSelector>
      </div>
    </div>
  );
}

function DetailRow({
  zh,
  th,
  value,
}: {
  zh: string;
  th: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium">{zh}</div>
        <div className="font-thai text-xs text-muted-foreground">{th}</div>
      </div>
      <div className="text-right text-sm">{value}</div>
    </div>
  );
}

function ExpandableDetailRow({
  zh,
  th,
  value,
}: {
  zh: string;
  th: string;
  value: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium">{zh}</div>
        <div className="font-thai text-xs text-muted-foreground">{th}</div>
      </div>
      <div className="text-right text-sm">
        <div
          className={`leading-[1.4] transition-all duration-300 ${
            expanded ? "" : "overflow-hidden"
          }`}
          style={
            expanded
              ? undefined
              : {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }
          }
        >
          {value}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{expanded ? "收起 ↑" : "展开 ↓"}</span>
          <span className="opacity-60">/</span>
          <span className="font-thai">
            {expanded ? "ย่อข้อความ" : "ดูเพิ่มเติม"}
          </span>
        </button>
      </div>
    </div>
  );
}

function CollapsibleSelector({
  title,
  colorVar,
  defaultOpen,
  children,
}: {
  title: string;
  colorVar: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <Card className="flex flex-col gap-3 p-4 shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between text-left text-sm font-semibold"
        style={{ color: `var(${colorVar})` }}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children}
    </Card>
  );
}

interface Item {
  key: number;
  label: string;
  sub: string;
  cls?: "mid" | "high" | "low";
}

function SelectorGrid({
  items,
  selected,
  onSelect,
  coded,
}: {
  items: Item[];
  selected: number;
  onSelect: (i: number) => void;
  coded?: boolean;
}) {
  return (
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
  );
}

function FinalSelector({
  selected,
  onSelect,
}: {
  selected: FinalKey;
  onSelect: (k: FinalKey) => void;
}) {
  const items: { key: FinalKey; label: string; sub: string }[] = [
    { key: "none", label: "—", sub: "无韵尾" },
    ...PRIMARY_FINAL_CONSONANTS.map((f) => ({
      key: f.key,
      label: f.char,
      sub: f.label,
    })),
  ];
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {items.map((it) => {
        const active = it.key === selected;
        return (
          <button
            key={it.key}
            onClick={() => onSelect(it.key)}
            className={`font-thai flex flex-col items-center rounded-md border p-2 text-lg transition-colors ${
              active
                ? "border-[color:var(--final)] bg-[color:var(--final)]/10 ring-2 ring-[color:var(--final)]"
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
  );
}