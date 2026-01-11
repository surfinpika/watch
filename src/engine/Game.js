/**
 * Main Game Class
 * Core game loop and system management
 */

import { Renderer } from './Renderer.js';
import { InputManager } from './InputManager.js';
import { SceneManager } from '../scenes/SceneManager.js';
import { DialogueSystem } from '../systems/DialogueSystem.js';
import { QuestSystem } from '../systems/QuestSystem.js';
import { PlayerState } from '../systems/PlayerState.js';
import { UIManager } from '../ui/UIManager.js';

export class Game {
    constructor(config) {
        this.config = config;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;

        // Core systems (initialized in init())
        this.renderer = null;
        this.input = null;
        this.scenes = null;
        this.dialogue = null;
        this.quests = null;
        this.player = null;
        this.ui = null;
    }

    /**
     * Initialize all game systems
     */
    async init() {
        console.log('Initializing game systems...');

        // Get canvas element
        const canvas = document.getElementById('game-canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Initialize renderer
        this.renderer = new Renderer(canvas, this.config.canvas);
        this.renderer.init();

        // Initialize input manager
        this.input = new InputManager();
        this.input.init();

        // Initialize player state
        this.player = new PlayerState(this.config);

        // Initialize UI manager
        this.ui = new UIManager(this);

        // Initialize dialogue system
        this.dialogue = new DialogueSystem(this);

        // Initialize quest system
        this.quests = new QuestSystem(this);

        // Initialize scene manager
        this.scenes = new SceneManager(this);

        // Set up UI event handlers
        this.setupUIEvents();

        // Show main menu
        this.ui.showMainMenu();

        console.log('All systems initialized');
    }

    /**
     * Set up UI event handlers
     */
    setupUIEvents() {
        // Main menu buttons
        const btnNewGame = document.getElementById('btn-new-game');
        const btnContinue = document.getElementById('btn-continue');

        if (btnNewGame) {
            btnNewGame.addEventListener('click', () => this.startNewGame());
        }

        if (btnContinue) {
            // Check for saved game
            if (this.hasSavedGame()) {
                btnContinue.disabled = false;
                btnContinue.addEventListener('click', () => this.loadGame());
            }
        }

        // Quest log toggle
        const btnQuests = document.getElementById('btn-quests');
        const btnCloseQuests = document.getElementById('btn-close-quests');
        const questLog = document.getElementById('quest-log');

        if (btnQuests && questLog) {
            btnQuests.addEventListener('click', () => {
                questLog.classList.toggle('hidden');
                if (!questLog.classList.contains('hidden')) {
                    this.quests.renderQuestLog();
                }
            });
        }

        if (btnCloseQuests && questLog) {
            btnCloseQuests.addEventListener('click', () => {
                questLog.classList.add('hidden');
            });
        }

        // Evidence panel toggle
        const btnEvidence = document.getElementById('btn-evidence');
        const evidenceUI = document.getElementById('investigation-ui');

        if (btnEvidence && evidenceUI) {
            btnEvidence.addEventListener('click', () => {
                evidenceUI.classList.toggle('hidden');
            });
        }
    }

    /**
     * Start a new game
     */
    async startNewGame() {
        console.log('Starting new game...');

        // Hide main menu
        this.ui.hideMainMenu();

        // Reset player state
        this.player.reset();

        // Load opening scene
        await this.scenes.loadScene('opening');

        // Start game loop
        this.start();

        // Show opening dialogue
        this.showOpeningSequence();
    }

    /**
     * Show the opening sequence
     */
    showOpeningSequence() {
        const openingDialogue = [
            {
                speaker: 'Narrator',
                text: 'New Port City. Built on the bones of Old Port, destroyed centuries ago by the wrath of the sea.',
                portrait: 'narrator'
            },
            {
                speaker: 'Narrator',
                text: 'Some say a great beast lurks beneath the waves—a monster that answers only to those deemed worthy.',
                portrait: 'narrator'
            },
            {
                speaker: 'Narrator',
                text: 'Others call it superstition. Fairy tales for children and the simple-minded.',
                portrait: 'narrator'
            },
            {
                speaker: 'Narrator',
                text: 'But you... you are neither child nor noble. You are an orphan. A nobody.',
                portrait: 'narrator'
            },
            {
                speaker: 'Narrator',
                text: 'Today, you join the City Watch. Today, your story begins.',
                portrait: 'narrator'
            },
            {
                speaker: 'COMMANDER Aldric',
                text: 'Fresh meat. Another mouth to feed, another body for the streets.',
                portrait: 'aldric',
                titleClass: 'title-guard'
            },
            {
                speaker: 'COMMANDER Aldric',
                text: 'I am COMMANDER Aldric. You will address me as COMMANDER, or SIR. Nothing else.',
                portrait: 'aldric',
                titleClass: 'title-guard'
            },
            {
                speaker: 'COMMANDER Aldric',
                text: 'Here is your badge. A simple conch shell. The lowest of the low.',
                portrait: 'aldric',
                titleClass: 'title-guard'
            },
            {
                speaker: 'COMMANDER Aldric',
                text: 'Prove yourself worthy, and perhaps one day you\'ll earn something better.',
                portrait: 'aldric',
                titleClass: 'title-guard'
            },
            {
                speaker: 'COMMANDER Aldric',
                text: 'Now get out of my sight, RECRUIT. Report to SERGEANT Thorne in the plaza.',
                portrait: 'aldric',
                titleClass: 'title-guard'
            }
        ];

        this.dialogue.startDialogue(openingDialogue, () => {
            // After opening dialogue, trigger the first quest
            this.quests.startQuest('first_patrol');
            this.ui.showGameHUD();
        });
    }

    /**
     * Check if there's a saved game
     */
    hasSavedGame() {
        return localStorage.getItem('npc_savegame') !== null;
    }

    /**
     * Load saved game
     */
    loadGame() {
        const saveData = localStorage.getItem('npc_savegame');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.player.load(data.player);
                this.quests.load(data.quests);
                this.scenes.loadScene(data.currentScene);
                this.ui.hideMainMenu();
                this.start();
            } catch (error) {
                console.error('Failed to load save game:', error);
            }
        }
    }

    /**
     * Save current game
     */
    saveGame() {
        const saveData = {
            player: this.player.serialize(),
            quests: this.quests.serialize(),
            currentScene: this.scenes.currentSceneId,
            timestamp: Date.now()
        };
        localStorage.setItem('npc_savegame', JSON.stringify(saveData));
        console.log('Game saved');
    }

    /**
     * Start the game loop
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Stop the game loop
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Cap delta time to prevent spiral of death
        if (this.deltaTime > 0.1) {
            this.deltaTime = 0.1;
        }

        // Update game state
        this.update(this.deltaTime);

        // Render
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        // Update input
        this.input.update();

        // Update dialogue if active
        if (this.dialogue.isActive) {
            this.dialogue.update(deltaTime);
        }

        // Update current scene
        if (this.scenes.currentScene) {
            this.scenes.currentScene.update(deltaTime, this.input);
        }

        // Update quest system
        this.quests.update(deltaTime);
    }

    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.renderer.clear();

        // Render current scene
        if (this.scenes.currentScene) {
            this.scenes.currentScene.render(this.renderer);
        }
    }
}
