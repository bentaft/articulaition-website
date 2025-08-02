// Google OAuth Configuration Helper
// This script helps set up and test Google authentication

class GoogleAuthSetup {
    constructor() {
        this.config = {
            supabaseUrl: 'https://uxkvrwqnbyonzisvwczl.supabase.co',
            redirectUrl: window.location.origin + '/dashboard.html',
            testMode: window.location.hostname === 'localhost'
        };
        this.init();
    }

    init() {
        console.log('🔐 Google Auth Setup initialized');
        console.log('📍 Current domain:', window.location.hostname);
        console.log('🔗 Redirect URL:', this.config.redirectUrl);
        
        // Add setup instructions to the page
        this.addSetupInstructions();
        
        // Test current configuration
        this.testConfiguration();
    }

    addSetupInstructions() {
        // Only show instructions in development
        if (this.config.testMode) {
            const instructions = this.createInstructionsElement();
            document.body.appendChild(instructions);
        }
    }

    createInstructionsElement() {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #1f2937;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            max-width: 300px;
            font-size: 12px;
            z-index: 10000;
            font-family: monospace;
        `;
        
        div.innerHTML = `
            <h4 style="margin: 0 0 0.5rem 0; color: #fbbf24;">🔧 Google OAuth Setup</h4>
            <p style="margin: 0 0 0.5rem 0;"><strong>1. Google Cloud Console:</strong></p>
            <p style="margin: 0 0 0.5rem 0; font-size: 10px;">
                - Enable Google+ API<br>
                - Create OAuth 2.0 Client<br>
                - Add redirect URI:<br>
                <code style="background: #374151; padding: 2px;">https://uxkvrwqnbyonzisvwczl.supabase.co/auth/v1/callback</code>
            </p>
            <p style="margin: 0 0 0.5rem 0;"><strong>2. Supabase Dashboard:</strong></p>
            <p style="margin: 0 0 0.5rem 0; font-size: 10px;">
                - Go to Auth > Providers > Google<br>
                - Enable and add Client ID/Secret
            </p>
            <button onclick="this.parentElement.style.display='none'" style="
                background: #ef4444; 
                color: white; 
                border: none; 
                padding: 4px 8px; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 10px;
            ">Close</button>
        `;
        
        return div;
    }

    async testConfiguration() {
        console.log('🧪 Testing Google OAuth configuration...');
        
        // Check if Supabase is available
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase client not available');
            return;
        }

        try {
            // Test if we can get the current session
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('❌ Session check failed:', error.message);
            } else if (session) {
                console.log('✅ User is already logged in:', session.user.email);
                console.log('🔑 Provider:', session.user.app_metadata.provider);
            } else {
                console.log('ℹ️ No active session found');
            }

            // Test configuration
            const { data, error: configError } = await supabase.auth.getUser();
            if (configError && configError.message !== 'No user found') {
                console.warn('⚠️ Auth configuration issue:', configError.message);
            } else {
                console.log('✅ Supabase auth is properly configured');
            }

        } catch (error) {
            console.error('❌ Configuration test failed:', error);
        }
    }

    // Enhanced Google sign-in with better error handling
    async signInWithGoogle() {
        console.log('🚀 Initiating Google sign-in...');
        
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase client not available');
        }

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: this.config.redirectUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                console.error('❌ Google sign-in error:', error);
                throw error;
            }

            console.log('✅ Google sign-in initiated successfully');
            return data;

        } catch (error) {
            console.error('❌ Google sign-in failed:', error);
            
            // Provide helpful error messages
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Google OAuth is not properly configured in Supabase. Please check your provider settings.');
            } else if (error.message.includes('redirect_uri_mismatch')) {
                throw new Error('Redirect URI mismatch. Please check your Google Cloud Console settings.');
            } else {
                throw error;
            }
        }
    }

    // Check if Google OAuth is properly configured
    async checkGoogleConfig() {
        console.log('🔍 Checking Google OAuth configuration...');
        
        try {
            // Try to initiate OAuth flow (this will fail if not configured)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: this.config.redirectUrl,
                    // Add a test parameter to identify this as a config check
                    queryParams: {
                        test: 'config_check'
                    }
                }
            });

            if (error) {
                if (error.message.includes('Provider not found')) {
                    console.error('❌ Google provider not enabled in Supabase');
                    return false;
                } else if (error.message.includes('Invalid client')) {
                    console.error('❌ Invalid Google OAuth client configuration');
                    return false;
                }
            }

            console.log('✅ Google OAuth appears to be configured');
            return true;

        } catch (error) {
            console.error('❌ Google OAuth configuration check failed:', error);
            return false;
        }
    }

    // Get setup status
    getSetupStatus() {
        return {
            domain: window.location.hostname,
            supabaseUrl: this.config.supabaseUrl,
            redirectUrl: this.config.redirectUrl,
            isLocalhost: this.config.testMode,
            requiredRedirectUri: `${this.config.supabaseUrl}/auth/v1/callback`,
            setupComplete: false // Will be updated by checkGoogleConfig
        };
    }

    // Generate setup instructions
    generateSetupInstructions() {
        const status = this.getSetupStatus();
        
        return {
            googleCloudConsole: {
                step: 1,
                title: "Google Cloud Console Setup",
                tasks: [
                    "1. Go to https://console.cloud.google.com/",
                    "2. Create or select a project",
                    "3. Enable Google+ API in APIs & Services > Library",
                    "4. Create OAuth 2.0 Client ID in APIs & Services > Credentials",
                    "5. Add Authorized JavaScript origins:",
                    `   - ${window.location.origin}`,
                    "6. Add Authorized redirect URIs:",
                    `   - ${status.requiredRedirectUri}`
                ]
            },
            supabaseConfig: {
                step: 2,
                title: "Supabase Configuration",
                tasks: [
                    "1. Go to your Supabase dashboard",
                    "2. Navigate to Authentication > Providers",
                    "3. Find Google and click to configure",
                    "4. Enable the Google provider",
                    "5. Add your Google Client ID and Client Secret",
                    "6. Save the configuration"
                ]
            },
            testing: {
                step: 3,
                title: "Testing",
                tasks: [
                    "1. Open browser console",
                    "2. Call window.googleAuthSetup.checkGoogleConfig()",
                    "3. Test sign-in flow",
                    "4. Verify redirect works correctly"
                ]
            }
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.googleAuthSetup = new GoogleAuthSetup();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleAuthSetup;
}