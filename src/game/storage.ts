import { createInitialState } from "./content";
import type { GameState } from "./types";

const STORAGE_KEY = "skater-punk-state-v1";

export const loadState = (): GameState => {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }
    return JSON.parse(raw) as GameState;
  } catch {
    return createInitialState();
  }
};

export const saveState = (state: GameState): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
