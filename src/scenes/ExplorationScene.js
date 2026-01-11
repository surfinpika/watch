/**
 * Exploration Scene
 * Handles the RPG exploration mode where player moves around locations
 */

import { locations } from '../data/config.js';
import { npcs } from '../data/npcs.js';

export class ExplorationScene {
    constructor(game, locationData) {
        this.game = game;
        this.location = locationData;

        // Player position and movement
        this.player = {
            x: 640,
            y: 400,
            width: 48,
            height: 48,
            speed: 200,
            facing: 'down'
        };

        // NPCs in this location
        this.npcsInScene = [];

        // Interactive objects
        this.interactables = [];

        // Exit points to other locations
        this.exits = [];

        // Currently highlighted interactable
        this.highlightedInteractable = null;
    }

    /**
     * Initialize the scene
     */
    async init() {
        // Set up NPCs
        this.setupNPCs();

        // Set up exits
        this.setupExits();

        // Set up interactive objects
        this.setupInteractables();

        // Position player at entrance
        this.positionPlayerAtEntrance();
    }

    /**
     * Set up NPCs for this location
     */
    setupNPCs() {
        this.npcsInScene = [];

        // Find NPCs that belong to this location
        for (const npcId in npcs) {
            const npc = npcs[npcId];
            if (npc.location === this.location.id) {
                this.npcsInScene.push({
                    ...npc,
                    id: npcId,
                    x: npc.defaultX || 400 + Math.random() * 400,
                    y: npc.defaultY || 300 + Math.random() * 200,
                    width: 48,
                    height: 48,
                    canInteract: false
                });
            }
        }

        // Add special NPCs based on location
        if (this.location.npc) {
            const mainNpc = npcs[this.location.npc];
            if (mainNpc && !this.npcsInScene.find(n => n.id === this.location.npc)) {
                this.npcsInScene.push({
                    ...mainNpc,
                    id: this.location.npc,
                    x: mainNpc.defaultX || 640,
                    y: mainNpc.defaultY || 300,
                    width: 48,
                    height: 48,
                    canInteract: false
                });
            }
        }
    }

    /**
     * Set up exit points
     */
    setupExits() {
        this.exits = [];
        const connections = this.location.connections || [];

        // Create exit points for each connection
        connections.forEach((connectionId, index) => {
            const targetLocation = locations[connectionId];
            if (!targetLocation) return;

            // Position exits around the edges
            const positions = [
                { x: 640, y: 680, facing: 'down' },    // Bottom
                { x: 50, y: 360, facing: 'left' },     // Left
                { x: 1230, y: 360, facing: 'right' },  // Right
                { x: 640, y: 50, facing: 'up' }        // Top
            ];

            const pos = positions[index % positions.length];

            this.exits.push({
                id: connectionId,
                name: targetLocation.name,
                x: pos.x,
                y: pos.y,
                width: 100,
                height: 40,
                facing: pos.facing
            });
        });
    }

    /**
     * Set up interactive objects
     */
    setupInteractables() {
        this.interactables = [];

        // Add location-specific interactables
        // This could be expanded with data-driven objects
    }

    /**
     * Position player at the entrance
     */
    positionPlayerAtEntrance() {
        // Default to center
        this.player.x = 640;
        this.player.y = 500;
    }

    /**
     * Update the scene
     */
    update(deltaTime, input) {
        // Don't update if dialogue is active
        if (this.game.dialogue.isActive) {
            return;
        }

        // Handle player movement
        this.updatePlayerMovement(deltaTime, input);

        // Check for interactions
        this.updateInteractions(input);

        // Update NPC states
        this.updateNPCs(deltaTime);
    }

    /**
     * Update player movement
     */
    updatePlayerMovement(deltaTime, input) {
        const movement = input.getMovementVector();

        if (movement.x !== 0 || movement.y !== 0) {
            // Calculate new position
            let speed = this.player.speed;
            if (input.isActionHeld('sprint')) {
                speed *= 1.5;
            }

            const newX = this.player.x + movement.x * speed * deltaTime;
            const newY = this.player.y + movement.y * speed * deltaTime;

            // Update facing direction
            if (Math.abs(movement.x) > Math.abs(movement.y)) {
                this.player.facing = movement.x > 0 ? 'right' : 'left';
            } else {
                this.player.facing = movement.y > 0 ? 'down' : 'up';
            }

            // Check bounds
            const margin = 30;
            this.player.x = Math.max(margin, Math.min(1280 - this.player.width - margin, newX));
            this.player.y = Math.max(margin, Math.min(720 - this.player.height - margin, newY));
        }
    }

    /**
     * Update interaction checks
     */
    updateInteractions(input) {
        // Check proximity to NPCs
        this.highlightedInteractable = null;

        for (const npc of this.npcsInScene) {
            const dist = this.getDistance(this.player, npc);
            npc.canInteract = dist < 80;

            if (npc.canInteract) {
                this.highlightedInteractable = { type: 'npc', data: npc };
            }
        }

        // Check proximity to exits
        for (const exit of this.exits) {
            const dist = this.getDistance(this.player, exit);
            if (dist < 60) {
                this.highlightedInteractable = { type: 'exit', data: exit };
            }
        }

        // Show/hide interaction prompt
        this.updateInteractionPrompt();

        // Handle interaction input
        if (input.isActionPressed('interact') && this.highlightedInteractable) {
            this.handleInteraction(this.highlightedInteractable);
        }
    }

    /**
     * Update interaction prompt UI
     */
    updateInteractionPrompt() {
        const prompt = document.getElementById('interaction-prompt');
        const promptText = document.getElementById('prompt-text');

        if (this.highlightedInteractable) {
            prompt.classList.remove('hidden');

            if (this.highlightedInteractable.type === 'npc') {
                promptText.textContent = `Talk to ${this.highlightedInteractable.data.name}`;
            } else if (this.highlightedInteractable.type === 'exit') {
                promptText.textContent = `Go to ${this.highlightedInteractable.data.name}`;
            }
        } else {
            prompt.classList.add('hidden');
        }
    }

    /**
     * Handle an interaction
     */
    handleInteraction(interactable) {
        switch (interactable.type) {
            case 'npc':
                this.interactWithNPC(interactable.data);
                break;
            case 'exit':
                this.useExit(interactable.data);
                break;
        }
    }

    /**
     * Interact with an NPC
     */
    interactWithNPC(npc) {
        console.log(`Interacting with: ${npc.name}`);

        // Get NPC dialogue
        const dialogue = this.getNPCDialogue(npc);

        if (dialogue && dialogue.length > 0) {
            this.game.dialogue.startDialogue(dialogue, () => {
                // Callback after dialogue ends
                this.onDialogueEnd(npc);
            });
        }
    }

    /**
     * Get dialogue for an NPC based on current game state
     */
    getNPCDialogue(npc) {
        // Check for quest-specific dialogue first
        const questDialogue = this.game.quests.getQuestDialogue(npc.id);
        if (questDialogue) {
            return questDialogue;
        }

        // Return default dialogue
        return npc.dialogue || [{
            speaker: npc.name,
            text: npc.defaultLine || "...",
            portrait: npc.portrait || 'default'
        }];
    }

    /**
     * Handle dialogue end
     */
    onDialogueEnd(npc) {
        // Check for quest triggers
        this.game.quests.checkNPCInteraction(npc.id);
    }

    /**
     * Use an exit to travel to another location
     */
    useExit(exit) {
        console.log(`Traveling to: ${exit.name}`);
        this.game.scenes.travelTo(exit.id);
    }

    /**
     * Update NPCs
     */
    updateNPCs(deltaTime) {
        // Simple idle animation or movement could go here
        for (const npc of this.npcsInScene) {
            // NPCs could wander, face the player, etc.
        }
    }

    /**
     * Calculate distance between two entities
     */
    getDistance(a, b) {
        const dx = (a.x + a.width / 2) - (b.x + b.width / 2);
        const dy = (a.y + a.height / 2) - (b.y + b.height / 2);
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Render the scene
     */
    render(renderer) {
        // Draw background
        renderer.drawLocationBackground(this.location);

        // Draw exits (as indicators)
        for (const exit of this.exits) {
            this.renderExit(renderer, exit);
        }

        // Draw NPCs (sorted by Y for depth)
        const sortedNPCs = [...this.npcsInScene].sort((a, b) => a.y - b.y);
        for (const npc of sortedNPCs) {
            renderer.drawNPC(npc.x, npc.y, npc, 'down');
        }

        // Draw player
        renderer.drawPlayer(this.player.x, this.player.y, this.player.facing);

        // Draw location name
        renderer.drawText(this.location.name, 640, 30, {
            color: renderer.colors.parchment,
            font: '24px "Cinzel", serif',
            align: 'center'
        });
    }

    /**
     * Render an exit indicator
     */
    renderExit(renderer, exit) {
        // Draw exit zone
        const isHighlighted = this.highlightedInteractable &&
            this.highlightedInteractable.type === 'exit' &&
            this.highlightedInteractable.data.id === exit.id;

        const color = isHighlighted ? renderer.colors.gold : 'rgba(201, 162, 39, 0.3)';

        renderer.fillRect(
            exit.x - exit.width / 2,
            exit.y - exit.height / 2,
            exit.width,
            exit.height,
            color
        );

        // Draw arrow based on direction
        const arrowSize = 10;
        const centerX = exit.x;
        const centerY = exit.y;

        renderer.drawText('→', centerX, centerY, {
            color: renderer.colors.parchment,
            font: '20px sans-serif',
            align: 'center',
            baseline: 'middle'
        });
    }
}
