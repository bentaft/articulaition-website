const express = require('express');
const path = require('path');
require('dotenv').config();

// Initialize Stripe with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Price IDs from Stripe Dashboard
// You'll need to create prices for each product in Stripe
const PRICE_IDS = {
    essential: process.env.PRICE_ID_ESSENTIAL || 'price_essential', // $9.99/month
    maxGrowth: process.env.PRICE_ID_MAX_GROWTH || 'price_maxgrowth', // $15.99/month
    oneTime: process.env.PRICE_ID_ONE_TIME || 'price_onetime' // $30 one-time
};

// Product IDs
const PRODUCT_IDS = {
    oneTime: 'prod_STyIb4FcLpgIpL' // Your Personalized Improvement Plan
};

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { planType } = req.body;
        
        // Determine price ID and mode based on plan type
        let priceId, mode, planName;
        
        switch (planType) {
            case 'essential':
                priceId = PRICE_IDS.essential;
                mode = 'subscription';
                planName = 'Essential Plan';
                break;
            case 'maxGrowth':
                priceId = PRICE_IDS.maxGrowth;
                mode = 'subscription';
                planName = 'Max Growth';
                break;
            case 'oneTime':
                priceId = PRICE_IDS.oneTime;
                mode = 'payment';
                planName = 'One-Time Personalized Plan';
                break;
            default:
                return res.status(400).json({ error: 'Invalid plan type' });
        }

        console.log(`Creating checkout session for ${planName} with price ID: ${priceId}`);
        
        // Create the session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: mode, // 'subscription' or 'payment'
            success_url: `${req.headers.origin || 'http://localhost:3000'}/dashboard.html?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${planType}`,
            cancel_url: `${req.headers.origin || 'http://localhost:3000'}/pricing.html?cancelled=true`,
            metadata: {
                planName: planName,
                planType: planType,
                productId: planType === 'oneTime' ? PRODUCT_IDS.oneTime : ''
            },
            // Add customer email collection
            customer_email: undefined, // Can be pre-filled if user is logged in
            billing_address_collection: 'auto',
            // Add automatic tax calculation (optional)
            automatic_tax: { enabled: false },
        });

        res.json({ 
            sessionId: session.id,
            url: session.url 
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ 
            error: 'Failed to create checkout session',
            details: error.message 
        });
    }
});

// Webhook endpoint for Stripe events (raw body needed for signature verification)
app.use('/webhook', express.raw({ type: 'application/json' }));

app.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('✅ Checkout completed:', {
                    sessionId: session.id,
                    customerEmail: session.customer_email,
                    planName: session.metadata.planName,
                    planType: session.metadata.planType,
                    amountTotal: session.amount_total / 100 // Convert from cents
                });
                
                // TODO: Update user's plan in your database
                await handleSuccessfulPayment(session);
                break;
                
            case 'customer.subscription.created':
                const newSubscription = event.data.object;
                console.log('📅 New subscription created:', newSubscription.id);
                await handleNewSubscription(newSubscription);
                break;
                
            case 'customer.subscription.updated':
                const updatedSubscription = event.data.object;
                console.log('🔄 Subscription updated:', updatedSubscription.id);
                await handleSubscriptionUpdate(updatedSubscription);
                break;
                
            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object;
                console.log('❌ Subscription cancelled:', deletedSubscription.id);
                await handleSubscriptionCancellation(deletedSubscription);
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                console.log('💰 Invoice payment succeeded:', invoice.id);
                await handleInvoicePayment(invoice);
                break;

            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                console.log('⚠️ Invoice payment failed:', failedInvoice.id);
                await handleFailedPayment(failedInvoice);
                break;
                
            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Webhook handler functions
async function handleSuccessfulPayment(session) {
    // TODO: Implement user plan update logic
    console.log('Processing successful payment for:', session.customer_email);
    // Example: Update user plan in database
    // await updateUserPlan(session.customer_email, session.metadata.planType);
}

async function handleNewSubscription(subscription) {
    // TODO: Implement subscription tracking
    console.log('New subscription setup for customer:', subscription.customer);
}

async function handleSubscriptionUpdate(subscription) {
    // TODO: Handle plan changes, billing updates
    console.log('Subscription updated:', subscription.id);
}

async function handleSubscriptionCancellation(subscription) {
    // TODO: Update user access, send cancellation emails
    console.log('Subscription cancelled:', subscription.id);
}

async function handleInvoicePayment(invoice) {
    // TODO: Extend user access, send receipt
    console.log('Invoice paid:', invoice.subscription);
}

async function handleFailedPayment(invoice) {
    // TODO: Notify user, suspend access if needed
    console.log('Payment failed for subscription:', invoice.subscription);
}

// Customer portal for managing subscriptions
app.post('/api/create-portal-session', async (req, res) => {
    try {
        const { customerId } = req.body;
        
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.headers.origin}/dashboard.html`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        res.status(500).json({ error: 'Failed to create portal session' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});