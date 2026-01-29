// js/commands/commands/StatsCommand.js
import { Command } from '../Command.js';

export class StatsCommand extends Command {
    execute(gameState, eventBus) {
        const player = gameState.getPlayer();
        const stats = player.getStats();
        
        eventBus.emit('message:system', '=== СТАТИСТИКА ===');
        eventBus.emit('message:info', `Имя: ${stats.name}`);
        eventBus.emit('message:info', `Уровень: ${player.level}`);
        eventBus.emit('message:info', `HP: ${stats.hp}/${stats.maxHp}`);
        eventBus.emit('message:info', `MP: ${stats.mp}/${stats.maxMp}`);
        eventBus.emit('message:info', `Атака: ${stats.attack}`);
        eventBus.emit('message:info', `Защита: ${stats.defense}`);
        eventBus.emit('message:info', `Золото: ${player.gold}`);
        eventBus.emit('message:info', `Опыт: ${player.xp}/${player.xpNeeded}`);
    }
}