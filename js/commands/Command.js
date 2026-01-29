// js/commands/Command.js - Базовый класс команды (Command Pattern)
export class Command {
    constructor() {
        this.name = 'command';
    }

    execute(state, eventBus) {
        throw new Error('Command.execute() must be implemented');
    }

    canExecute(state) {
        return true;
    }

    getHelp() {
        return 'Нет описания';
    }
}
