/**
 * Adapter: converts Deck Builder (punchskater.com) card payloads into the game's
 * internal CharacterCard format (skater-punk.card.v1).
 *
 * Mapping rationale
 * -----------------
 * Archetypes: the Deck Builder uses 5 broad classes; the game has 8 specialised roles.
 *   Runner     → Courier        (fast, delivery-focused)
 *   Ghost      → Signal Ghost   (stealth / signal work)
 *   Bruiser    → Trick Rider    (physical / aggressive)
 *   Tech       → Battery Hacker (technology focus)
 *   Medic      → Street Mechanic(repair / support)
 *
 * Style vibes:
 *   Street      → Riot Courier
 *   Corporate   → Holo Drifter
 *   Underground → Signal Phantom
 *   Neon        → Neon Outlaw
 *   Chrome      → Chrome Nomad
 *
 * Stats (Deck Builder → game):
 *   speed   → speed
 *   stealth → control
 *   grit    → power
 *   rep     → style
 *   tech    → tech
 *   cargo   → 5 (default; not tracked by Deck Builder)
 */

import type {
  ExternalArchetype,
  ExternalCardPayload,
  ExternalCardUrlParam,
  ExternalCollectionPayload,
  ExternalDeckPayload,
  ExternalStyleVibe,
} from "./types";
import type {
  CardDeck,
  CharacterArchetype,
  CharacterCard,
  CharacterCardInput,
  CharacterCardSeeds,
  CharacterCardStats,
  CharacterCardVisual,
  CardRarity,
  StyleVibe,
} from "../card-forge/types";

// ---------------------------------------------------------------------------
// Field mappings
// ---------------------------------------------------------------------------

const ARCHETYPE_MAP: Record<ExternalArchetype, CharacterArchetype> = {
  Runner: "Courier",
  Ghost: "Signal Ghost",
  Bruiser: "Trick Rider",
  Tech: "Battery Hacker",
  Medic: "Street Mechanic",
};

const VIBE_MAP: Record<ExternalStyleVibe, StyleVibe> = {
  Street: "Riot Courier",
  Corporate: "Holo Drifter",
  Underground: "Signal Phantom",
  Neon: "Neon Outlaw",
  Chrome: "Chrome Nomad",
};

const RARITY_MAP: Record<string, CardRarity> = {
  Common: "Common",
  Uncommon: "Uncommon",
  Rare: "Rare",
  Legendary: "Legendary",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mapRarity = (r: string): CardRarity => RARITY_MAP[r] ?? "Common";

const mapStats = (s: ExternalCardPayload["stats"]): CharacterCardStats => ({
  speed: s.speed,
  control: s.stealth,
  power: s.grit,
  cargo: 5,
  tech: s.tech,
  style: s.rep,
});

const mapVisuals = (v: ExternalCardPayload["visuals"]): CharacterCardVisual => ({
  silhouette: "standard",
  pose: "ready",
  face: "hidden",
  skinTone: "neutral",
  hairStyle: "short",
  hairColor: "dark",
  eyewear: v.helmetStyle,
  jacket: v.jacketStyle,
  pants: "cargo",
  shoes: "grip-sole",
  boardShape: v.boardStyle,
  deckGraphic: v.colorScheme,
  wheelFx: "none",
  background: v.colorScheme,
  frameStyle: "standard",
  emblem: "none",
});

const mapSeeds = (seed: string): CharacterCardSeeds => ({
  core: seed,
  identity: `${seed}-identity`,
  visuals: `${seed}-visuals`,
  mechanics: `${seed}-mechanics`,
  flavor: `${seed}-flavor`,
});

// ---------------------------------------------------------------------------
// Core conversion
// ---------------------------------------------------------------------------

/** Convert one Deck Builder CardPayload to the game's CharacterCard. */
export const adaptExternalCard = (payload: ExternalCardPayload): CharacterCard => {
  const archetype = ARCHETYPE_MAP[payload.prompts.archetype] ?? "Courier";
  const rarity = mapRarity(payload.prompts.rarity);
  const vibe = VIBE_MAP[payload.prompts.styleVibe] ?? "Neon Outlaw";

  const prompts: CharacterCardInput = {
    archetype,
    rarity,
    vibe,
    district: payload.prompts.district,
    accentColor: payload.prompts.accentColor,
  };

  return {
    id: payload.id,
    schemaVersion: "skater-punk.card.v1",
    createdAt: payload.createdAt,
    prompts,
    seeds: mapSeeds(payload.seed),
    name: payload.identity.name,
    archetype,
    rarity,
    crew: payload.identity.crew,
    manufacturer: payload.identity.manufacturer,
    personality: payload.traits.personalityTags,
    vibe,
    district: payload.prompts.district,
    stats: mapStats(payload.stats),
    passive: payload.traits.passiveTrait,
    ability: payload.traits.activeAbility,
    flavorText: payload.flavorText,
    visual: mapVisuals(payload.visuals),
    serial: payload.identity.serialNumber,
    exportTags: [...payload.tags, "imported", "deck-builder"],
  };
};

/** Convert a Deck Builder DeckPayload to a CardDeck + its CharacterCards. */
export const adaptExternalDeck = (
  payload: ExternalDeckPayload,
): { deck: CardDeck; cards: CharacterCard[] } => {
  const cards = payload.cards.map(adaptExternalCard);
  const deck: CardDeck = {
    id: payload.id,
    name: payload.name,
    description: `Imported from Deck Builder on ${new Date(payload.createdAt).toLocaleDateString()}.`,
    accentColor: payload.cards[0]?.prompts.accentColor ?? "#00e5ff",
    cardIds: cards.map((c) => c.id),
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  };
  return { deck, cards };
};

/** Convert a Deck Builder CollectionPayload to a flat array of CharacterCards. */
export const adaptExternalCollection = (
  payload: ExternalCollectionPayload,
): CharacterCard[] => payload.cards.map(adaptExternalCard);

/**
 * Build a minimal CharacterCardInput from the URL share param (?card=…).
 * The caller is expected to pass this to the card generator to re-derive the full card.
 */
export const adaptUrlParam = (param: ExternalCardUrlParam): CharacterCardInput => ({
  archetype: ARCHETYPE_MAP[param.archetype] ?? "Courier",
  rarity: mapRarity(param.rarity),
  vibe: VIBE_MAP[param.styleVibe] ?? "Neon Outlaw",
  district: param.district,
  accentColor: param.accentColor,
});
