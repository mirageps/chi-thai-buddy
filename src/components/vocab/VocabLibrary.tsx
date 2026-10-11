import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Check } from "lucide-react";
import { DIFFICULTY_META, categoryLabel, type VocabCategory, type VocabWord } from "@/data/vocab";
import { SpeakButton } from "./SpeakButton";
import { AddWordDialog, type AddWordInput } from "./AddWordDialog";
import type { ProgressMap } from "@/lib/vocab-store";

export function VocabLibrary({
  words,
  progress,
  onAdd,
  onRemove,
  customCategories = [],
  defaultCategory,
}: {
  customCategories?: VocabCategory[];
  defaultCategory?: string;
  words: VocabWord[];
  progress: ProgressMap;
  onAdd: (w: AddWordInput) => void;
  onRemove: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return words;
    return words.filter(
      (w) =>
        w.thai.includes(k) ||
        w.pron.toLowerCase().includes(k) ||
        w.zh.toLowerCase().includes(k),
    );
  }, [words, q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索 / ค้นหา…"
            aria-label="搜索单词 / ค้นหาคำศัพท์"
            className="min-h-[44px] pl-9"
          />
        </div>
        <Button
          type="button"
          aria-label="添加新单词 / เพิ่มคำศัพท์ใหม่"
          onClick={() => setOpen(true)}
          className="h-[44px] w-[44px] shrink-0 p-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        共 {list.length} 个单词 · <span className="font-thai">ทั้งหมด {list.length} คำ</span>
      </p>

      <ul className="space-y-2">
        {list.map((w) => (
          <li key={w.id}>
            <Card className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-thai truncate text-lg leading-[1.4] font-semibold">
                    {w.thai}
                  </span>
                  {progress[w.id]?.mastered && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="truncate text-xs text-[color:var(--text-secondary)]">{w.pron}</p>
                <p className="truncate text-sm">{w.zh}</p>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                style={{ backgroundColor: `var(${DIFFICULTY_META[w.difficulty].colorVar})` }}
              >
                {DIFFICULTY_META[w.difficulty].zh}
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {categoryLabel(w.category).zh}
              </span>
              <SpeakButton text={w.thai} size="sm" />
              {w.custom && (
                <button
                  type="button"
                  aria-label="删除 / ลบ"
                  onClick={() => onRemove(w.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </Card>
          </li>
        ))}
        {list.length === 0 && (
          <li>
            <Card className="p-8 text-center text-sm text-muted-foreground">
              没有找到单词。<span className="font-thai">ไม่พบคำศัพท์</span>
            </Card>
          </li>
        )}
      </ul>

      <AddWordDialog
        open={open}
        onOpenChange={setOpen}
        onAdd={onAdd}
        customCategories={customCategories}
        defaultCategory={defaultCategory}
      />
    </div>
  );
}
