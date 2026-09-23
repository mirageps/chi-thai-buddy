import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Trash2, Check } from "lucide-react";
import { DIFFICULTY_META, categoryLabel, type Difficulty, type VocabWord } from "@/data/vocab";
import { SpeakButton } from "./SpeakButton";
import type { ProgressMap } from "@/lib/vocab-store";

const DIFFS: Difficulty[] = ["basic", "inter", "adv"];

export function VocabLibrary({
  words,
  progress,
  onAdd,
  onRemove,
}: {
  words: VocabWord[];
  progress: ProgressMap;
  onAdd: (w: { thai: string; pron: string; zh: string; difficulty: Difficulty }) => void;
  onRemove: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [thai, setThai] = useState("");
  const [pron, setPron] = useState("");
  const [zh, setZh] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("basic");

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

  const canSave = thai.trim() && zh.trim();

  const save = () => {
    if (!canSave) return;
    onAdd({ thai, pron, zh, difficulty });
    setThai("");
    setPron("");
    setZh("");
    setDifficulty("basic");
    setOpen(false);
  };

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
              <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:inline">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[92vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              添加新单词 · <span className="font-thai">เพิ่มคำศัพท์ใหม่</span>
            </DialogTitle>
            <DialogDescription>
              保存在本机浏览器中 · <span className="font-thai">บันทึกไว้ในเครื่องของคุณ</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="v-thai">泰语单词 / คำศัพท์ไทย</Label>
              <Input
                id="v-thai"
                value={thai}
                onChange={(e) => setThai(e.target.value)}
                placeholder="สวัสดี"
                className="font-thai min-h-[44px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-pron">发音 / คำอ่าน</Label>
              <Input
                id="v-pron"
                value={pron}
                onChange={(e) => setPron(e.target.value)}
                placeholder="sà-wàt-dii"
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-zh">中文释义 / ความหมายจีน</Label>
              <Input
                id="v-zh"
                value={zh}
                onChange={(e) => setZh(e.target.value)}
                placeholder="你好"
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>难度 / ระดับความยาก</Label>
              <div className="flex gap-2">
                {DIFFS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`min-h-[44px] flex-1 rounded-xl border text-sm font-medium transition-colors ${
                      difficulty === d
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {DIFFICULTY_META[d].zh}
                    <span className="font-thai ml-1 text-[11px] opacity-70">
                      {DIFFICULTY_META[d].th}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="min-h-[44px]"
              onClick={() => setOpen(false)}
            >
              取消 / ยกเลิก
            </Button>
            <Button className="min-h-[44px]" disabled={!canSave} onClick={save}>
              保存 / บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
