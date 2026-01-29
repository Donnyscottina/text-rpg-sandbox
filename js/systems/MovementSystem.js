// js/systems/MovementSystem.js - Система перемещения
export class MovementSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('movement:move', (data) => this.handleMove(data));
        this.eventBus.on('movement:teleport', (data) => this.handleTeleport(data));
    }

    handleMove({ direction, state }) {
        if (state.isInCombat()) {
            this.eventBus.emit('message:error', 'Вы не можете уйти во время боя! Используйте "flee" чтобы убежать.');
            return false;
        }
        
        const currentLocation = state.getCurrentLocation();
        const exits = currentLocation.getExits();
        
        if (!exits || !exits[direction]) {
            this.eventBus.emit('message:error', 'Вы не можете пойти в этом направлении.');
            return false;
        }
        
        const newLocationId = exits[direction];
        const newLocation = state.getWorldMap().getLocation(newLocationId);
        
        state.setLocation(newLocation);
        
        const dirLabels = {
            north: 'север',
            south: 'юг',
            east: 'восток',
            west: 'запад',
            up: 'вверх',
            down: 'вниз'
        };
        
        this.eventBus.emit('message:success', `Вы идете на ${dirLabels[direction] || direction}...`);
        this.eventBus.emit('movement:completed', { location: newLocation });
        
        return true;
    }

    handleTeleport({ locationId, state }) {
        const newLocation = state.getWorldMap().getLocation(locationId);
        
        if (!newLocation) {
            this.eventBus.emit('message:error', 'Локация не найдена!');
            return false;
        }
        
        state.setLocation(newLocation);
        this.eventBus.emit('message:system', `Телепортация в: ${newLocation.name}`);
        this.eventBus.emit('movement:completed', { location: newLocation });
        
        return true;
    }
}
