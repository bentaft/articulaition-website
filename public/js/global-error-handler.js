// Global Error Handler and Site Cleanup
// This script helps catch and log JavaScript errors across the entire site

// Global error handler for uncaught exceptions
window.addEventListener('error', function(event) {
    console.error('🚨 Global JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // Don't let errors break the entire site
    return true;
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default handling (which would log to console anyway)
    event.preventDefault();
});

// DOM element safety checker
window.safeQuerySelector = function(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`⚠️ Element not found: ${selector}`);
    }
    return element;
};

// Safe element text setter
window.safeSetText = function(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    } else {
        console.warn(`⚠️ Cannot set text - element not found: ${elementId}`);
    }
};

// Safe element style setter
window.safeSetStyle = function(elementId, property, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style[property] = value;
    } else {
        console.warn(`⚠️ Cannot set style - element not found: ${elementId}`);
    }
};

// Safe class modifier
window.safeToggleClass = function(elementId, className, add = true) {
    const element = document.getElementById(elementId);
    if (element) {
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    } else {
        console.warn(`⚠️ Cannot modify class - element not found: ${elementId}`);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ Global error handler initialized');
    
    // Check for common missing elements and log warnings
    const commonElements = [
        'userGreeting',
        'selectionText', 
        'continueBtn',
        'sidebarToggle'
    ];
    
    commonElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.log(`ℹ️ Optional element not present: ${id}`);
        }
    });
    
    // Check for common CSS classes
    const commonClasses = [
        '.dashboard-sidebar',
        '.ultra-category-card',
        '.dashboard-redesigned'
    ];
    
    commonClasses.forEach(className => {
        const element = document.querySelector(className);
        if (!element) {
            console.log(`ℹ️ Optional class not present: ${className}`);
        }
    });
});

console.log('✅ Global error handler loaded');