// js/world/WorldMap.js - Карта мира
import { Location } from './Location.js';
import { LOCATIONS_DATA } from '../config/locationsData.js';

export class WorldMap {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.tiles = [];
        this.locations = new Map();
    }

    async init() {
        this.initTiles();
        this.loadLocations();
    }

    initTiles() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = { type: 'grass' };
            }
        }
    }

    loadLocations() {
        Object.entries(LOCATIONS_DATA).forEach(([id, data]) => {
            const location = new Location({
                id: id,
                ...data
            });
            
            this.locations.set(id, location);
            
            // Устанавливаем тайл на карте
            if (data.x !== undefined && data.y !== undefined) {
                this.tiles[data.y][data.x] = {
                    type: data.type,
                    locationId: id
                };
            }
        });
    }

    getLocation(id) {
        return this.locations.get(id);
    }

    getTile(x, y) {
        if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
            return null;
        }
        return this.tiles[y][x];
    }

    getTiles() {
        return this.tiles;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    serialize() {
        const locationsState = {};
        
        this.locations.forEach((location, id) => {
            locationsState[id] = location.serialize();
        });
        
        return {
            locationsState: locationsState
        };
    }

    deserialize(data) {
        if (data.locationsState) {
            Object.entries(data.locationsState).forEach(([id, state]) => {
                const location = this.locations.get(id);
                if (location) {
                    location.deserialize(state);
                }
            });
        }
    }
}
