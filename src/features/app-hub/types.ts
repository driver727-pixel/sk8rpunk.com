import type { Screen } from "../../game/types";

/**
 * Where an app lives relative to the Skater-Punk IP.
 *
 * - `"skater-punk"` — part of the Skater-Punk universe (like Punchskater).
 * - `"sp-digital"` — an SP Digital LLC product outside the Skater-Punk IP.
 */
export type AppUniverse = "skater-punk" | "sp-digital";

/** Shared fields for every app listed in the hub. */
interface PlatformAppBase {
  /** Stable machine identifier used in navigation and storage. */
  id: string;
  /** Display name shown in the hub grid. */
  name: string;
  /** Optional external domain where the app is also available. */
  domain?: string;
  /** Short tagline shown below the name. */
  tagline: string;
  /** Longer description for the hub detail area. */
  description: string;
  /** Accent color used for the hub tile border and branding. */
  accentColor: string;
  /** Optional list of feature chips displayed on the hub tile. */
  features?: string[];
  /** Whether the app is usable today or still in development. */
  status: "live" | "coming-soon";
  /** Which universe or company division the app belongs to. */
  universe: AppUniverse;
}

/** An app that runs inside the Skater-Punk shell (has an in-app screen). */
export interface InternalApp extends PlatformAppBase {
  kind: "internal";
  /** The Screen value that mounts this app inside the shell. */
  screen: Screen;
}

/** An app that lives at an external URL (opens in a new tab). */
export interface ExternalApp extends PlatformAppBase {
  kind: "external";
  /** Full URL to the external app. */
  url: string;
}

export type PlatformApp = InternalApp | ExternalApp;
