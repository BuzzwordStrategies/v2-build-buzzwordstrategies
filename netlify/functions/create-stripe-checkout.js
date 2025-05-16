// netlify/functions/create-stripe-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  console.log('Starting create-stripe-checkout handler');
  
  // Get parameters from query string directly
  const params = event.queryStringParameters || {};
  const { bundleID, bundleName, finalMonthly, subLength, selectedServices } = params;
  
  console.log('Received parameters:', params);
  
  if (!finalMonthly) {
    console.error('Missing required parameters:', params);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameter: finalMonthly' })
    };
  }
  
  // Ensure we have a bundleID
  const finalBundleID = bundleID || `bwb-${uuidv4()}`;
  
  try {
    console.log('Creating Stripe session with params:', params);
    
    // Update Supabase with payment pending status
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
      
      if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
        await axios.patch(
          `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${finalBundleID}`,
          { 
            status: 'payment_pending',
            updated_at: new Date().toISOString()
          },
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Updated Supabase with payment pending status');
      }
    } catch (supabaseError) {
      console.error('Error updating Supabase status:', supabaseError);
      // Continue with Stripe checkout even if Supabase update fails
    }
    
    // Convert finalMonthly to a valid number
    const monthlyAmount = parseFloat(finalMonthly);
    if (isNaN(monthlyAmount)) {
      throw new Error(`Invalid amount: ${finalMonthly}`);
    }
    
    // Create a simple Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${bundleName || 'Marketing Bundle'} - ${subLength} month subscription`,
              description: selectedServices || 'Marketing services',
              metadata: {
                bundleID: finalBundleID
              }
            },
            unit_amount: Math.round(monthlyAmount * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.URL || 'https://ephemeral-moonbeam-0a8703.netlify.app'}/success?session_id={CHECKOUT_SESSION_ID}&bundle_id=${finalBundleID}`,
      cancel_url: `${process.env.URL || 'https://ephemeral-moonbeam-0a8703.netlify.app'}/cancel`,
      metadata: {
        bundleID: finalBundleID
      }
    });

    console.log('Stripe session created:', session.id);
    console.log('Stripe checkout URL:', session.url);
    
   // Redirect directly to Stripe
// Redirect directly to Stripe
return {
  statusCode: 303,
  headers: {
    Location: session.url
  },
  body: ""
};
    
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        type: error.type
      })
    };
  }
};
