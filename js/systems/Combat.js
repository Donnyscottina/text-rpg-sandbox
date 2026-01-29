/**
 * Combat - Represents a single combat encounter
 */
export class Combat {
    constructor(player, enemy, originalName) {
        this.player = player;
        this.enemy = enemy;
        this.originalName = originalName || enemy.name;
        this.turnCount = 0;
    }

    playerAttack() {
        this.turnCount++;
        const damage = this.player.calculateAttackDamage();
        const result = this.enemy.takeDamage(damage);
        
        return {
            playerDamage: result.damage,
            enemy: this.enemy.getStats(),
            enemyDefeated: result.isDead,
            rewards: result.isDead ? this.enemy.getRewards() : null
        };
    }

    enemyAttack() {
        const damage = this.enemy.calculateAttackDamage();
        const result = this.player.takeDamage(damage);
        
        return {
            enemyDamage: result.damage,
            player: this.player.getStats(),
            playerDefeated: result.isDead
        };
    }

    serialize() {
        return {
            enemy: this.enemy.serialize(),
            originalName: this.originalName,
            turnCount: this.turnCount
        };
    }
}