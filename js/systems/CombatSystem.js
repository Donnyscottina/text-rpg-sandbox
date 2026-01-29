/**
 * Combat system managing turn-based battles
 * Implements State pattern for combat flow
 */
class CombatSystem {
    constructor(player) {
        this.player = player;
        this.currentEnemy = null;
        this.originalEnemyName = null;
        this.observers = [];
    }
    
    addObserver(observer) {
        this.observers.push(observer);
    }
    
    notify(message, type = 'combat') {
        this.observers.forEach(obs => {
            if (obs.addMessage) obs.addMessage(message, type);
        });
    }
    
    isActive() {
        return this.currentEnemy !== null;
    }
    
    /**
     * Start combat with an enemy
     * @param {Enemy} enemy
     * @param {string} originalName
     */
    startCombat(enemy, originalName) {
        this.currentEnemy = enemy;
        this.originalEnemyName = originalName;
        this.notify(`⚔️ Вы вступаете в бой с: ${enemy.name}!`);
        this.notify(`${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})`);
    }
    
    /**
     * Execute one round of combat
     * @returns {Object} { playerWon: bool, enemyWon: bool, ongoing: bool }
     */
    executeRound() {
        if (!this.isActive()) return { ongoing: false };
        
        const enemy = this.currentEnemy;
        
        // Player attacks
        const playerDamage = Math.max(1, this.player.attack - Math.floor(Math.random() * 5));
        const enemyAlive = enemy.takeDamage(playerDamage);
        this.notify(`Вы наносите ${playerDamage} урона! (${enemy.name}: ${enemy.hp}/${enemy.maxHp} HP)`);
        
        if (!enemyAlive) {
            return this.handleVictory();
        }
        
        // Enemy attacks
        const enemyDamage = enemy.getDamage(this.player.defense);
        const playerAlive = this.player.takeDamage(enemyDamage);
        this.notify(`${enemy.name} наносит вам ${enemyDamage} урона! (Ваше HP: ${this.player.hp}/${this.player.maxHp})`);
        
        if (!playerAlive) {
            return this.handleDefeat();
        }
        
        return { ongoing: true };
    }
    
    /**
     * Attempt to flee from combat
     * @returns {boolean} true if successful
     */
    tryFlee() {
        if (!this.isActive()) return false;
        
        if (Math.random() < 0.5) {
            this.notify(`Вам удалось сбежать от ${this.currentEnemy.name}!`, 'success');
            this.endCombat();
            return true;
        } else {
            this.notify('Не удалось сбежать!', 'error');
            // Enemy gets free attack
            const damage = this.currentEnemy.getDamage(this.player.defense);
            const alive = this.player.takeDamage(damage);
            this.notify(`${this.currentEnemy.name} наносит ${damage} урона!`);
            
            if (!alive) {
                this.handleDefeat();
            }
            return false;
        }
    }
    
    /**
     * Handle player victory
     */
    handleVictory() {
        const enemy = this.currentEnemy;
        this.notify(`${enemy.name} повержен!`, 'success');
        this.player.addXP(enemy.xp);
        this.player.addGold(enemy.gold);
        this.notify(`Получено: ${enemy.xp} опыта и ${enemy.gold} золота`, 'success');
        
        const result = { playerWon: true, enemyName: this.originalEnemyName };
        this.endCombat();
        return result;
    }
    
    /**
     * Handle player defeat
     */
    handleDefeat() {
        this.notify('ВЫ ПОГИБЛИ! Игра окончена.', 'error');
        this.notify('Обновите страницу для начала новой игры.', 'system');
        this.endCombat();
        return { enemyWon: true };
    }
    
    /**
     * Enemy gets free attack (e.g., when using item)
     */
    enemyFreeAttack() {
        if (!this.isActive()) return;
        
        const damage = this.currentEnemy.getDamage(this.player.defense);
        const alive = this.player.takeDamage(damage);
        this.notify(`${this.currentEnemy.name} атакует пока вы лечитесь! ${damage} урона.`);
        
        if (!alive) {
            this.handleDefeat();
        }
    }
    
    /**
     * End current combat
     */
    endCombat() {
        this.currentEnemy = null;
        this.originalEnemyName = null;
    }
    
    /**
     * Get current enemy
     * @returns {Enemy|null}
     */
    getCurrentEnemy() {
        return this.currentEnemy;
    }
}
