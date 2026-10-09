import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Blocks, PencilLine, BookMarked, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CONSONANTS, VOWELS, TONES } from "@/data/thai";
import { FINALS } from "@/data/finals";
import { useVocabStore } from "@/lib/vocab-store";

const TITLE = "学泰语 · 首页 | เรียนภาษาไทย";
const DESC = "为中文学习者设计的泰语学习首页：学习进度、辅音、元音、韵尾、声调与背单词入口。";

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
  { cat: "consonants", th: "พยัญชนะ", zh: "辅音", n: CONSONANTS.length, colorVar: "--consonant" },
  { cat: "vowels", th: "สระ", zh: "元音", n: VOWELS.length, colorVar: "--vowel" },
  { cat: "finals", th: "ตัวสะกด", zh: "韵尾", n: FINALS.length, colorVar: "--final" },
  { cat: "tones", th: "วรรณยุกต์", zh: "声调", n: TONES.length, colorVar: "--tone" },
] as const;

const LEVELS = [
  { min: 0, zh: "入门", th: "เริ่มต้น" },
  { min: 10, zh: "初级", th: "ระดับต้น" },
  { min: 30, zh: "中级", th: "ระดับกลาง" },
  { min: 60, zh: "高级", th: "ระดับสูง" },
];

const ACTIONS = [
  { to: "/learn", zh: "继续学习", th: "เรียนต่อ", icon: Play, primary: true },
  { to: "/vocab", zh: "背单词", th: "จำคำศัพท์", icon: BookMarked },
  { to: "/learn/pinyin", zh: "拼音节", th: "ประสมพยางค์", icon: Blocks },
  { to: "/learn/practice", zh: "练习", th: "แบบฝึกหัด", icon: PencilLine },
] as const;

function HomePage() {
  const { words, progress } = useVocabStore();
  const mastered = words.filter((w) => progress[w.id]?.mastered).length;
  const reviewed = words.filter((w) => (progress[w.id]?.reviews ?? 0) > 0).length;
  const total = words.length;
  const levelIdx = LEVELS.reduce((acc, l, i) => (mastered >= l.min ? i : acc), 0);
  const level = LEVELS[levelIdx];
  const next = LEVELS[levelIdx + 1];
  const pct = next
    ? Math.round(((mastered - level.min) / (next.min - level.min)) * 100)
    : 100;

  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-2xl font-bold sm:text-3xl">
            学泰语 <span className="font-thai">เรียนภาษาไทย</span>
          </h1>
          <p className="text-sm opacity-90">
            每天进步一点点 · <span className="font-thai text-xs opacity-80">ก้าวหน้าทีละนิดทุกวัน</span>
          </p>
        </>
      }
    >
      {/* Progress */}
      <section className="mb-5 rounded-2xl border bg-card p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">
            学习进度 <span className="font-thai text-xs font-normal text-muted-foreground">ความคืบหน้า</span>
          </h2>
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary">
            {level.zh} <span className="font-thai font-normal">{level.th}</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat value={mastered} zh="已掌握" th="จำได้แล้ว" />
          <Stat value={reviewed} zh="已复习" th="ทบทวนแล้ว" />
          <Stat value={total} zh="词库" th="คำทั้งหมด" />
        </div>
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {next
              ? `再掌握 ${next.min - mastered} 个单词升至「${next.zh}」`
              : "已达到最高级别 🎉"}
            {next && <span className="font-thai"> · อีก {next.min - mastered} คำ ถึง{next.th}</span>}
          </p>
        </div>
      </section>

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-2 gap-2.5">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          const isPrimary = "primary" in a && a.primary;
          return (
            <Link
              key={a.to}
              to={a.to}
              className={`flex min-h-[56px] items-center gap-2.5 rounded-xl border px-3 transition-colors ${
                isPrimary ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isPrimary ? "" : "text-primary"}`} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{a.zh}</span>
                <span className="font-thai block text-[11px] opacity-75">{a.th}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Category summary */}
      <h2 className="mb-2 text-sm font-semibold">
        字母体系 <span className="font-thai text-xs font-normal text-muted-foreground">ระบบตัวอักษร</span>
      </h2>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {SUMMARY.map((s) => (
          <Link
            key={s.cat}
            to="/learn"
            search={{ cat: s.cat }}
            className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted"
            style={{ borderLeft: `3px solid var(${s.colorVar})` }}
          >
            <span className="text-2xl font-bold tabular-nums" style={{ color: `var(${s.colorVar})` }}>
              {s.n}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{s.zh}</span>
              <span className="font-thai block text-xs text-muted-foreground">{s.th}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        <span className="font-thai">ขอให้เรียนสนุก</span> · 学习愉快
      </footer>
    </AppLayout>
  );
}

function Stat({ value, zh, th }: { value: number; zh: string; th: string }) {
  return (
    <div className="rounded-xl bg-muted/50 py-2">
      <div className="text-xl font-bold tabular-nums">{value}</div>
      <div className="text-[11px] font-medium">{zh}</div>
      <div className="font-thai text-[10px] text-muted-foreground">{th}</div>
    </div>
  );
}
