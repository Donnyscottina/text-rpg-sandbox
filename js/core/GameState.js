// js/core/GameState.js
import { Player } from '../entities/Player.js';
import { LOCATIONS } from '../data/locations.js';

export class GameState {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.player = null;
        this.currentLocation = 'town_square';
        this.combat = null;
        this.commandHistory = [];
    }

    init() {
        this.player = new Player({
            name: 'Герой',
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            gold: 100,
            level: 1,
            xp: 0,
            attack: 10,
            defense: 5,
            x: 5,
            y: 5
        });

        const loc = this.getLocation();
        this.player.x = loc.x;
        this.player.y = loc.y;
    }

    getLocation(id = null) {
        return LOCATIONS[id || this.currentLocation];
    }

    setLocation(id) {
        this.currentLocation = id;
        const loc = this.getLocation();
        this.player.x = loc.x;
        this.player.y = loc.y;
        this.eventBus.emit('game:update');
    }

    isInCombat() {
        return this.combat !== null;
    }

    startCombat(enemy) {
        this.combat = { enemy, originalName: enemy.name };
        this.eventBus.emit('game:update');
    }

    endCombat() {
        this.combat = null;
        this.eventBus.emit('game:update');
    }

    addToHistory(cmd) {
        if (this.commandHistory[this.commandHistory.length - 1] !== cmd) {
            this.commandHistory.push(cmd);
        }
    }

    serialize() {
        return {
            player: this.player.serialize(),
            location: this.currentLocation,
            combat: this.combat ? {
                enemy: this.combat.enemy,
                originalName: this.combat.originalName
            } : null,
            timestamp: Date.now()
        };
    }

    deserialize(data) {
        this.player.deserialize(data.player);
        this.currentLocation = data.location;
        this.combat = data.combat;
    }
}