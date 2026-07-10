import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Flashcard } from "@/components/learn/Flashcard";
import { Quiz } from "@/components/learn/Quiz";
import { SyllableBuilder } from "@/components/learn/SyllableBuilder";
import { MixedReview } from "@/components/learn/MixedReview";
import { BookOpen, Brain, Blocks, Sparkles, Shuffle, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/")({
  component: Index,
});

type Category = "consonants" | "vowels" | "tones";

const CATEGORIES: {
  key: Category;
  th: string;
  zh: string;
  desc: string;
  colorVar: string;
}[] = [
  {
    key: "consonants",
    th: "พยัญชนะ ก–ฮ",
    zh: "辅音 44 个",
    desc: "ก 到 ฮ，共 44 个辅音，按中/高/低三类颜色编码，帮助记忆声调规则。",
    colorVar: "--consonant",
  },
  {
    key: "vowels",
    th: "สระ",
    zh: "元音",
    desc: "短元音与长元音、复合元音，附中文近似发音提示。",
    colorVar: "--vowel",
  },
  {
    key: "tones",
    th: "วรรณยุกต์",
    zh: "声调",
    desc: "五个声调（平/低/降/高/升），用箭头图示帮助识别调型。",
    colorVar: "--tone",
  },
];

function Index() {
  const [category, setCategory] = useState<Category>("consonants");
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-[image:var(--gradient-hero)] text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:py-12">
          <div className="flex items-center justify-between gap-2 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>中文母语者的泰语入门 · เรียนภาษาไทยสำหรับคนจีน</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              title="切换主题 / สลับธีม"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            学泰语 <span className="font-thai">เรียนภาษาไทย</span>
          </h1>
          <p className="max-w-2xl text-sm opacity-90 sm:text-base">
            专为中文使用者设计的泰语学习工具：辅音、元音、声调，闪卡记忆 + 随机测验 + 拼音节练习。
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Category selector */}
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const active = cat.key === category;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`group rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "shadow-[var(--shadow-soft)] ring-2 ring-offset-2"
                    : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                }`}
                style={{
                  borderColor: active ? `var(${cat.colorVar})` : undefined,
                  ["--tw-ring-color" as string]: `var(${cat.colorVar})`,
                  backgroundColor: active
                    ? `color-mix(in oklab, var(${cat.colorVar}) 8%, var(--card))`
                    : "var(--card)",
                }}
              >
                <div
                  className="mb-1 font-thai text-xl font-semibold"
                  style={{ color: `var(${cat.colorVar})` }}
                >
                  {cat.th}
                </div>
                <div className="text-sm font-semibold">{cat.zh}</div>
                <p className="mt-1 text-xs text-muted-foreground">{cat.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Mode tabs */}
        <Tabs defaultValue="flashcard" className="w-full">
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
                <Flashcard mode={category} />
              </ModeShell>
            </TabsContent>
            <TabsContent value="quiz">
              <ModeShell title="随机测验 / แบบทดสอบ" hint="系统随机出题，从四个选项中选出正确的中文含义。">
                <Quiz mode={category} />
              </ModeShell>
            </TabsContent>
            <TabsContent value="builder">
              <ModeShell
                title="拼音节练习 / ประสมคำ"
                hint="选择辅音 + 元音 + 声调，实时看到拼出的泰语音节。"
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

        <footer className="mt-16 pb-8 text-center text-xs text-muted-foreground">
          <span className="font-thai">ขอให้เรียนสนุก</span> · 学习愉快 🌸
        </footer>
      </main>
    </div>
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
