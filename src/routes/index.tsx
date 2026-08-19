import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Blocks, GraduationCap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { CONSONANTS, VOWELS, TONES } from "@/data/thai";
import { FINALS } from "@/data/finals";
import {
  homeConsonants,
  homeVowels,
  vowelKind,
  VOWEL_KIND_LABEL,
  CLASS_LEGEND,
} from "@/lib/home-order";

const TITLE = "学泰语 · 泰语字母总览 | เรียนภาษาไทย";
const DESC =
  "泰语字母总览：44 个辅音、元音、8 个韵尾类别与 5 个声调一页速查，为中文学习者设计。";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const SUMMARY = [
  {
    cat: "consonants",
    th: "พยัญชนะไทย",
    zh: "泰语辅音",
    stat: `${CONSONANTS.length} 个`,
    desc: "中 / 高 / 低三类",
    colorVar: "--consonant",
    anchor: "#consonants",
  },
  {
    cat: "vowels",
    th: "สระไทย",
    zh: "泰语元音",
    stat: `${VOWELS.length} 个形式`,
    desc: "短 / 长 / 复合元音",
    colorVar: "--vowel",
    anchor: "#vowels",
  },
  {
    cat: "finals",
    th: "ตัวสะกด",
    zh: "韵尾辅音",
    stat: "8 类 + แม่ ก กา",
    desc: "8 个韵尾类别与无韵尾",
    colorVar: "--final",
    anchor: "#finals",
  },
  {
    cat: "tones",
    th: "วรรณยุกต์",
    zh: "泰语声调",
    stat: "5 声 / 4 符号",
    desc: "声调与声调符号不同",
    colorVar: "--tone",
    anchor: "#tones",
  },
] as const;

function HomePage() {
  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-3xl font-bold sm:text-4xl">
            学泰语 <span className="font-thai">เรียนภาษาไทย</span>
          </h1>
          <p className="text-lg font-semibold opacity-95">泰语字母总览</p>
          <p className="max-w-2xl text-sm opacity-90">
            一页速览泰语辅音、元音、韵尾与声调体系。
            <br className="hidden sm:block" />
            <span className="font-thai text-xs opacity-80">
              ภาพรวมพยัญชนะ สระ ตัวสะกด และวรรณยุกต์ในหน้าเดียว
            </span>
          </p>
        </>
      }
    >
      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link to="/learn" search={{ cat: "consonants" }}>
            <Play className="mr-1.5 h-4 w-4" />
            继续学习 <span className="font-thai ml-1 text-xs opacity-80">เรียนต่อ</span>
          </Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link to="/learn" search={{}}>
            <GraduationCap className="mr-1.5 h-4 w-4" />
            开始学习 <span className="font-thai ml-1 text-xs opacity-80">เริ่มเรียน</span>
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/learn/pinyin">
            <Blocks className="mr-1.5 h-4 w-4" />
            拼音节 <span className="font-thai ml-1 text-xs opacity-80">ประสมพยางค์</span>
          </Link>
        </Button>
      </div>

      {/* Compact summary grid */}
      <div className="mb-8 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {SUMMARY.map((s) => (
          <a
            key={s.cat}
            href={s.anchor}
            className="rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            style={{
              backgroundColor: `color-mix(in oklab, var(${s.colorVar}) 6%, var(--card))`,
              borderColor: `color-mix(in oklab, var(${s.colorVar}) 35%, var(--border))`,
            }}
          >
            <div
              className="font-thai text-base font-semibold leading-[1.5]"
              style={{ color: `var(${s.colorVar})` }}
            >
              {s.th}
            </div>
            <div className="text-sm font-semibold">{s.zh}</div>
            <div className="mt-1 text-xs font-medium" style={{ color: `var(${s.colorVar})` }}>
              {s.stat}
            </div>
            <p className="text-[11px] text-muted-foreground">{s.desc}</p>
          </a>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Consonants */}
        <Section
          id="consonants"
          th="พยัญชนะไทย"
          zh={`泰语辅音 ${CONSONANTS.length} 个`}
          colorVar="--consonant"
          cat="consonants"
          className="lg:col-span-2"
        >
          {/* Legend: class is secondary metadata, not the grouping */}
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span>按 ก–ฮ 顺序 · <span className="font-thai">เรียงตาม ก–ฮ</span></span>
            {CLASS_LEGEND.map((l) => (
              <span key={l.cls} className="flex items-center gap-1">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: `var(--class-${l.cls})` }}
                />
                <span className="text-foreground">{l.zh}</span>
                <span className="font-thai">{l.th}</span>
              </span>
            ))}
          </div>
          {/* Pinyin-approximation disclaimer for the initial-sound labels */}
          <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground">
            发音标注参考汉语拼音，帮助初学者快速辨认，不代表完全相同的发音。
            <br />
            <span className="font-thai">
              สัญลักษณ์เสียงอ้างอิงจากพินอินเพื่อช่วยให้ผู้เริ่มต้นจดจำ ไม่ได้หมายความว่าออกเสียงเหมือนกันทั้งหมด
            </span>
          </p>
          <ol className="grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-11">
            {homeConsonants.map((c) => (
              <li key={c.char}>
                <div
                  title={`${c.name} · ${c.zhMeaning}`}
                  aria-label={`${c.char} ${c.name} · ${c.initialSound} · ${c.zhMeaning} · ${
                    c.cls === "mid" ? "中辅音 อักษรกลาง" : c.cls === "high" ? "高辅音 อักษรสูง" : "低辅音 อักษรต่ำ"
                  }`}
                  className="flex min-h-[48px] flex-col items-center justify-center rounded-lg border bg-card px-1 pb-1 pt-1.5"
                  style={{
                    backgroundColor: `var(--class-${c.cls})`,
                    borderColor: `color-mix(in oklab, var(--class-${c.cls}) 86%, #000)`,
                  }}
                >
                  <span
                    className="font-thai text-lg leading-[1.4]"
                    style={{ color: "var(--class-ink)" }}
                  >
                    {c.char}
                  </span>
                  <span className="mt-0.5 flex w-full items-center justify-center gap-1 leading-[1.4]">
                    {/* initial consonant sound only (finals differ; shown in 韵尾 lesson) */}
                    <span
                      className="text-[9px] font-medium italic"
                      style={{ color: "color-mix(in oklab, var(--class-ink) 65%, transparent)" }}
                    >
                      {c.initialSound}
                    </span>
                    <span
                      className="rounded px-1 text-[9px] font-semibold"
                      style={{
                        color: "var(--class-ink)",
                        backgroundColor: `color-mix(in oklab, var(--class-${c.cls}) 55%, var(--card))`,
                      }}
                    >
                      {c.cls === "mid" ? "中" : c.cls === "high" ? "高" : "低"}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Vowels */}
        <Section id="vowels" th="สระไทย" zh="泰语元音" colorVar="--vowel" cat="vowels">
          {/* Legend: length/type is secondary metadata; order follows the lesson order */}
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span>按课程顺序 · <span className="font-thai">เรียงตามบทเรียน</span></span>
            {(["short", "long", "diph"] as const).map((k) => {
              const l = VOWEL_KIND_LABEL[k];
              return (
                <span key={k} className="flex items-center gap-1">
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: `var(${l.colorVar})` }}
                  />
                  <span className="text-foreground">{l.zh}</span>
                  <span className="font-thai">{l.th}</span>
                </span>
              );
            })}
          </div>
          <ol className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {homeVowels.map((v) => {
              const k = vowelKind(v);
              const l = VOWEL_KIND_LABEL[k];
              return (
                <li key={v.form + v.romanized}>
                  <div
                    title={`${v.zhName} · ${v.zhSound}`}
                    aria-label={`${v.form} ${v.zhName} · ${l.zh}`}
                    className="flex min-h-[44px] flex-col items-center justify-center rounded-lg border bg-card px-1 pb-1 pt-1.5"
                    style={{
                      backgroundColor: `var(${l.colorVar})`,
                      borderColor: `color-mix(in oklab, var(${l.colorVar}) 86%, #000)`,
                    }}
                  >
                    <span
                      className="font-thai text-base leading-[1.6]"
                      style={{ color: "var(--class-ink)" }}
                    >
                      {v.form}
                    </span>
                    <span
                      className="mt-0.5 rounded px-1 text-[9px] font-semibold leading-[1.4]"
                      style={{
                        color: "var(--class-ink)",
                        backgroundColor: `color-mix(in oklab, var(${l.colorVar}) 55%, var(--card))`,
                      }}
                    >
                      {k === "short" ? "短" : k === "long" ? "长" : "复"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* Finals */}
        <Section id="finals" th="ตัวสะกด" zh="韵尾辅音" colorVar="--final" cat="finals">
          <ul className="space-y-1.5">
            {FINALS.map((f) => (
              <li
                key={f.key}
                className="flex items-baseline gap-2 rounded-lg border p-2 text-xs"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--final) 6%, var(--card))",
                  borderColor: "color-mix(in oklab, var(--final) 25%, var(--border))",
                }}
              >
                <span
                  className="font-thai min-w-[5.5rem] text-sm font-semibold leading-[1.5]"
                  style={{ color: "var(--final)" }}
                >
                  {f.thName}
                </span>
                <span className="font-medium">{f.zhName}</span>
                <span className="text-muted-foreground">{f.ipa ?? f.short}</span>
                <span className="font-thai ml-auto text-sm leading-[1.5]">
                  {f.consonants.length ? f.consonants.join(" ") : "—"}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Tones */}
        <Section
          id="tones"
          th="วรรณยุกต์"
          zh="泰语声调"
          colorVar="--tone"
          cat="tones"
          className="lg:col-span-2"
        >
          <p className="mb-2 text-xs text-muted-foreground">
            注意：<strong className="text-foreground">声调符号（4 个）</strong>
            与<strong className="text-foreground">声调（5 个）</strong>
            不是一一对应。没有声调符号时，实际声调由辅音类别、元音长短与韵尾共同决定，
            <strong className="text-foreground">并不一定是平声</strong>。
          </p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {TONES.map((t) => (
              <div
                key={t.zhName}
                className="flex items-baseline gap-2 rounded-lg border p-2 text-xs"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--tone) 6%, var(--card))",
                  borderColor: "color-mix(in oklab, var(--tone) 25%, var(--border))",
                }}
              >
                <span
                  className="font-thai min-w-8 text-lg leading-[1.5]"
                  style={{ color: "var(--foreground)" }}
                >
                  {t.mark}
                </span>
                <span className="font-semibold">{t.zhName}</span>
                <span className="font-thai text-muted-foreground">{t.name}</span>
                <span className="ml-auto" style={{ color: "var(--text-secondary)" }}>
                  {t.arrow}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            声调符号 / รูปวรรณยุกต์：
            <span className="font-thai">◌่ ◌้ ◌๊ ◌๋</span> 共 4 个（ไม้เอก / ไม้โท / ไม้ตรี /
            ไม้จัตวา）。
          </p>
        </Section>
      </div>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        <span className="font-thai">ขอให้เรียนสนุก</span> · 学习愉快 🌸
      </footer>
    </AppLayout>
  );
}

function Section({
  id,
  th,
  zh,
  colorVar,
  cat,
  className,
  children,
}: {
  id: string;
  th: string;
  zh: string;
  colorVar: string;
  cat: "consonants" | "vowels" | "finals" | "tones";
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section
      id={id}
      className={`scroll-mt-4 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">
          {zh}{" "}
          <span className="font-thai text-sm font-normal" style={{ color: `var(${colorVar})` }}>
            {th}
          </span>
        </h2>
        <div className="flex items-center gap-1">
          <Button asChild size="sm" variant="ghost" className="text-xs">
            <Link to="/learn" search={{ cat }}>
              学习
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="text-xs"
          >
            {open ? (
              <>
                收起 <ChevronUp className="ml-1 h-3.5 w-3.5" />
              </>
            ) : (
              <>
                展开 <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
      {open && <div className="mt-3">{children}</div>}
    </section>
  );
}