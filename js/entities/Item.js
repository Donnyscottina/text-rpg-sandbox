// js/entities/Item.js - Класс предмета
export class Item {
    constructor(config) {
        this.name = config.name;
        this.type = config.type; // 'potion', 'food', 'weapon', 'armor'
        this.effect = config.effect; // 'heal', 'damage', 'buff'
        this.value = config.value; // значение эффекта
        this.description = config.description || '';
    }

    use(target) {
        switch (this.effect) {
            case 'heal':
                return target.heal(this.value);
            case 'restore_mp':
                return target.restoreMp(this.value);
            default:
                return 0;
        }
    }

    serialize() {
        return {
            name: this.name,
            type: this.type,
            effect: this.effect,
            value: this.value,
            description: this.description
        };
    }

    static deserialize(data) {
        return new Item(data);
    }
}