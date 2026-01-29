/**
 * Inventory - Manages player's items
 */
export class Inventory {
    constructor() {
        this.items = [];
    }

    addItem(item, count = 1) {
        const existing = this.items.find(i => i.name === item.name);
        if (existing) {
            existing.count += count;
        } else {
            this.items.push({ ...item, count });
        }
    }

    removeItem(itemName, count = 1) {
        const item = this.items.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
        if (!item) return null;
        
        item.count -= count;
        const removedItem = { ...item };
        
        if (item.count <= 0) {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
        }
        
        return removedItem;
    }

    findItem(itemName) {
        return this.items.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
    }

    hasItem(itemName) {
        return this.findItem(itemName) !== undefined;
    }

    getItems() {
        return this.items;
    }

    serialize() {
        return this.items.map(item => ({ ...item }));
    }

    deserialize(data) {
        this.items = data.map(item => ({ ...item }));
    }
}