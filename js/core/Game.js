// js/core/Game.js - Главный игровой контроллер
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
        this.state = new GameState();
        this.eventBus = new EventBus();
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
        this.eventBus.on('combat:started', (data) => this.handleCombatStart(data));
        this.eventBus.on('combat:ended', (result) => this.handleCombatEnd(result));
        this.eventBus.on('game:save', () => this.save());
        this.eventBus.on('game:load', () => this.load());
        this.eventBus.on('game:reset', () => this.reset());
    }

    handleCommand(commandStr) {
        const command = this.commandParser.parse(commandStr);
        if (!command) {
            this.eventBus.emit('message:error', 'Неизвестная команда. Наберите "help" для списка команд.');
            return;
        }
        
        command.execute(this.state, this.eventBus);
        this.state.addToHistory(commandStr);
    }

    startGame() {
        this.eventBus.emit('game:started');
        this.eventBus.emit('message:system', 'Добро пожаловать в Text RPG Sandbox!');
        this.eventBus.emit('message:system', 'Используйте кнопки команд, WASD/стрелки для перемещения, или кликайте по карте.');
        
        const lookCmd = new LookCommand();
        lookCmd.execute(this.state, this.eventBus);
    }

    handleGameOver() {
        this.eventBus.emit('message:error', 'ВЫ ПОГИБЛИ! Игра окончена.');
        this.eventBus.emit('message:system', 'Обновите страницу для начала новой игры или загрузите сохранение.');
        this.uiManager.disableInput();
    }

    handleLevelUp(data) {
        this.eventBus.emit('message:success', `★ УРОВЕНЬ ПОВЫШЕН! ★`);
        this.eventBus.emit('message:success', `Теперь вы ${data.level} уровня!`);
        this.eventBus.emit('message:success', 'Характеристики увеличены!');
        this.uiManager.playLevelUpEffect();
    }

    handleCombatStart(data) {
        this.state.startCombat(data.enemy);
        this.uiManager.refresh();
    }

    handleCombatEnd(result) {
        if (result.victory && result.rewards) {
            this.state.getPlayer().addXp(result.rewards.xp);
            this.state.getPlayer().addGold(result.rewards.gold);
            
            const levelUpData = this.progressionSystem.checkLevelUp(this.state.getPlayer());
            if (levelUpData) {
                this.eventBus.emit('player:levelup', levelUpData);
            }
            
            // Удаляем врага из локации
            const location = this.state.getCurrentLocation();
            location.removeEnemy(result.enemyName);
        }
        
        this.state.endCombat();
        this.uiManager.refresh();
    }

    save() {
        const saveData = this.state.serialize();
        StorageManager.save('rpg_save', saveData);
        this.eventBus.emit('message:system', '💾 Игра сохранена!');
    }

    load() {
        const saveData = StorageManager.load('rpg_save');
        if (saveData) {
            this.state.deserialize(saveData);
            this.eventBus.emit('message:system', '📂 Игра загружена!');
            this.uiManager.refresh();
            
            const lookCmd = new LookCommand();
            lookCmd.execute(this.state, this.eventBus);
        } else {
            this.eventBus.emit('message:error', 'Нет сохраненной игры!');
        }
    }

    reset() {
        if (confirm('Вы уверены? Весь прогресс будет утерян!')) {
            StorageManager.remove('rpg_save');
            location.reload();
        }
    }
}
