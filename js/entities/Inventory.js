// js/entities/Inventory.js - Система инвентаря
import { Item } from './Item.js';

export class Inventory {
    constructor() {
        this.items = [];
        this.maxSlots = 50;
    }

    addItem(itemData, count = 1) {
        const existingItem = this.items.find(i => i.name === itemData.name && i.stackable);
        
        if (existingItem) {
            existingItem.count += count;
            return true;
        }
        
        if (this.items.length >= this.maxSlots) {
            return false; // Инвентарь полон
        }
        
        this.items.push({
            ...itemData,
            count: count
        });
        
        return true;
    }

    removeItem(itemName, count = 1) {
        const item = this.findItem(itemName);
        if (!item) return false;
        
        item.count -= count;
        
        if (item.count <= 0) {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
        }
        
        return true;
    }

    findItem(itemName) {
        return this.items.find(i => 
            i.name.toLowerCase().includes(itemName.toLowerCase())
        );
    }

    hasItem(itemName) {
        return this.findItem(itemName) !== undefined;
    }

    getItems() {
        return this.items;
    }

    getItemCount(itemName) {
        const item = this.findItem(itemName);
        return item ? item.count : 0;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    serialize() {
        return this.items.map(item => ({
            ...item,
            count: item.count
        }));
    }

    deserialize(data) {
        this.items = data.map(itemData => ({
            ...itemData
        }));
    }
}
