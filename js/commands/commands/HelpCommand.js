// js/commands/commands/HelpCommand.js
import { Command } from '../Command.js';

export class HelpCommand extends Command {
    execute(gameState, eventBus) {
        eventBus.emit('message:system', '=== СПИСОК КОМАНД ===');
        eventBus.emit('message:success', 'look / осмотреться / l / о - Осмотреть локацию');
        eventBus.emit('message:success', 'north/south/east/west/up/down / n/s/e/w/u/d / с/ю/в/з/вв/вн - Двигаться');
        eventBus.emit('message:success', 'talk [имя] / говорить / т - Поговорить с NPC');
        eventBus.emit('message:success', 'attack [враг] / атаковать / а - Атаковать врага (или продолжить бой)');
        eventBus.emit('message:success', 'flee / бежать / б - Убежать из боя');
        eventBus.emit('message:success', 'use [предмет] / использовать / и - Использовать предмет');
        eventBus.emit('message:success', 'examine [объект] / осмотреть / х - Осмотреть объект');
        eventBus.emit('message:success', 'inventory / инвентарь / i / инв - Показать инвентарь');
        eventBus.emit('message:success', 'stats / статистика / ст - Показать статистику');
        eventBus.emit('message:success', 'rest / отдохнуть / р - Отдохнуть и восстановить HP/MP');
        eventBus.emit('message:info', '');
        eventBus.emit('message:system', 'ГОРЯЧИЕ КЛАВИШИ:');
        eventBus.emit('message:success', 'WASD или стрелки - перемещение (когда поле пустое)');
        eventBus.emit('message:success', '↑/↓ - история команд');
    }
}