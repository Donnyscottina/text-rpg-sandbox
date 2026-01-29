// js/entities/Enemy.js - Класс врага
import { Character } from './Character.js';
import { ENEMY_DATA } from '../config/enemyData.js';

export class Enemy extends Character {
    constructor(config) {
        super(config);
        this.xp = config.xp || 30;
        this.gold = config.gold || 15;
    }

    static createFromTemplate(templateName) {
        const template = ENEMY_DATA[templateName.toLowerCase()];
        if (!template) {
            // Создаем врага по умолчанию
            return new Enemy({
                name: templateName,
                hp: 35,
                maxHp: 35,
                attack: 10,
                defense: 3,
                xp: 30,
                gold: 15
            });
        }
        
        return new Enemy({
            name: template.name,
            hp: template.hp,
            maxHp: template.hp,
            attack: template.attack,
            defense: template.defense || 3,
            xp: template.xp,
            gold: template.gold
        });
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

    deserialize(data) {
        super.deserialize(data);
        this.xp = data.xp;
        this.gold = data.gold;
    }
}
