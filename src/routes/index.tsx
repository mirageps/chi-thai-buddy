import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Blocks, GraduationCap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { CONSONANTS, VOWELS, TONES, classLabel } from "@/data/thai";
import { FINALS } from "@/data/finals";

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

const MID = CONSONANTS.filter((c) => c.cls === "mid");
const HIGH = CONSONANTS.filter((c) => c.cls === "high");
const LOW = CONSONANTS.filter((c) => c.cls === "low");

const DIPH = VOWELS.filter((v) => v.zhName.startsWith("复合"));
const SHORT_V = VOWELS.filter((v) => v.length === "short" && !v.zhName.startsWith("复合"));
const LONG_V = VOWELS.filter((v) => v.length === "long" && !v.zhName.startsWith("复合"));

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
          {[
            { list: MID, cls: "mid" as const },
            { list: HIGH, cls: "high" as const },
            { list: LOW, cls: "low" as const },
          ].map(({ list, cls }) => {
            const lbl = classLabel(cls);
            return (
              <div key={cls} className="mb-3 last:mb-0">
                <div className="mb-1.5 flex items-baseline gap-2 text-xs">
                  <span className="font-semibold">{lbl.zh}</span>
                  <span className="font-thai text-muted-foreground">{lbl.th}</span>
                  <span className="text-muted-foreground">· {list.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {list.map((c) => (
                    <span
                      key={c.char}
                      title={`${c.name} · ${c.zhMeaning}`}
                      className="font-thai grid h-9 w-9 place-items-center rounded-lg border text-lg leading-[1.4]"
                      style={{
                        color: "var(--consonant)",
                        backgroundColor:
                          "color-mix(in oklab, var(--consonant) 8%, var(--card))",
                        borderColor:
                          "color-mix(in oklab, var(--consonant) 30%, var(--border))",
                      }}
                    >
                      {c.char}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </Section>

        {/* Vowels */}
        <Section id="vowels" th="สระไทย" zh="泰语元音" colorVar="--vowel" cat="vowels">
          {[
            { title: "短元音", th: "สระเสียงสั้น", list: SHORT_V },
            { title: "长元音", th: "สระเสียงยาว", list: LONG_V },
            { title: "复合元音", th: "สระประสม", list: DIPH },
          ].map((g) => (
            <div key={g.title} className="mb-3 last:mb-0">
              <div className="mb-1.5 flex items-baseline gap-2 text-xs">
                <span className="font-semibold">{g.title}</span>
                <span className="font-thai text-muted-foreground">{g.th}</span>
                <span className="text-muted-foreground">· {g.list.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.list.map((v) => (
                  <span
                    key={v.form + v.romanized}
                    title={`${v.zhName} · ${v.zhSound}`}
                    className="font-thai rounded-lg border px-2 py-1 text-base leading-[1.5]"
                    style={{
                      color: "var(--vowel)",
                      backgroundColor: "color-mix(in oklab, var(--vowel) 8%, var(--card))",
                      borderColor: "color-mix(in oklab, var(--vowel) 30%, var(--border))",
                    }}
                  >
                    {v.form}
                  </span>
                ))}
              </div>
            </div>
          ))}
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
                  style={{ color: "var(--tone)" }}
                >
                  {t.mark}
                </span>
                <span className="font-semibold">{t.zhName}</span>
                <span className="font-thai text-muted-foreground">{t.name}</span>
                <span className="ml-auto" style={{ color: "var(--tone)" }}>
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