import { useRouterState } from "@tanstack/react-router";
import { useScrollDirection } from "./useScrollDirection";

export type NavMode = "normal" | "compact" | "lesson";

/**
 * Decides which navigation variant to render based on ACTUAL usage state,
 * not merely on the route:
 * - active lesson (/learn with a chosen category) -> collapsed circle
 * - learning category page (/learn without category) behaves like a top-level
 *   page: normal at top, compact when scrolling down
 */
export function useNavigationMode(): NavMode {
  const { pathname, search } = useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      search: s.location.search as Record<string, unknown> | undefined,
    }),
  });
  const scroll = useScrollDirection({ topThreshold: 100, delta: 10 });

  const cat = search?.cat;
  const isActiveLesson =
    pathname.startsWith("/learn") && typeof cat === "string" && cat.length > 0;

  if (isActiveLesson) return "lesson";
  if (scroll === "down") return "compact";
  return "normal";
}