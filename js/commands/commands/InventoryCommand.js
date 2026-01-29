// js/commands/commands/InventoryCommand.js
import { Command } from '../Command.js';

export class InventoryCommand extends Command {
    execute(gameState, eventBus) {
        const inventory = gameState.getPlayer().getInventory();
        const items = inventory.getItems();
        
        eventBus.emit('message:system', '=== ИНВЕНТАРЬ ===');
        
        if (items.length === 0) {
            eventBus.emit('message:info', 'Пусто');
        } else {
            items.forEach(({ item, count }) => {
                eventBus.emit('message:info', `${item.name} x${count}`);
            });
        }
    }
}