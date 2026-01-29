// js/commands/commands/RestCommand.js
import { Command } from '../Command.js';

export class RestCommand extends Command {
    execute(gameState, eventBus) {
        eventBus.emit('progression:rest');
    }
}