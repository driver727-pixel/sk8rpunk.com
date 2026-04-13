/**
 * External types matching the Skater-Punk-Deck-Builder app (punchskater.com) payload format v1.0.0.
 * These are the shapes produced by the Deck Builder's JSON export and URL card sharing.
 * Keep in sync with: https://github.com/driver727-pixel/Skater-Punk-Deck-Builder
 */

export type ExternalArchetype = "Runner" | "Ghost" | "Bruiser" | "Tech" | "Medic";

export type ExternalRarity = "Common" | "Uncommon" | "Rare" | "Legendary";

export type ExternalStyleVibe = "Street" | "Corporate" | "Underground" | "Neon" | "Chrome";

export type ExternalDistrict =
  | "Neon District"
  | "The Sprawl"
  | "Chrome Heights"
  | "Undercity"
  | "Corporate Core";

export interface ExternalCardStats {
  speed: number;
  stealth: number;
  tech: number;
  grit: number;
  rep: number;
}

export interface ExternalCardIdentity {
  name: string;
  crew: string;
  manufacturer: string;
  serialNumber: string;
}

export interface ExternalCardTraits {
  personalityTags: string[];
  passiveTrait: string;
  activeAbility: string;
}

export interface ExternalCardVisuals {
  helmetStyle: string;
  boardStyle: string;
  jacketStyle: string;
  colorScheme: string;
  accentColor: string;
}

export interface ExternalCardPrompts {
  archetype: ExternalArchetype;
  rarity: ExternalRarity;
  styleVibe: ExternalStyleVibe;
  district: ExternalDistrict;
  accentColor: string;
}

/** Full card payload exported by the Deck Builder (skpd-collection.json / per-deck JSON). */
export interface ExternalCardPayload {
  id: string;
  version: "1.0.0";
  prompts: ExternalCardPrompts;
  seed: string;
  identity: ExternalCardIdentity;
  stats: ExternalCardStats;
  traits: ExternalCardTraits;
  flavorText: string;
  visuals: ExternalCardVisuals;
  tags: string[];
  createdAt: string;
}

/** A named deck exported by the Deck Builder. */
export interface ExternalDeckPayload {
  id: string;
  version: "1.0.0";
  name: string;
  cards: ExternalCardPayload[];
  createdAt: string;
  updatedAt: string;
}

/** Full-collection export from the Deck Builder (skpd-collection.json). */
export interface ExternalCollectionPayload {
  version: "1.0.0";
  cards: ExternalCardPayload[];
  exportedAt: string;
}

/** Minimal URL-shareable card param written by the Deck Builder's share feature (?card=…). */
export interface ExternalCardUrlParam {
  archetype: ExternalArchetype;
  rarity: ExternalRarity;
  styleVibe: ExternalStyleVibe;
  district: ExternalDistrict;
  accentColor: string;
  seed: string;
}

export type ExternalImportPayload =
  | ExternalCardPayload
  | ExternalDeckPayload
  | ExternalCollectionPayload;
