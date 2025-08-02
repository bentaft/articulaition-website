// Dashboard Data Integration - Dynamic data loading for Projects dashboard
// Connects user data tracker with dashboard UI components

class DashboardDataIntegration {
    constructor() {
        this.refreshInterval = 30000; // 30 seconds
        this.charts = {};
        this.init();
    }

    init() {
        // Wait for DOM and Chart.js to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeDashboard());
        } else {
            this.initializeDashboard();
        }
    }

    async initializeDashboard() {
        // Wait for user data tracker to be available
        await this.waitForDataTracker();
        
        // Load real data
        this.loadDashboardData();
        
        // Set up auto-refresh
        this.startAutoRefresh();
        
        // Listen for analysis completion events
        this.setupEventListeners();
    }

    async waitForDataTracker() {
        return new Promise((resolve) => {
            const checkForTracker = () => {
                if (window.userDataTracker) {
                    resolve();
                } else {
                    setTimeout(checkForTracker, 100);
                }
            };
            checkForTracker();
        });
    }

    loadDashboardData() {
        try {
            // Get real user statistics
            const stats = window.userDataTracker.getDashboardStats();
            
            console.log('📊 Loading real dashboard data:', stats);
            
            // Update stat cards
            this.updateStatCards(stats);
            
            // Update charts
            this.updateProgressChart(stats.weeklyScores);
            this.updateSkillChart(stats.skillBreakdown);
            
            // Update recent sessions
            this.updateRecentSessions(stats.recentSessions);
            
            // Update monthly goals
            this.updateMonthlyGoals(stats.monthlyProgress);
            
            console.log('✅ Dashboard data loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    updateStatCards(stats) {
        // Update main stat cards with real data
        this.updateElement('#total-analyses', stats.totalAnalyses);
        this.updateElement('#average-score', `${stats.averageScore}%`);
        this.updateElement('#speaking-time', `${stats.speakingTime}h`);
        this.updateElement('#improvement-rate', `+${stats.improvementRate}%`);
        
        // Update trend indicators based on improvement
        this.updateTrendIndicator('#analyses-trend', stats.totalAnalyses > 10 ? 'up' : 'neutral');
        this.updateTrendIndicator('#score-trend', stats.averageScore > 75 ? 'up' : 'neutral');
        this.updateTrendIndicator('#time-trend', stats.speakingTime > 2 ? 'up' : 'neutral');
        this.updateTrendIndicator('#improvement-trend', stats.improvementRate > 10 ? 'up' : 'neutral');
    }

    updateElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
            // Add update animation
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateTrendIndicator(selector, trend) {
        const indicator = document.querySelector(selector);
        if (indicator) {
            indicator.className = `trend-indicator trend-${trend}`;
            const icon = indicator.querySelector('i');
            if (icon) {
                icon.className = trend === 'up' ? 'trend-up' : 'trend-neutral';
            }
        }
    }

    updateProgressChart(weeklyData) {
        const canvas = document.getElementById('progressChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.progress) {
            this.charts.progress.destroy();
        }

        // Prepare data for Chart.js
        const labels = weeklyData.map(week => week.week.replace('Week ', 'W'));
        const scores = weeklyData.map(week => week.score);
        
        this.charts.progress = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Communication Score',
                    data: scores,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#6366f1',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return `Week ${context[0].dataIndex + 1}`;
                            },
                            label: function(context) {
                                return `Score: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        display: true,
                        min: 40,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#6366f1'
                    }
                }
            }
        });
    }

    updateSkillChart(skillData) {
        const skillBars = document.querySelectorAll('.skill-progress-bar');
        const skillValues = document.querySelectorAll('.skill-value');
        
        const skills = ['clarity', 'confidence', 'engagement', 'pacing', 'articulation'];
        
        skills.forEach((skill, index) => {
            const value = skillData[skill] || 0;
            const bar = skillBars[index];
            const valueElement = skillValues[index];
            
            if (bar && valueElement) {
                // Animate the progress bar
                setTimeout(() => {
                    bar.style.width = `${value}%`;
                    valueElement.textContent = `${value}%`;
                    
                    // Add color based on performance
                    bar.className = `skill-progress-bar ${this.getSkillColorClass(value)}`;
                }, index * 100); // Stagger animations
            }
        });
    }

    getSkillColorClass(value) {
        if (value >= 85) return 'skill-excellent';
        if (value >= 70) return 'skill-good';
        if (value >= 55) return 'skill-average';
        return 'skill-needs-work';
    }

    updateRecentSessions(sessions) {
        const container = document.querySelector('.recent-sessions-list');
        if (!container) return;

        if (sessions.length === 0) {
            container.innerHTML = `
                <div class="no-sessions">
                    <i data-lucide="calendar-x" class="w-12 h-12 text-gray-400 mx-auto mb-3"></i>
                    <p class="text-gray-500">No recent sessions</p>
                    <p class="text-sm text-gray-400">Complete an analysis to see your progress</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const sessionsHTML = sessions.map(session => `
            <div class="session-item" data-session-id="${session.id}">
                <div class="session-info">
                    <div class="session-type">${session.type}</div>
                    <div class="session-date">${session.date}</div>
                </div>
                <div class="session-stats">
                    <div class="session-score ${this.getScoreClass(session.score)}">${session.score}%</div>
                    <div class="session-duration">${session.duration}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = sessionsHTML;
    }

    getScoreClass(score) {
        if (score >= 85) return 'score-excellent';
        if (score >= 70) return 'score-good';
        if (score >= 55) return 'score-average';
        return 'score-needs-work';
    }

    updateMonthlyGoals(monthlyProgress) {
        const goals = ['analyses', 'speakingTime', 'averageScore'];
        
        goals.forEach(goalType => {
            const progress = monthlyProgress[goalType];
            if (!progress) return;
            
            const progressBar = document.querySelector(`#${goalType}-progress .goal-progress-bar`);
            const progressText = document.querySelector(`#${goalType}-progress .goal-progress-text`);
            const currentValue = document.querySelector(`#${goalType}-progress .goal-current`);
            const goalValue = document.querySelector(`#${goalType}-progress .goal-target`);
            
            if (progressBar) {
                const percentage = Math.min(100, progress.percentage);
                progressBar.style.width = `${percentage}%`;
                
                // Add color based on progress
                progressBar.className = `goal-progress-bar ${this.getGoalColorClass(percentage)}`;
            }
            
            if (progressText) {
                progressText.textContent = `${progress.percentage}%`;
            }
            
            if (currentValue) {
                let displayValue = progress.current;
                if (goalType === 'speakingTime') {
                    displayValue = `${Math.round(progress.current)} min`;
                } else if (goalType === 'averageScore') {
                    displayValue = `${progress.current}%`;
                }
                currentValue.textContent = displayValue;
            }
            
            if (goalValue) {
                let displayGoal = progress.goal;
                if (goalType === 'speakingTime') {
                    displayGoal = `${progress.goal} min`;
                } else if (goalType === 'averageScore') {
                    displayGoal = `${progress.goal}%`;
                }
                goalValue.textContent = displayGoal;
            }
        });
    }

    getGoalColorClass(percentage) {
        if (percentage >= 100) return 'goal-complete';
        if (percentage >= 75) return 'goal-on-track';
        if (percentage >= 50) return 'goal-progress';
        return 'goal-behind';
    }

    startAutoRefresh() {
        setInterval(() => {
            this.loadDashboardData();
        }, this.refreshInterval);
    }

    setupEventListeners() {
        // Listen for analysis completion events
        document.addEventListener('analysisCompleted', (event) => {
            console.log('🎯 Analysis completed, refreshing dashboard...', event.detail);
            setTimeout(() => {
                this.loadDashboardData();
            }, 1000); // Small delay to ensure data is saved
        });

        // Listen for manual refresh requests
        document.addEventListener('refreshDashboard', () => {
            this.loadDashboardData();
        });

        // Add refresh button if it exists
        const refreshBtn = document.querySelector('.refresh-dashboard-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadDashboardData();
                this.showSuccessMessage('Dashboard refreshed');
            });
        }
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Public method to manually refresh data
    refresh() {
        this.loadDashboardData();
    }

    // Public method to simulate new analysis for testing
    simulateAnalysis(analysisType = 'professional', score = null) {
        if (!window.userDataTracker) return;
        
        const generatedScore = score || (Math.floor(Math.random() * 30) + 65); // 65-95 range
        const duration = Math.random() * 8 + 2; // 2-10 minutes
        
        window.userDataTracker.recordAnalysis(analysisType, generatedScore, duration);
        
        // Refresh dashboard immediately
        setTimeout(() => {
            this.loadDashboardData();
        }, 500);
        
        this.showSuccessMessage(`Simulated ${analysisType} analysis (${generatedScore}%)`);
        
        return { analysisType, score: generatedScore, duration };
    }
}

// Add required CSS for dynamic updates
const dynamicStyles = `
    <style>
        .skill-progress-bar {
            transition: width 0.8s ease;
        }
        
        .skill-excellent { background: linear-gradient(90deg, #10b981, #059669); }
        .skill-good { background: linear-gradient(90deg, #6366f1, #4f46e5); }
        .skill-average { background: linear-gradient(90deg, #f59e0b, #d97706); }
        .skill-needs-work { background: linear-gradient(90deg, #ef4444, #dc2626); }
        
        .goal-progress-bar {
            transition: width 0.6s ease;
        }
        
        .goal-complete { background: linear-gradient(90deg, #10b981, #059669); }
        .goal-on-track { background: linear-gradient(90deg, #6366f1, #4f46e5); }
        .goal-progress { background: linear-gradient(90deg, #f59e0b, #d97706); }
        .goal-behind { background: linear-gradient(90deg, #ef4444, #dc2626); }
        
        .score-excellent { color: #10b981; font-weight: 600; }
        .score-good { color: #6366f1; font-weight: 600; }
        .score-average { color: #f59e0b; font-weight: 600; }
        .score-needs-work { color: #ef4444; font-weight: 600; }
        
        .no-sessions {
            text-align: center;
            padding: 2rem;
            color: #64748b;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    </style>
`;

// Add styles to document head
document.head.insertAdjacentHTML('beforeend', dynamicStyles);

// Global instance
window.dashboardDataIntegration = new DashboardDataIntegration();

// Global helper functions
window.refreshDashboard = function() {
    return window.dashboardDataIntegration.refresh();
};

window.simulateDashboardAnalysis = function(type, score) {
    return window.dashboardDataIntegration.simulateAnalysis(type, score);
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardDataIntegration;
}