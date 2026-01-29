/**
 * Player character class with stats, inventory, and equipment
 * Implements Observer pattern for state changes
 */
class Player {
    constructor(name, position) {
        this.name = name;
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 50;
        this.maxMp = 50;
        this.gold = 100;
        this.level = 1;
        this.xp = 0;
        this.xpNeeded = 100;
        this.attack = 10;
        this.defense = 5;
        this.x = position.x;
        this.y = position.y;
        this.location = null;
        
        this.inventory = new Inventory();
        this.equipment = new Equipment();
        this.commandHistory = new CommandHistory();
        
        this.observers = [];
        
        // Add starting items
        this.inventory.addItem(new Item('Зелье здоровья', 'potion', 'heal', 30, 3));
        this.inventory.addItem(new Item('Хлеб', 'food', 'heal', 10, 5));
    }
    
    /**
     * Add observer for state changes
     * @param {Object} observer - Observer with update() method
     */
    addObserver(observer) {
        this.observers.push(observer);
    }
    
    /**
     * Notify all observers of state change
     */
    notify() {
        this.observers.forEach(obs => obs.update());
    }
    
    /**
     * Set player location
     * @param {string} locationId
     */
    setLocation(locationId) {
        this.location = locationId;
        this.notify();
    }
    
    /**
     * Move player to coordinates
     * @param {number} x
     * @param {number} y
     */
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        this.notify();
    }
    
    /**
     * Take damage
     * @param {number} amount
     * @returns {boolean} true if still alive
     */
    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        this.notify();
        return this.hp > 0;
    }
    
    /**
     * Heal player
     * @param {number} amount
     */
    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.notify();
    }
    
    /**
     * Add experience and check for level up
     * @param {number} xp
     * @returns {boolean} true if leveled up
     */
    addXP(xp) {
        this.xp += xp;
        if (this.xp >= this.xpNeeded) {
            this.levelUp();
            return true;
        }
        this.notify();
        return false;
    }
    
    /**
     * Add gold
     * @param {number} amount
     */
    addGold(amount) {
        this.gold += amount;
        this.notify();
    }
    
    /**
     * Level up the player
     */
    levelUp() {
        this.level++;
        this.xp = 0;
        this.xpNeeded = Math.floor(this.xpNeeded * 1.5);
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.maxMp += 10;
        this.mp = this.maxMp;
        this.attack += 5;
        this.defense += 2;
        this.notify();
    }
    
    /**
     * Fully restore HP and MP
     */
    rest() {
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        this.notify();
    }
    
    /**
     * Check if player is alive
     * @returns {boolean}
     */
    isAlive() {
        return this.hp > 0;
    }
}
