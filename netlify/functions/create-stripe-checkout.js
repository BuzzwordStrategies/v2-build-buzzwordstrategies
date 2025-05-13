// netlify/functions/create-stripe-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

exports.handler = async (event) => {
  console.log('Starting create-stripe-checkout handler');
  console.log('Environment check - STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  console.log('Environment check - SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
  console.log('Environment check - SUPABASE_SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_KEY);
  
  try {
    // Get parameters from query string directly
    const params = event.queryStringParameters || {};
    const { bundleID, bundleName, finalMonthly, subLength, selectedServices } = params;
    
    console.log('Received parameters:', JSON.stringify(params, null, 2));
    
    if (!bundleID || !finalMonthly || !subLength) {
      console.error('Missing required parameters');
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required parameters', 
          received: params 
        })
      };
    }
    
    // Validate inputs
    const monthlyAmount = parseFloat(finalMonthly);
    const subscriptionLength = parseInt(subLength);
    
    if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
      console.error('Invalid amount:', finalMonthly);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }
    
    if (isNaN(subscriptionLength) || subscriptionLength <= 0) {
      console.error('Invalid subscription length:', subLength);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid subscription length' })
      };
    }
    
    console.log('Creating Stripe checkout session...');
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${bundleName || 'Marketing Bundle'} - ${subscriptionLength} month subscription`,
              description: selectedServices || 'Marketing services'
            },
            unit_amount: Math.round(monthlyAmount * 100), // Convert to cents
            recurring: {
              interval: 'month',
              interval_count: 1, // Bill monthly
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://ephemeral-moonbeam-0a8703.netlify.app/success?session_id={CHECKOUT_SESSION_ID}&bundle_id=${bundleID}`,
      cancel_url: 'https://ephemeral-moonbeam-0a8703.netlify.app/cancel',
      metadata: {
        bundle_id: bundleID,
        subscription_length: subscriptionLength,
      },
    });

    console.log('Stripe session created:', session.id);
    
    // Save the Stripe session ID to Supabase
    await updateSupabaseWithStripeSession(bundleID, session.id);

    // Redirect directly to Stripe
    console.log('Redirecting to Stripe URL:', session.url);
    
    return {
      statusCode: 303,
      headers: {
        Location: session.url,
      },
      body: '',
    };
    
  } catch (error) {
    console.error('Error in create-stripe-checkout:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data || error.stack,
        type: error.type || 'unknown'
      })
    };
  }
};

async function updateSupabaseWithStripeSession(bundleID, sessionId) {
  console.log('Starting updateSupabaseWithStripeSession function');
  
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn('Supabase credentials not found, skipping database update');
      return { status: 'skipped', reason: 'missing_credentials' };
    }
    
    console.log(`Updating Supabase for bundle_id: ${bundleID} with session: ${sessionId}`);
    
    const updateData = {
      stripe_session_id: sessionId,
      status: 'payment_pending',
      updated_at: new Date().toISOString()
    };
    
    console.log('Update data:', JSON.stringify(updateData, null, 2));
    console.log('Supabase URL:', SUPABASE_URL);
    
    const response = await axios.patch(
      `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${bundleID}`,
      updateData,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      }
    );
    
    console.log('Supabase update completed with status:', response.status);
    return { status: 'success' };
    
  } catch (error) {
    console.error('Error updating Supabase with Stripe session ID:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error message:', error.message);
    
    // Don't throw, just log the error since we want to continue to Stripe regardless
    return { 
      status: 'error', 
      message: error.message,
      response: error.response?.data
    };
  }
}
