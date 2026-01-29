// js/commands/commands/LookCommand.js
import { Command } from '../Command.js';

export class LookCommand extends Command {
    constructor() {
        super();
        this.name = 'look';
    }

    execute(state, eventBus) {
        const location = state.getCurrentLocation();
        
        eventBus.emit('message:success', `Вы находитесь: ${location.getName()}`);
        eventBus.emit('message:info', location.getDescription());
        
        if (state.isInCombat()) {
            const combat = state.getCombat();
            eventBus.emit('message:combat', 
                `⚔️ Вы в бою с: ${combat.enemy.name} (HP: ${combat.enemy.hp}/${combat.enemy.maxHp})`
            );
        }
        
        const exits = location.getExits();
        if (exits && Object.keys(exits).length > 0) {
            const exitLabels = {
                north: 'север',
                south: 'юг',
                east: 'восток',
                west: 'запад',
                up: 'вверх',
                down: 'вниз'
            };
            const exitNames = Object.keys(exits).map(d => exitLabels[d] || d).join(', ');
            eventBus.emit('message:info', `Выходы: ${exitNames}`);
        }
        
        eventBus.emit('ui:refresh');
    }

    getHelp() {
        return 'look / осмотреться / l / о - Осмотреть локацию';
    }
}
