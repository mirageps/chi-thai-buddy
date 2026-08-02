import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Flashcard } from "@/components/learn/Flashcard";
import { Quiz } from "@/components/learn/Quiz";
import { MixedReview } from "@/components/learn/MixedReview";
import { CategoryOverview } from "@/components/learn/CategoryOverview";
import { AppLayout } from "@/components/layout/AppLayout";
import { LearningCategoryCard } from "@/components/layout/LearningCategoryCard";
import { useEdgeSwipeBack } from "@/hooks/useEdgeSwipeBack";
import { BookOpen, Brain, Shuffle, ChevronLeft, ChevronsUpDown, LayoutList, Blocks, Check } from "lucide-react";

type Category = "consonants" | "vowels" | "finals" | "tones";
type LearningMode = "overview" | "flashcard" | "quiz" | "review";

const CATEGORIES: {
  key: Category;
  th: string;
  zh: string;
  desc: string;
  colorVar: string;
}[] = [
  { key: "consonants", th: "พยัญชนะ ก–ฮ", zh: "泰语辅音", desc: "44 个辅音，按中/高/低三类颜色编码，帮助记忆声调规则。", colorVar: "--consonant" },
  { key: "vowels", th: "สระ", zh: "泰语元音", desc: "短元音与长元音、复合元音，附中文近似发音提示。", colorVar: "--vowel" },
  { key: "finals", th: "ตัวสะกด", zh: "韵尾辅音", desc: "学习 8 个韵尾音，了解不同辅音位于音节末尾时的实际发音。", colorVar: "--final" },
  { key: "tones", th: "วรรณยุกต์", zh: "泰语声调", desc: "五个声调（平/低/降/高/升），用箭头图示帮助识别调型。", colorVar: "--tone" },
];

const MODES: { key: LearningMode; zh: string; th: string; icon: typeof BookOpen }[] = [
  { key: "overview", zh: "总览", th: "ภาพรวม", icon: LayoutList },
  { key: "flashcard", zh: "闪卡", th: "แฟลชการ์ด", icon: BookOpen },
  { key: "quiz", zh: "测验", th: "แบบทดสอบ", icon: Brain },
  { key: "review", zh: "随机复习", th: "ทบทวนแบบสุ่ม", icon: Shuffle },
];

const VALID_CATS: Category[] = ["consonants", "vowels", "finals", "tones"];

const TITLE = "学习泰语字母 · 闪卡与测验 | 学泰语";
const DESC = "选择泰语辅音、元音、声调或韵尾，进入总览、闪卡、测验与随机复习练习。";

export const Route = createFileRoute("/learn/")({
  validateSearch: (raw: Record<string, unknown>): { cat?: Category } => ({
    cat: VALID_CATS.includes(raw.cat as Category) ? (raw.cat as Category) : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/learn" });

  // studyView is derived from `cat` (also drives the global 3-state navigation).
  const studyView: "categories" | "lesson" = cat ? "lesson" : "categories";

  const [learningMode, setLearningMode] = useState<LearningMode>("overview");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const lessonRef = useRef<HTMLDivElement>(null);
  const switcherBtnRef = useRef<HTMLButtonElement>(null);
  const enteredRef = useRef<Category | null>(null);
  const keepScrollRef = useRef<number | null>(null);
  const preOpenScrollRef = useRef<number | null>(null);

  const enterCategory = (next: Category) => {
    setLearningMode("overview");
    navigate({ search: { cat: next } });
  };

  const backToCategories = useCallback(() => {
    enteredRef.current = null;
    navigate({ search: {} });
  }, [navigate]);

  // Switch category INSIDE the lesson: keep learningMode, keep scroll position.
  const switchCategory = (next: Category) => {
    // The trigger click can scroll the header into view; use the pre-open offset.
    const y = preOpenScrollRef.current ?? window.scrollY;
    preOpenScrollRef.current = null;
    setSwitcherOpen(false);
    switcherBtnRef.current?.focus({ preventScroll: true });
    if (next === cat) return;
    enteredRef.current = next; // prevents the "first entry" scroll
    keepScrollRef.current = y;
    navigate({ search: { cat: next }, resetScroll: false });
  };

  // Scroll to the lesson only on the FIRST entry into a lesson, never on mode change.
  useEffect(() => {
    if (!cat) return;
    if (enteredRef.current === cat) return;
    const first = enteredRef.current === null;
    enteredRef.current = cat;
    if (first) {
      lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [cat]);

  // Switching category must not jump the page: restore the previous offset.
  useEffect(() => {
    const y = keepScrollRef.current;
    if (y === null) return;
    keepScrollRef.current = null;
    const restore = () => window.scrollTo({ top: y });
    requestAnimationFrame(restore);
    const timers = [50, 200].map((d) => window.setTimeout(restore, d));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [cat]);

  useEdgeSwipeBack(studyView === "lesson", backToCategories, { edge: 28, threshold: 80 });

  if (studyView === "categories") {
    return (
      <AppLayout
        hero={
          <>
            <h1 className="text-2xl font-bold sm:text-3xl">
              学习 <span className="font-thai text-lg opacity-90">เรียน</span>
            </h1>
            <p className="text-sm opacity-90">
              请选择学习类别 ·{" "}
              <span className="font-thai text-xs opacity-80">เลือกหมวดหมู่ที่ต้องการเรียน</span>
            </p>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => enterCategory(c.key)}
              aria-label={`${c.zh} / ${c.th}`}
              className="block min-h-[44px] text-left"
            >
              <LearningCategoryCard th={c.th} zh={c.zh} desc={c.desc} colorVar={c.colorVar} />
            </button>
          ))}
          <Link
            to="/learn/pinyin"
            aria-label="拼音节 / ประสมพยางค์"
            className="col-span-2 block min-h-[44px] text-left lg:col-span-4"
          >
            <LearningCategoryCard
              th="ประสมพยางค์"
              zh="拼音节"
              desc="选择辅音 + 元音 + 韵尾 + 声调，实时拼出泰语音节。"
              colorVar="--primary"
              emphasis
            />
          </Link>
        </div>
      </AppLayout>
    );
  }

  const current = CATEGORIES.find((c) => c.key === cat)!;
  const activeMode = MODES.find((m) => m.key === learningMode)!;

  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-xl font-bold sm:text-2xl">
            {current.zh} <span className="font-thai text-base opacity-90">{current.th}</span>
          </h1>
          <p className="text-xs opacity-90">
            当前模式 · {activeMode.zh}{" "}
            <span className="font-thai opacity-80">{activeMode.th}</span>
          </p>
        </>
      }
    >
      <div ref={lessonRef} className="scroll-mt-4">
        {/* Compact lesson header */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={backToCategories}
            aria-label="返回分类 / กลับหน้าเลือกหมวดหมู่"
            className="min-h-[44px]"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            返回分类
          </Button>
          <div className="min-w-0 flex-1 truncate text-sm">
            <span className="font-semibold">{current.zh}</span>{" "}
            <span className="font-thai text-muted-foreground">{current.th}</span>
          </div>
          <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={switcherBtnRef}
                variant="secondary"
                size="sm"
                onPointerDownCapture={() => {
                  preOpenScrollRef.current = window.scrollY;
                }}
                aria-label="切换分类 / เปลี่ยนหมวดหมู่"
                className="min-h-[44px]"
              >
                <ChevronsUpDown className="mr-1 h-4 w-4" />
                切换分类
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-56 p-1.5"
              role="menu"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              {CATEGORIES.map((c) => {
                const active = c.key === cat;
                return (
                  <button
                    key={c.key}
                    type="button"
                    role="menuitem"
                    aria-current={active ? "true" : undefined}
                    onClick={() => switchCategory(c.key)}
                    className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                      active ? "bg-primary/10 font-semibold text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <span className="flex-1">
                      {c.zh} <span className="font-thai text-xs opacity-70">{c.th}</span>
                    </span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
              <Link
                to="/learn/pinyin"
                className="mt-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-muted"
              >
                <Blocks className="h-4 w-4" />
                拼音节 <span className="font-thai text-xs opacity-70">ประสมพยางค์</span>
              </Link>
            </PopoverContent>
          </Popover>
        </div>

        {/* Learning mode tabs (local state only -> no route change, no scroll jump) */}
        <div
          role="tablist"
          aria-label="学习模式 / โหมดการเรียน"
          className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {MODES.map((m) => {
            const active = m.key === learningMode;
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setLearningMode(m.key)}
                className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {m.zh}
              </button>
            );
          })}
        </div>

        <div className="mx-auto max-w-3xl">
          {learningMode === "overview" && (
            <ModeShell title="总览 / ภาพรวม" hint="先浏览全部字母与说明，再进入练习。">
              <CategoryOverview cat={cat!} />
            </ModeShell>
          )}
          {learningMode === "flashcard" && (
            <ModeShell title="闪卡学习 / แฟลชการ์ด" hint="点击卡片翻面，查看中文含义与发音提示。">
              <Flashcard mode={cat!} />
            </ModeShell>
          )}
          {learningMode === "quiz" && (
            <ModeShell title="随机测验 / แบบทดสอบ" hint="系统随机出题，从四个选项中选出正确的中文含义。">
              <Quiz mode={cat!} />
            </ModeShell>
          )}
          {learningMode === "review" && (
            <ModeShell title="随机复习 / ทบทวนแบบสุ่ม" hint="混合辅音、元音、声调随机出题，配合发音训练听辨能力。">
              <MixedReview />
            </ModeShell>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function ModeShell({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-5 text-center">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{hint}</p>
      </div>
      {children}
    </Card>
  );
}
