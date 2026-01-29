/**
 * Enemy class representing hostile entities
 */
class Enemy {
    constructor(name, stats) {
        this.name = name;
        this.hp = stats.hp;
        this.maxHp = stats.hp;
        this.attack = stats.attack;
        this.xp = stats.xp;
        this.gold = stats.gold;
    }
    
    /**
     * Take damage
     * @param {number} amount
     * @returns {boolean} true if still alive
     */
    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.hp > 0;
    }
    
    /**
     * Check if enemy is alive
     * @returns {boolean}
     */
    isAlive() {
        return this.hp > 0;
    }
    
    /**
     * Get attack damage (with variance)
     * @param {number} targetDefense
     * @returns {number}
     */
    getDamage(targetDefense) {
        return Math.max(1, this.attack - targetDefense - Math.floor(Math.random() * 3));
    }
}

/**
 * Factory for creating enemies with predefined stats
 */
class EnemyFactory {
    static ENEMY_STATS = {
        'волк': { hp: 30, attack: 8, xp: 25, gold: 10 },
        'разбойник': { hp: 40, attack: 12, xp: 35, gold: 25 },
        'паук': { hp: 50, attack: 15, xp: 50, gold: 30 },
        'темный': { hp: 45, attack: 14, xp: 45, gold: 20 },
        'скелет': { hp: 45, attack: 13, xp: 40, gold: 20 },
        'зомби': { hp: 60, attack: 10, xp: 45, gold: 15 }
    };
    
    /**
     * Create an enemy by name
     * @param {string} name - Full enemy name
     * @param {string} searchKey - Key to match in stats
     * @returns {Enemy}
     */
    static create(name, searchKey) {
        const key = searchKey.toLowerCase();
        for (const [statKey, stats] of Object.entries(EnemyFactory.ENEMY_STATS)) {
            if (key.includes(statKey)) {
                return new Enemy(name, stats);
            }
        }
        // Default enemy
        return new Enemy(name, { hp: 35, attack: 10, xp: 30, gold: 15 });
    }
}
