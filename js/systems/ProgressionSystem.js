/**
 * ProgressionSystem - Handles player progression (leveling, XP)
 */
export class ProgressionSystem {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('player:levelup', (data) => this.handleLevelUp(data));
    }

    handleLevelUp(data) {
        this.eventBus.emit('message:success', '★ УРОВЕНЬ ПОВЫШЕН! ★');
        this.eventBus.emit('message:success', `Теперь вы ${data.level} уровня!`);
        this.eventBus.emit('message:success', 'Характеристики увеличены!');
        
        const inc = data.increases;
        this.eventBus.emit('message:info', 
            `HP +${inc.hp}, MP +${inc.mp}, Атака +${inc.attack}, Защита +${inc.defense}`
        );
    }
}