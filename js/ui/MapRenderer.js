// js/ui/MapRenderer.js - Рендер карты мира
export class MapRenderer {
    constructor() {
        this.canvas = document.getElementById('worldMap');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 30;
    }

    draw(worldMap, playerPos) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw tiles
        for (let y = 0; y < worldMap.height; y++) {
            for (let x = 0; x < worldMap.width; x++) {
                const tile = worldMap.tiles[y][x];
                this.drawTile(x, y, tile);
            }
        }
        
        // Draw player
        this.drawPlayer(playerPos.x, playerPos.y);
    }

    drawTile(x, y, tile) {
        switch(tile.type) {
            case 'town':
                this.ctx.fillStyle = '#00aaff';
                break;
            case 'forest':
                this.ctx.fillStyle = '#004400';
                break;
            case 'dungeon':
                this.ctx.fillStyle = '#440000';
                break;
            default:
                this.ctx.fillStyle = '#002200';
        }
        
        this.ctx.fillRect(
            x * this.tileSize, 
            y * this.tileSize, 
            this.tileSize - 1, 
            this.tileSize - 1
        );
        
        if (tile.type !== 'grass') {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let symbol = '';
            switch(tile.type) {
                case 'town': symbol = '■'; break;
                case 'forest': symbol = '♣'; break;
                case 'dungeon': symbol = '▲'; break;
            }
            
            this.ctx.fillText(
                symbol, 
                x * this.tileSize + this.tileSize/2, 
                y * this.tileSize + this.tileSize/2
            );
        }
    }

    drawPlayer(x, y) {
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            '◆', 
            x * this.tileSize + this.tileSize/2, 
            y * this.tileSize + this.tileSize/2
        );
    }
}