// Text RPG Sandbox (MUD-ish) — UX-improved

const STORAGE_KEY = 'text-rpg-sandbox.save.v1';

// -------------------------
// Game State
// -------------------------
const defaultState = () => ({
    player: {
        name: 'Герой',
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        gold: 100,
        level: 1,
        xp: 0,
        xpNeeded: 100,
        attack: 10,
        defense: 5,
        x: 5,
        y: 5,
        location: 'town_square'
    },
    inventory: [
        { name: 'Зелье здоровья', type: 'potion', effect: 'heal', value: 30, count: 3 },
        { name: 'Хлеб', type: 'food', effect: 'heal', value: 10, count: 5 }
    ],
    equipment: {
        weapon: null,
        armor: null,
        helmet: null
    }
});

let gameState = defaultState();

const uiState = {
    history: [],
    historyIndex: -1,
    clickExecutes: true
};

// -------------------------
// World Map Data
// -------------------------
const worldMap = {
    width: 10,
    height: 10,
    tiles: []
};

// -------------------------
// Locations Database
// -------------------------
const locations = {
    town_square: {
        name: 'Центральная площадь',
        desc: 'Оживленная площадь в центре города. Вокруг толпятся торговцы и путешественники. На севере виден храм, на востоке - таверна, на западе - рынок.',
        x: 5, y: 5,
        type: 'town',
        npcs: ['Торговец Маркус', 'Стражник Джон'],
        objects: ['Фонтан', 'Доска объявлений'],
        exits: { north: 'temple', south: 'south_gate', east: 'tavern', west: 'market' }
    },
    temple: {
        name: 'Храм Света',
        desc: 'Величественный храм с высокими колоннами. Здесь можно исцелиться и получить благословение.',
        x: 5, y: 4,
        type: 'town',
        npcs: ['Жрица Элара'],
        objects: ['Алтарь', 'Свечи'],
        exits: { south: 'town_square' }
    },
    tavern: {
        name: 'Таверна "Золотой дракон"',
        desc: 'Уютная таверна, полная приключенцев. Пахнет элем и жареным мясом. В углу играет бард.',
        x: 6, y: 5,
        type: 'town',
        npcs: ['Трактирщик Боб', 'Бард Томас', 'Старый воин'],
        objects: ['Бочка с элем', 'Стол для игры в кости'],
        exits: { west: 'town_square' }
    },
    market: {
        name: 'Городской рынок',
        desc: 'Шумный рынок с множеством лавок. Торговцы предлагают оружие, доспехи и различные товары.',
        x: 4, y: 5,
        type: 'town',
        npcs: ['Кузнец Торин', 'Торговец оружием', 'Торговец зельями'],
        objects: ['Кузница', 'Лавка оружия', 'Алхимическая лавка'],
        exits: { east: 'town_square' }
    },
    south_gate: {
        name: 'Южные ворота',
        desc: 'Массивные ворота города. За ними начинается дикий лес.',
        x: 5, y: 6,
        type: 'town',
        npcs: ['Капитан стражи'],
        objects: ['Ворота'],
        exits: { north: 'town_square', south: 'dark_forest' }
    },
    dark_forest: {
        name: 'Темный лес',
        desc: 'Густой мрачный лес. Слышны странные звуки. Будьте осторожны!',
        x: 5, y: 7,
        type: 'forest',
        npcs: [],
        enemies: ['Волк', 'Разбойник'],
        objects: ['Старое дерево'],
        exits: { north: 'south_gate', south: 'forest_depths', east: 'forest_clearing' }
    },
    forest_depths: {
        name: 'Глубь леса',
        desc: 'Темнота сгущается. Деревья здесь особенно старые и зловещие.',
        x: 5, y: 8,
        type: 'forest',
        npcs: [],
        enemies: ['Гигантский паук', 'Темный волк'],
        objects: ['Заброшенный лагерь'],
        exits: { north: 'dark_forest', west: 'dungeon_entrance' }
    },
    forest_clearing: {
        name: 'Лесная поляна',
        desc: 'Солнечная поляна в лесу. Здесь растут целебные травы.',
        x: 6, y: 7,
        type: 'forest',
        npcs: [],
        objects: ['Целебные травы', 'Ягодный куст'],
        exits: { west: 'dark_forest' }
    },
    dungeon_entrance: {
        name: 'Вход в подземелье',
        desc: 'Темный зловещий вход в древнее подземелье. Оттуда веет холодом и опасностью.',
        x: 4, y: 8,
        type: 'dungeon',
        npcs: [],
        enemies: [],
        objects: ['Каменная дверь'],
        exits: { east: 'forest_depths', down: 'dungeon_level1' }
    },
    dungeon_level1: {
        name: 'Подземелье - Уровень 1',
        desc: 'Сырой каменный коридор. На стенах древние руны. Слышны шаги...',
        x: 4, y: 9,
        type: 'dungeon',
        npcs: [],
        enemies: ['Скелет-воин', 'Зомби'],
        objects: ['Сундук', 'Факел'],
        exits: { up: 'dungeon_entrance' }
    }
};

// -------------------------
// Command system
// -------------------------
const directionAliases = new Map([
    ['n', 'north'], ['north', 'north'], ['с', 'north'], ['север', 'north'],
    ['s', 'south'], ['south', 'south'], ['ю', 'south'], ['юг', 'south'],
    ['e', 'east'], ['east', 'east'], ['в', 'east'], ['восток', 'east'],
    ['w', 'west'], ['west', 'west'], ['з', 'west'], ['запад', 'west'],
    ['u', 'up'], ['up', 'up'], ['вверх', 'up'],
    ['d', 'down'], ['down', 'down'], ['вниз', 'down']
]);

const baseCommands = [
    { cmd: 'help', title: 'Список команд', kind: 'system' },
    { cmd: 'look', title: 'Осмотреться', kind: 'system' },
    { cmd: 'inventory', title: 'Инвентарь', kind: 'system' },
    { cmd: 'stats', title: 'Статистика', kind: 'system' },
    { cmd: 'rest', title: 'Отдохнуть (в городе)', kind: 'system' }
];

function addMessage(text, type = 'info') {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function bootMessages() {
    addMessage('Добро пожаловать в мир Text RPG Sandbox!', 'system');
    addMessage('Это текстовая RPG-песочница в стиле классических MUD игр — но с удобным UI.', 'system');
    addMessage('Пиши команды или кликай по кнопкам. Нажми Tab для автодополнения.', 'system');
}

function pushHistory(cmd) {
    if (!cmd) return;
    const last = uiState.history[uiState.history.length - 1];
    if (last !== cmd) uiState.history.push(cmd);
    uiState.historyIndex = uiState.history.length;
}

function setInputValue(value) {
    const input = document.getElementById('commandInput');
    input.value = value;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}

function normalizeCmd(raw) {
    return String(raw || '').trim();
}

function executeCommand(rawCmd) {
    const cmd = normalizeCmd(rawCmd);
    if (!cmd) return;

    addMessage('> ' + cmd, 'info');
    pushHistory(cmd);

    const lowered = cmd.toLowerCase();
    const parts = lowered.split(/\s+/);
    const command = parts[0];
    const args = lowered.slice(command.length).trim();

    switch (command) {
        case 'help':
        case 'помощь':
            showHelp();
            break;
        case 'look':
        case 'осмотреться':
            look();
            break;
        case 'go':
        case 'идти':
            moveTo(args);
            break;
        case 'north':
        case 'south':
        case 'east':
        case 'west':
        case 'up':
        case 'down':
            moveTo(command);
            break;
        case 'talk':
        case 'говорить':
            talk(args);
            break;
        case 'attack':
        case 'атаковать':
            attack(args);
            break;
        case 'use':
        case 'использовать':
            useItem(args);
            break;
        case 'take':
        case 'взять':
            take(args);
            break;
        case 'examine':
        case 'осмотреть':
            examine(args);
            break;
        case 'inventory':
        case 'инвентарь':
        case 'i':
            showInventory();
            break;
        case 'stats':
        case 'статистика':
            showStats();
            break;
        case 'rest':
        case 'отдохнуть':
            rest();
            break;
        default:
            addMessage('Неизвестная команда. Наберите "help" или используйте кнопки.', 'error');
    }

    updateUI();
    autoSave();
}

// -------------------------
// Contextual commands UI
// -------------------------
function buildContextualCommands() {
    const loc = locations[gameState.player.location];
    const items = [];

    baseCommands.forEach(c => {
        items.push({ label: c.title, command: c.cmd, kind: 'secondary' });
    });

    // Exits
    if (loc?.exits) {
        for (const [dir, destKey] of Object.entries(loc.exits)) {
            const destName = locations[destKey]?.name || destKey;
            const niceDir = dirLabel(dir);
            items.unshift({
                label: `Идти: ${niceDir} → ${destName}`,
                command: `go ${dir}`,
                kind: 'primary'
            });
        }
    }

    // NPC
    (loc?.npcs || []).forEach(n => {
        items.push({ label: `Говорить: ${n}`, command: `talk ${n}`, kind: 'secondary' });
    });

    // Enemies
    (loc?.enemies || []).forEach(e => {
        items.push({ label: `Атаковать: ${e}`, command: `attack ${e}`, kind: 'danger' });
    });

    // Objects
    (loc?.objects || []).forEach(o => {
        items.push({ label: `Осмотреть: ${o}`, command: `examine ${o}`, kind: 'secondary' });
    });

    // Inventory quick use
    (gameState.inventory || []).forEach(it => {
        if (it.count > 0) items.push({ label: `Исп.: ${it.name}`, command: `use ${it.name}`, kind: 'secondary' });
    });

    return items;
}

function renderQuickActions() {
    const holder = document.getElementById('quickActions');
    holder.innerHTML = '';

    const cmds = buildContextualCommands();

    if (cmds.length === 0) {
        const empty = document.createElement('div');
        empty.style.color = '#666';
        empty.style.fontSize = '12px';
        empty.textContent = 'Нет доступных действий.';
        holder.appendChild(empty);
        return;
    }

    cmds.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'cmd-btn' + (item.kind === 'secondary' ? ' secondary' : item.kind === 'danger' ? ' danger' : '');
        btn.textContent = item.label;
        btn.title = item.command;
        btn.onclick = () => {
            if (uiState.clickExecutes) {
                executeCommand(item.command);
            } else {
                setInputValue(item.command);
            }
        };
        holder.appendChild(btn);
    });
}

function dirLabel(dir) {
    const map = {
        north: 'север',
        south: 'юг',
        east: 'восток',
        west: 'запад',
        up: 'вверх',
        down: 'вниз'
    };
    return map[dir] || dir;
}

// -------------------------
// World map
// -------------------------
function initWorldMap() {
    for (let y = 0; y < worldMap.height; y++) {
        worldMap.tiles[y] = [];
        for (let x = 0; x < worldMap.width; x++) {
            worldMap.tiles[y][x] = { type: 'grass' };
        }
    }

    for (const [key, loc] of Object.entries(locations)) {
        if (loc.x !== undefined && loc.y !== undefined) {
            worldMap.tiles[loc.y][loc.x] = { type: loc.type, location: key };
        }
    }
}

function drawWorldMap() {
    const canvas = document.getElementById('worldMap');
    const ctx = canvas.getContext('2d');
    const tileSize = 30;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < worldMap.height; y++) {
        for (let x = 0; x < worldMap.width; x++) {
            const tile = worldMap.tiles[y][x];

            switch (tile.type) {
                case 'town': ctx.fillStyle = '#00aaff'; break;
                case 'forest': ctx.fillStyle = '#004400'; break;
                case 'dungeon': ctx.fillStyle = '#440000'; break;
                default: ctx.fillStyle = '#002200';
            }

            ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);

            if (tile.type !== 'grass') {
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                let symbol = '';
                switch (tile.type) {
                    case 'town': symbol = '■'; break;
                    case 'forest': symbol = '♣'; break;
                    case 'dungeon': symbol = '▲'; break;
                }

                ctx.fillText(symbol, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
            }
        }
    }

    // Player
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◆', gameState.player.x * tileSize + tileSize / 2, gameState.player.y * tileSize + tileSize / 2);
}

function tryMoveByMapClick(targetX, targetY) {
    const loc = locations[gameState.player.location];
    if (!loc?.exits) return;

    // Only allow moving to directly connected exits
    for (const [dir, destKey] of Object.entries(loc.exits)) {
        const dest = locations[destKey];
        if (!dest) continue;
        if (dest.x === targetX && dest.y === targetY) {
            executeCommand(`go ${dir}`);
            return;
        }
    }

    addMessage('Туда нельзя пойти напрямую отсюда. Используйте выходы.', 'error');
}

// -------------------------
// UI updates
// -------------------------
function updateUI() {
    document.getElementById('hp').textContent = gameState.player.hp;
    document.getElementById('maxHp').textContent = gameState.player.maxHp;
    document.getElementById('mp').textContent = gameState.player.mp;
    document.getElementById('maxMp').textContent = gameState.player.maxMp;
    document.getElementById('gold').textContent = gameState.player.gold;
    document.getElementById('level').textContent = gameState.player.level;
    document.getElementById('xp').textContent = gameState.player.xp;
    document.getElementById('xpNeeded').textContent = gameState.player.xpNeeded;

    const loc = locations[gameState.player.location];
    if (loc) {
        document.getElementById('locationName').textContent = loc.name;
        document.getElementById('locationDesc').textContent = loc.desc;

        // NPCs
        const npcsDiv = document.getElementById('npcs');
        npcsDiv.innerHTML = '';
        if (loc.npcs && loc.npcs.length > 0) {
            loc.npcs.forEach(npc => {
                const div = document.createElement('div');
                div.className = 'npc';
                div.textContent = '👤 ' + npc;
                div.onclick = () => executeCommand('talk ' + npc);
                npcsDiv.appendChild(div);
            });
        } else {
            npcsDiv.innerHTML = '<div style="color:#666;font-size:11px;">Никого нет</div>';
        }

        // Enemies
        const enemiesDiv = document.getElementById('enemies');
        enemiesDiv.innerHTML = '';
        if (loc.enemies && loc.enemies.length > 0) {
            loc.enemies.forEach(enemy => {
                const div = document.createElement('div');
                div.className = 'enemy';
                div.textContent = '⚔️ ' + enemy;
                div.onclick = () => executeCommand('attack ' + enemy);
                enemiesDiv.appendChild(div);
            });
        } else {
            enemiesDiv.innerHTML = '<div style="color:#666;font-size:11px;">Нет врагов</div>';
        }

        // Objects
        const objectsDiv = document.getElementById('objects');
        objectsDiv.innerHTML = '';
        if (loc.objects && loc.objects.length > 0) {
            loc.objects.forEach(obj => {
                const div = document.createElement('div');
                div.className = 'object';
                div.textContent = '📦 ' + obj;
                div.onclick = () => executeCommand('examine ' + obj);
                objectsDiv.appendChild(div);
            });
        } else {
            objectsDiv.innerHTML = '<div style="color:#666;font-size:11px;">Ничего нет</div>';
        }
    }

    // Inventory
    const invDiv = document.getElementById('inventory');
    invDiv.innerHTML = '';
    (gameState.inventory || []).forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = `${item.name} (${item.count})`;
        div.onclick = () => executeCommand('use ' + item.name);
        invDiv.appendChild(div);
    });

    document.getElementById('weapon').textContent = gameState.equipment.weapon || 'Нет';
    document.getElementById('armor').textContent = gameState.equipment.armor || 'Нет';
    document.getElementById('helmet').textContent = gameState.equipment.helmet || 'Нет';

    renderQuickActions();
    drawWorldMap();
}

// -------------------------
// Game actions
// -------------------------
function showHelp() {
    addMessage('=== КОМАНДЫ (основные) ===', 'system');
    addMessage('look / осмотреться — описание локации', 'success');
    addMessage('go <направление> — движение (n/s/e/w/u/d, север/юг/...)', 'success');
    addMessage('talk <имя> — разговор с NPC', 'success');
    addMessage('attack <враг> — атака', 'success');
    addMessage('use <предмет> — использовать предмет', 'success');
    addMessage('examine <объект> — осмотреть объект', 'success');
    addMessage('inventory / i — инвентарь', 'success');
    addMessage('stats — статистика', 'success');
    addMessage('rest — отдых (в безопасных местах)', 'success');
}

function look() {
    const loc = locations[gameState.player.location];
    addMessage(`Вы находитесь: ${loc.name}`, 'success');
    addMessage(loc.desc, 'info');

    if (loc.exits) {
        const exits = Object.entries(loc.exits)
            .map(([dir, to]) => `${dirLabel(dir)} → ${locations[to]?.name || to}`)
            .join(', ');
        addMessage(`Выходы: ${exits}`, 'info');
    }
}

function moveTo(rawDirection) {
    const dirRaw = (rawDirection || '').trim().toLowerCase();
    const dir = directionAliases.get(dirRaw) || directionAliases.get(dirRaw[0]) || dirRaw;

    const loc = locations[gameState.player.location];
    if (!dir || !loc?.exits || !loc.exits[dir]) {
        addMessage('Вы не можете пойти в этом направлении.', 'error');
        return;
    }

    const newLocKey = loc.exits[dir];
    const newLoc = locations[newLocKey];

    gameState.player.location = newLocKey;
    if (newLoc?.x !== undefined) gameState.player.x = newLoc.x;
    if (newLoc?.y !== undefined) gameState.player.y = newLoc.y;

    addMessage(`Вы идете: ${dirLabel(dir)}.`, 'success');
    look();
}

function talk(npcName) {
    const target = String(npcName || '').trim();
    const loc = locations[gameState.player.location];

    if (!target) {
        addMessage('С кем говорить? Выберите персонажа справа или через кнопки.', 'error');
        return;
    }

    if (!loc.npcs || !loc.npcs.some(n => n.toLowerCase().includes(target.toLowerCase()))) {
        addMessage('Здесь нет такого персонажа.', 'error');
        return;
    }

    const dialogues = {
        'маркус': 'Приветствую, путник! У меня есть отличные товары. (Торговля — скоро)',
        'джон': 'Стража всегда бдит! Будьте осторожны за городом.',
        'элара': 'Да благословит вас свет! Могу исцелить ваши раны. (rest)',
        'боб': 'Добро пожаловать в "Золотой дракон"! В городе сейчас неспокойно...',
        'томас': '♪ Песня о герое пишется прямо сейчас... ♪',
        'торин': 'Хочешь сталь — не экономь на кузнеце.'
    };

    const lowered = target.toLowerCase();
    for (const [key, dialogue] of Object.entries(dialogues)) {
        if (lowered.includes(key)) {
            addMessage(dialogue, 'success');
            return;
        }
    }

    addMessage('Персонаж молчит.', 'info');
}

function attack(enemyName) {
    const target = String(enemyName || '').trim();
    const loc = locations[gameState.player.location];

    if (!target) {
        addMessage('Кого атаковать? Выберите врага справа или через кнопки.', 'error');
        return;
    }

    if (!loc.enemies || !loc.enemies.some(e => e.toLowerCase().includes(target.toLowerCase()))) {
        addMessage('Здесь нет такого врага.', 'error');
        return;
    }

    const enemyStats = {
        'волк': { hp: 30, attack: 8, xp: 25, gold: 10 },
        'разбойник': { hp: 40, attack: 12, xp: 35, gold: 25 },
        'паук': { hp: 50, attack: 15, xp: 50, gold: 30 },
        'скелет': { hp: 45, attack: 13, xp: 40, gold: 20 },
        'зомби': { hp: 60, attack: 10, xp: 45, gold: 15 },
        'волк2': { hp: 55, attack: 16, xp: 60, gold: 35 }
    };

    let enemy = null;
    const lowered = target.toLowerCase();
    for (const [key, stats] of Object.entries(enemyStats)) {
        if (lowered.includes(key)) {
            enemy = { name: loc.enemies.find(e => e.toLowerCase().includes(key)) || target, ...stats };
            break;
        }
    }
    if (!enemy) enemy = { name: target, hp: 35, attack: 10, xp: 30, gold: 15 };

    addMessage(`Вы атакуете ${enemy.name}!`, 'combat');

    const playerDamage = Math.max(1, gameState.player.attack - Math.floor(Math.random() * 5));
    enemy.hp -= playerDamage;
    addMessage(`Вы наносите ${playerDamage} урона.`, 'combat');

    if (enemy.hp <= 0) {
        addMessage(`${enemy.name} повержен!`, 'success');
        gameState.player.xp += enemy.xp;
        gameState.player.gold += enemy.gold;
        addMessage(`Получено: ${enemy.xp} XP и ${enemy.gold} gold.`, 'success');

        const idx = loc.enemies.findIndex(e => e.toLowerCase().includes(lowered));
        if (idx > -1) loc.enemies.splice(idx, 1);

        if (gameState.player.xp >= gameState.player.xpNeeded) levelUp();
        return;
    }

    const enemyDamage = Math.max(1, enemy.attack - gameState.player.defense - Math.floor(Math.random() * 3));
    gameState.player.hp -= enemyDamage;
    addMessage(`${enemy.name} наносит вам ${enemyDamage} урона.`, 'combat');

    if (gameState.player.hp <= 0) {
        gameState.player.hp = 0;
        addMessage('ВЫ ПОГИБЛИ! (Нажмите Reset, чтобы начать заново.)', 'error');
    }
}

function useItem(itemName) {
    const target = String(itemName || '').trim().toLowerCase();
    if (!target) {
        addMessage('Что использовать? Кликните предмет в инвентаре.', 'error');
        return;
    }

    const item = (gameState.inventory || []).find(i => i.name.toLowerCase().includes(target));
    if (!item) {
        addMessage('У вас нет такого предмета.', 'error');
        return;
    }

    if (item.effect === 'heal') {
        const healAmount = Math.min(item.value, gameState.player.maxHp - gameState.player.hp);
        if (healAmount <= 0) {
            addMessage('HP уже полное.', 'info');
            return;
        }
        gameState.player.hp += healAmount;
        addMessage(`Вы использовали ${item.name} и восстановили ${healAmount} HP.`, 'success');

        item.count--;
        if (item.count <= 0) {
            const index = gameState.inventory.indexOf(item);
            gameState.inventory.splice(index, 1);
        }
        return;
    }

    addMessage('Ничего не произошло.', 'info');
}

function take(objectName) {
    const target = String(objectName || '').trim();
    if (!target) {
        addMessage('Что взять? (пока прототип)', 'error');
        return;
    }
    addMessage(`Вы взяли: ${target}. (Лут/вес/контейнеры — скоро)`, 'success');
}

function examine(objectName) {
    const target = String(objectName || '').trim().toLowerCase();
    if (!target) {
        addMessage('Что осмотреть?', 'error');
        return;
    }

    const descriptions = {
        'фонтан': 'Красивый фонтан с чистой водой. В воде блестят монеты.',
        'алтарь': 'Священный алтарь излучает теплый свет.',
        'сундук': 'Старый деревянный сундук. Заперт, но выглядит хрупким.',
        'дверь': 'Массивная каменная дверь с древними рунами.',
        'доска': 'Доска объявлений: "Охота на волков. Платим золотом."'
    };

    for (const [key, desc] of Object.entries(descriptions)) {
        if (target.includes(key)) {
            addMessage(desc, 'info');
            return;
        }
    }

    addMessage('Ничего особенного.', 'info');
}

function showInventory() {
    addMessage('=== ИНВЕНТАРЬ ===', 'system');
    if (!gameState.inventory || gameState.inventory.length === 0) {
        addMessage('Пусто', 'info');
        return;
    }
    gameState.inventory.forEach(item => {
        addMessage(`${item.name} x${item.count}`, 'info');
    });
}

function showStats() {
    addMessage('=== СТАТИСТИКА ===', 'system');
    addMessage(`Имя: ${gameState.player.name}`, 'info');
    addMessage(`Уровень: ${gameState.player.level}`, 'info');
    addMessage(`HP: ${gameState.player.hp}/${gameState.player.maxHp}`, 'info');
    addMessage(`MP: ${gameState.player.mp}/${gameState.player.maxMp}`, 'info');
    addMessage(`Атака: ${gameState.player.attack}`, 'info');
    addMessage(`Защита: ${gameState.player.defense}`, 'info');
    addMessage(`Золото: ${gameState.player.gold}`, 'info');
    addMessage(`Опыт: ${gameState.player.xp}/${gameState.player.xpNeeded}`, 'info');
}

function rest() {
    const loc = locations[gameState.player.location];

    if (loc?.type === 'town') {
        gameState.player.hp = gameState.player.maxHp;
        gameState.player.mp = gameState.player.maxMp;
        addMessage('Вы отдохнули и полностью восстановили HP и MP.', 'success');
    } else {
        addMessage('Здесь слишком опасно для отдыха! Найдите безопасное место.', 'error');
    }
}

function levelUp() {
    gameState.player.level++;
    gameState.player.xp = 0;
    gameState.player.xpNeeded = Math.floor(gameState.player.xpNeeded * 1.5);
    gameState.player.maxHp += 20;
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.maxMp += 10;
    gameState.player.mp = gameState.player.maxMp;
    gameState.player.attack += 5;
    gameState.player.defense += 2;

    addMessage('★ УРОВЕНЬ ПОВЫШЕН! ★', 'success');
    addMessage(`Теперь вы ${gameState.player.level} уровня.`, 'success');
}

// -------------------------
// Save / Load
// -------------------------
function autoSave() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (_) {}
}

function saveGame() {
    autoSave();
    addMessage('Сохранено.', 'success');
}

function loadGame() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            addMessage('Нет сохранения.', 'error');
            return;
        }
        const parsed = JSON.parse(raw);
        if (!parsed?.player?.location) throw new Error('bad save');
        gameState = parsed;
        addMessage('Загружено.', 'success');
        look();
        updateUI();
    } catch {
        addMessage('Не удалось загрузить сохранение.', 'error');
    }
}

function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    gameState = defaultState();
    document.getElementById('output').innerHTML = '';
    bootMessages();
    look();
    updateUI();
}

// -------------------------
// Input helpers (history + autocomplete + movement)
// -------------------------
function getAutocompletePool() {
    const pool = new Set();
    baseCommands.forEach(c => pool.add(c.cmd));
    buildContextualCommands().forEach(c => pool.add(c.command));

    // also allow plain directions
    ['north', 'south', 'east', 'west', 'up', 'down', 'go north', 'go south', 'go east', 'go west'].forEach(c => pool.add(c));
    return Array.from(pool);
}

function autocompleteCurrentInput() {
    const input = document.getElementById('commandInput');
    const value = input.value.trim().toLowerCase();
    if (!value) return;

    const pool = getAutocompletePool();
    const hit = pool.find(c => c.toLowerCase().startsWith(value));
    if (hit) setInputValue(hit);
}

function tryArrowMovement(key) {
    const input = document.getElementById('commandInput');
    if (input.value.trim()) return false;

    if (key === 'ArrowUp' || key === 'w' || key === 'ц') { executeCommand('go north'); return true; }
    if (key === 'ArrowDown' || key === 's' || key === 'ы') { executeCommand('go south'); return true; }
    if (key === 'ArrowLeft' || key === 'a' || key === 'ф') { executeCommand('go west'); return true; }
    if (key === 'ArrowRight' || key === 'd' || key === 'в') { executeCommand('go east'); return true; }
    return false;
}

// -------------------------
// Wire UI
// -------------------------
function wireUI() {
    const input = document.getElementById('commandInput');
    const sendBtn = document.getElementById('sendBtn');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            autocompleteCurrentInput();
            return;
        }

        // command history
        if (e.key === 'ArrowUp' && input.value.trim()) {
            e.preventDefault();
            uiState.historyIndex = Math.max(0, uiState.historyIndex - 1);
            setInputValue(uiState.history[uiState.historyIndex] || input.value);
            return;
        }
        if (e.key === 'ArrowDown' && input.value.trim()) {
            e.preventDefault();
            uiState.historyIndex = Math.min(uiState.history.length, uiState.historyIndex + 1);
            setInputValue(uiState.history[uiState.historyIndex] || '');
            return;
        }

        // quick movement when input is empty
        if (tryArrowMovement(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const value = input.value;
            input.value = '';
            executeCommand(value);
        }
    });

    sendBtn.addEventListener('click', () => {
        const value = input.value;
        input.value = '';
        executeCommand(value);
    });

    document.getElementById('toggleClickMode').addEventListener('change', (e) => {
        uiState.clickExecutes = !!e.target.checked;
    });

    document.getElementById('btnSave').addEventListener('click', saveGame);
    document.getElementById('btnLoad').addEventListener('click', loadGame);
    document.getElementById('btnReset').addEventListener('click', resetGame);

    // map click
    const canvas = document.getElementById('worldMap');
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX / 30);
        const y = Math.floor((e.clientY - rect.top) * scaleY / 30);
        tryMoveByMapClick(x, y);
    });
}

// -------------------------
// Init
// -------------------------
function init() {
    initWorldMap();
    wireUI();

    // boot output
    document.getElementById('output').innerHTML = '';
    bootMessages();

    // auto-load if exists
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.player?.location) gameState = parsed;
        }
    } catch (_) {}

    look();
    updateUI();
    autoSave();
}

init();
