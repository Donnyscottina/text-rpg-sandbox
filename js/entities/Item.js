// js/entities/Item.js - Класс предмета
export class Item {
    constructor(config) {
        this.name = config.name;
        this.type = config.type; // potion, food, weapon, armor, quest
        this.effect = config.effect; // heal, damage, buff, quest
        this.value = config.value || 0;
        this.description = config.description || '';
        this.stackable = config.stackable !== false;
    }

    use(target) {
        switch (this.effect) {
            case 'heal':
                return target.heal(this.value);
            case 'mp_restore':
                return target.restoreMp(this.value);
            default:
                return 0;
        }
    }

    canUse() {
        return ['heal', 'mp_restore', 'buff'].includes(this.effect);
    }

    serialize() {
        return {
            name: this.name,
            type: this.type,
            effect: this.effect,
            value: this.value,
            description: this.description,
            stackable: this.stackable
        };
    }

    static deserialize(data) {
        return new Item(data);
    }
}
