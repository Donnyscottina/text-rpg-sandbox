// js/commands/commands/ExamineCommand.js
import { Command } from '../Command.js';

export class ExamineCommand extends Command {
    constructor(args) {
        super();
        this.objectName = args.toLowerCase();
    }

    execute(gameState, eventBus) {
        const descriptions = {
            'фонтан': 'Красивый фонтан с чистой водой. В воде блестят монеты.',
            'алтарь': 'Священный алтарь излучает теплый свет.',
            'сундук': 'Старый деревянный сундук. Может быть, внутри что-то есть?',
            'дверь': 'Массивная каменная дверь с древними рунами.',
            'дерево': 'Огромное старое дерево. На коре вырезаны странные символы.',
            'лагерь': 'Остатки костра и разбросанные вещи. Кто-то здесь был недавно.',
            'травы': 'Целебные травы. Можно собрать для зелий.',
            'факел': 'Горящий факел на стене. Освещает коридор тусклым светом.'
        };
        
        for (const [key, desc] of Object.entries(descriptions)) {
            if (this.objectName.includes(key)) {
                eventBus.emit('message:info', desc);
                return;
            }
        }
        
        eventBus.emit('message:info', 'Ничего особенного.');
    }
}