/**
 * Character - базовый класс для персонажей
 */
import { Entity } from './Entity.js';

export class Character extends Entity {
    constructor(config = {}) {
        super(config.id, config.name);
        
        // Характеристики
        this.stats = {
            hp: config.hp || 100,
            maxHp: config.maxHp || 100,
            mp: config.mp || 50,
            maxMp: config.maxMp || 50,
            attack: config.attack || 10,
            defense: config.defense || 5,
            level: config.level || 1,
            xp: config.xp || 0,
            xpNeeded: config.xpNeeded || 100
        };
    }

    /**
     * Получение урона
     */
    takeDamage(amount) {
        this.stats.hp = Math.max(0, this.stats.hp - amount);
        return this.stats.hp <= 0;
    }

    /**
     * Восстановление здоровья
     */
    heal(amount) {
        const actualHeal = Math.min(amount, this.stats.maxHp - this.stats.hp);
        this.stats.hp += actualHeal;
        return actualHeal;
    }

    /**
     * Использование маны
     */
    useMana(amount) {
        if (this.stats.mp >= amount) {
            this.stats.mp -= amount;
            return true;
        }
        return false;
    }

    /**
     * Восстановление маны
     */
    restoreMana(amount) {
        this.stats.mp = Math.min(this.stats.maxMp, this.stats.mp + amount);
    }

    /**
     * Полное восстановление
     */
    fullRestore() {
        this.stats.hp = this.stats.maxHp;
        this.stats.mp = this.stats.maxMp;
    }

    /**
     * Проверка жив ли персонаж
     */
    isAlive() {
        return this.stats.hp > 0;
    }

    /**
     * Сериализация
     */
    serialize() {
        return {
            id: this.id,
            name: this.name,
            stats: { ...this.stats },
            tags: Array.from(this.tags)
        };
    }
}