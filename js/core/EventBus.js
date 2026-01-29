/**
 * Event Bus - шина событий для event-driven архитектуры
 * Позволяет системам общаться без прямых зависимостей
 */
export class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Подписка на событие
     */
    on(event, callback, context = null) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push({ callback, context });
    }

    /**
     * Отписка от события
     */
    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.findIndex(item => item.callback === callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Испускание события
     */
    emit(event, ...args) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        for (const { callback, context } of callbacks) {
            callback.apply(context, args);
        }
    }

    /**
     * Одноразовая подписка
     */
    once(event, callback, context = null) {
        const wrappedCallback = (...args) => {
            callback.apply(context, args);
            this.off(event, wrappedCallback);
        };
        this.on(event, wrappedCallback, context);
    }

    /**
     * Очистка всех событий
     */
    clear() {
        this.listeners.clear();
    }
}