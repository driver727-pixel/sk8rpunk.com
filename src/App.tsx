import { useEffect, useMemo, useState } from "react";
import { createAdService } from "./game/ads";
import {
  DISTRICT_CARDS,
  GARAGE_UPGRADES,
  ROUTES,
  createInitialState,
} from "./game/content";
import {
  advanceState,
  assignRoute,
  clearRoute,
  getRouteById,
  getSquadSummary,
  rechargeSkater,
  repairSkater,
  tickIntervalMs,
} from "./game/simulation";
import { loadState, saveState } from "./game/storage";
import type { GameState, RouteDefinition, Screen, Skater } from "./game/types";
import "./styles.css";

const adService = createAdService();

const formatProgress = (skater: Skater, route?: RouteDefinition) => {
  if (!route || !skater.routeId) {
    return "No route assigned";
  }

  const totalMs = route.durationMinutes * 60 * 1000;
  const progress = Math.min(100, Math.round((skater.routeProgressMs / totalMs) * 100));
  return `${progress}% through current loop`;
};

const getStatusLabel = (skater: Skater, route?: RouteDefinition) => {
  if (!skater.routeId) {
    return "Idle";
  }
  if (!route) {
    return "Unassigned";
  }
  if (skater.battery < route.batteryCost) {
    return "Charging";
  }
  return "Auto-route";
};

function RouteCard({
  route,
  onAssign,
  disabled,
  selected,
}: {
  route: RouteDefinition;
  onAssign: (routeId: string) => void;
  disabled: boolean;
  selected: boolean;
}) {
  return (
    <article className={`panel route-card ${selected ? "selected-card" : ""}`}>
      <p className="eyebrow">{route.district}</p>
      <h3>{route.name}</h3>
      <p className="muted">{route.summary}</p>
      <div className="summary-grid">
        <div className="metric-card">
          <span className="metric-label">Cycle</span>
          <strong>{route.durationMinutes} min</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Battery</span>
          <strong>-{route.batteryCost}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Payout</span>
          <strong>{route.payoutCredits} cr</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Risk</span>
          <strong>T{route.riskTier}</strong>
        </div>
      </div>
      <div className="chip-row">
        {route.cargo.map((cargo) => (
          <span key={cargo} className="chip">
            {cargo}
          </span>
        ))}
      </div>
      <div className="route-actions">
        <button disabled={disabled} onClick={() => onAssign(route.id)}>
          Queue route
        </button>
      </div>
    </article>
  );
}

function RiderCard({
  skater,
  route,
  selected,
  onSelect,
  onRecharge,
  onRepair,
}: {
  skater: Skater;
  route?: RouteDefinition;
  selected: boolean;
  onSelect: () => void;
  onRecharge: () => void;
  onRepair: () => void;
}) {
  const batteryPercent = Math.round((skater.battery / skater.maxBattery) * 100);

  return (
    <article className={`panel rider-card ${selected ? "selected-card" : ""}`}>
      <button className="rider-select" onClick={onSelect}>
        <div>
          <p className="eyebrow">{skater.specialty}</p>
          <h3>{skater.handle}</h3>
          <p className="muted">{skater.boardName}</p>
        </div>
        <span className="badge">{getStatusLabel(skater, route)}</span>
      </button>

      <div className="summary-grid">
        <div className="metric-card">
          <span className="metric-label">Battery</span>
          <strong>{batteryPercent}%</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Runs</span>
          <strong>{skater.totalRuns}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Credits</span>
          <strong>{skater.totalCreditsEarned}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Rep</span>
          <strong>{skater.reputation}</strong>
        </div>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${batteryPercent}%` }} />
      </div>
      <p className="muted">{formatProgress(skater, route)}</p>

      <div className="route-actions">
        <button onClick={onRecharge}>Rewarded recharge</button>
        <button className="secondary" onClick={onRepair}>
          Repair burst ad
        </button>
      </div>
    </article>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("map");
  const [state, setState] = useState<GameState>(() => loadState() ?? createInitialState());
  const [selectedSkaterId, setSelectedSkaterId] = useState<string>(
    () => loadState()?.skaters[0]?.id ?? createInitialState().skaters[0].id,
  );
  const [toast, setToast] = useState(
    "Rewarded boosts use a browser mock on web and can be replaced with a Google AdMob rewarded adapter on Android.",
  );

  useEffect(() => {
    setState((current) => advanceState(current));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => advanceState(current));
    }, tickIntervalMs);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!state.skaters.some((skater) => skater.id === selectedSkaterId)) {
      setSelectedSkaterId(state.skaters[0]?.id ?? "");
    }
  }, [selectedSkaterId, state.skaters]);

  const selectedSkater = useMemo(
    () => state.skaters.find((skater) => skater.id === selectedSkaterId) ?? state.skaters[0],
    [selectedSkaterId, state.skaters],
  );
  const summary = useMemo(() => getSquadSummary(state), [state]);

  const updateState = (nextState: GameState, message?: string) => {
    setState(advanceState(nextState));
    if (message) {
      setToast(message);
    }
  };

  const handleAssignRoute = (routeId: string) => {
    if (!selectedSkater) {
      return;
    }
    const route = getRouteById(state.routes, routeId);
    updateState(
      assignRoute(state, selectedSkater.id, routeId),
      route
        ? `${selectedSkater.handle} is now looping ${route.name}. Progress continues from saved timestamps when the player returns.`
        : undefined,
    );
  };

  const handleClearRoute = () => {
    if (!selectedSkater) {
      return;
    }
    updateState(clearRoute(state, selectedSkater.id));
  };

  const handleReward = async (skaterId: string, rewardType: "instant-recharge" | "emergency-repair") => {
    const result = await adService.showRewardedAd(rewardType);
    if (!result.granted) {
      setToast("Rewarded ad was skipped. No boost granted.");
      return;
    }

    const nextState =
      rewardType === "instant-recharge"
        ? rechargeSkater(state, skaterId, "rewarded-ad")
        : repairSkater(state, skaterId);

    updateState(nextState, result.detail);
  };

  return (
    <div className="app-shell">
      <header className="panel hero">
        <div>
          <p className="eyebrow">Skater-Punk Dispatch</p>
          <h1>Neon courier routes that keep earning while the player is away.</h1>
          <p>
            This prototype establishes the core loop for a cyberpunk delivery manager: a garage of
            skateboard couriers, user-selected automated routes, offline progression, and rewarded ad boosts
            designed for Google AdMob on Android.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <span>Credits</span>
            <strong>{summary.credits} cr</strong>
          </div>
          <div>
            <span>Fuel cells</span>
            <strong>{summary.fuelCells}</strong>
          </div>
          <div>
            <span>Live routes</span>
            <strong>{summary.activeRoutes}</strong>
          </div>
          <div>
            <span>Rewarded recharges</span>
            <strong>{summary.rewardedRecharges}</strong>
          </div>
        </div>
      </header>

      <nav className="tabs" aria-label="Game screens">
        {(["map", "cards", "garage"] as Screen[]).map((tab) => (
          <button key={tab} className={`tab ${screen === tab ? "active" : ""}`} onClick={() => setScreen(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      <main className="layout">
        <section className="column">
          <div className="section-heading">
            <h2>Squad</h2>
            <p>{state.skaters.length} of 6 skateboarders unlocked</p>
          </div>
          <div className="stack">
            {state.skaters.map((skater) => (
              <RiderCard
                key={skater.id}
                skater={skater}
                route={getRouteById(state.routes, skater.routeId)}
                selected={selectedSkater?.id === skater.id}
                onSelect={() => setSelectedSkaterId(skater.id)}
                onRecharge={() => void handleReward(skater.id, "instant-recharge")}
                onRepair={() => void handleReward(skater.id, "emergency-repair")}
              />
            ))}
          </div>
        </section>

        <section className="column">
          {screen === "map" && (
            <>
              <div className="section-heading">
                <h2>Route map</h2>
                <p>Choose a district route for the selected skater. The loop continues in real time while away.</p>
              </div>
              <div className="route-grid">
                {ROUTES.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    selected={selectedSkater?.routeId === route.id}
                    disabled={!selectedSkater || selectedSkater.battery < route.batteryCost}
                    onAssign={handleAssignRoute}
                  />
                ))}
              </div>
            </>
          )}

          {screen === "cards" && (
            <>
              <div className="section-heading">
                <h2>Flash cards</h2>
                <p>District and skater guidance for economy tuning, event design, and route balance.</p>
              </div>
              <div className="card-grid">
                {DISTRICT_CARDS.map((card) => (
                  <article key={card.title} className="panel intel-card">
                    <p className="eyebrow">{card.zone}</p>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <ul className="economy-list">
                      {card.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </article>
                ))}
                {state.flashcards.map((card) => (
                  <article key={card.id} className="panel intel-card">
                    <p className="eyebrow">{card.subtitle}</p>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
            </>
          )}

          {screen === "garage" && selectedSkater && (
            <>
              <div className="section-heading">
                <h2>Garage</h2>
                <p>Manage energy uptime, monetization hooks, and upgrade anchors for {selectedSkater.handle}.</p>
              </div>
              <article className="panel garage-panel">
                <div className="garage-focus">
                  <div>
                    <p className="eyebrow">{selectedSkater.specialty}</p>
                    <h3>{selectedSkater.boardName}</h3>
                    <p>{selectedSkater.loadout}</p>
                  </div>
                  <div className="garage-stats">
                    <div>
                      <span>Assigned route</span>
                      <strong>{getRouteById(state.routes, selectedSkater.routeId)?.name ?? "None"}</strong>
                    </div>
                    <div>
                      <span>Battery</span>
                      <strong>{Math.round((selectedSkater.battery / selectedSkater.maxBattery) * 100)}%</strong>
                    </div>
                    <div>
                      <span>Total runs</span>
                      <strong>{selectedSkater.totalRuns}</strong>
                    </div>
                    <div>
                      <span>Last complete</span>
                      <strong>
                        {selectedSkater.lastCompletedAt
                          ? new Date(selectedSkater.lastCompletedAt).toLocaleTimeString()
                          : "No runs yet"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="garage-actions">
                  <button onClick={() => void handleReward(selectedSkater.id, "instant-recharge")}>
                    Watch ad for full recharge
                  </button>
                  <button
                    className="secondary"
                    disabled={state.premiumFuelCells <= 0}
                    onClick={() =>
                      updateState(
                        rechargeSkater(state, selectedSkater.id, "fuel-cell"),
                        `${selectedSkater.handle} burned one premium fuel cell for an instant recharge.`,
                      )
                    }
                  >
                    Use fuel cell ({state.premiumFuelCells})
                  </button>
                  <button className="secondary" onClick={handleClearRoute}>
                    Pull back to garage
                  </button>
                </div>
              </article>

              <div className="card-grid">
                <article className="panel intel-card">
                  <p className="eyebrow">Monetization lane</p>
                  <h3>Rewarded AdMob hooks</h3>
                  <ul className="economy-list">
                    <li>Primary reward: instant full battery refill for route continuity.</li>
                    <li>Secondary reward: emergency repair burst for a partial charge recovery.</li>
                    <li>Android integration boundary already exists in <code>src/game/ads.ts</code>.</li>
                  </ul>
                </article>
                <article className="panel intel-card">
                  <p className="eyebrow">Upgrade roadmap</p>
                  <h3>Garage progression</h3>
                  <div className="chip-row">
                    {GARAGE_UPGRADES.map((upgrade) => (
                      <span key={upgrade.id} className="chip">
                        {upgrade.label} - {upgrade.costCredits} cr
                      </span>
                    ))}
                  </div>
                  <p className="muted">
                    These are hooks for the next pass: passive recharge, better route AI, premium districts,
                    and cosmetic monetization.
                  </p>
                </article>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="panel footer-panel">
        <div>
          <h3>Dispatch feed</h3>
          <ul className="economy-list">
            {state.notifications.slice(0, 4).map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div className="toast">
          <h3>Current note</h3>
          <p>{toast}</p>
          <p className="muted">
            Offline progression is derived from <code>lastTickAt</code>, which keeps route loops persistent
            across refreshes and lays groundwork for a future backend sync layer.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
