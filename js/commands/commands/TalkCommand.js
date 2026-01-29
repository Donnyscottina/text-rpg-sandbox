// js/commands/commands/TalkCommand.js
import { Command } from '../Command.js';

export class TalkCommand extends Command {
    constructor(args) {
        super();
        this.npcName = args.toLowerCase();
    }

    execute(gameState, eventBus) {
        const loc = gameState.getCurrentLocation();
        
        if (!loc.npcs || !loc.npcs.some(n => n.toLowerCase().includes(this.npcName))) {
            eventBus.emit('message:error', 'Здесь нет такого персонажа.');
            return;
        }
        
        const dialogues = {
            'маркус': 'Приветствую, путник! У меня есть отличные товары. (Функция торговли пока в разработке)',
            'джон': 'Стража всегда бдит! Будьте осторожны за городом.',
            'элара': 'Да благословит вас свет! Могу исцелить ваши раны. (Наберите "rest" в храме)',
            'боб': 'Добро пожаловать в "Золотой дракон"! Хотите эля? Или ищете работу?',
            'томас': '♪ Я пою песни о великих героях... Может быть, и о вас когда-нибудь! ♪',
            'торин': 'Лучшее оружие в городе! Приходите, когда будет золото.',
            'воин': 'Я повидал многое в своих приключениях. Хочешь услышать историю?',
            'капитан': 'За воротами опасно. Убедитесь, что готовы к бою.'
        };
        
        for (const [key, dialogue] of Object.entries(dialogues)) {
            if (this.npcName.includes(key)) {
                eventBus.emit('message:success', dialogue);
                return;
            }
        }
        
        eventBus.emit('message:info', 'Персонаж ничего не говорит.');
    }
}