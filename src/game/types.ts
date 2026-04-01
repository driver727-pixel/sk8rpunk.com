export type Screen = "map" | "cards" | "garage" | "forge";

export type CardRarity = "common" | "uncommon" | "rare" | "legendary";

export interface CardStats {
  speed: number;
  control: number;
  cargo: number;
  tech: number;
}

export interface CharacterCard {
  id: string;
  handle: string;
  specialty: string;
  boardName: string;
  rarity: CardRarity;
  accent: string;
  stats: CardStats;
  passive: string;
  ability: string;
  seed: string;
  createdAt: string;
}

export type RewardType = "instant-recharge" | "emergency-repair";

export interface RouteDefinition {
  id: string;
  name: string;
  district: string;
  summary: string;
  durationMinutes: number;
  batteryCost: number;
  payoutCredits: number;
  repGain: number;
  riskTier: 1 | 2 | 3 | 4;
  cargo: string[];
}

export interface Skater {
  id: string;
  handle: string;
  specialty: string;
  boardName: string;
  accent: string;
  loadout: string;
  maxBattery: number;
  battery: number;
  speedMultiplier: number;
  reputation: number;
  routeId?: string;
  routeProgressMs: number;
  totalRuns: number;
  totalCreditsEarned: number;
  lastUpdatedAt: string;
  lastCompletedAt?: string;
}

export interface Flashcard {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  accent: string;
}

export interface DistrictCard {
  zone: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface GarageUpgrade {
  id: string;
  label: string;
  description: string;
  costCredits: number;
  batteryBoost: number;
}

export interface MonetizationState {
  rewardedRechargeCount: number;
  rewardedRepairCount: number;
  admobStatus: "mock" | "admob-ready";
  pendingReward: RewardType | null;
}

export interface GameState {
  credits: number;
  premiumFuelCells: number;
  lastTickAt: string;
  monetization: MonetizationState;
  skaters: Skater[];
  flashcards: Flashcard[];
  routes: RouteDefinition[];
  garageUpgrades: GarageUpgrade[];
  districtCards: DistrictCard[];
  notifications: string[];
  createdCards: CharacterCard[];
}

export interface SquadSummary {
  credits: number;
  fuelCells: number;
  activeRoutes: number;
  rewardedRecharges: number;
}

export interface RewardResult {
  granted: boolean;
  rewardName: string;
  detail: string;
}
