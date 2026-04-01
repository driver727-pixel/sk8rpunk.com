import { describe, expect, it } from "vitest";
import { createCharacterCard } from "./generator/createCharacterCard";
import {
  buildCardExportPayload,
  buildDeckExportPayload,
  createDeck,
  createInitialForgeState,
} from "./storage";
import type { CharacterCardInput, CharacterCardSeeds } from "./types";

const input: CharacterCardInput = {
  archetype: "Signal Ghost",
  rarity: "Epic",
  vibe: "Signal Phantom",
  district: "Subgrid Ward",
  accentColor: "#a63cff",
};

const seeds: CharacterCardSeeds = {
  core: "core_seed_export",
  identity: "identity_seed_export",
  visuals: "visual_seed_export",
  mechanics: "mechanics_seed_export",
  flavor: "flavor_seed_export",
};

describe("card forge storage helpers", () => {
  it("creates an initial forge state with a default deck and draft", () => {
    const state = createInitialForgeState();

    expect(state.decks).toHaveLength(1);
    expect(state.activeDeckId).toBe(state.decks[0].id);
    expect(state.lastDraft).not.toBeNull();
    expect(state.lastInput).toEqual(state.lastDraft?.prompts);
  });

  it("builds card and deck export payloads with version markers", () => {
    const card = createCharacterCard(input, seeds, { createdAt: "2026-04-01T00:00:00.000Z" });
    const deck = createDeck("Ghost Relay", card.prompts.accentColor);
    const cardPayload = buildCardExportPayload(card);
    const deckPayload = buildDeckExportPayload(deck, [card]);

    expect(cardPayload.format).toBe("skater-punk.card.v1");
    expect(cardPayload.card.id).toBe(card.id);
    expect(deckPayload.format).toBe("skater-punk.deck.v1");
    expect(deckPayload.deck.name).toBe("Ghost Relay");
    expect(deckPayload.cards[0].serial).toBe(card.serial);
  });
});
