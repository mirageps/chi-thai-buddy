import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";
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
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
}

function applyResolved(t: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.dataset["theme"] = t;
  root.style.colorScheme = t;
}

/**
 * Single theme source of truth: a stored *preference* (light | dark | system)
 * and a *resolved* theme (light | dark) that follows the OS when preference is
 * "system". No page reload, no state loss — only a class swap on <html>.
 */
export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  // Read the stored preference after mount (the inline boot script already
  // applied the correct class, so there is no flash here).
  useEffect(() => {
    const pref = readPreference();
    setPreferenceState(pref);
    const next = pref === "system" ? systemTheme() : pref;
    setResolved(next);
    applyResolved(next);
  }, []);

  // Follow OS changes live while the preference is "system".
  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next: ResolvedTheme = mq.matches ? "dark" : "light";
      setResolved(next);
      applyResolved(next);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
    setPreferenceState(pref);
    const next = pref === "system" ? systemTheme() : pref;
    setResolved(next);
    applyResolved(next);
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolved === "dark" ? "light" : "dark");
  }, [resolved, setPreference]);

  return { theme: resolved, resolved, preference, setPreference, toggle };
}
