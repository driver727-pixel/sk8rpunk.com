# Skater-Punk Platform

Skater-Punk is a creative IP universe — an **SP Digital LLC** property — for cyberpunk skateboard games and tools.

Each hosted app within the Skater-Punk universe shares the same neon-lit courier world, card system, and data contracts. The hub also links to other SP Digital LLC products that live outside the Skater-Punk IP.

## Hosted Apps

### Skater-Punk Universe

#### Punchskater — [punchskater.com](https://punchskater.com)

The first app inside the Skater-Punk IP. Punchskater is a **card creation tool** for building cyberpunk electric-skateboard courier decks.

A player can:

- choose a few high-level character prompts
- generate a unique 2D courier playing card
- save generated cards into a collection
- assemble cards into named decks
- export individual cards or full decks as JSON for a future game project

#### Courier Dispatch

The core gameplay loop: a garage of skateboard couriers, user-selected automated routes, offline progression, and rewarded ad boosts designed for Google AdMob on Android.

### More from SP Digital LLC

#### Craftlingua — [craftlingua.app](https://craftlingua.app)

An SP Digital LLC app for hands-on language learning. Craftlingua lives outside the Skater-Punk universe but shares the same creative studio.

## What the platform uses

This build is intentionally based on **open-source tooling** and **open remix-friendly generation methods**:

- **React + TypeScript + Vite** for the app shell
- **Procedural SVG + CSS** for the 2D card art style
- **Deterministic TypeScript generation** for names, stats, traits, and visuals
- **Browser localStorage** for persistence
- **JSON export contracts** for future game ingestion

No closed-source art pack is required for the MVP. The generated card art is assembled in-app from open procedural primitives instead of relying on copyrighted or proprietary character assets.

## Core feature set

### App Hub

The default landing screen shows every game and app available on the platform. Users can launch any live app from the hub.

### Punchskater Card Forge

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

## Deck Builder integration

Cards and decks created in the **Skater-Punk Deck Builder** (hosted at [punchskater.com](https://punchskater.com) — source: [driver727-pixel/Skater-Punk-Deck-Builder](https://github.com/driver727-pixel/Skater-Punk-Deck-Builder)) can be imported directly into this game for use in initial setup and future gameplay.

### How the data flows

```
punchskater.com (Deck Builder)
        │
        │  1. User exports cards / deck as JSON
        │     — or —
        │  2. User shares a card via URL  (?card=<encoded>)
        ▼
Skater-Punk game
  src/features/deck-import/
        │
        ├── types.ts    — TypeScript types for Deck Builder payloads (v1.0.0)
        ├── adapter.ts  — converts Deck Builder format → internal CharacterCard format
        └── index.ts    — parseDeckBuilderFile(), readDeckBuilderUrlParam()
```

### Import paths

**File import** (recommended for full decks):
1. Export a collection or deck from punchskater.com as `.json`
2. Drop / upload the file in the game's Card Forge screen
3. Imported cards land in the forge collection, ready to be assigned to gameplay decks

**URL deep-link** (for single-card sharing):
The Deck Builder encodes a shareable card as `?card=<URLEncodedJSON>` in the URL.  
When the game is opened with that parameter, `readDeckBuilderUrlParam()` decodes it and returns a `CharacterCardInput` + `seed` pair that can be passed straight to `createCharacterCard()` to regenerate the identical card deterministically.

### Archetype mapping

| Deck Builder | Game |
|---|---|
| Runner | Courier |
| Ghost | Signal Ghost |
| Bruiser | Trick Rider |
| Tech | Battery Hacker |
| Medic | Street Mechanic |

### Environment variable

Copy `.env.example` to `.env` and adjust if needed:

```
VITE_DECK_BUILDER_URL=https://punchskater.com
```

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
