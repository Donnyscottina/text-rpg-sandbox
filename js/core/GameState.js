import { EventEmitter } from './EventEmitter.js';

/**
 * GameState - Singleton паттерн для управления состоянием игры
 */
export class GameState extends EventEmitter {
    static instance = null;

    constructor() {
        if (GameState.instance) {
            return GameState.instance;
        }
        super();
        this.initializeState();
        GameState.instance = this;
    }

    static getInstance() {
        if (!GameState.instance) {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    }

    initializeState() {
        this.player = {
            name: 'Герой',
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            gold: 100,
            level: 1,
            xp: 0,
            xpNeeded: 100,
            attack: 10,
            defense: 5,
            x: 5,
            y: 5,
            location: 'town_square'
        };

        this.inventory = [
            { name: 'Зелье здоровья', type: 'potion', effect: 'heal', value: 30, count: 3 },
            { name: 'Хлеб', type: 'food', effect: 'heal', value: 10, count: 5 }
        ];

        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null
        };

        this.combat = null;
        this.commandHistory = [];
        this.historyIndex = -1;
    }

    updatePlayer(updates) {
        Object.assign(this.player, updates);
        this.emit('player:updated', this.player);
    }

    addToInventory(item) {
        const existing = this.inventory.find(i => i.name === item.name);
        if (existing && item.count) {
            existing.count += item.count;
        } else {
            this.inventory.push(item);
        }
        this.emit('inventory:updated', this.inventory);
    }

    removeFromInventory(itemName) {
        const index = this.inventory.findIndex(i => i.name === itemName);
        if (index > -1) {
            this.inventory.splice(index, 1);
            this.emit('inventory:updated', this.inventory);
        }
    }

    startCombat(enemy, originalName) {
        this.combat = { enemy, originalName };
        this.emit('combat:started', this.combat);
    }

    endCombat() {
        this.combat = null;
        this.emit('combat:ended');
    }

    save() {
        const saveData = {
            player: this.player,
            inventory: this.inventory,
            equipment: this.equipment,
            timestamp: Date.now()
        };
        localStorage.setItem('rpg_save', JSON.stringify(saveData));
        return true;
    }

    load() {
        const saveData = localStorage.getItem('rpg_save');
        if (!saveData) return false;
        
        try {
            const data = JSON.parse(saveData);
            this.player = data.player;
            this.inventory = data.inventory;
            this.equipment = data.equipment;
            this.emit('game:loaded');
            return true;
        } catch (error) {
            console.error('Error loading save:', error);
            return false;
        }
    }

    reset() {
        localStorage.removeItem('rpg_save');
        this.initializeState();
        this.emit('game:reset');
    }
}