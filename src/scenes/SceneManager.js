/**
 * Scene Manager
 * Handles scene transitions and manages the current scene
 */

import { ExplorationScene } from './ExplorationScene.js';
import { locations } from '../data/config.js';

export class SceneManager {
    constructor(game) {
        this.game = game;
        this.currentScene = null;
        this.currentSceneId = null;
        this.sceneHistory = [];
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionType = 'fade';
        this.transitionDuration = 0.5; // seconds

        // Scene types
        this.sceneTypes = {
            exploration: ExplorationScene
        };
    }

    /**
     * Load a scene by ID
     */
    async loadScene(sceneId, options = {}) {
        if (this.isTransitioning) return;

        console.log(`Loading scene: ${sceneId}`);

        // Start transition
        if (options.transition !== false) {
            await this.startTransition('fadeOut');
        }

        // Get location data
        const locationData = locations[sceneId];

        if (!locationData) {
            // Handle special scenes (like 'opening')
            if (sceneId === 'opening') {
                await this.loadOpeningScene();
                return;
            }
            console.warn(`Unknown scene: ${sceneId}`);
            return;
        }

        // Save current scene to history
        if (this.currentSceneId) {
            this.sceneHistory.push(this.currentSceneId);
        }

        // Create new scene
        this.currentSceneId = sceneId;
        this.currentScene = new ExplorationScene(this.game, locationData);

        // Initialize the scene
        await this.currentScene.init();

        // Update UI
        this.game.ui.updateLocationName(locationData.name);

        // End transition
        if (options.transition !== false) {
            await this.startTransition('fadeIn');
        }
    }

    /**
     * Load the opening scene (special case)
     */
    async loadOpeningScene() {
        const openingLocation = {
            id: 'opening',
            name: 'City Watch Barracks',
            description: 'The day you joined the City Watch.',
            type: 'interior',
            district: 'central',
            connections: [],
            background: 'barracks'
        };

        this.currentSceneId = 'opening';
        this.currentScene = new ExplorationScene(this.game, openingLocation);
        await this.currentScene.init();

        await this.startTransition('fadeIn');
    }

    /**
     * Go back to the previous scene
     */
    async goBack() {
        if (this.sceneHistory.length === 0) return;

        const previousSceneId = this.sceneHistory.pop();
        await this.loadScene(previousSceneId, { addToHistory: false });
    }

    /**
     * Start a transition effect
     */
    startTransition(type) {
        return new Promise((resolve) => {
            this.isTransitioning = true;
            this.transitionType = type;
            this.transitionProgress = 0;

            const duration = this.transitionDuration * 1000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                this.transitionProgress = Math.min(elapsed / duration, 1);

                // Apply transition effect
                this.game.renderer.applyEffect(type, this.transitionProgress);

                if (this.transitionProgress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isTransitioning = false;
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    /**
     * Check if player can travel to a location
     */
    canTravelTo(locationId) {
        if (!this.currentScene) return false;

        const currentLocation = locations[this.currentSceneId];
        if (!currentLocation) return false;

        // Check if location is connected
        if (!currentLocation.connections.includes(locationId)) {
            return false;
        }

        // Check if location is restricted
        const targetLocation = locations[locationId];
        if (targetLocation && targetLocation.restricted) {
            // Could add rank/quest checks here
            return this.game.player.rank >= 3; // Need to be Lieutenant or higher
        }

        return true;
    }

    /**
     * Get available travel destinations from current location
     */
    getAvailableDestinations() {
        const currentLocation = locations[this.currentSceneId];
        if (!currentLocation) return [];

        return currentLocation.connections
            .map(id => locations[id])
            .filter(loc => loc && this.canTravelTo(loc.id));
    }

    /**
     * Travel to a connected location
     */
    async travelTo(locationId) {
        if (!this.canTravelTo(locationId)) {
            console.log('Cannot travel to:', locationId);
            return false;
        }

        await this.loadScene(locationId);
        return true;
    }
}
