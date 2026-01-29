// js/ui/QuickActionsUI.js - Быстрые команды
export class QuickActionsUI {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.container = document.getElementById('quickActions');
        this.clickModeToggle = document.getElementById('toggleClickMode');
    }

    render(suggestions) {
        this.container.innerHTML = '';
        
        suggestions.forEach(sug => {
            const btn = document.createElement('button');
            btn.className = `cmd-btn ${sug.style || ''}`;
            btn.textContent = sug.label;
            btn.onclick = () => this.handleButtonClick(sug.command);
            this.container.appendChild(btn);
        });
    }

    handleButtonClick(command) {
        if (this.clickModeToggle.checked) {
            this.eventBus.emit('command:input', command);
        } else {
            document.getElementById('commandInput').value = command;
            document.getElementById('commandInput').focus();
        }
    }
}