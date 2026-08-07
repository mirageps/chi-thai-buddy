import { Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { BottomNavigation } from "./BottomNavigation";

export function AppLayout({
  children,
  hero,
}: {
  children: React.ReactNode;
  hero?: React.ReactNode;
}) {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-[image:var(--gradient-hero)] text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 sm:py-8">
          <div className="flex items-center justify-between gap-2 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>学泰语 · <span className="font-thai">เรียนภาษาไทย</span></span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              aria-label="切换主题 / สลับธีม"
              title="切换主题 / สลับธีม"
              className="h-9 w-9 rounded-full border border-[color:var(--theme-toggle-border)] bg-[color:var(--theme-toggle-bg)] p-0 text-[color:var(--theme-toggle-ink)] transition-colors hover:bg-[color:var(--theme-toggle-bg-hover)] hover:text-[color:var(--theme-toggle-ink)] active:bg-[color:var(--theme-toggle-bg-active)] focus-visible:ring-2 focus-visible:ring-[color:var(--theme-toggle-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          {hero}
        </div>
      </header>

      <main
        className="mx-auto max-w-5xl px-4 py-6 sm:py-8"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
      >
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}