// js/commands/commands/MoveCommand.js
import { Command } from '../Command.js';

export class MoveCommand extends Command {
    constructor(direction) {
        super();
        this.direction = direction;
    }

    execute(gameState, eventBus) {
        eventBus.emit('movement:go', this.direction);
    }
}