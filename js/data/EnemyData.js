/**
 * Данные врагов
 */

export const ENEMY_TEMPLATES = {
    'волк': {
        name: 'Волк',
        hp: 30,
        maxHp: 30,
        attack: 8,
        defense: 2,
        xp: 25,
        gold: 10,
        aiType: 'aggressive'
    },
    'разбойник': {
        name: 'Разбойник',
        hp: 40,
        maxHp: 40,
        attack: 12,
        defense: 3,
        xp: 35,
        gold: 25,
        aiType: 'aggressive'
    },
    'паук': {
        name: 'Гигантский паук',
        hp: 50,
        maxHp: 50,
        attack: 15,
        defense: 3,
        xp: 50,
        gold: 30,
        aiType: 'aggressive'
    },
    'темный': {
        name: 'Темный волк',
        hp: 45,
        maxHp: 45,
        attack: 14,
        defense: 4,
        xp: 45,
        gold: 20,
        aiType: 'aggressive'
    },
    'скелет': {
        name: 'Скелет-воин',
        hp: 45,
        maxHp: 45,
        attack: 13,
        defense: 5,
        xp: 40,
        gold: 20,
        aiType: 'aggressive'
    },
    'зомби': {
        name: 'Зомби',
        hp: 60,
        maxHp: 60,
        attack: 10,
        defense: 6,
        xp: 45,
        gold: 15,
        aiType: 'slow'
    }
};