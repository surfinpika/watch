/**
 * Quest System
 * Manages quests, objectives, and the Yakuza-style quest reveal
 */

import { quests } from '../data/quests.js';

export class QuestSystem {
    constructor(game) {
        this.game = game;

        // Active quests
        this.activeQuests = [];

        // Completed quests
        this.completedQuests = [];

        // Quest reveal state
        this.isRevealing = false;
        this.revealQueue = [];

        // DOM elements
        this.questReveal = document.getElementById('quest-reveal');
        this.questChapter = document.getElementById('quest-chapter');
        this.questTitle = document.getElementById('quest-title');
        this.questLogContent = document.getElementById('quest-log-content');
    }

    /**
     * Start a quest by ID
     */
    startQuest(questId) {
        const quest = quests[questId];
        if (!quest) {
            console.warn(`Quest not found: ${questId}`);
            return;
        }

        // Check if already active or completed
        if (this.isQuestActive(questId) || this.isQuestCompleted(questId)) {
            return;
        }

        // Check prerequisites
        if (quest.requires) {
            for (const reqId of quest.requires) {
                if (!this.isQuestCompleted(reqId)) {
                    console.log(`Quest ${questId} requires ${reqId} to be completed first`);
                    return;
                }
            }
        }

        // Create quest instance
        const questInstance = {
            id: questId,
            ...quest,
            currentObjective: 0,
            objectiveProgress: {},
            startTime: Date.now()
        };

        // Add to active quests
        this.activeQuests.push(questInstance);

        console.log(`Quest started: ${quest.title}`);

        // Queue the reveal
        this.queueReveal(questInstance);
    }

    /**
     * Queue a quest reveal animation
     */
    queueReveal(quest) {
        this.revealQueue.push(quest);

        if (!this.isRevealing) {
            this.showNextReveal();
        }
    }

    /**
     * Show the next quest reveal in queue
     */
    showNextReveal() {
        if (this.revealQueue.length === 0) {
            this.isRevealing = false;
            return;
        }

        this.isRevealing = true;
        const quest = this.revealQueue.shift();

        // Show reveal overlay
        this.showQuestReveal(quest);
    }

    /**
     * Show the Yakuza-style quest reveal
     */
    showQuestReveal(quest) {
        if (!this.questReveal) return;

        // Set content
        if (this.questChapter) {
            this.questChapter.textContent = quest.chapter || 'New Quest';
        }

        if (this.questTitle) {
            this.questTitle.textContent = quest.title;
        }

        // Show overlay
        this.questReveal.classList.remove('hidden');

        // Play sound effect (placeholder)
        this.playRevealSound();

        // Hide after delay
        setTimeout(() => {
            this.hideQuestReveal();
        }, 3000);
    }

    /**
     * Hide the quest reveal overlay
     */
    hideQuestReveal() {
        if (this.questReveal) {
            this.questReveal.classList.add('hidden');
        }

        // Show next reveal if queued
        setTimeout(() => {
            this.showNextReveal();
        }, 500);
    }

    /**
     * Play reveal sound effect
     */
    playRevealSound() {
        // Placeholder for audio implementation
        console.log('🎵 Quest reveal sound');
    }

    /**
     * Update quest objectives
     */
    update(deltaTime) {
        // Check for any time-based objectives or triggers
    }

    /**
     * Check if a quest is currently active
     */
    isQuestActive(questId) {
        return this.activeQuests.some(q => q.id === questId);
    }

    /**
     * Check if a quest is completed
     */
    isQuestCompleted(questId) {
        return this.completedQuests.some(q => q.id === questId);
    }

    /**
     * Get an active quest by ID
     */
    getActiveQuest(questId) {
        return this.activeQuests.find(q => q.id === questId);
    }

    /**
     * Update objective progress
     */
    updateObjective(questId, objectiveKey, value) {
        const quest = this.getActiveQuest(questId);
        if (!quest) return;

        quest.objectiveProgress[objectiveKey] = value;

        // Check if objective is complete
        this.checkObjectiveCompletion(quest);
    }

    /**
     * Check if current objective is complete
     */
    checkObjectiveCompletion(quest) {
        const currentObj = quest.objectives[quest.currentObjective];
        if (!currentObj) return;

        // Check completion condition
        if (currentObj.checkComplete && currentObj.checkComplete(quest.objectiveProgress)) {
            this.advanceObjective(quest);
        }
    }

    /**
     * Advance to the next objective
     */
    advanceObjective(quest) {
        quest.currentObjective++;

        if (quest.currentObjective >= quest.objectives.length) {
            // Quest complete!
            this.completeQuest(quest.id);
        } else {
            // Show new objective notification
            console.log(`New objective: ${quest.objectives[quest.currentObjective].description}`);
        }
    }

    /**
     * Complete a quest
     */
    completeQuest(questId) {
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return;

        const quest = this.activeQuests[questIndex];

        // Move to completed
        this.activeQuests.splice(questIndex, 1);
        this.completedQuests.push({
            ...quest,
            completedTime: Date.now()
        });

        console.log(`Quest completed: ${quest.title}`);

        // Grant rewards
        if (quest.rewards) {
            this.grantRewards(quest.rewards);
        }

        // Check for follow-up quests
        if (quest.nextQuest) {
            setTimeout(() => {
                this.startQuest(quest.nextQuest);
            }, 1000);
        }
    }

    /**
     * Grant quest rewards
     */
    grantRewards(rewards) {
        if (rewards.experience) {
            this.game.player.addExperience(rewards.experience);
        }

        if (rewards.rankUp) {
            this.game.player.rankUp();
        }

        if (rewards.evidence) {
            for (const evidence of rewards.evidence) {
                this.game.player.addEvidence(evidence);
            }
        }
    }

    /**
     * Get quest-specific dialogue for an NPC
     */
    getQuestDialogue(npcId) {
        for (const quest of this.activeQuests) {
            if (quest.npcDialogue && quest.npcDialogue[npcId]) {
                const dialogueKey = `objective_${quest.currentObjective}`;
                const dialogue = quest.npcDialogue[npcId][dialogueKey];

                if (dialogue) {
                    return dialogue;
                }
            }
        }
        return null;
    }

    /**
     * Check for quest triggers when interacting with an NPC
     */
    checkNPCInteraction(npcId) {
        // Check for quest-starting NPCs
        for (const questId in quests) {
            const quest = quests[questId];
            if (quest.triggerNPC === npcId && !this.isQuestActive(questId) && !this.isQuestCompleted(questId)) {
                // Check if prerequisites are met
                if (!quest.requires || quest.requires.every(req => this.isQuestCompleted(req))) {
                    this.startQuest(questId);
                }
            }
        }

        // Update active quest objectives
        for (const quest of this.activeQuests) {
            const currentObj = quest.objectives[quest.currentObjective];
            if (currentObj && currentObj.talkTo === npcId) {
                this.updateObjective(quest.id, 'talkedTo_' + npcId, true);
            }
        }
    }

    /**
     * Render the quest log
     */
    renderQuestLog() {
        if (!this.questLogContent) return;

        let html = '';

        // Active quests
        if (this.activeQuests.length > 0) {
            html += '<h3 style="color: var(--color-gold); margin-bottom: 1rem;">Active Quests</h3>';

            for (const quest of this.activeQuests) {
                const currentObj = quest.objectives[quest.currentObjective];
                html += `
                    <div class="quest-entry">
                        <div class="quest-entry-title">${quest.title}</div>
                        <div class="quest-entry-desc">${currentObj ? currentObj.description : quest.description}</div>
                    </div>
                `;
            }
        }

        // Completed quests
        if (this.completedQuests.length > 0) {
            html += '<h3 style="color: var(--color-palm); margin: 1rem 0;">Completed Quests</h3>';

            for (const quest of this.completedQuests) {
                html += `
                    <div class="quest-entry completed">
                        <div class="quest-entry-title">${quest.title}</div>
                        <div class="quest-entry-desc">${quest.description}</div>
                    </div>
                `;
            }
        }

        if (html === '') {
            html = '<p style="color: var(--color-text-dim);">No quests yet. Explore the city and talk to people.</p>';
        }

        this.questLogContent.innerHTML = html;
    }

    /**
     * Serialize quest state for saving
     */
    serialize() {
        return {
            active: this.activeQuests.map(q => ({
                id: q.id,
                currentObjective: q.currentObjective,
                objectiveProgress: q.objectiveProgress,
                startTime: q.startTime
            })),
            completed: this.completedQuests.map(q => ({
                id: q.id,
                completedTime: q.completedTime
            }))
        };
    }

    /**
     * Load quest state from save data
     */
    load(saveData) {
        if (!saveData) return;

        // Restore active quests
        this.activeQuests = saveData.active.map(save => {
            const questData = quests[save.id];
            if (!questData) return null;

            return {
                id: save.id,
                ...questData,
                currentObjective: save.currentObjective,
                objectiveProgress: save.objectiveProgress,
                startTime: save.startTime
            };
        }).filter(q => q !== null);

        // Restore completed quests
        this.completedQuests = saveData.completed.map(save => {
            const questData = quests[save.id];
            if (!questData) return null;

            return {
                id: save.id,
                ...questData,
                completedTime: save.completedTime
            };
        }).filter(q => q !== null);
    }
}
