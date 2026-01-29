// js/systems/InventorySystem.js - Система управления инвентарем
export class InventorySystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('inventory:useItem', (data) => this.handleUseItem(data));
        this.eventBus.on('inventory:addItem', (data) => this.handleAddItem(data));
        this.eventBus.on('inventory:removeItem', (data) => this.handleRemoveItem(data));
    }

    handleUseItem({ itemName, state }) {
        const player = state.getPlayer();
        const inventory = player.getInventory();
        const item = inventory.findItem(itemName);
        
        if (!item) {
            this.eventBus.emit('message:error', 'У вас нет такого предмета.');
            return false;
        }
        
        // Использование предмета
        const combat = state.getCombat();
        this.eventBus.emit('combat:useItem', { item, state, combat });
        
        // Удаляем из инвентаря
        inventory.removeItem(item.name, 1);
        this.eventBus.emit('inventory:changed');
        
        return true;
    }

    handleAddItem({ item, count, state }) {
        const player = state.getPlayer();
        const inventory = player.getInventory();
        
        const success = inventory.addItem(item, count);
        
        if (success) {
            this.eventBus.emit('message:success', `Получено: ${item.name} x${count}`);
            this.eventBus.emit('inventory:changed');
        } else {
            this.eventBus.emit('message:error', 'Инвентарь полон!');
        }
        
        return success;
    }

    handleRemoveItem({ itemName, count, state }) {
        const player = state.getPlayer();
        const inventory = player.getInventory();
        
        const success = inventory.removeItem(itemName, count);
        
        if (success) {
            this.eventBus.emit('inventory:changed');
        }
        
        return success;
    }
}
