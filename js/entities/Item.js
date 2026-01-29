/**
 * Item - класс предмета
 */
import { Entity } from './Entity.js';

export class Item extends Entity {
    constructor(config = {}) {
        super(config.id, config.name);
        
        this.type = config.type || 'misc';
        this.effect = config.effect || null;
        this.value = config.value || 0;
        this.count = config.count || 1;
        this.stackable = config.stackable !== false;
    }

    /**
     * Добавление количества
     */
    addCount(amount = 1) {
        if (!this.stackable) return false;
        this.count += amount;
        return true;
    }

    /**
     * Уменьшение количества
     */
    removeCount(amount = 1) {
        this.count = Math.max(0, this.count - amount);
        return this.count;
    }

    /**
     * Проверка наличия
     */
    isEmpty() {
        return this.count <= 0;
    }

    /**
     * Сериализация
     */
    serialize() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            effect: this.effect,
            value: this.value,
            count: this.count,
            stackable: this.stackable
        };
    }

    /**
     * Десериализация
     */
    static deserialize(data) {
        return new Item(data);
    }
}