// js/systems/Inventory.js - Класс инвентаря
import { Item } from '../entities/Item.js';

export class Inventory {
    constructor() {
        this.items = new Map(); // Map<Item, count>
    }

    addItem(item, count = 1) {
        const existingItem = this.findItem(item.name);
        if (existingItem) {
            const currentCount = this.items.get(existingItem);
            this.items.set(existingItem, currentCount + count);
        } else {
            this.items.set(item, count);
        }
    }

    removeItem(item, count = 1) {
        if (!this.items.has(item)) return false;
        
        const currentCount = this.items.get(item);
        if (currentCount <= count) {
            this.items.delete(item);
        } else {
            this.items.set(item, currentCount - count);
        }
        return true;
    }

    findItem(name) {
        for (const [item, count] of this.items.entries()) {
            if (item.name.toLowerCase().includes(name.toLowerCase())) {
                return item;
            }
        }
        return null;
    }

    getItems() {
        return Array.from(this.items.entries()).map(([item, count]) => ({
            item,
            count
        }));
    }

    serialize() {
        return Array.from(this.items.entries()).map(([item, count]) => ({
            item: item.serialize(),
            count
        }));
    }

    deserialize(data) {
        this.items.clear();
        data.forEach(entry => {
            const item = Item.deserialize(entry.item);
            this.items.set(item, entry.count);
        });
    }
}