/**
 * Location class representing a place in the game world
 */
class Location {
    constructor(id, data) {
        this.id = id;
        this.name = data.name;
        this.desc = data.desc;
        this.x = data.x;
        this.y = data.y;
        this.type = data.type;
        this.npcs = data.npcs || [];
        this.enemies = data.enemies || [];
        this.objects = data.objects || [];
        this.exits = data.exits || {};
    }
    
    /**
     * Remove an enemy from this location
     * @param {string} enemyName
     */
    removeEnemy(enemyName) {
        const index = this.enemies.indexOf(enemyName);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }
    
    /**
     * Check if location has an NPC
     * @param {string} npcName
     * @returns {boolean}
     */
    hasNPC(npcName) {
        return this.npcs.some(n => n.toLowerCase().includes(npcName.toLowerCase()));
    }
    
    /**
     * Check if location has an enemy
     * @param {string} enemyName
     * @returns {boolean}
     */
    hasEnemy(enemyName) {
        return this.enemies.some(e => e.toLowerCase().includes(enemyName.toLowerCase()));
    }
    
    /**
     * Check if location has an object
     * @param {string} objectName
     * @returns {boolean}
     */
    hasObject(objectName) {
        return this.objects.some(o => o.toLowerCase().includes(objectName.toLowerCase()));
    }
    
    /**
     * Get exit in direction
     * @param {string} direction
     * @returns {string|null}
     */
    getExit(direction) {
        return this.exits[direction] || null;
    }
    
    /**
     * Check if can rest here
     * @returns {boolean}
     */
    canRest() {
        return this.type === 'town';
    }
}

/**
 * Manager for all game locations
 */
class LocationManager {
    constructor() {
        this.locations = new Map();
        this.initLocations();
    }
    
    initLocations() {
        const locationData = {
            town_square: {
                name: 'Центральная площадь',
                desc: 'Оживленная площадь в центре города. Вокруг толпятся торговцы и путешественники. На севере виден храм, на востоке - таверна, на западе - рынок.',
                x: 5, y: 5, type: 'town',
                npcs: ['Торговец Маркус', 'Стражник Джон'],
                objects: ['Фонтан', 'Доска объявлений'],
                exits: { north: 'temple', south: 'south_gate', east: 'tavern', west: 'market' }
            },
            temple: {
                name: 'Храм Света',
                desc: 'Величественный храм с высокими колоннами.',
                x: 5, y: 4, type: 'town',
                npcs: ['Жрица Элара'],
                objects: ['Алтарь', 'Свечи'],
                exits: { south: 'town_square' }
            },
            tavern: {
                name: 'Таверна "Золотой дракон"',
                desc: 'Уютная таверна, полная приключенцев.',
                x: 6, y: 5, type: 'town',
                npcs: ['Трактирщик Боб', 'Бард Томас', 'Старый воин'],
                objects: ['Бочка с элем', 'Стол для игры в кости'],
                exits: { west: 'town_square' }
            },
            market: {
                name: 'Городской рынок',
                desc: 'Шумный рынок с множеством лавок.',
                x: 4, y: 5, type: 'town',
                npcs: ['Кузнец Торин', 'Торговец оружием', 'Торговец зельями'],
                objects: ['Кузница', 'Лавка оружия'],
                exits: { east: 'town_square' }
            },
            south_gate: {
                name: 'Южные ворота',
                desc: 'Массивные ворота города.',
                x: 5, y: 6, type: 'town',
                npcs: ['Капитан стражи'],
                objects: ['Ворота'],
                exits: { north: 'town_square', south: 'dark_forest' }
            },
            dark_forest: {
                name: 'Темный лес',
                desc: 'Густой мрачный лес.',
                x: 5, y: 7, type: 'forest',
                enemies: ['Волк', 'Разбойник'],
                objects: ['Старое дерево'],
                exits: { north: 'south_gate', south: 'forest_depths', east: 'forest_clearing' }
            },
            forest_depths: {
                name: 'Глубь леса',
                desc: 'Темнота сгущается.',
                x: 5, y: 8, type: 'forest',
                enemies: ['Гигантский паук', 'Темный волк'],
                objects: ['Заброшенный лагерь'],
                exits: { north: 'dark_forest', west: 'dungeon_entrance' }
            },
            forest_clearing: {
                name: 'Лесная поляна',
                desc: 'Солнечная поляна.',
                x: 6, y: 7, type: 'forest',
                objects: ['Целебные травы'],
                exits: { west: 'dark_forest' }
            },
            dungeon_entrance: {
                name: 'Вход в подземелье',
                desc: 'Темный зловещий вход.',
                x: 4, y: 8, type: 'dungeon',
                objects: ['Каменная дверь'],
                exits: { east: 'forest_depths', down: 'dungeon_level1' }
            },
            dungeon_level1: {
                name: 'Подземелье - Уровень 1',
                desc: 'Сырой каменный коридор.',
                x: 4, y: 9, type: 'dungeon',
                enemies: ['Скелет-воин', 'Зомби'],
                objects: ['Сундук', 'Факел'],
                exits: { up: 'dungeon_entrance' }
            }
        };
        
        for (const [id, data] of Object.entries(locationData)) {
            this.locations.set(id, new Location(id, data));
        }
    }
    
    getLocation(id) {
        return this.locations.get(id);
    }
    
    getAllLocations() {
        return Array.from(this.locations.values());
    }
}
