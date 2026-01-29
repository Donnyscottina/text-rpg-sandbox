// js/ui/OutputRenderer.js - Рендер вывода сообщений
export class OutputRenderer {
    constructor() {
        this.output = document.getElementById('output');
    }

    addMessage(text, type = 'info') {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = text;
        this.output.appendChild(div);
        this.output.scrollTop = this.output.scrollHeight;
    }

    clear() {
        this.output.innerHTML = '';
    }
}