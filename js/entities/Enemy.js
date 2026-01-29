// js/entities/Enemy.js
export class Enemy {
    constructor(name, config) {
        this.name = name;
        this.hp = config.hp;
        this.maxHp = config.hp;
        this.attack = config.attack;
        this.xp = config.xp;
        this.gold = config.gold;
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.hp <= 0;
    }

    calculateDamage() {
        return Math.max(1, this.attack - Math.floor(Math.random() * 5));
    }

    isDead() {
        return this.hp <= 0;
    }

    static create(name) {
        const configs = {
            'волк': { hp: 30, attack: 8, xp: 25, gold: 10 },
            'разбойник': { hp: 40, attack: 12, xp: 35, gold: 25 },
            'паук': { hp: 50, attack: 15, xp: 50, gold: 30 },
            'скелет': { hp: 45, attack: 13, xp: 40, gold: 20 },
            'зомби': { hp: 60, attack: 10, xp: 45, gold: 15 }
        };

        for (const [key, cfg] of Object.entries(configs)) {
            if (name.toLowerCase().includes(key)) {
                return new Enemy(name, cfg);
            }
        }
        return new Enemy(name, { hp: 35, attack: 10, xp: 30, gold: 15 });
    }
}