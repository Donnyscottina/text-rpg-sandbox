// js/systems/ProgressionSystem.js - Система прогресса
export class ProgressionSystem {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('progression:rest', () => this.rest());
    }

    rest() {
        const loc = this.gameState.getCurrentLocation();
        
        if (this.gameState.isInCombat()) {
            this.eventBus.emit('message:error', 'Невозможно отдохнуть во время боя!');
            return;
        }
        
        if (loc.type === 'town') {
            const player = this.gameState.getPlayer();
            player.rest();
            this.eventBus.emit('message:success', 'Вы отдохнули и полностью восстановили HP и MP.');
        } else {
            this.eventBus.emit('message:error', 'Здесь слишком опасно для отдыха! Найдите безопасное место.');
        }
    }
}