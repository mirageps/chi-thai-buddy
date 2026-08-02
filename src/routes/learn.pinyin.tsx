import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SyllableBuilder } from "@/components/learn/SyllableBuilder";
import { useEdgeSwipeBack } from "@/hooks/useEdgeSwipeBack";

const TITLE = "拼音节 · 泰语音节合成练习 | 学泰语";
const DESC = "选择辅音、元音、韵尾与声调，按泰语正字法实时拼出音节，并可听发音。";

export const Route = createFileRoute("/learn/pinyin")({
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
  component: PinyinPage,
});

function PinyinPage() {
  const navigate = useNavigate();
  const back = useCallback(() => {
    navigate({ to: "/learn", search: {} });
  }, [navigate]);

  useEdgeSwipeBack(true, back, { edge: 28, threshold: 80 });

  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-xl font-bold sm:text-2xl">
            拼音节 <span className="font-thai text-base opacity-90">ประสมพยางค์</span>
          </h1>
          <p className="text-xs opacity-90">
            辅音 + 元音 + 韵尾 + 声调 ·{" "}
            <span className="font-thai opacity-80">พยัญชนะ + สระ + ตัวสะกด + วรรณยุกต์</span>
          </p>
        </>
      }
    >
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={back}
          aria-label="返回学习 / กลับหน้าเรียน"
          className="min-h-[44px]"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          返回学习
        </Button>
      </div>
      <Card className="mx-auto max-w-3xl p-4 shadow-[var(--shadow-card)] sm:p-6">
        <SyllableBuilder />
      </Card>
    </AppLayout>
  );
}
