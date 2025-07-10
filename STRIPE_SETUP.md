# Stripe Integration Setup Guide

## Current Implementation Status

I've implemented a basic Stripe integration that uses Payment Links. This is the simplest approach and requires minimal backend setup.

## What's Been Done:

1. **Added Stripe.js** to the pricing page
2. **Created stripe-integration.js** with handlers for each plan button
3. **Set up redirect-based checkout** using Stripe Payment Links

## What You Need to Do:

### 1. Create Payment Links in Stripe Dashboard

Go to your Stripe Dashboard (test mode) and create Payment Links for each plan:

1. **Essential Plan ($9.99/month)**
   - Go to Payment Links section
   - Create new link
   - Select "Subscription" 
   - Set price to $9.99/month
   - Name it "Essential Plan"
   - Copy the payment link URL

2. **Max Growth Plan ($15.99/month)**
   - Create new link
   - Select "Subscription"
   - Set price to $15.99/month
   - Name it "Max Growth"
   - Copy the payment link URL

3. **One-Time Plan ($30)**
   - Create new link
   - Select "One-time"
   - Set price to $30
   - Name it "One-Time Personalized Plan"
   - Copy the payment link URL

### 2. Update the Payment Links in Code

Edit `/public/js/stripe-integration.js` and replace the placeholder URLs:

```javascript
const PAYMENT_LINKS = {
    essential: 'YOUR_ESSENTIAL_PLAN_LINK_HERE',
    maxGrowth: 'YOUR_MAX_GROWTH_LINK_HERE',
    oneTime: 'YOUR_ONE_TIME_LINK_HERE'
};
```

### 3. Configure Success/Cancel URLs in Stripe

For each payment link in Stripe:
1. Go to the payment link settings
2. Set Success URL to: `https://yourdomain.com/dashboard.html?payment=success`
3. Set Cancel URL to: `https://yourdomain.com/pricing.html?payment=cancelled`

### 4. Test the Integration

1. Click on each plan button on the pricing page
2. You should be redirected to the Stripe checkout
3. Use test card: 4242 4242 4242 4242
4. Complete the checkout
5. Verify you're redirected back to your site

## Advanced Setup (Optional)

If you want a more integrated experience with server-side handling:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Create Products and Prices in Stripe:**
   Instead of Payment Links, create Products and Price objects in Stripe, then update the server.js with the actual price IDs.

## Current Features:

- ✅ Click plan button → Redirect to Stripe checkout
- ✅ Handle successful payments
- ✅ Handle cancelled checkouts
- ✅ Show loading states
- ✅ Error handling

## Next Steps (When Ready):

1. Add webhook handling for subscription events
2. Create customer portal for subscription management
3. Add user authentication and plan tracking
4. Implement usage limits based on plans

## Testing Credit Cards:

- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Requires 3D Secure: 4000 0025 0000 3155

All test cards use any future date for expiry and any 3 digits for CVC.