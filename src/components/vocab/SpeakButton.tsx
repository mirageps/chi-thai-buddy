import { Volume2 } from "lucide-react";
import { speakThai } from "@/lib/speech";
import { useSpeechSupported } from "@/hooks/useSpeechSupported";

export function SpeakButton({
  text,
  size = "md",
  className = "",
}: {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const supported = useSpeechSupported();
  if (!supported) return null;
  const box = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const icon = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <button
      type="button"
      aria-label={`朗读 / ฟังเสียง ${text}`}
      onClick={(e) => {
        e.stopPropagation();
        speakThai(text);
      }}
      className={`grid ${box} shrink-0 place-items-center rounded-full border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-accent active:scale-95 ${className}`}
    >
      <Volume2 className={icon} />
    </button>
  );
}
