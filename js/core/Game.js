// js/core/Game.js
import { GameState } from './GameState.js';
import { EventBus } from './EventBus.js';
import { UIManager } from '../ui/UIManager.js';
import { CommandParser } from '../commands/CommandParser.js';

export class Game {
    constructor() {
        this.eventBus = new EventBus();
        this.state = new GameState(this.eventBus);
        this.ui = new UIManager(this.eventBus);
        this.commandParser = new CommandParser(this.state, this.eventBus);
    }

    async init() {
        console.log('🎮 Initializing game...');
        
        this.setupEventListeners();
        this.ui.init();
        this.state.init();
        
        this.eventBus.emit('message:system', 'Добро пожаловать в Text RPG Sandbox!');
        this.eventBus.emit('message:system', 'Наберите "help" для списка команд.');
        this.eventBus.emit('command:look');
    }

    setupEventListeners() {
        this.eventBus.on('command:input', (cmd) => this.handleCommand(cmd));
    }

    handleCommand(input) {
        this.commandParser.parse(input);
    }

    save() {
        const saveData = this.state.serialize();
        localStorage.setItem('rpg_save', JSON.stringify(saveData));
        this.eventBus.emit('message:success', '💾 Игра сохранена!');
    }

    load() {
        const data = localStorage.getItem('rpg_save');
        if (data) {
            this.state.deserialize(JSON.parse(data));
            this.eventBus.emit('message:success', '📂 Игра загружена!');
            this.eventBus.emit('game:update');
        } else {
            this.eventBus.emit('message:error', 'Нет сохраненной игры!');
        }
    }
}