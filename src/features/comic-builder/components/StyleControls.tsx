import type { StyleSettings, ArtStyle, InkStyle, ColorPalette, AspectRatio, Resolution } from "../types";

const ART_STYLES: ArtStyle[] = [
  "western-comic", "manga", "franco-belgian", "noir",
  "pop-art", "watercolor", "cyberpunk-neon", "sketch",
];
const INK_STYLES: InkStyle[] = ["bold-ink", "fine-line", "hatched", "no-outline", "halftone"];
const COLOR_PALETTES: ColorPalette[] = [
  "full-color", "monochrome", "duotone-cyan", "duotone-magenta", "muted-retro", "neon-glow",
];
const ASPECT_RATIOS: AspectRatio[] = ["1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2"];
const RESOLUTIONS: Resolution[] = ["0.5K", "1K", "2K", "4K"];

interface Props {
  style: StyleSettings;
  onChange: (style: StyleSettings) => void;
}

export function StyleControls({ style, onChange }: Props) {
  const update = (patch: Partial<StyleSettings>) => onChange({ ...style, ...patch });

  return (
    <div className="comic-style-controls">
      <h3>Style Settings</h3>

      <div className="comic-style-grid">
        <label>
          Art Style
          <select
            className="comic-select"
            value={style.artStyle}
            onChange={(e) => update({ artStyle: e.target.value as ArtStyle })}
          >
            {ART_STYLES.map((s) => <option key={s} value={s}>{s.replace(/-/g, " ")}</option>)}
          </select>
        </label>

        <label>
          Ink Style
          <select
            className="comic-select"
            value={style.inkStyle}
            onChange={(e) => update({ inkStyle: e.target.value as InkStyle })}
          >
            {INK_STYLES.map((s) => <option key={s} value={s}>{s.replace(/-/g, " ")}</option>)}
          </select>
        </label>

        <label>
          Color Palette
          <select
            className="comic-select"
            value={style.colorPalette}
            onChange={(e) => update({ colorPalette: e.target.value as ColorPalette })}
          >
            {COLOR_PALETTES.map((s) => <option key={s} value={s}>{s.replace(/-/g, " ")}</option>)}
          </select>
        </label>

        <label>
          Default Aspect Ratio
          <select
            className="comic-select"
            value={style.defaultAspectRatio}
            onChange={(e) => update({ defaultAspectRatio: e.target.value as AspectRatio })}
          >
            {ASPECT_RATIOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label>
          Default Resolution
          <select
            className="comic-select"
            value={style.defaultResolution}
            onChange={(e) => update({ defaultResolution: e.target.value as Resolution })}
          >
            {RESOLUTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <label className="comic-keywords-label">
        Global Keywords (comma-separated)
        <input
          className="comic-input"
          placeholder="e.g. detailed background, dynamic poses"
          value={style.globalKeywords.join(", ")}
          onChange={(e) =>
            update({
              globalKeywords: e.target.value
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean),
            })
          }
        />
      </label>
    </div>
  );
}
