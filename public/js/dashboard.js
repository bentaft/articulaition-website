// Speech Analysis Dashboard functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    await checkAuthentication();
    
    // Load user data and personalize experience
    loadUserData();
    
    // Set up event listeners for speech analysis
    setupSpeechAnalysisListeners();
    
    // Set up logout listener
    setupLogoutListener();
});

async function checkAuthentication() {
    if (typeof supabase !== 'undefined') {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Error checking session:', error);
                redirectToAuth();
                return;
            }
            
            if (!session) {
                // No active session, redirect to auth
                redirectToAuth();
                return;
            }
            
            // User is authenticated, store session data
            localStorage.setItem('supabase_user', JSON.stringify(session.user));
            
        } catch (error) {
            console.error('Error during authentication check:', error);
            redirectToAuth();
        }
    } else {
        // Fallback check for demo mode
        const user = localStorage.getItem('supabase_user');
        if (!user) {
            redirectToAuth();
        }
    }
}

function redirectToAuth() {
    alert('Please log in to access the dashboard.');
    window.location.href = 'auth.html';
}

function setupSpeechAnalysisListeners() {
    const speechCards = document.querySelectorAll('.speech-card');
    const continueBtn = document.getElementById('continueBtn');
    const continueSection = document.getElementById('continueSection');
    const selectionText = document.getElementById('selectionText');
    
    let selectedType = null;
    
    // Handle speech card selection
    speechCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            speechCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Get the selected type
            selectedType = this.dataset.type;
            
            // Update UI
            updateSelectionUI(selectedType);
            
            // Show continue section with animation
            continueSection.classList.add('visible');
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-4px) scale(1.01)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = '';
            }
        });
    });
    
    // Handle continue button
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (selectedType) {
                handleContinue(selectedType);
            } else {
                alert('Please select a communication style first.');
            }
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && continueSection.classList.contains('visible')) {
            continueBtn.click();
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            
            const currentSelected = document.querySelector('.speech-card.selected');
            let currentIndex = currentSelected ? Array.from(speechCards).indexOf(currentSelected) : -1;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : speechCards.length - 1;
            } else {
                currentIndex = currentIndex < speechCards.length - 1 ? currentIndex + 1 : 0;
            }
            
            speechCards[currentIndex].click();
        }
    });
}

function setupLogoutListener() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function loadUserData() {
    const userGreeting = document.getElementById('userGreeting');
    
    // Check if element exists before trying to modify it
    if (!userGreeting) {
        console.log('userGreeting element not found, skipping user data load');
        return;
    }
    
    try {
        const userData = localStorage.getItem('supabase_user');
        if (userData) {
            const user = JSON.parse(userData);
            const email = user.email || 'User';
            const firstName = email.split('@')[0];
            const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
            userGreeting.textContent = `Welcome back, ${capitalizedName}!`;
        } else {
            userGreeting.textContent = 'Welcome to Articulaition!';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        if (userGreeting) {
            userGreeting.textContent = 'Welcome to Articulaition!';
        }
    }
}

function updateSelectionUI(type) {
    const selectionText = document.getElementById('selectionText');
    const continueBtn = document.getElementById('continueBtn');
    
    // Check if elements exist
    if (!selectionText || !continueBtn) {
        console.log('Selection UI elements not found, skipping update');
        return;
    }
    
    const typeNames = {
        'casual': 'Casual / Friendly Conversation',
        'formal': 'Formal / Business Communication',
        'sales': 'Live Objection Handling (Sales)'
    };
    
    selectionText.textContent = `Perfect! You've chosen ${typeNames[type]} analysis.`;
    selectionText.classList.add('selected');
    
    // Add visual feedback to button
    continueBtn.style.background = 'var(--gradient-accent)';
    continueBtn.style.transform = 'scale(1.02)';
    
    // Store selection in localStorage for next page
    localStorage.setItem('selected_speech_type', type);
}

function handleContinue(type) {
    // Show loading state
    const continueBtn = document.getElementById('continueBtn');
    const originalText = continueBtn.textContent;
    
    continueBtn.textContent = 'Preparing Analysis...';
    continueBtn.disabled = true;
    
    // Simulate processing time for better UX
    setTimeout(() => {
        // Store the selection and navigate to next page
        localStorage.setItem('selected_speech_type', type);
        
        // Navigate to upload page
        window.location.href = 'upload.html';
        
    }, 1500);
}

async function handleLogout() {
    if (typeof supabase !== 'undefined') {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('Error logging out:', error);
                alert('Error logging out: ' + error.message);
                return;
            }
            
            // Clear local storage
            localStorage.removeItem('supabase_user');
            
            // Redirect to home page
            alert('Logged out successfully!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Error logging out. Please try again.');
        }
    } else {
        // Fallback for demo mode
        localStorage.removeItem('supabase_user');
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    }
}

// Listen for auth state changes
if (typeof supabase !== 'undefined') {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_OUT' || !session) {
            localStorage.removeItem('supabase_user');
            window.location.href = 'login.html';
        } else if (event === 'SIGNED_IN' && session) {
            localStorage.setItem('supabase_user', JSON.stringify(session.user));
            loadUserData();
        }
    });
}