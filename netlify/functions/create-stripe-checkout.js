// netlify/functions/create-stripe-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  console.log('Starting create-stripe-checkout handler');
  
  // Get parameters from query string directly
  const params = event.queryStringParameters || {};
  const { bundleID, bundleName, finalMonthly, subLength, selectedServices } = params;
  
  if (!bundleID || !finalMonthly) {
    console.error('Missing required parameters:', params);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }
  
  try {
    console.log('Creating Stripe session with params:', params);
    
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

    console.log('Stripe session created:', session.id);
    
    // Redirect directly to Stripe
    return {
      statusCode: 303,
      headers: {
        Location: session.url,
      },
      body: '',
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
