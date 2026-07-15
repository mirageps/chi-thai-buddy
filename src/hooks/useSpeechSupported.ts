import { useEffect, useState } from "react";
import { isSpeechSupported } from "@/lib/speech";

/**
 * SSR-safe speech support check.
 * Returns false on the server and during the first client render,
 * then updates to the real browser value after hydration.
 */
export function useSpeechSupported() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(isSpeechSupported());
  }, []);
  return supported;
}
