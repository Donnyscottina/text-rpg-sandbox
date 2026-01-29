/**
 * Вспомогательные функции
 */
import { DIRECTIONS } from './Constants.js';

/**
 * Нормализация названия направления
 */
export function normalizeDirection(input) {
    const inputLower = input.toLowerCase();
    
    for (const dir of Object.values(DIRECTIONS)) {
        if (dir.name === inputLower || dir.labels.includes(inputLower)) {
            return dir.name;
        }
    }
    
    return null;
}

/**
 * Получение объекта направления
 */
export function getDirection(name) {
    const normalized = normalizeDirection(name);
    if (!normalized) return null;
    
    for (const dir of Object.values(DIRECTIONS)) {
        if (dir.name === normalized) {
            return dir;
        }
    }
    
    return null;
}

/**
 * Получение русской метки направления
 */
export function getDirectionLabel(dirName) {
    const labels = {
        'north': 'север',
        'south': 'юг',
        'east': 'восток',
        'west': 'запад',
        'up': 'вверх',
        'down': 'вниз'
    };
    return labels[dirName] || dirName;
}

/**
 * Генерация случайного числа в диапазоне
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Поиск по частичному совпадению
 */
export function fuzzyMatch(searchTerm, target) {
    return target.toLowerCase().includes(searchTerm.toLowerCase());
}

/**
 * Клонирование объекта
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}