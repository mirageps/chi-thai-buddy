import { useCallback, useEffect, useLayoutEffect, useState } from "react";

// Runs before paint on the client (prevents a one-frame wrong-theme flash when
// hydration resets the class set by the inline boot script); no-op during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type ThemePreference = "light" | "dark" | "dark-plum" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "thai-learn-theme";

function systemTheme(): ResolvedTheme {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
  return raw === "light" || raw === "dark" || raw === "dark-plum" || raw === "system"
    ? raw
    : "system";
}

function resolve(pref: ThemePreference): ResolvedTheme {
  if (pref === "system") return systemTheme();
  return pref === "light" ? "light" : "dark";
}

function applyResolved(t: ResolvedTheme, pref: ThemePreference) {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.classList.toggle("theme-plum", pref === "dark-plum");
  root.dataset["theme"] = t;
  root.style.colorScheme = t;
}

/**
 * Single theme source of truth: a stored *preference* and a *resolved*
 * light/dark theme. "dark-plum" is a dark palette variant (class theme-plum).
 */
export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  useIsomorphicLayoutEffect(() => {
    const pref = readPreference();
    setPreferenceState(pref);
    const next = resolve(pref);
    setResolved(next);
    applyResolved(next, pref);
  }, []);

  useEffect(() => {
    if (preference !== "system" || readPreference() !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readPreference() !== "system") return;
      const next: ResolvedTheme = mq.matches ? "dark" : "light";
      setResolved(next);
      applyResolved(next, "system");
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
    setPreferenceState(pref);
    const next = resolve(pref);
    setResolved(next);
    applyResolved(next, pref);
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolved === "dark" ? "light" : "dark");
  }, [resolved, setPreference]);

  return { theme: resolved, resolved, preference, setPreference, toggle };
}
