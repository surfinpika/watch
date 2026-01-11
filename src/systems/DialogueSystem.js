/**
 * Dialogue System
 * Handles visual novel-style dialogue with character portraits
 * Supports typewriter effect, choices, and title coloring
 */

import { gameConfig } from '../data/config.js';

export class DialogueSystem {
    constructor(game) {
        this.game = game;

        // Dialogue state
        this.isActive = false;
        this.currentDialogue = [];
        this.currentIndex = 0;
        this.currentText = '';
        this.displayedText = '';
        this.characterIndex = 0;
        this.isTyping = false;
        this.typeTimer = 0;

        // Callback when dialogue ends
        this.onComplete = null;

        // DOM elements
        this.dialogueBox = document.getElementById('dialogue-box');
        this.portraitEl = document.getElementById('dialogue-portrait');
        this.speakerEl = document.getElementById('dialogue-speaker');
        this.textEl = document.getElementById('dialogue-text');
        this.continueEl = document.getElementById('dialogue-continue');

        // Typing speed
        this.typeSpeed = gameConfig.text.dialogueSpeed;
        this.fastTypeSpeed = gameConfig.text.fastDialogueSpeed;

        // Title patterns for coloring
        this.titlePatterns = this.buildTitlePatterns();

        // Set up input handlers
        this.setupInputHandlers();
    }

    /**
     * Build regex patterns for title highlighting
     */
    buildTitlePatterns() {
        const patterns = {};
        const categories = gameConfig.titleCategories;

        for (const category in categories) {
            const titles = categories[category];
            patterns[category] = new RegExp(`\\b(${titles.join('|')})\\b`, 'gi');
        }

        return patterns;
    }

    /**
     * Set up input handlers for dialogue
     */
    setupInputHandlers() {
        // Click/touch to advance
        if (this.dialogueBox) {
            this.dialogueBox.addEventListener('click', () => this.advance());
        }

        // Keyboard to advance
        window.addEventListener('keydown', (e) => {
            if (!this.isActive) return;

            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
                e.preventDefault();
                this.advance();
            }
        });
    }

    /**
     * Start a dialogue sequence
     * @param {Array} dialogueArray - Array of dialogue entries
     * @param {Function} onComplete - Callback when dialogue ends
     */
    startDialogue(dialogueArray, onComplete = null) {
        if (!dialogueArray || dialogueArray.length === 0) return;

        this.currentDialogue = dialogueArray;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.isActive = true;

        // Show dialogue box
        this.showDialogueBox();

        // Display first line
        this.displayCurrentLine();
    }

    /**
     * Show the dialogue box
     */
    showDialogueBox() {
        if (this.dialogueBox) {
            this.dialogueBox.classList.remove('hidden');
        }
    }

    /**
     * Hide the dialogue box
     */
    hideDialogueBox() {
        if (this.dialogueBox) {
            this.dialogueBox.classList.add('hidden');
        }
    }

    /**
     * Display the current dialogue line
     */
    displayCurrentLine() {
        const line = this.currentDialogue[this.currentIndex];
        if (!line) return;

        // Set speaker name (with title coloring)
        if (this.speakerEl) {
            this.speakerEl.innerHTML = this.colorTitles(line.speaker || '');
        }

        // Set portrait
        this.setPortrait(line.portrait);

        // Start typing the text
        this.currentText = line.text || '';
        this.displayedText = '';
        this.characterIndex = 0;
        this.isTyping = true;
        this.typeTimer = 0;

        // Hide continue indicator while typing
        if (this.continueEl) {
            this.continueEl.style.opacity = '0';
        }
    }

    /**
     * Set the character portrait
     */
    setPortrait(portraitId) {
        if (!this.portraitEl) return;

        // For now, use emoji placeholders based on character type
        const portraits = {
            'narrator': '📜',
            'aldric': '⚔️',
            'thorne': '🛡️',
            'korran': '🔨',
            'madam_coral': '🐚',
            'mora': '⚗️',
            'bess': '🍺',
            'princess_lyanna': '👑',
            'default': '👤'
        };

        const emoji = portraits[portraitId] || portraits['default'];
        this.portraitEl.textContent = emoji;
    }

    /**
     * Color titles and occupations in text
     */
    colorTitles(text) {
        let result = text;

        // Apply each category's coloring
        const categoryClasses = {
            royal: 'title-royal',
            noble: 'title-noble',
            knight: 'title-knight',
            guard: 'title-guard',
            common: 'title-common'
        };

        for (const category in this.titlePatterns) {
            const pattern = this.titlePatterns[category];
            const className = categoryClasses[category];

            result = result.replace(pattern, (match) => {
                return `<span class="${className}">${match}</span>`;
            });
        }

        return result;
    }

    /**
     * Update the dialogue system (called each frame)
     */
    update(deltaTime) {
        if (!this.isActive || !this.isTyping) return;

        this.typeTimer += deltaTime * 1000;

        // Check if we should type the next character
        const speed = this.game.input.isActionHeld('interact') ?
            this.fastTypeSpeed : this.typeSpeed;

        while (this.typeTimer >= speed && this.characterIndex < this.currentText.length) {
            this.typeTimer -= speed;
            this.displayedText += this.currentText[this.characterIndex];
            this.characterIndex++;

            // Update the text display with title coloring
            if (this.textEl) {
                this.textEl.innerHTML = this.colorTitles(this.displayedText);
            }
        }

        // Check if typing is complete
        if (this.characterIndex >= this.currentText.length) {
            this.isTyping = false;

            // Show continue indicator
            if (this.continueEl) {
                this.continueEl.style.opacity = '1';
            }
        }
    }

    /**
     * Advance to the next dialogue line or complete
     */
    advance() {
        if (!this.isActive) return;

        // If still typing, complete the current line instantly
        if (this.isTyping) {
            this.displayedText = this.currentText;
            this.characterIndex = this.currentText.length;
            this.isTyping = false;

            if (this.textEl) {
                this.textEl.innerHTML = this.colorTitles(this.displayedText);
            }

            if (this.continueEl) {
                this.continueEl.style.opacity = '1';
            }
            return;
        }

        // Move to next line
        this.currentIndex++;

        if (this.currentIndex >= this.currentDialogue.length) {
            // Dialogue complete
            this.endDialogue();
        } else {
            // Display next line
            this.displayCurrentLine();
        }
    }

    /**
     * End the dialogue sequence
     */
    endDialogue() {
        this.isActive = false;
        this.hideDialogueBox();

        // Call completion callback
        if (this.onComplete) {
            const callback = this.onComplete;
            this.onComplete = null;
            callback();
        }
    }

    /**
     * Skip the entire dialogue (for debugging or replay)
     */
    skipDialogue() {
        this.endDialogue();
    }

    /**
     * Check if dialogue is currently active
     */
    get active() {
        return this.isActive;
    }
}
