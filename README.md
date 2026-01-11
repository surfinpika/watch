# New Port City: City Watch

A 2D hybrid RPG/Visual Novel set in a medieval coastal city where you rise through the ranks of the City Watch, solving crimes and uncovering dark secrets.

## About

**New Port City** combines the best elements of classic games:
- **Dragon Quest** - RPG progression and exploration
- **Ace Attorney** - Investigation and evidence-based storytelling
- **Yakuza** - Side quests with dramatic reveals and memorable characters
- **A Song of Ice and Fire** - Dark medieval fantasy writing and morally grey characters

## Story

You are an orphan who joins the City Watch of New Port City—a tropical coastal metropolis built on the ruins of an ancient city destroyed by a legendary sea monster. As you solve crimes and protect the citizens, you'll uncover conspiracies that reach from the slums to the royal palace, and discover that the old legends may be more real than anyone believes.

## Features

### City Watch Progression
Rise through the ranks, each marked by a unique seashell badge:
- 🐚 **Recruit** - Fresh meat. Prove your worth.
- 🦪 **Watchman** - A proper member of the Watch.
- 🐚 **Sergeant** - Commands a small patrol.
- 🦑 **Lieutenant** - Leads investigations.
- 🦞 **Captain** - Commands the district watch.
- 👑 **Commander** - Leader of the City Watch.

### Visual Novel Dialogue
Full dialogue system with character portraits and typewriter effect. Titles and occupations (QUEEN, SIR, LORD, BLACKSMITH, etc.) are highlighted with colored text based on social class.

### Yakuza-Style Quests
Quests begin with dramatic reveals—you start talking to someone, there's a punchline, and then the quest title dramatically appears on screen.

### Investigation System
Ace Attorney-inspired evidence collection and examination. Search crime scenes for clues, collect evidence, and present findings to NPCs.

### Locations

**Central District**
- City Watch Barracks - Your home base
- Central Plaza - The bustling heart of the city
- The Marketplace - Where anything can be bought

**Coastal Areas**
- Stingray Oceanfront
- Manta Beach
- Sharktooth Coast
- The Vast Edge
- Palm Cove
- Reflecting Sands
- The Golden Sands Strand

**Special Locations**
- The Velvet Shell - A house of pleasure with many secrets
- Old Port Ruins - The haunted remains of the original city
- Shrine of the Deep - Where the faithful worship the sea monster

## Quest Lines

### Main Story
1. **First Steps** - Your first day on the Watch
2. **A Smith's Dilemma** - Investigate stolen Valyrian steel
3. **Whispers in the Velvet** - People are disappearing from the docks
4. **The Forgotten Ones** - A serial killer who erases memories
5. **Shadows in the Deep** - The sea monster cult revealed

### Side Quests
- **A Matter of Taste** - Something is very wrong with the meat at the market...

## Technical Details

Built with:
- Vanilla JavaScript (ES6 modules)
- HTML5 Canvas for rendering
- CSS3 for UI styling

### Project Structure
```
/src
  /engine        - Core game engine (Game, Renderer, Input)
  /scenes        - Scene management and exploration
  /systems       - Game systems (Dialogue, Quests, Investigation)
  /data          - Game data (NPCs, Quests, Locations)
  /ui            - UI management
  /styles        - CSS styling
  /assets        - Art, audio (placeholder)
```

## Running the Game

1. Serve the project with any local web server
2. Open `index.html` in a modern browser
3. Click "New Game" to begin

Example with Python:
```bash
python -m http.server 8000
# Open http://localhost:8000
```

## Controls

- **WASD / Arrow Keys** - Move
- **E / Enter / Space** - Interact / Advance dialogue
- **Shift** - Sprint
- **Escape** - Menu / Cancel
- **I / Tab** - Evidence panel

## The Legend of the Sea Monster

> *Centuries ago, Old Port City stood where the ruins now lie. The people grew arrogant, forgetting the old ways and the beast that slumbered beneath the waves.*
>
> *The Deep One awoke. In a single night, the city was swallowed by the sea.*
>
> *Some say the monster still sleeps, waiting. Some say it appears only to the worthy—those with great destinies. The PRINCESS plays her harp in the ruins each night, hoping to prove herself worthy.*
>
> *But the sea keeps its secrets, and the Deep One dreams...*

## Credits

Created as a game concept combining beloved gameplay elements with dark fantasy storytelling.

## License

MIT License
