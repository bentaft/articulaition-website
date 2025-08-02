# Google OAuth Quick Setup for Articulaition

## Your Supabase Callback URL:
```
https://uxkvrwqnbyonzisvwczl.supabase.co/auth/v1/callback
```

## Step 1: Google Cloud Console (5 minutes)

### 1. Go to [Google Cloud Console](https://console.cloud.google.com/)

### 2. Create OAuth Credentials:
1. Navigate to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID**
3. If prompted, configure OAuth consent screen first:
   - Choose **External**
   - App name: **Articulaition**
   - Support email: **your-email@domain.com**
   - Save and continue through scopes

### 3. Configure OAuth Client:
- **Application type:** Web application
- **Name:** Articulaition Web Client

**Authorized JavaScript origins** (add ALL of these):
```
https://articulaition.com
https://www.articulaition.com
http://localhost:8080
http://localhost:3000
https://chimerical-marzipan-d58150.netlify.app
```

**Authorized redirect URIs** (MUST be exact):
```
https://uxkvrwqnbyonzisvwczl.supabase.co/auth/v1/callback
```

### 4. Save and Copy Credentials:
After creating, you'll get:
- **Client ID:** (looks like: 123456789-abcdefg.apps.googleusercontent.com)
- **Client Secret:** (keep this secure!)

## Step 2: Supabase Configuration (2 minutes)

### 1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/uxkvrwqnbyonzisvwczl)

### 2. Navigate to: **Authentication** > **Providers**

### 3. Find **Google** and click **Enable**

### 4. Add your credentials:
- **Client ID:** [paste from Google Console]
- **Client Secret:** [paste from Google Console]
- **Authorized Client IDs:** [same as Client ID]

### 5. Click **Save**

## Step 3: Quick Test

### Test URL:
Open this in your browser:
```
http://localhost:8080/test-google-auth.html
```

Or test directly on your login page:
```
http://localhost:8080/login.html
```

## Common Issues & Solutions:

### ❌ Error: "redirect_uri_mismatch"
**Solution:** The redirect URI must be EXACTLY:
```
https://uxkvrwqnbyonzisvwczl.supabase.co/auth/v1/callback
```
- No trailing slash
- Must be https (not http)
- Case sensitive

### ❌ Error: "Provider not found" or "Invalid provider"
**Solution:** 
1. Make sure Google is enabled in Supabase
2. Save the configuration
3. Wait 30 seconds for changes to propagate

### ❌ Error: "This app hasn't been verified"
**Solution for testing:**
1. Click "Advanced" 
2. Click "Go to Articulaition (unsafe)"
3. Or add your email as a test user in Google Console

## Verification Commands:

Open browser console and run:
```javascript
// Check if setup is working
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/dashboard.html'
  }
})
```

## Need Help?

If you see any errors:
1. Check browser console for detailed error messages
2. Verify the callback URL is exact
3. Make sure both Google Console and Supabase are saved
4. Try in incognito/private browsing mode

---

**That's it!** Once you add the credentials to both Google Console and Supabase, Google Sign-In will work immediately. 🚀