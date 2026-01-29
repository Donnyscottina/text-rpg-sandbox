/**
 * Данные предметов
 */
import { ITEM_TYPES } from '../utils/Constants.js';

export const ITEM_TEMPLATES = {
    'health_potion': {
        name: 'Зелье здоровья',
        type: ITEM_TYPES.POTION,
        effect: 'heal',
        value: 30,
        stackable: true
    },
    'bread': {
        name: 'Хлеб',
        type: ITEM_TYPES.FOOD,
        effect: 'heal',
        value: 10,
        stackable: true
    },
    'mana_potion': {
        name: 'Зелье маны',
        type: ITEM_TYPES.POTION,
        effect: 'restore_mana',
        value: 25,
        stackable: true
    }
};

export const STARTING_INVENTORY = [
    { ...ITEM_TEMPLATES.health_potion, count: 3 },
    { ...ITEM_TEMPLATES.bread, count: 5 }
];