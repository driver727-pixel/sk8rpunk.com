import { describe, expect, it } from "vitest";
import { ROUTES, createInitialState } from "./content";
import { advanceState, assignRoute } from "./simulation";

describe("advanceState", () => {
  it("completes route loops from elapsed time and awards credits", () => {
    const startedAt = new Date("2026-03-31T00:00:00.000Z");
    let state = createInitialState();
    state.lastTickAt = startedAt.toISOString();
    state = assignRoute(state, state.skaters[0].id, ROUTES[0].id);

    const advanced = advanceState(
      state,
      new Date(startedAt.getTime() + ROUTES[0].durationMinutes * 60_000 + 5_000),
    );

    expect(advanced.credits).toBeGreaterThan(state.credits);
    expect(advanced.skaters[0].totalRuns).toBe(1);
    expect(advanced.skaters[0].battery).toBeLessThan(state.skaters[0].battery);
  });

  it("recharges idle skaters over time while offline", () => {
    const startedAt = new Date("2026-03-31T00:00:00.000Z");
    const state = createInitialState();
    state.lastTickAt = startedAt.toISOString();
    state.skaters[1].battery = 20;

    const advanced = advanceState(state, new Date(startedAt.getTime() + 20 * 60_000));

    expect(advanced.skaters[1].battery).toBeGreaterThan(20);
    expect(advanced.skaters[1].battery).toBeLessThanOrEqual(
      advanced.skaters[1].maxBattery,
    );
  });
});
