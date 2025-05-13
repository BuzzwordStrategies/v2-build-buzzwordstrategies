// netlify/functions/create-stripe-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Get parameters from query string directly
  const params = event.queryStringParameters || {};
  const { bundleName, finalMonthly, subLength, selectedServices } = params;
  
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
      success_url: 'https://ephemeral-moonbeam-0a8703.netlify.app/success',
      cancel_url: 'https://ephemeral-moonbeam-0a8703.netlify.app/cancel',
    });

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
