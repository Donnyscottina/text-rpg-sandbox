// js/world/Location.js - Класс локации
export class Location {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.desc = config.desc;
        this.x = config.x;
        this.y = config.y;
        this.type = config.type; // 'town', 'forest', 'dungeon', 'grass'
        this.npcs = config.npcs || [];
        this.enemies = config.enemies || [];
        this.objects = config.objects || [];
        this.exits = config.exits || {}; // { north: 'location_id', ... }
    }

    hasExit(direction) {
        return this.exits[direction] !== undefined;
    }

    getExit(direction) {
        return this.exits[direction];
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }
}