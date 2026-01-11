/**
 * Game Configuration
 * Core settings and constants for New Port City
 */

export const gameConfig = {
    // Canvas settings
    canvas: {
        width: 1280,
        height: 720,
        scale: 1
    },

    // Game settings
    game: {
        title: 'New Port City - City Watch',
        version: '0.1.0',
        targetFPS: 60
    },

    // Player starting configuration
    player: {
        name: 'Orphan',
        startingRank: 0,
        startingLocation: 'city_watch_barracks'
    },

    // City Watch Ranks (each with associated seashell badge)
    ranks: [
        {
            id: 'recruit',
            name: 'Recruit',
            badge: '🐚',  // Basic conch shell
            color: '#d4a574',
            description: 'Fresh meat. Prove your worth.'
        },
        {
            id: 'watchman',
            name: 'Watchman',
            badge: '🦪',  // Oyster shell
            color: '#a8b2c1',
            description: 'A proper member of the Watch.'
        },
        {
            id: 'sergeant',
            name: 'Sergeant',
            badge: '🐚',  // Golden conch
            color: '#c9a227',
            description: 'Commands a small patrol.'
        },
        {
            id: 'lieutenant',
            name: 'Lieutenant',
            badge: '🦑',  // Nautilus (represented by squid)
            color: '#2d8fb3',
            description: 'Leads investigations.'
        },
        {
            id: 'captain',
            name: 'Captain',
            badge: '🦞',  // Coral badge
            color: '#e07a5f',
            description: 'Commands the district watch.'
        },
        {
            id: 'commander',
            name: 'Commander',
            badge: '👑',  // Royal shell crown
            color: '#9b59b6',
            description: 'Leader of the City Watch.'
        }
    ],

    // Title/Occupation categories for text coloring
    titleCategories: {
        royal: ['QUEEN', 'KING', 'PRINCE', 'PRINCESS', 'HEIR', 'MAJESTY', 'HIGHNESS'],
        noble: ['LORD', 'LADY', 'DUKE', 'DUCHESS', 'COUNT', 'COUNTESS', 'BARON', 'BARONESS'],
        knight: ['SIR', 'DAME', 'KNIGHT', 'PALADIN', 'CHAMPION'],
        guard: ['COMMANDER', 'CAPTAIN', 'LIEUTENANT', 'SERGEANT', 'WATCHMAN', 'RECRUIT', 'GUARD'],
        common: ['BLACKSMITH', 'MERCHANT', 'FISHERMAN', 'INNKEEPER', 'BARMAID', 'ALCHEMIST', 'HEALER', 'PRIEST', 'MADAM', 'WHORE']
    },

    // Text display settings
    text: {
        dialogueSpeed: 30, // ms per character
        fastDialogueSpeed: 5
    }
};

/**
 * Location definitions for New Port City
 */
export const locations = {
    // City Watch Locations
    city_watch_barracks: {
        id: 'city_watch_barracks',
        name: 'City Watch Barracks',
        description: 'The heart of law enforcement in New Port City. Stone walls echo with the footsteps of watchmen.',
        type: 'interior',
        district: 'central',
        connections: ['central_plaza', 'armory', 'cells'],
        background: 'barracks'
    },
    armory: {
        id: 'armory',
        name: 'The Armory',
        description: 'Weapons and armor line the walls. The scent of oil and steel fills the air.',
        type: 'interior',
        district: 'central',
        connections: ['city_watch_barracks'],
        background: 'armory'
    },
    cells: {
        id: 'cells',
        name: 'The Cells',
        description: 'Dark, damp, and full of despair. The City Watch holding cells.',
        type: 'interior',
        district: 'central',
        connections: ['city_watch_barracks'],
        background: 'cells'
    },

    // Central District
    central_plaza: {
        id: 'central_plaza',
        name: 'Central Plaza',
        description: 'The bustling heart of New Port City. Merchants hawk their wares while nobles pass by in carriages.',
        type: 'exterior',
        district: 'central',
        connections: ['city_watch_barracks', 'marketplace', 'noble_quarter', 'docks', 'palm_cove'],
        background: 'plaza'
    },
    marketplace: {
        id: 'marketplace',
        name: 'The Marketplace',
        description: 'A maze of stalls and shops. You can find almost anything here—for the right price.',
        type: 'exterior',
        district: 'central',
        connections: ['central_plaza', 'blacksmith', 'alchemist_guild', 'the_salty_anchor'],
        background: 'marketplace'
    },

    // Shops and Services
    blacksmith: {
        id: 'blacksmith',
        name: "Forge & Anvil",
        description: "The rhythmic clang of hammer on steel. Master BLACKSMITH Korran shapes metal into art.",
        type: 'interior',
        district: 'central',
        connections: ['marketplace'],
        background: 'blacksmith',
        npc: 'korran'
    },
    alchemist_guild: {
        id: 'alchemist_guild',
        name: 'Alchemist Guild',
        description: 'Strange vapors and stranger people. The Guild keeps many secrets.',
        type: 'interior',
        district: 'central',
        connections: ['marketplace'],
        background: 'alchemist',
        npc: 'guildmaster_mora'
    },

    // Taverns and Entertainment
    the_salty_anchor: {
        id: 'the_salty_anchor',
        name: 'The Salty Anchor',
        description: 'Where sailors, merchants, and those seeking to forget their troubles gather.',
        type: 'interior',
        district: 'central',
        connections: ['marketplace', 'docks'],
        background: 'tavern',
        npc: 'innkeeper_bess'
    },
    velvet_shell: {
        id: 'velvet_shell',
        name: 'The Velvet Shell',
        description: 'A house of pleasure near the docks. MADAM Coral runs a tight ship.',
        type: 'interior',
        district: 'docks',
        connections: ['docks'],
        background: 'brothel',
        npc: 'madam_coral'
    },

    // Coastal Areas
    docks: {
        id: 'docks',
        name: 'The Docks',
        description: 'Salt air and the creak of ships. The lifeblood of New Port City flows through here.',
        type: 'exterior',
        district: 'docks',
        connections: ['central_plaza', 'the_salty_anchor', 'velvet_shell', 'stingray_oceanfront', 'fishmarket'],
        background: 'docks'
    },
    fishmarket: {
        id: 'fishmarket',
        name: 'Fish Market',
        description: 'The catch of the day displayed on ice. FISHERMEN barter with merchants.',
        type: 'exterior',
        district: 'docks',
        connections: ['docks'],
        background: 'fishmarket'
    },
    stingray_oceanfront: {
        id: 'stingray_oceanfront',
        name: 'Stingray Oceanfront',
        description: 'A stretch of beach where the common folk come to swim and fish.',
        type: 'exterior',
        district: 'coast',
        connections: ['docks', 'manta_beach'],
        background: 'beach'
    },
    manta_beach: {
        id: 'manta_beach',
        name: 'Manta Beach',
        description: 'Named for the great rays that sometimes glide through the shallows.',
        type: 'exterior',
        district: 'coast',
        connections: ['stingray_oceanfront', 'sharktooth_coast'],
        background: 'beach'
    },
    sharktooth_coast: {
        id: 'sharktooth_coast',
        name: 'Sharktooth Coast',
        description: 'Rocky outcroppings jut from the sand like the teeth of a great beast.',
        type: 'exterior',
        district: 'coast',
        connections: ['manta_beach', 'vast_edge'],
        background: 'rocky_beach'
    },
    vast_edge: {
        id: 'vast_edge',
        name: 'The Vast Edge',
        description: 'Where the island ends and the endless ocean begins. Few come here.',
        type: 'exterior',
        district: 'coast',
        connections: ['sharktooth_coast', 'old_port_ruins'],
        background: 'cliffs'
    },
    palm_cove: {
        id: 'palm_cove',
        name: 'Palm Cove',
        description: 'A secluded beach surrounded by palm trees. The nobility sometimes picnic here.',
        type: 'exterior',
        district: 'coast',
        connections: ['central_plaza', 'reflecting_sands'],
        background: 'palm_beach'
    },
    reflecting_sands: {
        id: 'reflecting_sands',
        name: 'Reflecting Sands',
        description: 'At sunset, the wet sand mirrors the sky like a sheet of bronze.',
        type: 'exterior',
        district: 'coast',
        connections: ['palm_cove', 'golden_strand'],
        background: 'beach_sunset'
    },
    golden_strand: {
        id: 'golden_strand',
        name: 'The Golden Sands Strand',
        description: 'The finest beach in New Port City. Only the wealthy venture here.',
        type: 'exterior',
        district: 'coast',
        connections: ['reflecting_sands', 'noble_quarter'],
        background: 'luxury_beach'
    },

    // Noble Quarter
    noble_quarter: {
        id: 'noble_quarter',
        name: 'Noble Quarter',
        description: 'Mansions and manicured gardens. The air smells of perfume and coin.',
        type: 'exterior',
        district: 'noble',
        connections: ['central_plaza', 'golden_strand', 'royal_palace'],
        background: 'noble_district'
    },
    royal_palace: {
        id: 'royal_palace',
        name: 'Royal Palace',
        description: 'The seat of power in New Port City. QUEEN Thessaly rules from within.',
        type: 'interior',
        district: 'noble',
        connections: ['noble_quarter'],
        background: 'palace',
        restricted: true
    },

    // Mysterious Locations
    old_port_ruins: {
        id: 'old_port_ruins',
        name: 'Old Port Ruins',
        description: 'The remnants of the original city, destroyed by the sea monster centuries ago. Haunted, they say.',
        type: 'exterior',
        district: 'ruins',
        connections: ['vast_edge'],
        background: 'ruins',
        special: true
    },
    sea_monster_shrine: {
        id: 'sea_monster_shrine',
        name: 'Shrine of the Deep',
        description: 'Hidden in the ruins, where the faithful worship the great beast beneath the waves.',
        type: 'interior',
        district: 'ruins',
        connections: ['old_port_ruins'],
        background: 'shrine',
        secret: true
    }
};

/**
 * District information
 */
export const districts = {
    central: {
        name: 'Central District',
        description: 'The administrative and commercial heart of New Port City.'
    },
    docks: {
        name: 'Docks District',
        description: 'Where ships come and go, and fortunes are made and lost.'
    },
    coast: {
        name: 'Coastal Areas',
        description: 'The beaches and shores that give New Port City its character.'
    },
    noble: {
        name: 'Noble Quarter',
        description: 'Where the wealthy and powerful reside.'
    },
    ruins: {
        name: 'Old Port Ruins',
        description: 'The haunted remains of what came before.'
    }
};
