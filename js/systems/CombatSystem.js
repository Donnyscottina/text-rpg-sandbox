import { Combat } from './Combat.js';
import { Enemy } from '../entities/Enemy.js';

/**
 * CombatSystem - Handles all combat-related logic
 * Decoupled from UI and game state
 */
export class CombatSystem {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('combat:start', (data) => this.startCombat(data));
        this.eventBus.on('combat:attack', () => this.handlePlayerAttack());
        this.eventBus.on('combat:flee', () => this.handleFlee());
        this.eventBus.on('combat:useItem', (data) => this.handleUseItem(data));
    }

    startCombat({ enemyName, originalName }) {
        const player = this.gameState.getPlayer();
        const enemy = new Enemy(enemyName);
        
        const combat = new Combat(player, enemy, originalName);
        this.gameState.setCombat(combat);
        
        this.eventBus.emit('message:combat', `⚔️ Вы вступаете в бой с: ${enemy.name}!`);
        this.eventBus.emit('message:combat', `${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})`);
    }

    handlePlayerAttack() {
        const combat = this.gameState.getCombat();
        if (!combat) {
            this.eventBus.emit('message:error', 'Вы не в бою!');
            return;
        }

        const result = combat.playerAttack();
        
        this.eventBus.emit('message:combat', 
            `Вы наносите ${result.playerDamage} урона! ${result.enemy.name}: ${result.enemy.hp}/${result.enemy.maxHp} HP`
        );

        if (result.enemyDefeated) {
            this.handleEnemyDefeated(combat, result);
            return;
        }

        const counterResult = combat.enemyAttack();
        this.eventBus.emit('message:combat',
            `${result.enemy.name} наносит ${counterResult.enemyDamage} урона! Ваше HP: ${counterResult.player.hp}/${counterResult.player.maxHp}`
        );

        if (counterResult.playerDefeated) {
            this.handlePlayerDefeated();
        }
    }

    handleEnemyDefeated(combat, result) {
        const player = this.gameState.getPlayer();
        const location = this.gameState.getCurrentLocation();
        
        this.eventBus.emit('message:success', `${result.enemy.name} повержен!`);
        
        // Add rewards
        player.addXp(result.rewards.xp);
        player.addGold(result.rewards.gold);
        
        this.eventBus.emit('message:success', 
            `Получено: ${result.rewards.xp} опыта и ${result.rewards.gold} золота`
        );
        
        // Remove enemy from location
        if (location.enemies) {
            const index = location.enemies.indexOf(combat.originalName);
            if (index > -1) {
                location.enemies.splice(index, 1);
            }
        }
        
        // End combat
        this.gameState.endCombat();
        
        // Check for level up
        const levelUpResult = player.addXp(0); // Trigger level check
        if (levelUpResult) {
            this.eventBus.emit('player:levelup', levelUpResult);
        }
    }

    handlePlayerDefeated() {
        this.gameState.endCombat();
        this.eventBus.emit('message:error', 'ВЫ ПОГИБЛИ!');
        this.eventBus.emit('player:died');
    }

    handleFlee() {
        const combat = this.gameState.getCombat();
        if (!combat) {
            this.eventBus.emit('message:error', 'Вы не в бою!');
            return;
        }

        const fleeChance = 0.5;
        const escaped = Math.random() < fleeChance;

        if (escaped) {
            this.eventBus.emit('message:success', `Вам удалось сбежать от ${combat.enemy.name}!`);
            this.gameState.endCombat();
        } else {
            this.eventBus.emit('message:error', 'Не удалось сбежать!');
            
            const result = combat.enemyAttack();
            this.eventBus.emit('message:combat',
                `${combat.enemy.name} наносит ${result.enemyDamage} урона при попытке бегства! (Ваше HP: ${result.player.hp}/${result.player.maxHp})`
            );

            if (result.playerDefeated) {
                this.handlePlayerDefeated();
            }
        }
    }

    handleUseItem({ itemName }) {
        const player = this.gameState.getPlayer();
        const combat = this.gameState.getCombat();
        const inventory = player.getInventory();
        
        const item = inventory.findItem(itemName);
        if (!item) {
            this.eventBus.emit('message:error', 'У вас нет такого предмета.');
            return;
        }
        
        if (item.effect === 'heal') {
            const healAmount = player.heal(item.value);
            this.eventBus.emit('message:success', 
                `Вы использовали ${item.name} и восстановили ${healAmount} HP.`
            );
            
            inventory.removeItem(item.name, 1);
        }
        
        // Enemy counterattack if in combat
        if (combat) {
            const result = combat.enemyAttack();
            this.eventBus.emit('message:combat',
                `${combat.enemy.name} атакует пока вы лечитесь! Получено ${result.enemyDamage} урона.`
            );

            if (result.playerDefeated) {
                this.handlePlayerDefeated();
            }
        }
    }
}