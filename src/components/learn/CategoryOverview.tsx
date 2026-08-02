import { CONSONANTS, VOWELS, TONES, classLabel } from "@/data/thai";
import { FINALS } from "@/data/finals";

type Category = "consonants" | "vowels" | "finals" | "tones";

const DIPH = VOWELS.filter((v) => v.zhName.startsWith("复合"));
const SHORT_V = VOWELS.filter((v) => v.length === "short" && !v.zhName.startsWith("复合"));
const LONG_V = VOWELS.filter((v) => v.length === "long" && !v.zhName.startsWith("复合"));

function Group({
  zh,
  th,
  count,
  children,
}: {
  zh: string;
  th?: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex items-baseline gap-2 text-xs">
        <span className="font-semibold">{zh}</span>
        {th && <span className="font-thai text-muted-foreground">{th}</span>}
        {count !== undefined && <span className="text-muted-foreground">· {count}</span>}
      </div>
      {children}
    </div>
  );
}

/** Read-only overview (总览) built from the existing data sources only. */
export function CategoryOverview({ cat }: { cat: Category }) {
  if (cat === "consonants") {
    return (
      <div>
        {(["mid", "high", "low"] as const).map((cls) => {
          const list = CONSONANTS.filter((c) => c.cls === cls);
          const lbl = classLabel(cls);
          return (
            <Group key={cls} zh={lbl.zh} th={lbl.th} count={list.length}>
              <div className="flex flex-wrap gap-1.5">
                {list.map((c) => (
                  <div
                    key={c.char}
                    className="min-w-[4.5rem] rounded-lg border bg-card px-2 pb-1.5 pt-1 text-center"
                    style={{ borderColor: `color-mix(in oklab, var(--class-${cls}) 40%, var(--border))` }}
                  >
                    <div className="font-thai text-xl leading-[1.5]">{c.char}</div>
                    <div className="font-thai text-[10px] text-muted-foreground">{c.name}</div>
                    <div className="text-[10px]">{c.zhMeaning}</div>
                  </div>
                ))}
              </div>
            </Group>
          );
        })}
      </div>
    );
  }

  if (cat === "vowels") {
    return (
      <div>
        {[
          { zh: "短元音", th: "สระเสียงสั้น", list: SHORT_V },
          { zh: "长元音", th: "สระเสียงยาว", list: LONG_V },
          { zh: "复合元音", th: "สระประสม", list: DIPH },
        ].map((g) => (
          <Group key={g.zh} zh={g.zh} th={g.th} count={g.list.length}>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {g.list.map((v) => (
                <div
                  key={v.form + v.romanized}
                  className="rounded-lg border bg-card px-2 pb-1.5 pt-1"
                  style={{ borderColor: "color-mix(in oklab, var(--vowel) 35%, var(--border))" }}
                >
                  <div className="font-thai text-lg leading-[1.5]">{v.form}</div>
                  <div className="text-[11px] font-medium">{v.zhName}</div>
                  <div className="text-[10px] text-muted-foreground">{v.zhSound}</div>
                </div>
              ))}
            </div>
          </Group>
        ))}
      </div>
    );
  }

  if (cat === "finals") {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {FINALS.map((f) => (
          <div
            key={f.key}
            className="rounded-lg border bg-card p-3"
            style={{ borderColor: "color-mix(in oklab, var(--final) 35%, var(--border))" }}
          >
            <div className="flex items-baseline gap-2">
              <span className="font-thai text-base font-semibold leading-[1.5]">{f.thName}</span>
              <span className="text-sm font-semibold">{f.zhName}</span>
              <span className="ml-auto text-xs text-muted-foreground">{f.ipa ?? f.short}</span>
            </div>
            {f.consonants.length > 0 && (
              <div className="font-thai mt-1 text-lg leading-[1.5]">{f.consonants.join(" ")}</div>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">{f.desc}</p>
            <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
              {f.examples.map((e) => (
                <span key={e.thai}>
                  <span className="font-thai leading-[1.5]">{e.thai}</span>
                  <span className="text-muted-foreground"> {e.zh}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {TONES.map((t) => (
        <div
          key={t.zhName}
          className="flex items-center gap-3 rounded-lg border bg-card p-3"
          style={{ borderColor: "color-mix(in oklab, var(--tone) 35%, var(--border))" }}
        >
          <div className="font-thai min-w-[2.5rem] text-2xl leading-[1.5]">{t.mark}</div>
          <div>
            <div className="text-sm font-semibold">
              {t.zhName} <span className="font-thai text-xs opacity-80">{t.name}</span>{" "}
              <span aria-hidden>{t.arrow}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{t.zhDesc}</p>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-muted-foreground sm:col-span-2">
        注意：没有声调符号不等于一定是平声，实际声调还取决于辅音类别与音节类型。
      </p>
    </div>
  );
}
