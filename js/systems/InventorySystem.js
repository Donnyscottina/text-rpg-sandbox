// js/systems/InventorySystem.js - Система инвентаря
export class InventorySystem {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('inventory:use', (itemName) => this.useItem(itemName));
    }

    useItem(itemName) {
        const player = this.gameState.getPlayer();
        const inventory = player.getInventory();
        const item = inventory.findItem(itemName);
        
        if (!item) {
            this.eventBus.emit('message:error', 'У вас нет такого предмета.');
            return;
        }
        
        if (item.effect === 'heal') {
            const healAmount = player.heal(item.value);
            this.eventBus.emit('message:success', 
                `Вы использовали ${item.name} и восстановили ${healAmount} HP.`
            );
            
            inventory.removeItem(item);
            
            // Enemy counter-attack in combat
            if (this.gameState.isInCombat()) {
                const combat = this.gameState.getCombat();
                const result = combat.enemyAttack();
                this.eventBus.emit('message:combat',
                    `${result.enemy.name} атакует пока вы лечитесь! Получено ${result.enemyDamage} урона.`
                );
                
                if (result.playerDefeated) {
                    this.gameState.endCombat();
                    this.eventBus.emit('player:died');
                }
            }
        }
    }
}