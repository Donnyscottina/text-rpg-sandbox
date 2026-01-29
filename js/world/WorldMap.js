/**
 * WorldMap - класс для управления картой мира
 */
export class WorldMap {
    constructor(width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.initialize();
    }

    initialize() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = { type: 'grass' };
            }
        }
    }

    setTile(x, y, type, location) {
        if (this.isValidCoordinate(x, y)) {
            this.tiles[y][x] = { type, location };
        }
    }

    getTile(x, y) {
        if (this.isValidCoordinate(x, y)) {
            return this.tiles[y][x];
        }
        return null;
    }

    isValidCoordinate(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    populateFromLocations(locations) {
        for (const [key, loc] of Object.entries(locations)) {
            if (loc.x !== undefined && loc.y !== undefined) {
                this.setTile(loc.x, loc.y, loc.type, key);
            }
        }
    }
}