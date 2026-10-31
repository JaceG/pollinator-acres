import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
const CODE_RE = /^[a-z0-9]{5}$/i;
const STORAGE_KEY = "clarity_r";
let initialized = false; // guards React strict-mode double mount

export function ClarityTracker() {
  useEffect(() => {
    if (!projectId || initialized) return;
    initialized = true;
    Clarity.init(projectId);

    let code = new URLSearchParams(window.location.search).get("r");
    try {
      if (code && CODE_RE.test(code)) sessionStorage.setItem(STORAGE_KEY, code);
      else code = sessionStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable (private mode, blocked); the URL code still tags this load
    }

    if (code && CODE_RE.test(code)) {
      Clarity.setTag("r", code);
      Clarity.identify(code);
      Clarity.setTag("source", "outreach");
    } else {
      Clarity.setTag("source", "direct");
    }
  }, []);
  return null;
}
