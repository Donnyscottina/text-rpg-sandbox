// js/ui/UIManager.js - Управление UI
import { OutputRenderer } from './OutputRenderer.js';
import { MapRenderer } from './MapRenderer.js';
import { QuickActionsUI } from './QuickActionsUI.js';

export class UIManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.outputRenderer = new OutputRenderer();
        this.mapRenderer = null;
        this.quickActionsUI = null;
        this.inputDisabled = false;
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.mapRenderer = new MapRenderer();
        this.quickActionsUI = new QuickActionsUI(this.eventBus);
    }

    setupDOM() {
        this.commandInput = document.getElementById('commandInput');
        this.sendBtn = document.getElementById('sendBtn');
    }

    setupEventListeners() {
        // Message events
        this.eventBus.on('message:system', (text) => this.outputRenderer.addMessage(text, 'system'));
        this.eventBus.on('message:error', (text) => this.outputRenderer.addMessage(text, 'error'));
        this.eventBus.on('message:success', (text) => this.outputRenderer.addMessage(text, 'success'));
        this.eventBus.on('message:info', (text) => this.outputRenderer.addMessage(text, 'info'));
        this.eventBus.on('message:combat', (text) => this.outputRenderer.addMessage(text, 'combat'));

        // UI update events
        this.eventBus.on('location:changed', (location) => this.updateLocationDisplay(location));
        this.eventBus.on('combat:started', () => this.refresh());
        this.eventBus.on('combat:ended', () => this.refresh());
        this.eventBus.on('game:started', () => this.refresh());

        // Input events
        this.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.inputDisabled) {
                this.handleCommandInput();
            }
        });

        this.sendBtn.addEventListener('click', () => {
            if (!this.inputDisabled) {
                this.handleCommandInput();
            }
        });

        // History navigation
        this.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
    }

    handleCommandInput() {
        const cmd = this.commandInput.value.trim();
        if (cmd) {
            this.outputRenderer.addMessage('> ' + cmd, 'info');
            this.eventBus.emit('command:input', cmd);
            this.commandInput.value = '';
        }
    }

    navigateHistory(direction) {
        // This will be handled by GameState
        // For now, just a placeholder
    }

    updateLocationDisplay(location) {
        document.getElementById('locationName').textContent = location.name;
        document.getElementById('locationDesc').textContent = location.desc;
        
        this.updateNPCsList(location.npcs || []);
        this.updateEnemiesList(location.enemies || []);
        this.updateObjectsList(location.objects || []);
    }

    updateNPCsList(npcs) {
        const container = document.getElementById('npcs');
        container.innerHTML = '';
        
        if (npcs.length === 0) {
            container.innerHTML = '<div style="color: #666; font-size: 11px;">Никого нет</div>';
            return;
        }
        
        npcs.forEach(npc => {
            const div = document.createElement('div');
            div.className = 'npc';
            div.textContent = '👤 ' + npc;
            div.onclick = () => this.eventBus.emit('command:input', 'talk ' + npc);
            container.appendChild(div);
        });
    }

    updateEnemiesList(enemies) {
        const container = document.getElementById('enemies');
        container.innerHTML = '';
        
        if (enemies.length === 0) {
            container.innerHTML = '<div style="color: #666; font-size: 11px;">Нет врагов</div>';
            return;
        }
        
        enemies.forEach(enemy => {
            const div = document.createElement('div');
            div.className = 'enemy';
            div.textContent = '⚔️ ' + enemy;
            div.onclick = () => this.eventBus.emit('command:input', 'attack ' + enemy);
            container.appendChild(div);
        });
    }

    updateObjectsList(objects) {
        const container = document.getElementById('objects');
        container.innerHTML = '';
        
        if (objects.length === 0) {
            container.innerHTML = '<div style="color: #666; font-size: 11px;">Ничего нет</div>';
            return;
        }
        
        objects.forEach(obj => {
            const div = document.createElement('div');
            div.className = 'object';
            div.textContent = '📦 ' + obj;
            div.onclick = () => this.eventBus.emit('command:input', 'examine ' + obj);
            container.appendChild(div);
        });
    }

    refresh() {
        // Trigger full UI refresh
        this.eventBus.emit('ui:refresh');
    }

    disableInput() {
        this.inputDisabled = true;
        this.commandInput.disabled = true;
        this.sendBtn.disabled = true;
    }
}