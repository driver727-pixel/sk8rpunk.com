import type { CSSProperties } from "react";
import type { CharacterCard } from "../types";
import { RARITY_FRAME_COLORS } from "../generator/tables";

interface CharacterCardPreviewProps {
  card: CharacterCard;
}

const STAT_ORDER: { key: keyof CharacterCard["stats"]; label: string }[] = [
  { key: "speed", label: "SPD" },
  { key: "control", label: "CTL" },
  { key: "power", label: "PWR" },
  { key: "cargo", label: "CRG" },
  { key: "tech", label: "TEC" },
  { key: "style", label: "STY" },
];

const slugLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const hashValue = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const rotateHue = (hex: string, degrees: number) => {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case normalizedRed:
        hue = ((normalizedGreen - normalizedBlue) / delta) % 6;
        break;
      case normalizedGreen:
        hue = (normalizedBlue - normalizedRed) / delta + 2;
        break;
      default:
        hue = (normalizedRed - normalizedGreen) / delta + 4;
        break;
    }
  }

  const nextHue = ((hue * 60 + degrees) % 360 + 360) % 360;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((nextHue / 60) % 2) - 1));
  const match = lightness - chroma / 2;

  let nextRed = 0;
  let nextGreen = 0;
  let nextBlue = 0;

  if (nextHue < 60) {
    nextRed = chroma;
    nextGreen = x;
  } else if (nextHue < 120) {
    nextRed = x;
    nextGreen = chroma;
  } else if (nextHue < 180) {
    nextGreen = chroma;
    nextBlue = x;
  } else if (nextHue < 240) {
    nextGreen = x;
    nextBlue = chroma;
  } else if (nextHue < 300) {
    nextRed = x;
    nextBlue = chroma;
  } else {
    nextRed = chroma;
    nextBlue = x;
  }

  const toChannel = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toChannel(nextRed)}${toChannel(nextGreen)}${toChannel(nextBlue)}`;
};

const backgroundPalette = (accentColor: string, district: string) => {
  const districtShift = (hashValue(district) % 120) - 40;
  return {
    base: rotateHue(accentColor, districtShift),
    glow: rotateHue(accentColor, districtShift + 40),
    contrast: rotateHue(accentColor, districtShift + 180),
  };
};

const createArtSvg = (card: CharacterCard) => {
  const palette = backgroundPalette(card.prompts.accentColor, card.district);
  const frameColor = RARITY_FRAME_COLORS[card.rarity];
  const posePhase = hashValue(card.visual.pose) % 70;
  const boardTilt = (hashValue(card.visual.boardShape) % 14) - 7;
  const wheelGlow = card.prompts.accentColor;
  const skylineOffset = hashValue(card.visual.background) % 60;
  const emblemPhase = hashValue(card.visual.emblem) % 90;

  return `
    <svg viewBox="0 0 360 500" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="${card.name} character card art">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.base}" />
          <stop offset="55%" stop-color="#130f28" />
          <stop offset="100%" stop-color="#07050f" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.6" />
          <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="deck" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${frameColor}" />
          <stop offset="100%" stop-color="${wheelGlow}" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="500" rx="28" fill="url(#bg)" />
      <rect x="0" y="0" width="360" height="500" rx="28" fill="url(#glow)" />
      <g opacity="0.18">
        <path d="M0 335 C 70 ${280 + skylineOffset}, 125 375, 210 340 S 330 302, 360 320 L 360 500 L 0 500 Z" fill="${palette.contrast}" />
        <path d="M0 290 C 88 250, 154 325, 225 292 S 308 250, 360 274 L 360 500 L 0 500 Z" fill="#ffffff" fill-opacity="0.06" />
        <g stroke="${wheelGlow}" stroke-opacity="0.38">
          <line x1="28" y1="88" x2="330" y2="178" />
          <line x1="42" y1="132" x2="300" y2="228" />
          <line x1="70" y1="70" x2="260" y2="224" />
        </g>
      </g>
      <g transform="translate(58 96)">
        <circle cx="${110 + (emblemPhase % 25)}" cy="54" r="74" fill="${palette.glow}" fill-opacity="0.14" />
        <g transform="translate(58 42)">
          <ellipse cx="58" cy="246" rx="90" ry="18" fill="#000000" fill-opacity="0.35" />
          <rect x="-8" y="220" width="170" height="16" rx="8" fill="url(#deck)" transform="rotate(${boardTilt} 76 228)" />
          <circle cx="26" cy="236" r="14" fill="${wheelGlow}" fill-opacity="0.95" />
          <circle cx="126" cy="236" r="14" fill="${wheelGlow}" fill-opacity="0.95" />
          <circle cx="26" cy="236" r="26" fill="${wheelGlow}" fill-opacity="0.1" />
          <circle cx="126" cy="236" r="26" fill="${wheelGlow}" fill-opacity="0.1" />
          <path d="M80 30 C58 28, 40 48, 40 72 C40 94, 58 112, 80 112 C102 112, 120 94, 120 72 C120 48, 102 28, 80 30 Z" fill="#f3d9cf" />
          <rect x="52" y="108" width="58" height="78" rx="22" fill="#0f1321" />
          <path d="M44 126 C58 100, 104 98, 118 122 L132 184 C135 196, 125 206, 112 206 H48 C35 206, 25 196, 28 184 Z" fill="${palette.contrast}" />
          <path d="M32 150 C18 164, 10 196, 18 206 C25 214, 38 206, 42 194 L55 158" fill="none" stroke="${palette.contrast}" stroke-width="16" stroke-linecap="round" />
          <path d="M128 152 C142 168, 150 196, 143 206 C136 214, 122 206, 118 194 L106 160" fill="none" stroke="${palette.contrast}" stroke-width="16" stroke-linecap="round" />
          <path d="M58 198 C45 224, 45 252, 55 262" fill="none" stroke="#0b0d17" stroke-width="17" stroke-linecap="round" />
          <path d="M102 198 C115 224, 115 252, 105 262" fill="none" stroke="#0b0d17" stroke-width="17" stroke-linecap="round" />
          <path d="M76 18 C44 18, 28 42, 34 78 C54 52, 98 40, 124 66 C122 26, 100 14, 76 18 Z" fill="${wheelGlow}" fill-opacity="0.72" />
          <rect x="48" y="60" width="64" height="18" rx="9" fill="#d6f7ff" fill-opacity="0.82" />
          <path d="M120 128 L148 112 L160 128 L134 146 Z" fill="${frameColor}" fill-opacity="0.82" />
          <path d="M40 128 L14 112 L0 130 L28 145 Z" fill="${frameColor}" fill-opacity="0.82" />
        </g>
        <g opacity="0.8">
          <circle cx="24" cy="${244 + (posePhase % 26)}" r="4" fill="${frameColor}" />
          <circle cx="212" cy="${198 + (posePhase % 32)}" r="5" fill="${wheelGlow}" />
          <circle cx="188" cy="${116 + (emblemPhase % 24)}" r="3.5" fill="#ffffff" />
          <path d="M12 112 C48 ${70 + (posePhase % 20)}, 126 58, 218 102" fill="none" stroke="${wheelGlow}" stroke-opacity="0.3" stroke-width="3" />
        </g>
      </g>
    </svg>
  `;
};

export function CharacterCardPreview({ card }: CharacterCardPreviewProps) {
  const frameColor = RARITY_FRAME_COLORS[card.rarity];
  const palette = backgroundPalette(card.prompts.accentColor, card.district);
  const artSvg = createArtSvg(card);

  return (
    <article className="panel forge-preview-shell">
      <div className="section-heading">
        <h2>Generated playing card</h2>
        <p>2D procedural art is generated in-app, so the MVP stays fully open-source and easy to remix later.</p>
      </div>

      <div
        className="character-card"
        style={
          {
            "--forge-accent": card.prompts.accentColor,
            "--forge-frame": frameColor,
            "--forge-contrast": palette.contrast,
          } as CSSProperties
        }
      >
        <header className="character-card-header">
          <div>
            <p className="eyebrow">
              {card.rarity} {card.archetype}
            </p>
            <h3>{card.name}</h3>
            <p className="muted">
              {card.crew} · {card.district}
            </p>
          </div>
          <div className="character-card-badges">
            <span className="badge">{card.serial}</span>
            <span className="badge outline-badge">{card.manufacturer}</span>
          </div>
        </header>

        <div
          className="character-card-art"
          dangerouslySetInnerHTML={{ __html: artSvg }}
        />

        <div className="character-card-tags">
          {card.personality.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
          <span className="chip">{card.vibe}</span>
        </div>

        <div className="character-card-stat-grid">
          {STAT_ORDER.map((entry) => (
            <div key={entry.key} className="metric-card stat-rail-card">
              <span className="metric-label">{entry.label}</span>
              <strong>{card.stats[entry.key]}</strong>
            </div>
          ))}
        </div>

        <div className="character-card-abilities">
          <div className="ability-card">
            <span className="metric-label">Passive</span>
            <strong>{card.passive}</strong>
          </div>
          <div className="ability-card">
            <span className="metric-label">Ability</span>
            <strong>{card.ability}</strong>
          </div>
        </div>

        <blockquote className="character-card-flavor">"{card.flavorText}"</blockquote>

        <footer className="character-card-footer">
          <div className="character-card-meta">
            <span>{slugLabel(card.visual.deckGraphic)}</span>
            <span>{slugLabel(card.visual.wheelFx)}</span>
            <span>{slugLabel(card.visual.background)}</span>
          </div>
          <div className="character-card-meta">
            {card.exportTags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </footer>
      </div>
    </article>
  );
}
