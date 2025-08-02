// Achievement Integration Helper Functions
// This file provides helper functions to integrate achievements with analysis workflows

class AchievementIntegration {
    constructor() {
        this.analysisTypeMap = {
            'professional': ['presentation', 'leadership', 'negotiation', 'sales', 'client-calls'],
            'personal': ['casual', 'dating', 'storytelling', 'conflict-resolution'],
            'communication': ['speech', 'general', 'basic']
        };
    }

    // Helper function to record analysis completion from any page
    recordAnalysisCompletion(analysisPage, score = null) {
        // Determine analysis type from page name
        const analysisType = this.getAnalysisTypeFromPage(analysisPage);
        
        // Generate realistic score if none provided
        const finalScore = score || this.generateRealisticScore();
        
        console.log(`Recording analysis completion: ${analysisType} with score ${finalScore}%`);
        
        // Record in user data tracker first
        if (window.userDataTracker) {
            const duration = Math.random() * 8 + 2; // 2-10 minutes
            window.userDataTracker.recordAnalysis(analysisType, finalScore, duration);
        }
        
        // Trigger achievement tracking
        if (window.achievementTracker) {
            window.achievementTracker.recordAnalysis(analysisType, finalScore);
        } else {
            // Queue the event for when achievement tracker loads
            setTimeout(() => {
                if (window.achievementTracker) {
                    window.achievementTracker.recordAnalysis(analysisType, finalScore);
                }
            }, 1000);
        }
        
        // Dispatch custom event for other listeners
        const event = new CustomEvent('analysisCompleted', {
            detail: {
                analysisType: analysisType,
                analysisPage: analysisPage,
                score: finalScore,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
        
        return {
            analysisType,
            score: finalScore
        };
    }

    // Determine analysis type from page name
    getAnalysisTypeFromPage(pageName) {
        // Remove common suffixes and normalize
        const cleanName = pageName
            .replace(/-(analysis|upload|practice|results?)\.html?/g, '')
            .replace(/\.html?/g, '')
            .toLowerCase();
        
        // Check each category
        for (const [category, types] of Object.entries(this.analysisTypeMap)) {
            if (types.some(type => cleanName.includes(type) || type.includes(cleanName))) {
                return category;
            }
        }
        
        // Special cases
        if (cleanName.includes('professional') || cleanName.includes('business')) {
            return 'professional';
        }
        if (cleanName.includes('personal') || cleanName.includes('casual')) {
            return 'personal';
        }
        
        // Default
        return 'communication';
    }

    // Generate realistic score based on normal distribution around 70%
    generateRealisticScore() {
        // Use Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Mean of 72, standard deviation of 12
        const score = Math.round(72 + z0 * 12);
        
        // Clamp between 45 and 95 for realism
        return Math.max(45, Math.min(95, score));
    }

    // Simulate analysis completion for testing
    simulateAnalysisCompletion(analysisType = 'professional', score = null) {
        const testScore = score || this.generateRealisticScore();
        console.log(`🧪 Simulating ${analysisType} analysis with score: ${testScore}%`);
        
        if (window.achievementTracker) {
            window.achievementTracker.recordAnalysis(analysisType, testScore);
        }
        
        return { analysisType, score: testScore };
    }

    // Add achievement tracking to existing analysis functions
    enhanceAnalysisFunction(originalFunction, analysisType) {
        return async function(...args) {
            try {
                // Call original function
                const result = await originalFunction.apply(this, args);
                
                // Record achievement
                if (result && typeof result === 'object') {
                    const score = result.overallScore || result.score || 
                                result.confidence || this.generateRealisticScore();
                    this.recordAnalysisCompletion(analysisType, score);
                }
                
                return result;
            } catch (error) {
                console.error('Error in enhanced analysis function:', error);
                throw error;
            }
        }.bind(this);
    }

    // Initialize achievement tracking on analysis pages
    initializeForAnalysisPage() {
        // Detect current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Add achievement tracking script if not already loaded
        if (!document.querySelector('script[src*="achievement-tracker.js"]')) {
            const script = document.createElement('script');
            script.src = 'js/achievement-tracker.js';
            script.onload = () => {
                console.log('Achievement tracker loaded for analysis page');
            };
            document.head.appendChild(script);
        }
        
        // Add integration script
        if (!document.querySelector('script[src*="achievement-integration.js"]')) {
            const integrationScript = document.createElement('script');
            integrationScript.src = 'js/achievement-integration.js';
            document.head.appendChild(integrationScript);
        }
        
        // Set up automatic tracking for common analysis completion patterns
        this.setupAutomaticTracking(currentPage);
    }

    // Set up automatic tracking for common patterns
    setupAutomaticTracking(currentPage) {
        // Track when results are displayed
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Look for result containers being added
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList?.contains('results-container') ||
                                node.classList?.contains('analysis-results') ||
                                node.querySelector?.('.results-container, .analysis-results')) {
                                
                                // Results displayed, record completion
                                setTimeout(() => {
                                    this.recordAnalysisCompletion(currentPage);
                                }, 1000);
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Track button clicks that might complete analysis
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (button && (
                button.textContent.toLowerCase().includes('analyze') ||
                button.textContent.toLowerCase().includes('submit') ||
                button.classList.contains('analyze-btn') ||
                button.classList.contains('submit-btn')
            )) {
                // Delay to allow analysis to complete
                setTimeout(() => {
                    this.recordAnalysisCompletion(currentPage);
                }, 3000);
            }
        });
    }
}

// Global helper functions
window.recordAnalysisAchievement = function(analysisType, score) {
    const integration = new AchievementIntegration();
    return integration.recordAnalysisCompletion(analysisType, score);
};

window.simulateAchievement = function(analysisType = 'professional', score = null) {
    const integration = new AchievementIntegration();
    return integration.simulateAnalysisCompletion(analysisType, score);
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const integration = new AchievementIntegration();
    
    // Only initialize automatic tracking on analysis pages
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage.includes('analysis') || 
        currentPage.includes('upload') || 
        currentPage.includes('practice')) {
        integration.initializeForAnalysisPage();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementIntegration;
}