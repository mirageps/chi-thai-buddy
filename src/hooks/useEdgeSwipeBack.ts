import { useEffect } from "react";

/**
 * Left-edge swipe-to-go-back gesture (mobile only).
 * Starts tracking ONLY when the touch begins inside `edge` px from the left
 * screen edge, so flashcard swipes / taps elsewhere are untouched.
 */
export function useEdgeSwipeBack(
  enabled: boolean,
  onBack: () => void,
  opts?: { edge?: number; threshold?: number },
) {
  const edge = opts?.edge ?? 28;
  const threshold = opts?.threshold ?? 80;

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      tracking = t.clientX <= edge;
      startX = t.clientX;
      startY = t.clientY;
    };

    const onMove = (e: TouchEvent) => {
      if (!tracking || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      // vertical scrolling wins -> abandon the gesture
      if (Math.abs(dy) > 30 && Math.abs(dy) > Math.abs(dx)) tracking = false;
    };

    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (dx > threshold && Math.abs(dx) > Math.abs(dy) * 2) onBack();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [enabled, onBack, edge, threshold]);
}