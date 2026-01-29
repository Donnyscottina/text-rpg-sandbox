// js/entities/Character.js - Базовый класс персонажа
export class Character {
    constructor(config) {
        this.name = config.name;
        this.maxHp = config.maxHp || 100;
        this.hp = config.hp !== undefined ? config.hp : this.maxHp;
        this.maxMp = config.maxMp || 50;
        this.mp = config.mp !== undefined ? config.mp : this.maxMp;
        this.attack = config.attack || 10;
        this.defense = config.defense || 5;
    }

    takeDamage(amount) {
        const actualDamage = Math.max(1, amount);
        this.hp = Math.max(0, this.hp - actualDamage);
        return {
            damage: actualDamage,
            isDead: this.isDead()
        };
    }

    heal(amount) {
        const actualHeal = Math.min(amount, this.maxHp - this.hp);
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return actualHeal;
    }

    restoreMp(amount) {
        const actualRestore = Math.min(amount, this.maxMp - this.mp);
        this.mp = Math.min(this.maxMp, this.mp + amount);
        return actualRestore;
    }

    isDead() {
        return this.hp <= 0;
    }

    isFullHealth() {
        return this.hp === this.maxHp;
    }

    calculateAttackDamage() {
        const variance = Math.floor(Math.random() * 5);
        return Math.max(1, this.attack - variance);
    }

    rest() {
        this.hp = this.maxHp;
        this.mp = this.maxMp;
    }

    getStats() {
        return {
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            attack: this.attack,
            defense: this.defense
        };
    }

    serialize() {
        return {
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            attack: this.attack,
            defense: this.defense
        };
    }

    deserialize(data) {
        this.name = data.name;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this.mp = data.mp;
        this.maxMp = data.maxMp;
        this.attack = data.attack;
        this.defense = data.defense;
    }
}