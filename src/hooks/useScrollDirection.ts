import { useEffect, useState } from "react";

export type ScrollState = "top" | "down" | "up";

/**
 * Tracks vertical scroll direction with hysteresis to avoid jitter.
 * Returns "top" when near page top, otherwise "down" / "up".
 */
export function useScrollDirection(opts?: { topThreshold?: number; delta?: number }) {
  const topThreshold = opts?.topThreshold ?? 80;
  const delta = opts?.delta ?? 8;
  const [state, setState] = useState<ScrollState>("top");

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let current: ScrollState = window.scrollY <= topThreshold ? "top" : "down";
    setState(current);

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        let next: ScrollState = current;
        if (y <= topThreshold) {
          next = "top";
        } else if (Math.abs(y - lastY) > delta) {
          next = y > lastY ? "down" : "up";
        }
        if (next !== current) {
          current = next;
          setState(next);
        }
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [topThreshold, delta]);

  return state;
}