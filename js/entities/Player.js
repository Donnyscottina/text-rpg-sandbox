// js/entities/Player.js
export class Player {
    constructor(config) {
        this.name = config.name;
        this.hp = config.hp;
        this.maxHp = config.maxHp;
        this.mp = config.mp;
        this.maxMp = config.maxMp;
        this.gold = config.gold;
        this.level = config.level;
        this.xp = config.xp;
        this.xpNeeded = this.calculateXpNeeded(this.level);
        this.attack = config.attack;
        this.defense = config.defense;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.inventory = [
            { name: 'Зелье здоровья', type: 'potion', effect: 'heal', value: 30, count: 3 },
            { name: 'Хлеб', type: 'food', effect: 'heal', value: 10, count: 5 }
        ];
        this.equipment = { weapon: null, armor: null, helmet: null };
    }

    calculateXpNeeded(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
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
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.maxMp += 10;
        this.mp = this.maxMp;
        this.attack += 5;
        this.defense += 2;
        return { level: this.level };
    }

    takeDamage(amount) {
        const damage = Math.max(1, amount - this.defense);
        this.hp = Math.max(0, this.hp - damage);
        return damage;
    }

    heal(amount) {
        const healed = Math.min(amount, this.maxHp - this.hp);
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return healed;
    }

    isDead() {
        return this.hp <= 0;
    }

    rest() {
        this.hp = this.maxHp;
        this.mp = this.maxMp;
    }

    calculateDamage() {
        return Math.max(1, this.attack - Math.floor(Math.random() * 5));
    }

    serialize() {
        return {
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            gold: this.gold,
            level: this.level,
            xp: this.xp,
            attack: this.attack,
            defense: this.defense,
            x: this.x,
            y: this.y,
            inventory: this.inventory,
            equipment: this.equipment
        };
    }

    deserialize(data) {
        Object.assign(this, data);
        this.xpNeeded = this.calculateXpNeeded(this.level);
    }
}