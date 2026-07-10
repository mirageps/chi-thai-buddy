// Browser-native Thai TTS via Web Speech API.
// 完全在浏览器本地运行，无需 Google 或任何外部服务，中国大陆无需 VPN 即可使用。
// Works only when the user's OS has a Thai voice installed
// (Windows / macOS / iOS / most Android — 系统自带泰语语音包).

let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined;

function pickThaiVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  const thai =
    voices.find((v) => v.lang?.toLowerCase().startsWith("th")) ??
    voices.find((v) => /thai/i.test(v.name)) ??
    null;
  cachedVoice = thai;
  return thai;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speakThai(text: string, opts: { rate?: number } = {}): boolean {
  if (!isSpeechSupported() || !text) return false;
  const synth = window.speechSynthesis;
  // Warm up voices list (some browsers load asynchronously)
  if (!synth.getVoices().length) {
    synth.addEventListener?.("voiceschanged", () => (cachedVoice = undefined), {
      once: true,
    });
  }
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "th-TH";
    u.rate = opts.rate ?? 0.8;
    u.pitch = 1;
    const voice = pickThaiVoice();
    if (voice) u.voice = voice;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function hasThaiVoice(): boolean {
  if (!isSpeechSupported()) return false;
  return pickThaiVoice() !== null;
}