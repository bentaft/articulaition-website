// Personal Categories - Navigation & Routing

document.addEventListener('DOMContentLoaded', function() {
    console.log('💬 Initializing personal categories...');
    
    initializeCategoryCards();
    loadUserInfo();
});

// Initialize category card interactions
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        // Add click handler for navigation
        card.addEventListener('click', function() {
            const type = this.dataset.type;
            handleCategorySelection(type, this);
        });
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const type = this.dataset.type;
                handleCategorySelection(type, this);
            }
        });
        
        // Add touch support for mobile
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Handle category selection and routing
function handleCategorySelection(type, element) {
    console.log('💬 Navigating to personal category:', type);
    
    // Add loading state
    element.classList.add('loading');
    
    // Store selection for analytics/tracking
    localStorage.setItem('selected_category', 'personal');
    localStorage.setItem('selected_subcategory', type);
    localStorage.setItem('selection_timestamp', Date.now());
    
    // Create visual feedback
    createSelectionRipple(element);
    
    // Navigate after brief delay for animation
    setTimeout(() => {
        // Route to specific analysis pages based on type
        const analysisPages = {
            'casual-conversation': 'casual-conversation-analysis.html',
            'deep-conversation': 'deep-conversation-analysis.html',
            'storytelling': 'storytelling-analysis.html',
            'conflict-resolution': 'conflict-resolution-analysis.html',
            'dating-conversation': 'dating-conversation-analysis.html'
        };
        
        const targetPage = analysisPages[type] || 'analysis.html';
        const analysisUrl = `${targetPage}?category=personal&type=${type}`;
        window.location.href = analysisUrl;
    }, 300);
}

// Create ripple effect on selection
function createSelectionRipple(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: ${size}px;
        height: ${size}px;
        margin-left: -${size / 2}px;
        margin-top: -${size / 2}px;
        background: radial-gradient(circle, rgba(240, 147, 251, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-expand 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Load user information
function loadUserInfo() {
    try {
        const userData = localStorage.getItem('supabase_user');
        if (userData) {
            const user = JSON.parse(userData);
            const email = user.email || 'User';
            const firstName = email.split('@')[0];
            const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
            
            // Update user display elements
            const userInitial = document.getElementById('userInitial');
            const sidebarUsername = document.getElementById('sidebarUsername');
            
            if (userInitial) {
                userInitial.textContent = capitalizedName.charAt(0).toUpperCase();
            }
            
            if (sidebarUsername) {
                sidebarUsername.textContent = capitalizedName;
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Handle logout
document.addEventListener('click', function(e) {
    if (e.target.id === 'logoutBtn') {
        e.preventDefault();
        
        // Clear user data
        localStorage.removeItem('supabase_user');
        localStorage.removeItem('selected_category');
        localStorage.removeItem('selected_subcategory');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-expand {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    /* Smooth scroll behavior */
    html {
        scroll-behavior: smooth;
    }
    
    /* Focus styles for accessibility */
    .category-card:focus-visible {
        outline: 3px solid #f093fb;
        outline-offset: 2px;
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .category-card,
        .arrow-icon,
        .category-icon,
        .back-link svg {
            transition: none;
        }
        
        @keyframes ripple-expand {
            from, to {
                transform: scale(0);
                opacity: 0;
            }
        }
    }
`;
document.head.appendChild(style);

// Navigation helper functions
window.personalCategories = {
    // Navigate back to dashboard
    goToDashboard: function() {
        window.location.href = 'dashboard.html';
    },
    
    // Navigate to specific analysis type
    startAnalysis: function(type) {
        const analysisPages = {
            'casual-conversation': 'casual-conversation-analysis.html',
            'deep-conversation': 'deep-conversation-analysis.html',
            'storytelling': 'storytelling-analysis.html',
            'conflict-resolution': 'conflict-resolution-analysis.html',
            'dating-conversation': 'dating-conversation-analysis.html'
        };
        
        const targetPage = analysisPages[type] || 'analysis.html';
        const analysisUrl = `${targetPage}?category=personal&type=${type}`;
        window.location.href = analysisUrl;
    },
    
    // Get current selection from URL or storage
    getCurrentSelection: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            category: urlParams.get('category') || localStorage.getItem('selected_category'),
            type: urlParams.get('type') || localStorage.getItem('selected_subcategory')
        };
    }
};