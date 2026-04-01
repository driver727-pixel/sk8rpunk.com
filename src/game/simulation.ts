import type { CharacterCard, GameState, RouteDefinition, Skater, SquadSummary } from "./types";

export const TICK_MS = 30_000;

const MAX_OFFLINE_MS = 1000 * 60 * 60 * 24;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const addNotification = (state: GameState, message: string) => {
  state.notifications = [message, ...state.notifications].slice(0, 8);
};

export const getRouteById = (routes: RouteDefinition[], routeId?: string) =>
  routes.find((route) => route.id === routeId);

const refreshFlashcard = (state: GameState, skater: Skater) => {
  const index = state.flashcards.findIndex((card) => card.id === skater.id);
  if (index === -1) {
    return;
  }

  state.flashcards[index] = {
    ...state.flashcards[index],
    body: `${skater.handle} has completed ${skater.totalRuns} route loops and banked ${skater.totalCreditsEarned} credits.`,
  };
};

const completeRun = (
  state: GameState,
  skater: Skater,
  route: RouteDefinition,
  finishedAt: Date,
  runOffset: number
) => {
  const payout = Math.round(route.payoutCredits * skater.speedMultiplier);
  const bonusFuelCell = (skater.totalRuns + runOffset + route.riskTier) % 5 === 0;

  state.credits += payout;
  skater.totalCreditsEarned += payout;
  skater.totalRuns += 1;
  skater.reputation += route.repGain;
  skater.battery = clamp(skater.battery - route.batteryCost, 0, skater.maxBattery);
  skater.lastCompletedAt = finishedAt.toISOString();
  refreshFlashcard(state, skater);

  if (bonusFuelCell) {
    state.premiumFuelCells += 1;
    addNotification(
      state,
      `${skater.handle} finished ${route.name} and scavenged a premium fuel cell.`
    );
  } else {
    addNotification(state, `${skater.handle} finished ${route.name} for ${payout} credits.`);
  }
};

export const advanceState = (source: GameState, now = new Date()): GameState => {
  const state = structuredClone(source);
  const lastTick = new Date(source.lastTickAt);
  let elapsedMs = now.getTime() - lastTick.getTime();

  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    state.lastTickAt = now.toISOString();
    return state;
  }

  elapsedMs = Math.min(elapsedMs, MAX_OFFLINE_MS);

  state.skaters.forEach((skater) => {
    skater.lastUpdatedAt = now.toISOString();

    if (!skater.routeId) {
      skater.battery = clamp(
        skater.battery + elapsedMs / (1000 * 60 * 2),
        0,
        skater.maxBattery
      );
      return;
    }

    const route = getRouteById(state.routes, skater.routeId);
    if (!route) {
      skater.routeId = undefined;
      skater.routeProgressMs = 0;
      return;
    }

    if (skater.battery < route.batteryCost) {
      skater.routeProgressMs = 0;
      skater.battery = clamp(
        skater.battery + elapsedMs / (1000 * 60 * 3),
        0,
        skater.maxBattery
      );
      addNotification(state, `${skater.handle} is recharging before the next ${route.name} run.`);
      return;
    }

    const cycleMs = route.durationMinutes * 60 * 1000;
    let remainingRealMs = elapsedMs;
    let progressMs = skater.routeProgressMs;
    let runOffset = 0;

    while (remainingRealMs > 0 && skater.battery >= route.batteryCost) {
      const effectiveElapsed = remainingRealMs * skater.speedMultiplier;
      const totalProgress = progressMs + effectiveElapsed;

      if (totalProgress < cycleMs) {
        progressMs = totalProgress;
        remainingRealMs = 0;
        break;
      }

      const effectiveNeeded = cycleMs - progressMs;
      const realNeeded = effectiveNeeded / skater.speedMultiplier;
      remainingRealMs = Math.max(0, remainingRealMs - realNeeded);
      progressMs = 0;

      const finishedAt = new Date(now.getTime() - remainingRealMs);
      completeRun(state, skater, route, finishedAt, runOffset);
      runOffset += 1;
    }

    skater.routeProgressMs = progressMs;

    if (skater.battery < route.batteryCost) {
      addNotification(state, `${skater.handle} is battery-locked on ${route.name}.`);
    }
  });

  state.lastTickAt = now.toISOString();
  return state;
};

export const assignRoute = (source: GameState, skaterId: string, routeId: string): GameState => {
  const state = structuredClone(source);
  const skater = state.skaters.find((item) => item.id === skaterId);
  const route = state.routes.find((item) => item.id === routeId);

  if (!skater || !route) {
    return state;
  }

  skater.routeId = route.id;
  skater.routeProgressMs = 0;
  addNotification(
    state,
    `${skater.handle} assigned to ${route.name}. This loop will continue from saved timestamps while the player is away.`
  );
  return state;
};

export const clearRoute = (source: GameState, skaterId: string): GameState => {
  const state = structuredClone(source);
  const skater = state.skaters.find((item) => item.id === skaterId);

  if (!skater) {
    return state;
  }

  skater.routeId = undefined;
  skater.routeProgressMs = 0;
  addNotification(state, `${skater.handle} returned to the garage.`);
  return state;
};

export const rechargeSkater = (
  source: GameState,
  skaterId: string,
  reason: "fuel-cell" | "rewarded-ad"
): GameState => {
  const state = structuredClone(source);
  const skater = state.skaters.find((item) => item.id === skaterId);

  if (!skater) {
    return state;
  }

  if (reason === "fuel-cell") {
    if (state.premiumFuelCells <= 0) {
      return state;
    }
    state.premiumFuelCells -= 1;
  } else {
    state.monetization.rewardedRechargeCount += 1;
  }

  skater.battery = skater.maxBattery;
  addNotification(
    state,
    reason === "fuel-cell"
      ? `${skater.handle} recharged instantly using a premium fuel cell.`
      : `${skater.handle} watched a rewarded ad and got a full battery recharge.`
  );
  return state;
};

export const repairSkater = (source: GameState, skaterId: string): GameState => {
  const state = structuredClone(source);
  const skater = state.skaters.find((item) => item.id === skaterId);

  if (!skater) {
    return state;
  }

  state.monetization.rewardedRepairCount += 1;
  skater.battery = clamp(skater.battery + skater.maxBattery * 0.5, 0, skater.maxBattery);
  addNotification(
    state,
    `${skater.handle} watched a rewarded ad and got a half-charge emergency repair.`
  );
  return state;
};

export const getSquadSummary = (state: GameState): SquadSummary => ({
  credits: state.credits,
  fuelCells: state.premiumFuelCells,
  activeRoutes: state.skaters.filter((skater) => !!skater.routeId).length,
  rewardedRecharges: state.monetization.rewardedRechargeCount,
});

export const addCreatedCard = (source: GameState, card: CharacterCard): GameState => {
  const state = structuredClone(source);
  state.createdCards = [...state.createdCards, card];
  addNotification(state, `Character card created: ${card.handle} (${card.rarity}).`);
  return state;
};
