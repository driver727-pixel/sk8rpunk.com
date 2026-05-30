import { useState } from "react";
import { characters, type Character, type CharacterSource } from "./data/characters";

// NOTE: VITE_ env vars are embedded in the built JS bundle — standard for a
// static Vite site. This provides basic access control for low-traffic use.
// Do not store highly sensitive content behind this mechanism.
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS ?? "";
const VIEWER_PASS = import.meta.env.VITE_VIEWER_PASS ?? "";
const SESSION_KEY = "sp_bio_role";

type Role = "admin" | "viewer";

function detectRoleFromUrl(): Role | null {
  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) return null;
  if (ADMIN_PASS && token === ADMIN_PASS) return "admin";
  if (VIEWER_PASS && token === VIEWER_PASS) return "viewer";
  return null;
}

function detectRoleFromSession(): Role | null {
  const val = sessionStorage.getItem(SESSION_KEY);
  return val === "admin" || val === "viewer" ? val : null;
}

// ── Individual bio card ───────────────────────────────────────────────────────

function BioCard({
  char,
  imageRevealed,
  onToggleImage,
}: {
  char: Character;
  imageRevealed: boolean;
  onToggleImage: () => void;
}) {
  return (
    <article
      className="bio-card panel"
      style={{ borderLeftColor: char.accentColor }}
    >
      <div className="bio-card-header">
        <div>
          <p className="eyebrow" style={{ color: char.accentColor }}>
            {char.source === "punch-skater"
              ? "Punch Skater™"
              : "Operation Nightshade"}
          </p>
          <h3 className="bio-card-name">{char.name}</h3>
          <p className="bio-card-role muted">
            {char.faction} · {char.role}
          </p>
        </div>
      </div>

      <p className="bio-card-bio">{char.bio}</p>

      <div className="chip-row">
        {char.traits.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <div className="bio-image-reveal">
        <button
          className="bio-reveal-toggle"
          onClick={onToggleImage}
          aria-expanded={imageRevealed}
        >
          {imageRevealed ? "▲ Hide image" : "▼ Reveal character image"}
        </button>
        {imageRevealed && (
          <div className="bio-image-container">
            <img
              src={char.imagePath}
              alt={char.imageAlt}
              width={char.imageWidth}
              height={char.imageHeight}
              loading="lazy"
              className="bio-image"
            />
          </div>
        )}
      </div>
    </article>
  );
}

// ── Character section ─────────────────────────────────────────────────────────

function CharacterSection({
  title,
  source,
  revealedImages,
  onToggleImage,
}: {
  title: string;
  source: CharacterSource;
  revealedImages: Set<string>;
  onToggleImage: (id: string) => void;
}) {
  const sourceChars = characters.filter((c) => c.source === source);
  return (
    <section className="bios-section">
      <p className="eyebrow">{title}</p>
      <div className="bios-card-grid">
        {sourceChars.map((char) => (
          <BioCard
            key={char.id}
            char={char}
            imageRevealed={revealedImages.has(char.id)}
            onToggleImage={() => onToggleImage(char.id)}
          />
        ))}
      </div>
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function CharacterBios() {
  const [role, setRole] = useState<Role | null>(() => {
    return detectRoleFromUrl() ?? detectRoleFromSession();
  });
  const [passInput, setPassInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [revealedImages, setRevealedImages] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const handleLogin = () => {
    const trimmed = passInput.trim();
    // Determine role by comparing against each passphrase explicitly so that
    // we store a literal role label in sessionStorage, not the return value
    // of an auth function (avoids clear-text-storage-of-sensitive-data).
    let resolvedRole: Role | null = null;
    if (ADMIN_PASS && trimmed === ADMIN_PASS) resolvedRole = "admin";
    else if (VIEWER_PASS && trimmed === VIEWER_PASS) resolvedRole = "viewer";

    if (resolvedRole) {
      sessionStorage.setItem(SESSION_KEY, resolvedRole);
      setRole(resolvedRole);
      setLoginError(false);
      // Remove token from URL without reloading the page
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState(null, "", url.toString());
    } else {
      setLoginError(true);
    }
  };

  const toggleImage = (id: string) => {
    setRevealedImages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyViewerLink = async () => {
    if (!VIEWER_PASS) return;
    const url = new URL("/", window.location.origin);
    url.searchParams.set("page", "bios");
    url.searchParams.set("token", VIEWER_PASS);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!role) {
    return (
      <div className="bios-login-shell">
        <div className="bios-login-card panel">
          <p className="eyebrow">RESTRICTED ACCESS</p>
          <h1 className="bios-login-title">Character Bios</h1>
          <p className="bios-login-copy muted">
            Enter your access code to view the character bios.
          </p>
          <div className="bios-login-form">
            <input
              type="password"
              placeholder="Access code"
              value={passInput}
              onChange={(e) => {
                setPassInput(e.target.value);
                setLoginError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              aria-label="Access code"
            />
            <button onClick={handleLogin}>Unlock ↗</button>
          </div>
          {loginError && (
            <p className="bios-login-error" role="alert">
              Invalid access code. Please try again.
            </p>
          )}
          <a href="/" className="bios-back-link">
            ← Back to sk8rpunk.com
          </a>
        </div>
      </div>
    );
  }

  // ── Authenticated view ────────────────────────────────────────────────────

  return (
    <div className="bios-shell">
      {role === "admin" && (
        <div className="bios-admin-bar">
          <span className="bios-admin-badge">⚡ Admin</span>
          <div className="bios-admin-actions">
            <span className="bios-admin-hint">
              Share viewer access with C. William Perkins:
            </span>
            <button
              className="bios-copy-btn"
              onClick={copyViewerLink}
              disabled={!VIEWER_PASS}
              title={
                !VIEWER_PASS ? "Set VITE_VIEWER_PASS in your .env file" : undefined
              }
            >
              {copied ? "✓ Copied!" : "📋 Copy viewer link"}
            </button>
          </div>
        </div>
      )}

      <div className="bios-body">
        <header className="bios-header">
          <a href="/" className="bios-back-link">
            ← Back to sk8rpunk.com
          </a>
          <p className="eyebrow">SK8R PUNK™ UNIVERSE</p>
          <h1 className="bios-title">Character Bios</h1>
          <p className="bios-subtitle muted">
            The riders and operatives of the Sk8r Punk™ universe.
          </p>
        </header>

        <CharacterSection
          title="Punch Skater™"
          source="punch-skater"
          revealedImages={revealedImages}
          onToggleImage={toggleImage}
        />

        <CharacterSection
          title="Operation Nightshade"
          source="operation-nightshade"
          revealedImages={revealedImages}
          onToggleImage={toggleImage}
        />

        <footer className="bios-page-footer">
          <p>SK8R PUNK™ and Punch Skater™ are an original IP created by Scotty M. Perkins with lore by C. William Perkins. Copyright © SP Digital LLC 2026</p>
        </footer>
      </div>
    </div>
  );
}
