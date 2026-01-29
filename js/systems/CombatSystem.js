// js/systems/CombatSystem.js - Боевая система
export class CombatSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.on('combat:attack', (data) => this.handleAttack(data));
        this.eventBus.on('combat:flee', (data) => this.handleFlee(data));
        this.eventBus.on('combat:useItem', (data) => this.handleUseItem(data));
    }

    startCombat(player, enemy) {
        this.eventBus.emit('combat:started', { enemy });
        this.eventBus.emit('message:combat', `⚔️ Бой начался! Враг: ${enemy.name}`);
        this.eventBus.emit('message:combat', `${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})`);
    }

    handleAttack({ combat, state }) {
        if (!combat) {
            this.eventBus.emit('message:error', 'Вы не в бою!');
            return;
        }

        const player = state.getPlayer();
        const enemy = combat.enemy;
        
        // Атака игрока
        const playerDamage = player.calculateAttackDamage();
        const enemyResult = enemy.takeDamage(playerDamage);
        
        this.eventBus.emit('message:combat', 
            `Вы наносите ${enemyResult.damage} урона! (${enemy.name}: ${enemy.hp}/${enemy.maxHp} HP)`
        );

        if (enemyResult.isDead) {
            this.handleEnemyDefeated(state, enemy);
            return;
        }

        // Ответная атака врага
        const enemyDamage = enemy.calculateAttackDamage();
        const playerResult = player.takeDamage(enemyDamage);
        
        this.eventBus.emit('message:combat',
            `${enemy.name} наносит ${playerResult.damage} урона! (Ваше HP: ${player.hp}/${player.maxHp})`
        );

        if (playerResult.isDead) {
            this.handlePlayerDefeated();
        }
    }

    handleEnemyDefeated(state, enemy) {
        const rewards = enemy.getRewards();
        
        this.eventBus.emit('message:success', `${enemy.name} повержен!`);
        this.eventBus.emit('message:success', 
            `Получено: ${rewards.xp} опыта и ${rewards.gold} золота`
        );
        
        this.eventBus.emit('combat:ended', {
            victory: true,
            rewards: rewards,
            enemyName: enemy.name
        });
    }

    handlePlayerDefeated() {
        this.eventBus.emit('message:error', 'ВЫ ПОГИБЛИ!');
        this.eventBus.emit('player:died');
    }

    handleFlee({ combat, state }) {
        if (!combat) {
            this.eventBus.emit('message:error', 'Вы не в бою!');
            return;
        }

        const fleeChance = 0.5;
        const escaped = Math.random() < fleeChance;

        if (escaped) {
            this.eventBus.emit('message:success', `Вам удалось сбежать от ${combat.enemy.name}!`);
            this.eventBus.emit('combat:ended', { victory: false, fled: true });
        } else {
            this.eventBus.emit('message:error', 'Не удалось сбежать!');
            
            const player = state.getPlayer();
            const enemy = combat.enemy;
            const damage = enemy.calculateAttackDamage();
            const result = player.takeDamage(damage);
            
            this.eventBus.emit('message:combat',
                `${enemy.name} атакует при попытке бегства! Урон: ${result.damage}`
            );

            if (result.isDead) {
                this.handlePlayerDefeated();
            }
        }
    }

    handleUseItem({ item, state, combat }) {
        const player = state.getPlayer();
        
        if (item.effect === 'heal') {
            const healAmount = player.heal(item.value);
            this.eventBus.emit('message:success', 
                `Использовано ${item.name}. Восстановлено ${healAmount} HP`
            );
        }

        if (combat) {
            const enemy = combat.enemy;
            const damage = enemy.calculateAttackDamage();
            const result = player.takeDamage(damage);
            
            this.eventBus.emit('message:combat',
                `${enemy.name} атакует пока вы лечитесь! Урон: ${result.damage}`
            );

            if (result.isDead) {
                this.handlePlayerDefeated();
            }
        }
    }
}
