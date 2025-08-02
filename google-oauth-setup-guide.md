# Google OAuth Setup Guide for Articulaition

This guide will help you set up Google Sign-In for your Articulaition website.

## Prerequisites
- ✅ Supabase account and project (already configured)
- ✅ Google account
- ✅ Access to your domain settings

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "Articulaition Auth"

### 1.2 Enable Required APIs
1. Go to **APIs & Services > Library**
2. Search for "Google+ API" and click **Enable**
3. (Optional) Enable "Gmail API" if you want email access

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - **App name:** Articulaition
   - **User support email:** your-email@domain.com
   - **App logo:** Upload your logo
   - **App domain:** articulaition.com
   - **Developer contact:** your-email@domain.com
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Add test users (your email) if in testing mode
6. Submit for verification (required for production)

### 1.4 Create OAuth 2.0 Credentials
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set name: "Articulaition Web Client"
5. Add **Authorized JavaScript origins:**
   ```
   https://articulaition.com
   http://localhost:8080
   https://chimerical-marzipan-d58150.netlify.app
   ```
6. Add **Authorized redirect URIs:**
   ```
   https://uxkvrwqnbyonzisvwczl.supabase.co/auth/v1/callback
   ```
7. Click **Create**
8. **SAVE the Client ID and Client Secret** - you'll need these for Supabase

## Step 2: Supabase Configuration

### 2.1 Configure Google Provider
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `uxkvrwqnbyonzisvwczl`
3. Navigate to **Authentication > Providers**
4. Find **Google** and click to configure
5. Toggle **Enable sign in with Google**
6. Enter your credentials:
   - **Client ID:** (from Google Cloud Console step 1.4)
   - **Client Secret:** (from Google Cloud Console step 1.4)
7. Click **Save**

### 2.2 Update Site URL
1. In Supabase, go to **Authentication > URL Configuration**
2. Set **Site URL:** `https://articulaition.com`
3. Add **Redirect URLs:**
   ```
   https://articulaition.com/dashboard.html
   http://localhost:8080/dashboard.html
   https://chimerical-marzipan-d58150.netlify.app/dashboard.html
   ```

## Step 3: Domain Configuration

### 3.1 Update Domain Settings
Make sure your domain `articulaition.com` points to your hosting platform.

### 3.2 SSL Certificate
Ensure your domain has a valid SSL certificate (required for OAuth).

## Step 4: Testing

### 4.1 Local Testing
1. Start your local server: `python3 -m http.server 8080`
2. Open browser console on `http://localhost:8080/login.html`
3. Run: `window.googleAuthSetup.checkGoogleConfig()`
4. Click "Continue with Google" button
5. Check for any error messages

### 4.2 Production Testing
1. Deploy your site to your domain
2. Test Google sign-in on production
3. Verify redirect works correctly

## Step 5: Troubleshooting

### Common Issues

#### Error: "redirect_uri_mismatch"
- **Cause:** Redirect URI in Google Console doesn't match Supabase
- **Fix:** Ensure redirect URI is exactly: `https://uxkvrwqnbyonzisvwczl.supabase.co/auth/v1/callback`

#### Error: "Provider not found"
- **Cause:** Google provider not enabled in Supabase
- **Fix:** Go to Supabase Auth > Providers and enable Google

#### Error: "Invalid client"
- **Cause:** Wrong Client ID or Secret in Supabase
- **Fix:** Double-check credentials from Google Console

#### Error: "This app isn't verified"
- **Cause:** OAuth consent screen needs verification
- **Fix:** Add your email as test user, or submit for verification

### Debug Commands
Open browser console and run these commands to debug:

```javascript
// Check configuration
window.googleAuthSetup.getSetupStatus()

// Test Google config
window.googleAuthSetup.checkGoogleConfig()

// View current session
supabase.auth.getSession()

// View current user
supabase.auth.getUser()
```

## Step 6: Production Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created with correct redirect URIs
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Site URL and redirect URLs configured in Supabase
- [ ] Domain SSL certificate valid
- [ ] Local testing successful
- [ ] Production testing successful

## Security Notes

1. **Never expose Client Secret** in frontend code
2. **Use HTTPS only** in production
3. **Regularly rotate credentials** for security
4. **Monitor OAuth usage** in Google Console
5. **Keep Supabase project secure** with proper RLS policies

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all URLs match exactly
3. Test with incognito/private browser
4. Check Supabase logs in dashboard
5. Review Google Cloud Console quotas and limits

---

**Next Steps:** Once Google OAuth is working, you can enhance it with:
- User profile sync
- Email verification
- Multi-provider authentication
- Advanced user management