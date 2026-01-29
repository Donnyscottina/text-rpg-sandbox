// Game State
const gameState = {
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
    },
    combat: null,
    commandHistory: [],
    historyIndex: -1
};

// World Map Data
const worldMap = {
    width: 10,
    height: 10,
    tiles: []
};

// Locations Database
const locations = {
    town_square: {
        name: 'Центральная площадь',
        desc: 'Оживленная площадь в центре города. Вокруг толпятся торговцы и путешественники.',
        x: 5, y: 5,
        type: 'town',
        npcs: ['Торговец Маркус', 'Стражник Джон'],
        objects: ['Фонтан'],
        exits: { north: 'temple', south: 'south_gate', east: 'tavern', west: 'market' }
    },
    temple: {
        name: 'Храм Света',
        desc: 'Величественный храм. Здесь можно исцелиться.',
        x: 5, y: 4,
        type: 'town',
        npcs: ['Жрица Элара'],
        exits: { south: 'town_square' }
    },
    tavern: {
        name: 'Таверна "Золотой дракон"',
        desc: 'Уютная таверна. Пахнет элем и жареным мясом.',
        x: 6, y: 5,
        type: 'town',
        npcs: ['Трактирщик Боб'],
        exits: { west: 'town_square' }
    },
    market: {
        name: 'Городской рынок',
        desc: 'Шумный рынок с множеством лавок.',
        x: 4, y: 5,
        type: 'town',
        npcs: ['Кузнец Торин'],
        exits: { east: 'town_square' }
    },
    south_gate: {
        name: 'Южные ворота',
        desc: 'Массивные ворота города. За ними начинается дикий лес.',
        x: 5, y: 6,
        type: 'town',
        npcs: ['Капитан стражи'],
        exits: { north: 'town_square', south: 'dark_forest' }
    },
    dark_forest: {
        name: 'Темный лес',
        desc: 'Густой мрачный лес. Слышны странные звуки.',
        x: 5, y: 7,
        type: 'forest',
        enemies: ['Волк', 'Разбойник'],
        exits: { north: 'south_gate', south: 'forest_depths' }
    },
    forest_depths: {
        name: 'Глубь леса',
        desc: 'Темнота сгущается. Очень опасно!',
        x: 5, y: 8,
        type: 'forest',
        enemies: ['Гигантский паук', 'Темный волк'],
        exits: { north: 'dark_forest', west: 'dungeon_entrance' }
    },
    dungeon_entrance: {
        name: 'Вход в подземелье',
        desc: 'Темный зловещий вход.',
        x: 4, y: 8,
        type: 'dungeon',
        exits: { east: 'forest_depths', down: 'dungeon_level1' }
    },
    dungeon_level1: {
        name: 'Подземелье - Уровень 1',
        desc: 'Сырой каменный коридор.',
        x: 4, y: 9,
        type: 'dungeon',
        enemies: ['Скелет-воин', 'Зомби'],
        exits: { up: 'dungeon_entrance' }
    }
};

// Initialize world map
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

// Draw world map
function drawWorldMap() {
    const canvas = document.getElementById('worldMap');
    const ctx = canvas.getContext('2d');
    const tileSize = 30;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < worldMap.height; y++) {
        for (let x = 0; x < worldMap.width; x++) {
            const tile = worldMap.tiles[y][x];
            
            switch(tile.type) {
                case 'town':
                    ctx.fillStyle = '#00aaff';
                    break;
                case 'forest':
                    ctx.fillStyle = '#004400';
                    break;
                case 'dungeon':
                    ctx.fillStyle = '#440000';
                    break;
                default:
                    ctx.fillStyle = '#002200';
            }
            
            ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);
            
            if (tile.type !== 'grass') {
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                let symbol = '';
                switch(tile.type) {
                    case 'town': symbol = '■'; break;
                    case 'forest': symbol = '♣'; break;
                    case 'dungeon': symbol = '▲'; break;
                }
                
                ctx.fillText(symbol, x * tileSize + tileSize/2, y * tileSize + tileSize/2);
            }
        }
    }
    
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◆', gameState.player.x * tileSize + tileSize/2, gameState.player.y * tileSize + tileSize/2);
}

// Get suggested commands
function getSuggestedCommands() {
    const loc = locations[gameState.player.location];
    const suggestions = [];
    
    if (gameState.combat) {
        suggestions.push({ label: '⚔️ Атаковать', command: 'attack', style: 'danger' });
        suggestions.push({ label: '🏃 Убежать', command: 'flee' });
        suggestions.push({ label: '🎒 Инвентарь', command: 'inventory' });
        return suggestions;
    }
    
    if (loc.exits) {
        for (const [dir] of Object.entries(loc.exits)) {
            const dirLabel = { north: '↑ Север', south: '↓ Юг', east: '→ Восток', west: '← Запад', up: '⬆ Вверх', down: '⬇ Вниз' }[dir] || dir;
            suggestions.push({ label: dirLabel, command: dir, style: 'secondary' });
        }
    }
    
    suggestions.push({ label: '👁 Осмотреться', command: 'look' });
    
    if (loc.type === 'town') {
        suggestions.push({ label: '💤 Отдохнуть', command: 'rest' });
    }
    
    if (loc.enemies && loc.enemies.length > 0) {
        loc.enemies.forEach(enemy => {
            suggestions.push({ label: `⚔️ ${enemy}`, command: `attack ${enemy}`, style: 'danger' });
        });
    }
    
    suggestions.push({ label: '🎒 Инвентарь', command: 'inventory' });
    suggestions.push({ label: '📊 Статистика', command: 'stats' });
    suggestions.push({ label: '❓ Помощь', command: 'help' });
    
    return suggestions;
}

// Render quick actions
function renderQuickActions() {
    const container = document.getElementById('quickActions');
    const suggestions = getSuggestedCommands();
    
    container.innerHTML = '';
    
    suggestions.forEach(sug => {
        const btn = document.createElement('button');
        btn.className = `cmd-btn ${sug.style || ''}`;
        btn.textContent = sug.label;
        btn.onclick = () => {
            if (document.getElementById('toggleClickMode').checked) {
                executeCommand(sug.command);
            } else {
                document.getElementById('commandInput').value = sug.command;
                document.getElementById('commandInput').focus();
            }
        };
        container.appendChild(btn);
    });
}

// Update UI
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
        document.getElementById('locationDesc').textContent = gameState.combat ? 
            `⚔️ БОЙ! ${gameState.combat.enemy.name} (HP: ${gameState.combat.enemy.hp}/${gameState.combat.enemy.maxHp})` : 
            loc.desc;
        
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
        
        const enemiesDiv = document.getElementById('enemies');
        enemiesDiv.innerHTML = '';
        if (gameState.combat) {
            const div = document.createElement('div');
            div.className = 'enemy';
            div.textContent = `⚔️ ${gameState.combat.enemy.name} (HP: ${gameState.combat.enemy.hp})`;
            enemiesDiv.appendChild(div);
        } else if (loc.enemies && loc.enemies.length > 0) {
            loc.enemies.forEach(enemy => {
                const div = document.createElement('div');
                div.className = 'enemy';
                div.textContent = '⚔️ ' + enemy;
                enemiesDiv.appendChild(div);
            });
        }
        
        const objectsDiv = document.getElementById('objects');
        objectsDiv.innerHTML = '';
        if (loc.objects && loc.objects.length > 0) {
            loc.objects.forEach(obj => {
                const div = document.createElement('div');
                div.className = 'object';
                div.textContent = '📦 ' + obj;
                objectsDiv.appendChild(div);
            });
        }
    }
    
    const invDiv = document.getElementById('inventory');
    invDiv.innerHTML = '';
    gameState.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = `${item.name} (${item.count})`;
        invDiv.appendChild(div);
    });
    
    document.getElementById('weapon').textContent = gameState.equipment.weapon || 'Нет';
    document.getElementById('armor').textContent = gameState.equipment.armor || 'Нет';
    document.getElementById('helmet').textContent = gameState.equipment.helmet || 'Нет';
    
    drawWorldMap();
    renderQuickActions();
}

// Add message
function addMessage(text, type = 'info') {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

// Execute command
function executeCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    if (!cmd) return;
    
    addMessage('> ' + cmd, 'info');
    
    if (gameState.commandHistory[gameState.commandHistory.length - 1] !== cmd) {
        gameState.commandHistory.push(cmd);
    }
    gameState.historyIndex = gameState.commandHistory.length;
    
    const parts = cmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1).join(' ');
    
    const dirMap = { n: 'north', с: 'north', s: 'south', ю: 'south', e: 'east', в: 'east', w: 'west', з: 'west', u: 'up', вв: 'up', d: 'down', вн: 'down' };
    const normalizedCmd = dirMap[command] || command;
    
    switch(normalizedCmd) {
        case 'help': case 'помощь': case '?': showHelp(); break;
        case 'look': case 'осмотреться': case 'l': case 'о': look(); break;
        case 'north': case 'south': case 'east': case 'west': case 'up': case 'down': go(normalizedCmd); break;
        case 'attack': case 'атаковать': case 'а': attack(args); break;
        case 'flee': case 'бежать': case 'б': flee(); break;
        case 'use': case 'использовать': useItem(args); break;
        case 'inventory': case 'инвентарь': case 'i': case 'инв': showInventory(); break;
        case 'stats': case 'статистика': case 'ст': showStats(); break;
        case 'rest': case 'отдохнуть': case 'р': rest(); break;
        default: addMessage('Неизвестная команда. Наберите "help"', 'error');
    }
}

function showHelp() {
    addMessage('=== СПИСОК КОМАНД ===', 'system');
    addMessage('look / l / о - Осмотреть локацию', 'success');
    addMessage('north/south/east/west / n/s/e/w / с/ю/в/з - Двигаться', 'success');
    addMessage('attack / а - Атаковать', 'success');
    addMessage('flee / б - Убежать из боя', 'success');
    addMessage('use [предмет] - Использовать', 'success');
    addMessage('inventory / i / инв - Инвентарь', 'success');
    addMessage('stats / ст - Статистика', 'success');
    addMessage('rest / р - Отдохнуть', 'success');
}

function look() {
    const loc = locations[gameState.player.location];
    addMessage(`Вы находитесь: ${loc.name}`, 'success');
    addMessage(loc.desc, 'info');
    
    if (gameState.combat) {
        addMessage(`⚔️ Бой! ${gameState.combat.enemy.name} (HP: ${gameState.combat.enemy.hp})`, 'combat');
    }
    
    if (loc.exits) {
        const exits = Object.keys(loc.exits).map(d => ({ north: 'север', south: 'юг', east: 'восток', west: 'запад', up: 'вверх', down: 'вниз' }[d])).join(', ');
        addMessage(`Выходы: ${exits}`, 'info');
    }
}

function go(direction) {
    if (gameState.combat) {
        addMessage('Нельзя уйти во время боя!', 'error');
        return;
    }
    
    const loc = locations[gameState.player.location];
    if (!loc.exits || !loc.exits[direction]) {
        addMessage('Вы не можете пойти в этом направлении.', 'error');
        return;
    }
    
    gameState.player.location = loc.exits[direction];
    const newLoc = locations[gameState.player.location];
    gameState.player.x = newLoc.x;
    gameState.player.y = newLoc.y;
    
    addMessage(`Вы идете...`, 'success');
    look();
    updateUI();
}

function attack(enemyName) {
    if (gameState.combat) {
        performCombatRound();
        return;
    }
    
    const loc = locations[gameState.player.location];
    if (!loc.enemies || !loc.enemies.some(e => e.toLowerCase().includes(enemyName))) {
        addMessage('Здесь нет такого врага.', 'error');
        return;
    }
    
    const enemyStats = {
        'волк': { hp: 30, attack: 8, xp: 25, gold: 10 },
        'разбойник': { hp: 40, attack: 12, xp: 35, gold: 25 },
        'паук': { hp: 50, attack: 15, xp: 50, gold: 30 },
        'скелет': { hp: 45, attack: 13, xp: 40, gold: 20 },
        'зомби': { hp: 60, attack: 10, xp: 45, gold: 15 }
    };
    
    let enemyData = null;
    let originalName = null;
    
    for (const [key, stats] of Object.entries(enemyStats)) {
        if (enemyName.includes(key)) {
            originalName = loc.enemies.find(e => e.toLowerCase().includes(key));
            enemyData = { name: originalName, ...stats, maxHp: stats.hp };
            break;
        }
    }
    
    if (!enemyData) {
        originalName = loc.enemies[0];
        enemyData = { name: originalName, hp: 35, maxHp: 35, attack: 10, xp: 30, gold: 15 };
    }
    
    gameState.combat = { enemy: enemyData, originalName };
    addMessage(`⚔️ Бой начался! ${enemyData.name}`, 'combat');
    updateUI();
}

function performCombatRound() {
    const enemy = gameState.combat.enemy;
    
    const playerDamage = Math.max(1, gameState.player.attack - Math.floor(Math.random() * 5));
    enemy.hp -= playerDamage;
    addMessage(`Вы наносите ${playerDamage} урона! (${enemy.name}: ${Math.max(0, enemy.hp)}/${enemy.maxHp})`, 'combat');
    
    if (enemy.hp <= 0) {
        addMessage(`${enemy.name} повержен!`, 'success');
        gameState.player.xp += enemy.xp;
        gameState.player.gold += enemy.gold;
        addMessage(`Получено: ${enemy.xp} опыта, ${enemy.gold} золота`, 'success');
        
        const loc = locations[gameState.player.location];
        const index = loc.enemies.indexOf(gameState.combat.originalName);
        if (index > -1) loc.enemies.splice(index, 1);
        
        gameState.combat = null;
        
        if (gameState.player.xp >= gameState.player.xpNeeded) {
            levelUp();
        }
        
        updateUI();
        return;
    }
    
    const enemyDamage = Math.max(1, enemy.attack - gameState.player.defense - Math.floor(Math.random() * 3));
    gameState.player.hp -= enemyDamage;
    addMessage(`${enemy.name} наносит ${enemyDamage} урона! (Ваше HP: ${gameState.player.hp}/${gameState.player.maxHp})`, 'combat');
    
    if (gameState.player.hp <= 0) {
        gameState.player.hp = 0;
        gameState.combat = null;
        addMessage('ВЫ ПОГИБЛИ!', 'error');
    }
    
    updateUI();
}

function flee() {
    if (!gameState.combat) {
        addMessage('Вы не в бою.', 'error');
        return;
    }
    
    if (Math.random() < 0.5) {
        addMessage('Вам удалось сбежать!', 'success');
        gameState.combat = null;
        updateUI();
    } else {
        addMessage('Не удалось сбежать!', 'error');
        const enemy = gameState.combat.enemy;
        const enemyDamage = Math.max(1, enemy.attack - gameState.player.defense);
        gameState.player.hp -= enemyDamage;
        addMessage(`${enemy.name} атакует! Урон: ${enemyDamage}`, 'combat');
        
        if (gameState.player.hp <= 0) {
            gameState.player.hp = 0;
            gameState.combat = null;
            addMessage('ВЫ ПОГИБЛИ!', 'error');
        }
        updateUI();
    }
}

function useItem(itemName) {
    const item = gameState.inventory.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
    if (!item) {
        addMessage('У вас нет такого предмета.', 'error');
        return;
    }
    
    if (item.effect === 'heal') {
        const healAmount = Math.min(item.value, gameState.player.maxHp - gameState.player.hp);
        gameState.player.hp += healAmount;
        addMessage(`Использовано ${item.name}. Восстановлено ${healAmount} HP`, 'success');
        item.count--;
        if (item.count <= 0) {
            gameState.inventory.splice(gameState.inventory.indexOf(item), 1);
        }
    }
    updateUI();
}

function showInventory() {
    addMessage('=== ИНВЕНТАРЬ ===', 'system');
    if (gameState.inventory.length === 0) {
        addMessage('Пусто', 'info');
    } else {
        gameState.inventory.forEach(item => addMessage(`${item.name} x${item.count}`, 'info'));
    }
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
    if (gameState.combat) {
        addMessage('Нельзя отдохнуть во время боя!', 'error');
        return;
    }
    
    if (loc.type === 'town') {
        gameState.player.hp = gameState.player.maxHp;
        gameState.player.mp = gameState.player.maxMp;
        addMessage('Вы отдохнули. HP и MP восстановлены.', 'success');
        updateUI();
    } else {
        addMessage('Здесь слишком опасно!', 'error');
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
    addMessage(`Теперь ${gameState.player.level} уровень!`, 'success');
}

// Save/Load
function saveGame() {
    localStorage.setItem('rpg_save', JSON.stringify(gameState));
    addMessage('💾 Игра сохранена!', 'success');
}

function loadGame() {
    const data = localStorage.getItem('rpg_save');
    if (data) {
        Object.assign(gameState, JSON.parse(data));
        addMessage('📂 Игра загружена!', 'success');
        updateUI();
        look();
    } else {
        addMessage('Нет сохраненной игры!', 'error');
    }
}

function resetGame() {
    if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
        localStorage.removeItem('rpg_save');
        location.reload();
    }
}

// Event listeners
const commandInput = document.getElementById('commandInput');

commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (gameState.historyIndex > 0) {
            gameState.historyIndex--;
            commandInput.value = gameState.commandHistory[gameState.historyIndex] || '';
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (gameState.historyIndex < gameState.commandHistory.length - 1) {
            gameState.historyIndex++;
            commandInput.value = gameState.commandHistory[gameState.historyIndex] || '';
        } else {
            gameState.historyIndex = gameState.commandHistory.length;
            commandInput.value = '';
        }
    }
    
    if (commandInput.value === '' && !gameState.combat) {
        const keyMap = { 'ArrowUp': 'north', 'w': 'north', 'ArrowDown': 'south', 's': 'south', 'ArrowLeft': 'west', 'a': 'west', 'ArrowRight': 'east', 'd': 'east' };
        const dir = keyMap[e.key.toLowerCase()];
        if (dir) {
            e.preventDefault();
            executeCommand(dir);
        }
    }
});

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && commandInput.value.trim()) {
        executeCommand(commandInput.value);
        commandInput.value = '';
    }
});

document.getElementById('sendBtn').addEventListener('click', () => {
    if (commandInput.value.trim()) {
        executeCommand(commandInput.value);
        commandInput.value = '';
    }
});

document.getElementById('btnSave').addEventListener('click', saveGame);
document.getElementById('btnLoad').addEventListener('click', loadGame);
document.getElementById('btnReset').addEventListener('click', resetGame);

// Initialize
initWorldMap();
updateUI();
look();
addMessage('Добро пожаловать в игру! Наберите "help" для списка команд.', 'system');