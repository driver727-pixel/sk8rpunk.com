# Sk8r Punk Universe Roadmap

Sk8r Punk is the umbrella intellectual property for a connected universe of electric-skateboard cyberpunk games, fiction, lore, tools, and future media. Punch Skater is the first public game within this universe, but it should not carry every possible gameplay idea alone.

## North Star

**Sk8r Punk is a cyberpunk universe where electric skateboard crews, couriers, racers, jousters, hackers, collectors, and corporate rebels fight for reputation across neon Australian streets.**

The core fantasy:

> Build a squad. Charge your boards. Run the routes. Win the jousts. Own the neon streets.

## Brand Structure

### Umbrella IP

**Sk8r Punk**

The whole fictional universe: novels, lore, websites, games, card systems, future tabletop products, casino-style modes, jousting games, delivery games, faction wars, comics, and more.

### First Card Game / Gateway Product

**Punch Skater**

The collectible card creation, trading, mission, racing, jousting-lite, and leaderboard game. Punch Skater introduces the world and gives players a reason to collect, create, trade, and compete.

### Broader Game Concepts to Preserve

These should remain available as future Sk8r Punk projects rather than being forced into Punch Skater immediately:

- Full electric-skate jousting combat game
- Delivery-route squad management game
- Casino / dice / wager game
- District-control faction strategy game
- Story RPG
- Physical or digital tabletop card game
- Novels, short fiction, comics, and world bible releases

## IP Pillars

### 1. Electric Skateboarding Is the Signature

Electric skateboards are new enough that the universe can own this visual and cultural lane. Every game should reinforce the identity of electric skateboards as transport, sport, class marker, weapon platform, and personal expression.

### 2. Cyberpunk Australia

The setting should feel different from American gun-heavy cyberpunk. Australian scarcity, distance, heat, urban sprawl, coastal cities, backroads, corporate extraction, and lower firearm prevalence can push the world toward distinctive combat and transport systems.

### 3. Jousting Replaces Gun Culture

Poor and underground skaters weaponize available gear:

- shock lances
- riot shields
- carbon-fiber poles
- road-sign shields
- magnetic bucklers
- repurposed sporting gear
- battery-powered impact rigs
- corporate tournament weapons

The joust is sport, gang challenge, street law, performance, and combat ritual.

### 4. Cards Are Status Objects

Cards represent identity, reputation, collectible value, squad membership, trade value, faction allegiance, and gameplay progression.

### 5. Factions Create Attachment

The universe should be faction-driven. Every player should eventually feel drawn toward a crew, district, style, or ideology.

Possible faction families:

- Rust Kids — DIY punk scavengers and junkyard riders
- Neon Saints — stylish crowd-favorite skaters
- Signal Ghosts — hackers, route manipulators, stealth riders
- Chrome Syndicate — corporate-backed elite competitors
- Voltage Vultures — high-speed battery extremists
- Alley Wraiths — shortcut masters and underground messengers

## Relationship Between Repositories

### sk8rpunk.com

This repo should become the universe hub and future platform layer.

Responsibilities:

- Explain the Sk8r Punk universe
- Link to Punch Skater
- Present the world bible and fiction gateway
- Host hub pages for future games
- Define cross-game canon
- Define shared factions, districts, terms, and data contracts
- Eventually connect accounts, profiles, squads, and shared inventory if desired

### Punch-Skater

This repo should remain focused on the first playable card game.

Responsibilities:

- Card creation and collection
- Crew of 6 system
- Missions and progression
- Trading and leaderboard systems
- Jousting-lite card encounters
- Codex/lore unlocks
- Rival and district progression
- Seasonal events

## Roadmap Phases

### Phase 0 — Canon Lock and Repository Alignment

**Goal:** Define what belongs to Sk8r Punk versus what belongs to Punch Skater.

**Recommended model:** Opus 4.7

**Why:** This is creative architecture and canon organization. It benefits from strong reasoning, worldbuilding, and synthesis.

**Tasks:**

1. Establish Sk8r Punk as the umbrella IP.
2. Establish Punch Skater as the first game under the umbrella.
3. Create or update a world bible section for:
   - factions
   - districts
   - jousting tradition
   - electric skateboard culture
   - terminology
   - technology rules
   - corporations and underground crews
4. Decide which mechanics are universal canon versus Punch Skater-specific mechanics.
5. Add links from sk8rpunk.com to punchskater.com.

**Deliverables:**

- Universe overview page
- Canon glossary
- Faction index
- Jousting lore page
- Punch Skater product page

---

### Phase 1 — Universe Hub MVP

**Goal:** Make sk8rpunk.com feel like the front door to a real IP universe.

**Recommended model:** Sonnet 4.6

**Why:** This is mostly UI/content implementation and can be done cost-effectively.

**Tasks:**

1. Create a strong landing page with the North Star fantasy.
2. Add visual navigation cards for:
   - Punch Skater
   - Courier Dispatch
   - Future Jousting Game
   - Future Dice/Casino Game
   - Fiction / Novels
   - Codex / World Bible
3. Add a simple timeline or roadmap section.
4. Add a clear call to action: "Play Punch Skater".
5. Add an IP positioning section: "Electric skateboard cyberpunk from Australia."

**Deliverables:**

- Homepage refresh
- Game hub cards
- Punch Skater CTA
- Future projects teaser section

---

### Phase 2 — World Bible and Canon Pages

**Goal:** Give the universe enough structure that future games can share it without contradiction.

**Recommended model:** Opus 4.7 for lore drafting, Sonnet 4.6 for implementation

**Why:** Use Opus for creative canon and Sonnet for lower-cost page/file updates.

**Tasks:**

1. Build a World Bible section.
2. Add pages for:
   - The Joust
   - Factions
   - Districts
   - Board tech
   - Lances and shields
   - Courier culture
   - Corporate power
   - The roads / route layers
3. Create canon rules:
   - What weapons are common?
   - Why are firearms rare?
   - How do board batteries work?
   - What is legal versus underground?
   - What do cards represent inside the world?
4. Create a changelog for canon updates.

**Deliverables:**

- World Bible docs or pages
- Canon changelog
- Shared terminology list

---

### Phase 3 — Shared Data Contracts

**Goal:** Prepare Sk8r Punk to support multiple games without breaking data compatibility.

**Recommended model:** GPT-5.4

**Why:** This needs technical planning, schema discipline, and integration accuracy.

**Tasks:**

1. Define shared TypeScript types for:
   - skater identity
   - card identity
   - faction
   - district
   - board
   - lance
   - shield
   - rarity
   - progression metadata
2. Decide which data belongs to Punch Skater and which data belongs to the Sk8r Punk universe.
3. Create schema versioning rules.
4. Document import/export payloads.
5. Keep existing Punch Skater deck exports compatible.

**Deliverables:**

- Shared schema documentation
- TypeScript type definitions if appropriate
- Migration notes
- Versioning policy

---

### Phase 4 — Cross-Game Profile Vision

**Goal:** Design the future account/profile layer without overbuilding it now.

**Recommended model:** GPT-5.5

**Why:** Account architecture, inventory design, and future cross-game ownership need careful planning.

**Tasks:**

1. Decide whether Sk8r Punk eventually needs a global player profile.
2. Define profile concepts:
   - display name
   - home faction
   - favorite card
   - badge wall
   - titles
   - collection showcase
   - cross-game achievements
3. Define what Punch Skater can expose to the hub.
4. Plan privacy and security boundaries.
5. Avoid building blockchain or complicated ownership systems unless there is a clear reason.

**Deliverables:**

- Cross-game profile design document
- Security and privacy notes
- Future account integration plan

---

### Phase 5 — Future Game Incubation

**Goal:** Keep expansion ideas organized without distracting from Punch Skater.

**Recommended model:** Opus 4.7 for concept docs, GPT-5.4 for prototypes

**Tasks:**

1. Create one-page concept docs for:
   - Sk8r Punk: Joustline / Street Joust
   - Sk8r Punk: Neon Dice / Roll Pit
   - Sk8r Punk: Courier Dispatch
   - Sk8r Punk: District War
2. Define each concept by:
   - core fantasy
   - core loop
   - player progression
   - relationship to Punch Skater cards
   - scope risks
3. Do not implement all of them yet.
4. Use these docs as a creative vault.

**Deliverables:**

- Future game concept index
- One-page design briefs
- Priority recommendation list

## Agent Assignment Rules

Use the models like this:

| Work Type | Best Agent | Reason |
|---|---|---|
| Routine UI, page copy, styling, small components | Sonnet 4.6 | Best cost-saving default for implementation |
| Lore, canon, factions, story tone, creative synthesis | Opus 4.7 | Strong creative/worldbuilding reasoning |
| Technical schemas, integration, TypeScript architecture | GPT-5.4 | Strong implementation accuracy |
| Security, economy, account architecture, high-risk decisions | GPT-5.5 | Use for the highest-stakes correctness work |

## Immediate Next Steps

1. Treat this file as the high-level Sk8r Punk universe roadmap.
2. Keep Punch Skater focused as the first playable product.
3. Add jousting to the canon immediately.
4. Save full jousting combat and casino dice systems for future games.
5. Refresh sk8rpunk.com as the universe hub.
6. Make Punch Skater the clearest call to action from the hub.

## Guiding Principle

Do not cram the whole universe into one game.

Build Sk8r Punk as the world. Let Punch Skater be the first strong doorway into it.
