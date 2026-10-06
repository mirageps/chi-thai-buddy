import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { ChevronLeft, PencilLine } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEdgeSwipeBack } from "@/hooks/useEdgeSwipeBack";

const TITLE = "练习 · 泰语拼读填空 | 学泰语";
const DESC = "补全泰语单词中缺少的辅音、元音或韵尾，每组 10 题，练习拼读能力。";

export const Route = createFileRoute("/learn/practice")({
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
  component: PracticePage,
});

function PracticePage() {
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
            练习 <span className="font-thai text-base opacity-90">แบบฝึกหัด</span>
          </h1>
          <p className="text-xs opacity-90">
            拼读填空 · <span className="font-thai opacity-80">ฝึกอ่านและประสมคำ</span>
          </p>
        </>
      }
    >
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={back} aria-label="返回学习 / กลับหน้าเรียน" className="min-h-[44px]">
          <ChevronLeft className="mr-1 h-4 w-4" />
          返回学习
        </Button>
      </div>
      <Card className="mx-auto flex max-w-3xl flex-col items-center gap-2 p-8 text-center shadow-[var(--shadow-card)]">
        <PencilLine className="h-8 w-8 text-primary" />
        <p className="font-semibold">练习题即将上线</p>
        <p className="font-thai text-sm text-muted-foreground">แบบฝึกหัดกำลังจะเปิดให้ใช้งานเร็วๆ นี้</p>
      </Card>
    </AppLayout>
  );
}
