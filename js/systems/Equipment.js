// js/systems/Equipment.js - Класс экипировки
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

    getSlots() {
        return {
            weapon: this.weapon,
            armor: this.armor,
            helmet: this.helmet
        };
    }

    serialize() {
        return {
            weapon: this.weapon?.serialize() || null,
            armor: this.armor?.serialize() || null,
            helmet: this.helmet?.serialize() || null
        };
    }

    deserialize(data) {
        // TODO: deserialize items when equipment system is fully implemented
        this.weapon = null;
        this.armor = null;
        this.helmet = null;
    }
}