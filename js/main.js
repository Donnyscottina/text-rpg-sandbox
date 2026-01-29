// js/main.js - Точка входа приложения
import { Game } from './core/Game.js';

// Глобальная переменная для отладки
window.game = null;

// Инициализация игры при загрузке DOM
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const game = new Game();
        await game.init();
        window.game = game;
        
        console.log('✅ Text RPG Sandbox successfully initialized');
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        alert('Ошибка при загрузке игры. Проверьте консоль.');
    }
});
