/**
 * DeckImportService — handles all inbound data from the Deck Builder (punchskater.com).
 *
 * Supported import paths
 * ----------------------
 * 1. File import  — user downloads a JSON export from the Deck Builder and uploads it here.
 *                   Accepts: CollectionPayload, DeckPayload, or a single CardPayload (all v1.0.0).
 * 2. URL parameter— the Deck Builder encodes a card as `?card=<URLEncodedJSON>` when sharing.
 *                   The game reads this param on mount and surfaces it for the user to accept.
 *
 * Usage
 * -----
 *   import { parseDeckBuilderFile, readDeckBuilderUrlParam } from "../deck-import";
 *
 *   // On file drop / input[type=file] change:
 *   const result = await parseDeckBuilderFile(file);
 *
 *   // On app mount (URL deep-link):
 *   const urlCard = readDeckBuilderUrlParam();
 */

import {
  adaptExternalCard,
  adaptExternalCollection,
  adaptExternalDeck,
  adaptUrlParam,
} from "./adapter";
import type {
  ExternalCardPayload,
  ExternalCardUrlParam,
  ExternalCollectionPayload,
  ExternalDeckPayload,
} from "./types";
import type { CardDeck, CharacterCard, CharacterCardInput } from "../card-forge/types";

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export type DeckImportResultKind = "collection" | "deck" | "card";

export interface DeckImportResult {
  kind: DeckImportResultKind;
  cards: CharacterCard[];
  deck?: CardDeck;
  sourceId: string;
}

// ---------------------------------------------------------------------------
// Validation guards
// ---------------------------------------------------------------------------

const isExternalCardPayload = (data: unknown): data is ExternalCardPayload =>
  typeof data === "object" &&
  data !== null &&
  (data as ExternalCardPayload).version === "1.0.0" &&
  "seed" in data &&
  "identity" in data &&
  "stats" in data &&
  "traits" in data &&
  "visuals" in data;

const isExternalDeckPayload = (data: unknown): data is ExternalDeckPayload =>
  typeof data === "object" &&
  data !== null &&
  (data as ExternalDeckPayload).version === "1.0.0" &&
  "name" in data &&
  Array.isArray((data as ExternalDeckPayload).cards) &&
  (data as ExternalDeckPayload).cards.every(isExternalCardPayload);

const isExternalCollectionPayload = (data: unknown): data is ExternalCollectionPayload =>
  typeof data === "object" &&
  data !== null &&
  (data as ExternalCollectionPayload).version === "1.0.0" &&
  "exportedAt" in data &&
  Array.isArray((data as ExternalCollectionPayload).cards) &&
  (data as ExternalCollectionPayload).cards.every(isExternalCardPayload);

// ---------------------------------------------------------------------------
// File import
// ---------------------------------------------------------------------------

/**
 * Parse a File object containing a Deck Builder JSON export.
 * Throws if the payload is unrecognised or malformed.
 */
export const parseDeckBuilderFile = async (file: File): Promise<DeckImportResult> => {
  const text = await file.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON — could not parse the file.");
  }

  return parseDeckBuilderJson(data);
};

/**
 * Parse a raw (already-decoded) JavaScript value from a Deck Builder export.
 * Accepts CollectionPayload, DeckPayload, or a single CardPayload.
 */
export const parseDeckBuilderJson = (data: unknown): DeckImportResult => {
  if (isExternalCollectionPayload(data)) {
    return {
      kind: "collection",
      cards: adaptExternalCollection(data),
      sourceId: data.exportedAt,
    };
  }

  if (isExternalDeckPayload(data)) {
    const { deck, cards } = adaptExternalDeck(data);
    return { kind: "deck", cards, deck, sourceId: data.id };
  }

  if (isExternalCardPayload(data)) {
    return {
      kind: "card",
      cards: [adaptExternalCard(data)],
      sourceId: data.id,
    };
  }

  throw new Error(
    "Unrecognised payload — expected a Deck Builder v1.0.0 collection, deck, or card.",
  );
};

// ---------------------------------------------------------------------------
// URL parameter import  (?card=<URLEncodedJSON>)
// ---------------------------------------------------------------------------

/**
 * Read the `?card=` query parameter written by the Deck Builder's share feature.
 * Returns a `CharacterCardInput` suitable for passing to `createCharacterCard()`,
 * or `null` if the parameter is absent or malformed.
 *
 * The seed is returned separately so the caller can feed it to the card generator
 * for a deterministic re-creation of the shared card.
 */
export const readDeckBuilderUrlParam = (): {
  input: CharacterCardInput;
  seed: string;
} | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = new URLSearchParams(window.location.search).get("card");
  if (!raw) {
    return null;
  }

  try {
    const param = JSON.parse(decodeURIComponent(raw)) as ExternalCardUrlParam;
    if (
      !param.archetype ||
      !param.rarity ||
      !param.styleVibe ||
      !param.district ||
      !param.seed
    ) {
      return null;
    }
    return { input: adaptUrlParam(param), seed: param.seed };
  } catch {
    return null;
  }
};

/**
 * Remove the `?card=` parameter from the browser URL bar without triggering a
 * page reload. Call this after the imported card has been surfaced to the user.
 */
export const clearDeckBuilderUrlParam = (): void => {
  if (typeof window === "undefined") {
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("card");
  window.history.replaceState({}, "", url.toString());
};
