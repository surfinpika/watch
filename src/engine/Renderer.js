/**
 * Renderer
 * Handles all canvas drawing operations
 */

export class Renderer {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = null;
        this.width = config.width;
        this.height = config.height;
        this.scale = config.scale;

        // Colors from our palette
        this.colors = {
            bgDark: '#0a0a0f',
            bgMedium: '#1a1a24',
            bgLight: '#2a2a3a',
            oceanDeep: '#0d3b4c',
            oceanMid: '#1a5f7a',
            oceanLight: '#2d8fb3',
            sand: '#d4a574',
            palm: '#2d5a3d',
            coral: '#e07a5f',
            gold: '#c9a227',
            silver: '#a8b2c1',
            parchment: '#f4e4bc',
            text: '#e0ddd4',
            textDim: '#8a8580'
        };
    }

    /**
     * Initialize the renderer
     */
    init() {
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resize();

        // Handle window resize
        window.addEventListener('resize', () => this.resize());

        // Enable pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * Resize canvas to fit container while maintaining aspect ratio
     */
    resize() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const aspectRatio = this.width / this.height;
        const containerRatio = containerWidth / containerHeight;

        let displayWidth, displayHeight;

        if (containerRatio > aspectRatio) {
            displayHeight = containerHeight;
            displayWidth = displayHeight * aspectRatio;
        } else {
            displayWidth = containerWidth;
            displayHeight = displayWidth / aspectRatio;
        }

        // Set display size
        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;

        // Set actual canvas size
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Store scale for input calculations
        this.displayScale = displayWidth / this.width;
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = this.colors.bgMedium;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draw a filled rectangle
     */
    fillRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    /**
     * Draw a stroked rectangle
     */
    strokeRect(x, y, width, height, color, lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x, y, width, height);
    }

    /**
     * Draw text
     */
    drawText(text, x, y, options = {}) {
        const {
            color = this.colors.text,
            font = '16px "Crimson Text", Georgia, serif',
            align = 'left',
            baseline = 'top'
        } = options;

        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillText(text, x, y);
    }

    /**
     * Draw an image
     */
    drawImage(image, x, y, width, height) {
        if (image && image.complete) {
            this.ctx.drawImage(image, x, y, width, height);
        }
    }

    /**
     * Draw a sprite from a spritesheet
     */
    drawSprite(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (image && image.complete) {
            this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        }
    }

    /**
     * Draw a circle
     */
    fillCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Draw a line
     */
    drawLine(x1, y1, x2, y2, color, lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    /**
     * Draw the background for a location
     */
    drawLocationBackground(location) {
        // For now, draw a placeholder background based on location type
        const bgColors = {
            interior: this.colors.bgLight,
            exterior: this.colors.oceanDeep
        };

        const color = bgColors[location.type] || this.colors.bgMedium;
        this.fillRect(0, 0, this.width, this.height, color);

        // Draw some atmospheric elements based on district
        this.drawDistrictAtmosphere(location);
    }

    /**
     * Draw atmospheric elements for a district
     */
    drawDistrictAtmosphere(location) {
        switch (location.district) {
            case 'coast':
                this.drawBeachBackground();
                break;
            case 'docks':
                this.drawDocksBackground();
                break;
            case 'noble':
                this.drawNobleBackground();
                break;
            case 'ruins':
                this.drawRuinsBackground();
                break;
            default:
                this.drawCityBackground();
        }
    }

    /**
     * Draw beach background elements
     */
    drawBeachBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
        gradient.addColorStop(0, '#1a3a5c');
        gradient.addColorStop(1, '#2d6b8a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height * 0.6);

        // Ocean
        const oceanGradient = this.ctx.createLinearGradient(0, this.height * 0.4, 0, this.height * 0.7);
        oceanGradient.addColorStop(0, this.colors.oceanMid);
        oceanGradient.addColorStop(1, this.colors.oceanDeep);
        this.ctx.fillStyle = oceanGradient;
        this.ctx.fillRect(0, this.height * 0.4, this.width, this.height * 0.3);

        // Sand
        this.ctx.fillStyle = this.colors.sand;
        this.ctx.fillRect(0, this.height * 0.7, this.width, this.height * 0.3);

        // Wave lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const y = this.height * 0.65 + i * 20;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            for (let x = 0; x < this.width; x += 50) {
                this.ctx.quadraticCurveTo(x + 25, y - 5, x + 50, y);
            }
            this.ctx.stroke();
        }
    }

    /**
     * Draw docks background elements
     */
    drawDocksBackground() {
        // Dark water
        this.ctx.fillStyle = this.colors.oceanDeep;
        this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);

        // Wooden pier
        this.ctx.fillStyle = '#4a3728';
        this.ctx.fillRect(0, this.height * 0.6, this.width, 20);

        // Pier planks
        this.ctx.strokeStyle = '#3a2718';
        for (let x = 0; x < this.width; x += 30) {
            this.drawLine(x, this.height * 0.6, x, this.height * 0.6 + 20, '#3a2718', 2);
        }

        // Sky
        this.ctx.fillStyle = '#1a2a3a';
        this.ctx.fillRect(0, 0, this.width, this.height * 0.5);
    }

    /**
     * Draw noble district background
     */
    drawNobleBackground() {
        // Marble-like floor
        this.ctx.fillStyle = '#e8e0d5';
        this.ctx.fillRect(0, this.height * 0.7, this.width, this.height * 0.3);

        // Wall
        this.ctx.fillStyle = '#d0c8bc';
        this.ctx.fillRect(0, 0, this.width, this.height * 0.7);

        // Decorative trim
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.fillRect(0, this.height * 0.68, this.width, 8);
    }

    /**
     * Draw ruins background
     */
    drawRuinsBackground() {
        // Dark, ominous sky
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0a0f');
        gradient.addColorStop(0.5, '#1a1a24');
        gradient.addColorStop(1, '#0d3b4c');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Broken pillars (simple rectangles for now)
        this.ctx.fillStyle = '#3a3a4a';
        this.ctx.fillRect(100, this.height * 0.4, 40, this.height * 0.6);
        this.ctx.fillRect(200, this.height * 0.5, 35, this.height * 0.5);
        this.ctx.fillRect(this.width - 150, this.height * 0.35, 45, this.height * 0.65);
    }

    /**
     * Draw generic city background
     */
    drawCityBackground() {
        // Stone walls
        this.ctx.fillStyle = '#4a4a5a';
        this.ctx.fillRect(0, 0, this.width, this.height * 0.7);

        // Cobblestone floor
        this.ctx.fillStyle = '#3a3a4a';
        this.ctx.fillRect(0, this.height * 0.7, this.width, this.height * 0.3);

        // Draw some stone texture lines
        this.ctx.strokeStyle = '#2a2a3a';
        for (let y = 0; y < this.height * 0.7; y += 40) {
            this.drawLine(0, y, this.width, y, '#2a2a3a', 1);
        }
    }

    /**
     * Draw a character sprite (placeholder)
     */
    drawCharacter(x, y, character, facing = 'down') {
        const size = 48;

        // Body
        this.fillCircle(x + size / 2, y + size * 0.7, size * 0.35, character.color || this.colors.coral);

        // Head
        this.fillCircle(x + size / 2, y + size * 0.3, size * 0.25, this.colors.sand);

        // Eyes based on facing
        const eyeY = y + size * 0.28;
        if (facing !== 'up') {
            this.fillCircle(x + size * 0.4, eyeY, 3, this.colors.bgDark);
            this.fillCircle(x + size * 0.6, eyeY, 3, this.colors.bgDark);
        }
    }

    /**
     * Draw the player character
     */
    drawPlayer(x, y, facing = 'down') {
        this.drawCharacter(x, y, { color: '#3498db' }, facing);

        // Draw watch badge
        this.fillCircle(x + 38, y + 30, 6, this.colors.gold);
    }

    /**
     * Draw an NPC
     */
    drawNPC(x, y, npc, facing = 'down') {
        this.drawCharacter(x, y, npc, facing);

        // Draw interaction indicator if nearby
        if (npc.canInteract) {
            this.drawText('!', x + 24, y - 15, {
                color: this.colors.gold,
                font: 'bold 20px "Cinzel", serif',
                align: 'center'
            });
        }
    }

    /**
     * Apply a screen effect (fade, flash, etc.)
     */
    applyEffect(effect, progress) {
        switch (effect) {
            case 'fadeOut':
                this.ctx.fillStyle = `rgba(10, 10, 15, ${progress})`;
                this.ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'fadeIn':
                this.ctx.fillStyle = `rgba(10, 10, 15, ${1 - progress})`;
                this.ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'flash':
                this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - progress})`;
                this.ctx.fillRect(0, 0, this.width, this.height);
                break;
        }
    }
}
