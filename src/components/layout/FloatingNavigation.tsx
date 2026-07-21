import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, GraduationCap, User, Menu, X } from "lucide-react";
import { useNavigationMode } from "@/hooks/useNavigationMode";

const ITEMS = [
  { to: "/", label: "首页", th: "หน้าหลัก", icon: Home, match: (p: string) => p === "/" },
  { to: "/learn", label: "学习", th: "เรียน", icon: GraduationCap, match: (p: string) => p.startsWith("/learn") },
  { to: "/profile", label: "我的", th: "ของฉัน", icon: User, match: (p: string) => p.startsWith("/profile") },
] as const;

const GLASS =
  "border border-white/25 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45 shadow-[0_8px_28px_-10px_oklch(0_0_0/0.35)] dark:border-white/10";

export function FloatingNavigation() {
  const mode = useNavigationMode();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Collapse the lesson menu whenever route changes or we leave lesson mode.
  useEffect(() => {
    setExpanded(false);
  }, [pathname, mode]);

  // Outside click + Escape close (only when expanded).
  useEffect(() => {
    if (!expanded) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setExpanded(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const compact = mode === "compact";
  const lesson = mode === "lesson";

  return (
    <div
      ref={rootRef}
      aria-label="Global Navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      {lesson ? (
        <div className="pointer-events-auto absolute bottom-[calc(env(safe-area-inset-bottom)+12px)] right-4 flex flex-col items-end gap-2">
          {expanded && (
            <ul
              className={`flex animate-scale-in flex-col gap-1 rounded-2xl p-1.5 ${GLASS}`}
              role="menu"
            >
              {ITEMS.map((it) => {
                const active = it.match(pathname);
                const Icon = it.icon;
                return (
                  <li key={it.to} role="none">
                    <Link
                      to={it.to}
                      role="menuitem"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setExpanded(false)}
                      className={`flex min-w-[9rem] items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-foreground/80 hover:bg-foreground/5"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 2} />
                      <span>{it.label}</span>
                      <span className="font-thai ml-auto text-[10px] opacity-60">{it.th}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            type="button"
            aria-label={expanded ? "关闭导航 / ปิดเมนู" : "打开导航 / เปิดเมนู"}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className={`grid h-12 w-12 place-items-center rounded-full text-foreground transition-transform hover:scale-105 active:scale-95 ${GLASS}`}
          >
            {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      ) : (
        <nav
          className={`pointer-events-auto flex items-center gap-1 rounded-full p-1.5 transition-all duration-300 ease-out ${GLASS} ${
            compact ? "" : "px-2"
          }`}
          style={{ maxWidth: compact ? "16rem" : "22rem", width: "88vw" }}
        >
          {ITEMS.map((it) => {
            const active = it.match(pathname);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                aria-label={`${it.label} / ${it.th}`}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] transition-transform ${active ? "scale-110" : ""}`}
                  strokeWidth={active ? 2.4 : 2}
                />
                {(!compact || active) && (
                  <span className="whitespace-nowrap">{it.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}