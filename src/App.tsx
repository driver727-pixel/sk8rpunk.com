import { useEffect, useRef, useState } from "react";
import operationNightshadeCover from "../SMPDIGI.jpg";
import CharacterBios from "./CharacterBios";
import { characters } from "./data/characters";
import { useSeo } from "./seo";

// Neon orbs rendered behind the hero for an ambient depth effect
const HERO_ORBS = [
  { cx: "18%", cy: "28%", r: 280, color: "rgba(25,242,255,0.07)" },
  { cx: "82%", cy: "18%", r: 220, color: "rgba(166,60,255,0.09)" },
  { cx: "55%", cy: "75%", r: 180, color: "rgba(255,106,154,0.06)" },
  { cx: "6%",  cy: "68%", r: 140, color: "rgba(25,242,255,0.05)" },
  { cx: "92%", cy: "62%", r: 200, color: "rgba(166,60,255,0.06)" },
] as const;

const punchskaterUrl = import.meta.env.VITE_PUNCHSKATER_URL || "https://punchskater.com";

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

type GameTile = {
  id: string;
  name: string;
  domain: string | null;
  tagline: string;
  description: string;
  features: string[];
  status: "live" | "soon";
  href: string | null;
  accent: string;
  cta?: string;
  coverImage?: string;
  coverAlt?: string;
};

const games: GameTile[] = [
  {
    id: "punchskater",
    name: "Punch Skater",
    domain: "punchskater.com",
    tagline: "Collect. Build. Joust. Win.",
    description:
      "The first game in the Sk8r Punk universe. Create your crew of electric-skateboard riders, forge collectible cards, run missions, and climb the leaderboard.",
    features: ["Card creation", "Crew of 6", "Missions", "Jousting", "Joustur Skatur (soon)", "Leaderboard"],
    status: "live",
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
    status: "soon",
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
    status: "soon",
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
    status: "soon",
    href: null,
    accent: "#ffd36a",
  },
  {
    id: "fiction",
    name: "Fiction & Novels",
    domain: null,
    tagline: "Short story coming soon: \"Sk8r Punk Operation Nightshade Part 1\".",
    description:
      "Lore, short fiction, and the expanding world of the Sk8r Punk universe. Written by Scotty M. Perkins with additional writing by C. William Perkins.",
    features: ["Short fiction", "World lore", "Canon releases"],
    status: "soon",
    href: null,
    accent: "#6aff99",
    coverImage: operationNightshadeCover,
    coverAlt: "Operation Nightshade book cover",
  },
  {
    id: "codex",
    name: "Codex",
    domain: null,
    tagline: "Know the canon.",
    description:
      "The complete world bible: districts, factions, board tech, jousting tradition, terminology, and cross-game canon.",
    features: ["Factions", "Districts", "Board tech", "Jousting lore"],
    status: "soon",
    href: null,
    accent: "#19f2ff",
  },
];

function App() {
  // ── Page routing via URL search param ──────────────────────────────────────
  const page = new URLSearchParams(window.location.search).get("page");

  // ── All state and refs declared unconditionally (Rules of Hooks) ───────────
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const coverCloseBtnRef = useRef<HTMLButtonElement>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);

  useSeo(page, punchskaterUrl);

  // Redirect for the ?page=joustur-skatur marketing/deep-link route.
  // Must be a side-effect — synchronous navigation during render is not allowed.
  useEffect(() => {
    if (page === "joustur-skatur") {
      window.location.replace(punchskaterUrl);
    }
  }, [page]); // page is stable (URL never changes), but listed for exhaustive-deps

  // ── Parallax: slide hero backdrop at 35% scroll speed ──────────────────────
  useEffect(() => {
    if (page === "joustur-skatur") return;
    const el = slideshowRef.current;
    if (!el) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [page]);

  // ── Scroll-reveal: observe hub-sections and individual grid children ────────
  useEffect(() => {
    if (page === "joustur-skatur" || page === "bios") return;
    const targets = document.querySelectorAll<HTMLElement>(
      ".hub-section, .hub-faction-chip, .app-tile"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [page]);

  useEffect(() => {
    if (!coverOpen) return;
    coverCloseBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCoverOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [coverOpen]);

  useEffect(() => {
    if (page === "joustur-skatur") return; // skip autoplay during redirect
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.play().catch(() => {
      // Autoplay blocked — reflect true state in UI
      audio.muted = true;
      setMuted(true);
    });
  }, []);

  // ── Conditional page renders (must come after all hooks) ───────────────────
  if (page === "bios") {
    return <CharacterBios />;
  }
  if (page === "joustur-skatur") {
    return null;
  }

  // ── Lander ─────────────────────────────────────────────────────────────────
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
        {/* Neon ambient orbs */}
        <div className="hub-hero-orbs" aria-hidden="true">
          {HERO_ORBS.map((orb, i) => (
            <div
              key={i}
              className="hub-hero-orb"
              style={{
                left: orb.cx,
                top: orb.cy,
                width: orb.r * 2,
                height: orb.r * 2,
                background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
              }}
            />
          ))}
        </div>
        <div ref={slideshowRef} className="placeholder-slideshow" aria-hidden="true">
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
        <div className="hub-hero-scanlines" aria-hidden="true" />

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
            {factions.map((f, i) => (
              <div
                key={f.name}
                className="hub-faction-chip"
                style={{ "--stagger-delay": `${i * 0.06}s` } as React.CSSProperties}
              >
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
            {games.map((game, i) => {
              const tileClasses = [
                "panel",
                "app-tile",
                game.status === "live" ? "hub-tile-featured" : "",
                game.id === "fiction" ? "app-tile-fiction" : "",
              ].filter(Boolean).join(" ");

              return (
                <article
                  key={game.id}
                  className={tileClasses}
                  style={{
                    borderLeftColor: game.accent,
                    "--stagger-delay": `${i * 0.07}s`,
                  } as React.CSSProperties}
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
                  {game.coverImage && (
                    game.id === "fiction" ? (
                      <button
                        className="cover-lightbox-btn"
                        onClick={() => setCoverOpen(true)}
                        aria-label={`View full-size ${game.coverAlt ?? `${game.name} cover`}`}
                      >
                        <img
                          className="app-tile-cover"
                          src={game.coverImage}
                          alt={game.coverAlt ?? `${game.name} cover`}
                          loading="lazy"
                        />
                      </button>
                    ) : (
                      <img
                        className="app-tile-cover"
                        src={game.coverImage}
                        alt={game.coverAlt ?? `${game.name} cover`}
                        loading="lazy"
                      />
                    )
                  )}

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
              );
            })}
          </div>
        </section>

        {/* ── Hype Advertisement ───────────────────────────────── */}
        <section className="hype-ad-section" aria-label="Advertisement">
          <img
            className="hype-ad-img"
            src="/hype BA.png"
            alt="Hype — Sk8r Punk universe advertisement"
            loading="lazy"
          />
        </section>

        {/* ── Joustur Skatur Teaser ─────────────────────────────── */}
        <section className="hub-section">
          <div className="teaser-banner-row">
            <span className="badge badge-soon">⚔ Coming Soon Inside Punch Skater</span>
          </div>
          <p className="eyebrow">Punch Skater Mode</p>
          <h2 className="hub-section-h2">Joustur Skatur</h2>
          <p className="hub-section-copy">
            An async street-ritual skateboard-game mode inspired by the Royal Game of Ur.
            Cast USB Shards. Hold the lane. Knock rivals back to the Garage.{" "}
            <strong>Coming soon inside Punch Skater.</strong>
          </p>
          <p className="hub-section-copy muted">
            Punch Skater is the live gateway into the Sk8r Punk universe. Until Joustur Skatur drops,
            forge your crew there.
          </p>
          <img
            className="joustur-attractor"
            src="/Joustur-board.png"
            alt="Joustur Skatur gameplay board — coming soon inside Punch Skater"
            loading="lazy"
          />
          <div className="route-actions">
            <a
              className="app-tile-link-button"
              href={punchskaterUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#19f2ff", color: "#0a0e17" }}
            >
              Play Punch Skater ↗
            </a>
          </div>
        </section>

        {/* ── Character Bios Teaser ──────────────────────────────── */}
        <section className="hub-section">
          <div className="teaser-banner-row">
            <span className="char-teaser-live-badge">⚡ NOW LIVE</span>
          </div>
          <p className="eyebrow">Character Bios</p>
          <h2 className="hub-section-h2">Meet the riders.</h2>
          <p className="hub-section-copy">
            Character bios for the Punch Skater crew and the operatives of
            Operation Nightshade are live. Full visual reveal coming soon.
          </p>
          <div className="char-teaser-grid" aria-hidden="true">
            {Array.from({ length: characters.length }, (_, i) => (
              <div key={i} className="char-teaser-card">
                <div className="char-teaser-portrait" />
                <div className="char-teaser-name-bar" />
                <div className="char-teaser-bio-lines">
                  <div className="char-teaser-bio-line" />
                  <div className="char-teaser-bio-line" />
                  <div className="char-teaser-bio-line" />
                </div>
              </div>
            ))}
          </div>
          <div className="route-actions">
            <a
              className="app-tile-link-button"
              href="/?page=bios"
              style={{ backgroundColor: "#19f2ff", color: "#0a0e17" }}
            >
              View Character Bios →
            </a>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────── */}
        <footer className="hub-footer">
          <p>
            SK8R PUNK and Punch Skater are an original IP created by Scotty M.
            Perkins with lore by C. William Perkins. Copyright © SP Digital LLC
            2026
          </p>
          <p className="hub-footer-sub">
            Electric skateboard cyberpunk.
          </p>
        </footer>
      </main>
      {/* ── Book cover lightbox ───────────────────── */}
      {coverOpen && (
        <div
          className="cover-lightbox-backdrop"
          onClick={() => setCoverOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Book cover full size"
        >
          <button
            ref={coverCloseBtnRef}
            className="cover-lightbox-close"
            onClick={() => setCoverOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            className="cover-lightbox-img"
            src={operationNightshadeCover}
            alt="Operation Nightshade book cover — full size"
            onClick={(e) => { e.stopPropagation(); }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
