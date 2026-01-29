import { Player } from '../entities/Player.js';

/**
 * GameState - Centralized state management
 * Single source of truth for game data
 */
export class GameState {
    constructor() {
        this.player = null;
        this.currentLocation = null;
        this.worldMap = null;
        this.combat = null;
        this.commandHistory = [];
        this.historyIndex = -1;
    }

    initPlayer(config = {}) {
        this.player = new Player({
            name: config.name || 'Герой',
            hp: config.hp || 100,
            maxHp: config.maxHp || 100,
            mp: config.mp || 50,
            maxMp: config.maxMp || 50,
            gold: config.gold || 100,
            level: config.level || 1,
            xp: config.xp || 0,
            attack: config.attack || 10,
            defense: config.defense || 5
        });
    }

    getPlayer() {
        return this.player;
    }

    getCurrentLocation() {
        return this.currentLocation;
    }

    setLocation(location) {
        this.currentLocation = location;
        if (this.player && location.x !== undefined && location.y !== undefined) {
            this.player.setPosition(location.x, location.y);
        }
    }

    setWorldMap(worldMap) {
        this.worldMap = worldMap;
    }

    getWorldMap() {
        return this.worldMap;
    }

    isInCombat() {
        return this.combat !== null;
    }

    setCombat(combat) {
        this.combat = combat;
    }

    getCombat() {
        return this.combat;
    }

    endCombat() {
        this.combat = null;
    }

    addToHistory(command) {
        if (this.commandHistory[this.commandHistory.length - 1] !== command) {
            this.commandHistory.push(command);
        }
        this.historyIndex = this.commandHistory.length;
    }

    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.commandHistory[this.historyIndex];
        }
        return null;
    }

    getNextCommand() {
        if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            return this.commandHistory[this.historyIndex];
        }
        this.historyIndex = this.commandHistory.length;
        return '';
    }

    serialize() {
        return {
            player: this.player?.serialize(),
            locationId: this.currentLocation?.id,
            combat: this.combat ? {
                enemy: this.combat.enemy.serialize(),
                originalName: this.combat.originalName
            } : null,
            timestamp: Date.now()
        };
    }

    deserialize(data) {
        if (data.player) {
            this.player = Player.fromSerialized(data.player);
        }
        if (data.locationId && this.worldMap) {
            const location = this.worldMap.getLocation(data.locationId);
            if (location) {
                this.setLocation(location);
            }
        }
        // Combat will be restored separately if needed
    }
}