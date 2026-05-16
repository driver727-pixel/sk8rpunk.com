// ─────────────────────────────────────────────────────────────────────────────
// Character Bio data — Sk8r Punk Universe
// TODO: Replace placeholder names, bios, traits, and image paths with your
//       final content from the doc. Images go in /public/characters/.
// ─────────────────────────────────────────────────────────────────────────────

export type CharacterSource = "punch-skater" | "operation-nightshade";

export type Character = {
  id: string;
  name: string;
  source: CharacterSource;
  faction: string;
  role: string;
  bio: string;
  traits: string[];
  /** Path served from /public/characters/, e.g. "/characters/blade.jpg" */
  imagePath: string;
  imageAlt: string;
  accentColor: string;
};

export const characters: Character[] = [
  // ── Punch Skater ───────────────────────────────────────────────────────────
  {
    id: "blade",
    name: "Blade",
    source: "punch-skater",
    faction: "Rust Kids",
    role: "Scavenger Rider",
    bio: "Grew up stripping boards from the junkyard at age nine. Blade's custom rig runs on reclaimed cells and sheer stubbornness. Nobody out-grinds her on the back-street circuits — and nobody knows the scrap yards like she does.",
    traits: ["DIY Tech", "Grit", "Street Sense"],
    imagePath: "/characters/blade.jpg",
    imageAlt: "Blade — Rust Kids scavenger rider",
    accentColor: "#ff6a3d",
  },
  {
    id: "mirage",
    name: "Mirage",
    source: "punch-skater",
    faction: "Neon Saints",
    role: "Style Champion",
    bio: "Style is the weapon. Mirage skates like a performance, every trick calibrated for maximum crowd reaction. The leaderboard follows the audience, and the audience follows Mirage.",
    traits: ["Charisma", "Trick Mastery", "Crowd Pull"],
    imagePath: "/characters/mirage.jpg",
    imageAlt: "Mirage — Neon Saints style champion",
    accentColor: "#ff6a9a",
  },
  {
    id: "ghost0x",
    name: "Ghost_0x",
    source: "punch-skater",
    faction: "Signal Ghosts",
    role: "Route Hacker",
    bio: "You won't see Ghost_0x until it's already over. Route data, signal timing, district grid maps — Ghost cracks them all mid-run. The fastest path isn't the straightest one; it's the one nobody else sees.",
    traits: ["Hacking", "Stealth", "Route Intel"],
    imagePath: "/characters/ghost0x.jpg",
    imageAlt: "Ghost_0x — Signal Ghosts route hacker",
    accentColor: "#19f2ff",
  },
  {
    id: "apex",
    name: "APEX",
    source: "punch-skater",
    faction: "Chrome Syndicate",
    role: "Corporate Racer",
    bio: "Custom carbon deck, sponsored cells, and a support team monitoring every vital. APEX is the Syndicate's showcase asset — a racer built by committee to win at any cost. Behind the corporate mask is someone who actually loves the ride.",
    traits: ["Speed", "Corporate Backing", "Precision"],
    imagePath: "/characters/apex.jpg",
    imageAlt: "APEX — Chrome Syndicate corporate racer",
    accentColor: "#a63cff",
  },
  {
    id: "voltage",
    name: "Voltage",
    source: "punch-skater",
    faction: "Voltage Vultures",
    role: "Speed Extremist",
    bio: "Battery overclocked past safe limits. Voltage doesn't race to win — Voltage races to see how fast the streets can be made to blur. The Vultures respect nothing except velocity.",
    traits: ["Overclock", "Reckless Speed", "Battery Tech"],
    imagePath: "/characters/voltage.jpg",
    imageAlt: "Voltage — Voltage Vultures speed extremist",
    accentColor: "#ffd36a",
  },
  {
    id: "shade",
    name: "Shade",
    source: "punch-skater",
    faction: "Alley Wraiths",
    role: "Underground Courier",
    bio: "Shade knows every shortcut, back-route, and gap in the district grids that the official maps don't show. As an underground messenger, the job isn't about speed — it's about never being seen at all.",
    traits: ["Shortcuts", "Evasion", "Urban Knowledge"],
    imagePath: "/characters/shade.jpg",
    imageAlt: "Shade — Alley Wraiths underground courier",
    accentColor: "#6aff99",
  },

  // ── Operation Nightshade ────────────────────────────────────────────────────
  {
    id: "vex",
    name: "Commander Vex",
    source: "operation-nightshade",
    faction: "Strike Team",
    role: "Strike Team Lead",
    bio: "Former Chrome Syndicate enforcer turned rogue operative. Vex assembled the Nightshade unit after discovering how deep the district corruption ran. Cold, calculating, and loyal to the mission above all else.",
    traits: ["Tactical Command", "Close Combat", "Loyalty"],
    imagePath: "/characters/vex.jpg",
    imageAlt: "Commander Vex — Operation Nightshade strike team lead",
    accentColor: "#19f2ff",
  },
  {
    id: "cipher",
    name: "Cipher",
    source: "operation-nightshade",
    faction: "Strike Team",
    role: "Intelligence Operative",
    bio: "Cipher never shows a face without a reason. A master of cover identities, signals intelligence, and corporate infiltration. The Nightshade operation wouldn't have made it past planning without Cipher's network.",
    traits: ["Infiltration", "Signals Intel", "Deception"],
    imagePath: "/characters/cipher.jpg",
    imageAlt: "Cipher — Operation Nightshade intelligence operative",
    accentColor: "#a63cff",
  },
  {
    id: "nightshade",
    name: "Nightshade",
    source: "operation-nightshade",
    faction: "Unknown",
    role: "The Ghost Operative",
    bio: "No official record. No verified identity. Nightshade exists in signals, in rumours, and in the corners of mission debrief logs that someone keeps trying to redact. Whether ally or adversary is a question the team hasn't answered yet.",
    traits: ["Ghost Protocol", "Unknown Allegiance", "Specialist"],
    imagePath: "/characters/nightshade.jpg",
    imageAlt: "Nightshade — the ghost operative",
    accentColor: "#ff6a9a",
  },
];
