// js/entities/Equipment.js - Система экипировки
export class Equipment {
    constructor() {
        this.slots = {
            weapon: null,
            armor: null,
            helmet: null,
            boots: null,
            accessory: null
        };
    }

    equip(slot, item) {
        if (!this.slots.hasOwnProperty(slot)) {
            return { success: false, message: 'Неверный слот' };
        }
        
        const oldItem = this.slots[slot];
        this.slots[slot] = item;
        
        return {
            success: true,
            oldItem: oldItem,
            message: `${item.name} экипировано`
        };
    }

    unequip(slot) {
        if (!this.slots.hasOwnProperty(slot)) {
            return { success: false, message: 'Неверный слот' };
        }
        
        const item = this.slots[slot];
        if (!item) {
            return { success: false, message: 'Слот пуст' };
        }
        
        this.slots[slot] = null;
        
        return {
            success: true,
            item: item,
            message: `${item.name} снято`
        };
    }

    getSlot(slot) {
        return this.slots[slot];
    }

    getAllSlots() {
        return { ...this.slots };
    }

    getTotalBonus(stat) {
        let total = 0;
        
        Object.values(this.slots).forEach(item => {
            if (item && item.bonuses && item.bonuses[stat]) {
                total += item.bonuses[stat];
            }
        });
        
        return total;
    }

    serialize() {
        const serialized = {};
        
        Object.entries(this.slots).forEach(([slot, item]) => {
            serialized[slot] = item ? item.serialize() : null;
        });
        
        return serialized;
    }

    deserialize(data) {
        Object.entries(data).forEach(([slot, itemData]) => {
            this.slots[slot] = itemData; // Простое восстановление
        });
    }
}
