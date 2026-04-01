import { useEffect } from "react";

interface HelpModalProps {
  onClose: () => void;
}

const FAQ_ITEMS = [
  {
    question: "What is the Card Forge?",
    answer:
      "The Card Forge is a deterministic card generator. You pick a few high-level prompts (archetype, rarity, vibe, district, accent color) and the app generates a unique cyberpunk electric-skateboard courier card with stats, an ability, flavor text, and procedural SVG art. The same inputs always produce the same card, so you can recreate any card you've made.",
  },
  {
    question: "What does 'deterministic' mean?",
    answer:
      "Deterministic means the generator always produces the same output from the same inputs. If you set Archetype to Courier, Rarity to Rare, Vibe to Neon Outlaw, and the same district and color, you will always get the identical card. This makes cards reproducible and shareable without storing large image files.",
  },
  {
    question: "What are Archetypes?",
    answer:
      "Archetypes define a courier's primary role and shape their stat distribution. Courier favors speed and control. Route Scout excels at navigation and tech. Battery Hacker pushes tech to the max. Trick Rider dominates style. Heavy Hauler carries the most cargo. Street Mechanic repairs gear mid-run. Signal Ghost moves unseen. Crew Captain buffs the whole team.",
  },
  {
    question: "What does Rarity change?",
    answer:
      "Rarity adds bonus stat points to the card. Common adds none, Uncommon adds +1, Rare adds +2, Epic adds +4, and Legendary adds +6 total distributed across the card's focus stats. Higher rarity also changes the card's visual frame color.",
  },
  {
    question: "What is Style Vibe?",
    answer:
      "Style Vibe fine-tunes the card's stat profile and influences its visual aesthetic and flavor text. For example, Neon Outlaw adds +1 Speed and +1 Style but -1 Cargo, while Freight Bruiser adds +1 Power and +1 Cargo but -1 Speed. Vibes let you customize how a card plays within its archetype.",
  },
  {
    question: "What is the District?",
    answer:
      "The District is the in-world neighborhood the courier calls home. It affects the card's lore and flavor text. Different districts have different atmospheres — Mirror Harbor is industrial, Ion Loop is neon-lit tech, and so on. It is purely narrative and does not change stats.",
  },
  {
    question: "What does the Accent Color do?",
    answer:
      "The Accent Color sets the neon highlight color used across the card's SVG art and border. It is cosmetic only — it does not affect stats or abilities. Use it to give your cards a personal signature look.",
  },
  {
    question: "What are Reroll buttons?",
    answer:
      "Reroll buttons let you randomize one part of the current card without changing your prompts. 'Reroll all' generates a completely fresh card. 'Reroll name' changes only the courier's name and identity. 'Reroll visuals' refreshes the card art. 'Reroll stats' redistributes the stat bonuses. 'Reroll flavor' swaps the ability and flavor text.",
  },
  {
    question: "How do I save a card?",
    answer:
      "Click 'Save to collection' after generating a card you like. The card is stored in your browser's localStorage, so it persists between sessions as long as you use the same browser. You can save as many cards as you want.",
  },
  {
    question: "How do Decks work?",
    answer:
      "A Deck is a named collection of up to 12 cards. Click 'Create deck' to make one, then click 'Add draft to [deck]' or 'Add to active deck' on any saved card in your collection. Decks are designed to be exported as structured JSON for use in future game projects.",
  },
  {
    question: "What does 'Export draft JSON' do?",
    answer:
      "It downloads the current card as a .json file. The file contains everything about the card — prompts, seeds, stats, visual descriptors, and metadata — in a format designed for future game ingestion. You can share it, back it up, or import it into other tools.",
  },
  {
    question: "What does 'Export active deck JSON' do?",
    answer:
      "It downloads the entire deck, including all card definitions bundled together. This is the main integration contract between the Card Forge and any future game: the game reads this file to know exactly which couriers are in a player's deck.",
  },
  {
    question: "Why is all the art procedural SVG instead of pre-made images?",
    answer:
      "Procedural SVG means the art is generated in code from the card's data, with no external image files. This keeps the project fully open-source and self-contained, makes cards reproducible from stored data, and allows the same schema to support hand-crafted art or asset packs in the future without breaking anything.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "All cards and decks are saved in your browser's localStorage under the key 'card-forge-state'. Nothing is sent to any server. This means your collection is private to your device and browser profile, but it also means clearing your browser's site data will erase your collection — export your decks regularly as a backup.",
  },
] as const;

export function HelpModal({ onClose }: HelpModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="help-modal-backdrop" role="dialog" aria-modal="true" aria-label="Help and FAQ" onClick={onClose}>
      <div className="help-modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="help-modal-header">
          <h2>Help &amp; FAQ</h2>
          <button
            className="secondary help-modal-close"
            onClick={onClose}
            aria-label="Close help modal"
          >
            ✕
          </button>
        </div>

        <div className="help-modal-body">
          <section className="help-section">
            <h3>How it all connects</h3>
            <p>
              <strong>Card Forge</strong> is the starting point. You choose a few prompts, click{" "}
              <em>Generate courier card</em>, and the app deterministically builds a unique character
              card — stats, ability, art, and lore — from your inputs. Save cards you like to your{" "}
              <strong>Collection</strong>, then group them into <strong>Decks</strong>. When your deck
              is ready, export it as a structured JSON file. That exported file is the handoff point
              to any future game project: the game reads the deck JSON and knows which couriers you
              brought to the run.
            </p>
            <ol className="help-steps">
              <li>
                <strong>Pick prompts</strong> — Choose an Archetype, Rarity, Style Vibe, District,
                and Accent Color in the Card Forge controls panel.
              </li>
              <li>
                <strong>Generate</strong> — Click <em>Generate courier card</em>. The card preview
                updates instantly. Use the Reroll buttons to tweak individual parts without
                re-entering prompts.
              </li>
              <li>
                <strong>Save</strong> — Click <em>Save to collection</em> to persist the card in
                your browser. Your collection appears below the forge.
              </li>
              <li>
                <strong>Build a deck</strong> — Create a named deck with the Deck Builder, then add
                saved cards to it (up to 12 per deck).
              </li>
              <li>
                <strong>Export</strong> — Use <em>Export active deck JSON</em> to download a
                game-ready file, or <em>Export draft JSON</em> to save a single card for later.
              </li>
            </ol>
          </section>

          <section className="help-section">
            <h3>Frequently asked questions</h3>
            <dl className="faq-list">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="faq-item">
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
