// js/ui/UIManager.js
export class UIManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.historyIndex = -1;
        this.commandHistory = [];
    }

    init() {
        this.setupEventListeners();
        this.setupInputHandlers();
    }

    setupEventListeners() {
        this.eventBus.on('game:update', () => this.updateUI());
        this.eventBus.on('message:system', (msg) => this.addMessage(msg, 'system'));
        this.eventBus.on('message:success', (msg) => this.addMessage(msg, 'success'));
        this.eventBus.on('message:error', (msg) => this.addMessage(msg, 'error'));
        this.eventBus.on('message:info', (msg) => this.addMessage(msg, 'info'));
        this.eventBus.on('message:combat', (msg) => this.addMessage(msg, 'combat'));
    }

    setupInputHandlers() {
        const input = document.getElementById('commandInput');
        const sendBtn = document.getElementById('sendBtn');

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.handleCommand(input.value);
                input.value = '';
            }
        });

        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                this.handleCommand(input.value);
                input.value = '';
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.commandHistory[this.historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    input.value = this.commandHistory[this.historyIndex] || '';
                } else {
                    this.historyIndex = this.commandHistory.length;
                    input.value = '';
                }
            }
        });
    }

    handleCommand(cmd) {
        if (this.commandHistory[this.commandHistory.length - 1] !== cmd) {
            this.commandHistory.push(cmd);
        }
        this.historyIndex = this.commandHistory.length;
        this.addMessage('> ' + cmd, 'info');
        this.eventBus.emit('command:input', cmd);
    }

    addMessage(text, type = 'info') {
        const output = document.getElementById('output');
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = text;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    updateUI() {
        this.eventBus.emit('ui:refresh');
    }
}