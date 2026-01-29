// js/core/GameState.js
import { Player } from '../entities/Player.js';

export class GameState {
    constructor() {
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
        
        this.currentLocation = null;
        this.worldMap = null;
        this.combat = null;
        this.commandHistory = [];
        this.historyIndex = -1;
    }

    getPlayer() {
        return this.player;
    }

    getCurrentLocation() {
        return this.currentLocation;
    }

    setLocation(location) {
        this.currentLocation = location;
        this.player.setPosition(location.x, location.y);
    }

    getWorldMap() {
        return this.worldMap;
    }

    setWorldMap(worldMap) {
        this.worldMap = worldMap;
        const startLocation = worldMap.getLocation('town_square');
        this.setLocation(startLocation);
    }

    isInCombat() {
        return this.combat !== null;
    }

    startCombat(combat) {
        this.combat = combat;
    }

    endCombat() {
        this.combat = null;
    }

    getCombat() {
        return this.combat;
    }

    addToHistory(command) {
        if (this.commandHistory[this.commandHistory.length - 1] !== command) {
            this.commandHistory.push(command);
        }
        this.historyIndex = this.commandHistory.length;
    }

    getHistoryItem(offset) {
        const index = this.historyIndex + offset;
        if (index >= 0 && index < this.commandHistory.length) {
            this.historyIndex = index;
            return this.commandHistory[index];
        }
        if (index >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            return '';
        }
        return null;
    }

    serialize() {
        return {
            player: this.player.serialize(),
            locationId: this.currentLocation?.id || 'town_square',
            combat: this.combat?.serialize() || null,
            timestamp: Date.now()
        };
    }

    deserialize(data) {
        this.player.deserialize(data.player);
        const location = this.worldMap.getLocation(data.locationId);
        this.setLocation(location);
        
        if (data.combat) {
            // Combat restoration would be complex, skipping for now
            this.combat = null;
        }
    }
}
