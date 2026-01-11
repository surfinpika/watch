/**
 * Quest Definitions
 * All quests in New Port City
 *
 * Quest structure follows Yakuza-style:
 * - Starts with an NPC interaction or event
 * - Has a dramatic title reveal
 * - Multiple objectives
 * - Meaningful rewards
 */

export const quests = {
    // ============================================
    // CHAPTER 1: ROOKIE DAYS
    // ============================================

    first_patrol: {
        id: 'first_patrol',
        title: 'First Steps',
        chapter: 'Chapter 1',
        description: 'Report to SERGEANT Thorne in the Central Plaza for your first patrol.',
        triggerNPC: null, // Triggered automatically
        objectives: [
            {
                description: 'Find SERGEANT Thorne in the Central Plaza',
                talkTo: 'thorne',
                checkComplete: (progress) => progress['talkedTo_thorne']
            },
            {
                description: 'Complete patrol of the Marketplace',
                visitLocations: ['marketplace'],
                checkComplete: (progress) => progress['visited_marketplace']
            },
            {
                description: 'Return to the Barracks',
                visitLocations: ['city_watch_barracks'],
                checkComplete: (progress) => progress['visited_city_watch_barracks']
            }
        ],
        npcDialogue: {
            thorne: {
                objective_0: [
                    {
                        speaker: 'SERGEANT Thorne',
                        text: "So you're the new RECRUIT. COMMANDER Aldric said to expect you.",
                        portrait: 'thorne'
                    },
                    {
                        speaker: 'SERGEANT Thorne',
                        text: "First lesson: the streets of New Port City are more dangerous than they look.",
                        portrait: 'thorne'
                    },
                    {
                        speaker: 'SERGEANT Thorne',
                        text: "Your patrol route is simple. Walk through the Marketplace, keep your eyes open, then return to the Barracks.",
                        portrait: 'thorne'
                    },
                    {
                        speaker: 'SERGEANT Thorne',
                        text: "Don't engage any criminals alone. If you see trouble, observe and report. Understood?",
                        portrait: 'thorne'
                    }
                ]
            }
        },
        rewards: {
            experience: 50
        },
        nextQuest: 'a_smiths_dilemma'
    },

    // ============================================
    // THE BLACKSMITH CASE
    // ============================================

    a_smiths_dilemma: {
        id: 'a_smiths_dilemma',
        title: "A Smith's Dilemma",
        chapter: 'Chapter 1',
        description: 'BLACKSMITH Korran has requested the City Watch\'s help with a delicate matter.',
        triggerNPC: 'korran',
        requires: ['first_patrol'],
        objectives: [
            {
                description: 'Speak with BLACKSMITH Korran',
                talkTo: 'korran',
                checkComplete: (progress) => progress['talkedTo_korran']
            },
            {
                description: 'Investigate the stolen steel',
                talkTo: 'merchant_silva',
                checkComplete: (progress) => progress['talkedTo_merchant_silva']
            },
            {
                description: 'Search the Docks for the stolen goods',
                visitLocations: ['docks'],
                examineEvidence: true,
                checkComplete: (progress) => progress['found_stolen_steel']
            },
            {
                description: 'Confront the thief',
                special: 'confrontation',
                checkComplete: (progress) => progress['thief_confronted']
            },
            {
                description: 'Return to BLACKSMITH Korran with the news',
                talkTo: 'korran',
                checkComplete: (progress) => progress['quest_complete']
            }
        ],
        npcDialogue: {
            korran: {
                objective_0: [
                    {
                        speaker: 'BLACKSMITH Korran',
                        text: "You! RECRUIT! Come here.",
                        portrait: 'korran'
                    },
                    {
                        speaker: 'BLACKSMITH Korran',
                        text: "Someone's been stealing my finest Valyrian steel. Three shipments gone in the last month.",
                        portrait: 'korran'
                    },
                    {
                        speaker: 'Narrator',
                        text: "He slams his fist on the anvil, sending sparks flying.",
                        portrait: 'narrator'
                    },
                    {
                        speaker: 'BLACKSMITH Korran',
                        text: "That steel is worth more than your life, RECRUIT. I want it found!",
                        portrait: 'korran'
                    },
                    {
                        speaker: 'BLACKSMITH Korran',
                        text: "Talk to the MERCHANT Silva in the Marketplace. He handles my shipping. Something's not right about that man.",
                        portrait: 'korran'
                    }
                ],
                objective_4: [
                    {
                        speaker: 'BLACKSMITH Korran',
                        text: "Well? Did you find my steel?",
                        portrait: 'korran'
                    }
                ]
            },
            merchant_silva: {
                objective_1: [
                    {
                        speaker: 'MERCHANT Silva',
                        text: "Ah, the City Watch! What brings you to my humble stall?",
                        portrait: 'silva'
                    },
                    {
                        speaker: 'You',
                        text: "BLACKSMITH Korran's steel shipments. They've been disappearing.",
                        portrait: 'default'
                    },
                    {
                        speaker: 'MERCHANT Silva',
                        text: "Disappearing? How terrible! I assure you, the goods leave my hands in perfect condition.",
                        portrait: 'silva'
                    },
                    {
                        speaker: 'Narrator',
                        text: "His eyes dart to the left. He's nervous about something.",
                        portrait: 'narrator'
                    },
                    {
                        speaker: 'MERCHANT Silva',
                        text: "Perhaps you should check the Docks? I've heard... rumors. Warehouse 7. But you didn't hear that from me.",
                        portrait: 'silva'
                    }
                ]
            }
        },
        rewards: {
            experience: 100,
            evidence: [
                {
                    id: 'stolen_steel_manifest',
                    name: 'Shipping Manifest',
                    description: 'A forged shipping manifest for the stolen Valyrian steel.'
                }
            ]
        },
        nextQuest: 'whispers_in_the_velvet'
    },

    // ============================================
    // THE BROTHEL CASE
    // ============================================

    whispers_in_the_velvet: {
        id: 'whispers_in_the_velvet',
        title: 'Whispers in the Velvet',
        chapter: 'Chapter 2',
        description: 'MADAM Coral has information about a series of disappearances near the Docks.',
        triggerNPC: 'madam_coral',
        requires: ['a_smiths_dilemma'],
        objectives: [
            {
                description: 'Visit The Velvet Shell and speak with MADAM Coral',
                talkTo: 'madam_coral',
                checkComplete: (progress) => progress['talkedTo_madam_coral']
            },
            {
                description: 'Investigate the missing WHORE\'s last known location',
                visitLocations: ['docks'],
                checkComplete: (progress) => progress['investigated_docks']
            },
            {
                description: 'Question FISHERMAN Pike about strange activity',
                talkTo: 'fisherman_pike',
                checkComplete: (progress) => progress['talkedTo_fisherman_pike']
            },
            {
                description: 'Search the abandoned warehouse',
                special: 'warehouse_search',
                checkComplete: (progress) => progress['warehouse_searched']
            },
            {
                description: 'Report findings to MADAM Coral',
                talkTo: 'madam_coral',
                checkComplete: (progress) => progress['quest_complete']
            }
        ],
        npcDialogue: {
            madam_coral: {
                objective_0: [
                    {
                        speaker: 'MADAM Coral',
                        text: "RECRUIT. I was wondering when the Watch would come sniffing around.",
                        portrait: 'madam_coral'
                    },
                    {
                        speaker: 'MADAM Coral',
                        text: "One of my girls is missing. Lila. Vanished three nights ago.",
                        portrait: 'madam_coral'
                    },
                    {
                        speaker: 'MADAM Coral',
                        text: "She's not the first. There have been others. WHORES, dockworkers, the forgotten people.",
                        portrait: 'madam_coral'
                    },
                    {
                        speaker: 'MADAM Coral',
                        text: "The Watch doesn't care about us, I know. But you... you have honest eyes. Will you look?",
                        portrait: 'madam_coral'
                    }
                ]
            },
            fisherman_pike: {
                objective_2: [
                    {
                        speaker: 'FISHERMAN Pike',
                        text: "Strange happenings, you say? Aye, I've seen things.",
                        portrait: 'pike'
                    },
                    {
                        speaker: 'FISHERMAN Pike',
                        text: "Lights in Warehouse 12. At night, when no one should be there.",
                        portrait: 'pike'
                    },
                    {
                        speaker: 'FISHERMAN Pike',
                        text: "And the smell... like copper and salt. Blood and sea, mixed together.",
                        portrait: 'pike'
                    },
                    {
                        speaker: 'FISHERMAN Pike',
                        text: "The Deep One stirs when blood is spilled, RECRUIT. Be careful what you uncover.",
                        portrait: 'pike'
                    }
                ]
            }
        },
        rewards: {
            experience: 150,
            evidence: [
                {
                    id: 'lila_necklace',
                    name: "Lila's Necklace",
                    description: 'A simple shell necklace belonging to the missing woman.',
                    fullDescription: 'A necklace made of small shells. The clasp is broken, as if it was torn off.'
                }
            ]
        },
        nextQuest: 'the_forgotten_ones'
    },

    // ============================================
    // THE SERIAL KILLER CASE
    // ============================================

    the_forgotten_ones: {
        id: 'the_forgotten_ones',
        title: 'The Forgotten Ones',
        chapter: 'Chapter 3',
        description: 'A woman claims her husband was murdered, but no one remembers he ever existed.',
        triggerNPC: 'grieving_wife',
        requires: ['whispers_in_the_velvet'],
        objectives: [
            {
                description: 'Speak with the grieving widow',
                special: 'widow_dialogue',
                checkComplete: (progress) => progress['widow_interviewed']
            },
            {
                description: 'Examine the photograph evidence',
                examineEvidence: 'family_photograph',
                checkComplete: (progress) => progress['photo_examined']
            },
            {
                description: 'Visit the Alchemist Guild about memory-altering substances',
                talkTo: 'guildmaster_mora',
                checkComplete: (progress) => progress['talkedTo_guildmaster_mora']
            },
            {
                description: 'Search for other victims',
                special: 'victim_investigation',
                checkComplete: (progress) => progress['victims_found']
            },
            {
                description: 'Identify the pattern',
                special: 'deduction',
                checkComplete: (progress) => progress['pattern_identified']
            }
        ],
        npcDialogue: {
            guildmaster_mora: {
                objective_2: [
                    {
                        speaker: 'ALCHEMIST Mora',
                        text: "Memory, you say? A dangerous thing to tamper with.",
                        portrait: 'mora'
                    },
                    {
                        speaker: 'ALCHEMIST Mora',
                        text: "There are potions that can make someone forget... and darker arts that can make *everyone* forget.",
                        portrait: 'mora'
                    },
                    {
                        speaker: 'ALCHEMIST Mora',
                        text: "The Draught of Lethe. Forbidden. The recipe was destroyed centuries ago.",
                        portrait: 'mora'
                    },
                    {
                        speaker: 'ALCHEMIST Mora',
                        text: "At least... it was supposed to be.",
                        portrait: 'mora'
                    },
                    {
                        speaker: 'Narrator',
                        text: "She hands you a vial of shimmering silver liquid.",
                        portrait: 'narrator'
                    },
                    {
                        speaker: 'ALCHEMIST Mora',
                        text: "An antidote. If you find someone affected, this may restore their memories. But be warned... some truths are better left forgotten.",
                        portrait: 'mora'
                    }
                ]
            }
        },
        rewards: {
            experience: 200,
            evidence: [
                {
                    id: 'lethe_antidote',
                    name: 'Lethe Antidote',
                    description: 'A shimmering silver potion that may restore lost memories.',
                    fullDescription: 'Given to you by ALCHEMIST Mora. It swirls like liquid starlight.'
                }
            ],
            rankUp: false
        },
        nextQuest: 'shadows_in_the_deep'
    },

    // ============================================
    // THE SEA MONSTER CULT
    // ============================================

    shadows_in_the_deep: {
        id: 'shadows_in_the_deep',
        title: 'Shadows in the Deep',
        chapter: 'Chapter 4',
        description: 'The disappearances are connected to something ancient. Something hungry.',
        triggerNPC: 'hooded_figure',
        requires: ['the_forgotten_ones'],
        objectives: [
            {
                description: 'Find the Sea Monster Shrine in the Old Port Ruins',
                visitLocations: ['old_port_ruins', 'sea_monster_shrine'],
                checkComplete: (progress) => progress['shrine_found']
            },
            {
                description: 'Observe the cult ritual',
                special: 'cult_ritual',
                checkComplete: (progress) => progress['ritual_observed']
            },
            {
                description: 'Discover the cult leader\'s identity',
                special: 'identity_reveal',
                checkComplete: (progress) => progress['leader_identified']
            },
            {
                description: 'Find PRINCESS Lyanna',
                talkTo: 'princess_lyanna',
                checkComplete: (progress) => progress['talkedTo_princess_lyanna']
            }
        ],
        npcDialogue: {
            princess_lyanna: {
                objective_3: [
                    {
                        speaker: 'PRINCESS Lyanna',
                        text: "You found me. I knew someone would, eventually.",
                        portrait: 'princess_lyanna'
                    },
                    {
                        speaker: 'PRINCESS Lyanna',
                        text: "The cult... they're not evil. Misguided, perhaps. They believe the sacrifices will summon the Deep One.",
                        portrait: 'princess_lyanna'
                    },
                    {
                        speaker: 'PRINCESS Lyanna',
                        text: "But they're wrong. The beast doesn't want blood. It wants... something else.",
                        portrait: 'princess_lyanna'
                    },
                    {
                        speaker: 'PRINCESS Lyanna',
                        text: "I've been trying to find out what. Playing my harp in the ruins, night after night.",
                        portrait: 'princess_lyanna'
                    },
                    {
                        speaker: 'PRINCESS Lyanna',
                        text: "Will you help me, RECRUIT? Will you help me discover the truth?",
                        portrait: 'princess_lyanna'
                    }
                ]
            }
        },
        rewards: {
            experience: 250,
            rankUp: true
        }
    },

    // ============================================
    // THE CANNIBALISM CASE (Dark side quest)
    // ============================================

    a_matter_of_taste: {
        id: 'a_matter_of_taste',
        title: 'A Matter of Taste',
        chapter: 'Side Quest',
        description: 'Reports of strange meat being sold in the marketplace. The smell is wrong.',
        triggerNPC: 'innkeeper_bess',
        requires: ['whispers_in_the_velvet'],
        objectives: [
            {
                description: 'Investigate the mystery meat vendor',
                visitLocations: ['marketplace'],
                checkComplete: (progress) => progress['vendor_investigated']
            },
            {
                description: 'Follow the supply chain',
                special: 'trail_following',
                checkComplete: (progress) => progress['trail_complete']
            },
            {
                description: 'Confront the truth',
                special: 'confrontation',
                checkComplete: (progress) => progress['truth_revealed']
            }
        ],
        npcDialogue: {
            innkeeper_bess: {
                objective_0: [
                    {
                        speaker: 'INNKEEPER Bess',
                        text: "RECRUIT! Thank the gods you're here. I need to tell someone...",
                        portrait: 'bess'
                    },
                    {
                        speaker: 'INNKEEPER Bess',
                        text: "There's a new meat vendor in the marketplace. His prices are too good.",
                        portrait: 'bess'
                    },
                    {
                        speaker: 'INNKEEPER Bess',
                        text: "And the meat... it doesn't smell right. My customers have been asking for it by name, but...",
                        portrait: 'bess'
                    },
                    {
                        speaker: 'Narrator',
                        text: "She lowers her voice to a whisper.",
                        portrait: 'narrator'
                    },
                    {
                        speaker: 'INNKEEPER Bess',
                        text: "I've been a cook for thirty years, RECRUIT. I know what pig tastes like. That ain't pig.",
                        portrait: 'bess'
                    }
                ]
            }
        },
        rewards: {
            experience: 175,
            evidence: [
                {
                    id: 'mystery_meat',
                    name: 'Mystery Meat Sample',
                    description: 'A sample of the suspicious meat. Best not to think about what it might be.',
                    fullDescription: 'Upon closer inspection, there are... concerning anatomical features.'
                }
            ]
        }
    }
};

/**
 * Get all available quests for a player
 */
export function getAvailableQuests(completedQuests) {
    const completed = new Set(completedQuests.map(q => q.id));

    return Object.values(quests).filter(quest => {
        // Not already completed
        if (completed.has(quest.id)) return false;

        // Check prerequisites
        if (quest.requires) {
            return quest.requires.every(reqId => completed.has(reqId));
        }

        return true;
    });
}
