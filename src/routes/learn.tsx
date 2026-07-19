import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Flashcard } from "@/components/learn/Flashcard";
import { Quiz } from "@/components/learn/Quiz";
import { SyllableBuilder } from "@/components/learn/SyllableBuilder";
import { MixedReview } from "@/components/learn/MixedReview";
import { BookOpen, Brain, Blocks, Shuffle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LearningCategoryCard } from "@/components/layout/LearningCategoryCard";

type Category = "consonants" | "vowels" | "finals" | "tones";
type Mode = "flashcard" | "quiz" | "builder" | "review";

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

const VALID_CATS: Category[] = ["consonants", "vowels", "finals", "tones"];
const VALID_MODES: Mode[] = ["flashcard", "quiz", "builder", "review"];

export const Route = createFileRoute("/learn")({
  validateSearch: (raw: Record<string, unknown>): { cat: Category; mode: Mode } => {
    const cat = VALID_CATS.includes(raw.cat as Category) ? (raw.cat as Category) : "consonants";
    const mode = VALID_MODES.includes(raw.mode as Mode) ? (raw.mode as Mode) : "flashcard";
    return { cat, mode };
  },
  component: LearnPage,
});

function LearnPage() {
  const { cat, mode } = Route.useSearch();
  const navigate = useNavigate({ from: "/learn" });

  const setCat = (next: Category) =>
    navigate({ search: (prev) => ({ ...prev, cat: next }) });
  const setMode = (next: string) =>
    navigate({ search: (prev) => ({ ...prev, mode: next as Mode }) });

  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-2xl font-bold sm:text-3xl">
            学习 <span className="font-thai text-lg opacity-90">เรียน</span>
          </h1>
          <p className="text-sm opacity-90">选择学习类别与模式，开始练习。</p>
        </>
      }
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <button key={c.key} type="button" onClick={() => setCat(c.key)} className="block text-left">
            <LearningCategoryCard
              th={c.th}
              zh={c.zh}
              desc={c.desc}
              colorVar={c.colorVar}
              active={cat === c.key}
            />
          </button>
        ))}
      </div>

      <Tabs value={mode} onValueChange={setMode} className="w-full">
        <TabsList className="mx-auto grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="flashcard">
            <BookOpen className="mr-1.5 h-4 w-4" />
            闪卡
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Brain className="mr-1.5 h-4 w-4" />
            测验
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Blocks className="mr-1.5 h-4 w-4" />
            拼音节
          </TabsTrigger>
          <TabsTrigger value="review">
            <Shuffle className="mr-1.5 h-4 w-4" />
            随机复习
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="flashcard">
            <ModeShell title="闪卡学习 / แฟลชการ์ด" hint="点击卡片翻面，查看中文含义与发音提示。">
              <Flashcard mode={cat} />
            </ModeShell>
          </TabsContent>
          <TabsContent value="quiz">
            <ModeShell title="随机测验 / แบบทดสอบ" hint="系统随机出题，从四个选项中选出正确的中文含义。">
              <Quiz mode={cat} />
            </ModeShell>
          </TabsContent>
          <TabsContent value="builder">
            <ModeShell
              title="拼音节练习 / ประสมคำ"
              hint="选择辅音 + 元音 + 韵尾 + 声调，实时看到拼出的泰语音节。"
            >
              <SyllableBuilder />
            </ModeShell>
          </TabsContent>
          <TabsContent value="review">
            <ModeShell
              title="随机复习 / ทบทวนแบบสุ่ม"
              hint="混合辅音、元音、声调随机出题，配合发音训练听辨能力。"
            >
              <MixedReview />
            </ModeShell>
          </TabsContent>
        </div>
      </Tabs>
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
    <Card className="p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{hint}</p>
      </div>
      {children}
    </Card>
  );
}