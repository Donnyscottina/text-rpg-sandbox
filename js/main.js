// main.js - Точка входа приложения
import { Game } from './core/Game.js';

let gameInstance = null;

// Инициализация игры при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
    try {
        gameInstance = new Game();
        await gameInstance.init();
        
        // Глобальный доступ для отладки
        window.game = gameInstance;
        
        console.log('🎮 Game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        alert('Ошибка загрузки игры. Проверьте консоль.');
    }
});

// Обработка кнопок сохранения/загрузки
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnSave')?.addEventListener('click', () => {
        gameInstance?.save();
    });
    
    document.getElementById('btnLoad')?.addEventListener('click', () => {
        gameInstance?.load();
    });
    
    document.getElementById('btnReset')?.addEventListener('click', () => {
        if (confirm('Вы уверены? Весь прогресс будет удален!')) {
            gameInstance?.reset();
        }
    });
});
