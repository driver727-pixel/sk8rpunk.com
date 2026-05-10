import { useEffect, useRef, useState } from "react";

const punchskaterUrl = import.meta.env.VITE_DECK_BUILDER_URL || "https://punchskater.com";

const slideshowImages = [
  "https://github.com/user-attachments/assets/8210c5b0-3690-48de-9e43-59e879d7a5df",
  "https://github.com/user-attachments/assets/1295eb80-65f3-4db9-812e-6b6704919b0f",
  "https://github.com/user-attachments/assets/74a660b5-5b53-4c01-9ebb-d28c3b21667a",
  "https://github.com/user-attachments/assets/5f88e377-d084-48e6-9766-2aa4be7e53df",
  "/Skateboards in space.png",
  "/Skateboards in space2.png",
];

const factions = [
  { name: "Rust Kids", desc: "DIY punk scavengers & junkyard riders" },
  { name: "Neon Saints", desc: "Stylish crowd-favourite competitors" },
  { name: "Signal Ghosts", desc: "Hackers, route manipulators, stealth riders" },
  { name: "Chrome Syndicate", desc: "Corporate-backed elite racers" },
  { name: "Voltage Vultures", desc: "High-speed battery extremists" },
  { name: "Alley Wraiths", desc: "Shortcut masters & underground messengers" },
];

const games = [
  {
    id: "punchskater",
    name: "Punch Skater",
    domain: "punchskater.com",
    tagline: "Collect. Build. Joust. Win.",
    description:
      "The first game in the Sk8r Punk universe. Create your crew of electric-skateboard riders, forge collectible cards, run missions, and climb the leaderboard.",
    features: ["Card creation", "Crew of 6", "Missions", "Jousting", "Leaderboard"],
    status: "live" as const,
    href: punchskaterUrl,
    accent: "#19f2ff",
    cta: "Play Punch Skater ↗",
  },
  {
    id: "courier",
    name: "Courier Dispatch",
    domain: null,
    tagline: "Run the routes. Own the city.",
    description:
      "Squad management delivery game across neon Australian streets. Build your crew, pick routes, and fight for district control.",
    features: ["Route simulation", "Squad management", "District control"],
    status: "soon" as const,
    href: null,
    accent: "#a63cff",
  },
  {
    id: "joust",
    name: "Sk8r Joust",
    domain: null,
    tagline: "Lance up. Charge in.",
    description:
      "Full electric-skate jousting combat. Shock lances, carbon poles, and road-sign shields. The neon streets are the arena.",
    features: ["Jousting combat", "Weapon crafting", "Tournament mode"],
    status: "soon" as const,
    href: null,
    accent: "#ff6a9a",
  },
  {
    id: "dice",
    name: "Neon Dice",
    domain: null,
    tagline: "Roll the district. Take the risk.",
    description:
      "Casino-style wager and dice game built on Sk8r Punk faction territory. Every roll has stakes.",
    features: ["Faction wagers", "Dice mechanics", "Territory"],
    status: "soon" as const,
    href: null,
    accent: "#ffd36a",
  },
  {
    id: "fiction",
    name: "Fiction & Novels",
    domain: null,
    tagline: "Read the world.",
    description:
      "Lore, short fiction, and the expanding world bible of the Sk8r Punk universe. Written by C. William Perkins.",
    features: ["Short fiction", "World lore", "Canon releases"],
    status: "soon" as const,
    href: null,
    accent: "#6aff99",
  },
  {
    id: "codex",
    name: "Codex",
    domain: null,
    tagline: "Know the canon.",
    description:
      "The complete world bible: districts, factions, board tech, jousting tradition, terminology, and cross-game canon.",
    features: ["Factions", "Districts", "Board tech", "Jousting lore"],
    status: "soon" as const,
    href: null,
    accent: "#19f2ff",
  },
];

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.play().catch(() => {
      // Autoplay blocked — reflect true state in UI
      audio.muted = true;
      setMuted(true);
    });
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !muted;
    setMuted(nextMuted);
    audio.muted = nextMuted;
    if (!nextMuted) {
      audio.play().catch(() => {
        audio.muted = true;
        setMuted(true);
      });
    }
  };

  return (
    <div className="hub-shell">
      <audio ref={audioRef} src="/bg-music.mp3" loop preload="auto" />
      <button
        className="mute-btn"
        onClick={toggleMute}
        aria-label={muted ? "Unmute background music" : "Mute background music"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? "🔇" : "🔊"}
      </button>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="hub-hero">
        <div className="placeholder-slideshow" aria-hidden="true">
          {slideshowImages.map((imageUrl, index) => (
            <div
              key={imageUrl}
              className="placeholder-slide"
              style={{
                backgroundImage: `url(${imageUrl})`,
                animationDelay: `-${index * 8}s, -${index * 8}s`,
              }}
            />
          ))}
        </div>
        <div className="placeholder-backdrop" aria-hidden="true" />

        <div className="hub-hero-content">
          <p className="eyebrow">SK8R PUNK UNIVERSE</p>
          <h1 className="hub-hero-h1">
            Build a squad.<br />
            Own the neon streets.
          </h1>
          <p className="hub-tagline">
            Electric skateboard cyberpunk. Crews, couriers,
            hackers, racers, and corporate rebels fight for reputation across
            the neon streets.
          </p>

          <a
            className="skateboard-button"
            href={punchskaterUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Play Punch Skater
          </a>
          <p className="hub-cta-sub">punchskater.com — free to play now</p>

          <img
            className="placeholder-logo"
            src="https://github.com/user-attachments/assets/9525a68e-752d-4568-b62f-b5d7bd37d5eb"
            alt="Sk8rPunk.com — a Cyberpunk Esk8r world by Scotty M. Perkins"
          />
        </div>
      </section>

      {/* ── Universe pitch ────────────────────────── */}
      <main className="hub-body">
        <section className="hub-section">
          <p className="eyebrow">The World</p>
          <h2 className="hub-section-h2">One universe. Many ways to ride.</h2>
          <p className="hub-section-copy">
            Sk8r Punk is the umbrella universe — novels, lore, games, card
            systems, and future media. Electric skateboards are sport,
            transport, class marker, weapon platform, and personal expression.
            In cyberpunk Australia, skaters run the routes, joust for
            reputation, hack the districts, and build their squads from the
            ground up.
          </p>
          <blockquote className="hub-north-star">
            Build a squad. Charge your boards. Run the routes. Win the jousts.
            Own the neon streets.
          </blockquote>
        </section>

        {/* ── Factions ──────────────────────────────── */}
        <section className="hub-section">
          <p className="eyebrow">Factions</p>
          <h2 className="hub-section-h2">Choose your crew</h2>
          <p className="hub-section-copy">
            Every skater ends up aligned with a crew, district, style, or
            ideology. Which faction calls to you?
          </p>
          <div className="hub-factions-grid">
            {factions.map((f) => (
              <div key={f.name} className="hub-faction-chip">
                <strong>{f.name}</strong>
                <span>{f.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Games hub ─────────────────────────────── */}
        <section className="hub-section">
          <p className="eyebrow">Games &amp; Projects</p>
          <h2 className="hub-section-h2">Enter the universe</h2>
          <div className="app-hub-grid">
            {games.map((game) => (
              <article
                key={game.id}
                className={`panel app-tile${game.status === "live" ? " hub-tile-featured" : ""}`}
                style={{ borderLeftColor: game.accent }}
              >
                <div className="app-tile-header">
                  <div>
                    <h3>{game.name}</h3>
                    {game.domain && (
                      <p className="muted app-tile-domain">{game.domain}</p>
                    )}
                  </div>
                  <span className={`badge ${game.status === "live" ? "badge-live" : "badge-soon"}`}>
                    {game.status === "live" ? "Live" : "Coming soon"}
                  </span>
                </div>

                <p className="app-tile-tagline">{game.tagline}</p>
                <p className="muted">{game.description}</p>

                <div className="chip-row">
                  {game.features.map((f) => (
                    <span key={f} className="chip">{f}</span>
                  ))}
                </div>

                <div className="route-actions">
                  {game.href ? (
                    <a
                      className="app-tile-link-button"
                      href={game.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: game.accent, color: "#0a0e17" }}
                    >
                      {game.cta ?? `Visit ${game.name} ↗`}
                    </a>
                  ) : (
                    <button disabled style={{ opacity: 0.45, cursor: "not-allowed" }}>
                      In development
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────── */}
        <footer className="hub-footer">
          <p>
            Sk8r Punk is an IP by{" "}
            <strong>SP Digital LLC</strong>. Punch Skater created by Scotty M.
            Perkins. Lore by C. William Perkins.
          </p>
          <p className="hub-footer-sub">
            Electric skateboard cyberpunk.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
