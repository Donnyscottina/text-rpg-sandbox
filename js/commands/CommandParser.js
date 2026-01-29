import { LookCommand, MoveCommand, AttackCommand, TalkCommand, FleeCommand, UseCommand, ExamineCommand, InventoryCommand, StatsCommand, RestCommand, HelpCommand } from './GameCommands.js';

/**
 * CommandParser - Parses user input into executable commands
 * Implements Command Pattern
 */
export class CommandParser {
    constructor() {
        this.commandRegistry = new Map();
        this.registerCommands();
    }

    registerCommands() {
        // Help
        this.register(['help', 'помощь', '?'], () => new HelpCommand());
        
        // Look
        this.register(['look', 'осмотреться', 'l', 'о'], () => new LookCommand());
        
        // Movement
        this.register(['north', 'n', 'север', 'с'], () => new MoveCommand('north'));
        this.register(['south', 's', 'юг', 'ю'], () => new MoveCommand('south'));
        this.register(['east', 'e', 'восток', 'в'], () => new MoveCommand('east'));
        this.register(['west', 'w', 'запад', 'з'], () => new MoveCommand('west'));
        this.register(['up', 'u', 'вверх', 'вв'], () => new MoveCommand('up'));
        this.register(['down', 'd', 'вниз', 'вн'], () => new MoveCommand('down'));
        
        // Combat
        this.register(['attack', 'атаковать', 'а'], (args) => new AttackCommand(args));
        this.register(['flee', 'бежать', 'убежать', 'б'], () => new FleeCommand());
        
        // Interaction
        this.register(['talk', 'говорить', 'т'], (args) => new TalkCommand(args));
        this.register(['use', 'использовать', 'и'], (args) => new UseCommand(args));
        this.register(['examine', 'осмотреть', 'x', 'х'], (args) => new ExamineCommand(args));
        
        // Info
        this.register(['inventory', 'инвентарь', 'i', 'инв'], () => new InventoryCommand());
        this.register(['stats', 'статистика', 'ст'], () => new StatsCommand());
        
        // Actions
        this.register(['rest', 'отдохнуть', 'р'], () => new RestCommand());
    }

    register(aliases, commandFactory) {
        aliases.forEach(alias => {
            this.commandRegistry.set(alias.toLowerCase(), commandFactory);
        });
    }

    parse(input) {
        const parts = input.trim().toLowerCase().split(' ');
        const commandName = parts[0];
        const args = parts.slice(1).join(' ');

        const commandFactory = this.commandRegistry.get(commandName);
        if (!commandFactory) {
            return null;
        }

        return commandFactory(args);
    }

    getAllCommands() {
        const commands = new Set();
        for (const key of this.commandRegistry.keys()) {
            commands.add(key);
        }
        return Array.from(commands);
    }
}