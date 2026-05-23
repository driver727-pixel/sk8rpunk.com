import { describe, expect, it } from "vitest";

import { getSeoDefinition } from "./seo";

describe("getSeoDefinition", () => {
  it("returns indexable home metadata with structured data", () => {
    const seo = getSeoDefinition(null, "https://punchskater.com");

    expect(seo.title).toContain("Sk8r Punk™");
    expect(seo.canonical).toBe("https://sk8rpunk.com/");
    expect(seo.robots).toContain("index");
    expect(seo.structuredData).toBeTruthy();
  });

  it("marks the bios page as non-indexable", () => {
    const seo = getSeoDefinition("bios", "https://punchskater.com");

    expect(seo.title).toBe("Character Bios | Sk8r Punk™");
    expect(seo.canonical).toBe("https://sk8rpunk.com/?page=bios");
    expect(seo.robots).toBe("noindex, nofollow, noarchive");
    expect(seo.structuredData).toBeUndefined();
  });

  it("marks the joustur-skatur redirect page as non-indexable", () => {
    const seo = getSeoDefinition("joustur-skatur", "https://punchskater.com");

    expect(seo.title).toBe("Joustur Skatur™ | Sk8r Punk™");
    expect(seo.robots).toBe("noindex, nofollow, noarchive");
  });
});
