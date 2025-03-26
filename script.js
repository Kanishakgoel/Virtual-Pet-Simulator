document.addEventListener('DOMContentLoaded', function() {
    // Pet attributes
    const pet = {
        happiness: 70,
        hunger: 30,
        energy: 80,
        isSleeping: false,
        isDirty: false,
        age: 0
    };
    
    // DOM elements
    const petElement = document.getElementById('pet');
    const happinessBar = document.getElementById('happinessBar');
    const hungerBar = document.getElementById('hungerBar');
    const energyBar = document.getElementById('energyBar');
    const petMessage = document.getElementById('petMessage');
    const timeOfDay = document.getElementById('timeOfDay');
    const gameTime = document.getElementById('gameTime');
    
    // Buttons
    const feedBtn = document.getElementById('feedBtn');
    const playBtn = document.getElementById('playBtn');
    const sleepBtn = document.getElementById('sleepBtn');
    const cleanBtn = document.getElementById('cleanBtn');
    
    // Game state
    let gameInterval;
    let dayNightCycle = 'day';
    let dayCount = 1;
    let hour = 8; // Start at 8am
    
    // Initialize the game
    function init() {
        updateBars();
        updatePetState();
        setupEventListeners();
        startGameLoop();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        feedBtn.addEventListener('click', feedPet);
        playBtn.addEventListener('click', playWithPet);
        sleepBtn.addEventListener('click', toggleSleep);
        cleanBtn.addEventListener('click', cleanPet);
    }
    
    // Start the game loop
    function startGameLoop() {
        gameInterval = setInterval(function() {
            updateGameTime();
            if (!pet.isSleeping) {
                // Gradually decrease attributes
                pet.happiness = Math.max(0, pet.happiness - 1);
                pet.hunger = Math.min(100, pet.hunger + 2);
                pet.energy = Math.max(0, pet.energy - 1);
                
                // Random events
                if (Math.random() < 0.1) {
                    pet.isDirty = true;
                    showMessage("I need a bath!");
                }
                
                // Check for critical states
                if (pet.hunger > 80) {
                    pet.happiness = Math.max(0, pet.happiness - 2);
                    showMessage("I'm so hungry...");
                }
                
                if (pet.energy < 20) {
                    showMessage("I'm getting sleepy...");
                }
            } else {
                // Sleeping restores energy
                pet.energy = Math.min(100, pet.energy + 3);
                
                // Wake up if fully rested
                if (pet.energy >= 95) {
                    toggleSleep();
                    showMessage("I'm well rested now!");
                }
            }
            
            updateBars();
            updatePetState();
        }, 3000); // Update every 3 seconds
    }
    
    // Update progress bars
    function updateBars() {
        happinessBar.style.width = `${pet.happiness}%`;
        hungerBar.style.width = `${pet.hunger}%`;
        energyBar.style.width = `${pet.energy}%`;
    }
    
    // Update pet's visual state
    function updatePetState() {
        // Reset all classes
        petElement.className = 'pet';
        
        if (pet.isSleeping) {
            petElement.classList.add('sleeping');
        } else if (pet.isDirty) {
            petElement.classList.add('dirty');
        } else if (pet.happiness < 30) {
            petElement.classList.add('sad');
        } else if (pet.happiness > 70) {
            petElement.classList.add('happy');
        } else if (pet.happiness > 50 && Math.random() < 0.3) {
            petElement.classList.add('excited');
            setTimeout(() => {
                petElement.classList.remove('excited');
            }, 1000);
        }
    }
    
    // Show a message from the pet
    function showMessage(message) {
        petMessage.textContent = message;
        setTimeout(() => {
            if (petMessage.textContent === message) {
                petMessage.textContent = '';
            }
        }, 3000);
    }
    
    // Feed the pet
    function feedPet() {
        if (pet.isSleeping) {
            showMessage("Zzz... I'm sleeping");
            return;
        }
        
        pet.hunger = Math.max(0, pet.hunger - 30);
        pet.energy = Math.min(100, pet.energy + 5);
        showMessage("Yummy! Thanks for the food!");
        updateBars();
        updatePetState();
        
        // Bounce animation
        petElement.classList.add('happy');
        setTimeout(() => {
            petElement.classList.remove('happy');
        }, 1000);
    }
    
    // Play with the pet
    function playWithPet() {
        if (pet.isSleeping) {
            showMessage("Zzz... Not now, I'm sleeping");
            return;
        }
        
        if (pet.energy < 20) {
            showMessage("I'm too tired to play...");
            return;
        }
        
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.energy = Math.max(0, pet.energy - 15);
        showMessage("That was fun! Let's play again!");
        updateBars();
        updatePetState();
        
        // Excited animation
        petElement.classList.add('excited');
        setTimeout(() => {
            petElement.classList.remove('excited');
        }, 1000);
    }
    
    // Toggle sleep state
    function toggleSleep() {
        pet.isSleeping = !pet.isSleeping;
        
        if (pet.isSleeping) {
            showMessage("Goodnight... Zzz");
            sleepBtn.innerHTML = '<i class="fas fa-sun"></i> Wake Up';
        } else {
            showMessage("I'm awake now!");
            sleepBtn.innerHTML = '<i class="fas fa-moon"></i> Sleep';
            pet.age++;
            gameTime.textContent = `Day ${dayCount}`;
        }
        
        updatePetState();
    }
    
    // Clean the pet
    function cleanPet() {
        pet.isDirty = false;
        pet.happiness = Math.min(100, pet.happiness + 10);
        showMessage("Ahh, that feels much better!");
        updateBars();
        updatePetState();
        
        // Happy animation
        petElement.classList.add('happy');
        setTimeout(() => {
            petElement.classList.remove('happy');
        }, 1000);
    }
    
    // Update game time and day/night cycle
    function updateGameTime() {
        hour = (hour + 1) % 24;
        
        if (hour === 6) {
            dayNightCycle = 'day';
            timeOfDay.innerHTML = '<i class="fas fa-sun"></i> Day';
        } else if (hour === 18) {
            dayNightCycle = 'night';
            timeOfDay.innerHTML = '<i class="fas fa-moon"></i> Night';
        }
        
        // New day
        if (hour === 0) {
            dayCount++;
            gameTime.textContent = `Day ${dayCount}`;
            pet.age++;
        }
    }
    
    // Initialize the game
    init();
});