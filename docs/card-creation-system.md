# Electric Skateboarder Card Creation System

## Goal

Give players a way to generate a **2D playable card** and a **unique Electric Skateboarder character** in under a minute, while still feeling handcrafted and collectible.

The system should prioritize:

1. **Speed** - a usable card should be generated in a few clicks.
2. **Variation** - cards should feel different even when built from reusable parts.
3. **Readability** - the card must work as a game object, not just character art.
4. **Scalability** - the same pipeline should support player-made cards, NPCs, and future monetized cosmetics.

---

## Core Idea: "Card Forge"

Build a **Card Forge** flow where the user picks a few high-level inputs, and the system assembles the rest.

### Fast generation loop

1. Choose an archetype
2. Choose a style vibe
3. Generate character portrait
4. Auto-roll gameplay stats and perks
5. Render the final card frame
6. Allow quick rerolls on specific parts only

This keeps the user from having to manually design every detail.

---

## Best Practical Approach

The fastest reliable approach is a **hybrid generation pipeline**:

### 1. Structured character builder

Generate the character from modular data:

- body type
- silhouette
- stance
- face preset
- skin tone
- hair style
- hair color
- visor / mask / glasses
- jacket
- pants
- shoes
- skateboard deck style
- wheel glow color
- accessories
- faction / crew tag

This gives you control, consistency, and easy balancing.

### 2. Layered 2D art assembly

Instead of trying to fully paint each card from scratch, build the portrait from reusable visual layers:

- background
- character base
- clothing overlay
- board overlay
- gear / effects overlay
- foreground FX
- card frame
- icons and text

This lets you create thousands of combinations quickly and keeps the output coherent.

### 3. Controlled procedural stats

Once a character concept exists, derive gameplay values from the selected parts.

Example:

- **Courier** archetype -> bonus to speed and route efficiency
- **Street Technician** archetype -> bonus to repair and battery management
- **Trick Rider** archetype -> bonus to evasion and style
- **Heavy Hauler** archetype -> bonus to cargo and durability

This makes the card feel mechanically meaningful, not just cosmetic.

### 4. Optional AI-assisted portrait generation

If you want more visual uniqueness, use AI only as a **concept enhancer**, not as the entire system.

Good uses of AI:

- generate portrait concepts from a tightly controlled prompt
- generate face variations
- generate sticker art, graffiti logos, or faction emblems
- create background scenes for neighborhoods or route zones

Less reliable uses:

- generating the final production card layout
- generating stat blocks
- producing fully consistent collectible sets without cleanup

For a real product, AI should feed into your art pipeline, not replace it.

---

## Recommended User Experience

### Option A: "Quick Forge" for speed

This is the best default flow for most users.

### User inputs

- Archetype
- Rarity tier
- Style vibe
- One personality tag
- One color accent

### System outputs

- character name
- portrait
- skateboard model
- 3 to 5 stats
- 1 passive trait
- 1 special ability
- flavor text
- final card art

### Example

Input:

- Archetype: Courier
- Rarity: Rare
- Vibe: Neon outlaw
- Personality: Reckless
- Accent: Electric blue

Output:

- Name: Vex Halo
- Visual: slim rider with blue-lit wheels, reflective bomber jacket, half visor
- Stats: Speed 9, Grip 6, Cargo 4, Focus 7
- Trait: Shortcuts
- Ability: Surge Lane
- Flavor text: "If traffic is legal, Vex is not interested."

This is the fastest way to fill decks.

---

### Option B: "Custom Forge" for creators

For players who want more authorship, let them edit the generated result.

Editable fields:

- face
- hair
- outfit
- deck art
- pose
- card border
- stat bias
- name
- crew logo
- flavor text

The key is to let them **lock** parts they like and reroll the rest.

Example:

- lock name
- lock jacket
- reroll board
- reroll ability
- reroll background

This creates fast iteration without frustration.

---

## Card Anatomy

Each card should have a fixed readable structure.

### Suggested layout

1. **Top bar**
   - Name
   - Rarity
   - Crew / faction icon

2. **Center art window**
   - Character portrait with skateboard
   - Strong silhouette
   - Background location or district

3. **Stat rail**
   - Speed
   - Control
   - Power
   - Cargo
   - Tech
   - Style

4. **Ability box**
   - Passive trait
   - Active move or utility skill

5. **Bottom identity strip**
   - Archetype
   - Energy / battery type
   - Manufacture or deck brand
   - Serial / card ID

This will read like a collectible card and a game unit at the same time.

---

## Character Data Model

Store every generated card as structured data first, render second.

```json
{
  "id": "card_000421",
  "name": "Vex Halo",
  "archetype": "Courier",
  "rarity": "Rare",
  "crew": "Night Voltage",
  "personality": ["Reckless", "Focused"],
  "visual": {
    "body": "lean",
    "pose": "forward_push",
    "skinTone": "medium",
    "hair": "undercut",
    "hairColor": "silver",
    "eyewear": "half_visor",
    "jacket": "reflective_bomber",
    "pants": "techwear_tapered",
    "shoes": "shock_grip_high_tops",
    "board": "narrow_racing_deck",
    "deckGraphic": "blue_tiger_signal",
    "wheelFx": "electric_blue"
  },
  "stats": {
    "speed": 9,
    "control": 7,
    "power": 4,
    "cargo": 4,
    "tech": 6,
    "style": 8
  },
  "passive": "Shortcuts",
  "ability": "Surge Lane",
  "flavorText": "If traffic is legal, Vex is not interested.",
  "renderConfig": {
    "frame": "rare_neon_frame",
    "background": "city_alley_rain",
    "palette": ["#00C2FF", "#151A24", "#B8C4D6"]
  }
}
```

This structure lets you:

- save cards
- re-render cards later
- balance stats without repainting art
- support exports to mobile and web
- run deck-building filters

---

## How to Make Characters Feel Unique

Uniqueness should come from combining **visual identity**, **stat identity**, and **trait identity**.

### Visual uniqueness

Use combinatorics from layered assets:

- 8 body silhouettes
- 12 poses
- 16 hair options
- 20 jackets
- 15 pants
- 18 board types
- 24 deck graphics
- 12 FX themes
- 10 district backgrounds

Even a moderate library creates a large number of combinations.

### Mechanical uniqueness

Give each card:

- one archetype baseline
- one passive trait
- one active ability
- one stat skew
- one perk drawback or specialization

Example:

- high speed but low cargo
- high tech but poor control
- high durability but low style

That tradeoff makes cards memorable.

### Identity uniqueness

Generate:

- name patterns by district or crew
- brand/manufacturer labels
- crew affiliation
- short flavor lines
- serial number or set code

These details make cards feel collectible.

---

## Generation Rules

Use weighted rules so outputs feel curated instead of random noise.

### Example rules

- Couriers prefer light boards and aerodynamic outfits
- Haulers prefer thicker decks and utility gear
- Tech riders more often roll visors, battery packs, and diagnostic tools
- Rare cards get more complex silhouettes, animated FX, or dual-tone boards
- Specific crews bias the palette and fashion style

This prevents absurd combinations unless you intentionally want them.

---

## Recommended MVP

For version one, avoid building a full character editor.

Ship this instead:

### MVP inputs

- Archetype dropdown
- Rarity dropdown
- Style vibe dropdown
- Accent color picker
- "Generate card" button

### MVP output

- generated name
- generated portrait assembled from layers
- auto-generated stats
- trait and ability
- downloadable PNG card

### MVP controls

- reroll all
- reroll visuals
- reroll stats
- reroll name
- save to collection

That is enough to prove the loop and start building decks immediately.

---

## Technical Implementation Path

If you are building web + Android, the cleanest architecture is:

### Frontend

- React / Next.js or React Native Web-compatible UI
- card preview panel
- form inputs for archetype and vibe
- reroll controls

### Backend

- generator service that creates structured card JSON
- asset resolver that maps chosen parts to image layers
- renderer service that composites the final card
- storage for saved cards and decks

### Rendering options

#### Best for MVP

- Render with HTML/CSS and export to PNG using canvas or server-side screenshot rendering

Why:

- fast to iterate
- easy text layout
- easy responsive previews
- card frame design is straightforward

#### Best for asset-driven production

- Composite layers using Canvas, PixiJS, or server-side image processing

Why:

- deterministic
- portable
- easy to batch-generate cards
- works well for collectible sets

---

## Suggested Generation Pipeline

### Step 1: Create a seed

Use:

- user inputs
- random seed
- rarity table
- archetype rules

### Step 2: Generate character profile

Pick:

- name
- crew
- personality tags
- visual parts

### Step 3: Generate mechanics

Compute:

- stat spread
- trait
- active ability
- rarity modifiers

### Step 4: Resolve art layers

Map profile choices to:

- portrait layers
- board layers
- FX layers
- background
- frame

### Step 5: Render final card

Output:

- preview in UI
- saved JSON definition
- exportable PNG

---

## Best Long-Term System

The strongest long-term design is:

1. **Structured procedural generator** for stats and identity
2. **Modular 2D layered art system** for consistent visuals
3. **Selective AI support** for concept art and cosmetic expansion
4. **Reroll + lock UX** so users can generate quickly without losing favorites

This gives you:

- fast content production
- collectible variety
- game balance control
- a clear path to deck-building

---

## Concrete Recommendation

If your immediate need is to let users quickly create decks of Electric Skateboarders, build this first:

### "Generate Skater Card" feature

- User picks archetype + style vibe + accent color
- System generates one skater card from a structured ruleset
- Portrait is assembled from modular 2D parts
- Card frame auto-fills stats, rarity, ability, and flavor
- User can reroll locked sections
- User saves cards into a deck builder

That is the fastest path to a usable card creation system.

---

## Example Archetypes for Skater-Punk

- Courier
- Trick Rider
- Battery Hacker
- Route Scout
- Heavy Hauler
- Street Mechanic
- Signal Ghost
- Crew Captain

---

## Example Next Build Steps

1. Define the card JSON schema
2. Define 4 to 8 archetypes and their stat biases
3. Create the first modular art pack
4. Build a generator function from seed + inputs
5. Build a card preview component
6. Add reroll and lock behavior
7. Add save-to-deck flow

If you want, the next implementation step after this document should be a small web-based **Card Forge prototype** with:

- a generator form
- seeded character generation
- a rendered 2D card preview
- exportable mock card data

