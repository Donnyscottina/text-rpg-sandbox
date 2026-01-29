/**
 * Player - класс для управления игроком
 */
export class Player {
    constructor(gameState) {
        this.state = gameState;
    }

    takeDamage(amount) {
        const newHp = Math.max(0, this.state.player.hp - amount);
        this.state.updatePlayer({ hp: newHp });
        return newHp === 0;
    }

    heal(amount) {
        const newHp = Math.min(this.state.player.maxHp, this.state.player.hp + amount);
        this.state.updatePlayer({ hp: newHp });
        return newHp - this.state.player.hp;
    }

    gainXP(amount) {
        const newXp = this.state.player.xp + amount;
        this.state.updatePlayer({ xp: newXp });
        
        if (newXp >= this.state.player.xpNeeded) {
            this.levelUp();
        }
    }

    levelUp() {
        const player = this.state.player;
        this.state.updatePlayer({
            level: player.level + 1,
            xp: 0,
            xpNeeded: Math.floor(player.xpNeeded * 1.5),
            maxHp: player.maxHp + 20,
            hp: player.maxHp + 20,
            maxMp: player.maxMp + 10,
            mp: player.maxMp + 10,
            attack: player.attack + 5,
            defense: player.defense + 2
        });
        this.state.emit('player:levelup', this.state.player);
    }

    addGold(amount) {
        this.state.updatePlayer({ gold: this.state.player.gold + amount });
    }

    moveTo(x, y, location) {
        this.state.updatePlayer({ x, y, location });
        this.state.emit('player:moved', { x, y, location });
    }

    rest() {
        this.state.updatePlayer({
            hp: this.state.player.maxHp,
            mp: this.state.player.maxMp
        });
    }
}