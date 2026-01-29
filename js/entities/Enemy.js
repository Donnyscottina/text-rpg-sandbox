/**
 * Enemy - класс врага
 */
import { Character } from './Character.js';

export class Enemy extends Character {
    constructor(config = {}) {
        super(config);
        
        this.rewards = {
            xp: config.xp || 30,
            gold: config.gold || 15
        };
        
        this.aiType = config.aiType || 'aggressive';
    }

    /**
     * Получение наград
     */
    getRewards() {
        return { ...this.rewards };
    }

    /**
     * Расчет урона
     */
    calculateDamage() {
        const variance = Math.floor(Math.random() * 5);
        return Math.max(1, this.stats.attack - variance);
    }

    /**
     * Сериализация
     */
    serialize() {
        return {
            ...super.serialize(),
            rewards: { ...this.rewards },
            aiType: this.aiType
        };
    }
}