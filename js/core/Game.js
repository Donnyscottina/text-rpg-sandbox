/**
 * Main game controller following Singleton pattern
 * Manages game state, systems coordination, and core game loop
 */
class Game {
    constructor() {
        if (Game.instance) {
            return Game.instance;
        }
        
        this.player = null;
        this.worldMap = null;
        this.locationManager = null;
        this.combatSystem = null;
        this.commandRegistry = null;
        this.ui = null;
        this.initialized = false;
        
        Game.instance = this;
    }
    
    /**
     * Initialize all game systems
     */
    init() {
        if (this.initialized) return;
        
        this.player = new Player('Герой', { x: 5, y: 5 });
        this.worldMap = new WorldMap(10, 10);
        this.locationManager = new LocationManager();
        this.combatSystem = new CombatSystem(this.player);
        this.commandRegistry = new CommandRegistry();
        this.ui = new GameUI(this);
        
        // Initialize world
        this.worldMap.init(this.locationManager.getAllLocations());
        this.player.setLocation('town_square');
        
        // Setup observers
        this.player.addObserver(this.ui);
        this.combatSystem.addObserver(this.ui);
        
        // Setup command handlers
        this.setupCommands();
        
        this.initialized = true;
        this.ui.init();
        this.ui.showWelcomeMessage();
    }
    
    /**
     * Register all game commands
     */
    setupCommands() {
        const registry = this.commandRegistry;
        
        registry.register('help', new HelpCommand(this));
        registry.register('look', new LookCommand(this));
        registry.register('go', new MoveCommand(this));
        registry.register('talk', new TalkCommand(this));
        registry.register('attack', new AttackCommand(this));
        registry.register('flee', new FleeCommand(this));
        registry.register('use', new UseItemCommand(this));
        registry.register('examine', new ExamineCommand(this));
        registry.register('inventory', new InventoryCommand(this));
        registry.register('stats', new StatsCommand(this));
        registry.register('rest', new RestCommand(this));
    }
    
    /**
     * Execute a command from user input
     * @param {string} input - Raw user input
     */
    executeCommand(input) {
        const parsed = this.commandRegistry.parse(input);
        if (!parsed) {
            this.ui.addMessage('Неизвестная команда. Наберите "help" для списка команд.', 'error');
            return;
        }
        
        parsed.command.execute(parsed.args);
    }
    
    /**
     * Get current location object
     * @returns {Location}
     */
    getCurrentLocation() {
        return this.locationManager.getLocation(this.player.location);
    }
    
    /**
     * Check if player is currently in combat
     * @returns {boolean}
     */
    isInCombat() {
        return this.combatSystem.isActive();
    }
}
