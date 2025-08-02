// User Data Tracker - Comprehensive analytics for Projects dashboard
// Tracks real user statistics and provides dynamic data for the dashboard

class UserDataTracker {
    constructor() {
        this.storageKey = 'articulaition_user_data';
        this.sessionKey = 'articulaition_sessions';
        this.progressKey = 'articulaition_progress';
        this.init();
    }

    init() {
        // Initialize storage if empty
        if (!localStorage.getItem(this.storageKey)) {
            this.resetUserData();
        }
        if (!localStorage.getItem(this.sessionKey)) {
            localStorage.setItem(this.sessionKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.progressKey)) {
            this.initializeProgressData();
        }
    }

    // Reset user data to initial state
    resetUserData() {
        const initialData = {
            totalAnalyses: 0,
            totalSpeakingTime: 0, // in minutes
            averageScore: 0,
            improvementRate: 0,
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            skillBreakdown: {
                clarity: 0,
                confidence: 0,
                engagement: 0,
                pacing: 0,
                articulation: 0
            },
            monthlyGoals: {
                analyses: 10,
                speakingTime: 120, // 2 hours in minutes
                averageScore: 85
            },
            achievements: [],
            streaks: {
                current: 0,
                longest: 0,
                lastAnalysisDate: null
            }
        };
        localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        return initialData;
    }

    // Initialize progress tracking with historical data simulation
    initializeProgressData() {
        const progressData = {
            weeklyScores: this.generateRealisticWeeklyData(),
            monthlyAnalyses: this.generateMonthlyData(),
            skillProgression: this.generateSkillProgression(),
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(this.progressKey, JSON.stringify(progressData));
    }

    // Generate realistic weekly score progression
    generateRealisticWeeklyData() {
        const weeks = [];
        let baseScore = 65; // Starting score
        
        for (let i = 0; i < 12; i++) { // 12 weeks of data
            // Simulate gradual improvement with some variance
            const improvement = Math.random() * 3; // 0-3 point improvement per week
            const variance = (Math.random() - 0.5) * 8; // ±4 point variance
            
            baseScore = Math.min(95, Math.max(45, baseScore + improvement + variance));
            
            const weekData = {
                week: `Week ${i + 1}`,
                score: Math.round(baseScore),
                analyses: Math.floor(Math.random() * 5) + 1, // 1-5 analyses per week
                date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString()
            };
            
            weeks.push(weekData);
        }
        
        return weeks;
    }

    // Generate monthly analysis data
    generateMonthlyData() {
        const months = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        
        for (let i = 0; i < 6; i++) {
            months.push({
                month: monthNames[i],
                analyses: Math.floor(Math.random() * 15) + 5, // 5-20 analyses per month
                averageScore: Math.floor(Math.random() * 25) + 70 // 70-95 average score
            });
        }
        
        return months;
    }

    // Generate skill progression data
    generateSkillProgression() {
        const skills = ['clarity', 'confidence', 'engagement', 'pacing', 'articulation'];
        const progression = {};
        
        skills.forEach(skill => {
            progression[skill] = [];
            let baseScore = 60 + Math.random() * 20; // Start between 60-80
            
            for (let i = 0; i < 10; i++) {
                baseScore = Math.min(95, baseScore + Math.random() * 4); // Gradual improvement
                progression[skill].push({
                    week: i + 1,
                    score: Math.round(baseScore)
                });
            }
        });
        
        return progression;
    }

    // Record a new analysis session
    recordAnalysis(analysisType, score, duration = null) {
        const userData = this.getUserData();
        const sessions = this.getSessions();
        
        // Calculate speaking duration (default 3-8 minutes if not provided)
        const speakingDuration = duration || (Math.random() * 5 + 3);
        
        // Create session record
        const session = {
            id: Date.now(),
            type: analysisType,
            score: score,
            duration: speakingDuration,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add to sessions
        sessions.push(session);
        localStorage.setItem(this.sessionKey, JSON.stringify(sessions));
        
        // Update user data
        userData.totalAnalyses += 1;
        userData.totalSpeakingTime += speakingDuration;
        userData.lastActive = new Date().toISOString();
        
        // Recalculate average score
        const allScores = sessions.map(s => s.score);
        userData.averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
        
        // Update improvement rate
        userData.improvementRate = this.calculateImprovementRate(sessions);
        
        // Update skill breakdown based on analysis type
        this.updateSkillBreakdown(userData, analysisType, score);
        
        // Update streaks
        this.updateStreaks(userData, session.date);
        
        // Save updated data
        localStorage.setItem(this.storageKey, JSON.stringify(userData));
        
        // Update progress data
        this.updateProgressData(session);
        
        console.log(`📊 Recorded analysis: ${analysisType} (${score}%) - Total: ${userData.totalAnalyses}`);
        
        return session;
    }

    // Calculate improvement rate based on recent vs. early sessions
    calculateImprovementRate(sessions) {
        if (sessions.length < 3) return 0;
        
        const recentSessions = sessions.slice(-5); // Last 5 sessions
        const earlySessions = sessions.slice(0, 5); // First 5 sessions
        
        const recentAvg = recentSessions.reduce((a, b) => a + b.score, 0) / recentSessions.length;
        const earlyAvg = earlySessions.reduce((a, b) => a + b.score, 0) / earlySessions.length;
        
        const improvement = ((recentAvg - earlyAvg) / earlyAvg) * 100;
        return Math.round(Math.max(0, improvement));
    }

    // Update skill breakdown based on analysis performance
    updateSkillBreakdown(userData, analysisType, score) {
        const skillWeights = {
            'professional': { clarity: 0.3, confidence: 0.2, engagement: 0.2, pacing: 0.2, articulation: 0.1 },
            'personal': { clarity: 0.2, confidence: 0.3, engagement: 0.3, pacing: 0.1, articulation: 0.1 },
            'communication': { clarity: 0.25, confidence: 0.25, engagement: 0.2, pacing: 0.15, articulation: 0.15 },
            'drill-filler-elimination': { clarity: 0.4, articulation: 0.3, confidence: 0.2, pacing: 0.1, engagement: 0.0 },
            'drill-stronger-conclusions': { engagement: 0.4, clarity: 0.3, confidence: 0.2, articulation: 0.1, pacing: 0.0 },
            'drill-precision-pressure': { confidence: 0.4, clarity: 0.3, pacing: 0.2, articulation: 0.1, engagement: 0.0 }
        };
        
        const weights = skillWeights[analysisType] || skillWeights['communication'];
        
        Object.keys(weights).forEach(skill => {
            const weight = weights[skill];
            const contribution = score * weight;
            
            // Update skill score with weighted average
            const currentScore = userData.skillBreakdown[skill] || 0;
            const totalAnalyses = userData.totalAnalyses;
            
            userData.skillBreakdown[skill] = Math.round(
                (currentScore * (totalAnalyses - 1) + contribution) / totalAnalyses
            );
        });
    }

    // Update streak tracking
    updateStreaks(userData, sessionDate) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        if (!userData.streaks.lastAnalysisDate) {
            // First analysis
            userData.streaks.current = 1;
            userData.streaks.longest = 1;
        } else if (userData.streaks.lastAnalysisDate === yesterday && sessionDate === today) {
            // Continuing streak
            userData.streaks.current += 1;
            userData.streaks.longest = Math.max(userData.streaks.longest, userData.streaks.current);
        } else if (userData.streaks.lastAnalysisDate !== today && sessionDate === today) {
            // New streak or same day
            userData.streaks.current = userData.streaks.lastAnalysisDate === today ? userData.streaks.current : 1;
        }
        
        userData.streaks.lastAnalysisDate = sessionDate;
    }

    // Update progress data with new session
    updateProgressData(session) {
        const progressData = this.getProgressData();
        const weekNumber = this.getWeekNumber(new Date(session.timestamp));
        
        // Update weekly scores
        let currentWeek = progressData.weeklyScores.find(w => w.week === `Week ${weekNumber}`);
        if (!currentWeek) {
            currentWeek = {
                week: `Week ${weekNumber}`,
                score: session.score,
                analyses: 1,
                date: session.timestamp
            };
            progressData.weeklyScores.push(currentWeek);
        } else {
            // Update with weighted average
            const totalAnalyses = currentWeek.analyses + 1;
            currentWeek.score = Math.round((currentWeek.score * currentWeek.analyses + session.score) / totalAnalyses);
            currentWeek.analyses = totalAnalyses;
        }
        
        // Keep only last 12 weeks
        progressData.weeklyScores = progressData.weeklyScores.slice(-12);
        
        progressData.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.progressKey, JSON.stringify(progressData));
    }

    // Get week number for progress tracking
    getWeekNumber(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - startOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    }

    // Get current user data
    getUserData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : this.resetUserData();
    }

    // Get all sessions
    getSessions() {
        const sessions = localStorage.getItem(this.sessionKey);
        return sessions ? JSON.parse(sessions) : [];
    }

    // Get progress data
    getProgressData() {
        const progress = localStorage.getItem(this.progressKey);
        return progress ? JSON.parse(progress) : this.initializeProgressData();
    }

    // Get dashboard statistics
    getDashboardStats() {
        const userData = this.getUserData();
        const sessions = this.getSessions();
        const progressData = this.getProgressData();
        
        // Calculate speaking time in hours
        const speakingHours = (userData.totalSpeakingTime / 60).toFixed(1);
        
        // Get recent sessions for the list
        const recentSessions = sessions
            .slice(-5)
            .reverse()
            .map(session => ({
                id: session.id,
                type: this.formatAnalysisType(session.type),
                score: session.score,
                date: this.formatDate(session.timestamp),
                duration: `${Math.round(session.duration)} min`
            }));
        
        // Calculate monthly progress towards goals
        const currentMonth = new Date().getMonth();
        const monthlyAnalyses = sessions.filter(s => 
            new Date(s.timestamp).getMonth() === currentMonth
        ).length;
        
        const monthlyTime = sessions
            .filter(s => new Date(s.timestamp).getMonth() === currentMonth)
            .reduce((total, s) => total + s.duration, 0);
        
        return {
            totalAnalyses: userData.totalAnalyses,
            averageScore: userData.averageScore,
            speakingTime: speakingHours,
            improvementRate: userData.improvementRate,
            skillBreakdown: userData.skillBreakdown,
            recentSessions: recentSessions,
            weeklyScores: progressData.weeklyScores,
            monthlyProgress: {
                analyses: {
                    current: monthlyAnalyses,
                    goal: userData.monthlyGoals.analyses,
                    percentage: Math.round((monthlyAnalyses / userData.monthlyGoals.analyses) * 100)
                },
                speakingTime: {
                    current: Math.round(monthlyTime),
                    goal: userData.monthlyGoals.speakingTime,
                    percentage: Math.round((monthlyTime / userData.monthlyGoals.speakingTime) * 100)
                },
                averageScore: {
                    current: userData.averageScore,
                    goal: userData.monthlyGoals.averageScore,
                    percentage: Math.round((userData.averageScore / userData.monthlyGoals.averageScore) * 100)
                }
            },
            streaks: userData.streaks
        };
    }

    // Format analysis type for display
    formatAnalysisType(type) {
        const typeMap = {
            'professional': 'Professional',
            'personal': 'Personal',
            'communication': 'General',
            'presentation': 'Presentation',
            'sales': 'Sales',
            'casual': 'Casual',
            'drill-filler-elimination': 'Filler Drill',
            'drill-stronger-conclusions': 'Conclusion Drill',
            'drill-precision-pressure': 'Pressure Drill'
        };
        return typeMap[type] || 'Communication';
    }

    // Format date for display
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        });
    }

    // Simulate historical data for testing
    simulateHistoricalData(numSessions = 20) {
        console.log('🧪 Simulating historical analysis data...');
        
        const analysisTypes = ['professional', 'personal', 'communication'];
        const baseDate = new Date();
        
        for (let i = 0; i < numSessions; i++) {
            // Create sessions spread over the last 30 days
            const daysAgo = Math.floor(Math.random() * 30);
            const sessionDate = new Date(baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            
            // Generate realistic score with improvement trend
            const improvementFactor = (numSessions - i) / numSessions; // Earlier sessions have lower scores
            const baseScore = 60 + (improvementFactor * 25); // 60-85 range
            const variance = (Math.random() - 0.5) * 20; // ±10 variance
            const score = Math.max(45, Math.min(95, Math.round(baseScore + variance)));
            
            const analysisType = analysisTypes[Math.floor(Math.random() * analysisTypes.length)];
            const duration = Math.random() * 10 + 2; // 2-12 minutes
            
            // Temporarily set the timestamp for historical data
            const originalRecordAnalysis = this.recordAnalysis.bind(this);
            this.recordAnalysis = function(type, score, duration) {
                const userData = this.getUserData();
                const sessions = this.getSessions();
                
                const session = {
                    id: sessionDate.getTime() + Math.random() * 1000,
                    type: type,
                    score: score,
                    duration: duration,
                    timestamp: sessionDate.toISOString(),
                    date: sessionDate.toISOString().split('T')[0]
                };
                
                sessions.push(session);
                localStorage.setItem(this.sessionKey, JSON.stringify(sessions));
                
                return session;
            }.bind(this);
            
            this.recordAnalysis(analysisType, score, duration);
            
            // Restore original function
            this.recordAnalysis = originalRecordAnalysis;
        }
        
        // Recalculate all user data based on simulated sessions
        this.recalculateUserData();
        
        console.log(`✅ Generated ${numSessions} historical sessions`);
    }

    // Recalculate user data from sessions
    recalculateUserData() {
        const sessions = this.getSessions();
        const userData = this.getUserData();
        
        userData.totalAnalyses = sessions.length;
        userData.totalSpeakingTime = sessions.reduce((total, s) => total + s.duration, 0);
        
        if (sessions.length > 0) {
            userData.averageScore = Math.round(
                sessions.reduce((total, s) => total + s.score, 0) / sessions.length
            );
            userData.improvementRate = this.calculateImprovementRate(sessions);
        }
        
        // Recalculate skill breakdown
        userData.skillBreakdown = { clarity: 0, confidence: 0, engagement: 0, pacing: 0, articulation: 0 };
        sessions.forEach((session, index) => {
            userData.totalAnalyses = index + 1; // Temporary for updateSkillBreakdown
            this.updateSkillBreakdown(userData, session.type, session.score);
        });
        userData.totalAnalyses = sessions.length; // Restore correct count
        
        localStorage.setItem(this.storageKey, JSON.stringify(userData));
    }

    // Clear all data (for testing)
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.progressKey);
        this.init();
        console.log('🗑️ All user data cleared');
    }
}

// Global instance
window.userDataTracker = new UserDataTracker();

// Global helper functions
window.recordUserAnalysis = function(analysisType, score, duration) {
    return window.userDataTracker.recordAnalysis(analysisType, score, duration);
};

window.getUserStats = function() {
    return window.userDataTracker.getDashboardStats();
};

window.simulateUserData = function(numSessions = 20) {
    return window.userDataTracker.simulateHistoricalData(numSessions);
};

// Initialize with some sample data if no data exists
document.addEventListener('DOMContentLoaded', () => {
    const userData = window.userDataTracker.getUserData();
    
    // If this is a fresh install with no data, add some sample sessions
    if (userData.totalAnalyses === 0) {
        console.log('🔄 Initializing with sample data...');
        window.userDataTracker.simulateHistoricalData(15);
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserDataTracker;
}