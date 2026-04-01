import type {
  CardRarity,
  CharacterArchetype,
  CharacterCard,
  CharacterCardInput,
  CharacterCardSeeds,
  CharacterCardStats,
  CharacterCardVisual,
  RerollTarget,
} from "../types";
import {
  ARCHETYPE_ABILITIES,
  ARCHETYPE_FOCUS,
  ARCHETYPE_PASSIVES,
  ARCHETYPE_STAT_BASES,
  CREW_BY_ARCHETYPE,
  CREWS,
  DEFAULT_FORGE_INPUT,
  DISTRICT_BACKDROPS,
  DISTRICT_SUFFIXES,
  FLAVOR_TEMPLATES,
  FORGE_DISTRICTS,
  MANUFACTURERS,
  NAME_PREFIXES_BY_VIBE,
  NAME_SUFFIXES,
  PERSONALITY_TAGS,
  RARITY_FRAME_COLORS,
  RARITY_STAT_BONUS,
  VIBE_STAT_MODIFIERS,
  VISUAL_TABLES,
} from "./tables";

const STAT_KEYS = ["speed", "control", "power", "cargo", "tech", "style"] as const;

type StatKey = (typeof STAT_KEYS)[number];

interface CreateCharacterCardOptions {
  createdAt?: string;
}

interface SeededIdentity {
  name: string;
  crew: string;
  manufacturer: string;
  personality: string[];
}

interface SeededMechanics {
  stats: CharacterCardStats;
  passive: string;
  ability: string;
}

const hashString = (value: string): number => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRandom = (seed: string) => {
  let state = hashString(seed) || 1;

  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

const randomId = (label: string) =>
  `${label}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

const pickOne = <T,>(random: () => number, values: readonly T[]): T =>
  values[Math.floor(random() * values.length)] ?? values[0];

const pickMany = <T,>(random: () => number, values: readonly T[], count: number): T[] => {
  const pool = [...values];
  const results: T[] = [];

  while (pool.length > 0 && results.length < count) {
    const index = Math.floor(random() * pool.length);
    const [item] = pool.splice(index, 1);
    if (item !== undefined) {
      results.push(item);
    }
  }

  return results;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeAccentColor = (value: string) => {
  const normalized = value.trim();
  return /^#[0-9a-f]{6}$/i.test(normalized) ? normalized.toLowerCase() : DEFAULT_FORGE_INPUT.accentColor;
};

const getDistrictPool = (district: string) => {
  const backgrounds = DISTRICT_BACKDROPS[district];
  if (backgrounds && backgrounds.length > 0) {
    return backgrounds;
  }

  return Object.values(DISTRICT_BACKDROPS).flat();
};

const getDistrictCode = (district: string) => {
  const letters = district
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);

  return letters || "CTY";
};

const getRarityCode = (rarity: CardRarity) => rarity.slice(0, 2).toUpperCase();

const createSerial = (rarity: CardRarity, district: string, seed: string) =>
  `${getRarityCode(rarity)}-${getDistrictCode(district)}-${seed.slice(-4).toUpperCase()}`;

const getCrewPool = (archetype: CharacterArchetype) => {
  const preferred = CREW_BY_ARCHETYPE[archetype];
  return preferred.length > 0 ? preferred : CREWS;
};

export const createCharacterCardSeeds = (): CharacterCardSeeds => ({
  core: randomId("core"),
  identity: randomId("identity"),
  visuals: randomId("visuals"),
  mechanics: randomId("mechanics"),
  flavor: randomId("flavor"),
});

export const rerollCharacterCardSeeds = (
  current: CharacterCardSeeds,
  target: RerollTarget,
): CharacterCardSeeds => {
  if (target === "all") {
    return createCharacterCardSeeds();
  }

  return {
    ...current,
    core: randomId("core"),
    identity: target === "identity" ? randomId("identity") : current.identity,
    visuals: target === "visuals" ? randomId("visuals") : current.visuals,
    mechanics: target === "mechanics" ? randomId("mechanics") : current.mechanics,
    flavor: target === "flavor" ? randomId("flavor") : current.flavor,
  };
};

const createIdentity = (input: CharacterCardInput, seeds: CharacterCardSeeds): SeededIdentity => {
  const random = createRandom(
    [seeds.identity, input.archetype, input.vibe, input.district, input.rarity].join("|"),
  );
  const prefix = pickOne(random, NAME_PREFIXES_BY_VIBE[input.vibe]);
  const suffixPool = [
    ...NAME_SUFFIXES,
    ...(DISTRICT_SUFFIXES[input.district] ?? DISTRICT_SUFFIXES[FORGE_DISTRICTS[0] ?? "Mirror Harbor"] ?? []),
  ];
  const name = `${prefix} ${pickOne(random, suffixPool)}`;
  const crew = pickOne(random, getCrewPool(input.archetype));
  const manufacturer = pickOne(random, MANUFACTURERS);
  const personality = pickMany(random, PERSONALITY_TAGS, 2);

  return {
    name,
    crew,
    manufacturer,
    personality,
  };
};

const createVisual = (
  input: CharacterCardInput,
  seeds: CharacterCardSeeds,
): CharacterCardVisual => {
  const random = createRandom([seeds.visuals, input.archetype, input.vibe, input.district, input.rarity].join("|"));
  const backdropPool = getDistrictPool(input.district);
  const frameColor = RARITY_FRAME_COLORS[input.rarity];

  return {
    silhouette: pickOne(random, VISUAL_TABLES.silhouettes),
    pose: pickOne(random, VISUAL_TABLES.poses),
    face: pickOne(random, VISUAL_TABLES.faces),
    skinTone: pickOne(random, VISUAL_TABLES.skinTones),
    hairStyle: pickOne(random, VISUAL_TABLES.hairStyles),
    hairColor: pickOne(random, VISUAL_TABLES.hairColors),
    eyewear: pickOne(random, VISUAL_TABLES.eyewear),
    jacket: pickOne(random, VISUAL_TABLES.jackets),
    pants: pickOne(random, VISUAL_TABLES.pants),
    shoes: pickOne(random, VISUAL_TABLES.shoes),
    boardShape: pickOne(random, VISUAL_TABLES.boardShapes),
    deckGraphic: pickOne(random, VISUAL_TABLES.deckGraphics),
    wheelFx: pickOne(random, VISUAL_TABLES.wheelFx),
    background: pickOne(random, backdropPool),
    frameStyle: `${slugify(input.rarity)}-${slugify(input.vibe)}-${frameColor.slice(1)}`,
    emblem: pickOne(random, VISUAL_TABLES.emblems),
  };
};

const createMechanics = (input: CharacterCardInput, seeds: CharacterCardSeeds): SeededMechanics => {
  const random = createRandom(
    [seeds.mechanics, input.archetype, input.vibe, input.rarity, input.district].join("|"),
  );
  const stats: CharacterCardStats = { ...ARCHETYPE_STAT_BASES[input.archetype] };
  const modifier = VIBE_STAT_MODIFIERS[input.vibe];

  for (const key of STAT_KEYS) {
    const bonus = modifier[key] ?? 0;
    const swing = Math.floor(random() * 3) - 1;
    stats[key] = clamp(stats[key] + bonus + swing, 1, 10);
  }

  const focus = ARCHETYPE_FOCUS[input.archetype];
  let rarityPoints = RARITY_STAT_BONUS[input.rarity];
  while (rarityPoints > 0) {
    const key = pickOne(random, focus);
    stats[key] = clamp(stats[key] + 1, 1, 10);
    rarityPoints -= 1;
  }

  return {
    stats,
    passive: pickOne(random, ARCHETYPE_PASSIVES[input.archetype]),
    ability: pickOne(random, ARCHETYPE_ABILITIES[input.archetype]),
  };
};

const createFlavorText = (input: CharacterCardInput, seeds: CharacterCardSeeds, name: string) => {
  const random = createRandom([seeds.flavor, input.vibe, input.district].join("|"));
  const template = pickOne(random, FLAVOR_TEMPLATES);
  return template.split("{district}").join(input.district).split("{name}").join(name);
};

const createCardId = (input: CharacterCardInput, seeds: CharacterCardSeeds) =>
  `card_${hashString([seeds.core, input.archetype, input.vibe, input.district].join("|")).toString(16)}`;

const getExportTags = (
  input: CharacterCardInput,
  identity: SeededIdentity,
  mechanics: SeededMechanics,
) => {
  const strongestStat =
    [...STAT_KEYS].sort((left, right) => mechanics.stats[right] - mechanics.stats[left])[0] ?? "speed";
  return [
    slugify(input.archetype),
    slugify(input.rarity),
    slugify(input.vibe),
    slugify(input.district),
    slugify(identity.crew),
    slugify(strongestStat),
  ];
};

export const createCharacterCard = (
  input: CharacterCardInput,
  seeds: CharacterCardSeeds = createCharacterCardSeeds(),
  options: CreateCharacterCardOptions = {},
): CharacterCard => {
  const prompts: CharacterCardInput = {
    ...input,
    accentColor: normalizeAccentColor(input.accentColor),
  };
  const createdAt = options.createdAt ?? new Date().toISOString();
  const identity = createIdentity(prompts, seeds);
  const mechanics = createMechanics(prompts, seeds);
  const visual = createVisual(prompts, seeds);
  const flavorText = createFlavorText(prompts, seeds, identity.name);

  return {
    id: createCardId(prompts, seeds),
    schemaVersion: "skater-punk.card.v1",
    createdAt,
    prompts,
    seeds,
    name: identity.name,
    archetype: prompts.archetype,
    rarity: prompts.rarity,
    crew: identity.crew,
    manufacturer: identity.manufacturer,
    personality: identity.personality,
    vibe: prompts.vibe,
    district: prompts.district,
    stats: mechanics.stats,
    passive: mechanics.passive,
    ability: mechanics.ability,
    flavorText,
    visual,
    serial: createSerial(prompts.rarity, prompts.district, seeds.core),
    exportTags: getExportTags(prompts, identity, mechanics),
  };
};

export const rerollCharacterCard = (
  card: CharacterCard,
  target: RerollTarget,
  input: CharacterCardInput = card.prompts,
): CharacterCard => createCharacterCard(input, rerollCharacterCardSeeds(card.seeds, target));
