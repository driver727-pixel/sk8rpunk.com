/**
 * Assembles a structured prompt for Nano Banana 2 from style settings,
 * character references, and per-panel scene direction — without overloading.
 */
import type { CharacterReference, Panel, StyleSettings } from "./types";

const ART_STYLE_LABELS: Record<string, string> = {
  "western-comic": "western comic book style",
  manga: "manga style",
  "franco-belgian": "Franco-Belgian bande dessinée style",
  noir: "noir comic style, heavy shadows",
  "pop-art": "pop art style, bold colors, Ben-Day dots",
  watercolor: "watercolor comic illustration",
  "cyberpunk-neon": "cyberpunk neon-lit comic art",
  sketch: "pencil sketch comic style",
};

const INK_LABELS: Record<string, string> = {
  "bold-ink": "bold ink lines",
  "fine-line": "fine line work",
  hatched: "cross-hatched shading",
  "no-outline": "no outlines, painterly",
  halftone: "halftone print texture",
};

const PALETTE_LABELS: Record<string, string> = {
  "full-color": "",
  monochrome: "monochrome black and white",
  "duotone-cyan": "duotone cyan and black",
  "duotone-magenta": "duotone magenta and black",
  "muted-retro": "muted retro color palette",
  "neon-glow": "neon glow color palette",
};

const SHOT_LABELS: Record<string, string> = {
  wide: "wide shot",
  medium: "medium shot",
  "close-up": "close-up shot",
  "extreme-close-up": "extreme close-up",
  "birds-eye": "bird's-eye view",
  "low-angle": "low-angle shot",
  "over-shoulder": "over-the-shoulder shot",
};

/**
 * Build a concise, structured prompt from project style + panel data + characters.
 * Keeps token budget low by using short descriptive fragments separated by commas.
 */
export function buildPanelPrompt(
  style: StyleSettings,
  panel: Panel,
  characters: CharacterReference[],
): string {
  const parts: string[] = [];

  // Style direction (compact)
  const artLabel = ART_STYLE_LABELS[style.artStyle] ?? style.artStyle;
  parts.push(artLabel);

  const inkLabel = INK_LABELS[style.inkStyle];
  if (inkLabel) parts.push(inkLabel);

  const paletteLabel = PALETTE_LABELS[style.colorPalette];
  if (paletteLabel) parts.push(paletteLabel);

  // Shot type
  const shotLabel = SHOT_LABELS[panel.shotType];
  if (shotLabel) parts.push(shotLabel);

  // Scene description (the creative core)
  if (panel.scene.trim()) {
    parts.push(panel.scene.trim());
  }

  // Character descriptions (brief)
  const panelChars = characters.filter((c) => panel.characterIds.includes(c.id));
  for (const char of panelChars) {
    if (char.description.trim()) {
      parts.push(`character: ${char.name} (${char.description.trim()})`);
    }
  }

  // Global keywords
  for (const kw of style.globalKeywords) {
    if (kw.trim()) parts.push(kw.trim());
  }

  // Panel extra keywords
  for (const kw of panel.extraKeywords) {
    if (kw.trim()) parts.push(kw.trim());
  }

  return parts.join(", ");
}

/**
 * Gather all reference image URLs for characters in a panel.
 */
export function gatherReferenceImages(
  panel: Panel,
  characters: CharacterReference[],
): string[] {
  const panelChars = characters.filter((c) => panel.characterIds.includes(c.id));
  return panelChars.flatMap((c) => c.imageUrls);
}
