import { SKATER_PUNK_APPS, SP_DIGITAL_APPS } from "./registry";
import type { PlatformApp } from "./types";

interface AppHubProps {
  onLaunchApp: (screen: string) => void;
}

function AppTile({
  app,
  onLaunch,
}: {
  app: PlatformApp;
  onLaunch: () => void;
}) {
  const isExternal = app.kind === "external";

  return (
    <article
      className="panel app-tile"
      style={{ borderColor: app.accentColor }}
    >
      <div className="app-tile-header">
        <div>
          <h3>{app.name}</h3>
          {app.domain && (
            <p className="muted app-tile-domain">{app.domain}</p>
          )}
        </div>
        <span
          className={`badge ${app.status === "live" ? "badge-live" : "badge-soon"}`}
        >
          {app.status === "live" ? "Live" : "Coming soon"}
        </span>
      </div>

      <p className="app-tile-tagline">{app.tagline}</p>
      <p className="muted">{app.description}</p>

      {app.features && app.features.length > 0 && (
        <div className="chip-row">
          {app.features.map((feature) => (
            <span key={feature} className="chip">
              {feature}
            </span>
          ))}
        </div>
      )}

      <div className="route-actions">
        {isExternal ? (
          <a
            className="app-tile-link-button"
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            style={
              app.status === "live"
                ? { backgroundColor: app.accentColor, color: "#0a0e17" }
                : undefined
            }
          >
            Visit {app.name} ↗
          </a>
        ) : (
          <button
            disabled={app.status !== "live"}
            onClick={onLaunch}
            style={
              app.status === "live"
                ? { backgroundColor: app.accentColor, color: "#0a0e17" }
                : undefined
            }
          >
            {app.status === "live" ? `Launch ${app.name}` : "In development"}
          </button>
        )}
      </div>
    </article>
  );
}

export function AppHub({ onLaunchApp }: AppHubProps) {
  return (
    <>
      {/* ── Skater-Punk Universe ──────────────────── */}
      <div className="section-heading">
        <h2>Skater-Punk Universe</h2>
        <p>
          Games and apps set inside the Skater-Punk IP — a neon-lit cyberpunk
          courier world of electric skateboarders, districts, and crews.
        </p>
      </div>

      <div className="app-hub-grid">
        {SKATER_PUNK_APPS.map((app) => (
          <AppTile
            key={app.id}
            app={app}
            onLaunch={() =>
              app.kind === "internal" ? onLaunchApp(app.screen) : undefined
            }
          />
        ))}
      </div>

      {/* ── SP Digital LLC ────────────────────────── */}
      {SP_DIGITAL_APPS.length > 0 && (
        <>
          <div className="section-heading hub-section-divider">
            <h2>More from SP Digital LLC</h2>
            <p>
              Other apps and tools by SP Digital LLC that live outside the
              Skater-Punk universe.
            </p>
          </div>

          <div className="app-hub-grid">
            {SP_DIGITAL_APPS.map((app) => (
              <AppTile
                key={app.id}
                app={app}
                onLaunch={() =>
                  app.kind === "internal" ? onLaunchApp(app.screen) : undefined
                }
              />
            ))}
          </div>
        </>
      )}

      {/* ── Platform roadmap ──────────────────────── */}
      <article className="panel integration-panel">
        <div className="section-heading">
          <h2>Platform roadmap</h2>
          <p>
            More games and tools are in development across the Skater-Punk IP
            and SP Digital LLC.
          </p>
        </div>
        <ul className="economy-list">
          <li>
            <strong>Punchskater</strong> — card creation tool for building
            cyberpunk courier decks. <em>Live now.</em>
          </li>
          <li>
            <strong>Craftlingua</strong> — language learning through craft, by
            SP Digital LLC. <em>Live at craftlingua.app.</em>
          </li>
          <li>
            <strong>Courier dispatch</strong> — automated route simulation with
            real-time progression and rewarded ad boosts.{" "}
            <em>Available in the map, cards, and garage tabs.</em>
          </li>
          <li>
            <strong>More coming</strong> — future apps will plug into this hub
            as they ship.
          </li>
        </ul>
      </article>
    </>
  );
}
