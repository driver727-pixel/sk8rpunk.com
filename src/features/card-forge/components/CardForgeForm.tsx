import { Tooltip } from "../../../components/Tooltip";
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

const REROLL_ACTIONS: { label: string; target: RerollTarget; tooltip: string }[] = [
  { label: "Reroll all", target: "all", tooltip: "Randomize everything — name, art, stats, and flavor — while keeping your current prompts as a starting point." },
  { label: "Reroll name", target: "identity", tooltip: "Generate a new courier name and identity without touching stats, art, or flavor text." },
  { label: "Reroll visuals", target: "visuals", tooltip: "Refresh the card's SVG art — silhouette, outfit, board, and effects — without changing stats or lore." },
  { label: "Reroll stats", target: "mechanics", tooltip: "Redistribute the stat bonuses and swap the card's ability, keeping the same name and art." },
  { label: "Reroll flavor", target: "flavor", tooltip: "Swap the ability description and flavor quote while keeping all other card properties." },
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
          <Tooltip text="The courier's primary role. Each archetype has a unique stat distribution — Courier favors speed, Heavy Hauler maxes cargo, Battery Hacker pushes tech.">
            <span className="tooltip-label">Archetype</span>
          </Tooltip>
          <select value={input.archetype} onChange={(event) => onInputChange("archetype", event.target.value)}>
            {ARCHETYPES.map((archetype) => (
              <option key={archetype} value={archetype}>
                {archetype}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <Tooltip text="Controls how many bonus stat points the card receives. Common adds none; Legendary adds +6. Higher rarity also changes the card's frame color.">
            <span className="tooltip-label">Rarity</span>
          </Tooltip>
          <select value={input.rarity} onChange={(event) => onInputChange("rarity", event.target.value)}>
            {RARITIES.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <Tooltip text="Fine-tunes the stat spread with small bonuses and penalties, and shapes the card's aesthetic and flavor text. For example, Neon Outlaw boosts Speed and Style but reduces Cargo.">
            <span className="tooltip-label">Style vibe</span>
          </Tooltip>
          <select value={input.vibe} onChange={(event) => onInputChange("vibe", event.target.value)}>
            {STYLE_VIBES.map((vibe) => (
              <option key={vibe} value={vibe}>
                {vibe}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <Tooltip text="The in-world neighborhood the courier calls home. Affects lore and flavor text only — no stat changes. Each district has its own cyberpunk atmosphere.">
            <span className="tooltip-label">District</span>
          </Tooltip>
          <select value={input.district} onChange={(event) => onInputChange("district", event.target.value)}>
            {FORGE_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <Tooltip text="Sets the neon highlight color used across the card's border and SVG art. Cosmetic only — no effect on stats or abilities. Use it to give your cards a personal signature.">
            <span className="tooltip-label">Accent color</span>
          </Tooltip>
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
        <Tooltip text="Build a new courier card from your current prompt selections. The same prompts always produce the same card — use Reroll to get variations.">
          <button onClick={onGenerate}>Generate courier card</button>
        </Tooltip>
        <Tooltip text="Persist the current card preview to your local collection so you can add it to a deck or reference it later.">
          <button className="secondary" onClick={onSaveDraft}>
            {isDraftSaved ? "Saved to collection" : "Save to collection"}
          </button>
        </Tooltip>
        <Tooltip text={`Add the current card draft directly to your active deck (${activeDeckName}). The card is also saved to your collection automatically.`}>
          <button className="secondary" disabled={!canAddDraftToDeck} onClick={onAddDraftToDeck}>
            Add draft to {activeDeckName}
          </button>
        </Tooltip>
        <Tooltip text="Download the current card as a .json file. Use it as a backup or to share the card with other tools or future game projects.">
          <button className="secondary" onClick={onExportDraft}>
            Export draft JSON
          </button>
        </Tooltip>
      </div>

      <div className="chip-row forge-reroll-row" aria-label="Draft reroll actions">
        {REROLL_ACTIONS.map((action) => (
          <Tooltip key={action.target} text={action.tooltip}>
            <button
              type="button"
              className="secondary ghost-button"
              onClick={() => onReroll(action.target)}
            >
              {action.label}
            </button>
          </Tooltip>
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
