import { Character } from './Character.js';
import { ENEMY_STATS } from '../config/enemyData.js';

/**
 * Enemy - Enemy character class
 */
export class Enemy extends Character {
    constructor(name, config = {}) {
        // Get stats from database or use defaults
        const stats = ENEMY_STATS[name] || config;
        
        super({
            name: name,
            maxHp: stats.hp || 30,
            hp: stats.hp || 30,
            maxMp: 0,
            mp: 0,
            attack: stats.attack || 10,
            defense: stats.defense || 2
        });
        
        this.xp = stats.xp || 20;
        this.gold = stats.gold || 10;
    }

    getRewards() {
        return {
            xp: this.xp,
            gold: this.gold
        };
    }

    serialize() {
        return {
            ...super.serialize(),
            xp: this.xp,
            gold: this.gold
        };
    }

    static fromSerialized(data) {
        const enemy = new Enemy(data.name, {
            hp: data.maxHp,
            attack: data.attack,
            defense: data.defense,
            xp: data.xp,
            gold: data.gold
        });
        enemy.hp = data.hp;
        return enemy;
    }
}