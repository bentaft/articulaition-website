# Stripe Backend Integration Setup Guide

## What's Been Implemented

I've created a full backend Stripe integration with the following features:

### ✅ Backend Server (server.js)
- Express.js server with Stripe SDK
- Checkout session creation API
- Comprehensive webhook handling
- Customer portal sessions
- Proper error handling and logging
- Environment variable configuration

### ✅ Frontend Integration (js/stripe-integration.js)
- Button handlers for all plans
- API calls to backend endpoints
- Loading states and error handling
- Success/cancel flow handling
- Clean URL management

### ✅ Configuration Files
- `.env` file for environment variables
- Updated `package.json` with all dependencies
- Proper CORS and security headers

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file with your actual Stripe keys:

```env
# Get these from your Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Create these products and prices in Stripe Dashboard
PRICE_ID_ESSENTIAL=price_YOUR_ESSENTIAL_PRICE_ID    # $9.99/month
PRICE_ID_MAX_GROWTH=price_YOUR_MAX_GROWTH_PRICE_ID  # $15.99/month  
PRICE_ID_ONE_TIME=price_YOUR_ONE_TIME_PRICE_ID      # $30 one-time

PORT=3000
NODE_ENV=development
```

### 3. Create Products and Prices in Stripe

Since you have the product ID `prod_STyIb4FcLpgIpL` for the Personalized Improvement Plan:

#### For the One-Time Plan:
1. Go to Products in your Stripe Dashboard
2. Find product `prod_STyIb4FcLpgIpL`
3. Add a price of $30.00 (one-time)
4. Copy the price ID (starts with `price_`)

#### For Essential Plan ($9.99/month):
1. Create new product: "Essential Plan"
2. Add recurring price: $9.99/month
3. Copy the price ID

#### For Max Growth Plan ($15.99/month):
1. Create new product: "Max Growth Plan"  
2. Add recurring price: $15.99/month
3. Copy the price ID

### 4. Set Up Webhooks

1. Go to Webhooks in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`  
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret

### 5. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 6. Test the Integration

1. Visit `http://localhost:3000/pricing.html`
2. Click any plan button
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify webhook events in Stripe Dashboard

## Current Flow

### Payment Process:
1. User clicks plan button on pricing page
2. Frontend calls `/api/create-checkout-session`
3. Server creates Stripe checkout session
4. User redirected to Stripe checkout
5. After payment, user returns to dashboard with success message
6. Webhook notifies server of payment completion

### Plan Types Supported:
- **Essential Plan**: `essential` → Subscription ($9.99/month)
- **Max Growth**: `maxGrowth` → Subscription ($15.99/month)  
- **One-Time Plan**: `oneTime` → One-time payment ($30) using `prod_STyIb4FcLpgIpL`
- **Enterprise**: Redirects to email contact

## Security Features

- ✅ Webhook signature verification
- ✅ CORS headers configured  
- ✅ Environment variable protection
- ✅ Input validation
- ✅ Error logging
- ✅ SSL/HTTPS support ready

## Next Steps (Optional)

1. **User Management**: Add user authentication and plan tracking
2. **Database Integration**: Store customer data and subscription status
3. **Customer Portal**: Enable subscription management
4. **Usage Limits**: Implement plan-based feature restrictions  
5. **Email Notifications**: Send receipts and updates
6. **Analytics**: Track conversion and churn metrics

## Testing Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002  
- **3D Secure**: 4000 0025 0000 3155
- **Insufficient Funds**: 4000 0000 0000 9995

## Webhook Events

The server handles these Stripe events:
- Payment completions
- Subscription lifecycle (created, updated, deleted)
- Invoice payments (success/failure)
- All events are logged with detailed information

## Troubleshooting

- Check server logs for detailed error messages
- Verify webhook endpoint is accessible
- Ensure price IDs match your Stripe Dashboard
- Test with Stripe CLI for local webhook testing:
  ```bash
  stripe listen --forward-to localhost:3000/webhook
  ```