// core/Game.js - Главный игровой контроллер
import { GameState } from './GameState.js';
import { EventBus } from './EventBus.js';
import { UIManager } from '../ui/UIManager.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { MovementSystem } from '../systems/MovementSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { ProgressionSystem } from '../systems/ProgressionSystem.js';
import { CommandParser } from '../commands/CommandParser.js';
import { WorldMap } from '../world/WorldMap.js';
import { StorageManager } from '../utils/storage.js';
import { LookCommand } from '../commands/commands/LookCommand.js';

export class Game {
    constructor() {
        this.eventBus = new EventBus();
        this.state = new GameState(this.eventBus);
        this.uiManager = new UIManager(this.eventBus);
        this.combatSystem = new CombatSystem(this.eventBus);
        this.movementSystem = new MovementSystem(this.eventBus);
        this.inventorySystem = new InventorySystem(this.eventBus);
        this.progressionSystem = new ProgressionSystem(this.eventBus);
        this.commandParser = new CommandParser();
        
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        await this.loadGameData();
        this.setupEventListeners();
        this.uiManager.init();
        this.startGame();
        
        this.initialized = true;
    }

    async loadGameData() {
        const worldMap = new WorldMap();
        await worldMap.init();
        this.state.setWorldMap(worldMap);
    }

    setupEventListeners() {
        this.eventBus.on('command:execute', (cmd) => this.handleCommand(cmd));
        this.eventBus.on('player:died', () => this.handleGameOver());
        this.eventBus.on('player:levelup', (data) => this.handleLevelUp(data));
    }

    handleCommand(commandStr) {
        if (!commandStr || !commandStr.trim()) return;
        
        this.state.addToHistory(commandStr);
        this.eventBus.emit('message:info', '> ' + commandStr);
        
        const command = this.commandParser.parse(commandStr);
        if (!command) {
            this.eventBus.emit('message:error', 'Неизвестная команда. Наберите "help" для списка команд.');
            return;
        }
        
        try {
            command.execute(this.state, this.eventBus);
        } catch (error) {
            console.error('Command execution error:', error);
            this.eventBus.emit('message:error', 'Ошибка выполнения команды.');
        }
    }

    startGame() {
        this.eventBus.emit('game:started');
        this.eventBus.emit('message:system', 'Добро пожаловать в игру! Наберите "help" для списка команд.');
        this.eventBus.emit('message:system', 'Используйте кнопки команд, WASD/стрелки для перемещения, или кликайте по карте.');
        
        const lookCmd = new LookCommand();
        lookCmd.execute(this.state, this.eventBus);
    }

    handleGameOver() {
        this.eventBus.emit('message:error', 'ИГРА ОКОНЧЕНА!');
        this.eventBus.emit('message:system', 'Обновите страницу или нажмите Reset для новой игры.');
        this.uiManager.disableInput();
    }

    handleLevelUp(data) {
        this.eventBus.emit('message:success', `★ УРОВЕНЬ ПОВЫШЕН! Теперь вы ${data.level} уровня!`);
        this.eventBus.emit('message:success', 'Характеристики увеличены!');
    }

    save() {
        try {
            const saveData = this.state.serialize();
            StorageManager.save('rpg_save', saveData);
            this.eventBus.emit('message:system', '💾 Игра сохранена!');
        } catch (error) {
            console.error('Save error:', error);
            this.eventBus.emit('message:error', 'Ошибка сохранения!');
        }
    }

    load() {
        try {
            const saveData = StorageManager.load('rpg_save');
            if (saveData) {
                this.state.deserialize(saveData);
                this.eventBus.emit('message:system', '📂 Игра загружена!');
                this.eventBus.emit('ui:refresh');
                
                const lookCmd = new LookCommand();
                lookCmd.execute(this.state, this.eventBus);
            } else {
                this.eventBus.emit('message:error', 'Сохранение не найдено!');
            }
        } catch (error) {
            console.error('Load error:', error);
            this.eventBus.emit('message:error', 'Ошибка загрузки!');
        }
    }

    reset() {
        StorageManager.clear();
        window.location.reload();
    }
}
