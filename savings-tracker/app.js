// Savings Tracker App with Gamification
class SavingsTracker {
    constructor() {
        this.savingsGoal = 1000;
        this.currentSavings = 0;
        this.level = 1;
        this.xp = 0;
        this.achievements = [];
        this.initialize();
    }

    initialize() {
        this.loadData();
        this.render();
        this.setupEventListeners();
    }

    loadData() {
        const savedData = localStorage.getItem('savingsTracker');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.assign(this, data);
        }
    }

    saveData() {
        localStorage.setItem('savingsTracker', JSON.stringify({
            savingsGoal: this.savingsGoal,
            currentSavings: this.currentSavings,
            level: this.level,
            xp: this.xp,
            achievements: this.achievements
        }));
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h1 class="text-3xl font-bold text-center mb-6 text-indigo-700">Savings Tracker</h1>
                
                <div class="mb-6">
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Level ${this.level}</span>
                        <span class="font-semibold">${this.xp}/100 XP</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-indigo-500 h-4 rounded-full progress-bar" 
                             style="width: ${(this.xp / 100) * 100}%"></div>
                    </div>
                </div>

                <div class="mb-6">
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Savings Progress</span>
                        <span class="font-semibold">$${this.currentSavings} / $${this.savingsGoal}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-green-500 h-4 rounded-full progress-bar" 
                             style="width: ${(this.currentSavings / this.savingsGoal) * 100}%"></div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Add Savings</label>
                        <input type="number" id="addAmount" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Set Goal</label>
                        <input type="number" id="goalAmount" value="${this.savingsGoal}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    </div>
                </div>

                <div class="flex space-x-4 mb-6">
                    <button id="addBtn" class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                        Add Savings
                    </button>
                    <button id="setGoalBtn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
                        Set Goal
                    </button>
                </div>

                <div class="mb-6">
                    <h2 class="text-xl font-semibold mb-3">Achievements</h2>
                    <div id="achievements" class="grid grid-cols-3 gap-3">
                        ${this.renderAchievements()}
                    </div>
                </div>
            </div>
        `;
    }

    renderAchievements() {
        const allAchievements = [
            { id: 'first-save', title: 'First Save', description: 'Save your first dollar', icon: 'fa-coins', unlocked: this.achievements.includes('first-save') },
            { id: 'halfway', title: 'Halfway There', description: 'Reach 50% of your goal', icon: 'fa-chart-line', unlocked: this.achievements.includes('halfway') },
            { id: 'goal-reached', title: 'Goal Reached', description: 'Complete your savings goal', icon: 'fa-trophy', unlocked: this.achievements.includes('goal-reached') },
            { id: 'level-5', title: 'Level 5', description: 'Reach level 5', icon: 'fa-star', unlocked: this.achievements.includes('level-5') },
            { id: 'saver', title: 'Saver', description: 'Save $500 total', icon: 'fa-piggy-bank', unlocked: this.achievements.includes('saver') },
            { id: 'early-bird', title: 'Early Bird', description: 'Save before noon', icon: 'fa-sun', unlocked: this.achievements.includes('early-bird') }
        ];

        return allAchievements.map(ach => `
            <div id="${ach.id}" class="text-center p-2 rounded-lg ${ach.unlocked ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-100 opacity-50'}">
                <i class="fas ${ach.icon} text-2xl mb-1 ${ach.unlocked ? 'text-yellow-500' : 'text-gray-400'}"></i>
                <h3 class="font-medium text-sm">${ach.title}</h3>
                <p class="text-xs text-gray-500">${ach.description}</p>
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.getElementById('addBtn').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('addAmount').value);
            if (amount && amount > 0) {
                this.addSavings(amount);
                document.getElementById('addAmount').value = '';
            }
        });

        document.getElementById('setGoalBtn').addEventListener('click', () => {
            const goal = parseFloat(document.getElementById('goalAmount').value);
            if (goal && goal > 0) {
                this.setGoal(goal);
            }
        });
    }

    addSavings(amount) {
        this.currentSavings += amount;
        this.addXP(10);
        this.checkAchievements();
        this.saveData();
        this.render();

        // Check for first save achievement
        if (this.currentSavings > 0 && !this.achievements.includes('first-save')) {
            this.unlockAchievement('first-save');
        }

        // Check for halfway achievement
        if (this.currentSavings >= this.savingsGoal * 0.5 && !this.achievements.includes('halfway')) {
            this.unlockAchievement('halfway');
        }

        // Check for goal reached achievement
        if (this.currentSavings >= this.savingsGoal && !this.achievements.includes('goal-reached')) {
            this.unlockAchievement('goal-reached');
        }
    }

    setGoal(goal) {
        this.savingsGoal = goal;
        this.saveData();
        this.render();
    }

    addXP(points) {
        this.xp += points;
        if (this.xp >= 100) {
            this.levelUp();
        }
        this.saveData();
    }

    levelUp() {
        this.level++;
        this.xp = this.xp - 100;
        document.getElementById('app').classList.add('level-up');
        setTimeout(() => {
            document.getElementById('app').classList.remove('level-up');
        }, 2000);

        // Check for level 5 achievement
        if (this.level >= 5 && !this.achievements.includes('level-5')) {
            this.unlockAchievement('level-5');
        }
    }

    checkAchievements() {
        // Check for saver achievement
        if (this.currentSavings >= 500 && !this.achievements.includes('saver')) {
            this.unlockAchievement('saver');
        }

        // Check for early bird achievement
        const now = new Date();
        if (now.getHours() < 12 && !this.achievements.includes('early-bird')) {
            this.unlockAchievement('early-bird');
        }
    }

    unlockAchievement(achievementId) {
        this.achievements.push(achievementId);
        this.addXP(25);
        this.saveData();
        
        const achievementElement = document.getElementById(achievementId);
        if (achievementElement) {
            // Reset animation
            achievementElement.style.animation = 'none';
            void achievementElement.offsetWidth; // Trigger reflow
            
            // Apply Flutter-like animation and styling
            achievementElement.classList.remove('bg-gray-100', 'opacity-50');
            achievementElement.classList.add(
                'bg-yellow-100', 
                'border', 
                'border-yellow-300',
                'achievement-unlocked'
            );
            achievementElement.querySelector('i').classList.remove('text-gray-400');
            achievementElement.querySelector('i').classList.add('text-yellow-500');

            // Show confetti effect
            this.showConfetti(achievementElement);
        }
    }

    showConfetti(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${centerX}px`;
            confetti.style.top = `${centerY}px`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 60 + 30}, 100%, 50%)`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;

            const animation = confetti.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${x}rem, ${y}rem) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }
}

// Initialize the app
const savingsTracker = new SavingsTracker();
