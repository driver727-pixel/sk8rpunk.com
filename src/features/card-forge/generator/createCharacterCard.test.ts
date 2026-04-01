import { describe, expect, it } from "vitest";
import { createCharacterCard, rerollCharacterCard } from "./createCharacterCard";
import type { CharacterCardInput, CharacterCardSeeds } from "../types";

const input: CharacterCardInput = {
  archetype: "Courier",
  rarity: "Rare",
  vibe: "Neon Outlaw",
  district: "Mirror Harbor",
  accentColor: "#19f2ff",
};

const seeds: CharacterCardSeeds = {
  core: "core_seed_001",
  identity: "identity_seed_001",
  visuals: "visual_seed_001",
  mechanics: "mechanics_seed_001",
  flavor: "flavor_seed_001",
};

describe("createCharacterCard", () => {
  it("produces deterministic cards from the same prompts and seeds", () => {
    const first = createCharacterCard(input, seeds, { createdAt: "2026-04-01T00:00:00.000Z" });
    const second = createCharacterCard(input, seeds, { createdAt: "2026-04-01T00:00:00.000Z" });

    expect(second).toEqual(first);
  });

  it("rerolls only the targeted identity layer", () => {
    const card = createCharacterCard(input, seeds, { createdAt: "2026-04-01T00:00:00.000Z" });
    const rerolled = rerollCharacterCard(card, "identity", input);

    expect(rerolled.name).not.toBe(card.name);
    expect(rerolled.crew).not.toBe("");
    expect(rerolled.stats).toEqual(card.stats);
    expect(rerolled.visual).toEqual(card.visual);
    expect(rerolled.ability).toBe(card.ability);
    expect(rerolled.passive).toBe(card.passive);
    expect(rerolled.flavorText).toContain(rerolled.name);
  });

  it("normalizes invalid accent colors back to the default", () => {
    const card = createCharacterCard(
      {
        ...input,
        accentColor: "not-a-color",
      },
      seeds,
      { createdAt: "2026-04-01T00:00:00.000Z" },
    );

    expect(card.prompts.accentColor).toBe("#19f2ff");
  });
});
