/**
 * UI Manager
 * Handles all UI updates and interactions
 */

export class UIManager {
    constructor(game) {
        this.game = game;

        // Cache DOM elements
        this.elements = {
            mainMenu: document.getElementById('main-menu'),
            gameHud: document.getElementById('game-hud'),
            locationName: document.getElementById('location-name'),
            rankBadge: document.getElementById('rank-badge'),
            questLog: document.getElementById('quest-log'),
            evidenceUI: document.getElementById('investigation-ui'),
            evidenceList: document.getElementById('evidence-list')
        };
    }

    /**
     * Show the main menu
     */
    showMainMenu() {
        if (this.elements.mainMenu) {
            this.elements.mainMenu.classList.remove('hidden');
        }
        this.hideGameHUD();
    }

    /**
     * Hide the main menu
     */
    hideMainMenu() {
        if (this.elements.mainMenu) {
            this.elements.mainMenu.classList.add('hidden');
        }
    }

    /**
     * Show the game HUD
     */
    showGameHUD() {
        if (this.elements.gameHud) {
            this.elements.gameHud.classList.remove('hidden');
        }
        if (this.elements.rankBadge) {
            this.elements.rankBadge.classList.remove('hidden');
        }

        // Update badge display
        this.game.player.updateBadgeDisplay();
    }

    /**
     * Hide the game HUD
     */
    hideGameHUD() {
        if (this.elements.gameHud) {
            this.elements.gameHud.classList.add('hidden');
        }
    }

    /**
     * Update the location name display
     */
    updateLocationName(name) {
        if (this.elements.locationName) {
            this.elements.locationName.textContent = name;
        }
    }

    /**
     * Show a notification
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '1rem 2rem',
            background: 'rgba(10, 10, 15, 0.95)',
            border: '2px solid #c9a227',
            color: '#f4e4bc',
            fontFamily: '"Cinzel", serif',
            fontSize: '1.1rem',
            zIndex: '1000',
            animation: 'fadeIn 0.3s ease'
        });

        document.body.appendChild(notification);

        // Remove after duration
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    /**
     * Show evidence collected notification
     */
    showEvidenceCollected(evidence) {
        this.showNotification(`Evidence collected: ${evidence.name}`, 'evidence', 4000);
    }

    /**
     * Update the evidence panel
     */
    updateEvidencePanel() {
        if (!this.elements.evidenceList) return;

        const evidence = this.game.player.evidence;

        if (evidence.length === 0) {
            this.elements.evidenceList.innerHTML = '<p style="color: var(--color-text-dim);">No evidence collected yet.</p>';
            return;
        }

        let html = '';
        for (const item of evidence) {
            html += `
                <div class="evidence-item" data-id="${item.id}">
                    <strong>${item.name}</strong>
                    <p style="font-size: 0.9rem; color: var(--color-text-dim);">${item.description}</p>
                </div>
            `;
        }

        this.elements.evidenceList.innerHTML = html;

        // Add click handlers
        const items = this.elements.evidenceList.querySelectorAll('.evidence-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.showEvidenceDetail(id);
            });
        });
    }

    /**
     * Show detailed evidence view
     */
    showEvidenceDetail(evidenceId) {
        const evidence = this.game.player.getEvidence(evidenceId);
        if (!evidence) return;

        // Mark as examined
        this.game.player.examineEvidence(evidenceId);

        // Show in a modal (simplified for now)
        const dialogue = [{
            speaker: 'Evidence',
            text: `${evidence.name}: ${evidence.fullDescription || evidence.description}`,
            portrait: 'default'
        }];

        this.game.dialogue.startDialogue(dialogue);
    }

    /**
     * Show travel menu
     */
    showTravelMenu() {
        const destinations = this.game.scenes.getAvailableDestinations();

        // Create modal
        const modal = this.createModal('Travel', 'Where would you like to go?');

        // Add destination buttons
        const content = modal.querySelector('.modal-content');
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '0.5rem';
        buttonContainer.style.marginTop = '1rem';

        for (const dest of destinations) {
            const btn = document.createElement('button');
            btn.textContent = dest.name;
            btn.style.cssText = `
                font-family: 'Cinzel', serif;
                padding: 0.75rem;
                background: var(--color-bg-light);
                border: 1px solid var(--color-silver);
                color: var(--color-parchment);
                cursor: pointer;
            `;
            btn.addEventListener('click', () => {
                modal.remove();
                this.game.scenes.travelTo(dest.id);
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = '#c9a227';
                btn.style.color = '#c9a227';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.borderColor = '#a8b2c1';
                btn.style.color = '#f4e4bc';
            });
            buttonContainer.appendChild(btn);
        }

        content.appendChild(buttonContainer);
        document.body.appendChild(modal);
    }

    /**
     * Create a modal dialog
     */
    createModal(title, message) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            background: var(--color-bg-medium);
            border: 3px solid var(--color-gold);
            padding: 2rem;
            min-width: 300px;
            max-width: 500px;
        `;

        modal.innerHTML = `
            <h2 style="font-family: 'Cinzel', serif; color: var(--color-gold); margin-bottom: 1rem;">${title}</h2>
            <div class="modal-content">
                <p style="color: var(--color-parchment);">${message}</p>
            </div>
        `;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on Escape
        const escHandler = (e) => {
            if (e.code === 'Escape') {
                overlay.remove();
                window.removeEventListener('keydown', escHandler);
            }
        };
        window.addEventListener('keydown', escHandler);

        overlay.appendChild(modal);
        return overlay;
    }

    /**
     * Show rank up celebration
     */
    showRankUp(newRank) {
        const modal = this.createModal('Promotion!', '');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin: 1rem 0;">${newRank.badge}</div>
                <h3 style="font-family: 'Cinzel', serif; color: ${newRank.color}; font-size: 1.5rem;">
                    ${newRank.name}
                </h3>
                <p style="color: var(--color-text-dim); margin-top: 1rem;">
                    ${newRank.description}
                </p>
                <button id="rank-up-continue" style="
                    margin-top: 1.5rem;
                    font-family: 'Cinzel', serif;
                    padding: 0.75rem 2rem;
                    background: var(--color-gold);
                    border: none;
                    color: var(--color-bg-dark);
                    cursor: pointer;
                    font-size: 1rem;
                ">Continue</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#rank-up-continue').addEventListener('click', () => {
            modal.remove();
        });
    }
}
