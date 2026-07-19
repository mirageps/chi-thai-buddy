import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { User, Settings, Info, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppLayout
      hero={
        <>
          <h1 className="text-2xl font-bold sm:text-3xl">
            我的 <span className="font-thai text-lg opacity-90">ของฉัน</span>
          </h1>
          <p className="text-sm opacity-90">个人资料与学习设置。</p>
        </>
      }
    >
      <Card className="mb-6 flex items-center gap-4 p-5 shadow-[var(--shadow-card)]">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        >
          <User className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold">学习者 001</div>
          <div className="font-thai text-xs text-muted-foreground">
            ผู้เรียนใหม่ · 即将开放个人账户
          </div>
        </div>
      </Card>

      <Card className="mb-6 p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">学习进度</h2>
          <span className="font-thai text-[11px] text-muted-foreground">ความคืบหน้า</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "辅音", th: "พยัญชนะ", v: 0 },
            { label: "元音", th: "สระ", v: 0 },
            { label: "声调", th: "วรรณยุกต์", v: 0 },
            { label: "韵尾", th: "ตัวสะกด", v: 0 },
          ].map((p) => (
            <div key={p.label} className="rounded-lg border p-3">
              <div className="text-xs font-medium">{p.label}</div>
              <div className="font-thai text-[10px] text-muted-foreground">{p.th}</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${p.v}%` }} />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">{p.v}% · 即将开放</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3">
        <PlaceholderRow icon={<Settings className="h-4 w-4" />} zh="设置" th="ตั้งค่า" />
        <PlaceholderRow icon={<Info className="h-4 w-4" />} zh="关于学泰语" th="เกี่ยวกับแอป" />
      </div>
    </AppLayout>
  );
}

function PlaceholderRow({
  icon,
  zh,
  th,
}: {
  icon: React.ReactNode;
  zh: string;
  th: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {}}
      className="flex items-center justify-between rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </span>
        <div>
          <div className="text-sm font-medium">{zh}</div>
          <div className="font-thai text-[11px] text-muted-foreground">{th}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>即将开放</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}