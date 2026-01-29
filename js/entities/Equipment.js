/**
 * Equipment - Manages equipped items
 */
export class Equipment {
    constructor() {
        this.weapon = null;
        this.armor = null;
        this.helmet = null;
    }

    equip(slot, item) {
        this[slot] = item;
    }

    unequip(slot) {
        const item = this[slot];
        this[slot] = null;
        return item;
    }

    getSlot(slot) {
        return this[slot];
    }

    serialize() {
        return {
            weapon: this.weapon,
            armor: this.armor,
            helmet: this.helmet
        };
    }

    deserialize(data) {
        this.weapon = data.weapon;
        this.armor = data.armor;
        this.helmet = data.helmet;
    }
}