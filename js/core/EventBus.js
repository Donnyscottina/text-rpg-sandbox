// js/core/EventBus.js
export class EventBus {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.events.has(event)) return;
        
        this.events.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    }

    once(event, callback) {
        const wrappedCallback = (data) => {
            callback(data);
            this.off(event, wrappedCallback);
        };
        this.on(event, wrappedCallback);
    }

    clear() {
        this.events.clear();
    }

    getEventNames() {
        return Array.from(this.events.keys());
    }

    getListenerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }
}
