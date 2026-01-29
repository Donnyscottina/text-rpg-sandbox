// js/config/constants.js - Константы игры

export const TILE_SIZE = 30;
export const MAP_WIDTH = 10;
export const MAP_HEIGHT = 10;

export const DIRECTION_LABELS = {
    north: 'север',
    south: 'юг',
    east: 'восток',
    west: 'запад',
    up: 'вверх',
    down: 'вниз'
};

export const DIRECTION_ALIASES = {
    'n': 'north', 'с': 'north', 'север': 'north',
    's': 'south', 'ю': 'south', 'юг': 'south',
    'e': 'east', 'в': 'east', 'восток': 'east',
    'w': 'west', 'з': 'west', 'запад': 'west',
    'u': 'up', 'вв': 'up', 'вверх': 'up',
    'd': 'down', 'вн': 'down', 'вниз': 'down'
};

export const TILE_COLORS = {
    town: '#00aaff',
    forest: '#004400',
    dungeon: '#440000',
    grass: '#002200'
};

export const TILE_SYMBOLS = {
    town: '■',
    forest: '♣',
    dungeon: '▲',
    player: '◆'
};

export const MESSAGE_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error',
    SYSTEM: 'system',
    COMBAT: 'combat'
};
