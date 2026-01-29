// js/commands/commands/LookCommand.js
import { Command } from '../Command.js';

export class LookCommand extends Command {
    execute(gameState, eventBus) {
        const loc = gameState.getCurrentLocation();
        
        eventBus.emit('message:success', `Вы находитесь: ${loc.name}`);
        eventBus.emit('message:info', loc.desc);
        
        if (gameState.isInCombat()) {
            const combat = gameState.getCombat();
            eventBus.emit('message:combat', 
                `⚔️ Вы в бою с: ${combat.enemy.name} (HP: ${combat.enemy.hp}/${combat.enemy.maxHp})`
            );
        }
        
        if (loc.exits) {
            const exits = Object.keys(loc.exits).map(d => {
                const labels = { north: 'север', south: 'юг', east: 'восток', west: 'запад', up: 'вверх', down: 'вниз' };
                return labels[d] || d;
            }).join(', ');
            eventBus.emit('message:info', `Выходы: ${exits}`);
        }
    }
}