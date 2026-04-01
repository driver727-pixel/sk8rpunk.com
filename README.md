# Skater-Punk Card Forge

This repo now contains a working MVP for a **cyberpunk electric-skateboard courier card deck builder**.

The app lets a player:

- choose a few high-level character prompts
- generate a unique 2D courier playing card
- save generated cards into a collection
- assemble cards into named decks
- export individual cards or full decks as JSON for a future game project

## What the app uses

This build is intentionally based on **open-source tooling** and **open remix-friendly generation methods**:

- **React + TypeScript + Vite** for the app shell
- **Procedural SVG + CSS** for the 2D card art style
- **Deterministic TypeScript generation** for names, stats, traits, and visuals
- **Browser localStorage** for persistence
- **JSON export contracts** for future game ingestion

No closed-source art pack is required for the MVP. The generated card art is assembled in-app from open procedural primitives instead of relying on copyrighted or proprietary character assets.

## Core feature set

### Card Forge

Users can generate a courier card from:

- Archetype
- Rarity
- Style vibe
- District
- Accent color

The generator outputs:

- character name
- crew and manufacturer
- personality tags
- stat spread
- passive trait
- active ability
- flavor text
- visual selections and procedural card art
- serial metadata and export tags

### Deck Builder

Users can:

- create multiple named decks
- add saved cards into the active deck
- remove cards from decks
- export a full deck payload as JSON

## Future game integration

Exports are designed so a separate game project can ingest them without depending on this frontend.

### Card payload

Each card stores:

- prompts
- deterministic seeds
- generated identity
- gameplay stats
- visual selections
- tags and serial metadata

### Deck payload

Each deck export stores:

- deck metadata
- ordered selected card definitions
- schema version markers for compatibility

## Open asset and generation roadmap

If you want to extend this with additional open-license content later, the cleanest path is:

1. keep the current procedural SVG card renderer for instant generation
2. add optional **CC0 / public domain** texture packs, symbols, or background overlays
3. add optional artist-made frame packs under a permissive license
4. keep generated card data structured first so art can be rerendered later

Good candidates for future open-license additions:

- CC0 texture libraries
- self-authored SVG icon packs
- Blender or Krita generated backgrounds released under CC0 or CC BY
- locally-run open models for concept exploration, with final game assets still normalized into your own pipeline

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

```bash
npm install
```

### Running the development server

```bash
npm run dev
```

Then open the local URL shown in the terminal.

### Building for production

```bash
npm run build
```

The output will be generated in `dist/`.

### Running tests

```bash
npm test
```

## Design docs

- [Electric Skateboarder Card Creation System](docs/card-creation-system.md)
- [Character Card Creator Implementation Path](docs/character-card-creator-path.md)
