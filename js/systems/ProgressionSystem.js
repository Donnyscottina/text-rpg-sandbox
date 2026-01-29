// js/systems/ProgressionSystem.js - Система прогресса
export class ProgressionSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('progression:addXp', (data) => this.handleAddXp(data));
        this.eventBus.on('progression:addGold', (data) => this.handleAddGold(data));
    }

    handleAddXp({ amount, state }) {
        const player = state.getPlayer();
        const levelUpData = player.addXp(amount);
        
        if (levelUpData) {
            this.eventBus.emit('player:levelup', levelUpData);
        }
        
        this.eventBus.emit('progression:changed');
    }

    handleAddGold({ amount, state }) {
        const player = state.getPlayer();
        player.addGold(amount);
        this.eventBus.emit('progression:changed');
    }

    checkLevelUp(player) {
        if (player.xp >= player.xpNeeded) {
            return player.levelUp();
        }
        return null;
    }
}
