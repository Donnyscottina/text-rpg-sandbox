// js/systems/MovementSystem.js - Система перемещения
export class MovementSystem {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('movement:go', (direction) => this.move(direction));
        this.eventBus.on('movement:mapClick', (coords) => this.handleMapClick(coords));
    }

    move(direction) {
        if (this.gameState.isInCombat()) {
            this.eventBus.emit('message:error', 'Вы не можете уйти во время боя! Используйте "flee" чтобы убежать.');
            return;
        }
        
        const loc = this.gameState.getCurrentLocation();
        
        if (!loc.exits || !loc.exits[direction]) {
            this.eventBus.emit('message:error', 'Вы не можете пойти в этом направлении.');
            return;
        }
        
        const newLocId = loc.exits[direction];
        const newLoc = this.gameState.getWorldMap().getLocation(newLocId);
        
        this.gameState.setLocation(newLoc);
        
        const dirLabels = { 
            north: 'север', south: 'юг', 
            east: 'восток', west: 'запад', 
            up: 'вверх', down: 'вниз' 
        };
        
        this.eventBus.emit('message:success', `Вы идете на ${dirLabels[direction] || direction}...`);
        this.eventBus.emit('command:look');
    }

    handleMapClick(coords) {
        if (this.gameState.isInCombat()) {
            this.eventBus.emit('message:error', 'Нельзя перемещаться во время боя!');
            return;
        }
        
        const player = this.gameState.getPlayer();
        const playerPos = player.getPosition();
        
        const dx = coords.x - playerPos.x;
        const dy = coords.y - playerPos.y;
        
        if (Math.abs(dx) + Math.abs(dy) !== 1) {
            this.eventBus.emit('message:error', 'Можно ходить только на соседние клетки.');
            return;
        }
        
        let direction = null;
        if (dy === -1) direction = 'north';
        else if (dy === 1) direction = 'south';
        else if (dx === 1) direction = 'east';
        else if (dx === -1) direction = 'west';
        
        if (direction) {
            this.move(direction);
        }
    }
}