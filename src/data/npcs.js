/**
 * NPC Definitions
 * Characters of New Port City
 *
 * Title/Occupation formatting:
 * - Titles in CAPS get colored based on category
 * - royal: QUEEN, KING, PRINCE, PRINCESS
 * - noble: LORD, LADY, DUKE, DUCHESS
 * - knight: SIR, DAME, KNIGHT
 * - guard: COMMANDER, CAPTAIN, SERGEANT, WATCHMAN
 * - common: BLACKSMITH, MERCHANT, etc.
 */

export const npcs = {
    // ============================================
    // CITY WATCH
    // ============================================

    aldric: {
        id: 'aldric',
        name: 'COMMANDER Aldric',
        fullName: 'Aldric of Stonehaven',
        title: 'COMMANDER',
        occupation: 'Commander of the City Watch',
        location: 'city_watch_barracks',
        defaultX: 640,
        defaultY: 280,
        color: '#9b59b6',
        portrait: 'aldric',
        description: 'A stern man with grey-streaked hair and a scar across his left cheek. He has led the City Watch for fifteen years.',
        personality: 'Harsh but fair. Values discipline above all. Secretly respects those who show courage.',
        defaultLine: "Don't you have work to do, RECRUIT?",
        dialogue: [
            {
                speaker: 'COMMANDER Aldric',
                text: "The streets won't patrol themselves. Get moving.",
                portrait: 'aldric'
            }
        ]
    },

    thorne: {
        id: 'thorne',
        name: 'SERGEANT Thorne',
        fullName: 'Mira Thorne',
        title: 'SERGEANT',
        occupation: 'Patrol Sergeant',
        location: 'central_plaza',
        defaultX: 500,
        defaultY: 350,
        color: '#c9a227',
        portrait: 'thorne',
        description: 'A no-nonsense woman in her thirties. Her armor is always spotless.',
        personality: 'Professional and efficient. Has a dry sense of humor.',
        defaultLine: "Ah, the new RECRUIT. Try not to get killed on your first day.",
        dialogue: [
            {
                speaker: 'SERGEANT Thorne',
                text: "Keep your eyes open and your mouth shut. That's how you survive in this city.",
                portrait: 'thorne'
            }
        ]
    },

    // ============================================
    // TRADESPEOPLE
    // ============================================

    korran: {
        id: 'korran',
        name: 'BLACKSMITH Korran',
        fullName: 'Korran the Smith',
        title: 'BLACKSMITH',
        occupation: 'Master Blacksmith',
        location: 'blacksmith',
        defaultX: 400,
        defaultY: 300,
        color: '#e67e22',
        portrait: 'korran',
        description: 'Massive arms covered in old burn scars. His forge has been in the family for generations.',
        personality: 'Gruff exterior, kind heart. Loves to talk about metallurgy.',
        defaultLine: "Need something forged? Or just wasting my time?",
        dialogue: [
            {
                speaker: 'BLACKSMITH Korran',
                text: "This steel won't shape itself. Make it quick.",
                portrait: 'korran'
            }
        ],
        questRelated: 'blacksmith_mystery'
    },

    guildmaster_mora: {
        id: 'guildmaster_mora',
        name: 'ALCHEMIST Mora',
        fullName: 'Guildmaster Morvenna',
        title: 'ALCHEMIST',
        occupation: 'Guildmaster of Alchemists',
        location: 'alchemist_guild',
        defaultX: 600,
        defaultY: 320,
        color: '#27ae60',
        portrait: 'mora',
        description: 'An elderly woman with sharp eyes that miss nothing. Her robes are stained with a hundred different substances.',
        personality: 'Cryptic and mysterious. Speaks in riddles. Knows more than she reveals.',
        defaultLine: "Seeking potions, RECRUIT? Or perhaps... answers?",
        dialogue: [
            {
                speaker: 'ALCHEMIST Mora',
                text: "The Guild keeps many secrets. Some are for sale. Most are not.",
                portrait: 'mora'
            }
        ],
        questRelated: 'alchemist_guild_quest'
    },

    // ============================================
    // TAVERN & BROTHEL
    // ============================================

    innkeeper_bess: {
        id: 'innkeeper_bess',
        name: 'INNKEEPER Bess',
        fullName: 'Bessandra',
        title: 'INNKEEPER',
        occupation: 'Owner of The Salty Anchor',
        location: 'the_salty_anchor',
        defaultX: 350,
        defaultY: 300,
        color: '#d4a574',
        portrait: 'bess',
        description: 'A plump, cheerful woman with a booming laugh. She knows everyone and everything that happens in the city.',
        personality: 'Warm and gossipy. Excellent source of information if you buy enough drinks.',
        defaultLine: "Welcome to The Salty Anchor! What'll it be?",
        dialogue: [
            {
                speaker: 'INNKEEPER Bess',
                text: "Sit yourself down, love. You look like you could use a drink... and maybe some gossip?",
                portrait: 'bess'
            }
        ]
    },

    madam_coral: {
        id: 'madam_coral',
        name: 'MADAM Coral',
        fullName: 'Coral of the Velvet Shell',
        title: 'MADAM',
        occupation: 'Proprietor of The Velvet Shell',
        location: 'velvet_shell',
        defaultX: 500,
        defaultY: 320,
        color: '#e07a5f',
        portrait: 'madam_coral',
        description: 'An elegant woman of indeterminate age. Her smile never reaches her eyes.',
        personality: 'Shrewd businesswoman. Protects her workers fiercely. Has connections everywhere.',
        defaultLine: "The City Watch, in my establishment? This must be... official business.",
        dialogue: [
            {
                speaker: 'MADAM Coral',
                text: "Everyone who walks through those doors has secrets, RECRUIT. The question is... what are yours?",
                portrait: 'madam_coral'
            }
        ],
        questRelated: 'brothel_quest'
    },

    // ============================================
    // ROYALTY & NOBILITY
    // ============================================

    queen_thessaly: {
        id: 'queen_thessaly',
        name: 'QUEEN Thessaly',
        fullName: 'Her Majesty Queen Thessaly III',
        title: 'QUEEN',
        occupation: 'Ruler of New Port City',
        location: 'royal_palace',
        defaultX: 640,
        defaultY: 280,
        color: '#9b59b6',
        portrait: 'queen',
        description: 'A regal woman in her fifties. Silver hair, sharp mind, and sharper tongue.',
        personality: 'Political mastermind. Appears cold but cares deeply for her city and daughter.',
        defaultLine: "The City Watch. Approach, if you have news worthy of our attention.",
        dialogue: [
            {
                speaker: 'QUEEN Thessaly',
                text: "Every shadow in this palace has ears, and every ear has a price. Remember that.",
                portrait: 'queen'
            }
        ],
        restricted: true
    },

    princess_lyanna: {
        id: 'princess_lyanna',
        name: 'PRINCESS Lyanna',
        fullName: 'Her Royal Highness Princess Lyanna',
        title: 'PRINCESS',
        occupation: 'Heir to the Throne',
        location: 'old_port_ruins',
        defaultX: 640,
        defaultY: 350,
        color: '#3498db',
        portrait: 'princess_lyanna',
        description: 'A young woman with wild hair and sad eyes. She carries a harp wherever she goes.',
        personality: 'Melancholic and dreamy. Believes in the old stories. Feels trapped by her destiny.',
        defaultLine: "Have you come to take me back? The sea has not answered yet...",
        dialogue: [
            {
                speaker: 'PRINCESS Lyanna',
                text: "They say only the worthy can call the beast from the deep. Every night, I play my harp and wait.",
                portrait: 'princess_lyanna'
            },
            {
                speaker: 'PRINCESS Lyanna',
                text: "Perhaps I am not worthy. Perhaps I never will be. But I must try.",
                portrait: 'princess_lyanna'
            }
        ],
        questRelated: 'sea_monster_quest'
    },

    lord_harren: {
        id: 'lord_harren',
        name: 'LORD Harren',
        fullName: 'Lord Harren of Cliffside',
        title: 'LORD',
        occupation: 'Noble Merchant',
        location: 'noble_quarter',
        defaultX: 700,
        defaultY: 340,
        color: '#3498db',
        portrait: 'harren',
        description: 'A portly man with too many rings and not enough conscience.',
        personality: 'Greedy and paranoid. Sees conspiracies everywhere.',
        defaultLine: "A WATCHMAN? Has something happened? Is someone after me?",
        dialogue: [
            {
                speaker: 'LORD Harren',
                text: "The streets are not safe. Criminals everywhere. What is the Watch even doing?",
                portrait: 'harren'
            }
        ]
    },

    // ============================================
    // COMMON FOLK
    // ============================================

    fisherman_pike: {
        id: 'fisherman_pike',
        name: 'FISHERMAN Pike',
        fullName: 'Old Pike',
        title: 'FISHERMAN',
        occupation: 'Fisherman',
        location: 'docks',
        defaultX: 300,
        defaultY: 380,
        color: '#2d8fb3',
        portrait: 'pike',
        description: 'Weather-beaten face, salt-crusted clothes. Has been fishing these waters for fifty years.',
        personality: 'Superstitious and full of stories. Believes firmly in the sea monster.',
        defaultLine: "The sea's angry today. Best stay on land, RECRUIT.",
        dialogue: [
            {
                speaker: 'FISHERMAN Pike',
                text: "I've seen it, you know. The beast. Just once, when I was young. Changed me forever.",
                portrait: 'pike'
            }
        ]
    },

    merchant_silva: {
        id: 'merchant_silva',
        name: 'MERCHANT Silva',
        fullName: 'Silva the Trader',
        title: 'MERCHANT',
        occupation: 'Traveling Merchant',
        location: 'marketplace',
        defaultX: 450,
        defaultY: 320,
        color: '#c9a227',
        portrait: 'silva',
        description: 'Quick eyes and quicker hands. Sells everything from spices to "authentic" artifacts.',
        personality: 'Charming and slippery. Hard to pin down, harder to trust.',
        defaultLine: "Finest goods in New Port City! What catches your eye, friend?",
        dialogue: [
            {
                speaker: 'MERCHANT Silva',
                text: "Looking for something special? I might know someone who knows someone...",
                portrait: 'silva'
            }
        ]
    },

    // ============================================
    // MYSTERIOUS FIGURES
    // ============================================

    hooded_figure: {
        id: 'hooded_figure',
        name: '???',
        fullName: 'Unknown',
        title: '',
        occupation: 'Unknown',
        location: 'sea_monster_shrine',
        defaultX: 640,
        defaultY: 300,
        color: '#1a1a24',
        portrait: 'hooded',
        description: 'A figure in dark robes. Their face is hidden. They smell of salt and something older.',
        personality: 'Speaks in whispers about the Deep One.',
        defaultLine: "The tide brings all things to the shore... eventually.",
        dialogue: [
            {
                speaker: '???',
                text: "You should not be here. The uninitiated are not welcome in the presence of the Deep One.",
                portrait: 'hooded'
            }
        ],
        questRelated: 'sea_monster_cult'
    },

    cult_leader: {
        id: 'cult_leader',
        name: 'PRIEST of the Deep',
        fullName: 'The Voice of the Depths',
        title: 'PRIEST',
        occupation: 'Leader of the Sea Monster Cult',
        location: 'sea_monster_shrine',
        defaultX: 640,
        defaultY: 250,
        color: '#0d3b4c',
        portrait: 'cult_leader',
        description: 'Robes covered in barnacles and shells. Eyes that seem to reflect the ocean.',
        personality: 'Fanatical devotion to the sea monster. Believes the end times are coming.',
        defaultLine: "The Deep One stirs. Can you not feel it in your bones?",
        dialogue: [
            {
                speaker: 'PRIEST of the Deep',
                text: "The beast is older than this city. Older than the island itself. It will outlast us all.",
                portrait: 'cult_leader'
            }
        ],
        questRelated: 'sea_monster_cult'
    },

    // ============================================
    // CRIMINALS & SUSPECTS
    // ============================================

    the_shadow: {
        id: 'the_shadow',
        name: '???',
        fullName: 'The Shadow',
        title: '',
        occupation: 'Serial Killer',
        location: null, // Appears in various locations during quests
        color: '#1a1a24',
        portrait: 'shadow',
        description: 'No one has seen their face and lived to tell of it.',
        personality: 'Patient. Methodical. Enjoys the hunt.',
        dialogue: null,
        questRelated: 'serial_killer_quest'
    }
};

/**
 * Get NPC by location
 */
export function getNPCsByLocation(locationId) {
    return Object.values(npcs).filter(npc => npc.location === locationId);
}

/**
 * Get NPC by ID
 */
export function getNPC(npcId) {
    return npcs[npcId];
}
