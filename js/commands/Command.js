// js/commands/Command.js - Базовый класс команды (Command Pattern)
export class Command {
    execute(gameState, eventBus) {
        throw new Error('Command.execute() must be implemented');
    }
}