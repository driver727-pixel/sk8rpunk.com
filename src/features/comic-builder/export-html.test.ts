import { describe, expect, it } from "vitest";
import { buildComicHtmlDocument } from "./export-html";
import type { ComicProject } from "./types";

const project: ComicProject = {
  id: "project-1",
  schemaVersion: "comic-builder.v1",
  title: `Neon <Rush> & "Echo"`,
  createdAt: "2026-06-04T12:00:00.000Z",
  updatedAt: "2026-06-04T12:30:00.000Z",
  characters: [],
  style: {
    artStyle: "cyberpunk-neon",
    inkStyle: "bold-ink",
    colorPalette: "full-color",
    defaultAspectRatio: "3:4",
    defaultResolution: "1K",
    globalKeywords: [],
  },
  pages: [
    {
      id: "page-1",
      pageNumber: 1,
      panels: [
        {
          id: "panel-1",
          scene: "Dash through the rain",
          characterIds: [],
          shotType: "wide",
          extraKeywords: [],
          dialogue: [
            { id: "d1", type: "speech", text: `Go <now> & "fly"`, characterId: null, x: 20, y: 10 },
          ],
          generatedImageUrl: "https://example.com/panel.png",
          seed: 42,
          seedLocked: false,
        },
      ],
    },
  ],
};

describe("buildComicHtmlDocument", () => {
  it("renders project metadata and panels into a standalone HTML document", () => {
    const html = buildComicHtmlDocument(project);
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Page 1");
    expect(html).toContain("https://example.com/panel.png");
    expect(html).toContain("1 pages · 1/1 panels ready");
  });

  it("escapes user-authored content before embedding it into HTML", () => {
    const html = buildComicHtmlDocument(project);
    expect(html).toContain("Neon &lt;Rush&gt; &amp; &quot;Echo&quot;");
    expect(html).toContain("Go &lt;now&gt; &amp; &quot;fly&quot;");
    expect(html).not.toContain(`Go <now> & "fly"`);
  });
});
