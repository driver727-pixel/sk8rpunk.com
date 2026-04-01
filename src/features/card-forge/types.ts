export const ARCHETYPES = [
  "Courier",
  "Route Scout",
  "Battery Hacker",
  "Trick Rider",
  "Heavy Hauler",
  "Street Mechanic",
  "Signal Ghost",
  "Crew Captain",
] as const;

export const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary"] as const;

export const STYLE_VIBES = [
  "Neon Outlaw",
  "Signal Phantom",
  "Street Medic",
  "Freight Bruiser",
  "Holo Drifter",
  "Riot Courier",
  "Chrome Nomad",
  "Synthwave Idol",
] as const;

export type CharacterArchetype = (typeof ARCHETYPES)[number];
export type CardRarity = (typeof RARITIES)[number];
export type StyleVibe = (typeof STYLE_VIBES)[number];
export type RerollTarget = "all" | "identity" | "visuals" | "mechanics" | "flavor";

export interface CharacterCardInput {
  archetype: CharacterArchetype;
  rarity: CardRarity;
  vibe: StyleVibe;
  district: string;
  accentColor: string;
}

export interface CharacterCardSeeds {
  core: string;
  identity: string;
  visuals: string;
  mechanics: string;
  flavor: string;
}

export interface CharacterCardVisual {
  silhouette: string;
  pose: string;
  face: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyewear: string;
  jacket: string;
  pants: string;
  shoes: string;
  boardShape: string;
  deckGraphic: string;
  wheelFx: string;
  background: string;
  frameStyle: string;
  emblem: string;
}

export interface CharacterCardStats {
  speed: number;
  control: number;
  power: number;
  cargo: number;
  tech: number;
  style: number;
}

export interface CharacterCard {
  id: string;
  schemaVersion: "skater-punk.card.v1";
  createdAt: string;
  prompts: CharacterCardInput;
  seeds: CharacterCardSeeds;
  name: string;
  archetype: CharacterArchetype;
  rarity: CardRarity;
  crew: string;
  manufacturer: string;
  personality: string[];
  vibe: StyleVibe;
  district: string;
  stats: CharacterCardStats;
  passive: string;
  ability: string;
  flavorText: string;
  visual: CharacterCardVisual;
  serial: string;
  exportTags: string[];
}

export interface CardDeck {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ForgeCollectionState {
  cards: CharacterCard[];
  decks: CardDeck[];
  activeDeckId: string;
  lastDraft: CharacterCard | null;
  lastInput: CharacterCardInput;
}

export interface DeckExportPayload {
  format: "skater-punk.deck.v1";
  exportedAt: string;
  deck: CardDeck;
  cards: CharacterCard[];
}

export interface CardExportPayload {
  format: "skater-punk.card.v1";
  exportedAt: string;
  card: CharacterCard;
}
