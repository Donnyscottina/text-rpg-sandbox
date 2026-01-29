/**
 * Game Commands - Implementation of all game commands
 * Each command is a separate class following Command Pattern
 */

export class HelpCommand {
    execute(state, eventBus) {
        eventBus.emit('message:system', '=== СПИСОК КОМАНД ===');
        eventBus.emit('message:success', 'look / осмотреться / l / о - Осмотреть локацию');
        eventBus.emit('message:success', 'north/south/east/west/up/down / n/s/e/w/u/d - Двигаться');
        eventBus.emit('message:success', 'talk [имя] / говорить / т - Поговорить с NPC');
        eventBus.emit('message:success', 'attack [враг] / атаковать / а - Атаковать врага');
        eventBus.emit('message:success', 'flee / бежать / б - Убежать из боя');
        eventBus.emit('message:success', 'use [предмет] / использовать / и - Использовать предмет');
        eventBus.emit('message:success', 'examine [объект] / осмотреть / х - Осмотреть объект');
        eventBus.emit('message:success', 'inventory / инвентарь / i - Инвентарь');
        eventBus.emit('message:success', 'stats / статистика / ст - Статистика');
        eventBus.emit('message:success', 'rest / отдохнуть / р - Отдохнуть');
        eventBus.emit('message:info', '');
        eventBus.emit('message:system', 'ГОРЯЧИЕ КЛАВИШИ:');
        eventBus.emit('message:success', 'WASD или стрелки - перемещение (когда поле пустое)');
        eventBus.emit('message:success', '↑/↓ - история команд');
    }
}

export class LookCommand {
    execute(state, eventBus) {
        const location = state.getCurrentLocation();
        const combat = state.getCombat();
        
        eventBus.emit('message:success', `Вы находитесь: ${location.name}`);
        eventBus.emit('message:info', location.desc);
        
        if (combat) {
            eventBus.emit('message:combat', 
                `⚔️ Вы в бою с: ${combat.enemy.name} (HP: ${combat.enemy.hp}/${combat.enemy.maxHp})`
            );
        }
        
        if (location.exits) {
            const exits = Object.keys(location.exits).map(d => {
                const labels = { 
                    north: 'север', 
                    south: 'юг', 
                    east: 'восток', 
                    west: 'запад', 
                    up: 'вверх', 
                    down: 'вниз' 
                };
                return labels[d] || d;
            }).join(', ');
            eventBus.emit('message:info', `Выходы: ${exits}`);
        }
    }
}

export class MoveCommand {
    constructor(direction) {
        this.direction = direction;
    }
    
    execute(state, eventBus) {
        eventBus.emit('movement:move', { direction: this.direction });
    }
}

export class AttackCommand {
    constructor(targetName) {
        this.targetName = targetName;
    }
    
    execute(state, eventBus) {
        // If already in combat, just attack
        if (state.isInCombat()) {
            eventBus.emit('combat:attack');
            return;
        }
        
        // Start new combat
        const location = state.getCurrentLocation();
        
        if (!this.targetName) {
            eventBus.emit('message:error', 'Укажите врага для атаки.');
            return;
        }
        
        if (!location.enemies || location.enemies.length === 0) {
            eventBus.emit('message:error', 'Здесь нет врагов.');
            return;
        }
        
        const enemy = location.enemies.find(e => 
            e.toLowerCase().includes(this.targetName.toLowerCase())
        );
        
        if (!enemy) {
            eventBus.emit('message:error', 'Здесь нет такого врага.');
            return;
        }
        
        eventBus.emit('combat:start', { 
            enemyName: this.targetName, 
            originalName: enemy 
        });
    }
}

export class FleeCommand {
    execute(state, eventBus) {
        eventBus.emit('combat:flee');
    }
}

export class TalkCommand {
    constructor(npcName) {
        this.npcName = npcName;
    }
    
    execute(state, eventBus) {
        const location = state.getCurrentLocation();
        
        if (!this.npcName) {
            eventBus.emit('message:error', 'Укажите с кем поговорить.');
            return;
        }
        
        if (!location.npcs || !location.npcs.some(n => 
            n.toLowerCase().includes(this.npcName.toLowerCase())
        )) {
            eventBus.emit('message:error', 'Здесь нет такого персонажа.');
            return;
        }
        
        const dialogues = {
            'маркус': 'Приветствую, путник! У меня есть отличные товары.',
            'джон': 'Стража всегда бдит! Будьте осторожны за городом.',
            'элара': 'Да благословит вас свет! Могу исцелить ваши раны.',
            'боб': 'Добро пожаловать в "Золотой дракон"! Хотите эля?',
            'томас': '♪ Я пою песни о великих героях! ♪',
            'торин': 'Лучшее оружие в городе!',
            'воин': 'Я повидал многое в своих приключениях.',
            'капитан': 'За воротами опасно. Убедитесь, что готовы.'
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

export class UseCommand {
    constructor(itemName) {
        this.itemName = itemName;
    }
    
    execute(state, eventBus) {
        if (!this.itemName) {
            eventBus.emit('message:error', 'Укажите предмет для использования.');
            return;
        }
        
        eventBus.emit('combat:useItem', { itemName: this.itemName });
    }
}

export class ExamineCommand {
    constructor(objectName) {
        this.objectName = objectName;
    }
    
    execute(state, eventBus) {
        if (!this.objectName) {
            eventBus.emit('message:error', 'Укажите объект для осмотра.');
            return;
        }
        
        const descriptions = {
            'фонтан': 'Красивый фонтан с чистой водой.',
            'алтарь': 'Священный алтарь излучает теплый свет.',
            'сундук': 'Старый деревянный сундук.',
            'дверь': 'Массивная каменная дверь.',
            'дерево': 'Огромное старое дерево.',
            'лагерь': 'Остатки костра.',
            'травы': 'Целебные травы.',
            'факел': 'Горящий факел.'
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

export class InventoryCommand {
    execute(state, eventBus) {
        const player = state.getPlayer();
        const inventory = player.getInventory();
        
        eventBus.emit('message:system', '=== ИНВЕНТАРЬ ===');
        
        const items = inventory.getItems();
        if (items.length === 0) {
            eventBus.emit('message:info', 'Пусто');
        } else {
            items.forEach(item => {
                eventBus.emit('message:info', `${item.name} x${item.count}`);
            });
        }
    }
}

export class StatsCommand {
    execute(state, eventBus) {
        const player = state.getPlayer();
        
        eventBus.emit('message:system', '=== СТАТИСТИКА ===');
        eventBus.emit('message:info', `Имя: ${player.name}`);
        eventBus.emit('message:info', `Уровень: ${player.level}`);
        eventBus.emit('message:info', `HP: ${player.hp}/${player.maxHp}`);
        eventBus.emit('message:info', `MP: ${player.mp}/${player.maxMp}`);
        eventBus.emit('message:info', `Атака: ${player.attack}`);
        eventBus.emit('message:info', `Защита: ${player.defense}`);
        eventBus.emit('message:info', `Золото: ${player.gold}`);
        eventBus.emit('message:info', `Опыт: ${player.xp}/${player.xpNeeded}`);
    }
}

export class RestCommand {
    execute(state, eventBus) {
        if (state.isInCombat()) {
            eventBus.emit('message:error', 'Невозможно отдохнуть во время боя!');
            return;
        }
        
        const location = state.getCurrentLocation();
        
        if (location.type === 'town') {
            const player = state.getPlayer();
            player.rest();
            eventBus.emit('message:success', 'Вы отдохнули и полностью восстановили HP и MP.');
        } else {
            eventBus.emit('message:error', 'Здесь слишком опасно для отдыха!');
        }
    }
}