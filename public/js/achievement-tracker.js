// Achievement Tracking System for Articulaition
class AchievementTracker {
    constructor() {
        this.achievements = {
            'first-steps': {
                id: 'first-steps',
                name: 'First Steps',
                description: 'Complete your first analysis',
                type: 'single',
                target: 1,
                current: 0,
                unlocked: false,
                category: 'getting-started'
            },
            'versatile-communicator': {
                id: 'versatile-communicator',
                name: 'Versatile Communicator',
                description: 'Score 65%+ on 3 different analysis types',
                type: 'multi-type',
                target: 3,
                current: 0,
                threshold: 65,
                unlocked: false,
                category: 'skill-mastery',
                completedTypes: new Set() // Track which analysis types have been completed
            },
            'communication-master': {
                id: 'communication-master',
                name: 'Communication Master',
                description: 'Score 80%+ on any analysis type',
                type: 'high-score',
                target: 10,
                current: 0,
                threshold: 80,
                unlocked: false,
                category: 'excellence'
            },
            'consistent-improver': {
                id: 'consistent-improver',
                name: 'Consistent Improver',
                description: 'Complete 3 analyses in 3 days',
                type: 'streak',
                target: 7, // 7 days total
                current: 0,
                dailyTarget: 3,
                unlocked: false,
                category: 'consistency',
                streakData: [], // Array of dates with analysis counts
                currentStreak: 0
            }
        };
        
        this.loadProgress();
        this.initializeEventListeners();
    }

    // Load achievement progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem('articulaition_achievements');
        if (saved) {
            try {
                const savedData = JSON.parse(saved);
                // Merge saved data with default structure
                Object.keys(this.achievements).forEach(key => {
                    if (savedData[key]) {
                        Object.assign(this.achievements[key], savedData[key]);
                        // Restore Set objects that don't serialize properly
                        if (key === 'versatile-communicator' && savedData[key].completedTypes) {
                            this.achievements[key].completedTypes = new Set(savedData[key].completedTypes);
                        }
                    }
                });
            } catch (error) {
                console.error('Error loading achievement progress:', error);
            }
        }
    }

    // Save achievement progress to localStorage
    saveProgress() {
        try {
            const dataToSave = {};
            Object.keys(this.achievements).forEach(key => {
                const achievement = { ...this.achievements[key] };
                // Convert Set to Array for serialization
                if (achievement.completedTypes instanceof Set) {
                    achievement.completedTypes = Array.from(achievement.completedTypes);
                }
                dataToSave[key] = achievement;
            });
            localStorage.setItem('articulaition_achievements', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving achievement progress:', error);
        }
    }

    // Record an analysis completion
    recordAnalysis(analysisType, score) {
        console.log(`Recording analysis: ${analysisType}, Score: ${score}%`);
        
        // Update First Steps
        this.updateFirstSteps();
        
        // Update Versatile Communicator
        this.updateVersatileCommunicator(analysisType, score);
        
        // Update Communication Master
        this.updateCommunicationMaster(score);
        
        // Update Consistent Improver
        this.updateConsistentImprover();
        
        // Save progress and update display
        this.saveProgress();
        this.updateDisplay();
        
        // Check for newly unlocked achievements
        this.checkForNewUnlocks();
    }

    // Update First Steps achievement
    updateFirstSteps() {
        const achievement = this.achievements['first-steps'];
        if (!achievement.unlocked && achievement.current === 0) {
            achievement.current = 1;
            achievement.unlocked = true;
            this.showAchievementUnlock('first-steps');
        }
    }

    // Update Versatile Communicator achievement
    updateVersatileCommunicator(analysisType, score) {
        const achievement = this.achievements['versatile-communicator'];
        if (!achievement.unlocked && score >= achievement.threshold) {
            // Add this analysis type to completed types
            achievement.completedTypes.add(analysisType);
            achievement.current = achievement.completedTypes.size;
            
            if (achievement.current >= achievement.target) {
                achievement.unlocked = true;
                this.showAchievementUnlock('versatile-communicator');
            }
        }
    }

    // Update Communication Master achievement
    updateCommunicationMaster(score) {
        const achievement = this.achievements['communication-master'];
        if (score >= achievement.threshold) {
            achievement.current++;
            
            if (!achievement.unlocked && achievement.current >= achievement.target) {
                achievement.unlocked = true;
                this.showAchievementUnlock('communication-master');
            }
        }
    }

    // Update Consistent Improver achievement
    updateConsistentImprover() {
        const achievement = this.achievements['consistent-improver'];
        const today = new Date().toDateString();
        
        // Find or create today's entry
        let todayEntry = achievement.streakData.find(entry => entry.date === today);
        if (!todayEntry) {
            todayEntry = { date: today, count: 0 };
            achievement.streakData.push(todayEntry);
        }
        
        // Increment today's count
        todayEntry.count++;
        
        // Calculate current streak
        this.calculateConsistentStreak();
        
        // Check if unlocked
        if (!achievement.unlocked && achievement.currentStreak >= achievement.target) {
            achievement.unlocked = true;
            this.showAchievementUnlock('consistent-improver');
        }
    }

    // Calculate consistent improver streak
    calculateConsistentStreak() {
        const achievement = this.achievements['consistent-improver'];
        const sortedData = achievement.streakData
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < sortedData.length; i++) {
            const entryDate = new Date(sortedData[i].date);
            const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
            
            // Check if this entry is for consecutive days and meets daily target
            if (daysDiff === i && sortedData[i].count >= achievement.dailyTarget) {
                streak++;
            } else {
                break;
            }
        }
        
        achievement.currentStreak = streak;
        achievement.current = streak;
    }

    // Show achievement unlock notification
    showAchievementUnlock(achievementId) {
        const achievement = this.achievements[achievementId];
        
        // Create achievement unlock notification
        const notification = document.createElement('div');
        notification.className = 'achievement-unlock-notification';
        notification.innerHTML = `
            <div class="achievement-unlock-content">
                <div class="achievement-unlock-icon">🏆</div>
                <div class="achievement-unlock-text">
                    <div class="achievement-unlock-title">Achievement Unlocked!</div>
                    <div class="achievement-unlock-name">${achievement.name}</div>
                    <div class="achievement-unlock-description">${achievement.description}</div>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
            z-index: 10000;
            animation: slideInAchievement 0.5s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutAchievement 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
        
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
    }

    // Check for newly unlocked achievements
    checkForNewUnlocks() {
        Object.values(this.achievements).forEach(achievement => {
            if (achievement.unlocked && achievement.current >= achievement.target) {
                // Achievement is complete
            }
        });
    }

    // Get achievement progress for display
    getAchievementProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return null;
        
        return {
            name: achievement.name,
            description: achievement.description,
            current: achievement.current,
            target: achievement.target,
            unlocked: achievement.unlocked,
            percentage: Math.min((achievement.current / achievement.target) * 100, 100)
        };
    }

    // Get total unlocked count
    getTotalUnlocked() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    // Get total achievement count
    getTotalAchievements() {
        return Object.keys(this.achievements).length;
    }

    // Update the achievement display on the page
    updateDisplay() {
        // Update total count
        const totalDisplay = document.querySelector('.accomplishments-count');
        if (totalDisplay) {
            totalDisplay.textContent = `${this.getTotalUnlocked()} of ${this.getTotalAchievements()} unlocked`;
        }

        // Update individual achievements
        Object.keys(this.achievements).forEach(achievementId => {
            this.updateAchievementElement(achievementId);
        });
    }

    // Update individual achievement element
    updateAchievementElement(achievementId) {
        const element = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (!element) return;
        
        const achievement = this.achievements[achievementId];
        const progressText = element.querySelector('.progress-text');
        const progressFill = element.querySelector('.mini-progress-fill');
        const icon = element.querySelector('.achievement-icon i');
        
        // Update progress text
        if (progressText) {
            if (achievementId === 'consistent-improver') {
                progressText.textContent = `${achievement.currentStreak}/${achievement.target} days`;
            } else {
                progressText.textContent = `${achievement.current}/${achievement.target} completed`;
            }
        }
        
        // Update progress bar
        if (progressFill) {
            const percentage = Math.min((achievement.current / achievement.target) * 100, 100);
            progressFill.style.width = `${percentage}%`;
        }
        
        // Update achievement status
        if (achievement.unlocked) {
            element.classList.remove('locked');
            element.classList.add('completed');
            element.style.borderLeft = '3px solid #10b981';
            if (icon) {
                icon.style.color = '#10b981';
            }
        } else {
            element.classList.add('locked');
            element.classList.remove('completed');
            element.style.borderLeft = '3px solid #e5e7eb';
            if (icon) {
                icon.style.color = '#9ca3af';
            }
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Listen for analysis completion events
        document.addEventListener('analysisCompleted', (event) => {
            const { analysisType, score } = event.detail;
            this.recordAnalysis(analysisType, score);
        });
        
        // Initialize display when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateDisplay());
        } else {
            this.updateDisplay();
        }
    }

    // Manual trigger for testing
    triggerTestAnalysis(analysisType = 'professional', score = 75) {
        console.log('Triggering test analysis...');
        this.recordAnalysis(analysisType, score);
    }

    // Reset all achievements (for testing)
    resetAchievements() {
        localStorage.removeItem('articulaition_achievements');
        Object.values(this.achievements).forEach(achievement => {
            achievement.current = 0;
            achievement.unlocked = false;
            if (achievement.completedTypes) {
                achievement.completedTypes.clear();
            }
            if (achievement.streakData) {
                achievement.streakData = [];
                achievement.currentStreak = 0;
            }
        });
        this.updateDisplay();
        console.log('All achievements reset');
    }
}

// Add CSS for achievement unlock animations
const achievementStyles = document.createElement('style');
achievementStyles.textContent = `
    @keyframes slideInAchievement {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutAchievement {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .achievement-unlock-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .achievement-unlock-icon {
        font-size: 24px;
        line-height: 1;
    }
    
    .achievement-unlock-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .achievement-unlock-name {
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 2px;
    }
    
    .achievement-unlock-description {
        font-size: 12px;
        opacity: 0.9;
    }
`;
document.head.appendChild(achievementStyles);

// Initialize the achievement tracker
window.achievementTracker = new AchievementTracker();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementTracker;
}