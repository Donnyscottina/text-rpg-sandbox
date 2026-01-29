// js/commands/commands/MoveCommand.js
import { Command } from '../Command.js';
import { LookCommand } from './LookCommand.js';

export class MoveCommand extends Command {
    constructor(direction) {
        super();
        this.name = 'move';
        this.direction = direction;
    }

    execute(state, eventBus) {
        eventBus.emit('movement:move', { direction: this.direction, state });
        
        // После перемещения автоматически осматриваем локацию
        eventBus.once('movement:completed', () => {
            const lookCmd = new LookCommand();
            lookCmd.execute(state, eventBus);
        });
        
        eventBus.emit('ui:refresh');
    }

    canExecute(state) {
        return !state.isInCombat();
    }

    getHelp() {
        return 'north/south/east/west/up/down / n/s/e/w/u/d - Перемещение';
    }
}
