/**
 * New Port City - City Watch
 * Main Entry Point
 *
 * A hybrid RPG/Visual Novel set in a medieval coastal city
 * Inspired by Dragon Quest, Ace Attorney, Yakuza, and A Song of Ice and Fire
 */

import { Game } from './engine/Game.js';
import { gameConfig } from './data/config.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('New Port City - City Watch');
    console.log('Initializing game...');

    // Create and start the game
    const game = new Game(gameConfig);

    // Make game accessible for debugging
    window.game = game;

    // Start the game
    game.init().then(() => {
        console.log('Game initialized successfully');
    }).catch(error => {
        console.error('Failed to initialize game:', error);
    });
});
