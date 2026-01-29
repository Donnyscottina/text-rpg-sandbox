/**
 * MovementSystem - Handles player movement
 */
export class MovementSystem {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('movement:move', (data) => this.move(data.direction));
    }

    move(direction) {
        if (this.gameState.isInCombat()) {
            this.eventBus.emit('message:error', 'Вы не можете уйти во время боя! Используйте "flee" чтобы убежать.');
            return false;
        }
        
        const currentLocation = this.gameState.getCurrentLocation();
        
        if (!currentLocation.exits || !currentLocation.exits[direction]) {
            this.eventBus.emit('message:error', 'Вы не можете пойти в этом направлении.');
            return false;
        }
        
        const newLocationId = currentLocation.exits[direction];
        const newLocation = this.gameState.getWorldMap().getLocation(newLocationId);
        
        if (!newLocation) {
            this.eventBus.emit('message:error', 'Локация не найдена.');
            return false;
        }
        
        this.gameState.setLocation(newLocation);
        
        const dirLabels = {
            north: 'север',
            south: 'юг',
            east: 'восток',
            west: 'запад',
            up: 'вверх',
            down: 'вниз'
        };
        
        this.eventBus.emit('message:success', `Вы идете на ${dirLabels[direction] || direction}...`);
        this.eventBus.emit('command:execute', 'look');
        
        return true;
    }
}