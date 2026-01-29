// js/world/Location.js - Класс локации
export class Location {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.desc = config.desc || '';
        this.type = config.type || 'wilderness';
        this.x = config.x;
        this.y = config.y;
        this.exits = config.exits || {};
        this.npcs = config.npcs ? [...config.npcs] : [];
        this.enemies = config.enemies ? [...config.enemies] : [];
        this.objects = config.objects ? [...config.objects] : [];
        this.items = config.items ? [...config.items] : [];
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.desc;
    }

    getType() {
        return this.type;
    }

    getExits() {
        return this.exits;
    }

    getNPCs() {
        return this.npcs;
    }

    getEnemies() {
        return this.enemies;
    }

    getObjects() {
        return this.objects;
    }

    getItems() {
        return this.items;
    }

    hasExit(direction) {
        return this.exits.hasOwnProperty(direction);
    }

    addNPC(npc) {
        if (!this.npcs.includes(npc)) {
            this.npcs.push(npc);
        }
    }

    removeNPC(npc) {
        const index = this.npcs.indexOf(npc);
        if (index > -1) {
            this.npcs.splice(index, 1);
        }
    }

    addEnemy(enemy) {
        if (!this.enemies.includes(enemy)) {
            this.enemies.push(enemy);
        }
    }

    removeEnemy(enemyName) {
        const index = this.enemies.findIndex(e => e === enemyName);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    addObject(obj) {
        if (!this.objects.includes(obj)) {
            this.objects.push(obj);
        }
    }

    removeObject(obj) {
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemName) {
        const index = this.items.findIndex(i => i.name === itemName);
        if (index > -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }

    serialize() {
        return {
            npcs: [...this.npcs],
            enemies: [...this.enemies],
            objects: [...this.objects],
            items: this.items.map(i => ({ ...i }))
        };
    }

    deserialize(data) {
        this.npcs = data.npcs ? [...data.npcs] : [];
        this.enemies = data.enemies ? [...data.enemies] : [];
        this.objects = data.objects ? [...data.objects] : [];
        this.items = data.items ? data.items.map(i => ({ ...i })) : [];
    }
}
