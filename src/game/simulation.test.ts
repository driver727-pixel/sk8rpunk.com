import { describe, expect, it } from "vitest";
import { ROUTES, createInitialState } from "./content";
import { addCreatedCard, advanceState, assignRoute } from "./simulation";
import type { CharacterCard } from "./types";

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

describe("addCreatedCard", () => {
  const fixture: CharacterCard = {
    id: "test-card-1",
    handle: "Vex Halo",
    specialty: "Night Voltage",
    boardName: "Phantom Deck",
    rarity: "rare",
    accent: "#9f5fff",
    stats: { speed: 9, control: 7, cargo: 4, tech: 6 },
    passive: "Shortcuts",
    ability: "Surge Lane",
    seed: "abc123",
    createdAt: "2026-04-01T00:00:00.000Z",
  };

  it("appends the card to createdCards and adds a notification", () => {
    const state = createInitialState();
    const next = addCreatedCard(state, fixture);

    expect(next.createdCards).toHaveLength(1);
    expect(next.createdCards[0]).toEqual(fixture);
    expect(next.notifications[0]).toContain("Vex Halo");
    expect(next.notifications[0]).toContain("rare");
  });

  it("does not mutate the source state", () => {
    const state = createInitialState();
    addCreatedCard(state, fixture);

    expect(state.createdCards).toHaveLength(0);
  });
});
