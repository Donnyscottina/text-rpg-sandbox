/**
 * Константы игры
 */

export const DIRECTIONS = {
    NORTH: { name: 'north', dx: 0, dy: -1, labels: ['север', 'n', 'с'] },
    SOUTH: { name: 'south', dx: 0, dy: 1, labels: ['юг', 's', 'ю'] },
    EAST: { name: 'east', dx: 1, dy: 0, labels: ['восток', 'e', 'в'] },
    WEST: { name: 'west', dx: -1, dy: 0, labels: ['запад', 'w', 'з'] },
    UP: { name: 'up', dx: 0, dy: 0, labels: ['вверх', 'u', 'вв'] },
    DOWN: { name: 'down', dx: 0, dy: 0, labels: ['вниз', 'd', 'вн'] }
};

export const LOCATION_TYPES = {
    TOWN: 'town',
    FOREST: 'forest',
    DUNGEON: 'dungeon',
    GRASS: 'grass'
};

export const ITEM_TYPES = {
    POTION: 'potion',
    FOOD: 'food',
    WEAPON: 'weapon',
    ARMOR: 'armor',
    HELMET: 'helmet',
    MISC: 'misc'
};

export const COMBAT_EVENTS = {
    START: 'combat:start',
    ATTACK: 'combat:attack',
    DAMAGE: 'combat:damage',
    END: 'combat:end',
    FLEE: 'combat:flee'
};

export const GAME_EVENTS = {
    PLAYER_MOVE: 'game:player:move',
    PLAYER_LEVEL_UP: 'game:player:levelup',
    ITEM_USE: 'game:item:use',
    ITEM_PICKUP: 'game:item:pickup',
    MESSAGE: 'game:message'
};

export const MESSAGE_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error',
    COMBAT: 'combat',
    SYSTEM: 'system'
};