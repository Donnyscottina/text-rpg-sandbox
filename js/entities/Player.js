import { Character } from './Character.js';
import { Inventory } from './Inventory.js';
import { Equipment } from './Equipment.js';

/**
 * Player - Player character class
 */
export class Player extends Character {
    constructor(config) {
        super(config);
        this.gold = config.gold || 0;
        this.level = config.level || 1;
        this.xp = config.xp || 0;
        this.xpNeeded = this.calculateXpNeeded(this.level);
        this.inventory = new Inventory();
        this.equipment = new Equipment();
        this.x = config.x || 5;
        this.y = config.y || 5;
        
        // Initialize starting items
        this.initStartingInventory();
    }

    initStartingInventory() {
        this.inventory.addItem({
            name: 'Зелье здоровья',
            type: 'potion',
            effect: 'heal',
            value: 30
        }, 3);
        this.inventory.addItem({
            name: 'Хлеб',
            type: 'food',
            effect: 'heal',
            value: 10
        }, 5);
    }

    addXp(amount) {
        this.xp += amount;
        const leveledUp = this.xp >= this.xpNeeded;
        if (leveledUp) {
            return this.levelUp();
        }
        return null;
    }

    levelUp() {
        this.level++;
        this.xp = 0;
        this.xpNeeded = this.calculateXpNeeded(this.level);
        
        const hpIncrease = 20;
        const mpIncrease = 10;
        const attackIncrease = 5;
        const defenseIncrease = 2;
        
        this.maxHp += hpIncrease;
        this.hp = this.maxHp;
        this.maxMp += mpIncrease;
        this.mp = this.maxMp;
        this.attack += attackIncrease;
        this.defense += defenseIncrease;
        
        return {
            level: this.level,
            increases: {
                hp: hpIncrease,
                mp: mpIncrease,
                attack: attackIncrease,
                defense: defenseIncrease
            }
        };
    }

    calculateXpNeeded(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    addGold(amount) {
        this.gold += amount;
    }

    removeGold(amount) {
        if (this.gold < amount) return false;
        this.gold -= amount;
        return true;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    getInventory() {
        return this.inventory;
    }

    getEquipment() {
        return this.equipment;
    }

    serialize() {
        return {
            ...super.serialize(),
            gold: this.gold,
            level: this.level,
            xp: this.xp,
            x: this.x,
            y: this.y,
            inventory: this.inventory.serialize(),
            equipment: this.equipment.serialize()
        };
    }

    static fromSerialized(data) {
        const player = new Player(data);
        if (data.inventory) {
            player.inventory.deserialize(data.inventory);
        }
        if (data.equipment) {
            player.equipment.deserialize(data.equipment);
        }
        return player;
    }
}