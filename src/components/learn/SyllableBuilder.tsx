import { useEffect, useMemo, useState } from "react";
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
} from "@/data/finals";
import { speakThai } from "@/lib/speech";
import { useSpeechSupported } from "@/hooks/useSpeechSupported";
import {
  composeThaiSyllable,
  vowelPatternByIndex,
  toneShapeOf,
  toneMarkFromIndex,
} from "@/lib/syllable";

/** Chip on the syllable preview card: tinted from the card family, dark-grey ink. */
const CHIP_STYLE: React.CSSProperties = {
  backgroundColor: "color-mix(in oklab, var(--fc-syllable-from) 65%, #fff)",
  borderColor: "color-mix(in oklab, var(--fc-syllable-to) 87%, #000)",
  color: "var(--fc-text-secondary)",
};

export function SyllableBuilder() {
  const [cIdx, setCIdx] = useState(0); // ก
  const [vIdx, setVIdx] = useState(1); // า
  const [finalChar, setFinalChar] = useState<string | null>(null);
  const [tIdx, setTIdx] = useState(0); // no tone
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const speechSupported = useSpeechSupported();
  // Compact state depends on scroll POSITION with hysteresis (not direction),
  // so small finger movements while picking options cannot flip it back and forth.
  const [compactPreview, setCompactPreview] = useState(false);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setCompactPreview((prev) => (prev ? y > 90 : y > 200));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const consonant = CONSONANTS[cIdx];
  const vowel = VOWELS[vIdx];
  const vowelPattern = vowelPatternByIndex(vIdx);
  const vowelSupportsFinal = vowelPattern?.supportsFinal ?? false;
  // If the currently-selected vowel does not support a final, force finalChar = null
  // (do it in a memo so no extra state / effect is needed).
  const effectiveFinalChar = vowelSupportsFinal ? finalChar : null;
  const finalGroup = effectiveFinalChar
    ? finalGroupOf(effectiveFinalChar)
    : FINALS[0];
  const finalKey = finalGroup?.key ?? "none";

  const composed = useMemo(
    () =>
      composeThaiSyllable({
        initial: consonant.char,
        vowelIndex: vIdx,
        final: effectiveFinalChar,
        toneIndex: tIdx,
      }),
    [consonant.char, vIdx, effectiveFinalChar, tIdx],
  );
  const syllable = composed.text;
  const toneShape = toneShapeOf(toneMarkFromIndex(tIdx));

  // Lexical lookup only when composition is supported (never invent words)
  const meaning = composed.supported ? lookupVocab(syllable) : null;
  const liveDead = liveOrDead(finalKey, vowel.length);
  const romanized = composed.supported
    ? `${consonant.initialSound}${vowel.romanized}${
        finalGroup?.short && finalGroup.short !== "—"
          ? finalGroup.short.replace("-", "")
          : ""
      }`
    : "—";

  return (
    <div className="flex flex-col gap-6">
      {/* Preview */}
      <Card
        className={`sticky top-2 z-20 flex items-center border shadow-[var(--fc-shadow)] ${
          compactPreview
            ? "min-h-[68px] flex-row justify-center gap-3 px-4 py-2"
            : "flex-col gap-3 px-4 py-5 sm:p-8"
        }`}

        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--fc-syllable-from) 0%, var(--fc-syllable-to) 100%)",
          borderColor: "color-mix(in oklab, var(--fc-syllable-to) 87%, #000)",
          color: "var(--fc-text-secondary)",
        }}
      >
        {!compactPreview && (
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--fc-text-muted)" }}>
            你的音节 / พยางค์ของคุณ
          </p>
        )}
        <div
          className={`font-thai font-bold leading-[1.4] ${
            compactPreview ? "py-0 text-4xl" : "py-1 text-7xl sm:py-3 sm:text-8xl"
          }`}
          style={{ color: "var(--fc-text-primary)" }}
        >
          {syllable || "—"}
        </div>
        <Button
          size={compactPreview ? "icon" : "sm"}
          variant="secondary"
          onClick={() => speakThai(syllable)}
          disabled={!speechSupported}

          aria-label="播放发音 / ฟังเสียง"
          title="播放发音 / ฟังเสียง"
          className={compactPreview ? "h-10 w-10 shrink-0 rounded-full" : ""}
        >
          <Volume2 className={compactPreview ? "h-5 w-5" : "mr-1 h-4 w-4"} />
          {!compactPreview && "播放发音 / ฟังเสียง"}
        </Button>
        {!compactPreview && <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Badge variant="secondary" className="font-thai" style={CHIP_STYLE}>
            {consonant.char} · {consonant.zhSound}
          </Badge>
          <Badge variant="secondary" className="font-thai" style={CHIP_STYLE}>
            {vowel.form} · {vowel.zhSound}
          </Badge>
          {effectiveFinalChar && (
            <Badge variant="secondary" className="font-thai" style={CHIP_STYLE}>
              {effectiveFinalChar} · {finalGroup?.short}
            </Badge>
          )}
          <Badge variant="secondary" className="font-thai" style={CHIP_STYLE}>
            {toneShape.thLabel} · {toneShape.zhLabel}
          </Badge>
        </div>}
        {!compactPreview && !composed.supported && composed.warnings.length > 0 && (
          <div
            className="rounded-md px-3 py-2 text-center text-[11px] leading-relaxed"
            style={{
              backgroundColor: "color-mix(in oklab, var(--fc-syllable-from) 80%, #fff)",
              color: "var(--fc-text-secondary)",
            }}
          >
            {composed.warnings.map((w, i) => (
              <div key={i} className="font-thai">{w}</div>
            ))}
          </div>
        )}
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
            effectiveFinalChar ? (
              <span className="font-thai">
                {effectiveFinalChar}{" "}
                <span className="text-muted-foreground">
                  ({finalGroup?.short}
                  {finalGroup?.ipa ? ` · ${finalGroup.ipa}` : ""})
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
                {toneShape.symbol ? toneShape.symbol : "—"}
              </span>{" "}
              <span className="text-muted-foreground">
                ({toneShape.zhLabel} / {toneShape.thLabel})
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
                未收录为常用泰语词，请勿将其作为正式词汇记忆。
                <br />
                <span className="font-thai">
                  ยังไม่พบว่าเป็นคำไทยที่ใช้ทั่วไป
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
      <div className="flex flex-col gap-3">
        <CollapsibleSelector
          id="consonant"
          title="① 辅音 / พยัญชนะต้น"
          selected={<><span className="font-thai text-lg">{consonant.char}</span><span aria-hidden>✓</span></>}
          colorVar="--consonant"
          open={openSection === "consonant"}
          onToggle={() => setOpenSection((current) => current === "consonant" ? null : "consonant")}
        >
          <SelectorGrid
            items={CONSONANTS.map((c, i) => ({
              key: i,
              label: c.char,
              sub: classLabel(c.cls).zh,
              cls: c.cls,
            }))}
            selected={cIdx}
            onSelect={(index) => {
              setCIdx(index);
              setOpenSection(null);
            }}
            coded
          />
        </CollapsibleSelector>
        <CollapsibleSelector
          id="vowel"
          title="② 元音 / สระ"
          selected={<><span className="font-thai text-base">{vowel.form}</span><span aria-hidden>✓</span></>}
          colorVar="--vowel"
          open={openSection === "vowel"}
          onToggle={() => setOpenSection((current) => current === "vowel" ? null : "vowel")}
        >
          <VowelSelector
            selected={vIdx}
            onSelect={(index) => {
              setVIdx(index);
              setOpenSection(null);
            }}
          />
        </CollapsibleSelector>
        <CollapsibleSelector
          id="final"
          title="③ 韵尾 / ตัวสะกด（可选）"
          selected={effectiveFinalChar ? <><span className="font-thai text-base">{finalGroup?.thName} · {effectiveFinalChar}</span><span aria-hidden>✓</span></> : <span>无 / ไม่มี</span>}
          colorVar="--final"
          open={openSection === "final"}
          onToggle={() => setOpenSection((current) => current === "final" ? null : "final")}
        >
          <FinalSelector
            selected={effectiveFinalChar}
            onSelect={(char) => {
              setFinalChar(char);
              setOpenSection(null);
            }}
            disabled={!vowelSupportsFinal}
          />
        </CollapsibleSelector>
        <CollapsibleSelector
          id="tone"
          title="④ 声调 / วรรณยุกต์"
          selected={tIdx === 0 ? <span>无 / ไม่มี</span> : <><span className="font-thai text-xl">{TONES[tIdx].symbol}</span><span aria-hidden>✓</span></>}
          colorVar="--tone"
          open={openSection === "tone"}
          onToggle={() => setOpenSection((current) => current === "tone" ? null : "tone")}
        >
          <SelectorGrid
            items={TONES.map((t, i) => ({
              key: i,
              label: t.symbol ? `ก${t.symbol}` : "ก",
              sub: `${t.zhName} ${t.arrow}`,
            }))}
            selected={tIdx}
            onSelect={(index) => {
              setTIdx(index);
              setOpenSection(null);
            }}
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

type SectionId = "consonant" | "vowel" | "final" | "tone";

function CollapsibleSelector({
  id,
  title,
  selected,
  colorVar,
  open,
  onToggle,
  children,
}: {
  id: SectionId;
  title: string;
  selected: React.ReactNode;
  colorVar: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const triggerId = `${id}-selector-trigger`;
  const panelId = `${id}-selector-panel`;
  return (
    <Card className={`overflow-hidden shadow-[var(--shadow-card)] transition-colors ${open ? "border-current" : ""}`} style={open ? { color: `var(${colorVar})` } : undefined}>
      <Button
        id={triggerId}
        type="button"
        variant="ghost"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="grid min-h-12 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-none px-4 py-2 text-left hover:bg-muted/60"
        style={{ color: `var(${colorVar})` }}
      >
        <span className="min-w-0 truncate text-sm font-semibold">{title}</span>
        {!open && <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-foreground">{selected}</span>}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : "-rotate-90"}`}
        />
      </Button>
      {open && (
        <div id={panelId} role="region" aria-labelledby={triggerId} className="border-t border-border p-3 text-foreground sm:p-4">
          {children}
        </div>
      )}
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
    <ScrollArea className="h-72 sm:h-80">
      <div className="grid grid-cols-3 gap-2 pr-3 min-[380px]:grid-cols-4 sm:grid-cols-6">
          {items.map((it) => {
            const active = it.key === selected;
            let bg = "";
            if (coded && it.cls) {
              if (it.cls === "mid") bg = "border-l-4 border-l-[color:var(--class-mid)]";
              else if (it.cls === "high") bg = "border-l-4 border-l-[color:var(--class-high)]";
              else bg = "border-l-4 border-l-[color:var(--class-low)]";
            }
            return (
              <Button
                key={it.key}
                type="button"
                variant="outline"
                onClick={() => onSelect(it.key)}
                aria-pressed={active}
                aria-label={`${it.label}, ${it.sub}`}
                className={`font-thai h-auto min-h-14 whitespace-normal flex-col gap-0 rounded-md p-2 text-lg transition-colors ${bg} ${
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
              </Button>
            );
          })}
      </div>
    </ScrollArea>
  );
}

function VowelSelector({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  const groups = [
    { label: "短元音 / สระเสียงสั้น", indices: VOWELS.map((_, index) => index).filter((index) => index < 18 && VOWELS[index].length === "short") },
    { label: "长元音 / สระเสียงยาว", indices: VOWELS.map((_, index) => index).filter((index) => index < 18 && VOWELS[index].length === "long") },
    { label: "复合与特殊 / สระประสมและรูปพิเศษ", indices: VOWELS.map((_, index) => index).filter((index) => index >= 18) },
  ];

  return (
    <div className="flex max-h-[24rem] flex-col gap-4 overflow-y-auto pr-1">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground">{group.label}</h3>
          <div className="grid grid-cols-3 gap-2 min-[380px]:grid-cols-4 sm:grid-cols-6">
            {group.indices.map((index) => {
              const item = VOWELS[index];
              const active = selected === index;
              return (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  onClick={() => onSelect(index)}
                  aria-pressed={active}
                  aria-label={`${item.form}, ${item.zhName}`}
                  className={`font-thai h-auto min-h-14 whitespace-normal flex-col gap-0 rounded-md p-2 text-lg ${active ? "border-vowel bg-vowel/10 ring-2 ring-vowel" : "hover:bg-muted"}`}
                >
                  <span>{item.form}</span>
                  <span className="font-cn mt-1 text-[11px] leading-tight text-muted-foreground">{item.zhName}</span>
                </Button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function FinalSelector({
  selected,
  onSelect,
  disabled,
}: {
  selected: string | null;
  onSelect: (c: string | null) => void;
  disabled?: boolean;
}) {
  const primaryChars = new Set(PRIMARY_FINAL_CONSONANTS.map((p) => p.char));
  const groups = FINALS.filter((g) => g.key !== "none");
  return (
    <div className="flex flex-col gap-3">
      {disabled && (
        <div className="rounded-md border border-dashed border-border/60 bg-muted/40 p-2 text-[11px] leading-snug text-muted-foreground">
          <div>当前版本暂不支持在此元音后添加其他韵尾。</div>
          <div className="font-thai">
            เวอร์ชันปัจจุบันยังไม่รองรับการเพิ่มตัวสะกดหลังสระนี้
          </div>
        </div>
      )}
      {/* None option */}
      <Button
        type="button"
        variant="outline"
        onClick={() => onSelect(null)}
        disabled={disabled}
        aria-pressed={selected === null}
        className={`font-thai min-h-12 h-auto w-full justify-between whitespace-normal rounded-md p-3 text-left transition-colors ${
          selected === null
            ? "border-[color:var(--final)] bg-[color:var(--final)]/10 ring-2 ring-[color:var(--final)]"
            : "hover:bg-muted"
        } ${disabled ? "opacity-60" : ""}`}
        title="ไม่มีตัวสะกด / 无韵尾"
      >
        <span className="flex items-baseline gap-2">
          <span className="text-2xl">—</span>
          <span className="font-cn text-xs text-muted-foreground">
            แม่ ก กา / 无韵尾
          </span>
        </span>
        <span className="font-cn text-[10px] text-muted-foreground">
          ไม่มีตัวสะกด
        </span>
      </Button>

      <p className="font-cn text-[11px] leading-snug text-muted-foreground">
        按泰语韵尾类别选择音节末尾的辅音。不同字母在词尾可能有相同的发音。
        <br />
        <span className="font-thai">
          เลือกพยัญชนะท้ายพยางค์ตามมาตราตัวสะกด พยัญชนะที่เขียนต่างกันอาจออกเสียงท้ายเหมือนกัน
        </span>
      </p>

      {groups.map((g) => (
        <div
          key={g.key}
          className="rounded-md border border-border/60 p-2"
        >
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-1 px-1">
            <span className="font-thai text-sm font-semibold">
              {g.thName}{" "}
              <span className="font-cn text-xs font-normal text-muted-foreground">
                / {g.zhName}
              </span>
            </span>
            <span className="font-cn text-[10px] text-muted-foreground">
              {g.short} {g.ipa ?? ""}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {g.consonants.map((c) => {
              const active = selected === c;
              const isPrimary = primaryChars.has(c);
              return (
                <Button
                  key={c}
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(active ? null : c);
                  }}
                  aria-pressed={active}
                  className={`font-thai relative h-11 min-w-0 rounded-md p-2 text-lg transition-colors ${
                    active
                      ? "border-[color:var(--final)] bg-[color:var(--final)]/10 ring-2 ring-[color:var(--final)]"
                      : "hover:bg-muted"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={
                    isPrimary
                      ? `${c} · ${g.thName} · ${g.short} — 同组代表字 / ตัวสะกดตรงมาตรา`
                      : `${c} · ${g.thName} · ${g.short}`
                  }
                >
                  <span>{c}</span>
                  {isPrimary && (
                    <span
                      aria-hidden
                      className="absolute right-1 top-0.5 text-[9px] text-muted-foreground"
                    >
                      ·
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}