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
    combat: null
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
        enemies: ['Гигантский паук', 'Темный волк'],
        objects: ['Заброшенный лагерь'],
        exits: { north: 'dark_forest', west: 'dungeon_entrance' }
    },
    forest_clearing: {
        name: 'Лесная поляна',
        desc: 'Солнечная поляна в лесу. Здесь растут целебные травы.',
        x: 6, y: 7,
        type: 'forest',
        objects: ['Целебные травы', 'Ягодный куст'],
        exits: { west: 'dark_forest' }
    },
    dungeon_entrance: {
        name: 'Вход в подземелье',
        desc: 'Темный зловещий вход в древнее подземелье. Оттуда веет холодом и опасностью.',
        x: 4, y: 8,
        type: 'dungeon',
        objects: ['Каменная дверь'],
        exits: { east: 'forest_depths', down: 'dungeon_level1' }
    },
    dungeon_level1: {
        name: 'Подземелье - Уровень 1',
        desc: 'Сырой каменный коридор. На стенах древние руны. Слышны шаги...',
        x: 4, y: 9,
        type: 'dungeon',
        enemies: ['Скелет-воин', 'Зомби'],
        objects: ['Сундук', 'Факел'],
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
    
    // Set location tiles
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
    
    // Draw tiles
    for (let y = 0; y < worldMap.height; y++) {
        for (let x = 0; x < worldMap.width; x++) {
            const tile = worldMap.tiles[y][x];
            
            // Set color based on tile type
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
            
            // Draw location symbol
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
    
    // Draw player
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◆', gameState.player.x * tileSize + tileSize/2, gameState.player.y * tileSize + tileSize/2);
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
    
    // Update location
    const loc = locations[gameState.player.location];
    if (loc) {
        document.getElementById('locationName').textContent = loc.name;
        document.getElementById('locationDesc').textContent = loc.desc;
        
        // Update NPCs
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
            npcsDiv.innerHTML = '<div style="color: #666; font-size: 11px;">Никого нет</div>';
        }
        
        // Update Enemies
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
            enemiesDiv.innerHTML = '<div style="color: #666; font-size: 11px;">Нет врагов</div>';
        }
        
        // Update Objects
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
            objectsDiv.innerHTML = '<div style="color: #666; font-size: 11px;">Ничего нет</div>';
        }
    }
    
    // Update inventory
    const invDiv = document.getElementById('inventory');
    invDiv.innerHTML = '';
    gameState.inventory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = `${item.name} (${item.count})`;
        div.onclick = () => executeCommand('use ' + item.name);
        invDiv.appendChild(div);
    });
    
    // Update equipment
    document.getElementById('weapon').textContent = gameState.equipment.weapon || 'Нет';
    document.getElementById('armor').textContent = gameState.equipment.armor || 'Нет';
    document.getElementById('helmet').textContent = gameState.equipment.helmet || 'Нет';
    
    drawWorldMap();
}

// Add message to output
function addMessage(text, type = 'info') {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

// Command processing
function executeCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    addMessage('> ' + cmd, 'info');
    
    const parts = cmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1).join(' ');
    
    switch(command) {
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
        case 'north':
        case 'south':
        case 'east':
        case 'west':
        case 'up':
        case 'down':
            go(command === 'go' || command === 'идти' ? args : command);
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
            addMessage('Неизвестная команда. Наберите "help" для списка команд.', 'error');
    }
}

function showHelp() {
    addMessage('=== СПИСОК КОМАНД ===', 'system');
    addMessage('look / осмотреться - Осмотреть локацию', 'success');
    addMessage('go [направление] / north/south/east/west/up/down - Двигаться', 'success');
    addMessage('talk [имя] - Поговорить с NPC', 'success');
    addMessage('attack [враг] - Атаковать врага', 'success');
    addMessage('use [предмет] - Использовать предмет', 'success');
    addMessage('take [объект] - Взять объект', 'success');
    addMessage('examine [объект] - Осмотреть объект', 'success');
    addMessage('inventory / i - Показать инвентарь', 'success');
    addMessage('stats - Показать статистику', 'success');
    addMessage('rest - Отдохнуть и восстановить HP/MP', 'success');
}

function look() {
    const loc = locations[gameState.player.location];
    addMessage(`Вы находитесь: ${loc.name}`, 'success');
    addMessage(loc.desc, 'info');
    
    if (loc.exits) {
        const exits = Object.keys(loc.exits).join(', ');
        addMessage(`Выходы: ${exits}`, 'info');
    }
}

function go(direction) {
    const loc = locations[gameState.player.location];
    
    if (!loc.exits || !loc.exits[direction]) {
        addMessage('Вы не можете пойти в этом направлении.', 'error');
        return;
    }
    
    const newLoc = loc.exits[direction];
    gameState.player.location = newLoc;
    
    const newLocData = locations[newLoc];
    if (newLocData.x !== undefined) gameState.player.x = newLocData.x;
    if (newLocData.y !== undefined) gameState.player.y = newLocData.y;
    
    addMessage(`Вы идете на ${direction}...`, 'success');
    look();
    updateUI();
}

function talk(npcName) {
    const loc = locations[gameState.player.location];
    
    if (!loc.npcs || !loc.npcs.some(n => n.toLowerCase().includes(npcName))) {
        addMessage('Здесь нет такого персонажа.', 'error');
        return;
    }
    
    // Simple dialogue system
    const dialogues = {
        'маркус': 'Приветствую, путник! У меня есть отличные товары. (Функция торговли пока в разработке)',
        'джон': 'Стража всегда бдит! Будьте осторожны за городом.',
        'элара': 'Да благословит вас свет! Могу исцелить ваши раны. (Наберите "rest" в храме)',
        'боб': 'Добро пожаловать в "Золотой дракон"! Хотите эля? Или ищете работу?',
        'томас': '♪ Я пою песни о великих героях... Может быть, и о вас когда-нибудь! ♪',
        'торин': 'Лучшее оружие в городе! Приходите, когда будет золото.'
    };
    
    for (const [key, dialogue] of Object.entries(dialogues)) {
        if (npcName.includes(key)) {
            addMessage(dialogue, 'success');
            return;
        }
    }
    
    addMessage('Персонаж ничего не говорит.', 'info');
}

function attack(enemyName) {
    const loc = locations[gameState.player.location];
    
    if (!loc.enemies || !loc.enemies.some(e => e.toLowerCase().includes(enemyName))) {
        addMessage('Здесь нет такого врага.', 'error');
        return;
    }
    
    // Simple combat
    const enemyStats = {
        'волк': { hp: 30, attack: 8, xp: 25, gold: 10 },
        'разбойник': { hp: 40, attack: 12, xp: 35, gold: 25 },
        'паук': { hp: 50, attack: 15, xp: 50, gold: 30 },
        'скелет': { hp: 45, attack: 13, xp: 40, gold: 20 },
        'зомби': { hp: 60, attack: 10, xp: 45, gold: 15 }
    };
    
    let enemy = null;
    for (const [key, stats] of Object.entries(enemyStats)) {
        if (enemyName.includes(key)) {
            enemy = { name: loc.enemies.find(e => e.toLowerCase().includes(key)), ...stats };
            break;
        }
    }
    
    if (!enemy) {
        enemy = { name: enemyName, hp: 35, attack: 10, xp: 30, gold: 15 };
    }
    
    addMessage(`Вы атакуете ${enemy.name}!`, 'combat');
    
    // Player attacks
    const playerDamage = Math.max(1, gameState.player.attack - Math.floor(Math.random() * 5));
    enemy.hp -= playerDamage;
    addMessage(`Вы наносите ${playerDamage} урона!`, 'combat');
    
    if (enemy.hp <= 0) {
        addMessage(`${enemy.name} повержен!`, 'success');
        gameState.player.xp += enemy.xp;
        gameState.player.gold += enemy.gold;
        addMessage(`Получено: ${enemy.xp} опыта и ${enemy.gold} золота`, 'success');
        
        // Remove enemy from location
        const index = loc.enemies.findIndex(e => e.toLowerCase().includes(enemyName));
        if (index > -1) loc.enemies.splice(index, 1);
        
        // Check level up
        if (gameState.player.xp >= gameState.player.xpNeeded) {
            levelUp();
        }
        
        updateUI();
        return;
    }
    
    // Enemy attacks back
    const enemyDamage = Math.max(1, enemy.attack - gameState.player.defense - Math.floor(Math.random() * 3));
    gameState.player.hp -= enemyDamage;
    addMessage(`${enemy.name} наносит вам ${enemyDamage} урона!`, 'combat');
    
    if (gameState.player.hp <= 0) {
        gameState.player.hp = 0;
        addMessage('ВЫ ПОГИБЛИ! Игра окончена.', 'error');
        addMessage('Обновите страницу для начала новой игры.', 'system');
    }
    
    updateUI();
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
        addMessage(`Вы использовали ${item.name} и восстановили ${healAmount} HP.`, 'success');
        
        item.count--;
        if (item.count <= 0) {
            const index = gameState.inventory.indexOf(item);
            gameState.inventory.splice(index, 1);
        }
    }
    
    updateUI();
}

function take(objectName) {
    const loc = locations[gameState.player.location];
    
    if (!loc.objects || !loc.objects.some(o => o.toLowerCase().includes(objectName))) {
        addMessage('Здесь нет такого объекта.', 'error');
        return;
    }
    
    addMessage(`Вы взяли: ${objectName}`, 'success');
    // Add to inventory logic here
}

function examine(objectName) {
    const descriptions = {
        'фонтан': 'Красивый фонтан с чистой водой. В воде блестят монеты.',
        'алтарь': 'Священный алтарь излучает теплый свет.',
        'сундук': 'Старый деревянный сундук. Может быть, внутри что-то есть?',
        'дверь': 'Массивная каменная дверь с древними рунами.'
    };
    
    for (const [key, desc] of Object.entries(descriptions)) {
        if (objectName.includes(key)) {
            addMessage(desc, 'info');
            return;
        }
    }
    
    addMessage('Ничего особенного.', 'info');
}

function showInventory() {
    addMessage('=== ИНВЕНТАРЬ ===', 'system');
    if (gameState.inventory.length === 0) {
        addMessage('Пусто', 'info');
    } else {
        gameState.inventory.forEach(item => {
            addMessage(`${item.name} x${item.count}`, 'info');
        });
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
    
    if (loc.type === 'town') {
        gameState.player.hp = gameState.player.maxHp;
        gameState.player.mp = gameState.player.maxMp;
        addMessage('Вы отдохнули и полностью восстановили HP и MP.', 'success');
        updateUI();
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
    addMessage(`Теперь вы ${gameState.player.level} уровня!`, 'success');
    addMessage('Характеристики увеличены!', 'success');
}

// Event listeners
document.getElementById('commandInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = e.target;
        if (input.value.trim()) {
            executeCommand(input.value);
            input.value = '';
        }
    }
});

document.getElementById('sendBtn').addEventListener('click', () => {
    const input = document.getElementById('commandInput');
    if (input.value.trim()) {
        executeCommand(input.value);
        input.value = '';
    }
});

// Initialize game
initWorldMap();
updateUI();
look();
addMessage('Добро пожаловать в игру! Наберите "help" для списка команд.', 'system');
