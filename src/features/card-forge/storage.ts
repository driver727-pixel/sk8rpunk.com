import { createCharacterCard } from "./generator/createCharacterCard";
import { DEFAULT_FORGE_INPUT } from "./generator/tables";
import type {
  CardDeck,
  CardExportPayload,
  CharacterCard,
  DeckExportPayload,
  ForgeCollectionState,
} from "./types";

const STORAGE_KEY = "skater-punk-card-forge-v1";

const createDeckId = () => `deck_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const createDeck = (
  name = "Courier Alpha Deck",
  accentColor = DEFAULT_FORGE_INPUT.accentColor,
): CardDeck => {
  const now = new Date().toISOString();
  return {
    id: createDeckId(),
    name,
    description: "Starter cyberpunk courier deck for future game integration.",
    accentColor,
    cardIds: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const createInitialForgeState = (): ForgeCollectionState => {
  const defaultDeck = createDeck();
  return {
    cards: [],
    decks: [defaultDeck],
    activeDeckId: defaultDeck.id,
    lastDraft: createCharacterCard(DEFAULT_FORGE_INPUT),
    lastInput: { ...DEFAULT_FORGE_INPUT },
  };
};

const ensureValidState = (state: ForgeCollectionState): ForgeCollectionState => {
  const baseState = createInitialForgeState();
  const decks = state.decks.length > 0 ? state.decks : baseState.decks;
  const activeDeckId = decks.some((deck) => deck.id === state.activeDeckId)
    ? state.activeDeckId
    : decks[0].id;

  return {
    cards: Array.isArray(state.cards) ? state.cards : [],
    decks,
    activeDeckId,
    lastDraft: state.lastDraft ?? baseState.lastDraft,
    lastInput: state.lastInput ?? baseState.lastInput,
  };
};

export const loadForgeState = (): ForgeCollectionState => {
  if (typeof window === "undefined") {
    return createInitialForgeState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialForgeState();
    }

    return ensureValidState(JSON.parse(raw) as ForgeCollectionState);
  } catch {
    return createInitialForgeState();
  }
};

export const saveForgeState = (state: ForgeCollectionState): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const buildCardExportPayload = (card: CharacterCard): CardExportPayload => ({
  format: "skater-punk.card.v1",
  exportedAt: new Date().toISOString(),
  card,
});

export const buildDeckExportPayload = (
  deck: CardDeck,
  cards: CharacterCard[],
): DeckExportPayload => ({
  format: "skater-punk.deck.v1",
  exportedAt: new Date().toISOString(),
  deck,
  cards,
});

const triggerDownload = (filename: string, contents: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const blob = new Blob([contents], { type: "application/json;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
};

export const downloadCardExport = (card: CharacterCard) => {
  triggerDownload(
    `${card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "courier-card"}.json`,
    JSON.stringify(buildCardExportPayload(card), null, 2),
  );
};

export const downloadDeckExport = (deck: CardDeck, cards: CharacterCard[]) => {
  triggerDownload(
    `${deck.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "courier-deck"}.json`,
    JSON.stringify(buildDeckExportPayload(deck, cards), null, 2),
  );
};
