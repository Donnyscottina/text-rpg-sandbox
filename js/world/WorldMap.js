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
        for (const [id, data] of Object.entries(LOCATIONS_DATA)) {
            const location = new Location({ id, ...data });
            this.locations.set(id, location);
            
            if (location.x !== undefined && location.y !== undefined) {
                this.tiles[location.y][location.x] = {
                    type: location.type,
                    locationId: id
                };
            }
        }
    }

    getLocation(id) {
        return this.locations.get(id);
    }

    getTileAt(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.tiles[y][x];
    }
}