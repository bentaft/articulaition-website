// Application Configuration

const config = {
    // API Configuration
    api: {
        geminiApiKey: process.env.GEMINI_API_KEY || '', // Add your Gemini API key here
        endpoints: {
            analyze: '/api/analyze',
            feedback: '/api/feedback',
            progress: '/api/progress'
        }
    },
    
    // Coaching Modes
    coachingModes: {
        casual: {
            name: 'Casual Conversations',
            icon: '💬',
            description: 'Perfect your everyday communication',
            metrics: ['pace', 'clarity', 'engagement', 'naturalness']
        },
        formal: {
            name: 'Formal Presentations',
            icon: '👔',
            description: 'Excel in professional settings',
            metrics: ['structure', 'clarity', 'confidence', 'professionalism']
        },
        sales: {
            name: 'Sales Objection Handling',
            icon: '🎯',
            description: 'Master sales conversations',
            metrics: ['persuasion', 'objection-handling', 'closing', 'rapport']
        }
    },
    
    // Audio Configuration
    audio: {
        sampleRate: 16000,
        channels: 1,
        maxDuration: 300, // 5 minutes in seconds
        format: 'wav'
    },
    
    // Analytics Configuration
    analytics: {
        trackingId: '', // Add Google Analytics ID if needed
        events: {
            startSession: 'coaching_session_start',
            endSession: 'coaching_session_end',
            viewFeedback: 'feedback_viewed'
        }
    },
    
    // Feature Flags
    features: {
        liveAnalysis: true,
        progressTracking: true,
        socialSharing: false,
        advancedMetrics: false
    },
    
    // UI Configuration
    ui: {
        animations: true,
        theme: 'light', // 'light' or 'dark'
        language: 'en'
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}