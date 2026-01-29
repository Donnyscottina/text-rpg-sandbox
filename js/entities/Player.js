/**
 * Player - класс игрока
 */
import { Character } from './Character.js';

export class Player extends Character {
    constructor(config = {}) {
        super(config);
        
        this.gold = config.gold || 100;
        this.location = config.location || 'town_square';
        this.position = {
            x: config.x || 5,
            y: config.y || 5
        };
    }

    /**
     * Добавление опыта
     */
    addExperience(amount) {
        this.stats.xp += amount;
        const levelsGained = [];
        
        while (this.stats.xp >= this.stats.xpNeeded) {
            this.levelUp();
            levelsGained.push(this.stats.level);
        }
        
        return levelsGained;
    }

    /**
     * Повышение уровня
     */
    levelUp() {
        this.stats.level++;
        this.stats.xp = 0;
        this.stats.xpNeeded = Math.floor(this.stats.xpNeeded * 1.5);
        this.stats.maxHp += 20;
        this.stats.maxMp += 10;
        this.stats.attack += 5;
        this.stats.defense += 2;
        this.fullRestore();
    }

    /**
     * Добавление золота
     */
    addGold(amount) {
        this.gold += amount;
    }

    /**
     * Израсходование золота
     */
    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    /**
     * Перемещение
     */
    moveTo(location, x, y) {
        this.location = location;
        if (x !== undefined) this.position.x = x;
        if (y !== undefined) this.position.y = y;
    }

    /**
     * Сериализация
     */
    serialize() {
        return {
            ...super.serialize(),
            gold: this.gold,
            location: this.location,
            position: { ...this.position }
        };
    }

    /**
     * Десериализация
     */
    static deserialize(data) {
        return new Player({
            id: data.id,
            name: data.name,
            ...data.stats,
            gold: data.gold,
            location: data.location,
            x: data.position.x,
            y: data.position.y
        });
    }
}