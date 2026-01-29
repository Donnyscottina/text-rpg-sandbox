// js/entities/Player.js - Класс игрока
import { Character } from './Character.js';
import { Inventory } from './Inventory.js';
import { Equipment } from './Equipment.js';

export class Player extends Character {
    constructor(config) {
        super(config);
        this.gold = config.gold || 0;
        this.level = config.level || 1;
        this.xp = config.xp || 0;
        this.xpNeeded = this.calculateXpNeeded(this.level);
        this.inventory = new Inventory();
        this.equipment = new Equipment();
        this.x = config.x || 0;
        this.y = config.y || 0;
        
        // Начальные предметы
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
        if (this.xp >= this.xpNeeded) {
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

    deserialize(data) {
        super.deserialize(data);
        this.gold = data.gold;
        this.level = data.level;
        this.xp = data.xp;
        this.xpNeeded = this.calculateXpNeeded(this.level);
        this.x = data.x;
        this.y = data.y;
        this.inventory.deserialize(data.inventory);
        this.equipment.deserialize(data.equipment);
    }
}
