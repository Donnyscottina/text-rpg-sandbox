// js/data/locations.js
export const LOCATIONS = {
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
        exits: { east: 'forest_depths', south: 'dungeon_level1' }
    },
    dungeon_level1: {
        name: 'Подземелье - Уровень 1',
        desc: 'Сырой каменный коридор.',
        x: 4, y: 9,
        type: 'dungeon',
        enemies: ['Скелет-воин', 'Зомби'],
        exits: { north: 'dungeon_entrance' }
    }
};