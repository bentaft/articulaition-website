// Auth page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if Supabase is loaded
    console.log('Supabase available:', typeof supabase !== 'undefined');
    if (typeof supabase !== 'undefined') {
        console.log('Supabase URL:', supabaseUrl);
    } else {
        console.error('Supabase not loaded! Check script loading order.');
        // Show error message to user
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Authentication service is not available. Please refresh the page or try again later.';
            errorDiv.style.color = 'red';
            errorDiv.style.marginBottom = '1rem';
            errorDiv.style.textAlign = 'center';
            form.insertBefore(errorDiv, form.firstChild);
        });
        return;
    }
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const switchLinks = document.querySelectorAll('.switch-link');

    // Get title and subtitle elements
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');

    // Dynamic text content for different forms
    const formContent = {
        signup: {
            title: "Let's Begin the Journey.",
            subtitle: "Sign in or create your account to start improving your communication today."
        },
        login: {
            title: "Let's Continue the Journey.",
            subtitle: "Sign in or create your account to start improving your communication today."
        }
    };

    // Toggle between sign up and log in forms
    function switchForm(formType) {
        toggleBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.form === formType) {
                btn.classList.add('active');
            }
        });

        // Update form visibility
        if (formType === 'signup') {
            signupForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        } else {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        }

        // Update title with smooth animation (subtitle stays the same)
        const content = formContent[formType];
        
        // Only animate the title
        authTitle.style.opacity = '0';
        
        // Update title text after fade out and fade back in
        setTimeout(() => {
            authTitle.textContent = content.title;
            authTitle.style.opacity = '1';
        }, 200);
    }

    // Add event listeners to toggle buttons
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchForm(btn.dataset.form);
        });
    });

    // Add event listeners to switch links
    switchLinks.forEach(link => {
        link.addEventListener('click', () => {
            switchForm(link.dataset.form);
        });
    });

    // Handle form submissions
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        const submitBtn = this.querySelector('.auth-submit');

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        // Supabase signup
        if (typeof supabase !== 'undefined' && supabase.auth) {
            console.log('Attempting signup with Supabase...');
            supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: window.location.origin + '/dashboard.html'
                }
            }).then(({ data, error }) => {
                console.log('Signup response:', { data, error });
                if (error) {
                    console.error('Signup error:', error);
                    alert('Error creating account: ' + error.message);
                } else if (data.user) {
                    console.log('User created:', data.user.id);
                    if (data.user.email_confirmed_at) {
                        alert('Account created successfully! Redirecting...');
                        window.location.href = 'dashboard.html';
                    } else {
                        alert('Account created successfully! Please check your email to confirm your account.');
                        // Optionally redirect to a confirmation page
                    }
                } else {
                    console.error('Unexpected response:', data);
                    alert('An unexpected error occurred. Please try again.');
                }
            }).catch((error) => {
                console.error('Signup error:', error);
                alert('Error creating account: ' + error.message);
            }).finally(() => {
                // Reset button state
                submitBtn.textContent = 'Create My Account';
                submitBtn.disabled = false;
            });
        } else {
            // Fallback for local development
            console.log('Signup attempt:', { email, password });
            alert('Account created successfully! (Demo mode)');
            submitBtn.textContent = 'Create My Account';
            submitBtn.disabled = false;
            window.location.href = 'index.html';
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = this.querySelector('.auth-submit');

        // Show loading state
        submitBtn.textContent = 'Logging In...';
        submitBtn.disabled = true;

        // Supabase login
        if (typeof supabase !== 'undefined' && supabase.auth) {
            console.log('Attempting login with Supabase...');
            supabase.auth.signInWithPassword({
                email: email,
                password: password,
            }).then(({ data, error }) => {
                console.log('Login response:', { data, error });
                if (error) {
                    console.error('Login error:', error);
                    alert('Error logging in: ' + error.message);
                } else if (data.user && data.session) {
                    console.log('User logged in:', data.user.id);
                    window.location.href = 'dashboard.html';
                } else {
                    console.error('Login failed: No session created');
                    alert('Login failed. Please check your credentials and try again.');
                }
            }).catch((error) => {
                console.error('Login error:', error);
                alert('Error logging in: ' + error.message);
            }).finally(() => {
                // Reset button state
                submitBtn.textContent = 'Log In';
                submitBtn.disabled = false;
            });
        } else {
            // Fallback for local development
            console.log('Login attempt:', { email, password });
            submitBtn.textContent = 'Log In';
            submitBtn.disabled = false;
            window.location.href = 'dashboard.html';
        }
    });

    // Password validation for confirm password field
    const confirmPasswordField = document.getElementById('signup-confirm');
    const passwordField = document.getElementById('signup-password');

    confirmPasswordField.addEventListener('input', function() {
        if (passwordField.value !== confirmPasswordField.value) {
            confirmPasswordField.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordField.setCustomValidity('');
        }
    });

    passwordField.addEventListener('input', function() {
        if (confirmPasswordField.value && passwordField.value !== confirmPasswordField.value) {
            confirmPasswordField.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordField.setCustomValidity('');
        }
    });

    // Password reset functionality
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function() {
            const email = prompt('Please enter your email address to reset your password:');
            
            if (email) {
                if (typeof supabase !== 'undefined') {
                    supabase.auth.resetPasswordForEmail(email)
                        .then(({ error }) => {
                            if (error) {
                                console.error('Password reset error:', error);
                                alert('Error sending password reset email: ' + error.message);
                            } else {
                                alert('Password reset email sent! Please check your email for instructions.');
                            }
                        })
                        .catch((error) => {
                            console.error('Password reset error:', error);
                            alert('Error sending password reset email: ' + error.message);
                        });
                } else {
                    alert('Password reset email sent! (Demo mode)');
                }
            }
        });
    }
});