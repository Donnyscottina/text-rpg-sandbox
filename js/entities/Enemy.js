/**
 * Enemy - базовый класс для врагов
 */
export class Enemy {
    constructor(name, stats) {
        this.name = name;
        this.hp = stats.hp;
        this.maxHp = stats.hp;
        this.attack = stats.attack;
        this.xp = stats.xp;
        this.gold = stats.gold;
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.hp === 0;
    }

    isAlive() {
        return this.hp > 0;
    }

    getAttackDamage(defenseModifier = 0) {
        return Math.max(1, this.attack - defenseModifier - Math.floor(Math.random() * 3));
    }
}

/**
 * EnemyFactory - паттерн Factory для создания врагов
 */
export class EnemyFactory {
    static enemyTemplates = {
        'волк': { hp: 30, attack: 8, xp: 25, gold: 10 },
        'разбойник': { hp: 40, attack: 12, xp: 35, gold: 25 },
        'паук': { hp: 50, attack: 15, xp: 50, gold: 30 },
        'темный волк': { hp: 45, attack: 14, xp: 45, gold: 20 },
        'скелет-воин': { hp: 45, attack: 13, xp: 40, gold: 20 },
        'зомби': { hp: 60, attack: 10, xp: 45, gold: 15 },
        'гигантский паук': { hp: 50, attack: 15, xp: 50, gold: 30 }
    };

    static create(enemyName) {
        const normalizedName = enemyName.toLowerCase();
        
        for (const [key, stats] of Object.entries(this.enemyTemplates)) {
            if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
                return new Enemy(enemyName, stats);
            }
        }
        
        // Default enemy
        return new Enemy(enemyName, { hp: 35, attack: 10, xp: 30, gold: 15 });
    }
}