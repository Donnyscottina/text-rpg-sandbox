// js/commands/commands/AttackCommand.js
import { Command } from '../Command.js';
import { Enemy } from '../../entities/Enemy.js';

export class AttackCommand extends Command {
    constructor(enemyName) {
        super();
        this.name = 'attack';
        this.enemyName = enemyName;
    }

    execute(state, eventBus) {
        const combat = state.getCombat();
        
        // Если уже в бою - продолжаем
        if (combat) {
            eventBus.emit('combat:attack', { combat, state });
            eventBus.emit('ui:refresh');
            return;
        }
        
        // Начинаем новый бой
        const location = state.getCurrentLocation();
        const enemies = location.getEnemies();
        
        if (!enemies || enemies.length === 0) {
            eventBus.emit('message:error', 'Здесь нет врагов.');
            return;
        }
        
        const enemyToAttack = enemies.find(e => 
            e.toLowerCase().includes(this.enemyName.toLowerCase())
        );
        
        if (!enemyToAttack) {
            eventBus.emit('message:error', 'Здесь нет такого врага.');
            return;
        }
        
        const enemy = Enemy.createFromTemplate(enemyToAttack);
        
        const combatSystem = eventBus.events.get('combat:attack')[0];
        if (combatSystem) {
            combatSystem.parent.startCombat(state.getPlayer(), enemy);
        }
        
        eventBus.emit('ui:refresh');
    }

    getHelp() {
        return 'attack [враг] / атаковать / а - Атаковать врага';
    }
}
