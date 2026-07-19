import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LearningCategoryCard } from "@/components/layout/LearningCategoryCard";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const SHORTCUTS = [
  { cat: "consonants", th: "พยัญชนะไทย", zh: "泰语辅音", desc: "44 个辅音，按中/高/低三类颜色编码。", colorVar: "--consonant" },
  { cat: "vowels", th: "สระไทย", zh: "泰语元音", desc: "短元音、长元音与复合元音。", colorVar: "--vowel" },
  { cat: "tones", th: "วรรณยุกต์ไทย", zh: "泰语声调", desc: "平/低/降/高/升 五个声调。", colorVar: "--tone" },
  { cat: "finals", th: "ตัวสะกด", zh: "韵尾辅音", desc: "8 个韵尾音与常见拼写。", colorVar: "--final" },
] as const;

function HomePage() {
  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-3xl font-bold sm:text-4xl">
            学泰语 <span className="font-thai">เรียนภาษาไทย</span>
          </h1>
          <p className="max-w-2xl text-sm opacity-90 sm:text-base">
            欢迎回来！专为中文使用者设计的泰语入门工具。
            <br className="hidden sm:block" />
            <span className="font-thai text-xs opacity-80">
              ยินดีต้อนรับสู่แอปเรียนภาษาไทยสำหรับผู้เรียนชาวจีน
            </span>
          </p>
        </>
      }
    >
      <section className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">开始学习</h2>
        <span className="font-thai text-xs text-muted-foreground">เริ่มต้นเรียน</span>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.cat}
            to="/learn"
            search={{ cat: s.cat, mode: "flashcard" }}
            className="block"
          >
            <LearningCategoryCard th={s.th} zh={s.zh} desc={s.desc} colorVar={s.colorVar} />
          </Link>
        ))}

        <Link
          to="/learn"
          search={{ cat: "consonants", mode: "builder" }}
          className="block sm:col-span-2"
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

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        <span className="font-thai">ขอให้เรียนสนุก</span> · 学习愉快 🌸
      </footer>
    </AppLayout>
  );
}