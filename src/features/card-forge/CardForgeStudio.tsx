import { useEffect, useMemo, useState } from "react";
import { CharacterCardPreview } from "./components/CharacterCardPreview";
import { CardForgeForm } from "./components/CardForgeForm";
import { createCharacterCard, rerollCharacterCard } from "./generator/createCharacterCard";
import { DECK_SIZE_LIMIT, DEFAULT_FORGE_INPUT, OPEN_SOURCE_STACK } from "./generator/tables";
import {
  createDeck,
  downloadCardExport,
  downloadDeckExport,
  loadForgeState,
  saveForgeState,
} from "./storage";
import type { CardDeck, CharacterCard, CharacterCardInput, RerollTarget } from "./types";

const createSuggestedDeckName = (decks: CardDeck[]) => `Courier Deck ${decks.length + 1}`;

const getActiveDeck = (decks: CardDeck[], activeDeckId: string) => decks.find((deck) => deck.id === activeDeckId);

const formatStatTotal = (card: CharacterCard) =>
  Object.values(card.stats).reduce((total, value) => total + value, 0);

const formatDateLabel = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export function CardForgeStudio() {
  const [forgeState, setForgeState] = useState(() => loadForgeState());
  const [toast, setToast] = useState(
    "This MVP uses deterministic TypeScript generation plus procedural SVG art, so it stays fully open-source and export-friendly.",
  );
  const [newDeckName, setNewDeckName] = useState(() =>
    createSuggestedDeckName(loadForgeState().decks),
  );

  useEffect(() => {
    saveForgeState(forgeState);
  }, [forgeState]);

  const draft = forgeState.lastDraft ?? createCharacterCard(forgeState.lastInput ?? DEFAULT_FORGE_INPUT);
  const activeDeck = useMemo(
    () => getActiveDeck(forgeState.decks, forgeState.activeDeckId) ?? forgeState.decks[0],
    [forgeState.activeDeckId, forgeState.decks],
  );
  const cardMap = useMemo(
    () => new Map(forgeState.cards.map((card) => [card.id, card])),
    [forgeState.cards],
  );
  const deckCards = useMemo(
    () =>
      activeDeck?.cardIds
        .map((cardId) => cardMap.get(cardId))
        .filter((card): card is CharacterCard => Boolean(card)) ?? [],
    [activeDeck?.cardIds, cardMap],
  );
  const isDraftSaved = forgeState.cards.some((card) => card.id === draft.id);
  const canAddDraftToDeck = Boolean(
    activeDeck &&
      !activeDeck.cardIds.includes(draft.id) &&
      activeDeck.cardIds.length < DECK_SIZE_LIMIT,
  );
  const totalDeckStats = useMemo(
    () => deckCards.reduce((total, card) => total + formatStatTotal(card), 0),
    [deckCards],
  );

  const updateInput = (field: keyof CharacterCardInput, value: string) => {
    setForgeState((current) => ({
      ...current,
      lastInput: {
        ...current.lastInput,
        [field]: value,
      } as CharacterCardInput,
    }));
  };

  const addCardToActiveDeck = (card: CharacterCard) => {
    const currentActiveDeck = getActiveDeck(forgeState.decks, forgeState.activeDeckId);
    if (!currentActiveDeck) {
      setToast("Create a deck before adding cards.");
      return;
    }

    if (currentActiveDeck.cardIds.length >= DECK_SIZE_LIMIT) {
      setToast(`${currentActiveDeck.name} is already at the ${DECK_SIZE_LIMIT}-card limit.`);
      return;
    }

    if (currentActiveDeck.cardIds.includes(card.id)) {
      setToast(`${card.name} is already in ${currentActiveDeck.name}.`);
      return;
    }

    const now = new Date().toISOString();
    setForgeState((current) => ({
      ...current,
      cards: current.cards.some((savedCard) => savedCard.id === card.id)
        ? current.cards
        : [card, ...current.cards],
      decks: current.decks.map((deck) =>
        deck.id === current.activeDeckId
          ? {
              ...deck,
              cardIds: [...deck.cardIds, card.id],
              accentColor: card.prompts.accentColor,
              updatedAt: now,
            }
          : deck,
      ),
      lastDraft: card,
      lastInput: card.prompts,
    }));
    setToast(`${card.name} was added to ${currentActiveDeck.name}.`);
  };

  const handleGenerate = () => {
    const nextDraft = createCharacterCard(forgeState.lastInput);
    setForgeState((current) => ({
      ...current,
      lastDraft: nextDraft,
      lastInput: nextDraft.prompts,
    }));
    setToast(
      `Generated ${nextDraft.name}, a ${nextDraft.rarity.toLowerCase()} ${nextDraft.archetype.toLowerCase()} from ${nextDraft.district}.`,
    );
  };

  const handleReroll = (target: RerollTarget) => {
    const nextDraft = rerollCharacterCard(draft, target, forgeState.lastInput);
    setForgeState((current) => ({
      ...current,
      lastDraft: nextDraft,
      lastInput: nextDraft.prompts,
    }));
    setToast(`${target === "all" ? "Fully rerolled" : `Rerolled ${target}`} for ${nextDraft.name}.`);
  };

  const saveDraftToCollection = (currentDraft: CharacterCard) => {
    setForgeState((current) => {
      if (current.cards.some((card) => card.id === currentDraft.id)) {
        return current;
      }

      return {
        ...current,
        cards: [currentDraft, ...current.cards],
        lastDraft: currentDraft,
        lastInput: currentDraft.prompts,
      };
    });
    setToast(`${currentDraft.name} was saved to your collection.`);
  };

  const handleSaveDraft = () => {
    if (isDraftSaved) {
      setToast(`${draft.name} is already in your collection.`);
      return;
    }

    saveDraftToCollection(draft);
  };

  const handleAddDraftToDeck = () => {
    addCardToActiveDeck(draft);
  };

  const handleSelectCard = (card: CharacterCard) => {
    setForgeState((current) => ({
      ...current,
      lastDraft: card,
      lastInput: card.prompts,
    }));
    setToast(`Loaded ${card.name} back into the forge for inspection or export.`);
  };

  const handleCreateDeck = () => {
    const trimmedName = newDeckName.trim();
    const nextDeck = createDeck(trimmedName || createSuggestedDeckName(forgeState.decks), draft.prompts.accentColor);
    setForgeState((current) => ({
      ...current,
      decks: [...current.decks, nextDeck],
      activeDeckId: nextDeck.id,
    }));
    setNewDeckName(createSuggestedDeckName([...forgeState.decks, nextDeck]));
    setToast(`Created a new deck shell: ${nextDeck.name}.`);
  };

  const handleSelectDeck = (deckId: string) => {
    setForgeState((current) => ({
      ...current,
      activeDeckId: deckId,
    }));
    const selectedDeck = forgeState.decks.find((deck) => deck.id === deckId);
    if (selectedDeck) {
      setToast(`Switched to ${selectedDeck.name}.`);
    }
  };

  const handleRemoveFromDeck = (cardId: string) => {
    if (!activeDeck) {
      return;
    }

    setForgeState((current) => ({
      ...current,
      decks: current.decks.map((deck) =>
        deck.id === current.activeDeckId
          ? {
              ...deck,
              cardIds: deck.cardIds.filter((value) => value !== cardId),
              updatedAt: new Date().toISOString(),
            }
          : deck,
      ),
    }));

    const removedCard = cardMap.get(cardId);
    if (removedCard) {
      setToast(`Removed ${removedCard.name} from ${activeDeck.name}.`);
    }
  };

  const handleExportDraft = () => {
    downloadCardExport(draft);
    setToast(`Downloaded ${draft.name} as a reusable card JSON payload.`);
  };

  const handleExportDeck = () => {
    if (!activeDeck || deckCards.length === 0) {
      setToast("Add at least one saved card before exporting a deck.");
      return;
    }

    downloadDeckExport(activeDeck, deckCards);
    setToast(`Exported ${activeDeck.name} with ${deckCards.length} cards for future game ingestion.`);
  };

  const collectionCount = forgeState.cards.length;
  const uniqueCrews = new Set(deckCards.map((card) => card.crew)).size;

  return (
    <div className="app-shell">
      <header className="panel hero-panel">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Skater-Punk Card Forge</p>
            <h1>Generate cyberpunk courier cards, save them, and assemble playable deck JSON.</h1>
            <p>
              This app is built around open tooling: prompt-driven TypeScript generation, procedural 2D SVG card
              art, local deck persistence, and exportable data contracts ready for a future game project.
            </p>
            <div className="chip-row">
              {OPEN_SOURCE_STACK.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-metrics">
            <div className="metric-card">
              <span className="metric-label">Collection</span>
              <strong>{collectionCount}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Decks</span>
              <strong>{forgeState.decks.length}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Active deck</span>
              <strong>{activeDeck?.cardIds.length ?? 0}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Deck power</span>
              <strong>{totalDeckStats}</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="studio-layout">
        <section className="studio-main-column">
          <CardForgeForm
            input={forgeState.lastInput}
            onInputChange={updateInput}
            onGenerate={handleGenerate}
            onReroll={handleReroll}
            onSaveDraft={handleSaveDraft}
            onAddDraftToDeck={handleAddDraftToDeck}
            onExportDraft={handleExportDraft}
            activeDeckName={activeDeck?.name ?? "deck"}
            savedCount={collectionCount}
            deckCount={forgeState.decks.length}
            isDraftSaved={isDraftSaved}
            canAddDraftToDeck={canAddDraftToDeck}
          />

          <article className="panel collection-panel">
            <div className="section-heading">
              <h2>Saved collection</h2>
              <p>Every saved card remains structured JSON first, so you can filter, export, and re-render later.</p>
            </div>

            {forgeState.cards.length === 0 ? (
              <div className="empty-state">
                <p>No cards saved yet. Generate a courier and save it to start building your collection.</p>
              </div>
            ) : (
              <div className="saved-card-grid">
                {forgeState.cards.map((card) => {
                  const inActiveDeck = activeDeck?.cardIds.includes(card.id) ?? false;
                  return (
                    <article
                      key={card.id}
                      className={`saved-card-tile ${draft.id === card.id ? "selected-saved-card" : ""}`}
                    >
                      <div className="saved-card-topline">
                        <p className="eyebrow">
                          {card.rarity} {card.archetype}
                        </p>
                        <span className="badge">{card.serial}</span>
                      </div>
                      <h3>{card.name}</h3>
                      <p className="muted">
                        {card.crew} · {card.district}
                      </p>
                      <div className="chip-row">
                        {card.personality.map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="saved-card-stats">
                        <span>Total stats</span>
                        <strong>{formatStatTotal(card)}</strong>
                      </div>
                      <div className="card-row-actions">
                        <button className="secondary" onClick={() => handleSelectCard(card)}>
                          Preview
                        </button>
                        <button
                          className="secondary"
                          disabled={
                            !activeDeck ||
                            inActiveDeck ||
                            (activeDeck?.cardIds.length ?? 0) >= DECK_SIZE_LIMIT
                          }
                          onClick={() => addCardToActiveDeck(card)}
                        >
                          {inActiveDeck ? "In deck" : "Add to active deck"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </article>
        </section>

        <section className="studio-side-column">
          <CharacterCardPreview card={draft} />

          <article className="panel deck-panel">
            <div className="section-heading">
              <h2>Deck builder</h2>
              <p>Assemble up to {DECK_SIZE_LIMIT} couriers and export a future-proof deck payload.</p>
            </div>

            <div className="deck-create-row">
              <label className="field grow-field">
                <span>New deck name</span>
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(event) => setNewDeckName(event.target.value)}
                  placeholder="Courier Deck 2"
                />
              </label>
              <button onClick={handleCreateDeck}>Create deck</button>
            </div>

            <div className="deck-selector">
              {forgeState.decks.map((deck) => (
                <button
                  key={deck.id}
                  className={`deck-pill ${deck.id === activeDeck?.id ? "active-deck-pill" : "secondary"}`}
                  onClick={() => handleSelectDeck(deck.id)}
                >
                  {deck.name}
                </button>
              ))}
            </div>

            {activeDeck && (
              <div className="deck-summary-card">
                <div>
                  <p className="eyebrow">Active deck</p>
                  <h3>{activeDeck.name}</h3>
                  <p className="muted">{activeDeck.description}</p>
                </div>
                <div className="summary-grid">
                  <div className="metric-card">
                    <span className="metric-label">Cards</span>
                    <strong>
                      {activeDeck.cardIds.length}/{DECK_SIZE_LIMIT}
                    </strong>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Crews</span>
                    <strong>{uniqueCrews}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Updated</span>
                    <strong>{formatDateLabel(activeDeck.updatedAt)}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Export</span>
                    <strong>deck.v1</strong>
                  </div>
                </div>
                <div className="card-row-actions">
                  <button onClick={handleExportDeck}>Export active deck JSON</button>
                </div>
              </div>
            )}

            {deckCards.length === 0 ? (
              <div className="empty-state">
                <p>The active deck is empty. Add a saved courier from the forge or collection.</p>
              </div>
            ) : (
              <div className="deck-card-list">
                {deckCards.map((card) => (
                  <article key={card.id} className="deck-card-row">
                    <div>
                      <p className="eyebrow">
                        {card.rarity} {card.archetype}
                      </p>
                      <h3>{card.name}</h3>
                      <p className="muted">
                        {card.ability} · {card.district}
                      </p>
                    </div>
                    <div className="deck-card-row-actions">
                      <span className="badge">STAT {formatStatTotal(card)}</span>
                      <button className="secondary" onClick={() => handleSelectCard(card)}>
                        Load
                      </button>
                      <button className="secondary" onClick={() => handleRemoveFromDeck(card.id)}>
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className="panel integration-panel">
            <div className="section-heading">
              <h2>Future game integration contract</h2>
              <p>
                Cards and decks export as structured JSON, so the next project can ingest them without depending on
                this frontend implementation.
              </p>
            </div>
            <ul className="economy-list">
              <li>Each card stores prompts, deterministic seeds, stats, visuals, tags, and serial metadata.</li>
              <li>Each deck export bundles the selected card definitions with deck-level metadata.</li>
              <li>Procedural SVG art can be re-rendered later from stored card data and accent palette.</li>
              <li>Open-source tooling used here: React, TypeScript, Vite, CSS, SVG, and browser localStorage.</li>
            </ul>
          </article>
        </section>
      </main>

      <footer className="panel footer-panel">
        <div>
          <h3>Current note</h3>
          <p>{toast}</p>
        </div>
        <div>
          <h3>Recommended next extension</h3>
          <p className="muted">
            Add card locks, PNG export, and optional asset-pack overrides so the same schema can support handcrafted
            art, open-license texture packs, or AI-assisted concept passes later.
          </p>
        </div>
      </footer>
    </div>
  );
}
