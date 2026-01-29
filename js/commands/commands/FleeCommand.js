// js/commands/commands/FleeCommand.js
import { Command } from '../Command.js';

export class FleeCommand extends Command {
    execute(gameState, eventBus) {
        eventBus.emit('combat:flee');
    }
}