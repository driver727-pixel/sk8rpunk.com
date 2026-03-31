# Skater-Punk
Grand Vision  Web/Android based. I am building an 80s/90s cyberpunk delivery game. I have characters on electric skateboards. Where the user builds up to a squad of 6 skateboarders who go on automated routes chosen by the user. The routes run in real time in the background. The game is map, flash card, and garage based.

## Card Forge prototype

A working static prototype now lives at the repo root:

- `index.html`
- `styles.css`
- `app.js`

### Run locally

From the repository root, start a simple web server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

### What it does

- generates a seeded Electric Skateboarder card from form inputs
- renders a 2D SVG card preview
- supports rerolling all, name, visuals, or stats
- supports lock toggles for identity, visuals, and stats
- saves cards into a local browser collection with `localStorage`
- supports building an active 6-skater squad deck from generated or saved cards
- shows aggregate deck stats, crew/archetype breakdowns, and exportable deck JSON
- exports the current card preview as a PNG

### Deck builder flow

1. Generate or load a card.
2. Click **Add to active deck** to place it into the current 6-slot squad.
3. Use saved collection cards or the current preview card to fill the squad.
4. Review the deck summary for:
   - slot usage
   - average stat spread
   - archetype mix
   - crew mix
5. Export the current squad as JSON with **Export deck JSON**.

## Design docs

- [Electric Skateboarder Card Creation System](docs/card-creation-system.md)
