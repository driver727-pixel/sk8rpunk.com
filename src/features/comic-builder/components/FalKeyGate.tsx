import { useState } from "react";
import { storeFalKey, getFalKey, clearFalKey } from "../storage";

export function FalKeyGate({ children }: { children: React.ReactNode }) {
  const [hasKey, setHasKey] = useState(() => Boolean(getFalKey()));
  const [input, setInput] = useState("");

  if (hasKey) {
    return (
      <>
        <div className="comic-fal-status">
          <span className="comic-fal-badge">🔑 fal.ai key active (session only)</span>
          <button
            className="comic-btn-sm comic-btn-danger"
            onClick={() => { clearFalKey(); setHasKey(false); }}
          >
            Clear Key
          </button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="comic-key-gate">
      <h3>Enter your fal.ai API Key</h3>
      <p className="muted">
        Your key is stored only in this browser tab&apos;s session storage.
        It is never sent anywhere except fal.ai and is cleared when you close the tab.
      </p>
      <div className="comic-key-row">
        <input
          type="password"
          placeholder="fal-xxxxxxxx..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="comic-input"
        />
        <button
          className="comic-btn"
          disabled={!input.trim()}
          onClick={() => {
            storeFalKey(input.trim());
            setInput("");
            setHasKey(true);
          }}
        >
          Save &amp; Continue
        </button>
      </div>
    </div>
  );
}
