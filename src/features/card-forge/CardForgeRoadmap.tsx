import type { ReactNode } from "react";
import type { CardForgeProps } from "./types";
import { FORGE_FILE_PLAN, FORGE_LIST_SECTIONS, FORGE_ROADMAP } from "./blueprint";

interface CardForgeRoadmapProps extends CardForgeProps {
  forgeApp?: ReactNode;
}

export function CardForgeRoadmap({ forgeApp }: CardForgeRoadmapProps) {
  if (forgeApp) {
    return <>{forgeApp}</>;
  }

  return (
    <>
      <div className="section-heading">
        <h2>Card Forge</h2>
        <p>
          A future home for the Character card creator with a UI placeholder, extraction targets, and an
          implementation order that fits this repo.
        </p>
      </div>

      <div className="forge-grid">
        <article className="panel forge-panel">
          <p className="eyebrow">Feature entry point</p>
          <h3>Future Character Card Creator</h3>
          <p>
            This tab is the first stable path for the Character card creator. When implementation starts, keep
            the live route simulator intact and grow the forge behind this screen.
          </p>
          <div className="chip-row">
            <span className="chip">Seeded generation</span>
            <span className="chip">Structured card JSON</span>
            <span className="chip">HTML/CSS preview</span>
            <span className="chip">Reroll + lock flow</span>
          </div>

          <div className="forge-preview-card" aria-label="Character card creator preview scaffold">
            <div className="forge-preview-header">
              <div>
                <p className="eyebrow">Rare courier</p>
                <h3>Vex Halo</h3>
              </div>
              <span className="badge">Night Voltage</span>
            </div>

            <div className="forge-preview-art">
              <span>Portrait layers + district background slot</span>
            </div>

            <div className="forge-stat-grid">
              <div className="metric-card">
                <span className="metric-label">Speed</span>
                <strong>9</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Control</span>
                <strong>7</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Cargo</span>
                <strong>4</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Tech</span>
                <strong>6</strong>
              </div>
            </div>

            <div className="forge-preview-footer">
              <div>
                <span className="metric-label">Passive</span>
                <strong>Shortcuts</strong>
              </div>
              <div>
                <span className="metric-label">Ability</span>
                <strong>Surge Lane</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="panel forge-panel">
          <p className="eyebrow">Suggested file plan</p>
          <h3>First extraction targets</h3>
          <p className="muted">
            These files provide a clean way to move from roadmap to implementation without tangling the forge
            with the current delivery simulation state.
          </p>
          <ul className="economy-list forge-file-list">
            {FORGE_FILE_PLAN.map((path) => (
              <li key={path}>
                <code>{path}</code>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="forge-list-grid">
        {FORGE_LIST_SECTIONS.map((section) => (
          <article key={section.title} className="panel intel-card forge-list-card">
            <p className="eyebrow">{section.title}</p>
            <h3>{section.title}</h3>
            <ul className="economy-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="forge-roadmap">
        {FORGE_ROADMAP.map((step) => (
          <article key={step.phase} className="panel forge-step">
            <div className="forge-step-header">
              <p className="eyebrow">{step.phase}</p>
              <h3>{step.title}</h3>
            </div>
            <p>{step.summary}</p>
            <ul className="economy-list">
              {step.deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}
