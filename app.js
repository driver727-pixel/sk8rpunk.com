const STORAGE_KEY = "skater-punk-card-forge-saves";
const DECK_STORAGE_KEY = "skater-punk-card-forge-active-deck";
const DECK_SIZE = 6;
const DEFAULT_SEED = "night-shift";
const DEFAULTS = {
  archetype: "Courier",
  rarity: "Rare",
  vibe: "Neon Outlaw",
  personality: "Reckless",
  accent: "#00c2ff",
  seed: DEFAULT_SEED,
};

const ARCHETYPES = {
  Courier: {
    crewBias: ["Night Voltage", "Rush Circuit", "Parcel Vultures"],
    stats: { speed: 3, control: 2, power: -1, cargo: 0, tech: 1, style: 1 },
    abilities: ["Surge Lane", "Slipstream Drop", "Sidewalk Ghost"],
    passives: ["Shortcuts", "Route Memory", "Rush Window"],
    boards: ["narrow_racing_deck", "delivery_sprint", "hover_tail"],
    outfits: ["reflective_bomber", "signal_hoodie", "district_windbreaker"],
  },
  "Trick Rider": {
    crewBias: ["Chrome Serpents", "Spark Saints", "Back-Alley Angels"],
    stats: { speed: 1, control: 2, power: 0, cargo: -2, tech: 0, style: 4 },
    abilities: ["Rail Halo", "Static Flip", "Crowd Breaker"],
    passives: ["Style Stacks", "Afterimage", "Loose Trucks"],
    boards: ["freestyle_split", "kicktail_arc", "street_comet"],
    outfits: ["patchwork_leather", "glow_mesh", "sleeveless_armor"],
  },
  "Battery Hacker": {
    crewBias: ["Gridbreak Union", "Volt Sifters", "Ghost Charge"],
    stats: { speed: 0, control: 1, power: -1, cargo: 0, tech: 4, style: 1 },
    abilities: ["Amp Hijack", "Brownout Pulse", "Charge Leech"],
    passives: ["Field Diagnostics", "Battery Savant", "Soft Reset"],
    boards: ["diagnostic_longboard", "coil_runner", "grid_slicer"],
    outfits: ["circuit_trench", "tool_vest", "insulated_shell"],
  },
  "Route Scout": {
    crewBias: ["Skyline Relay", "Signal Owls", "Map Burners"],
    stats: { speed: 2, control: 3, power: -1, cargo: 0, tech: 1, style: 1 },
    abilities: ["Roofline Cut", "Signal Ping", "Blind Corner"],
    passives: ["Hazard Sense", "Wayfinder", "Line of Sight"],
    boards: ["survey_glider", "lane_crawler", "elevation_scout"],
    outfits: ["weather_shell", "utility_vest", "night_runner_coat"],
  },
  "Heavy Hauler": {
    crewBias: ["Brickline Cartel", "Cargo Phantoms", "Dock Rats"],
    stats: { speed: -2, control: 0, power: 4, cargo: 4, tech: 0, style: -1 },
    abilities: ["Dead Weight", "Freight Drift", "Shock Brace"],
    passives: ["Overbuilt", "Bulk Momentum", "Load Lock"],
    boards: ["cargo_plank", "wide_truck_brute", "maglift_runner"],
    outfits: ["reinforced_parka", "strap_harness", "hauler_rig"],
  },
  "Street Mechanic": {
    crewBias: ["Grease Neon", "Pit Pulse", "Wrench Syndicate"],
    stats: { speed: 0, control: 1, power: 1, cargo: 1, tech: 3, style: 0 },
    abilities: ["Quick Tune", "Bolt Rain", "Emergency Patch"],
    passives: ["Spare Parts", "Workshop Instinct", "Field Repair"],
    boards: ["garage_special", "welded_runner", "tinker_tail"],
    outfits: ["grease_jacket", "shop_apron_rig", "mag_boot_coveralls"],
  },
  "Signal Ghost": {
    crewBias: ["Static Choir", "Midnight Null", "Echo Fade"],
    stats: { speed: 2, control: 1, power: -1, cargo: -1, tech: 3, style: 2 },
    abilities: ["Fade Packet", "Ghost Trail", "Dead Channel"],
    passives: ["Low Profile", "Silent Bearings", "Phase Noise"],
    boards: ["shadow_glass", "signal_fade", "night_null"],
    outfits: ["ghost_cloak", "fiber_coat", "hush_layer"],
  },
  "Crew Captain": {
    crewBias: ["Night Voltage", "Chrome Serpents", "Skyline Relay"],
    stats: { speed: 1, control: 2, power: 1, cargo: 1, tech: 1, style: 2 },
    abilities: ["Call the Line", "Lead Push", "Pack Sync"],
    passives: ["Command Presence", "Crew Bond", "Priority Signal"],
    boards: ["captains_mark", "formation_edge", "district_standard"],
    outfits: ["command_coat", "ranked_leather", "crest_jacket"],
  },
};

const RARITIES = {
  Common: { modifier: 0, frame: "#64748b", glow: 0.18 },
  Uncommon: { modifier: 1, frame: "#34d399", glow: 0.22 },
  Rare: { modifier: 2, frame: "#38bdf8", glow: 0.27 },
  Epic: { modifier: 3, frame: "#c084fc", glow: 0.34 },
};

const STYLE_VIBES = {
  "Neon Outlaw": {
    palettes: [
      ["#00cfff", "#102033", "#ff4c9f"],
      ["#00f0ff", "#1a1336", "#ff5db1"],
    ],
    backgrounds: ["city_alley_rain", "rail_yard_haze", "arcade_boulevard"],
    personalities: ["Reckless", "Flashy", "Defiant"],
  },
  "Courier Noir": {
    palettes: [
      ["#7dd3fc", "#111827", "#d1d5db"],
      ["#a5f3fc", "#172033", "#f8fafc"],
    ],
    backgrounds: ["midnight_bridge", "warehouse_row", "subway_shadow"],
    personalities: ["Focused", "Calm", "Detached"],
  },
  "Garage Riot": {
    palettes: [
      ["#fb923c", "#1c1917", "#facc15"],
      ["#f97316", "#111827", "#f59e0b"],
    ],
    backgrounds: ["scrapyard_fire", "repair_bay", "industrial_backlot"],
    personalities: ["Loud", "Practical", "Stubborn"],
  },
  "Chrome Drift": {
    palettes: [
      ["#c084fc", "#0f172a", "#67e8f9"],
      ["#d8b4fe", "#172554", "#a5f3fc"],
    ],
    backgrounds: ["overpass_twilight", "drift_tunnel", "district_skyline"],
    personalities: ["Smooth", "Aloof", "Patient"],
  },
  "Static Mystic": {
    palettes: [
      ["#22d3ee", "#111827", "#a78bfa"],
      ["#38bdf8", "#1e1b4b", "#c084fc"],
    ],
    backgrounds: ["signal_temple", "antenna_roof", "fog_node"],
    personalities: ["Strange", "Intense", "Intuitive"],
  },
};

const GIVEN_NAMES = ["Vex", "Nova", "Rook", "Jett", "Nyx", "Kade", "Mako", "Zuri", "Halo", "Rune", "Sable", "Lux", "Echo", "Iris", "Juno", "Onyx"];
const FAMILY_NAMES = ["Halo", "Vector", "Circuit", "Flux", "Vale", "Quartz", "Drift", "Warden", "Static", "Knox", "Vandal", "Serrin", "Byte", "Ash", "Neon", "Skell"];
const POSES = ["forward_push", "wide_carve", "manual_pop", "crouched_sprint", "one_foot_glide", "board_drag_turn"];
const HAIR_STYLES = ["undercut", "buzzed_sides", "braided_tail", "storm_curl", "split_bangs", "spike_hawk", "long_slick"];
const HAIR_COLORS = ["silver", "acid_green", "burnt_orange", "electric_blue", "violet_black", "white_blonde", "rose_gold"];
const EYEWEAR = ["half_visor", "signal_goggles", "mono_scope", "mirror_shades", "no_eyewear"];
const PANTS = ["techwear_tapered", "cargo_straps", "reinforced_denim", "shock_mesh", "storm_joggers"];
const SHOES = ["shock_grip_high_tops", "grind_boots", "mag_lace_runners", "insulated_lowcuts", "holo_sneaks"];
const BODY_TYPES = ["lean", "compact", "tall", "athletic", "stocky"];
const PERSONALITY_POOL = ["Reckless", "Focused", "Detached", "Loud", "Smooth", "Patient", "Practical", "Defiant", "Intense", "Clever", "Ambitious", "Unshaken"];
const FLAVOR_OPENERS = ["If traffic is legal,", "By dawn,", "Under neon rain,", "When the route goes dark,", "Nobody owns the fast lane when"];
const FLAVOR_CLOSERS = ["they are already gone.", "the board starts singing.", "the district lights bend around them.", "the package gets there anyway.", "the sparks have already told the story."];
const STAT_KEYS = ["speed", "control", "power", "cargo", "tech", "style"];

const state = {
  form: { ...DEFAULTS },
  channels: {
    name: `${DEFAULT_SEED}|name|0`,
    visuals: `${DEFAULT_SEED}|visuals|0`,
    stats: `${DEFAULT_SEED}|stats|0`,
  },
  currentCard: null,
  collection: loadCollection(),
  deck: loadDeck(),
};

function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function seedFn() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createRng(seedText) {
  const seed = xmur3(seedText)();
  return mulberry32(seed);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function normalizeSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function titleCaseSlug(value) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function randomSeed() {
  return `seed-${Math.random().toString(36).slice(2, 8)}`;
}

function newChannelSeed(channel) {
  return `${state.form.seed.trim() || DEFAULT_SEED}|${channel}|${Math.random().toString(36).slice(2, 8)}`;
}

function syncChannelsFromBaseSeed() {
  const baseSeed = state.form.seed.trim() || DEFAULT_SEED;
  state.channels.name = `${baseSeed}|name|0`;
  state.channels.visuals = `${baseSeed}|visuals|0`;
  state.channels.stats = `${baseSeed}|stats|0`;
}

function populateSelect(select, options, selected) {
  select.innerHTML = options
    .map((option) => `<option value="${option}" ${option === selected ? "selected" : ""}>${option}</option>`)
    .join("");
}

function statLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function currentLocks() {
  return {
    name: document.querySelector("#lock-name").checked,
    visuals: document.querySelector("#lock-visuals").checked,
    stats: document.querySelector("#lock-stats").checked,
  };
}

function buildIdentity(formState, seed) {
  const rng = createRng(seed);
  const archetype = ARCHETYPES[formState.archetype];
  const vibe = STYLE_VIBES[formState.vibe];
  const chosenPersonality = formState.personality;
  const secondaryPool = PERSONALITY_POOL.filter((item) => item !== chosenPersonality);
  const first = pick(rng, GIVEN_NAMES);
  const last = pick(rng, FAMILY_NAMES);
  const name = `${first} ${last}`;

  return {
    id: `card_${Math.floor(rng() * 100000).toString().padStart(5, "0")}`,
    name,
    crew: pick(rng, archetype.crewBias),
    personality: [chosenPersonality, pick(rng, secondaryPool.length ? secondaryPool : vibe.personalities)],
    passive: pick(rng, archetype.passives),
    ability: pick(rng, archetype.abilities),
    flavorText: `${pick(rng, FLAVOR_OPENERS)} ${first} ${pick(rng, FLAVOR_CLOSERS)}`,
  };
}

function buildVisuals(formState, seed) {
  const rng = createRng(seed);
  const archetype = ARCHETYPES[formState.archetype];
  const vibe = STYLE_VIBES[formState.vibe];
  const palette = [...pick(rng, vibe.palettes)];
  palette[0] = formState.accent || palette[0];

  return {
    body: pick(rng, BODY_TYPES),
    pose: pick(rng, POSES),
    hair: pick(rng, HAIR_STYLES),
    hairColor: pick(rng, HAIR_COLORS),
    eyewear: pick(rng, EYEWEAR),
    jacket: pick(rng, archetype.outfits),
    pants: pick(rng, PANTS),
    shoes: pick(rng, SHOES),
    board: pick(rng, archetype.boards),
    deckGraphic: `${normalizeSlug(formState.vibe)}-${Math.floor(rng() * 24 + 1)}`,
    wheelFx: palette[0],
    palette,
    background: pick(rng, vibe.backgrounds),
  };
}

function buildStats(formState, seed) {
  const rng = createRng(seed);
  const baseline = { speed: 5, control: 5, power: 5, cargo: 5, tech: 5, style: 5 };
  const weights = ARCHETYPES[formState.archetype].stats;
  const rarityMod = RARITIES[formState.rarity].modifier;

  for (const key of STAT_KEYS) {
    baseline[key] = clamp(
      baseline[key] + weights[key] + Math.floor(rng() * 3) - 1 + Math.floor(rarityMod / 2),
      1,
      10
    );
  }

  const boostedKey = pick(rng, STAT_KEYS);
  baseline[boostedKey] = clamp(baseline[boostedKey] + rarityMod, 1, 10);
  return baseline;
}

function generateCard(formState) {
  const identity = buildIdentity(formState, state.channels.name);
  const visual = buildVisuals(formState, state.channels.visuals);
  const stats = buildStats(formState, state.channels.stats);
  const rarityInfo = RARITIES[formState.rarity];
  const serialSeed = `${state.channels.name}|${state.channels.visuals}|${state.channels.stats}`;
  const serialRng = createRng(serialSeed);

  return {
    id: identity.id,
    seed: formState.seed.trim() || DEFAULT_SEED,
    channels: { ...state.channels },
    archetype: formState.archetype,
    rarity: formState.rarity,
    vibe: formState.vibe,
    accent: formState.accent,
    crew: identity.crew,
    name: identity.name,
    personality: identity.personality,
    passive: identity.passive,
    ability: identity.ability,
    flavorText: identity.flavorText,
    visual,
    stats,
    renderConfig: {
      frame: rarityInfo.frame,
      glow: rarityInfo.glow,
      palette: visual.palette,
      serial: `${normalizeSlug(formState.archetype).slice(0, 3).toUpperCase()}-${normalizeSlug(formState.vibe)
        .slice(0, 3)
        .toUpperCase()}-${Math.floor(serialRng() * 900 + 100)}`,
    },
  };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createCardSvg(card, suffix = "preview") {
  const [accent, dark, pop] = card.visual.palette;
  const visorColor = card.visual.eyewear === "no_eyewear" ? "#0f172a" : accent;
  const hairFill = {
    silver: "#e2e8f0",
    acid_green: "#84cc16",
    burnt_orange: "#f97316",
    electric_blue: "#38bdf8",
    violet_black: "#4c1d95",
    white_blonde: "#fef3c7",
    rose_gold: "#f9a8d4",
  }[card.visual.hairColor] || accent;

  return `
  <svg viewBox="0 0 360 520" role="img" aria-label="${escapeHtml(card.name)} card preview" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardBg-${suffix}" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="${dark}" />
        <stop offset="100%" stop-color="#05070d" />
      </linearGradient>
      <linearGradient id="artGlow-${suffix}" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
        <stop offset="100%" stop-color="${pop}" stop-opacity="0.9" />
      </linearGradient>
      <filter id="blurGlow-${suffix}">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>
    <rect x="8" y="8" width="344" height="504" rx="24" fill="url(#cardBg-${suffix})" stroke="${card.renderConfig.frame}" stroke-width="4"/>
    <rect x="22" y="22" width="316" height="56" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>
    <text x="36" y="48" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700">${escapeHtml(card.name)}</text>
    <text x="36" y="68" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="12" letter-spacing="2">${escapeHtml(card.rarity.toUpperCase())} // ${escapeHtml(card.crew.toUpperCase())}</text>
    <rect x="22" y="92" width="316" height="228" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
    <circle cx="256" cy="156" r="62" fill="${accent}" opacity="${card.renderConfig.glow}" filter="url(#blurGlow-${suffix})"/>
    <circle cx="100" cy="224" r="44" fill="${pop}" opacity="0.18" filter="url(#blurGlow-${suffix})"/>
    <path d="M50 274 C108 154, 208 132, 286 282" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" opacity="0.72"/>
    <path d="M74 252 C124 132, 194 132, 226 208" fill="none" stroke="url(#artGlow-${suffix})" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="180" cy="182" rx="32" ry="38" fill="#f1f5f9"/>
    <path d="M148 168 Q180 130 212 168" fill="${hairFill}" opacity="0.95"/>
    <rect x="154" y="174" width="52" height="12" rx="6" fill="${visorColor}" opacity="0.92"/>
    <rect x="144" y="214" width="74" height="92" rx="28" fill="${pop}" opacity="0.9"/>
    <path d="M142 242 L98 318" stroke="#dbeafe" stroke-width="12" stroke-linecap="round"/>
    <path d="M220 240 L258 306" stroke="#dbeafe" stroke-width="12" stroke-linecap="round"/>
    <path d="M170 304 L142 374" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
    <path d="M208 304 L246 360" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
    <rect x="96" y="342" width="192" height="24" rx="12" fill="#0f172a" stroke="${accent}" stroke-width="4"/>
    <circle cx="120" cy="370" r="18" fill="${accent}"/>
    <circle cx="264" cy="370" r="18" fill="${accent}"/>
    <text x="36" y="304" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="11" letter-spacing="2">${escapeHtml(card.visual.background.replaceAll("_", " ").toUpperCase())}</text>
    <rect x="22" y="336" width="316" height="96" rx="18" fill="rgba(2,6,23,0.78)" stroke="rgba(255,255,255,0.08)"/>
    <text x="36" y="360" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700">${escapeHtml(card.archetype)} // ${escapeHtml(card.personality.join(" / "))}</text>
    <text x="36" y="384" fill="#e2e8f0" font-family="Inter, Arial, sans-serif" font-size="13">Passive: ${escapeHtml(card.passive)}</text>
    <text x="36" y="406" fill="#e2e8f0" font-family="Inter, Arial, sans-serif" font-size="13">Ability: ${escapeHtml(card.ability)}</text>
    <text x="36" y="424" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="11" font-style="italic">${escapeHtml(`"${card.flavorText}"`)}</text>
    <rect x="22" y="444" width="316" height="56" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>
    <text x="36" y="468" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="12" letter-spacing="1.5">SERIAL ${escapeHtml(card.renderConfig.serial)}</text>
    <text x="36" y="488" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="11">${escapeHtml(titleCaseSlug(card.visual.board))} // ${escapeHtml(titleCaseSlug(card.visual.jacket))}</text>
  </svg>
  `;
}

function createStatRows(stats, accent) {
  return STAT_KEYS.map((key) => {
    const value = stats[key];
    const fill = Math.round((value / 10) * 100);
    return `
      <div class="stat-row">
        <span>${statLabel(key)}</span>
        <div class="stat-bar"><div class="stat-bar-fill" style="width:${fill}%; background: linear-gradient(90deg, ${accent}, rgba(255,255,255,0.85));"></div></div>
        <strong>${value}</strong>
      </div>
    `;
  }).join("");
}

function createSummary(card) {
  return `
    <div class="detail-card">
      <h3>Identity</h3>
      <div class="identity">
        <strong>${escapeHtml(card.name)}</strong>
        <span>${escapeHtml(card.rarity)} ${escapeHtml(card.archetype)} from ${escapeHtml(card.crew)}</span>
        <span>${escapeHtml(card.personality.join(" / "))}</span>
      </div>
    </div>
    <div class="detail-card">
      <h3>Visual build</h3>
      <ul class="meta-list">
        <li>${escapeHtml(titleCaseSlug(card.visual.body))} body in ${escapeHtml(titleCaseSlug(card.visual.pose))} pose</li>
        <li>${escapeHtml(titleCaseSlug(card.visual.hair))} hair in ${escapeHtml(titleCaseSlug(card.visual.hairColor))}</li>
        <li>${escapeHtml(titleCaseSlug(card.visual.jacket))}, ${escapeHtml(titleCaseSlug(card.visual.pants))}, ${escapeHtml(titleCaseSlug(card.visual.shoes))}</li>
        <li>${escapeHtml(titleCaseSlug(card.visual.board))} with ${escapeHtml(card.visual.deckGraphic)}</li>
      </ul>
    </div>
    <div class="detail-card">
      <h3>Abilities</h3>
      <p><strong>Passive:</strong> ${escapeHtml(card.passive)}</p>
      <p><strong>Ability:</strong> ${escapeHtml(card.ability)}</p>
      <p><strong>Flavor:</strong> "${escapeHtml(card.flavorText)}"</p>
    </div>
  `;
}

function createCollectionItem(card, index) {
  return `
    <article class="collection-card" data-index="${index}">
      <div class="mini-card">${createCardSvg(card, `saved-${index}`)}</div>
      <strong>${escapeHtml(card.name)}</strong>
      <div class="collection-meta">${escapeHtml(card.rarity)} ${escapeHtml(card.archetype)} // ${escapeHtml(card.renderConfig.serial)}</div>
      <div class="button-grid">
        <button type="button" class="primary-button collection-load-button" data-index="${index}">Load</button>
        <button type="button" class="text-button collection-delete-button" data-index="${index}">Delete</button>
      </div>
    </article>
  `;
}

function loadCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function loadDeck() {
  try {
    const deck = JSON.parse(localStorage.getItem(DECK_STORAGE_KEY) || "[]");
    if (!Array.isArray(deck)) {
      return [];
    }
    return deck.slice(0, DECK_SIZE);
  } catch {
    return [];
  }
}

function persistCollection() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.collection));
}

function persistDeck() {
  localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(state.deck));
}

function setStatus(message) {
  const statusNode = document.querySelector("#generator-state");
  statusNode.innerHTML = `
    <div>
      <dt>Base seed</dt>
      <dd>${escapeHtml(state.form.seed || DEFAULT_SEED)}</dd>
    </div>
    <div>
      <dt>Name seed</dt>
      <dd>${escapeHtml(state.channels.name)}</dd>
    </div>
    <div>
      <dt>Visual seed</dt>
      <dd>${escapeHtml(state.channels.visuals)}</dd>
    </div>
    <div>
      <dt>Stat seed</dt>
      <dd>${escapeHtml(state.channels.stats)}</dd>
    </div>
    <div>
      <dt>Status</dt>
      <dd>${escapeHtml(message)}</dd>
    </div>
  `;
}

function buildDeckSummary(deck) {
  const totals = STAT_KEYS.reduce((output, key) => {
    output[key] = 0;
    return output;
  }, {});

  const archetypes = new Map();
  const crews = new Map();

  for (const card of deck) {
    for (const key of STAT_KEYS) {
      totals[key] += card.stats[key];
    }
    archetypes.set(card.archetype, (archetypes.get(card.archetype) || 0) + 1);
    crews.set(card.crew, (crews.get(card.crew) || 0) + 1);
  }

  const count = deck.length || 1;
  const averages = STAT_KEYS.reduce((output, key) => {
    output[key] = Number((totals[key] / count).toFixed(1));
    return output;
  }, {});

  const topArchetypes = [...archetypes.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([name, value]) => `${name} x${value}`);
  const topCrews = [...crews.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 2)
    .map(([name, value]) => `${name} x${value}`);

  return {
    size: deck.length,
    totals,
    averages,
    topArchetypes,
    topCrews,
    batteryLoad: deck.reduce((sum, card) => sum + card.stats.power + card.stats.tech, 0),
    routeReadiness: deck.reduce((sum, card) => sum + card.stats.speed + card.stats.control + card.stats.cargo, 0),
  };
}

function createDeckSummaryMarkup(summary) {
  if (!summary.size) {
    return `
      <div class="detail-card">
        <h3>Squad summary</h3>
        <p class="empty-state">Your active squad is empty. Add up to six skaters from the current card or saved collection.</p>
      </div>
    `;
  }

  return `
    <div class="detail-card">
      <h3>Squad summary</h3>
      <div class="deck-summary-grid">
        <div>
          <span class="summary-label">Slots used</span>
          <strong>${summary.size} / ${DECK_SIZE}</strong>
        </div>
        <div>
          <span class="summary-label">Route readiness</span>
          <strong>${summary.routeReadiness}</strong>
        </div>
        <div>
          <span class="summary-label">Battery load</span>
          <strong>${summary.batteryLoad}</strong>
        </div>
      </div>
      <div class="detail-card nested-card">
        <h3>Average stats</h3>
        <div class="stat-list">
          ${STAT_KEYS.map((key) => {
            const value = summary.averages[key];
            const fill = Math.round((value / 10) * 100);
            return `
              <div class="stat-row">
                <span>${statLabel(key)}</span>
                <div class="stat-bar"><div class="stat-bar-fill" style="width:${fill}%"></div></div>
                <strong>${value}</strong>
              </div>
            `;
          }).join("")}
        </div>
      </div>
      <div class="deck-pill-list">
        <span class="deck-pill">${escapeHtml(summary.topArchetypes.join(" | ") || "No archetypes yet")}</span>
        <span class="deck-pill">${escapeHtml(summary.topCrews.join(" | ") || "No crews yet")}</span>
      </div>
    </div>
  `;
}

function createDeckSlotMarkup(card, index) {
  if (!card) {
    return `
      <article class="deck-slot empty-slot">
        <div class="deck-slot-header">
          <span>Slot ${index + 1}</span>
          <span class="slot-status">Open</span>
        </div>
        <p class="empty-state">Add a generated or saved skater here.</p>
      </article>
    `;
  }

  return `
    <article class="deck-slot">
      <div class="deck-slot-header">
        <span>Slot ${index + 1}</span>
        <span class="slot-status">${escapeHtml(card.rarity)}</span>
      </div>
      <div class="deck-mini-card">${createCardSvg(card, `deck-${index}`)}</div>
      <strong>${escapeHtml(card.name)}</strong>
      <div class="collection-meta">${escapeHtml(card.archetype)} // ${escapeHtml(card.crew)}</div>
      <div class="button-grid">
        <button type="button" class="secondary-button deck-load-button" data-index="${index}">Load</button>
        <button type="button" class="text-button deck-remove-button" data-index="${index}">Remove</button>
      </div>
    </article>
  `;
}

function createDeckExport() {
  const summary = buildDeckSummary(state.deck);
  return {
    squadSize: summary.size,
    generatedAt: new Date().toISOString(),
    summary,
    cards: state.deck,
  };
}

function renderCollection() {
  const list = document.querySelector("#collection-list");
  const count = document.querySelector("#collection-count");
  count.textContent = `${state.collection.length} saved card${state.collection.length === 1 ? "" : "s"}`;

  if (!state.collection.length) {
    list.innerHTML = `<p class="empty-state">No saved cards yet. Generate one and click "Save to collection".</p>`;
    return;
  }

  list.innerHTML = state.collection.map((card, index) => createCollectionItem(card, index)).join("");
}

function renderDeck() {
  const slots = document.querySelector("#deck-slots");
  const summaryNode = document.querySelector("#deck-summary");
  const jsonNode = document.querySelector("#deck-json");
  const countNode = document.querySelector("#deck-count");
  const summary = buildDeckSummary(state.deck);

  countNode.textContent = `${state.deck.length} / ${DECK_SIZE} slots filled`;
  slots.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => createDeckSlotMarkup(state.deck[index], index)).join("");
  summaryNode.innerHTML = createDeckSummaryMarkup(summary);
  jsonNode.textContent = JSON.stringify(createDeckExport(), null, 2);
}

function renderCard(message = "Generated a new card.") {
  state.currentCard = generateCard(state.form);
  const preview = document.querySelector("#card-preview");
  const profile = document.querySelector("#profile-summary");
  const json = document.querySelector("#card-json");
  const accent = state.currentCard.visual.palette[0];

  preview.innerHTML = createCardSvg(state.currentCard, "preview");
  profile.innerHTML = `
    <div class="detail-card">
      <h3>Stats</h3>
      <div class="stat-list">${createStatRows(state.currentCard.stats, accent)}</div>
    </div>
    ${createSummary(state.currentCard)}
  `;
  json.textContent = JSON.stringify(state.currentCard, null, 2);
  setStatus(message);
}

function syncFormFields() {
  document.querySelector("#archetype-input").value = state.form.archetype;
  document.querySelector("#rarity-input").value = state.form.rarity;
  document.querySelector("#vibe-input").value = state.form.vibe;
  document.querySelector("#personality-input").value = state.form.personality;
  document.querySelector("#accent-input").value = state.form.accent;
  document.querySelector("#seed-input").value = state.form.seed;
}

function applyBaseSeed(seed) {
  state.form.seed = seed || DEFAULT_SEED;
  syncChannelsFromBaseSeed();
  syncFormFields();
}

function reroll(channel) {
  const locks = currentLocks();
  if (channel === "all") {
    if (!locks.name) {
      state.channels.name = newChannelSeed("name");
    }
    if (!locks.visuals) {
      state.channels.visuals = newChannelSeed("visuals");
    }
    if (!locks.stats) {
      state.channels.stats = newChannelSeed("stats");
    }
    renderCard("Rerolled all unlocked channels.");
    return;
  }

  if (locks[channel]) {
    renderCard(`${channel.charAt(0).toUpperCase() + channel.slice(1)} is locked, so nothing changed.`);
    return;
  }

  state.channels[channel] = newChannelSeed(channel);
  renderCard(`Rerolled ${channel}.`);
}

function exportPng() {
  if (!state.currentCard) {
    return;
  }
  const svgMarkup = createCardSvg(state.currentCard, `export-${Date.now()}`);
  const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 1040;
    const context = canvas.getContext("2d");
    context.fillStyle = "#05070d";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        setStatus("PNG export failed.");
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pngBlob);
      link.download = `${normalizeSlug(state.currentCard.name)}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setStatus(`Exported ${state.currentCard.name} as PNG.`);
    });
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    setStatus("PNG export failed.");
  };

  image.src = url;
}

function saveCurrentCard() {
  if (!state.currentCard) {
    return;
  }
  state.collection = [state.currentCard, ...state.collection.filter((card) => card.id !== state.currentCard.id)].slice(0, 12);
  persistCollection();
  renderCollection();
  setStatus(`Saved ${state.currentCard.name} to the local collection.`);
}

function addCurrentCardToDeck() {
  if (!state.currentCard) {
    return;
  }

  const existingIndex = state.deck.findIndex((card) => card.id === state.currentCard.id);
  if (existingIndex !== -1) {
    state.deck[existingIndex] = state.currentCard;
    persistDeck();
    renderDeck();
    setStatus(`Updated ${state.currentCard.name} in active squad slot ${existingIndex + 1}.`);
    return;
  }

  if (state.deck.length >= DECK_SIZE) {
    setStatus(`Active squad is full. Remove a skater before adding ${state.currentCard.name}.`);
    return;
  }

  state.deck = [...state.deck, state.currentCard];
  persistDeck();
  renderDeck();
  setStatus(`Added ${state.currentCard.name} to active squad slot ${state.deck.length}.`);
}

function loadSavedCard(index) {
  const card = state.collection[index];
  if (!card) {
    return;
  }
  state.currentCard = card;
  state.form = {
    archetype: card.archetype,
    rarity: card.rarity,
    vibe: card.vibe,
    personality: card.personality[0],
    accent: card.accent,
    seed: card.seed,
  };
  state.channels = { ...card.channels };
  syncFormFields();
  renderCard(`Loaded saved card ${card.name}.`);
}

function loadDeckCard(index) {
  const card = state.deck[index];
  if (!card) {
    return;
  }

  state.currentCard = card;
  state.form = {
    archetype: card.archetype,
    rarity: card.rarity,
    vibe: card.vibe,
    personality: card.personality[0],
    accent: card.accent,
    seed: card.seed,
  };
  state.channels = { ...card.channels };
  syncFormFields();
  renderCard(`Loaded squad card ${card.name}.`);
}

function deleteSavedCard(index) {
  state.collection.splice(index, 1);
  persistCollection();
  renderCollection();
  setStatus("Deleted saved card.");
}

function removeDeckCard(index) {
  const [removed] = state.deck.splice(index, 1);
  persistDeck();
  renderDeck();
  setStatus(removed ? `Removed ${removed.name} from active squad.` : "Removed squad card.");
}

function clearDeck() {
  state.deck = [];
  persistDeck();
  renderDeck();
  setStatus("Cleared the active squad.");
}

function exportDeckJson() {
  const exportData = JSON.stringify(createDeckExport(), null, 2);
  const blob = new Blob([exportData], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "skater-punk-active-squad.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus("Exported active squad JSON.");
}

function initializeForm() {
  populateSelect(document.querySelector("#archetype-input"), Object.keys(ARCHETYPES), state.form.archetype);
  populateSelect(document.querySelector("#rarity-input"), Object.keys(RARITIES), state.form.rarity);
  populateSelect(document.querySelector("#vibe-input"), Object.keys(STYLE_VIBES), state.form.vibe);
  populateSelect(document.querySelector("#personality-input"), PERSONALITY_POOL, state.form.personality);
  syncFormFields();
}

function attachEvents() {
  const form = document.querySelector("#forge-form");
  const collectionList = document.querySelector("#collection-list");
  const deckSlots = document.querySelector("#deck-slots");

  form.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
      return;
    }
    state.form[target.name] = target.value;
    if (target.name === "seed") {
      syncChannelsFromBaseSeed();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderCard("Generated card from current inputs.");
  });

  document.querySelector("#generate-button").addEventListener("click", () => {
    renderCard("Generated card from current inputs.");
  });

  document.querySelector("#random-seed-button").addEventListener("click", () => {
    applyBaseSeed(randomSeed());
    renderCard("Created a new base seed.");
  });

  document.querySelector("#reroll-all-button").addEventListener("click", () => reroll("all"));
  document.querySelector("#reroll-name-button").addEventListener("click", () => reroll("name"));
  document.querySelector("#reroll-visuals-button").addEventListener("click", () => reroll("visuals"));
  document.querySelector("#reroll-stats-button").addEventListener("click", () => reroll("stats"));
  document.querySelector("#save-button").addEventListener("click", saveCurrentCard);
  document.querySelector("#add-to-deck-button").addEventListener("click", addCurrentCardToDeck);
  document.querySelector("#export-button").addEventListener("click", exportPng);
  document.querySelector("#export-deck-button").addEventListener("click", exportDeckJson);
  document.querySelector("#clear-deck-button").addEventListener("click", clearDeck);

  document.querySelector("#clear-collection-button").addEventListener("click", () => {
    state.collection = [];
    persistCollection();
    renderCollection();
    setStatus("Cleared the local collection.");
  });

  collectionList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const loadButton = target.closest(".collection-load-button");
    const deleteButton = target.closest(".collection-delete-button");

    if (loadButton instanceof HTMLButtonElement) {
      loadSavedCard(Number(loadButton.dataset.index));
      return;
    }

    if (deleteButton instanceof HTMLButtonElement) {
      deleteSavedCard(Number(deleteButton.dataset.index));
    }
  });

  deckSlots.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const loadButton = target.closest(".deck-load-button");
    const removeButton = target.closest(".deck-remove-button");

    if (loadButton instanceof HTMLButtonElement) {
      loadDeckCard(Number(loadButton.dataset.index));
      return;
    }

    if (removeButton instanceof HTMLButtonElement) {
      removeDeckCard(Number(removeButton.dataset.index));
    }
  });
}

function init() {
  initializeForm();
  syncChannelsFromBaseSeed();
  renderCollection();
  renderDeck();
  attachEvents();
  renderCard("Ready to forge your first Electric Skateboarder.");
}

window.addEventListener("DOMContentLoaded", init);
