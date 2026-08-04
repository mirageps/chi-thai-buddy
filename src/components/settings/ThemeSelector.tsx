import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "@/hooks/useTheme";

const OPTIONS: {
  value: ThemePreference;
  zh: string;
  th: string;
  icon: typeof Sun;
}[] = [
  { value: "light", zh: "浅色", th: "สว่าง", icon: Sun },
  { value: "dark", zh: "深色", th: "มืด", icon: Moon },
  { value: "system", zh: "跟随系统", th: "ตามระบบ", icon: Monitor },
];

export function ThemeSelector() {
  const { preference, setPreference, resolved } = useTheme();

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">外观主题</h2>
        <span className="font-thai text-[11px] text-muted-foreground">ธีมแอป</span>
      </div>
      <div role="radiogroup" aria-label="外观主题 / ธีมแอป" className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const active = preference === o.value;
          const Icon = o.icon;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPreference(o.value)}
              className={`flex min-h-[56px] items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{o.zh}</span>
                <span className="font-thai block text-[11px] text-muted-foreground">{o.th}</span>
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        当前显示：{resolved === "dark" ? "深色模式" : "浅色模式"} ·{" "}
        <span className="font-thai">{resolved === "dark" ? "โหมดมืด" : "โหมดสว่าง"}</span>
      </p>
    </div>
  );
}
