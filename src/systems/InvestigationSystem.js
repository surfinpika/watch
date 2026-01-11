/**
 * Investigation System
 * Ace Attorney-style evidence collection and examination
 */

export class InvestigationSystem {
    constructor(game) {
        this.game = game;

        // Investigation mode state
        this.isInvestigating = false;
        this.currentLocation = null;

        // Hotspots - clickable areas in a scene
        this.hotspots = [];

        // Currently selected evidence for presenting
        this.selectedEvidence = null;

        // Investigation cursor position
        this.cursor = { x: 0, y: 0 };

        // Examined items in current scene
        this.examinedItems = new Set();
    }

    /**
     * Start investigation mode in a location
     */
    startInvestigation(location) {
        this.isInvestigating = true;
        this.currentLocation = location;
        this.examinedItems.clear();

        // Load hotspots for this location
        this.loadHotspots(location);

        console.log(`Investigation started: ${location.name}`);
    }

    /**
     * End investigation mode
     */
    endInvestigation() {
        this.isInvestigating = false;
        this.currentLocation = null;
        this.hotspots = [];
    }

    /**
     * Load hotspots for a location
     */
    loadHotspots(location) {
        // Define hotspots based on location
        const locationHotspots = investigationHotspots[location.id];

        if (locationHotspots) {
            this.hotspots = locationHotspots.map(h => ({
                ...h,
                examined: false
            }));
        } else {
            this.hotspots = [];
        }
    }

    /**
     * Update investigation mode
     */
    update(deltaTime, input) {
        if (!this.isInvestigating) return;

        // Update cursor position
        const mousePos = input.getMousePosition();
        this.cursor.x = mousePos.x;
        this.cursor.y = mousePos.y;

        // Check for hotspot clicks
        if (input.isLeftMousePressed()) {
            this.checkHotspotClick(this.cursor.x, this.cursor.y);
        }

        // Right click to exit investigation
        if (input.isRightMousePressed()) {
            this.endInvestigation();
        }
    }

    /**
     * Check if a hotspot was clicked
     */
    checkHotspotClick(x, y) {
        for (const hotspot of this.hotspots) {
            if (this.isPointInHotspot(x, y, hotspot)) {
                this.examineHotspot(hotspot);
                return;
            }
        }

        // No hotspot clicked - show generic "nothing here" message
        this.showExamineText("Nothing of interest here.");
    }

    /**
     * Check if a point is inside a hotspot
     */
    isPointInHotspot(x, y, hotspot) {
        return x >= hotspot.x &&
            x <= hotspot.x + hotspot.width &&
            y >= hotspot.y &&
            y <= hotspot.y + hotspot.height;
    }

    /**
     * Examine a hotspot
     */
    examineHotspot(hotspot) {
        // Mark as examined
        hotspot.examined = true;
        this.examinedItems.add(hotspot.id);

        // Show examination text
        const dialogue = [{
            speaker: 'You',
            text: hotspot.examineText,
            portrait: 'default'
        }];

        // Add discovery text if there's evidence
        if (hotspot.evidence && !this.game.player.getEvidence(hotspot.evidence.id)) {
            dialogue.push({
                speaker: 'Narrator',
                text: `You found: ${hotspot.evidence.name}`,
                portrait: 'narrator'
            });

            // Add evidence to player
            this.game.player.addEvidence(hotspot.evidence);
            this.game.ui.showEvidenceCollected(hotspot.evidence);
        }

        this.game.dialogue.startDialogue(dialogue);
    }

    /**
     * Show examination text
     */
    showExamineText(text) {
        const dialogue = [{
            speaker: 'You',
            text: text,
            portrait: 'default'
        }];

        this.game.dialogue.startDialogue(dialogue);
    }

    /**
     * Select evidence for presenting
     */
    selectEvidence(evidenceId) {
        const evidence = this.game.player.getEvidence(evidenceId);
        if (evidence) {
            this.selectedEvidence = evidence;
            console.log(`Selected evidence: ${evidence.name}`);
        }
    }

    /**
     * Present evidence to an NPC
     */
    presentEvidence(npcId) {
        if (!this.selectedEvidence) {
            console.log('No evidence selected');
            return;
        }

        // Check if this evidence triggers a response
        const response = this.getEvidenceResponse(npcId, this.selectedEvidence.id);

        if (response) {
            this.game.dialogue.startDialogue(response.dialogue, () => {
                if (response.advancesQuest) {
                    // Update quest progress
                    this.game.quests.updateObjective(
                        response.questId,
                        `presented_${this.selectedEvidence.id}`,
                        true
                    );
                }
            });
        } else {
            // Generic response
            this.game.dialogue.startDialogue([{
                speaker: 'NPC',
                text: "I don't know what that has to do with anything.",
                portrait: 'default'
            }]);
        }

        // Clear selection
        this.selectedEvidence = null;
    }

    /**
     * Get an NPC's response to presented evidence
     */
    getEvidenceResponse(npcId, evidenceId) {
        const responses = evidenceResponses[npcId];
        if (responses && responses[evidenceId]) {
            return responses[evidenceId];
        }
        return null;
    }

    /**
     * Render investigation UI elements
     */
    render(renderer) {
        if (!this.isInvestigating) return;

        // Draw hotspot highlights (for debugging or hint mode)
        for (const hotspot of this.hotspots) {
            const color = hotspot.examined ?
                'rgba(39, 174, 96, 0.3)' :
                'rgba(201, 162, 39, 0.3)';

            renderer.fillRect(
                hotspot.x,
                hotspot.y,
                hotspot.width,
                hotspot.height,
                color
            );
        }

        // Draw cursor
        renderer.fillCircle(this.cursor.x, this.cursor.y, 5, renderer.colors.gold);
    }

    /**
     * Check if all hotspots have been examined
     */
    isLocationFullyExamined() {
        return this.hotspots.every(h => h.examined);
    }
}

/**
 * Investigation hotspots by location
 */
const investigationHotspots = {
    docks: [
        {
            id: 'warehouse_7_crates',
            x: 200,
            y: 400,
            width: 100,
            height: 80,
            examineText: "Wooden crates marked with the Smith's seal. They've been opened and hastily resealed.",
            evidence: {
                id: 'tampered_crate',
                name: 'Tampered Crate',
                description: 'A shipping crate that has been opened and resealed.'
            }
        },
        {
            id: 'dock_ledger',
            x: 600,
            y: 300,
            width: 60,
            height: 40,
            examineText: "A dock worker's ledger. Several entries have been scratched out.",
            evidence: {
                id: 'dock_ledger',
                name: 'Dock Ledger',
                description: 'A record of incoming and outgoing shipments. Some entries have been erased.'
            }
        },
        {
            id: 'bloodstain',
            x: 800,
            y: 500,
            width: 50,
            height: 50,
            examineText: "A dark stain on the wooden planks. It's been scrubbed, but not well enough. Blood."
        }
    ],

    old_port_ruins: [
        {
            id: 'ancient_inscription',
            x: 400,
            y: 200,
            width: 200,
            height: 100,
            examineText: "Ancient writing carved into the stone. 'The Deep One sleeps, but dreaming, sees all.'",
            evidence: {
                id: 'ancient_inscription',
                name: 'Ancient Inscription',
                description: 'Weathered carvings speaking of the sea monster.'
            }
        },
        {
            id: 'offering_bowl',
            x: 600,
            y: 400,
            width: 80,
            height: 60,
            examineText: "A stone bowl. Inside are shells, coins, and something that looks disturbingly like a finger bone.",
            evidence: {
                id: 'offering_remains',
                name: 'Offering Remains',
                description: 'Items left as offerings to the sea monster, including human remains.'
            }
        },
        {
            id: 'fresh_candles',
            x: 300,
            y: 350,
            width: 40,
            height: 60,
            examineText: "Recently lit candles. Someone has been here in the last few hours."
        }
    ],

    sea_monster_shrine: [
        {
            id: 'cult_robes',
            x: 200,
            y: 300,
            width: 80,
            height: 100,
            examineText: "Robes covered in barnacles and dried seaweed. They smell of the deep ocean.",
            evidence: {
                id: 'cult_robes',
                name: 'Cultist Robes',
                description: 'Ceremonial robes worn by the sea monster cult.'
            }
        },
        {
            id: 'ritual_text',
            x: 500,
            y: 250,
            width: 100,
            height: 80,
            examineText: "A book bound in what appears to be sharkskin. The text describes rituals for summoning 'The Deep One'.",
            evidence: {
                id: 'ritual_text',
                name: 'Ritual Text',
                description: 'A forbidden book describing how to summon the sea monster.'
            }
        },
        {
            id: 'victim_belongings',
            x: 700,
            y: 400,
            width: 120,
            height: 60,
            examineText: "Personal effects. Jewelry, clothes, shoes. The belongings of many different people. Victims.",
            evidence: {
                id: 'victim_belongings',
                name: 'Victim Belongings',
                description: 'Personal items taken from the cult\'s victims.'
            }
        }
    ],

    velvet_shell: [
        {
            id: 'lila_room',
            x: 400,
            y: 300,
            width: 150,
            height: 100,
            examineText: "Lila's room. Everything is in order, except... the window is broken from the inside. She didn't leave willingly.",
            evidence: {
                id: 'broken_window_evidence',
                name: 'Broken Window',
                description: 'Evidence of a struggle. Lila was taken by force.'
            }
        },
        {
            id: 'client_ledger',
            x: 600,
            y: 350,
            width: 60,
            height: 40,
            examineText: "MADAM Coral's client ledger. The last entry for Lila shows a visitor with no name—paid in gold.",
            evidence: {
                id: 'client_ledger',
                name: 'Client Ledger',
                description: 'Records showing Lila\'s last client paid anonymously in gold.'
            }
        }
    ]
};

/**
 * NPC responses to presented evidence
 */
const evidenceResponses = {
    merchant_silva: {
        dock_ledger: {
            dialogue: [
                {
                    speaker: 'MERCHANT Silva',
                    text: "Where did you get that?! I... I can explain!",
                    portrait: 'silva'
                },
                {
                    speaker: 'MERCHANT Silva',
                    text: "Alright, alright! I've been... redirecting some shipments. But I'm not the mastermind!",
                    portrait: 'silva'
                },
                {
                    speaker: 'MERCHANT Silva',
                    text: "There's a man. Calls himself 'The Broker'. He pays me to look the other way.",
                    portrait: 'silva'
                }
            ],
            advancesQuest: true,
            questId: 'a_smiths_dilemma'
        }
    },

    guildmaster_mora: {
        mystery_meat: {
            dialogue: [
                {
                    speaker: 'ALCHEMIST Mora',
                    text: "...Where did you find this?",
                    portrait: 'mora'
                },
                {
                    speaker: 'Narrator',
                    text: "Her face goes pale.",
                    portrait: 'narrator'
                },
                {
                    speaker: 'ALCHEMIST Mora',
                    text: "This has been treated with preservation alchemy. Very specific. Very expensive.",
                    portrait: 'mora'
                },
                {
                    speaker: 'ALCHEMIST Mora',
                    text: "There's only one ALCHEMIST in the city who knows this formula. And he was expelled from the Guild years ago...",
                    portrait: 'mora'
                }
            ],
            advancesQuest: true,
            questId: 'a_matter_of_taste'
        }
    }
};

export { investigationHotspots, evidenceResponses };
