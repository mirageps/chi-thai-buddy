export function LearningCategoryCard({
  th,
  zh,
  desc,
  colorVar,
  active,
  emphasis,
}: {
  th: string;
  zh: string;
  desc: string;
  colorVar: string;
  active?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`group h-full rounded-xl border p-4 text-left transition-all ${
        active
          ? "shadow-[var(--shadow-soft)] ring-2 ring-offset-2"
          : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
      }`}
      style={{
        borderColor: active ? `var(${colorVar})` : undefined,
        ["--tw-ring-color" as string]: `var(${colorVar})`,
        backgroundColor: active
          ? `color-mix(in oklab, var(${colorVar}) 8%, var(--card))`
          : emphasis
          ? `color-mix(in oklab, var(${colorVar}) 6%, var(--card))`
          : "var(--card)",
      }}
    >
      <div
        className="mb-1 font-thai text-xl font-semibold leading-[1.4]"
        style={{ color: `var(${colorVar})` }}
      >
        {th}
      </div>
      <div className="text-sm font-semibold">{zh}</div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}