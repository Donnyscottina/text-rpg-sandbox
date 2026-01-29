// js/core/GameState.js - Управление состоянием игры
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';

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
            defense: 5
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

    setWorldMap(worldMap) {
        this.worldMap = worldMap;
        const startLocation = worldMap.getLocation('town_square');
        this.setLocation(startLocation);
    }

    getWorldMap() {
        return this.worldMap;
    }

    isInCombat() {
        return this.combat !== null;
    }

    startCombat(enemy) {
        this.combat = { enemy, originalName: enemy.name };
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

    getHistory() {
        return this.commandHistory;
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            return this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            return this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex >= this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            return '';
        }
        return null;
    }

    serialize() {
        return {
            player: this.player.serialize(),
            locationId: this.currentLocation.id,
            combat: this.combat ? {
                enemy: this.combat.enemy.serialize(),
                originalName: this.combat.originalName
            } : null,
            worldState: this.worldMap.serialize(),
            timestamp: Date.now()
        };
    }

    deserialize(data) {
        this.player.deserialize(data.player);
        
        if (data.worldState) {
            this.worldMap.deserialize(data.worldState);
        }
        
        const location = this.worldMap.getLocation(data.locationId);
        this.setLocation(location);
        
        if (data.combat) {
            const enemy = new Enemy(data.combat.enemy);
            this.startCombat(enemy);
        }
    }
}
