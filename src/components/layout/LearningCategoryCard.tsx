export function LearningCategoryCard({
  th,
  zh,
  desc,
  colorVar,
  active,
  emphasis,
  stat,
}: {
  th: string;
  zh: string;
  desc: string;
  colorVar: string;
  active?: boolean;
  emphasis?: boolean;
  stat?: string;
}) {
  return (
    <div
      className={`glass-clear group flex h-full flex-col rounded-xl border p-4 text-left transition-colors ${
        active ? "ring-2 ring-offset-2" : "hover:bg-muted"
      }`}
      style={{
        borderTop: `3px solid var(${colorVar})`,
        ["--tw-ring-color" as string]: `var(${colorVar})`,
        backgroundColor: active || emphasis
          ? `color-mix(in oklab, var(${colorVar}) 5%, var(--glass-frosted))`
          : "var(--glass-clear)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-base font-semibold">{zh}</div>
          <div className="font-thai text-sm leading-[1.5]" style={{ color: `var(${colorVar})` }}>
            {th}
          </div>
        </div>
        {stat && (
          <span
            className="shrink-0 text-xl font-bold tabular-nums"
            style={{ color: `var(${colorVar})` }}
          >
            {stat}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
