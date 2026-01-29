// js/core/GameState.js - Управление состоянием игры
import { Player } from '../entities/Player.js';

export class GameState {
    constructor(eventBus) {
        this.eventBus = eventBus;
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
        this.eventBus.emit('location:changed', location);
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
        this.eventBus.emit('combat:started', combat);
    }

    endCombat() {
        this.combat = null;
        this.eventBus.emit('combat:ended');
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
            player: this.player.serialize(),
            locationId: this.currentLocation?.id || 'town_square',
            combat: this.combat ? {
                enemy: this.combat.enemy.serialize(),
                originalName: this.combat.originalName
            } : null,
            timestamp: Date.now()
        };
    }

    deserialize(data) {
        this.player.deserialize(data.player);
        
        if (this.worldMap) {
            const location = this.worldMap.getLocation(data.locationId);
            this.setLocation(location);
        }
        
        if (data.combat) {
            const Enemy = (await import('../entities/Enemy.js')).Enemy;
            const enemy = new Enemy(data.combat.enemy);
            const Combat = (await import('../systems/CombatSystem.js')).Combat;
            this.combat = new Combat(this.player, enemy, data.combat.originalName);
        }
    }
}