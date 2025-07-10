// Dashboard Redesign - Unique Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Initializing redesigned dashboard...');
    
    // Initialize dashboard components
    initializeAnimatedBackground();
    initializeSpeechSelector();
    // initializeQuickActions(); // DISABLED - Quick actions removed
    initializeProgressJourney();
});

// Initialize animated background with floating orbs
function initializeAnimatedBackground() {
    const dashboard = document.querySelector('.dashboard-redesigned');
    if (!dashboard) return;
    
    // Create animated background container
    const animatedBg = document.createElement('div');
    animatedBg.className = 'animated-bg';
    animatedBg.innerHTML = `
        <div class="bg-gradient-orb orb-1"></div>
        <div class="bg-gradient-orb orb-2"></div>
        <div class="bg-gradient-orb orb-3"></div>
    `;
    
    dashboard.appendChild(animatedBg);
    
    // Add parallax effect on mouse move
    dashboard.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.bg-gradient-orb');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            
            orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

// Initialize business coaching selector
function initializeSpeechSelector() {
    // This function is now handled by the main dashboard cards
    // No popup needed - selection happens directly on the dashboard cards
    setupCardSelection();
}

// Setup category and card selection
function setupCardSelection() {
    setupCategoryTabs();
    setupSpeechCards();
}

// Handle category card navigation
function setupCategoryTabs() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    console.log('Setting up category cards:', categoryCards.length);
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            console.log('Category clicked:', category);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Navigate to category-specific page
            setTimeout(() => {
                if (category === 'business') {
                    window.location.href = 'business-communication.html';
                } else if (category === 'personal') {
                    window.location.href = 'personal-communication.html';
                }
            }, 200);
        });
    });
}

// Handle speech card selection
function setupSpeechCards() {
    const cards = document.querySelectorAll('.speech-card');
    const continueBtn = document.getElementById('continueBtn');
    const selectedType = document.getElementById('selectedType');
    const actionFooter = document.getElementById('actionFooter');
    let currentSelection = null;
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected state from all cards
            cards.forEach(c => c.classList.remove('selected'));
            
            // Add selected state to clicked card
            this.classList.add('selected');
            currentSelection = this.dataset.type;
            
            // Update UI
            if (selectedType) {
                const cardTitle = this.querySelector('h3').textContent;
                selectedType.textContent = cardTitle;
            }
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.disabled = false;
                continueBtn.classList.add('enabled');
            }
            
            // Show action footer
            actionFooter.style.display = 'flex';
            
            // Add selection feedback
            this.style.transform = 'scale(0.97)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Handle continue button click
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (currentSelection) {
                // Add loading state
                this.classList.add('loading');
                this.textContent = 'Starting...';
                
                // Store selection
                localStorage.setItem('selected_speech_type', currentSelection);
                
                // Navigate to upload page
                setTimeout(() => {
                    window.location.href = 'upload.html';
                }, 600);
            }
        });
    }
}

// Reset selection state
function resetSelection() {
    const cards = document.querySelectorAll('.speech-card');
    const continueBtn = document.getElementById('continueBtn');
    const actionFooter = document.getElementById('actionFooter');
    
    // Clear card selections
    cards.forEach(card => card.classList.remove('selected'));
    
    // Disable continue button
    if (continueBtn) {
        continueBtn.disabled = true;
        continueBtn.classList.remove('enabled');
        continueBtn.textContent = 'Start Analysis Session';
    }
    
    // Hide action footer
    actionFooter.style.display = 'none';
}

// Create ripple effect on selection
function createSelectionRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: ripple-expand 1s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.appendChild(ripple);
    
    // Remove after animation
    setTimeout(() => ripple.remove(), 1000);
}

// Initialize quick actions floating menu
function initializeQuickActions() {
    // DISABLED: Quick actions completely removed for clean dashboard experience
    return;
}

// Handle quick actions
function handleQuickAction(action) {
    console.log('⚡ Quick action:', action);
    
    switch(action) {
        case 'record':
            // Quick record with default settings
            localStorage.setItem('selected_speech_type', 'presentations');
            window.location.href = 'upload.html?mode=record';
            break;
        case 'upload':
            window.location.href = 'upload.html';
            break;
        case 'history':
            window.location.href = 'history.html';
            break;
        case 'tips':
            showSpeechTips();
            break;
    }
}

// Initialize progress journey visualization
function initializeProgressJourney() {
    const journeySection = document.createElement('section');
    journeySection.className = 'progress-journey';
    journeySection.innerHTML = `
        <h2 style="text-align: center; color: white; font-size: 2.5rem; margin-bottom: 3rem;">Your Communication Journey</h2>
        <div class="journey-path">
            <div class="journey-line">
                <div class="journey-progress" style="width: 35%;"></div>
            </div>
            
            <div class="journey-milestone completed" data-milestone="start">
                <div class="milestone-dot">🚀</div>
                <div class="milestone-label">Started Journey</div>
            </div>
            
            <div class="journey-milestone completed" data-milestone="first-analysis">
                <div class="milestone-dot">📊</div>
                <div class="milestone-label">First Analysis</div>
            </div>
            
            <div class="journey-milestone" data-milestone="improvement">
                <div class="milestone-dot">📈</div>
                <div class="milestone-label">10% Improvement</div>
            </div>
            
            <div class="journey-milestone" data-milestone="consistency">
                <div class="milestone-dot">🎯</div>
                <div class="milestone-label">Weekly Streak</div>
            </div>
            
            <div class="journey-milestone" data-milestone="mastery">
                <div class="milestone-dot">🏆</div>
                <div class="milestone-label">Communication Master</div>
            </div>
        </div>
    `;
    
    // Insert after hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.after(journeySection);
    }
    
    // Add milestone interactions
    const milestones = journeySection.querySelectorAll('.journey-milestone');
    milestones.forEach(milestone => {
        milestone.addEventListener('click', function() {
            showMilestoneDetails(this.dataset.milestone);
        });
    });
}


// Show milestone details
function showMilestoneDetails(milestone) {
    console.log('🏆 Showing milestone details:', milestone);
    // Could show a modal with achievement details
}

// Show speech tips
function showSpeechTips() {
    console.log('💡 Showing speech tips');
    // Could show a tips modal or navigate to tips page
}

// Play hover sound (optional)
function playHoverSound() {
    // Optional: Add subtle hover sound
    // const audio = new Audio('sounds/hover.mp3');
    // audio.volume = 0.1;
    // audio.play();
}

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes ripple-expand {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);