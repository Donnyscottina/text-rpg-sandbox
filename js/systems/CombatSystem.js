// js/systems/CombatSystem.js - Боевая система
import { Enemy } from '../entities/Enemy.js';

export class CombatSystem {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('combat:initiate', (enemyName) => this.initiateCombat(enemyName));
        this.eventBus.on('combat:attack', () => this.handleAttack());
        this.eventBus.on('combat:flee', () => this.handleFlee());
    }

    initiateCombat(enemyName) {
        const enemy = Enemy.createFromTemplate(enemyName);
        const combat = new Combat(this.gameState.getPlayer(), enemy, enemyName);
        this.gameState.startCombat(combat);
        
        this.eventBus.emit('message:combat', `⚔️ Вы вступаете в бой с: ${enemy.name}!`);
        this.eventBus.emit('message:combat', `${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})`);
    }

    handleAttack() {
        const combat = this.gameState.getCombat();
        if (!combat) {
            this.eventBus.emit('message:error', 'Вы не в бою!');
            return;
        }

        const result = combat.playerAttack();
        
        this.eventBus.emit('message:combat', 
            `Вы наносите ${result.playerDamage} урона! (${result.enemy.name}: ${Math.max(0, result.enemy.hp)}/${result.enemy.maxHp} HP)`
        );

        if (result.enemyDefeated) {
            this.handleVictory(result);
            return;
        }

        const counterResult = combat.enemyAttack();
        this.eventBus.emit('message:combat',
            `${result.enemy.name} наносит ${counterResult.enemyDamage} урона! (Ваше HP: ${counterResult.player.hp}/${counterResult.player.maxHp})`
        );

        if (counterResult.playerDefeated) {
            this.handleDefeat();
        }
    }

    handleVictory(result) {
        this.eventBus.emit('message:success', `${result.enemy.name} повержен!`);
        
        const player = this.gameState.getPlayer();
        player.addXp(result.rewards.xp);
        player.addGold(result.rewards.gold);
        
        this.eventBus.emit('message:success', 
            `Получено: ${result.rewards.xp} опыта и ${result.rewards.gold} золота`
        );
        
        // Remove enemy from location
        const loc = this.gameState.getCurrentLocation();
        const index = loc.enemies.indexOf(this.gameState.getCombat().originalName);
        if (index > -1) loc.enemies.splice(index, 1);
        
        this.gameState.endCombat();
        
        // Check level up
        if (player.xp >= player.xpNeeded) {
            const levelUpData = player.levelUp();
            if (levelUpData) {
                this.eventBus.emit('player:levelup', levelUpData);
            }
        }
    }

    handleDefeat() {
        this.gameState.endCombat();
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
                `${result.enemy.name} наносит вам ${result.enemyDamage} урона при попытке бегства! (Ваше HP: ${result.player.hp}/${result.player.maxHp})`
            );

            if (result.playerDefeated) {
                this.handleDefeat();
            }
        }
    }
}

export class Combat {
    constructor(player, enemy, originalName) {
        this.player = player;
        this.enemy = enemy;
        this.originalName = originalName;
    }

    playerAttack() {
        const damage = this.player.calculateAttackDamage();
        const result = this.enemy.takeDamage(damage);
        
        return {
            playerDamage: result.damage,
            enemy: this.enemy.getStats(),
            enemyDefeated: result.isDead,
            rewards: result.isDead ? {
                xp: this.enemy.xp,
                gold: this.enemy.gold
            } : null
        };
    }

    enemyAttack() {
        const damage = this.enemy.calculateAttackDamage();
        const result = this.player.takeDamage(damage);
        
        return {
            enemyDamage: result.damage,
            player: this.player.getStats(),
            enemy: this.enemy.getStats(),
            playerDefeated: result.isDead
        };
    }

    serialize() {
        return {
            enemy: this.enemy.serialize(),
            originalName: this.originalName
        };
    }
}