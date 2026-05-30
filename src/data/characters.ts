// ─────────────────────────────────────────────────────────────────────────────
// Character Bio data — Sk8r Punk™ Universe
// Source: Main Characters with Photos (official character doc)
// Images go in /public/characters/ when available.
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
  /** Path served from /public/characters/, e.g. "/characters/cassidy.jpg" */
  imagePath: string;
  imageAlt: string;
  accentColor: string;
};

export const characters: Character[] = [
  // ── Punch Skater™ ───────────────────────────────────────────────────────────
  {
    id: "cassidy",
    name: "Cassidy Cloud",
    source: "punch-skater",
    faction: "Punch Skater™ Crew",
    role: "Veteran Rider",
    bio: "49 years old. 5'8\", slender athletic build, blue straight hair down to her neck, and an attractive but aging face.",
    traits: ["Experience", "Athleticism", "Leadership"],
    imagePath: "/characters/cassidy.jpg",
    imageAlt: "Cassidy Cloud — veteran rider",
    accentColor: "#19f2ff",
  },
  {
    id: "bloodside",
    name: "Rosa Bluntside (Bloodside)",
    source: "punch-skater",
    faction: "Punch Skater™ Crew",
    role: "Street Rider",
    bio: "29 years old. 5'4\", petite athletic build, Latina descent with tan skin. Typically keeps her curly hair shaved or bald.",
    traits: ["Agility", "Street Fighting", "Grit"],
    imagePath: "/characters/bloodside.jpg",
    imageAlt: "Rosa Bluntside aka Bloodside — street rider",
    accentColor: "#ff3d3d",
  },
  {
    id: "guy-kaleb",
    name: "Guy Kaleb",
    source: "punch-skater",
    faction: "Punch Skater™ Crew",
    role: "Heavy Hitter",
    bio: "39 years old. 6'6\", large but out of shape, with curly short black hair colored neon purple.",
    traits: ["Power", "Intimidation", "Resilience"],
    imagePath: "/characters/guy-kaleb.jpg",
    imageAlt: "Guy Kaleb — heavy hitter",
    accentColor: "#a63cff",
  },
  {
    id: "seby",
    name: "Sebastian \"Seby\" Baltisar",
    source: "punch-skater",
    faction: "Punch Skater™ Crew",
    role: "Skilled Rider",
    bio: "40 years old. 5'11\", athletic build, and long straight blonde hair.",
    traits: ["Athleticism", "Technique", "Precision"],
    imagePath: "/characters/seby.jpg",
    imageAlt: "Sebastian \"Seby\" Baltisar — skilled rider",
    accentColor: "#ffd36a",
  },

  // ── Operation Nightshade ────────────────────────────────────────────────────
  {
    id: "emjay",
    name: "Mary Jane (EMJAY)",
    source: "operation-nightshade",
    faction: "Strike Team",
    role: "Field Operative",
    bio: "45 years old. 5'10\", weathered, and formerly athletic but quickly growing out of shape.",
    traits: ["Veteran Instincts", "Endurance", "Field Experience"],
    imagePath: "/characters/emjay.jpg",
    imageAlt: "Mary Jane aka EMJAY — field operative",
    accentColor: "#ff6a9a",
  },
  {
    id: "ben-shushka",
    name: "Ben Shushka",
    source: "operation-nightshade",
    faction: "Strike Team",
    role: "Operative",
    bio: "37 years old. 5'6\", overweight and out of shape, Lebanese descent with tan skin and dark complexion. Mostly bald, and often sporting a mustache.",
    traits: ["Street Smarts", "Tenacity", "Resourcefulness"],
    imagePath: "/characters/ben-shushka.jpg",
    imageAlt: "Ben Shushka — operative",
    accentColor: "#ff6a3d",
  },
  {
    id: "garibaldi",
    name: "Captain Garibaldi",
    source: "operation-nightshade",
    faction: "Command",
    role: "Commanding Officer",
    bio: "60 years old. Out of shape, dark skin, and balding.",
    traits: ["Command Authority", "Tactical Planning", "Experience"],
    imagePath: "/characters/garibaldi.jpg",
    imageAlt: "Captain Garibaldi — commanding officer",
    accentColor: "#6aff99",
  },
];
