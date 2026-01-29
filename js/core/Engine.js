/**
 * Game Engine - главный движок игры
 * Управляет всеми системами и координирует их работу
 */
export class GameEngine {
    constructor() {
        this.systems = new Map();
        this.isRunning = false;
        this.tickRate = 100;
        this.lastTick = 0;
    }

    /**
     * Регистрация игровой системы
     */
    registerSystem(name, system) {
        this.systems.set(name, system);
        if (system.init) {
            system.init(this);
        }
    }

    /**
     * Получение системы по имени
     */
    getSystem(name) {
        return this.systems.get(name);
    }

    /**
     * Запуск игрового цикла
     */
    start() {
        this.isRunning = true;
        this.lastTick = Date.now();
        this.gameLoop();
    }

    /**
     * Остановка игры
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Главный игровой цикл
     */
    gameLoop() {
        if (!this.isRunning) return;

        const now = Date.now();
        const deltaTime = now - this.lastTick;

        if (deltaTime >= this.tickRate) {
            this.update(deltaTime);
            this.lastTick = now;
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Обновление всех систем
     */
    update(deltaTime) {
        for (const [name, system] of this.systems) {
            if (system.update) {
                system.update(deltaTime);
            }
        }
    }

    /**
     * Сохранение состояния игры
     */
    save() {
        const saveData = {};
        for (const [name, system] of this.systems) {
            if (system.serialize) {
                saveData[name] = system.serialize();
            }
        }
        localStorage.setItem('rpg_save', JSON.stringify(saveData));
        return saveData;
    }

    /**
     * Загрузка состояния игры
     */
    load() {
        const saveData = localStorage.getItem('rpg_save');
        if (!saveData) return false;

        const data = JSON.parse(saveData);
        for (const [name, system] of this.systems) {
            if (system.deserialize && data[name]) {
                system.deserialize(data[name]);
            }
        }
        return true;
    }

    /**
     * Сброс игры
     */
    reset() {
        for (const [name, system] of this.systems) {
            if (system.reset) {
                system.reset();
            }
        }
        localStorage.removeItem('rpg_save');
    }
}