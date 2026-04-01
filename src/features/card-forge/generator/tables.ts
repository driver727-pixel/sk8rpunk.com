import { DISTRICT_CARDS, ROUTES } from "../../../game/content";
import type {
  CardRarity,
  CharacterArchetype,
  CharacterCardInput,
  CharacterCardStats,
  StyleVibe,
} from "../types";

const districtSet = new Set<string>();

for (const route of ROUTES) {
  districtSet.add(route.district);
}

for (const card of DISTRICT_CARDS) {
  districtSet.add(card.zone);
}

export const FORGE_DISTRICTS = Array.from(districtSet);
export const DECK_SIZE_LIMIT = 12;

export const DEFAULT_FORGE_INPUT: CharacterCardInput = {
  archetype: "Courier",
  rarity: "Rare",
  vibe: "Neon Outlaw",
  district: FORGE_DISTRICTS[0] ?? "Mirror Harbor",
  accentColor: "#19f2ff",
};

export const RARITY_FRAME_COLORS: Record<CardRarity, string> = {
  Common: "#8a94b8",
  Uncommon: "#4fe07f",
  Rare: "#1edbff",
  Epic: "#b357ff",
  Legendary: "#ffbf47",
};

export const ARCHETYPE_STAT_BASES: Record<CharacterArchetype, CharacterCardStats> = {
  Courier: { speed: 8, control: 7, power: 4, cargo: 5, tech: 6, style: 7 },
  "Route Scout": { speed: 7, control: 8, power: 4, cargo: 4, tech: 7, style: 6 },
  "Battery Hacker": { speed: 6, control: 6, power: 4, cargo: 4, tech: 9, style: 6 },
  "Trick Rider": { speed: 8, control: 7, power: 5, cargo: 3, tech: 4, style: 9 },
  "Heavy Hauler": { speed: 4, control: 6, power: 8, cargo: 9, tech: 5, style: 4 },
  "Street Mechanic": { speed: 5, control: 6, power: 6, cargo: 5, tech: 8, style: 5 },
  "Signal Ghost": { speed: 7, control: 8, power: 4, cargo: 3, tech: 8, style: 7 },
  "Crew Captain": { speed: 6, control: 7, power: 6, cargo: 6, tech: 6, style: 8 },
};

export const VIBE_STAT_MODIFIERS: Record<StyleVibe, Partial<CharacterCardStats>> = {
  "Neon Outlaw": { speed: 1, style: 1, cargo: -1 },
  "Signal Phantom": { control: 1, tech: 1, power: -1 },
  "Street Medic": { cargo: 1, tech: 1, style: -1 },
  "Freight Bruiser": { power: 1, cargo: 1, speed: -1 },
  "Holo Drifter": { speed: 1, style: 1, power: -1 },
  "Riot Courier": { power: 1, control: 1, tech: -1 },
  "Chrome Nomad": { control: 1, cargo: 1, style: -1 },
  "Synthwave Idol": { style: 2, speed: 1, cargo: -1 },
};

export const RARITY_STAT_BONUS: Record<CardRarity, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 4,
  Legendary: 6,
};

export const ARCHETYPE_FOCUS: Record<CharacterArchetype, (keyof CharacterCardStats)[]> = {
  Courier: ["speed", "control", "style"],
  "Route Scout": ["control", "tech", "speed"],
  "Battery Hacker": ["tech", "control", "speed"],
  "Trick Rider": ["style", "speed", "control"],
  "Heavy Hauler": ["cargo", "power", "control"],
  "Street Mechanic": ["tech", "power", "cargo"],
  "Signal Ghost": ["tech", "control", "style"],
  "Crew Captain": ["style", "control", "cargo"],
};

export const CREWS = [
  "Night Voltage",
  "Ghostline Relay",
  "Temple Burners",
  "Chrome Exodus",
  "Lumen Drip",
  "Subgrid Saints",
  "Harbor Phantoms",
  "Overpass Choir",
  "Faultline Syndicate",
  "Velvet Static",
] as const;

export const MANUFACTURERS = [
  "VX Motion",
  "Arcline Dynamics",
  "Neon Riot Works",
  "Mirror Harbor Mobility",
  "Split Circuit Garage",
  "Voltwave Customs",
  "Ghostwheel Labs",
  "Temple Drift Co.",
] as const;

export const PERSONALITY_TAGS = [
  "Reckless",
  "Focused",
  "Merciful",
  "Quiet",
  "Magnetic",
  "Relentless",
  "Playful",
  "Paranoid",
  "Charismatic",
  "Disciplined",
  "Defiant",
  "Precise",
  "Feral",
  "Protective",
  "Ambitious",
] as const;

export const CREW_BY_ARCHETYPE: Record<CharacterArchetype, readonly string[]> = {
  Courier: ["Night Voltage", "Harbor Phantoms", "Overpass Choir"],
  "Route Scout": ["Ghostline Relay", "Harbor Phantoms", "Chrome Exodus"],
  "Battery Hacker": ["Subgrid Saints", "Ghostline Relay", "Faultline Syndicate"],
  "Trick Rider": ["Temple Burners", "Lumen Drip", "Velvet Static"],
  "Heavy Hauler": ["Faultline Syndicate", "Chrome Exodus", "Night Voltage"],
  "Street Mechanic": ["Subgrid Saints", "Split Circuit Garage", "Overpass Choir"],
  "Signal Ghost": ["Ghostline Relay", "Velvet Static", "Harbor Phantoms"],
  "Crew Captain": ["Night Voltage", "Temple Burners", "Chrome Exodus"],
};

export const DISTRICT_BACKDROPS: Record<string, readonly string[]> = {
  "Mirror Harbor": ["rain-harbor", "clinic-glass", "skyline-rails"],
  "Temple Strip": ["rooftop-ads", "crowd-neon", "fashion-lanes"],
  "Subgrid Ward": ["tunnel-grid", "substation-leak", "underbridge-pulse"],
  "Ion Heights": ["storm-overpass", "lux-habs", "mag-rail-spine"],
};

export const VISUAL_TABLES = {
  silhouettes: ["lean", "compact", "tower", "bruiser", "sprinter", "drift-frame"],
  poses: ["forward-push", "kickturn", "coiled-launch", "wide-brace", "low-slide", "air-brake"],
  faces: ["sharp", "soft", "scarred", "masked", "angelic", "worn"],
  skinTones: ["porcelain", "amber", "olive", "umber", "ebony", "rose-gold"],
  hairStyles: ["buzz-cut", "split-mohawk", "micro-braids", "glitch-bob", "long-sweep", "shaved-line"],
  hairColors: ["silver", "electric-blue", "ultraviolet", "acid-lime", "jet-black", "rose-neon"],
  eyewear: ["half-visor", "mirror-goggles", "signal-mask", "bare-eyes", "holo-lens", "optic-patch"],
  jackets: ["reflective-bomber", "storm-shell", "utility-vest", "patched-coat", "signal-cape", "riot-jacket"],
  pants: ["techwear-tapered", "cargo-rig", "armored-knees", "street-slim", "storm-gaiters", "flight-wraps"],
  shoes: ["shock-grips", "mag-boots", "soft-soles", "impact-high-tops", "rail-studs", "vector-sneaks"],
  boardShapes: ["racing-deck", "hauler-deck", "split-tail", "trick-short", "wide-cruiser", "blade-runner"],
  deckGraphics: ["voltage-tiger", "glitch-koi", "hazard-checker", "night-runner", "static-sigil", "angel-wire"],
  wheelFx: ["electric-blue", "magenta-sparks", "acid-lime", "amber-burn", "violet-arc", "white-static"],
  emblems: ["courier-sigil", "ghost-wave", "riot-crown", "drift-cross", "split-bolt", "spiral-eye"],
} as const;

export const NAME_PREFIXES_BY_VIBE: Record<StyleVibe, readonly string[]> = {
  "Neon Outlaw": ["Vex", "Nyx", "Riot", "Hex", "Jett"],
  "Signal Phantom": ["Echo", "Silk", "Shade", "Cipher", "Sable"],
  "Street Medic": ["Medi", "Pulse", "Halo", "Mercy", "Sana"],
  "Freight Bruiser": ["Torque", "Brick", "Kilo", "Ram", "Forge"],
  "Holo Drifter": ["Luma", "Nova", "Prism", "Glint", "Astra"],
  "Riot Courier": ["Crash", "Raze", "Mako", "Havoc", "Clash"],
  "Chrome Nomad": ["Rove", "Dust", "Cinder", "Vanta", "Stray"],
  "Synthwave Idol": ["Velour", "Muse", "Lux", "Cherry", "Violet"],
};

export const NAME_SUFFIXES = [
  "Halo",
  "Vector",
  "Flux",
  "Static",
  "Hollow",
  "Jett",
  "Circuit",
  "Quill",
  "Vane",
  "Zero",
  "Drift",
  "Wire",
] as const;

export const DISTRICT_SUFFIXES: Record<string, readonly string[]> = {
  "Mirror Harbor": ["Glass", "Harbor", "Pier", "Chrome"],
  "Temple Strip": ["Velvet", "Temple", "Neon", "Catwalk"],
  "Subgrid Ward": ["Subgrid", "Ward", "Relay", "Tunnel"],
  "Ion Heights": ["Ion", "Storm", "Spire", "Arc"],
};

export const ARCHETYPE_PASSIVES: Record<CharacterArchetype, readonly string[]> = {
  Courier: ["Shortcut Memory", "Dispatch Drift", "Slipstream Ledger"],
  "Route Scout": ["District Echo", "Path Preview", "Heatmap Sense"],
  "Battery Hacker": ["Overcharge Thread", "Cell Splice", "Ghost Volt"],
  "Trick Rider": ["Crowd Roar", "Rail Poetry", "Momentum Theft"],
  "Heavy Hauler": ["Mass Lock", "Cargo Anchor", "Impact Guard"],
  "Street Mechanic": ["Field Repair", "Patch Loop", "Garage Whisper"],
  "Signal Ghost": ["Blind Spot", "Jam Bloom", "Silent Beacon"],
  "Crew Captain": ["Crew Tempo", "Panic Calm", "Route Command"],
};

export const ARCHETYPE_ABILITIES: Record<CharacterArchetype, readonly string[]> = {
  Courier: ["Surge Lane", "Parcel Dive", "Quickroute Flash"],
  "Route Scout": ["Skyline Read", "Scout Ping", "Off-Ramp Window"],
  "Battery Hacker": ["Blackout Kick", "Voltage Borrow", "Chain Recharge"],
  "Trick Rider": ["Rail Bloom", "Flip Burst", "Spotlight Feint"],
  "Heavy Hauler": ["Freight Crash", "Anchor Line", "Bulkhead Roll"],
  "Street Mechanic": ["Spark Stitch", "Servo Tune", "Emergency Swap"],
  "Signal Ghost": ["White Noise Run", "Ghost Marker", "Null Channel"],
  "Crew Captain": ["Crew Sync", "Dispatch Override", "Command Echo"],
};

export const FLAVOR_TEMPLATES = [
  "On {district} nights, {name} leaves sparks where tires should never touch.",
  "{name} treats every {district} delivery like an audition for legend status.",
  "Rumor says {name} can hear the city grid breathe before a route collapses.",
  "{name} runs {district} on instinct, static, and one impossible grin.",
  "If the contract smells risky, {name} only tightens the trucks and leans in.",
] as const;

export const OPEN_SOURCE_STACK = [
  "React + TypeScript + Vite for the app shell",
  "Procedural SVG and CSS card art generated in-app",
  "JSON deck export intended for future game ingestion",
  "No closed or proprietary art packs required for this MVP",
] as const;
