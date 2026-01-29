// js/commands/commands/UseCommand.js
import { Command } from '../Command.js';

export class UseCommand extends Command {
    constructor(args) {
        super();
        this.itemName = args;
    }

    execute(gameState, eventBus) {
        if (!this.itemName) {
            eventBus.emit('message:error', 'Укажите предмет для использования.');
            return;
        }
        
        eventBus.emit('inventory:use', this.itemName);
    }
}