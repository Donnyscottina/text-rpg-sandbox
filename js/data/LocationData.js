/**
 * Данные локаций
 */
import { LOCATION_TYPES } from '../utils/Constants.js';

export const LOCATIONS = {
    town_square: {
        name: 'Центральная площадь',
        desc: 'Оживленная площадь в центре города. Вокруг толпятся торговцы и путешественники. На севере виден храм, на востоке - таверна, на западе - рынок.',
        x: 5, y: 5,
        type: LOCATION_TYPES.TOWN,
        npcs: ['Торговец Маркус', 'Стражник Джон'],
        objects: ['Фонтан', 'Доска объявлений'],
        exits: { north: 'temple', south: 'south_gate', east: 'tavern', west: 'market' }
    },
    temple: {
        name: 'Храм Света',
        desc: 'Величественный храм с высокими колоннами. Здесь можно исцелиться и получить благословение.',
        x: 5, y: 4,
        type: LOCATION_TYPES.TOWN,
        npcs: ['Жрица Элара'],
        objects: ['Алтарь', 'Свечи'],
        exits: { south: 'town_square' }
    },
    tavern: {
        name: 'Таверна "Золотой дракон"',
        desc: 'Уютная таверна, полная приключенцев. Пахнет элем и жареным мясом. В углу играет бард.',
        x: 6, y: 5,
        type: LOCATION_TYPES.TOWN,
        npcs: ['Трактирщик Боб', 'Бард Томас', 'Старый воин'],
        objects: ['Бочка с элем', 'Стол для игры в кости'],
        exits: { west: 'town_square' }
    },
    market: {
        name: 'Городской рынок',
        desc: 'Шумный рынок с множеством лавок. Торговцы предлагают оружие, доспехи и различные товары.',
        x: 4, y: 5,
        type: LOCATION_TYPES.TOWN,
        npcs: ['Кузнец Торин', 'Торговец оружием', 'Торговец зельями'],
        objects: ['Кузница', 'Лавка оружия', 'Алхимическая лавка'],
        exits: { east: 'town_square' }
    },
    south_gate: {
        name: 'Южные ворота',
        desc: 'Массивные ворота города. За ними начинается дикий лес.',
        x: 5, y: 6,
        type: LOCATION_TYPES.TOWN,
        npcs: ['Капитан стражи'],
        objects: ['Ворота'],
        exits: { north: 'town_square', south: 'dark_forest' }
    },
    dark_forest: {
        name: 'Темный лес',
        desc: 'Густой мрачный лес. Слышны странные звуки. Будьте осторожны!',
        x: 5, y: 7,
        type: LOCATION_TYPES.FOREST,
        npcs: [],
        enemies: ['Волк', 'Разбойник'],
        objects: ['Старое дерево'],
        exits: { north: 'south_gate', south: 'forest_depths', east: 'forest_clearing' }
    },
    forest_depths: {
        name: 'Глубь леса',
        desc: 'Темнота сгущается. Деревья здесь особенно старые и зловещие.',
        x: 5, y: 8,
        type: LOCATION_TYPES.FOREST,
        enemies: ['Гигантский паук', 'Темный волк'],
        objects: ['Заброшенный лагерь'],
        exits: { north: 'dark_forest', west: 'dungeon_entrance' }
    },
    forest_clearing: {
        name: 'Лесная поляна',
        desc: 'Солнечная поляна в лесу. Здесь растут целебные травы.',
        x: 6, y: 7,
        type: LOCATION_TYPES.FOREST,
        objects: ['Целебные травы', 'Ягодный куст'],
        exits: { west: 'dark_forest' }
    },
    dungeon_entrance: {
        name: 'Вход в подземелье',
        desc: 'Темный зловещий вход в древнее подземелье. Оттуда веет холодом и опасностью.',
        x: 4, y: 8,
        type: LOCATION_TYPES.DUNGEON,
        objects: ['Каменная дверь'],
        exits: { east: 'forest_depths', down: 'dungeon_level1' }
    },
    dungeon_level1: {
        name: 'Подземелье - Уровень 1',
        desc: 'Сырой каменный коридор. На стенах древние руны. Слышны шаги...',
        x: 4, y: 9,
        type: LOCATION_TYPES.DUNGEON,
        enemies: ['Скелет-воин', 'Зомби'],
        objects: ['Сундук', 'Факел'],
        exits: { up: 'dungeon_entrance' }
    }
};