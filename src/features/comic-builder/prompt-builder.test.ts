import { describe, expect, it } from "vitest";
import { buildPanelPrompt, gatherReferenceImages } from "./prompt-builder";
import type { CharacterReference, Panel, StyleSettings } from "./types";

const baseStyle: StyleSettings = {
  artStyle: "cyberpunk-neon",
  inkStyle: "bold-ink",
  colorPalette: "full-color",
  defaultAspectRatio: "3:4",
  defaultResolution: "1K",
  globalKeywords: ["dynamic lighting"],
};

const chars: CharacterReference[] = [
  { id: "c1", name: "Zara", description: "tall, blue mohawk, neon jacket", imageUrls: ["/comic-references/zara.png"], accentColor: "#19f2ff" },
  { id: "c2", name: "Rex", description: "stocky, red visor, cargo pants", imageUrls: ["/comic-references/rex1.png", "/comic-references/rex2.png"], accentColor: "#ff6a9a" },
];

const basePanel: Panel = {
  id: "p1",
  scene: "Zara grinds down a neon-lit rail above the city",
  characterIds: ["c1"],
  shotType: "wide",
  extraKeywords: ["sparks"],
  dialogue: [],
  generatedImageUrl: null,
  seed: null,
  seedLocked: false,
};

describe("buildPanelPrompt", () => {
  it("assembles style, shot, scene, character, and keywords", () => {
    const prompt = buildPanelPrompt(baseStyle, basePanel, chars);
    expect(prompt).toContain("cyberpunk neon-lit comic art");
    expect(prompt).toContain("bold ink lines");
    expect(prompt).toContain("wide shot");
    expect(prompt).toContain("Zara grinds down a neon-lit rail above the city");
    expect(prompt).toContain("character: Zara (tall, blue mohawk, neon jacket)");
    expect(prompt).toContain("dynamic lighting");
    expect(prompt).toContain("sparks");
  });

  it("omits color palette label for full-color", () => {
    const prompt = buildPanelPrompt(baseStyle, basePanel, chars);
    // "full-color" maps to empty string, so no "full-color" text in the prompt
    expect(prompt).not.toContain("full-color");
  });

  it("includes multiple characters when panel references them", () => {
    const multiPanel: Panel = { ...basePanel, characterIds: ["c1", "c2"] };
    const prompt = buildPanelPrompt(baseStyle, multiPanel, chars);
    expect(prompt).toContain("Zara");
    expect(prompt).toContain("Rex");
  });

  it("omits characters not in panel", () => {
    const prompt = buildPanelPrompt(baseStyle, basePanel, chars);
    expect(prompt).not.toContain("Rex");
  });
});

describe("gatherReferenceImages", () => {
  it("returns images for characters in panel only", () => {
    const urls = gatherReferenceImages(basePanel, chars);
    expect(urls).toEqual(["/comic-references/zara.png"]);
  });

  it("returns all images across multiple characters", () => {
    const multiPanel: Panel = { ...basePanel, characterIds: ["c1", "c2"] };
    const urls = gatherReferenceImages(multiPanel, chars);
    expect(urls).toEqual(["/comic-references/zara.png", "/comic-references/rex1.png", "/comic-references/rex2.png"]);
  });

  it("returns empty array for no characters", () => {
    const emptyPanel: Panel = { ...basePanel, characterIds: [] };
    const urls = gatherReferenceImages(emptyPanel, chars);
    expect(urls).toEqual([]);
  });
});
