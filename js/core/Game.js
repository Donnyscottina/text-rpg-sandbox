import { EventBus } from './EventBus.js';
import { GameState } from './GameState.js';
import { WorldMap } from '../world/WorldMap.js';
import { UIManager } from '../ui/UIManager.js';
import { CommandParser } from '../commands/CommandParser.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { MovementSystem } from '../systems/MovementSystem.js';
import { ProgressionSystem } from '../systems/ProgressionSystem.js';
import { StorageManager } from '../utils/StorageManager.js';

/**
 * Game - Main game controller
 * Coordinates all game systems and manages lifecycle
 */
export class Game {
    constructor() {
        this.eventBus = new EventBus();
        this.state = new GameState();
        this.commandParser = new CommandParser();
        
        // Systems
        this.uiManager = new UIManager(this.eventBus);
        this.combatSystem = new CombatSystem(this.eventBus, this.state);
        this.movementSystem = new MovementSystem(this.eventBus, this.state);
        this.progressionSystem = new ProgressionSystem(this.eventBus, this.state);
        
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        console.log('🎮 Initializing game...');
        
        // Initialize world
        const worldMap = new WorldMap();
        worldMap.init();
        this.state.setWorldMap(worldMap);
        
        // Initialize player
        this.state.initPlayer();
        
        // Set starting location
        const startLocation = worldMap.getLocation('town_square');
        this.state.setLocation(startLocation);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.uiManager.init(this.state);
        
        // Start game
        this.startGame();
        
        this.initialized = true;
        console.log('✅ Game initialized successfully');
    }

    setupEventListeners() {
        // Command events
        this.eventBus.on('command:execute', (cmd) => this.handleCommand(cmd));
        
        // Player events
        this.eventBus.on('player:died', () => this.handleGameOver());
        
        // Combat events are handled by CombatSystem
        
        // UI events
        this.eventBus.on('ui:save', () => this.save());
        this.eventBus.on('ui:load', () => this.load());
        this.eventBus.on('ui:reset', () => this.reset());
    }

    handleCommand(commandStr) {
        commandStr = commandStr.trim();
        if (!commandStr) return;
        
        this.state.addToHistory(commandStr);
        this.eventBus.emit('message:info', '> ' + commandStr);
        
        const command = this.commandParser.parse(commandStr);
        
        if (!command) {
            this.eventBus.emit('message:error', 'Неизвестная команда. Наберите "help" для списка команд.');
            return;
        }
        
        command.execute(this.state, this.eventBus);
        this.uiManager.refresh(this.state);
    }

    startGame() {
        this.eventBus.emit('game:started');
        this.eventBus.emit('message:system', 'Добро пожаловать в игру! Наберите "help" для списка команд.');
        this.eventBus.emit('message:system', 'Используйте кнопки команд, WASD/стрелки для перемещения, или кликайте по карте.');
        
        // Show initial location
        this.eventBus.emit('command:execute', 'look');
    }

    handleGameOver() {
        this.eventBus.emit('message:error', 'ИГРА ОКОНЧЕНА!');
        this.eventBus.emit('message:system', 'Обновите страницу для начала новой игры.');
        this.uiManager.disableInput();
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
                this.uiManager.refresh(this.state);
                this.eventBus.emit('command:execute', 'look');
            } else {
                this.eventBus.emit('message:error', 'Нет сохраненных игр!');
            }
        } catch (error) {
            console.error('Load error:', error);
            this.eventBus.emit('message:error', 'Ошибка загрузки!');
        }
    }

    reset() {
        if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
            StorageManager.clear();
            location.reload();
        }
    }
}