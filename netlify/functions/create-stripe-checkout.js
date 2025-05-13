// netlify/functions/create-stripe-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

exports.handler = async (event) => {
  // Get parameters from query string directly
  const params = event.queryStringParameters || {};
  const { bundleID, bundleName, finalMonthly, subLength, selectedServices } = params;
  
  try {
    // Create a simple Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${bundleName || 'Marketing Bundle'} - ${subLength} month subscription`,
              description: selectedServices || 'Marketing services'
            },
            unit_amount: Math.round(parseFloat(finalMonthly) * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://ephemeral-moonbeam-0a8703.netlify.app/success?session_id={CHECKOUT_SESSION_ID}&bundle_id=${bundleID}`,
      cancel_url: 'https://ephemeral-moonbeam-0a8703.netlify.app/cancel',
    });

    // Save the Stripe session ID to Supabase
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
      
      if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
        await axios.patch(
          `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${bundleID}`,
          {
            stripe_session_id: session.id,
            updated_at: new Date().toISOString()
          },
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          }
        );
        console.log('Stripe session ID saved to Supabase');
      }
    } catch (dbError) {
      console.error('Error updating Supabase with Stripe session ID:', dbError);
      // Continue even if there's an error with the database
    }

    // Redirect directly to Stripe
    return {
      statusCode: 303,
      headers: {
        Location: session.url,
      },
      body: '',
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
