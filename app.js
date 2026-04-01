const STORAGE_KEY = "skater-punk-prototype-state";
const GARAGE_LIMIT = 6;

const ARCHETYPES = {
  Courier: {
    crewBias: ["Night Voltage", "Slipstream Union", "Parcel Saints"],
    stats: { speed: 3, control: 2, power: -1, cargo: 1, tech: 1, style: 1 },
    passives: ["Shortcuts", "Delivery Focus", "Slipstream Reader"],
    abilities: ["Surge Lane", "Blink Drop", "Greenlight Dash"],
    visuals: ["aerodynamic jacket", "narrow racing deck", "delivery sling"],
  },
  "Trick Rider": {
    crewBias: ["Neon Reverb", "Rail Saints", "Crowd Static"],
    stats: { speed: 1, control: 2, power: 0, cargo: -2, tech: 0, style: 4 },
    passives: ["Crowd Control", "Spark Flair", "Balance Lock"],
    abilities: ["Rail Hop", "Halo Spin", "Afterimage Kickflip"],
    visuals: ["flare coat", "sticker bomb deck", "shock-grip high tops"],
  },
  "Battery Hacker": {
    crewBias: ["Gridbreak", "Voltage Choir", "Patchline"],
    stats: { speed: 0, control: 0, power: -1, cargo: 0, tech: 4, style: 1 },
    passives: ["Battery Whisperer", "Cold Boot", "Grid Sniffer"],
    abilities: ["EMP Tap", "Overcharge Lane", "Backdoor Boost"],
    visuals: ["utility vest", "signal scanner", "modded battery pack"],
  },
  "Route Scout": {
    crewBias: ["Sightline", "Night Atlas", "Path Signal"],
    stats: { speed: 2, control: 2, power: -1, cargo: 0, tech: 2, style: 1 },
    passives: ["Map Memory", "Ghost Alley Sense", "Fast Read"],
    abilities: ["District Ping", "Shortcut Cache", "Blind Corner Read"],
    visuals: ["district visor", "sensor scarf", "low-profile board"],
  },
  "Heavy Hauler": {
    crewBias: ["Iron Parcel", "Dock Runners", "Weight Class"],
    stats: { speed: -2, control: 0, power: 3, cargo: 4, tech: 0, style: -1 },
    passives: ["Load Bearing", "Hard Stop", "Crate Lock"],
    abilities: ["Cargo Burst", "Impact Drift", "Steel Spine"],
    visuals: ["cargo rig", "wide deck", "reinforced pads"],
  },
  "Street Mechanic": {
    crewBias: ["Garage Signal", "Bolt Union", "Rustline"],
    stats: { speed: 0, control: 1, power: 1, cargo: 1, tech: 3, style: 0 },
    passives: ["Quick Repair", "Field Tune", "Grease Calm"],
    abilities: ["Pit Stop", "Wheel Swap", "Patch Surge"],
    visuals: ["tool roll", "patched bomber", "shock wrench"],
  },
  "Signal Ghost": {
    crewBias: ["Quiet Frequency", "Null Choir", "Ghostline"],
    stats: { speed: 2, control: 1, power: -1, cargo: -1, tech: 3, style: 2 },
    passives: ["Silent Route", "Noise Blank", "Trace Cut"],
    abilities: ["Signal Fade", "Packet Slip", "Null Pulse"],
    visuals: ["mirror visor", "mute tires", "ghost weave coat"],
  },
  "Crew Captain": {
    crewBias: ["Lead Circuit", "District Nine", "Static Crown"],
    stats: { speed: 1, control: 1, power: 1, cargo: 1, tech: 1, style: 3 },
    passives: ["Crew Aura", "Command Rhythm", "District Pull"],
    abilities: ["Rally Charge", "Lead Push", "Crew Sync"],
    visuals: ["captain jacket", "crest deck", "command headset"],
  },
};

const RARITIES = {
  Common: { modifier: 0, creditMultiplier: 1, glow: "#7f8ca8" },
  Uncommon: { modifier: 1, creditMultiplier: 1.1, glow: "#65ffa8" },
  Rare: { modifier: 2, creditMultiplier: 1.25, glow: "#ffd36a" },
  Epic: { modifier: 3, creditMultiplier: 1.45, glow: "#d18bff" },
};

const VIBES = {
  "Neon Outlaw": {
    districts: ["Ion Loop", "Ghost Market"],
    palettes: ["#00f0ff", "#ff4fd8", "#17203d"],
    flavor: ["won't wait for green lights", "turns every lane into a legend"],
  },
  "Chrome Courier": {
    districts: ["Redline Heights", "Ion Loop"],
    palettes: ["#c4f1ff", "#7be3ff", "#1f2d48"],
    flavor: ["times every turn to the second", "delivers before the order settles"],
  },
  "Back Alley Mystic": {
    districts: ["Ghost Market", "Ember Docks"],
    palettes: ["#ab7bff", "#00c389", "#171228"],
    flavor: ["reads the city through static", "rides where the grid flickers thin"],
  },
  "Signal Pirate": {
    districts: ["Ghost Market", "Redline Heights"],
    palettes: ["#ff7a59", "#00f0ff", "#24182f"],
    flavor: ["steals open frequencies for sport", "rides under borrowed names"],
  },
  "Storm Runner": {
    districts: ["Ember Docks", "Ion Loop"],
    palettes: ["#7fd0ff", "#d9f1ff", "#17212c"],
    flavor: ["treats rain like rocket fuel", "chases thunder through loading lanes"],
  },
  "Garage Royalty": {
    districts: ["Redline Heights", "Ember Docks"],
    palettes: ["#ffcf57", "#ff7aad", "#23162f"],
    flavor: ["never arrives without an audience", "wears grease like gold trim"],
  },
};

const FIRST_NAMES = [
  "Vex",
  "Nova",
  "Kiro",
  "Jett",
  "Rin",
  "Lux",
  "Ivo",
  "Nyx",
  "Echo",
  "Tali",
  "Rook",
  "Sable",
  "Mika",
  "Zane",
];

const LAST_NAMES = [
  "Halo",
  "Circuit",
  "Volt",
  "Static",
  "Drift",
  "Pulse",
  "Trace",
  "Shard",
  "Reverb",
  "Proxy",
  "Chrome",
  "Signal",
  "Flux",
  "Rush",
];

const PERSONALITY_TAGS = [
  "Reckless",
  "Focused",
  "Stylish",
  "Loyal",
  "Ruthless",
  "Calm",
  "Hyperaware",
  "Unpredictable",
  "Quiet",
  "Defiant",
];

const BOARD_TYPES = [
  "narrow racing deck",
  "split-tail cruiser",
  "sparkline downhill board",
  "modded cargo deck",
  "shock-rail street board",
];

const JACKETS = [
  "reflective bomber",
  "signal cloak",
  "mesh street shell",
  "chrome-panel vest",
  "patched mechanic coat",
];

const SKIN_TONES = ["#f4d3bf", "#d9a57c", "#b77958", "#8b5a3c", "#5a3928"];
const HAIR_COLORS = ["#dff4ff", "#ff78a8", "#8f7cff", "#47ffc5", "#f6cf54"];
const HAIR_STYLES = ["buzz cut", "mohawk", "long wave", "braid crown", "undercut"];
const VISOR_STYLES = ["none", "visor", "mask"];
const BOARD_SHAPES = ["speed", "cruiser", "cargo"];
const STANCES = ["lean silhouette", "forward stance", "low crouch", "wide drift pose"];

const JACKET_COLORS = {
  "reflective bomber": "#a1b6ff",
  "signal cloak": "#8848ff",
  "mesh street shell": "#24b7ff",
  "chrome-panel vest": "#c8d4ea",
  "patched mechanic coat": "#ff9e57",
  "aerodynamic jacket": "#4be5ff",
  "delivery sling": "#7d8cff",
  "flare coat": "#ff5fc7",
  "sticker bomb deck": "#48d2d9",
  "shock-grip high tops": "#ffe16c",
  "utility vest": "#b6ff7d",
  "signal scanner": "#57d5ff",
  "modded battery pack": "#6ef0c2",
  "district visor": "#9a88ff",
  "sensor scarf": "#53ffbb",
  "low-profile board": "#89a6ff",
  "cargo rig": "#ffbb66",
  "wide deck": "#6fb7ff",
  "reinforced pads": "#ffd36a",
  "tool roll": "#ff8e68",
  "patched bomber": "#ff7e99",
  "shock wrench": "#80fff0",
  "mirror visor": "#b8f1ff",
  "mute tires": "#7f93a8",
  "ghost weave coat": "#8f66ff",
  "captain jacket": "#f461a8",
  "crest deck": "#9ee8ff",
  "command headset": "#ffe082",
};

const BOARD_COLORS = {
  "narrow racing deck": "#52d7ff",
  "split-tail cruiser": "#ff77a5",
  "sparkline downhill board": "#ffd764",
  "modded cargo deck": "#97ff6d",
  "shock-rail street board": "#9d89ff",
  "sticker bomb deck": "#ff7bca",
  "low-profile board": "#78dfff",
  "wide deck": "#ffa15b",
  "crest deck": "#d2f6ff",
};

const DISTRICT_DIFFICULTY = {
  "ion-loop": { label: "Ion Loop", risk: 0.9, credits: 180 },
  "ghost-market": { label: "Ghost Market", risk: 1.15, credits: 220 },
  "redline-heights": { label: "Redline Heights", risk: 1, credits: 200 },
  "ember-docks": { label: "Ember Docks", risk: 1.25, credits: 245 },
};

const ROUTE_ROLES = {
  lead: {
    label: "Lead rider",
    short: "Lead",
    description: "Pushes route speed and overall momentum.",
  },
  scout: {
    label: "Scout",
    short: "Scout",
    description: "Finds shortcuts and reduces district risk.",
  },
  tech: {
    label: "Tech support",
    short: "Tech",
    description: "Stabilizes signal problems and board failures.",
  },
  cargo: {
    label: "Cargo runner",
    short: "Cargo",
    description: "Protects payload value and payout.",
  },
};

const ui = {
  forgeForm: document.querySelector("#forge-form"),
  archetypeInput: document.querySelector("#archetype-input"),
  rarityInput: document.querySelector("#rarity-input"),
  vibeInput: document.querySelector("#vibe-input"),
  accentInput: document.querySelector("#accent-input"),
  rerollNameButton: document.querySelector("#reroll-name"),
  rerollStatsButton: document.querySelector("#reroll-stats"),
  rerollVisualsButton: document.querySelector("#reroll-visuals"),
  copyJsonButton: document.querySelector("#copy-json-button"),
  saveCardButton: document.querySelector("#save-card"),
  clearGarageButton: document.querySelector("#clear-garage"),
  cardPreview: document.querySelector("#card-preview"),
  cardArt: document.querySelector("#card-art"),
  skaterVisual: document.querySelector("#skater-visual"),
  skaterAura: document.querySelector("#skater-aura"),
  skaterHair: document.querySelector("#skater-hair"),
  skaterHead: document.querySelector("#skater-head"),
  skaterVisor: document.querySelector("#skater-visor"),
  skaterTorso: document.querySelector("#skater-torso"),
  skaterArmLeft: document.querySelector("#skater-arm-left"),
  skaterArmRight: document.querySelector("#skater-arm-right"),
  skaterLegLeft: document.querySelector("#skater-leg-left"),
  skaterLegRight: document.querySelector("#skater-leg-right"),
  skaterBoard: document.querySelector("#skater-board"),
  skaterDeck: document.querySelector("#skater-deck"),
  skaterWheelFront: document.querySelector("#skater-wheel-front"),
  skaterWheelRear: document.querySelector("#skater-wheel-rear"),
  cardName: document.querySelector("#card-name"),
  cardRarity: document.querySelector("#card-rarity"),
  cardCrew: document.querySelector("#card-crew"),
  visualSummary: document.querySelector("#visual-summary"),
  cardDistrict: document.querySelector("#card-district"),
  statList: document.querySelector("#stat-list"),
  cardPassive: document.querySelector("#card-passive"),
  cardAbility: document.querySelector("#card-ability"),
  cardFlavor: document.querySelector("#card-flavor"),
  cardArchetype: document.querySelector("#card-archetype"),
  cardEnergy: document.querySelector("#card-energy"),
  cardId: document.querySelector("#card-id"),
  garageList: document.querySelector("#garage-list"),
  garageCount: document.querySelector("#garage-count"),
  completedRoutes: document.querySelector("#completed-routes"),
  earnedCredits: document.querySelector("#earned-credits"),
  routeInput: document.querySelector("#route-input"),
  routePrepSummary: document.querySelector("#route-prep-summary"),
  routePrepList: document.querySelector("#route-prep-list"),
  resetRoutePrepButton: document.querySelector("#reset-route-prep"),
  launchRouteButton: document.querySelector("#launch-route"),
  routeProgressLabel: document.querySelector("#route-progress-label"),
  routeProgressBar: document.querySelector("#route-progress-bar"),
  routeMetrics: document.querySelector("#route-metrics"),
  routeSummary: document.querySelector("#route-summary"),
  missionLog: document.querySelector("#mission-log"),
  clearLogButton: document.querySelector("#clear-log"),
};

const state = {
  currentCard: null,
  garage: [],
  selectedGarageId: null,
  completedRoutes: 0,
  earnedCredits: 0,
  missionLog: [],
  routeRun: null,
  routeSummary: null,
  routePrep: {
    selectedIds: [],
    roles: {},
  },
  cardCounter: 1,
  routeTimer: null,
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createCardId() {
  const id = `card_${String(state.cardCounter).padStart(6, "0")}`;
  state.cardCounter += 1;
  return id;
}

function buildName() {
  return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
}

function xpForLevel(level) {
  return 80 + Math.max(0, level - 1) * 45;
}

function ensureProgression(card) {
  const level = card.level ?? 1;
  const xp = card.xp ?? 0;
  const fatigue = clamp(card.fatigue ?? 0, 0, 100);
  const condition = clamp(card.condition ?? 100, 0, 100);

  return {
    ...card,
    level,
    xp,
    fatigue,
    condition,
  };
}

function conditionLabel(condition) {
  if (condition >= 85) {
    return "Prime";
  }
  if (condition >= 65) {
    return "Steady";
  }
  if (condition >= 40) {
    return "Shaken";
  }
  return "Battered";
}

function fatigueLabel(fatigue) {
  if (fatigue <= 20) {
    return "Fresh";
  }
  if (fatigue <= 45) {
    return "Warm";
  }
  if (fatigue <= 70) {
    return "Spent";
  }
  return "Burned";
}

function buildStats(archetype, rarity) {
  const archetypeConfig = ARCHETYPES[archetype];
  const rarityConfig = RARITIES[rarity];
  const base = {
    speed: 4,
    control: 4,
    power: 4,
    cargo: 4,
    tech: 4,
    style: 4,
  };

  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => {
      const roll = Math.floor(Math.random() * 4);
      const total = clamp(value + archetypeConfig.stats[key] + rarityConfig.modifier + roll, 1, 10);
      return [key, total];
    }),
  );
}

function buildVisual(archetype, vibe, accent) {
  const vibeConfig = VIBES[vibe];
  const archetypeConfig = ARCHETYPES[archetype];
  const jacket = randomItem([...JACKETS, ...archetypeConfig.visuals]);
  const board = randomItem([...BOARD_TYPES, ...archetypeConfig.visuals]);
  const district = randomItem(vibeConfig.districts);
  const pose = randomItem(["lean silhouette", "forward stance", "low crouch", "wide drift pose"]);
  const stance = randomItem(STANCES);
  const hairStyle = randomItem(HAIR_STYLES);
  const visor = randomItem(VISOR_STYLES);
  const boardShape = board.includes("cargo") || board.includes("wide") ? "cargo" : (
    board.includes("cruiser") ? "cruiser" : "speed"
  );

  return {
    summary: `${pose}, ${jacket}, ${board}.`,
    district,
    energy: randomItem(["Voltglass", "Gridcell", "Night Current", "Sparkline"]),
    palette: [accent, vibeConfig.palettes[1], vibeConfig.palettes[2]],
    wheelGlow: accent,
    skinTone: randomItem(SKIN_TONES),
    hairColor: randomItem(HAIR_COLORS),
    hairStyle,
    visor,
    jacket,
    jacketColor: JACKET_COLORS[jacket] ?? accent,
    board,
    boardColor: BOARD_COLORS[board] ?? accent,
    boardShape,
    stance,
  };
}

function buildFlavor(vibe) {
  const vibeConfig = VIBES[vibe];
  const fragment = randomItem(vibeConfig.flavor);
  return `They ${fragment}.`;
}

function buildCard(formValues, previousCard = null, mode = "all") {
  const { archetype, rarity, vibe, accent } = formValues;
  const archetypeConfig = ARCHETYPES[archetype];

  const isNewCard = !previousCard || mode === "all";
  const card = previousCard && !isNewCard
    ? structuredClone(previousCard)
    : {
        id: previousCard?.id ?? createCardId(),
      };

  card.archetype = archetype;
  card.rarity = rarity;
  card.vibe = vibe;
  card.accent = accent;
  card.crew = isNewCard ? randomItem(archetypeConfig.crewBias) : (card.crew ?? randomItem(archetypeConfig.crewBias));
  card.personality = isNewCard
    ? [randomItem(PERSONALITY_TAGS), randomItem(PERSONALITY_TAGS)]
    : (card.personality ?? [randomItem(PERSONALITY_TAGS), randomItem(PERSONALITY_TAGS)]);

  if (isNewCard || mode === "name") {
    card.name = buildName();
  }

  if (isNewCard || mode === "stats") {
    card.stats = buildStats(archetype, rarity);
    card.passive = randomItem(archetypeConfig.passives);
    card.ability = randomItem(archetypeConfig.abilities);
  }

  if (isNewCard || mode === "visuals") {
    card.visual = buildVisual(archetype, vibe, accent);
    card.flavorText = buildFlavor(vibe);
  }

  if (!card.serial) {
    card.serial = `SP-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }

  return card;
}

function applyAccent(card) {
  document.documentElement.style.setProperty("--accent", card.accent);
  ui.cardPreview.style.boxShadow = `0 24px 80px ${hexToRgba(card.accent, 0.18)}`;
  ui.cardArt.style.background = `
    linear-gradient(180deg, rgba(7, 11, 21, 0.4), rgba(7, 11, 21, 0.95)),
    linear-gradient(135deg, ${hexToRgba(card.visual.palette[0], 0.26)}, ${hexToRgba(card.visual.palette[1], 0.2)})
  `;
}

function renderStats(stats) {
  ui.statList.innerHTML = "";
  Object.entries(stats).forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "stat-item";
    item.innerHTML = `
      <div class="status-row">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </div>
      <div class="stat-bar">
        <div class="stat-fill" style="width: ${value * 10}%"></div>
      </div>
    `;
    ui.statList.appendChild(item);
  });
}

function renderSkaterVisual(card) {
  const { visual } = card;
  const boardWidth = visual.boardShape === "cargo" ? 156 : visual.boardShape === "cruiser" ? 142 : 132;
  const boardOffset = visual.boardShape === "cargo" ? "12px" : "20px";

  ui.skaterVisual.dataset.stance = visual.stance;
  ui.skaterHair.dataset.style = visual.hairStyle;
  ui.skaterVisor.dataset.style = visual.visor;
  ui.skaterBoard.dataset.shape = visual.boardShape;

  ui.skaterAura.style.background = `radial-gradient(circle, ${hexToRgba(visual.wheelGlow, 0.42)} 0%, transparent 72%)`;
  ui.skaterHair.style.background = `linear-gradient(180deg, ${visual.hairColor}, ${hexToRgba(visual.hairColor, 0.45)})`;
  ui.skaterHead.style.background = `linear-gradient(180deg, ${visual.skinTone}, ${hexToRgba(visual.skinTone, 0.62)})`;
  ui.skaterVisor.style.background = `linear-gradient(90deg, ${hexToRgba(card.accent, 0.92)}, ${hexToRgba(visual.palette[1], 0.86)})`;
  ui.skaterTorso.style.background = `linear-gradient(180deg, ${visual.jacketColor}, ${hexToRgba(visual.jacketColor, 0.48)})`;
  ui.skaterArmLeft.style.background = `linear-gradient(180deg, ${visual.jacketColor}, ${hexToRgba(visual.jacketColor, 0.42)})`;
  ui.skaterArmRight.style.background = `linear-gradient(180deg, ${visual.jacketColor}, ${hexToRgba(visual.jacketColor, 0.42)})`;
  ui.skaterLegLeft.style.background = `linear-gradient(180deg, ${visual.palette[2]}, ${hexToRgba(visual.palette[2], 0.5)})`;
  ui.skaterLegRight.style.background = `linear-gradient(180deg, ${visual.palette[2]}, ${hexToRgba(visual.palette[2], 0.5)})`;
  ui.skaterDeck.style.background = `linear-gradient(90deg, ${visual.boardColor}, ${hexToRgba(card.accent, 0.78)})`;
  ui.skaterDeck.style.width = `${boardWidth}px`;
  ui.skaterDeck.style.left = boardOffset;
  ui.skaterWheelFront.style.background = `radial-gradient(circle, ${visual.wheelGlow} 0 38%, rgba(255, 255, 255, 0.92) 39% 54%, ${hexToRgba(visual.wheelGlow, 0.18)} 55%)`;
  ui.skaterWheelRear.style.background = `radial-gradient(circle, ${visual.wheelGlow} 0 38%, rgba(255, 255, 255, 0.92) 39% 54%, ${hexToRgba(visual.wheelGlow, 0.18)} 55%)`;
}

function renderMiniPortrait(card, className = "mini-portrait") {
  const { visual, accent } = card;
  const boardWidth = visual.boardShape === "cargo" ? 56 : visual.boardShape === "cruiser" ? 52 : 48;
  const boardOffset = visual.boardShape === "cargo" ? 2 : 4;
  const visorOpacity = visual.visor === "none" ? 0 : 0.9;
  const riderTransform =
    visual.stance === "push"
      ? "skewX(-4deg)"
      : visual.stance === "crouch"
        ? "translateY(4px) scaleY(0.92)"
        : "none";
  const boardTransform = visual.stance === "drift" ? "rotate(-15deg) translateX(-2px)" : "rotate(-9deg)";
  const hairStyle =
    visual.hairStyle === "buzz"
      ? "height: 18px; top: 6px;"
      : visual.hairStyle === "hawk"
        ? "left: 24px; width: 12px; height: 30px; border-radius: 10px 10px 6px 6px;"
        : visual.hairStyle === "bob"
          ? "width: 36px; height: 34px;"
          : "top: 4px; height: 20px;";

  return `
    <div class="${className}" data-stance="${visual.stance}" data-hair="${visual.hairStyle}" data-visor="${visual.visor}">
      <div class="visual-aura" style="background: radial-gradient(circle, ${hexToRgba(visual.wheelGlow, 0.42)} 0%, transparent 72%);"></div>
      <div class="avatar-figure" style="transform: ${riderTransform};">
        <div class="avatar-shadow"></div>
        <div class="avatar-board" style="transform: ${boardTransform};">
          <div class="avatar-deck" style="background: linear-gradient(90deg, ${visual.boardColor}, ${hexToRgba(accent, 0.78)}); width: ${boardWidth}px; left: ${boardOffset}px;"></div>
          <div class="avatar-wheel left" style="background: radial-gradient(circle, ${visual.wheelGlow} 0 38%, rgba(255, 255, 255, 0.92) 39% 54%, ${hexToRgba(visual.wheelGlow, 0.18)} 55%);"></div>
          <div class="avatar-wheel right" style="background: radial-gradient(circle, ${visual.wheelGlow} 0 38%, rgba(255, 255, 255, 0.92) 39% 54%, ${hexToRgba(visual.wheelGlow, 0.18)} 55%);"></div>
        </div>
        <div class="avatar-leg back" style="background: linear-gradient(180deg, ${visual.palette[2]}, ${hexToRgba(visual.palette[2], 0.5)});"></div>
        <div class="avatar-leg front" style="background: linear-gradient(180deg, ${visual.palette[2]}, ${hexToRgba(visual.palette[2], 0.5)});"></div>
        <div class="avatar-torso" style="background: linear-gradient(180deg, ${visual.jacketColor}, ${hexToRgba(visual.jacketColor, 0.48)});"></div>
        <div class="avatar-arm left" style="background: linear-gradient(180deg, ${visual.jacketColor}, ${hexToRgba(visual.jacketColor, 0.42)});"></div>
        <div class="avatar-arm right" style="background: linear-gradient(180deg, ${visual.jacketColor}, ${hexToRgba(visual.jacketColor, 0.42)});"></div>
        <div class="avatar-neck" style="background: ${visual.skinTone};"></div>
        <div class="avatar-head" style="background: linear-gradient(180deg, ${visual.skinTone}, ${hexToRgba(visual.skinTone, 0.62)});"></div>
        <div class="avatar-hair" style="background: linear-gradient(180deg, ${visual.hairColor}, ${hexToRgba(visual.hairColor, 0.45)}); ${hairStyle}"></div>
        <div class="avatar-visor" style="opacity: ${visorOpacity}; background: linear-gradient(90deg, ${hexToRgba(accent, 0.92)}, ${hexToRgba(visual.palette[1], 0.86)});"></div>
      </div>
    </div>
  `;
}

function renderCard(card) {
  state.currentCard = card;
  applyAccent(card);
  renderSkaterVisual(card);
  ui.cardName.textContent = card.name;
  ui.cardRarity.textContent = card.rarity;
  ui.cardCrew.textContent = card.crew;
  ui.visualSummary.textContent = card.visual.summary;
  ui.cardDistrict.textContent = `District: ${card.visual.district}`;
  ui.cardPassive.textContent = card.passive;
  ui.cardAbility.textContent = card.ability;
  ui.cardFlavor.textContent = card.flavorText;
  ui.cardArchetype.textContent = `${card.archetype} | ${card.vibe}`;
  ui.cardEnergy.textContent = `Battery: ${card.visual.energy}`;
  ui.cardId.textContent = card.id;
  ui.cardRarity.style.color = RARITIES[card.rarity].glow;
  renderStats(card.stats);
}

function renderGarage() {
  ui.garageList.innerHTML = "";
  ui.garageCount.textContent = `${state.garage.length} / ${GARAGE_LIMIT}`;

  if (!state.garage.length) {
    ui.garageList.innerHTML = `
      <div class="empty-state">
        Generate a card and save it here to build your first route squad.
      </div>
    `;
    return;
  }

  state.garage.forEach((card) => {
    const wrapper = document.createElement("article");
    wrapper.className = `garage-card ${state.selectedGarageId === card.id ? "selected" : ""}`;
    wrapper.innerHTML = `
      <div class="garage-header">
        ${renderMiniPortrait(card, "garage-portrait")}
        <div>
          <span class="garage-tag">${card.rarity} ${card.archetype}</span>
          <h3>${card.name}</h3>
          <p class="garage-meta">${card.crew} · ${card.vibe}</p>
        </div>
        <button class="ghost-button small" data-action="load" data-id="${card.id}" type="button">Load</button>
      </div>
      <div class="mini-stats">
        <span>SPD ${card.stats.speed}</span>
        <span>CTRL ${card.stats.control}</span>
        <span>PWR ${card.stats.power}</span>
        <span>CRG ${card.stats.cargo}</span>
        <span>TECH ${card.stats.tech}</span>
        <span>STYLE ${card.stats.style}</span>
      </div>
      <div class="garage-actions">
        <button class="secondary-button small-action" data-action="remove" data-id="${card.id}" type="button">Remove</button>
      </div>
    `;
    ui.garageList.appendChild(wrapper);
  });
}

function getPreparedRiders() {
  return state.routePrep.selectedIds
    .map((id) => state.garage.find((card) => card.id === id))
    .filter(Boolean);
}

function getAssignedRole(cardId) {
  return Object.entries(state.routePrep.roles).find(([, riderId]) => riderId === cardId)?.[0] ?? null;
}

function roleTagMarkup(cardId) {
  const role = getAssignedRole(cardId);
  if (!role) {
    return '<span class="prep-role-tag muted">No role</span>';
  }

  return `<span class="prep-role-tag">${ROUTE_ROLES[role].short}</span>`;
}

function renderRoutePrep() {
  ui.routePrepList.innerHTML = "";

  if (!state.garage.length) {
    ui.routePrepSummary.innerHTML = `
      <div class="empty-state">
        Save riders to the garage, then choose up to four for the next route.
      </div>
    `;
    ui.routePrepList.innerHTML = "";
    return;
  }

  const selectedCount = state.routePrep.selectedIds.length;
  ui.routePrepSummary.innerHTML = `
    <div class="prep-summary-card">
      <span class="stat-label">Selected crew</span>
      <strong>${selectedCount} / 4 riders</strong>
    </div>
    <div class="prep-summary-card">
      <span class="stat-label">Assigned roles</span>
      <strong>${Object.keys(state.routePrep.roles).length} / 4</strong>
    </div>
  `;

  state.garage.forEach((card) => {
    const isSelected = state.routePrep.selectedIds.includes(card.id);
    const assignedRole = getAssignedRole(card.id);
    const element = document.createElement("article");
    element.className = `prep-card ${isSelected ? "selected" : ""}`;
    element.innerHTML = `
      <div class="prep-card-top">
        <div>
          <span class="garage-tag">${card.rarity} ${card.archetype}</span>
          <h3>${card.name}</h3>
          <p class="garage-meta">${card.crew}</p>
        </div>
        ${roleTagMarkup(card.id)}
      </div>
      <div class="mini-stats">
        <span>SPD ${card.stats.speed}</span>
        <span>CTRL ${card.stats.control}</span>
        <span>TECH ${card.stats.tech}</span>
        <span>CRG ${card.stats.cargo}</span>
      </div>
      <div class="prep-actions">
        <button
          class="${isSelected ? "secondary-button" : "primary-button"} small-action"
          data-route-action="${isSelected ? "remove" : "select"}"
          data-id="${card.id}"
          type="button"
        >
          ${isSelected ? "Remove" : "Select"}
        </button>
      </div>
      <div class="role-grid">
        ${Object.entries(ROUTE_ROLES)
          .map(
            ([roleKey, role]) => `
              <button
                class="role-button ${assignedRole === roleKey ? "active" : ""}"
                data-route-action="assign-role"
                data-id="${card.id}"
                data-role="${roleKey}"
                type="button"
                ${!isSelected ? "disabled" : ""}
              >
                <strong>${role.short}</strong>
                <span>${role.description}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    `;
    ui.routePrepList.appendChild(element);
  });
}

function renderMissionLog() {
  ui.missionLog.innerHTML = "";

  if (!state.missionLog.length) {
    ui.missionLog.innerHTML = `
      <div class="empty-state">Launch a route to generate live mission events.</div>
    `;
    return;
  }

  [...state.missionLog].reverse().forEach((entry) => {
    const element = document.createElement("article");
    element.className = `log-entry ${entry.tone}`;
    element.innerHTML = `
      <strong>${entry.title}</strong>
      <p>${entry.text}</p>
    `;
    ui.missionLog.appendChild(element);
  });
}

function renderMetrics(metrics) {
  ui.routeMetrics.innerHTML = "";
  metrics.forEach((metric) => {
    const element = document.createElement("div");
    element.className = "metric-card";
    element.innerHTML = `
      <span class="stat-label">${metric.label}</span>
      <strong>${metric.value}</strong>
    `;
    ui.routeMetrics.appendChild(element);
  });
}

function updateHeaderStats() {
  ui.completedRoutes.textContent = String(state.completedRoutes);
  ui.earnedCredits.textContent = String(state.earnedCredits);
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 1800);
}

function saveState() {
  if (state.routeRun) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      garage: state.garage,
      selectedGarageId: state.selectedGarageId,
      completedRoutes: state.completedRoutes,
      earnedCredits: state.earnedCredits,
      missionLog: state.missionLog.slice(-24),
      routePrep: state.routePrep,
      cardCounter: state.cardCounter,
      currentCard: state.currentCard,
    }),
  );
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.garage = parsed.garage ?? [];
    state.selectedGarageId = parsed.selectedGarageId ?? null;
    state.completedRoutes = parsed.completedRoutes ?? 0;
    state.earnedCredits = parsed.earnedCredits ?? 0;
    state.missionLog = parsed.missionLog ?? [];
    state.routePrep = parsed.routePrep ?? { selectedIds: [], roles: {} };
    state.cardCounter = parsed.cardCounter ?? 1;
    state.currentCard = parsed.currentCard ?? null;
  } catch (error) {
    console.warn("Unable to restore saved prototype state.", error);
  }
}

function addLog(title, text, tone = "success") {
  state.missionLog.push({ title, text, tone });
  state.missionLog = state.missionLog.slice(-30);
  renderMissionLog();
  saveState();
}

function garageTotals() {
  return state.garage.reduce(
    (totals, rider) => {
      totals.speed += rider.stats.speed;
      totals.control += rider.stats.control;
      totals.power += rider.stats.power;
      totals.cargo += rider.stats.cargo;
      totals.tech += rider.stats.tech;
      totals.style += rider.stats.style;
      return totals;
    },
    { speed: 0, control: 0, power: 0, cargo: 0, tech: 0, style: 0 },
  );
}

function preparedTotals(riders) {
  return riders.reduce(
    (totals, rider) => {
      totals.speed += rider.stats.speed;
      totals.control += rider.stats.control;
      totals.power += rider.stats.power;
      totals.cargo += rider.stats.cargo;
      totals.tech += rider.stats.tech;
      totals.style += rider.stats.style;
      return totals;
    },
    { speed: 0, control: 0, power: 0, cargo: 0, tech: 0, style: 0 },
  );
}

function routePrepMetrics() {
  const riders = getPreparedRiders();
  if (!riders.length) {
    renderMetrics([
      { label: "Selected crew", value: "0" },
      { label: "Assigned roles", value: "0" },
      { label: "District risk", value: DISTRICT_DIFFICULTY[ui.routeInput.value].risk.toFixed(2) },
      { label: "Projected payout", value: "0 credits" },
    ]);
    return;
  }

  const district = DISTRICT_DIFFICULTY[ui.routeInput.value];
  const totals = preparedTotals(riders);
  const roleCount = Object.keys(state.routePrep.roles).length;
  const projected = Math.round(
    district.credits *
      (1 + riders.length * 0.08) *
      (1 + totals.cargo * 0.015) *
      (1 + roleCount * 0.04),
  );

  renderMetrics([
    { label: "Selected crew", value: String(riders.length) },
    { label: "Assigned roles", value: `${roleCount} / 4` },
    { label: "District risk", value: district.risk.toFixed(2) },
    { label: "Projected payout", value: `${projected} credits` },
  ]);
}

function cleanRoutePrep() {
  const garageIds = new Set(state.garage.map((card) => card.id));
  state.routePrep.selectedIds = state.routePrep.selectedIds.filter((id) => garageIds.has(id)).slice(0, 4);
  state.routePrep.roles = Object.fromEntries(
    Object.entries(state.routePrep.roles).filter(([, riderId]) => garageIds.has(riderId)),
  );
}

function resetRoutePrep() {
  state.routePrep = {
    selectedIds: [],
    roles: {},
  };
  renderRoutePrep();
  routePrepMetrics();
  saveState();
}

function toggleRoutePrepSelection(id) {
  const isSelected = state.routePrep.selectedIds.includes(id);
  if (isSelected) {
    state.routePrep.selectedIds = state.routePrep.selectedIds.filter((entry) => entry !== id);
    state.routePrep.roles = Object.fromEntries(
      Object.entries(state.routePrep.roles).filter(([, riderId]) => riderId !== id),
    );
  } else {
    if (state.routePrep.selectedIds.length >= 4) {
      showToast("Routes can only field four riders at a time.");
      return;
    }
    state.routePrep.selectedIds.push(id);
  }

  renderRoutePrep();
  routePrepMetrics();
  saveState();
}

function assignRouteRole(cardId, roleKey) {
  if (!state.routePrep.selectedIds.includes(cardId)) {
    showToast("Select that rider before assigning a role.");
    return;
  }

  const currentHolder = state.routePrep.roles[roleKey];
  if (currentHolder === cardId) {
    delete state.routePrep.roles[roleKey];
  } else {
    state.routePrep.roles[roleKey] = cardId;
  }

  renderRoutePrep();
  routePrepMetrics();
  saveState();
}

function startRoute() {
  const riders = getPreparedRiders();
  if (!riders.length) {
    showToast("Select at least one rider in route prep first.");
    return;
  }

  if (state.routeRun) {
    showToast("A route is already running.");
    return;
  }

  const district = DISTRICT_DIFFICULTY[ui.routeInput.value];
  const totals = preparedTotals(riders);
  const teamSize = riders.length;
  const lead = riders.find((rider) => state.routePrep.roles.lead === rider.id);
  const scout = riders.find((rider) => state.routePrep.roles.scout === rider.id);
  const tech = riders.find((rider) => state.routePrep.roles.tech === rider.id);
  const cargo = riders.find((rider) => state.routePrep.roles.cargo === rider.id);
  const roleBonus =
    (lead ? lead.stats.speed + lead.stats.style * 0.5 : 0) +
    (scout ? scout.stats.control + scout.stats.speed * 0.7 : 0) +
    (tech ? tech.stats.tech * 1.7 : 0) +
    (cargo ? cargo.stats.cargo * 1.6 + cargo.stats.power * 0.5 : 0);
  const riskOffset = scout ? scout.stats.control * 0.03 : 0;
  const payoutBonus = cargo ? cargo.stats.cargo * 0.04 : 0;
  const routeStrength =
    totals.speed * 1.2 +
    totals.control +
    totals.tech * 1.1 +
    totals.cargo * 0.9 +
    totals.style * 0.5 +
    teamSize * 4 +
    roleBonus;

  const threshold = Math.max(18, (district.risk - riskOffset) * 48);
  const successScore = routeStrength - threshold + Math.floor(Math.random() * 18);
  const routeLength = 5;

  state.routeRun = {
    district,
    stage: 0,
    routeLength,
    successScore,
    totals,
    riders,
    roles: {
      lead,
      scout,
      tech,
      cargo,
    },
    payoutBonus,
  };

  ui.routeProgressLabel.textContent = `Launching ${district.label}`;
  ui.routeProgressBar.style.width = "0%";
  ui.launchRouteButton.disabled = true;
  renderMetrics([
    { label: "Crew size", value: String(teamSize) },
    { label: "Projected route score", value: String(Math.round(routeStrength)) },
    { label: "Adjusted risk", value: Math.max(0.4, district.risk - riskOffset).toFixed(2) },
    { label: "Role coverage", value: `${Object.keys(state.routePrep.roles).length} / 4` },
    { label: "Base payout", value: `${Math.round(district.credits * (1 + payoutBonus))} credits` },
  ]);

  addLog(
    "Route launched",
    `${teamSize} riders deployed to ${district.label}. ${lead ? `${lead.name} is leading the push.` : "No lead rider assigned."}`,
    "success",
  );

  state.routeTimer = window.setInterval(tickRoute, 900);
}

function tickRoute() {
  if (!state.routeRun) {
    return;
  }

  const route = state.routeRun;
  route.stage += 1;
  const percent = Math.round((route.stage / route.routeLength) * 100);
  ui.routeProgressBar.style.width = `${percent}%`;

  if (route.stage < route.routeLength) {
    const stageEvents = [
      {
        title: "Traffic break",
        text: `${route.district.label} grid shifted. ${(route.roles.scout ?? randomItem(route.riders)).name} found a faster lane.`,
        tone: "success",
      },
      {
        title: "Signal noise",
        text: route.roles.tech
          ? `${route.roles.tech.name} patched through encrypted billboards before the route broke apart.`
          : "Encrypted billboards scrambled route markers. The crew had to steady the line manually.",
        tone: "warning",
      },
      {
        title: "Crowd spike",
        text: route.roles.lead
          ? `${route.roles.lead.name} cut the pack through a crowd surge and kept momentum alive.`
          : "A street crowd closed half a corridor, forcing a sharp drift through service lanes.",
        tone: "warning",
      },
      {
        title: "Charge window",
        text: route.roles.cargo
          ? `${route.roles.cargo.name} kept the payload stable while the crew hit a portable charge window.`
          : "Portable chargers were spotted mid-route, letting the boards push harder into the next block.",
        tone: "success",
      },
    ];

    const event = randomItem(stageEvents);
    ui.routeProgressLabel.textContent = `${event.title} · ${percent}%`;
    addLog(event.title, event.text, event.tone);
    return;
  }

  finishRoute();
}

function finishRoute() {
  const route = state.routeRun;
  window.clearInterval(state.routeTimer);
  state.routeTimer = null;

  const success = route.successScore >= 18;
  const payout = Math.max(
    65,
    Math.round(
      route.district.credits *
        (1 + route.payoutBonus) *
        (success ? 1.2 : 0.55) *
        (1 + route.riders.length * 0.05),
    ),
  );

  ui.routeProgressLabel.textContent = success ? "Route complete" : "Route limped home";
  ui.routeProgressBar.style.width = "100%";

  if (success) {
    state.completedRoutes += 1;
    state.earnedCredits += payout;
    addLog(
      "Delivery secured",
      `${route.district.label} paid out ${payout} credits. ${(route.roles.cargo ?? route.roles.lead ?? route.riders[0]).name} was the standout rider.`,
      "success",
    );
  } else {
    state.earnedCredits += Math.round(payout * 0.5);
    addLog(
      "Rough landing",
      `${route.district.label} fought back. ${(route.roles.tech ?? route.riders[0]).name} salvaged part of the run and banked ${Math.round(payout * 0.5)} credits.`,
      "danger",
    );
  }

  renderMetrics([
    { label: "Result", value: success ? "Success" : "Partial failure" },
    { label: "Route score", value: String(route.successScore) },
    { label: "Credits banked", value: String(success ? payout : Math.round(payout * 0.5)) },
    { label: "Top edge", value: route.totals.speed >= route.totals.tech ? "Speed" : "Tech" },
  ]);

  state.routeRun = null;
  ui.launchRouteButton.disabled = false;
  updateHeaderStats();
  routePrepMetrics();
  saveState();
}

function removeFromGarage(id) {
  state.garage = state.garage.filter((card) => card.id !== id);
  if (state.selectedGarageId === id) {
    state.selectedGarageId = state.garage[0]?.id ?? null;
  }
  cleanRoutePrep();
  renderGarage();
  renderRoutePrep();
  routePrepMetrics();
  saveState();
}

function loadGarageCard(id) {
  const card = state.garage.find((entry) => entry.id === id);
  if (!card) {
    return;
  }
  state.selectedGarageId = id;
  renderCard(card);
  renderGarage();
  saveState();
}

function saveCurrentCard() {
  if (!state.currentCard) {
    return;
  }

  const clone = structuredClone(state.currentCard);
  const existingIndex = state.garage.findIndex((card) => card.id === clone.id);

  if (existingIndex >= 0) {
    state.garage.splice(existingIndex, 1, clone);
    state.selectedGarageId = clone.id;
    renderGarage();
    renderRoutePrep();
    routePrepMetrics();
    saveState();
    showToast("Garage entry updated.");
    return;
  }

  if (state.garage.length >= GARAGE_LIMIT) {
    showToast("Garage is full. Remove a rider first.");
    return;
  }

  state.garage.push(clone);
  state.selectedGarageId = clone.id;
  renderGarage();
  renderRoutePrep();
  routePrepMetrics();
  saveState();
  showToast("Rider saved to garage.");
}

function clearGarage() {
  state.garage = [];
  state.selectedGarageId = null;
  resetRoutePrep();
  renderGarage();
  saveState();
  showToast("Garage cleared.");
}

function clearMissionLog() {
  state.missionLog = [];
  renderMissionLog();
  saveState();
}

function copyCurrentCardJson() {
  if (!state.currentCard) {
    return;
  }

  const payload = JSON.stringify(state.currentCard, null, 2);
  navigator.clipboard
    .writeText(payload)
    .then(() => showToast("Card JSON copied."))
    .catch(() => showToast("Clipboard unavailable in this browser."));
}

function readFormValues() {
  return {
    archetype: ui.archetypeInput.value,
    rarity: ui.rarityInput.value,
    vibe: ui.vibeInput.value,
    accent: ui.accentInput.value,
  };
}

function syncForm(card) {
  ui.archetypeInput.value = card.archetype;
  ui.rarityInput.value = card.rarity;
  ui.vibeInput.value = card.vibe;
  ui.accentInput.value = card.accent;
}

function generateAndRender(mode = "all") {
  const values = readFormValues();
  const fallbackMode = state.currentCard ? mode : "all";
  const card = buildCard(values, state.currentCard, fallbackMode);
  renderCard(card);
  saveState();
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const int = Number.parseInt(normalized, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function installEventListeners() {
  ui.forgeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.currentCard = null;
    generateAndRender("all");
  });

  ui.rerollNameButton.addEventListener("click", () => generateAndRender("name"));
  ui.rerollStatsButton.addEventListener("click", () => generateAndRender("stats"));
  ui.rerollVisualsButton.addEventListener("click", () => generateAndRender("visuals"));
  ui.copyJsonButton.addEventListener("click", copyCurrentCardJson);
  ui.saveCardButton.addEventListener("click", saveCurrentCard);
  ui.clearGarageButton.addEventListener("click", clearGarage);
  ui.resetRoutePrepButton.addEventListener("click", resetRoutePrep);
  ui.launchRouteButton.addEventListener("click", startRoute);
  ui.clearLogButton.addEventListener("click", clearMissionLog);
  ui.routeInput.addEventListener("change", routePrepMetrics);

  ui.garageList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    const { action, id } = button.dataset;
    if (action === "remove") {
      removeFromGarage(id);
    }
    if (action === "load") {
      loadGarageCard(id);
    }
  });

  ui.routePrepList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-route-action]");
    if (!button) {
      return;
    }

    const { routeAction, id, role } = button.dataset;
    if (routeAction === "select" || routeAction === "remove") {
      toggleRoutePrepSelection(id);
    }
    if (routeAction === "assign-role") {
      assignRouteRole(id, role);
    }
  });
}

function boot() {
  loadState();
  cleanRoutePrep();
  installEventListeners();

  if (state.currentCard) {
    renderCard(state.currentCard);
    syncForm(state.currentCard);
  } else {
    generateAndRender("all");
  }

  renderGarage();
  renderRoutePrep();
  renderMissionLog();
  routePrepMetrics();
  updateHeaderStats();
}

boot();
