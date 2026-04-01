import { ARCHETYPES, RARITIES, STYLE_VIBES, type CharacterCardInput, type RerollTarget } from "../types";
import { FORGE_DISTRICTS } from "../generator/tables";

interface CardForgeFormProps {
  input: CharacterCardInput;
  onInputChange: (field: keyof CharacterCardInput, value: string) => void;
  onGenerate: () => void;
  onReroll: (target: RerollTarget) => void;
  onSaveDraft: () => void;
  onAddDraftToDeck: () => void;
  onExportDraft: () => void;
  activeDeckName: string;
  savedCount: number;
  deckCount: number;
  isDraftSaved: boolean;
  canAddDraftToDeck: boolean;
}

const REROLL_ACTIONS: { label: string; target: RerollTarget }[] = [
  { label: "Reroll all", target: "all" },
  { label: "Reroll name", target: "identity" },
  { label: "Reroll visuals", target: "visuals" },
  { label: "Reroll stats", target: "mechanics" },
  { label: "Reroll flavor", target: "flavor" },
];

export function CardForgeForm({
  input,
  onInputChange,
  onGenerate,
  onReroll,
  onSaveDraft,
  onAddDraftToDeck,
  onExportDraft,
  activeDeckName,
  savedCount,
  deckCount,
  isDraftSaved,
  canAddDraftToDeck,
}: CardForgeFormProps) {
  return (
    <article className="panel forge-control-panel">
      <div className="section-heading">
        <h2>Card Forge controls</h2>
        <p>Build one cyberpunk electric-skateboard courier card at a time from a few high-level prompts.</p>
      </div>

      <div className="forge-form-grid">
        <label className="field">
          <span>Archetype</span>
          <select value={input.archetype} onChange={(event) => onInputChange("archetype", event.target.value)}>
            {ARCHETYPES.map((archetype) => (
              <option key={archetype} value={archetype}>
                {archetype}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Rarity</span>
          <select value={input.rarity} onChange={(event) => onInputChange("rarity", event.target.value)}>
            {RARITIES.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Style vibe</span>
          <select value={input.vibe} onChange={(event) => onInputChange("vibe", event.target.value)}>
            {STYLE_VIBES.map((vibe) => (
              <option key={vibe} value={vibe}>
                {vibe}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>District</span>
          <select value={input.district} onChange={(event) => onInputChange("district", event.target.value)}>
            {FORGE_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Accent color</span>
          <div className="color-input-row">
            <input
              type="color"
              value={input.accentColor}
              onChange={(event) => onInputChange("accentColor", event.target.value)}
              aria-label="Accent color picker"
            />
            <input
              type="text"
              value={input.accentColor}
              onChange={(event) => onInputChange("accentColor", event.target.value)}
              spellCheck={false}
              aria-label="Accent color hex"
            />
          </div>
        </label>
      </div>

      <div className="forge-action-stack">
        <button onClick={onGenerate}>Generate courier card</button>
        <button className="secondary" onClick={onSaveDraft}>
          {isDraftSaved ? "Saved to collection" : "Save to collection"}
        </button>
        <button className="secondary" disabled={!canAddDraftToDeck} onClick={onAddDraftToDeck}>
          Add draft to {activeDeckName}
        </button>
        <button className="secondary" onClick={onExportDraft}>
          Export draft JSON
        </button>
      </div>

      <div className="chip-row forge-reroll-row" aria-label="Draft reroll actions">
        {REROLL_ACTIONS.map((action) => (
          <button
            key={action.target}
            type="button"
            className="secondary ghost-button"
            onClick={() => onReroll(action.target)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="summary-grid">
        <div className="metric-card">
          <span className="metric-label">Saved cards</span>
          <strong>{savedCount}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Decks</span>
          <strong>{deckCount}</strong>
        </div>
      </div>
    </article>
  );
}
