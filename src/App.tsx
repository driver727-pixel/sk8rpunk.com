const punchskaterUrl = import.meta.env.VITE_DECK_BUILDER_URL || "https://punchskater.com";

const slideshowImages = [
  "https://github.com/user-attachments/assets/8210c5b0-3690-48de-9e43-59e879d7a5df",
  "https://github.com/user-attachments/assets/1295eb80-65f3-4db9-812e-6b6704919b0f",
  "https://github.com/user-attachments/assets/74a660b5-5b53-4c01-9ebb-d28c3b21667a",
  "https://github.com/user-attachments/assets/5f88e377-d084-48e6-9766-2aa4be7e53df",
  "/Skateboards in space.png",
  "/Skateboards in space2.png",
];

function App() {
  return (
    <main className="placeholder-experience">
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

      <section className="panel placeholder-card">
        <a
          className="skateboard-button"
          href={punchskaterUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ride to Punchskater
        </a>

        <div className="stack placeholder-copy">
          <p className="eyebrow">Sk8rpunk.com</p>
          <h1>Welcome to the world of Sk8r Punk.</h1>
          <p className="placeholder-prompt">Click below to enter the Deck Builder</p>
          <a
            className="app-tile-link-button placeholder-link"
            href={punchskaterUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            punchskater.com
          </a>
          <p className="placeholder-lore">
            Punch Skater, a Sk8r Punk game created by Scotty M. Perkins, with lore
            written by C. William Perkins.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
