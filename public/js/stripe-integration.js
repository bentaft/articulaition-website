// Stripe Integration for Articulaition (Backend API Version)
const STRIPE_PUBLIC_KEY = 'pk_live_51RZ09IB0Q8MkEkYkTZgCsrSl0jLjtKE34ePRQ1Rjs9ogE2yazTsYpLCfinMmyKpcmR07YYQxRZMUO0XyLjeP4eBl00zzylOvOw';

// Initialize Stripe
const stripe = Stripe(STRIPE_PUBLIC_KEY);

// API endpoint for checkout sessions
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

// Product IDs for reference
const PRODUCT_IDS = {
    oneTime: 'prod_STyIb4FcLpgIpL' // Personalized Improvement Plan
};

// Handle checkout using direct Stripe Checkout (no backend required)
async function handleCheckout(planType, planName) {
    try {
        // Show loading state
        showLoadingState(true);
        
        // Store plan info in localStorage for return tracking
        localStorage.setItem('selectedPlan', planName);
        localStorage.setItem('selectedPlanType', planType);
        
        console.log(`Creating checkout session for ${planName}...`);
        
        // Get the price ID for the plan (LIVE PRICES)
        let priceId;
        switch (planType) {
            case 'essential':
                priceId = 'price_1Ri1IzB0Q8MkEkYki9K9JR1E';
                break;
            case 'maxGrowth':
                priceId = 'price_1Ri1KoB0Q8MkEkYkYtL4mwT7';
                break;
            case 'oneTime':
                priceId = 'price_1RiEEDB0Q8MkEkYk3dLzfc2E';
                break;
            default:
                throw new Error('Invalid plan type');
        }

        console.log('Redirecting to Stripe Checkout...');
        
        // Redirect to Stripe Checkout using price ID
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{
                price: priceId,
                quantity: 1,
            }],
            mode: planType === 'oneTime' ? 'payment' : 'subscription',
            successUrl: `https://articulaition.com/dashboard.html?success=true&plan=${planType}`,
            cancelUrl: `https://articulaition.com/pricing.html?cancelled=true`,
        });

        if (error) {
            throw new Error(error.message);
        }
        
    } catch (error) {
        console.error('Checkout error:', error);
        showError(error.message || 'An error occurred during checkout. Please try again.');
    } finally {
        showLoadingState(false);
    }
}

// Handle plan button clicks
function initializePlanButtons() {
    // Essential Plan button
    const essentialBtn = document.querySelector('.plan-card:nth-child(1) .plan-cta');
    if (essentialBtn) {
        essentialBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleCheckout('essential', 'Essential Plan');
        });
    }

    // Max Growth Plan button
    const maxGrowthBtn = document.querySelector('.plan-card.popular .plan-cta');
    if (maxGrowthBtn) {
        maxGrowthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleCheckout('maxGrowth', 'Max Growth');
        });
    }

    // One-Time Plan button
    const oneTimeBtn = document.querySelector('.plan-card:nth-child(4) .plan-cta');
    if (oneTimeBtn) {
        oneTimeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleCheckout('oneTime', 'One-Time Personalized Plan');
        });
    }

    // Enterprise Plan button
    const enterpriseBtn = document.querySelector('.plan-card:nth-child(3) .plan-cta');
    if (enterpriseBtn) {
        enterpriseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'mailto:sales@articulaition.com?subject=Enterprise Plan Inquiry';
        });
    }
}

// Show loading state
function showLoadingState(show) {
    const buttons = document.querySelectorAll('.plan-cta');
    buttons.forEach(btn => {
        if (show) {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    });
}

// Show error message
function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlanButtons);
} else {
    initializePlanButtons();
}

// Handle successful checkout return
const urlParams = new URLSearchParams(window.location.search);

// Success handling for dashboard.html
if (urlParams.get('success') === 'true') {
    const sessionId = urlParams.get('session_id');
    const planType = urlParams.get('plan');
    const planName = localStorage.getItem('selectedPlan') || 'your new plan';
    
    // Show success message
    const successToast = document.createElement('div');
    successToast.className = 'success-toast';
    successToast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16.667 5L7.5 14.167 3.333 10"></path>
            </svg>
            <span>Welcome to ${planName}! Payment successful.</span>
        </div>
    `;
    successToast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(successToast);
    
    // Clear stored plan info
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedPlanType');
    
    // Log successful purchase
    console.log('✅ Purchase successful:', {
        planType,
        planName,
        sessionId
    });
    
    // Clean up URL parameters after showing success message
    setTimeout(() => {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }, 2000);
}

// Handle cancelled checkout (for pricing.html)
if (urlParams.get('cancelled') === 'true') {
    showError('Checkout was cancelled. Feel free to try again when you\'re ready.');
    
    // Clean up URL parameters
    setTimeout(() => {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }, 3000);
}