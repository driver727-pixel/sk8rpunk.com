import type { PlatformApp } from "./types";

/**
 * Central catalog of every game and app listed on the Skater-Punk hub.
 *
 * Apps are split by universe:
 * - `"skater-punk"` — part of the Skater-Punk IP (runs inside the shell).
 * - `"sp-digital"` — other SP Digital LLC products (linked externally).
 *
 * Add new entries here as more projects are integrated.
 */
export const PLATFORM_APPS: readonly PlatformApp[] = [
  /* ── Skater-Punk universe ─────────────────────── */
  {
    id: "punchskater",
    kind: "internal",
    name: "Punchskater",
    domain: "punchskater.com",
    tagline: "Cyberpunk courier card forge",
    description:
      "Generate collectible electric-skateboard courier cards, assemble decks, and export structured JSON for future game projects. Built on deterministic TypeScript generation and procedural SVG art.",
    accentColor: "#19f2ff",
    screen: "forge",
    features: [
      "Card generation",
      "Deck builder",
      "JSON export",
      "Procedural SVG art",
      "Reroll controls",
    ],
    status: "live",
    universe: "skater-punk",
  },

  /* ── SP Digital LLC ───────────────────────────── */
  {
    id: "craftlingua",
    kind: "external",
    name: "Craftlingua",
    domain: "craftlingua.app",
    tagline: "Language learning through craft",
    description:
      "Craftlingua is an SP Digital LLC app for hands-on language learning. It lives outside the Skater-Punk universe but shares the same creative studio.",
    accentColor: "#f5a623",
    url: "https://craftlingua.app",
    features: ["Language learning", "Craft-based lessons"],
    status: "live",
    universe: "sp-digital",
  },
];

/** All apps that belong to the Skater-Punk IP universe. */
export const SKATER_PUNK_APPS = PLATFORM_APPS.filter(
  (app) => app.universe === "skater-punk",
);

/** All apps from SP Digital LLC that are outside the Skater-Punk IP. */
export const SP_DIGITAL_APPS = PLATFORM_APPS.filter(
  (app) => app.universe === "sp-digital",
);

/** Look up an app by its id. */
export const getAppById = (id: string): PlatformApp | undefined =>
  PLATFORM_APPS.find((app) => app.id === id);

/** Look up an app by its associated screen value (internal apps only). */
export const getAppByScreen = (screen: string): PlatformApp | undefined =>
  PLATFORM_APPS.find((app) => app.kind === "internal" && app.screen === screen);
