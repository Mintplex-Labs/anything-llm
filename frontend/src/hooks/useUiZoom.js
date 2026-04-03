import { useEffect } from "react";
import { isMac } from "@/utils/keyboardShortcuts";

const STORAGE_KEY = "anythingllm_ui_zoom_percent";
const DEFAULT_ZOOM = 100;
const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const STEP = 10;

function clamp(percent) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, percent));
}

function readStoredZoomPercent() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const n = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_ZOOM;
  return clamp(Math.round(n));
}

function applyZoomPercent(percent) {
  const p = clamp(percent);
  document.documentElement.style.zoom = String(p / 100);
  window.localStorage.setItem(STORAGE_KEY, String(p));
}

function modifierPressed(e) {
  return isMac ? e.metaKey : e.ctrlKey;
}

function handleZoomKeyDown(e) {
  if (!modifierPressed(e) || e.altKey) return;

  if (e.key === "0") {
    e.preventDefault();
    e.stopPropagation();
    applyZoomPercent(DEFAULT_ZOOM);
    return;
  }

  if (e.key === "=" || e.key === "+" || e.key === "Add") {
    e.preventDefault();
    e.stopPropagation();
    applyZoomPercent(readStoredZoomPercent() + STEP);
    return;
  }

  if (e.key === "-" || e.key === "_" || e.key === "Subtract") {
    e.preventDefault();
    e.stopPropagation();
    applyZoomPercent(readStoredZoomPercent() - STEP);
  }
}

export function useUiZoom() {
  useEffect(() => {
    applyZoomPercent(readStoredZoomPercent());
    window.addEventListener("keydown", handleZoomKeyDown, true);
    return () =>
      window.removeEventListener("keydown", handleZoomKeyDown, true);
  }, []);
}
