// js/commands/CommandParser.js - Парсер команд (Command Pattern)
import { LookCommand } from './commands/LookCommand.js';
import { MoveCommand } from './commands/MoveCommand.js';
import { AttackCommand } from './commands/AttackCommand.js';
import { TalkCommand } from './commands/TalkCommand.js';
import { UseCommand } from './commands/UseCommand.js';
import { ExamineCommand } from './commands/ExamineCommand.js';
import { InventoryCommand } from './commands/InventoryCommand.js';
import { StatsCommand } from './commands/StatsCommand.js';
import { RestCommand } from './commands/RestCommand.js';
import { FleeCommand } from './commands/FleeCommand.js';
import { HelpCommand } from './commands/HelpCommand.js';

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
        this.register(['up', 'u', 'вв', 'вверх'], () => new MoveCommand('up'));
        this.register(['down', 'd', 'вн', 'вниз'], () => new MoveCommand('down'));
        
        // Combat
        this.register(['attack', 'атаковать', 'а'], (args) => new AttackCommand(args));
        this.register(['flee', 'бежать', 'убежать', 'б'], () => new FleeCommand());
        
        // Interaction
        this.register(['talk', 'говорить', 'т'], (args) => new TalkCommand(args));
        this.register(['use', 'использовать', 'и'], (args) => new UseCommand(args));
        this.register(['examine', 'осмотреть', 'х', 'x'], (args) => new ExamineCommand(args));
        
        // Inventory & Stats
        this.register(['inventory', 'инвентарь', 'i', 'инв'], () => new InventoryCommand());
        this.register(['stats', 'статистика', 'ст'], () => new StatsCommand());
        
        // Rest
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
}