/**
 * Player State
 * Manages player progression, inventory, evidence, and stats
 */

import { gameConfig } from '../data/config.js';

export class PlayerState {
    constructor(config) {
        this.config = config;

        // Player identity
        this.name = 'Orphan'; // Can be customized later
        this.title = '';

        // City Watch progression
        this.rank = 0; // Index into ranks array
        this.experience = 0;
        this.experienceToNextRank = 100;

        // Investigation
        this.evidence = [];
        this.notes = [];

        // Relationships
        this.relationships = {}; // NPC id -> relationship value

        // Statistics
        this.stats = {
            casesolved: 0,
            npcsTalkedTo: new Set(),
            locationsVisited: new Set(),
            daysPlayed: 1
        };

        // Current location
        this.currentLocation = null;

        // DOM elements
        this.badgeIcon = document.getElementById('badge-icon');
        this.badgeRank = document.getElementById('badge-rank');
    }

    /**
     * Reset player state for new game
     */
    reset() {
        this.name = 'Orphan';
        this.title = '';
        this.rank = 0;
        this.experience = 0;
        this.experienceToNextRank = 100;
        this.evidence = [];
        this.notes = [];
        this.relationships = {};
        this.stats = {
            casesolved: 0,
            npcsTalkedTo: new Set(),
            locationsVisited: new Set(),
            daysPlayed: 1
        };

        this.updateBadgeDisplay();
    }

    /**
     * Get current rank data
     */
    getCurrentRank() {
        return this.config.ranks[this.rank] || this.config.ranks[0];
    }

    /**
     * Get rank display name
     */
    getRankName() {
        return this.getCurrentRank().name;
    }

    /**
     * Update the badge display in the UI
     */
    updateBadgeDisplay() {
        const rankData = this.getCurrentRank();

        if (this.badgeIcon) {
            this.badgeIcon.textContent = rankData.badge;
            this.badgeIcon.style.color = rankData.color;
        }

        if (this.badgeRank) {
            this.badgeRank.textContent = rankData.name;
            this.badgeRank.style.color = rankData.color;
        }
    }

    /**
     * Add experience points
     */
    addExperience(amount) {
        this.experience += amount;
        console.log(`Gained ${amount} experience. Total: ${this.experience}/${this.experienceToNextRank}`);

        // Check for rank up (handled separately to allow for ceremony)
    }

    /**
     * Check if player can rank up
     */
    canRankUp() {
        return this.experience >= this.experienceToNextRank &&
            this.rank < this.config.ranks.length - 1;
    }

    /**
     * Rank up the player
     */
    rankUp() {
        if (this.rank >= this.config.ranks.length - 1) {
            console.log('Already at maximum rank');
            return false;
        }

        this.rank++;
        this.experience = 0;
        this.experienceToNextRank = Math.floor(this.experienceToNextRank * 1.5);

        const newRank = this.getCurrentRank();
        console.log(`Promoted to ${newRank.name}!`);

        this.updateBadgeDisplay();

        // Could trigger a rank-up ceremony/dialogue here
        return true;
    }

    /**
     * Add evidence to the collection
     */
    addEvidence(evidence) {
        // Check for duplicates
        if (this.evidence.some(e => e.id === evidence.id)) {
            console.log(`Evidence already collected: ${evidence.name}`);
            return false;
        }

        this.evidence.push({
            ...evidence,
            collectedAt: Date.now(),
            examined: false
        });

        console.log(`Evidence collected: ${evidence.name}`);
        return true;
    }

    /**
     * Get evidence by ID
     */
    getEvidence(evidenceId) {
        return this.evidence.find(e => e.id === evidenceId);
    }

    /**
     * Mark evidence as examined
     */
    examineEvidence(evidenceId) {
        const evidence = this.getEvidence(evidenceId);
        if (evidence) {
            evidence.examined = true;
        }
    }

    /**
     * Add a note
     */
    addNote(note) {
        this.notes.push({
            ...note,
            addedAt: Date.now()
        });
    }

    /**
     * Update relationship with an NPC
     */
    updateRelationship(npcId, delta) {
        if (!this.relationships[npcId]) {
            this.relationships[npcId] = 50; // Neutral starting point
        }

        this.relationships[npcId] = Math.max(0, Math.min(100,
            this.relationships[npcId] + delta
        ));
    }

    /**
     * Get relationship level with an NPC
     */
    getRelationship(npcId) {
        return this.relationships[npcId] || 50;
    }

    /**
     * Get relationship description
     */
    getRelationshipDescription(npcId) {
        const level = this.getRelationship(npcId);

        if (level >= 90) return 'Trusted Ally';
        if (level >= 70) return 'Friend';
        if (level >= 50) return 'Acquaintance';
        if (level >= 30) return 'Suspicious';
        if (level >= 10) return 'Hostile';
        return 'Enemy';
    }

    /**
     * Record visiting a location
     */
    visitLocation(locationId) {
        this.stats.locationsVisited.add(locationId);
    }

    /**
     * Record talking to an NPC
     */
    talkToNPC(npcId) {
        this.stats.npcsTalkedTo.add(npcId);
    }

    /**
     * Record solving a case
     */
    solvCase() {
        this.stats.casesolved++;
    }

    /**
     * Serialize player state for saving
     */
    serialize() {
        return {
            name: this.name,
            title: this.title,
            rank: this.rank,
            experience: this.experience,
            experienceToNextRank: this.experienceToNextRank,
            evidence: this.evidence,
            notes: this.notes,
            relationships: this.relationships,
            stats: {
                casesolved: this.stats.casesolved,
                npcsTalkedTo: Array.from(this.stats.npcsTalkedTo),
                locationsVisited: Array.from(this.stats.locationsVisited),
                daysPlayed: this.stats.daysPlayed
            }
        };
    }

    /**
     * Load player state from save data
     */
    load(saveData) {
        if (!saveData) return;

        this.name = saveData.name || 'Orphan';
        this.title = saveData.title || '';
        this.rank = saveData.rank || 0;
        this.experience = saveData.experience || 0;
        this.experienceToNextRank = saveData.experienceToNextRank || 100;
        this.evidence = saveData.evidence || [];
        this.notes = saveData.notes || [];
        this.relationships = saveData.relationships || {};

        if (saveData.stats) {
            this.stats = {
                casesolved: saveData.stats.casesolved || 0,
                npcsTalkedTo: new Set(saveData.stats.npcsTalkedTo || []),
                locationsVisited: new Set(saveData.stats.locationsVisited || []),
                daysPlayed: saveData.stats.daysPlayed || 1
            };
        }

        this.updateBadgeDisplay();
    }
}
