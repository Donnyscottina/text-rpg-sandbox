// js/main.js - Точка входа в приложение
import { Game } from './core/Game.js';

let game = null;

// Инициализация игры при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
    try {
        game = new Game();
        await game.init();
        console.log('✓ Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('output').innerHTML = 
            '<div class="message error">Ошибка загрузки игры. Обновите страницу.</div>';
    }
});

// Экспорт для глобального доступа (для кнопок Save/Load)
window.game = game;
window.saveGame = () => game?.save();
window.loadGame = () => game?.load();
window.resetGame = () => {
    if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
        localStorage.removeItem('rpg_save');
        location.reload();
    }
};