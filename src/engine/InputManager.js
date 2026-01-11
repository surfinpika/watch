/**
 * Input Manager
 * Handles keyboard and mouse input
 */

export class InputManager {
    constructor() {
        // Current key states
        this.keys = {};
        this.keysJustPressed = {};
        this.keysJustReleased = {};

        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            buttons: {},
            buttonsJustPressed: {},
            buttonsJustReleased: {}
        };

        // Key bindings
        this.bindings = {
            up: ['ArrowUp', 'KeyW'],
            down: ['ArrowDown', 'KeyS'],
            left: ['ArrowLeft', 'KeyA'],
            right: ['ArrowRight', 'KeyD'],
            interact: ['KeyE', 'Enter', 'Space'],
            cancel: ['Escape', 'KeyQ'],
            menu: ['Escape', 'KeyM'],
            evidence: ['KeyI', 'Tab'],
            sprint: ['ShiftLeft', 'ShiftRight']
        };
    }

    /**
     * Initialize input handlers
     */
    init() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Mouse events
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
            canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
            canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
            canvas.addEventListener('click', (e) => this.onClick(e));
        }

        // Prevent context menu on right click
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Handle key down
     */
    onKeyDown(event) {
        const code = event.code;

        // Prevent default for game keys
        if (this.isGameKey(code)) {
            event.preventDefault();
        }

        if (!this.keys[code]) {
            this.keysJustPressed[code] = true;
        }
        this.keys[code] = true;
    }

    /**
     * Handle key up
     */
    onKeyUp(event) {
        const code = event.code;
        this.keys[code] = false;
        this.keysJustReleased[code] = true;
    }

    /**
     * Handle mouse move
     */
    onMouseMove(event) {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        this.mouse.x = (event.clientX - rect.left) * scaleX;
        this.mouse.y = (event.clientY - rect.top) * scaleY;
    }

    /**
     * Handle mouse down
     */
    onMouseDown(event) {
        if (!this.mouse.buttons[event.button]) {
            this.mouse.buttonsJustPressed[event.button] = true;
        }
        this.mouse.buttons[event.button] = true;
    }

    /**
     * Handle mouse up
     */
    onMouseUp(event) {
        this.mouse.buttons[event.button] = false;
        this.mouse.buttonsJustReleased[event.button] = true;
    }

    /**
     * Handle click
     */
    onClick(event) {
        // Dispatch custom event for click handling
        const customEvent = new CustomEvent('gameClick', {
            detail: {
                x: this.mouse.x,
                y: this.mouse.y,
                button: event.button
            }
        });
        window.dispatchEvent(customEvent);
    }

    /**
     * Check if a key is a game key
     */
    isGameKey(code) {
        for (const action in this.bindings) {
            if (this.bindings[action].includes(code)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Update input state (call at end of frame)
     */
    update() {
        // Clear just pressed/released states
        this.keysJustPressed = {};
        this.keysJustReleased = {};
        this.mouse.buttonsJustPressed = {};
        this.mouse.buttonsJustReleased = {};
    }

    /**
     * Check if an action is being held
     */
    isActionHeld(action) {
        const keys = this.bindings[action];
        if (!keys) return false;
        return keys.some(key => this.keys[key]);
    }

    /**
     * Check if an action was just pressed
     */
    isActionPressed(action) {
        const keys = this.bindings[action];
        if (!keys) return false;
        return keys.some(key => this.keysJustPressed[key]);
    }

    /**
     * Check if an action was just released
     */
    isActionReleased(action) {
        const keys = this.bindings[action];
        if (!keys) return false;
        return keys.some(key => this.keysJustReleased[key]);
    }

    /**
     * Check if a specific key is held
     */
    isKeyHeld(code) {
        return !!this.keys[code];
    }

    /**
     * Check if a specific key was just pressed
     */
    isKeyPressed(code) {
        return !!this.keysJustPressed[code];
    }

    /**
     * Get movement direction as a vector
     */
    getMovementVector() {
        let x = 0;
        let y = 0;

        if (this.isActionHeld('left')) x -= 1;
        if (this.isActionHeld('right')) x += 1;
        if (this.isActionHeld('up')) y -= 1;
        if (this.isActionHeld('down')) y += 1;

        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }

        return { x, y };
    }

    /**
     * Get mouse position
     */
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }

    /**
     * Check if left mouse button is held
     */
    isLeftMouseHeld() {
        return !!this.mouse.buttons[0];
    }

    /**
     * Check if left mouse button was just pressed
     */
    isLeftMousePressed() {
        return !!this.mouse.buttonsJustPressed[0];
    }

    /**
     * Check if right mouse button was just pressed
     */
    isRightMousePressed() {
        return !!this.mouse.buttonsJustPressed[2];
    }
}
