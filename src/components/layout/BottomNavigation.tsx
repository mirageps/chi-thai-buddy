import { Link, useRouterState } from "@tanstack/react-router";
import { Home, GraduationCap, User } from "lucide-react";

const ITEMS = [
  { to: "/", label: "首页", th: "หน้าหลัก", icon: Home, match: (p: string) => p === "/" },
  { to: "/learn", label: "学习", th: "เรียน", icon: GraduationCap, match: (p: string) => p.startsWith("/learn") },
  { to: "/profile", label: "我的", th: "ของฉัน", icon: User, match: (p: string) => p.startsWith("/profile") },
] as const;

export function BottomNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Global Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-5xl items-stretch justify-around px-2">
        {ITEMS.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span>{it.label}</span>
                <span className="font-thai text-[9px] opacity-70">{it.th}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}