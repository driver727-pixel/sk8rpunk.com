import { useState } from "react";
import type { CharacterReference } from "../types";

interface Props {
  characters: CharacterReference[];
  onAdd: (character: CharacterReference) => void;
  onRemove: (id: string) => void;
  onUpdate: (character: CharacterReference) => void;
}

export function CharacterManager({ characters, onAdd, onRemove, onUpdate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [accentColor, setAccentColor] = useState("#19f2ff");

  const handleAdd = () => {
    if (!name.trim()) return;
    const newChar: CharacterReference = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      imageUrls: imageUrl.trim() ? [imageUrl.trim()] : [],
      accentColor,
    };
    onAdd(newChar);
    setName("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <div className="comic-characters">
      <h3>Characters (Reference Material)</h3>
      <p className="muted">
        Add characters with visual descriptions and reference image URLs.
        Upload images to <code>/comic-references/</code> and use the path here.
      </p>

      <div className="comic-char-form">
        <input
          className="comic-input"
          placeholder="Character name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="comic-textarea"
          placeholder="Visual description (brief: build, hair, outfit, distinguishing features)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <input
          className="comic-input"
          placeholder="Reference image URL (e.g. /comic-references/zara.png)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className="comic-char-form-row">
          <label>
            Accent:{" "}
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
            />
          </label>
          <button className="comic-btn" onClick={handleAdd} disabled={!name.trim()}>
            + Add Character
          </button>
        </div>
      </div>

      {characters.length > 0 && (
        <div className="comic-char-list">
          {characters.map((char) => (
            <div key={char.id} className="comic-char-card" style={{ borderColor: char.accentColor }}>
              <div className="comic-char-card-header">
                <strong>{char.name}</strong>
                <button className="comic-btn-sm comic-btn-danger" onClick={() => onRemove(char.id)}>
                  ✕
                </button>
              </div>
              <p className="muted">{char.description || "(no description)"}</p>
              {char.imageUrls.length > 0 && (
                <div className="comic-char-thumbs">
                  {char.imageUrls.map((url, i) => (
                    <img key={i} src={url} alt={`${char.name} ref ${i + 1}`} className="comic-char-thumb" />
                  ))}
                </div>
              )}
              <div className="comic-char-add-img">
                <input
                  className="comic-input comic-input-sm"
                  placeholder="Add another image URL"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        onUpdate({ ...char, imageUrls: [...char.imageUrls, val] });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
