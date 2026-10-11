import { useEffect, useState } from "react";
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
import { DIFFICULTY_META, VOCAB_CATEGORIES, type Difficulty, type VocabCategory } from "@/data/vocab";

const DIFFS: Difficulty[] = ["basic", "inter", "adv"];

export type AddWordInput = {
  thai: string;
  pron: string;
  zh: string;
  difficulty: Difficulty;
  category?: string;
  newCategory?: { zh: string; th: string };
};

export function AddWordDialog({
  open,
  onOpenChange,
  onAdd,
  customCategories = [],
  defaultCategory,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (w: AddWordInput) => void;
  customCategories?: VocabCategory[];
  defaultCategory?: string;
}) {
  const initCat = defaultCategory && defaultCategory !== "all" ? defaultCategory : "mine";
  const [thai, setThai] = useState("");
  const [pron, setPron] = useState("");
  const [zh, setZh] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("basic");
  const [category, setCategory] = useState<string>(initCat);
  const [newZh, setNewZh] = useState("");
  const [newTh, setNewTh] = useState("");

  useEffect(() => {
    if (open) setCategory(initCat);
  }, [open, initCat]);

  const allCats: VocabCategory[] = [
    ...VOCAB_CATEGORIES,
    ...customCategories,
    { key: "mine", zh: "我的单词", th: "คำของฉัน" },
  ];

  const canSave =
    thai.trim() && zh.trim() && (category !== "__new" || newZh.trim() || newTh.trim());

  const save = () => {
    if (!canSave) return;
    onAdd({
      thai,
      pron,
      zh,
      difficulty,
      category: category === "__new" ? undefined : category,
      newCategory: category === "__new" ? { zh: newZh, th: newTh } : undefined,
    });
    setNewZh("");
    setNewTh("");
    setThai("");
    setPron("");
    setZh("");
    setDifficulty("basic");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Input id="v-thai" value={thai} onChange={(e) => setThai(e.target.value)} placeholder="สวัสดี" className="font-thai min-h-[44px]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-pron">发音 / คำอ่าน</Label>
            <Input id="v-pron" value={pron} onChange={(e) => setPron(e.target.value)} placeholder="sà-wàt-dii" className="min-h-[44px]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-zh">中文释义 / ความหมายจีน</Label>
            <Input id="v-zh" value={zh} onChange={(e) => setZh(e.target.value)} placeholder="你好" className="min-h-[44px]" />
          </div>
          <div className="space-y-1.5">
            <Label>分类 / หมวดหมู่</Label>
            <div className="flex flex-wrap gap-2">
              {[...allCats, { key: "__new", zh: "+ 新建分类", th: "สร้างหมวดใหม่" }].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`min-h-[36px] rounded-full border px-3 text-xs font-medium transition-colors ${
                    category === c.key ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {c.zh} <span className="font-thai opacity-70">{c.th}</span>
                </button>
              ))}
            </div>
            {category === "__new" && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Input value={newZh} onChange={(e) => setNewZh(e.target.value)} placeholder="中文名 如：工作" aria-label="新分类中文名 / ชื่อหมวดภาษาจีน" className="min-h-[44px]" />
                <Input value={newTh} onChange={(e) => setNewTh(e.target.value)} placeholder="ชื่อไทย เช่น งาน" aria-label="新分类泰文名 / ชื่อหมวดภาษาไทย" className="font-thai min-h-[44px]" />
              </div>
            )}
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
                    difficulty === d ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {DIFFICULTY_META[d].zh}
                  <span className="font-thai ml-1 text-[11px] opacity-70">{DIFFICULTY_META[d].th}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="min-h-[44px]" onClick={() => onOpenChange(false)}>
            取消 / ยกเลิก
          </Button>
          <Button className="min-h-[44px]" disabled={!canSave} onClick={save}>
            保存 / บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
