import { useRouterState } from "@tanstack/react-router";
import { useScrollDirection } from "./useScrollDirection";

export type NavMode = "normal" | "compact" | "lesson";

/**
 * Decides which navigation variant to render.
 * - /learn is treated as lesson content -> collapsed circle
 * - /, /profile -> normal at top, compact when scrolled down
 */
export function useNavigationMode(): NavMode {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scroll = useScrollDirection({ topThreshold: 100, delta: 10 });

  if (pathname.startsWith("/learn")) return "lesson";
  if (scroll === "down") return "compact";
  return "normal";
}