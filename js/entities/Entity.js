/**
 * Base Entity - базовый класс для всех сущностей в игре
 */
export class Entity {
    constructor(id, name) {
        this.id = id || this.generateId();
        this.name = name || 'Unknown';
        this.tags = new Set();
    }

    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addTag(tag) {
        this.tags.add(tag);
    }

    hasTag(tag) {
        return this.tags.has(tag);
    }

    removeTag(tag) {
        this.tags.delete(tag);
    }
}