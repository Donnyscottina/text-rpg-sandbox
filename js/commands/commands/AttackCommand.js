// js/commands/commands/AttackCommand.js
import { Command } from '../Command.js';

export class AttackCommand extends Command {
    constructor(args) {
        super();
        this.enemyName = args;
    }

    execute(gameState, eventBus) {
        // If already in combat, continue attacking
        if (gameState.isInCombat()) {
            eventBus.emit('combat:attack');
            return;
        }
        
        // Start new combat
        const loc = gameState.getCurrentLocation();
        
        if (!loc.enemies || loc.enemies.length === 0) {
            eventBus.emit('message:error', 'Здесь нет врагов.');
            return;
        }
        
        if (!this.enemyName) {
            eventBus.emit('message:error', 'Укажите врага для атаки.');
            return;
        }
        
        const enemy = loc.enemies.find(e => e.toLowerCase().includes(this.enemyName.toLowerCase()));
        
        if (!enemy) {
            eventBus.emit('message:error', 'Здесь нет такого врага.');
            return;
        }
        
        eventBus.emit('combat:initiate', enemy);
    }
}