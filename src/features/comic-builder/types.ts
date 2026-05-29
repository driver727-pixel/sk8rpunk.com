/**
 * Comic Book Builder types.
 *
 * One image per panel, multiple panels per page, dialogue as a separate layer.
 * All generation powered exclusively by fal-ai/nano-banana-2.
 */

// ── Characters (reference material) ─────────────────────────────────────────

export interface CharacterReference {
  id: string;
  name: string;
  /** Brief visual description used as prompt context (e.g. "tall, blue mohawk, neon jacket"). */
  description: string;
  /** URLs to uploaded reference images in public/comic-references/. */
  imageUrls: string[];
  /** Accent color hex for quick identification. */
  accentColor: string;
}

// ── Style controls ──────────────────────────────────────────────────────────

export type ArtStyle =
  | "western-comic"
  | "manga"
  | "franco-belgian"
  | "noir"
  | "pop-art"
  | "watercolor"
  | "cyberpunk-neon"
  | "sketch";

export type InkStyle = "bold-ink" | "fine-line" | "hatched" | "no-outline" | "halftone";

export type ColorPalette =
  | "full-color"
  | "monochrome"
  | "duotone-cyan"
  | "duotone-magenta"
  | "muted-retro"
  | "neon-glow";

export type ShotType =
  | "wide"
  | "medium"
  | "close-up"
  | "extreme-close-up"
  | "birds-eye"
  | "low-angle"
  | "over-shoulder";

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "2:3" | "3:2";

export type Resolution = "0.5K" | "1K" | "2K" | "4K";

export interface StyleSettings {
  artStyle: ArtStyle;
  inkStyle: InkStyle;
  colorPalette: ColorPalette;
  defaultAspectRatio: AspectRatio;
  defaultResolution: Resolution;
  /** Optional persistent style keywords applied to every panel (e.g. "detailed background"). */
  globalKeywords: string[];
}

// ── Panels ──────────────────────────────────────────────────────────────────

export interface DialogueBox {
  id: string;
  type: "speech" | "thought" | "narration" | "caption" | "sfx";
  text: string;
  /** Character id (for speech/thought) — null for narration/caption/sfx. */
  characterId: string | null;
  /** Approximate position (percentage) for rendering overlay. */
  x: number;
  y: number;
}

export interface Panel {
  id: string;
  /** Short action/scene description for the prompt. */
  scene: string;
  /** Character ids appearing in this panel. */
  characterIds: string[];
  shotType: ShotType;
  /** Per-panel aspect ratio override (falls back to project default). */
  aspectRatio?: AspectRatio;
  /** Per-panel resolution override. */
  resolution?: Resolution;
  /** Extra prompt keywords for this panel only. */
  extraKeywords: string[];
  /** Dialogue/caption overlays — separate from generation. */
  dialogue: DialogueBox[];
  /** Generated image URL from fal (null until generated). */
  generatedImageUrl: string | null;
  /** Seed used for reproducibility (null until generated). */
  seed: number | null;
  /** Whether seed is locked for regeneration consistency. */
  seedLocked: boolean;
}

// ── Pages ───────────────────────────────────────────────────────────────────

export interface ComicPage {
  id: string;
  pageNumber: number;
  panels: Panel[];
}

// ── Project ─────────────────────────────────────────────────────────────────

export interface ComicProject {
  id: string;
  schemaVersion: "comic-builder.v1";
  title: string;
  createdAt: string;
  updatedAt: string;
  characters: CharacterReference[];
  style: StyleSettings;
  pages: ComicPage[];
}

export interface ComicBuilderState {
  projects: ComicProject[];
  activeProjectId: string | null;
  falKeyStored: boolean;
}

// ── Generation request ──────────────────────────────────────────────────────

export interface GeneratePanelRequest {
  prompt: string;
  imageUrls: string[];
  aspectRatio: AspectRatio;
  resolution: Resolution;
  seed?: number;
}

export interface GeneratePanelResult {
  imageUrl: string;
  seed: number;
}
