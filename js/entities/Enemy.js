// js/entities/Enemy.js - Класс врага
import { Character } from './Character.js';

export class Enemy extends Character {
    constructor(config) {
        super(config);
        this.xp = config.xp || 30;
        this.gold = config.gold || 15;
    }

    static createFromTemplate(name) {
        const templates = {
            'Волк': { hp: 30, attack: 8, defense: 2, xp: 25, gold: 10 },
            'Разбойник': { hp: 40, attack: 12, defense: 3, xp: 35, gold: 25 },
            'Гигантский паук': { hp: 50, attack: 15, defense: 4, xp: 50, gold: 30 },
            'Темный волк': { hp: 45, attack: 14, defense: 3, xp: 45, gold: 20 },
            'Скелет-воин': { hp: 45, attack: 13, defense: 5, xp: 40, gold: 20 },
            'Зомби': { hp: 60, attack: 10, defense: 2, xp: 45, gold: 15 }
        };

        const template = templates[name] || { hp: 35, attack: 10, defense: 2, xp: 30, gold: 15 };
        
        return new Enemy({
            name: name,
            maxHp: template.hp,
            hp: template.hp,
            attack: template.attack,
            defense: template.defense,
            xp: template.xp,
            gold: template.gold
        });
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