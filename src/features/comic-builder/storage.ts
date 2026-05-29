import type { ComicBuilderState, ComicProject, StyleSettings } from "./types";

const STORAGE_KEY = "sk8rpunk-comic-builder";
const FAL_KEY_STORAGE = "sk8rpunk-comic-fal-key";

export const DEFAULT_STYLE: StyleSettings = {
  artStyle: "cyberpunk-neon",
  inkStyle: "bold-ink",
  colorPalette: "full-color",
  defaultAspectRatio: "3:4",
  defaultResolution: "1K",
  globalKeywords: [],
};

export function createProject(title: string): ComicProject {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    schemaVersion: "comic-builder.v1",
    title,
    createdAt: now,
    updatedAt: now,
    characters: [],
    style: { ...DEFAULT_STYLE },
    pages: [],
  };
}

export function loadBuilderState(): ComicBuilderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ComicBuilderState;
  } catch { /* corrupt data — reset */ }
  return { projects: [], activeProjectId: null, falKeyStored: hasFalKey() };
}

export function saveBuilderState(state: ComicBuilderState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── fal API key (never leaves the browser) ──────────────────────────────────

export function storeFalKey(key: string): void {
  sessionStorage.setItem(FAL_KEY_STORAGE, key);
}

export function getFalKey(): string | null {
  return sessionStorage.getItem(FAL_KEY_STORAGE);
}

export function clearFalKey(): void {
  sessionStorage.removeItem(FAL_KEY_STORAGE);
}

export function hasFalKey(): boolean {
  return Boolean(sessionStorage.getItem(FAL_KEY_STORAGE));
}
