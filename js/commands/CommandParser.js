// js/commands/CommandParser.js
import { LOCATIONS } from '../data/locations.js';
import { Enemy } from '../entities/Enemy.js';

export class CommandParser {
    constructor(state, eventBus) {
        this.state = state;
        this.eventBus = eventBus;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('command:look', () => this.look());
        this.eventBus.on('ui:refresh', () => this.updateDisplay());
    }

    parse(input) {
        const cmd = input.trim().toLowerCase();
        const parts = cmd.split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');

        switch(command) {
            case 'help': case 'помощь': case '?':
                this.help();
                break;
            case 'look': case 'осмотреться': case 'l': case 'о':
                this.look();
                break;
            case 'north': case 'n': case 'с': case 'север':
                this.move('north');
                break;
            case 'south': case 's': case 'ю': case 'юг':
                this.move('south');
                break;
            case 'east': case 'e': case 'в': case 'восток':
                this.move('east');
                break;
            case 'west': case 'w': case 'з': case 'запад':
                this.move('west');
                break;
            case 'attack': case 'атаковать': case 'а':
                this.attack(args);
                break;
            case 'inventory': case 'инвентарь': case 'i': case 'инв':
                this.inventory();
                break;
            case 'stats': case 'статистика': case 'ст':
                this.stats();
                break;
            case 'rest': case 'отдохнуть': case 'р':
                this.rest();
                break;
            case 'flee': case 'бежать': case 'б':
                this.flee();
                break;
            case 'use': case 'использовать':
                this.use(args);
                break;
            default:
                this.eventBus.emit('message:error', 'Неизвестная команда. Наберите "help"');
        }
    }

    help() {
        this.eventBus.emit('message:system', '=== СПИСОК КОМАНД ===');
        this.eventBus.emit('message:success', 'look / осмотреться / l / о - Осмотреть локацию');
        this.eventBus.emit('message:success', 'north/south/east/west / n/s/e/w / с/ю/в/з - Двигаться');
        this.eventBus.emit('message:success', 'attack / атаковать / а - Атаковать врага');
        this.eventBus.emit('message:success', 'flee / бежать / б - Убежать из боя');
        this.eventBus.emit('message:success', 'use / использовать - Использовать предмет');
        this.eventBus.emit('message:success', 'inventory / инвентарь / i - Инвентарь');
        this.eventBus.emit('message:success', 'stats / статистика / ст - Статистика');
        this.eventBus.emit('message:success', 'rest / отдохнуть / р - Отдохнуть');
    }

    look() {
        const loc = this.state.getLocation();
        this.eventBus.emit('message:success', `Вы находитесь: ${loc.name}`);
        this.eventBus.emit('message:info', loc.desc);
        
        if (this.state.combat) {
            const e = this.state.combat.enemy;
            this.eventBus.emit('message:combat', `⚔️ Бой! ${e.name} (HP: ${e.hp}/${e.maxHp})`);
        }
        
        if (loc.exits) {
            const exits = Object.keys(loc.exits).map(d => ({
                north: 'север', south: 'юг', 
                east: 'восток', west: 'запад'
            })[d] || d).join(', ');
            this.eventBus.emit('message:info', `Выходы: ${exits}`);
        }
        
        this.updateDisplay();
    }

    move(direction) {
        if (this.state.combat) {
            this.eventBus.emit('message:error', 'Нельзя уйти во время боя!');
            return;
        }

        const loc = this.state.getLocation();
        if (!loc.exits || !loc.exits[direction]) {
            this.eventBus.emit('message:error', 'Вы не можете пойти в этом направлении.');
            return;
        }

        const dirLabels = { north: 'север', south: 'юг', east: 'восток', west: 'запад' };
        this.eventBus.emit('message:success', `Вы идете на ${dirLabels[direction]}...`);
        this.state.setLocation(loc.exits[direction]);
        this.look();
    }

    attack(target) {
        if (this.state.combat) {
            this.doCombatRound();
            return;
        }

        const loc = this.state.getLocation();
        if (!loc.enemies || loc.enemies.length === 0) {
            this.eventBus.emit('message:error', 'Здесь нет врагов!');
            return;
        }

        const enemyName = loc.enemies.find(e => e.toLowerCase().includes(target.toLowerCase()));
        if (!enemyName) {
            this.eventBus.emit('message:error', 'Такого врага здесь нет!');
            return;
        }

        const enemy = Enemy.create(enemyName);
        this.state.startCombat(enemy);
        this.eventBus.emit('message:combat', `⚔️ Бой начался! ${enemy.name} (HP: ${enemy.hp})`);
        this.updateDisplay();
    }

    doCombatRound() {
        const p = this.state.player;
        const e = this.state.combat.enemy;

        const pDmg = p.calculateDamage();
        e.takeDamage(pDmg);
        this.eventBus.emit('message:combat', `Вы наносите ${pDmg} урона! (${e.name}: ${e.hp}/${e.maxHp})`);

        if (e.isDead()) {
            this.eventBus.emit('message:success', `${e.name} повержен!`);
            p.gold += e.gold;
            const levelUp = p.addXp(e.xp);
            this.eventBus.emit('message:success', `Получено: ${e.xp} опыта, ${e.gold} золота`);
            
            if (levelUp) {
                this.eventBus.emit('message:success', `⭐ УРОВЕНЬ ПОВЫШЕН! Теперь ${levelUp.level}!`);
            }
            
            const loc = this.state.getLocation();
            const idx = loc.enemies.indexOf(this.state.combat.originalName);
            if (idx > -1) loc.enemies.splice(idx, 1);
            
            this.state.endCombat();
            this.updateDisplay();
            return;
        }

        const eDmg = e.calculateDamage();
        p.takeDamage(eDmg);
        this.eventBus.emit('message:combat', `${e.name} наносит ${eDmg} урона! (Ваше HP: ${p.hp}/${p.maxHp})`);

        if (p.isDead()) {
            this.eventBus.emit('message:error', 'ВЫ ПОГИБЛИ! Обновите страницу.');
            this.state.endCombat();
        }
        
        this.updateDisplay();
    }

    flee() {
        if (!this.state.combat) {
            this.eventBus.emit('message:error', 'Вы не в бою!');
            return;
        }

        if (Math.random() < 0.5) {
            this.eventBus.emit('message:success', 'Вам удалось сбежать!');
            this.state.endCombat();
        } else {
            this.eventBus.emit('message:error', 'Не удалось сбежать!');
            const e = this.state.combat.enemy;
            const dmg = e.calculateDamage();
            this.state.player.takeDamage(dmg);
            this.eventBus.emit('message:combat', `${e.name} атакует! Урон: ${dmg}`);
        }
        this.updateDisplay();
    }

    use(itemName) {
        const item = this.state.player.inventory.find(i => 
            i.name.toLowerCase().includes(itemName.toLowerCase())
        );

        if (!item) {
            this.eventBus.emit('message:error', 'У вас нет такого предмета.');
            return;
        }

        if (item.effect === 'heal') {
            const healed = this.state.player.heal(item.value);
            this.eventBus.emit('message:success', `Использовано ${item.name}. Восстановлено ${healed} HP`);
            item.count--;
            if (item.count <= 0) {
                const idx = this.state.player.inventory.indexOf(item);
                this.state.player.inventory.splice(idx, 1);
            }
        }
        this.updateDisplay();
    }

    inventory() {
        this.eventBus.emit('message:system', '=== ИНВЕНТАРЬ ===');
        if (this.state.player.inventory.length === 0) {
            this.eventBus.emit('message:info', 'Пусто');
        } else {
            this.state.player.inventory.forEach(item => {
                this.eventBus.emit('message:info', `${item.name} x${item.count}`);
            });
        }
    }

    stats() {
        const p = this.state.player;
        this.eventBus.emit('message:system', '=== СТАТИСТИКА ===');
        this.eventBus.emit('message:info', `Имя: ${p.name}`);
        this.eventBus.emit('message:info', `Уровень: ${p.level}`);
        this.eventBus.emit('message:info', `HP: ${p.hp}/${p.maxHp}`);
        this.eventBus.emit('message:info', `MP: ${p.mp}/${p.maxMp}`);
        this.eventBus.emit('message:info', `Атака: ${p.attack}`);
        this.eventBus.emit('message:info', `Защита: ${p.defense}`);
        this.eventBus.emit('message:info', `Золото: ${p.gold}`);
        this.eventBus.emit('message:info', `Опыт: ${p.xp}/${p.xpNeeded}`);
    }

    rest() {
        const loc = this.state.getLocation();
        if (this.state.combat) {
            this.eventBus.emit('message:error', 'Нельзя отдохнуть во время боя!');
            return;
        }

        if (loc.type === 'town') {
            this.state.player.rest();
            this.eventBus.emit('message:success', 'Вы отдохнули. HP и MP восстановлены.');
            this.updateDisplay();
        } else {
            this.eventBus.emit('message:error', 'Здесь слишком опасно!');
        }
    }

    updateDisplay() {
        const p = this.state.player;
        document.getElementById('hp').textContent = p.hp;
        document.getElementById('maxHp').textContent = p.maxHp;
        document.getElementById('mp').textContent = p.mp;
        document.getElementById('maxMp').textContent = p.maxMp;
        document.getElementById('gold').textContent = p.gold;
        document.getElementById('level').textContent = p.level;
        document.getElementById('xp').textContent = p.xp;
        document.getElementById('xpNeeded').textContent = p.xpNeeded;

        const loc = this.state.getLocation();
        document.getElementById('locationName').textContent = loc.name;
        document.getElementById('locationDesc').textContent = 
            this.state.combat ? 
            `⚔️ БОЙ! ${this.state.combat.enemy.name} (HP: ${this.state.combat.enemy.hp}/${this.state.combat.enemy.maxHp})` : 
            loc.desc;

        const invDiv = document.getElementById('inventory');
        invDiv.innerHTML = '';
        p.inventory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.textContent = `${item.name} (${item.count})`;
            invDiv.appendChild(div);
        });

        const enemiesDiv = document.getElementById('enemies');
        enemiesDiv.innerHTML = '';
        if (this.state.combat) {
            const div = document.createElement('div');
            div.className = 'enemy';
            div.textContent = `⚔️ ${this.state.combat.enemy.name} (HP: ${this.state.combat.enemy.hp})`;
            enemiesDiv.appendChild(div);
        } else if (loc.enemies && loc.enemies.length > 0) {
            loc.enemies.forEach(e => {
                const div = document.createElement('div');
                div.className = 'enemy';
                div.textContent = '⚔️ ' + e;
                enemiesDiv.appendChild(div);
            });
        }

        const npcsDiv = document.getElementById('npcs');
        npcsDiv.innerHTML = '';
        if (loc.npcs && loc.npcs.length > 0) {
            loc.npcs.forEach(npc => {
                const div = document.createElement('div');
                div.className = 'npc';
                div.textContent = '👤 ' + npc;
                npcsDiv.appendChild(div);
            });
        }
    }
}