import { useState } from "react";
import type { CharacterReference, DialogueBox, Panel, ShotType } from "../types";
import { buildPanelPrompt, gatherReferenceImages } from "../prompt-builder";
import { generatePanelImage } from "../fal-client";
import type { StyleSettings } from "../types";

const SHOT_TYPES: ShotType[] = [
  "wide", "medium", "close-up", "extreme-close-up", "birds-eye", "low-angle", "over-shoulder",
];

interface Props {
  panel: Panel;
  characters: CharacterReference[];
  style: StyleSettings;
  onUpdate: (panel: Panel) => void;
}

export function PanelEditor({ panel, characters, style, onUpdate }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<Panel>) => onUpdate({ ...panel, ...patch });

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const prompt = buildPanelPrompt(style, panel, characters);
      const imageUrls = gatherReferenceImages(panel, characters);
      const result = await generatePanelImage({
        prompt,
        imageUrls,
        aspectRatio: panel.aspectRatio ?? style.defaultAspectRatio,
        resolution: panel.resolution ?? style.defaultResolution,
        seed: panel.seedLocked && panel.seed !== null ? panel.seed : undefined,
      });
      update({ generatedImageUrl: result.imageUrl, seed: result.seed });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const addDialogue = (type: DialogueBox["type"]) => {
    const box: DialogueBox = {
      id: crypto.randomUUID(),
      type,
      text: "",
      characterId: null,
      x: 50,
      y: 10,
    };
    update({ dialogue: [...panel.dialogue, box] });
  };

  const updateDialogue = (id: string, patch: Partial<DialogueBox>) => {
    update({
      dialogue: panel.dialogue.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    });
  };

  const removeDialogue = (id: string) => {
    update({ dialogue: panel.dialogue.filter((d) => d.id !== id) });
  };

  const previewPrompt = buildPanelPrompt(style, panel, characters);

  return (
    <div className="comic-panel-editor">
      {/* Scene */}
      <textarea
        className="comic-textarea"
        placeholder="Scene/action description for this panel..."
        value={panel.scene}
        onChange={(e) => update({ scene: e.target.value })}
        rows={2}
      />

      {/* Controls row */}
      <div className="comic-panel-controls">
        <select
          className="comic-select"
          value={panel.shotType}
          onChange={(e) => update({ shotType: e.target.value as ShotType })}
        >
          {SHOT_TYPES.map((s) => (
            <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
          ))}
        </select>

        {/* Character multi-select (simple checkboxes) */}
        <div className="comic-char-select">
          {characters.map((c) => (
            <label key={c.id} className="comic-char-checkbox" style={{ borderColor: c.accentColor }}>
              <input
                type="checkbox"
                checked={panel.characterIds.includes(c.id)}
                onChange={(e) => {
                  const ids = e.target.checked
                    ? [...panel.characterIds, c.id]
                    : panel.characterIds.filter((id) => id !== c.id);
                  update({ characterIds: ids });
                }}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {/* Extra keywords */}
      <input
        className="comic-input comic-input-sm"
        placeholder="Extra keywords (comma-separated)"
        value={panel.extraKeywords.join(", ")}
        onChange={(e) =>
          update({ extraKeywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })
        }
      />

      {/* Prompt preview */}
      <details className="comic-prompt-preview">
        <summary>Prompt preview ({previewPrompt.length} chars)</summary>
        <pre className="comic-prompt-text">{previewPrompt}</pre>
      </details>

      {/* Seed lock */}
      <label className="comic-seed-lock">
        <input
          type="checkbox"
          checked={panel.seedLocked}
          onChange={(e) => update({ seedLocked: e.target.checked })}
        />
        Lock seed {panel.seed !== null && `(${panel.seed})`}
      </label>

      {/* Generate button */}
      <button className="comic-btn comic-btn-generate" onClick={handleGenerate} disabled={generating}>
        {generating ? "Generating..." : "⚡ Generate Panel"}
      </button>
      {error && <p className="comic-error">{error}</p>}

      {/* Generated image */}
      {panel.generatedImageUrl && (
        <div className="comic-panel-image-wrap">
          <img src={panel.generatedImageUrl} alt="Generated panel" className="comic-panel-image" />
          {/* Dialogue overlays */}
          {panel.dialogue.map((d) => (
            <div
              key={d.id}
              className={`comic-dialogue-overlay comic-dialogue-${d.type}`}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
            >
              {d.text || `[${d.type}]`}
            </div>
          ))}
        </div>
      )}

      {/* Dialogue editor */}
      <div className="comic-dialogue-section">
        <div className="comic-dialogue-add-row">
          <span className="muted">Add:</span>
          {(["speech", "thought", "narration", "caption", "sfx"] as const).map((type) => (
            <button key={type} className="comic-btn-sm" onClick={() => addDialogue(type)}>
              {type}
            </button>
          ))}
        </div>
        {panel.dialogue.map((d) => (
          <div key={d.id} className="comic-dialogue-item">
            <select
              className="comic-select comic-select-sm"
              value={d.characterId ?? ""}
              onChange={(e) => updateDialogue(d.id, { characterId: e.target.value || null })}
            >
              <option value="">—</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              className="comic-input"
              placeholder={`${d.type} text...`}
              value={d.text}
              onChange={(e) => updateDialogue(d.id, { text: e.target.value })}
            />
            <button className="comic-btn-sm comic-btn-danger" onClick={() => removeDialogue(d.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
