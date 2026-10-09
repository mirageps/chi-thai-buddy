import { useState } from "react";
import { VOWELS, TONES, classLabel, type Consonant } from "@/data/thai";
import { FINALS } from "@/data/finals";
import { homeConsonants, CLASS_LEGEND } from "@/lib/home-order";

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

function ConsonantTile({ c }: { c: Consonant }) {
  return (
    <li>
      <div
        title={`${c.name} · ${c.zhMeaning}`}
        className="flex min-h-[52px] flex-col items-center justify-center rounded-lg border px-1 pb-1 pt-1.5"
        style={{
          backgroundColor: `var(--class-${c.cls})`,
          borderColor: `color-mix(in oklab, var(--class-${c.cls}) 86%, #000)`,
        }}
      >
        <span className="font-thai text-lg leading-[1.4]" style={{ color: "var(--class-ink)" }}>
          {c.char}
        </span>
        <span className="mt-0.5 flex items-center gap-1 leading-[1.4]">
          <span
            className="text-[10px] font-medium italic"
            style={{ color: "color-mix(in oklab, var(--class-ink) 70%, transparent)" }}
          >
            {c.initialSound}
          </span>
          <span
            className="rounded px-1 text-[9px] font-semibold"
            style={{
              color: "var(--class-ink)",
              backgroundColor: `color-mix(in oklab, var(--class-${c.cls}) 55%, var(--card))`,
            }}
          >
            {c.cls === "mid" ? "中" : c.cls === "high" ? "高" : "低"}
          </span>
        </span>
      </div>
    </li>
  );
}

const GRID = "grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-11";

function ConsonantOverview() {
  const [sort, setSort] = useState<"alpha" | "class">("alpha");
  const opts = [
    { k: "alpha", zh: "按 ก–ฮ", th: "เรียง ก–ฮ" },
    { k: "class", zh: "按类别", th: "ตามประเภท" },
  ] as const;
  return (
    <div>
      <div className="mb-3 inline-flex rounded-full border bg-card p-0.5" role="tablist">
        {opts.map((o) => (
          <button
            key={o.k}
            role="tab"
            aria-selected={sort === o.k}
            onClick={() => setSort(o.k)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              sort === o.k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {o.zh} <span className="font-thai font-normal opacity-80">{o.th}</span>
          </button>
        ))}
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {CLASS_LEGEND.map((l) => (
          <span key={l.cls} className="flex items-center gap-1">
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--class-${l.cls})` }} />
            <span className="text-foreground">{l.zh}</span>
            <span className="font-thai">{l.th}</span>
          </span>
        ))}
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
        发音标注参考汉语拼音，帮助初学者快速辨认，不代表完全相同的发音。
        <br />
        <span className="font-thai">
          สัญลักษณ์เสียงอ้างอิงจากพินอินเพื่อช่วยให้ผู้เริ่มต้นจดจำ ไม่ได้หมายความว่าออกเสียงเหมือนกันทั้งหมด
        </span>
      </p>
      {sort === "alpha" ? (
        <ol className={GRID}>
          {homeConsonants.map((c) => (
            <ConsonantTile key={c.char} c={c} />
          ))}
        </ol>
      ) : (
        (["mid", "high", "low"] as const).map((cls) => {
          const list = homeConsonants.filter((c) => c.cls === cls);
          const lbl = classLabel(cls);
          return (
            <Group key={cls} zh={lbl.zh} th={lbl.th} count={list.length}>
              <ol className={GRID}>
                {list.map((c) => (
                  <ConsonantTile key={c.char} c={c} />
                ))}
              </ol>
            </Group>
          );
        })
      )}
    </div>
  );
}

/** Read-only overview (总览) built from the existing data sources only. */
export function CategoryOverview({ cat }: { cat: Category }) {
  if (cat === "consonants") return <ConsonantOverview />;


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
                  className="flex flex-col items-center justify-center rounded-lg border bg-card px-2 pb-1.5 pt-1 text-center"
                  style={{ borderColor: "color-mix(in oklab, var(--vowel) var(--overview-border-mix, 35%), var(--border))" }}
                >
                  <div className="font-thai text-lg leading-[1.5]">{v.forms}</div>
                  <div className="text-[11px] font-medium">{v.zhName}</div>
                  <div className="text-[10px] text-muted-foreground">发音：{v.romanized}</div>
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
