// netlify/functions/update-payment-status.js
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  console.log('Starting update-payment-status handler');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body);
    console.log('Received payload:', JSON.stringify(payload, null, 2));
    
    const { bundleID, stripeSessionID, status } = payload;

    if (!bundleID) {
      console.error('Missing bundleID parameter');
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameter: bundleID' }) 
      };
    }

    if (!stripeSessionID) {
      console.error('Missing stripeSessionID parameter');
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameter: stripeSessionID' }) 
      };
    }

    // Retrieve the full checkout session from Stripe to get promo code info
    let promoCode = null;
    let discountAmount = null;
    let discountPercentage = null;
    
    try {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionID, {
        expand: ['total_details.breakdown']
      });
      
      console.log('Retrieved Stripe session:', JSON.stringify(session, null, 2));
      
      // Check if there's a discount applied
      if (session.total_details && session.total_details.breakdown && session.total_details.breakdown.discounts) {
        const discounts = session.total_details.breakdown.discounts;
        if (discounts.length > 0) {
          const discount = discounts[0];
          
          // Get the promotion code
          if (discount.discount && discount.discount.promotion_code) {
            // Retrieve the full promotion code object
            const promotionCode = await stripe.promotionCodes.retrieve(discount.discount.promotion_code);
            promoCode = promotionCode.code;
            
            // Get discount details
            if (discount.discount.coupon) {
              if (discount.discount.coupon.percent_off) {
                discountPercentage = discount.discount.coupon.percent_off;
              } else if (discount.discount.coupon.amount_off) {
                discountAmount = discount.discount.coupon.amount_off / 100; // Convert from cents
              }
            }
          }
        }
      }
      
      console.log('Promo code details:', { promoCode, discountAmount, discountPercentage });
    } catch (stripeError) {
      console.error('Error retrieving Stripe session:', stripeError);
      // Continue without promo code info if there's an error
    }

    // Update Supabase
    console.log('Updating Supabase with payment status...');
    const updateResult = await updateSupabase(bundleID, stripeSessionID, status || 'paid', promoCode, discountAmount, discountPercentage);
    console.log('Supabase update result:', updateResult);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Payment status updated successfully',
        data: updateResult,
        promoCode: promoCode
      })
    };
  } catch (error) {
    console.error('Error updating payment status:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to update payment status',
        message: error.message,
        details: error.response?.data || error.stack
      })
    };
  }
};

async function updateSupabase(bundleID, stripeSessionID, status, promoCode, discountAmount, discountPercentage) {
  console.log('Starting updateSupabase function');
  
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn('Supabase credentials not found, skipping database update');
      return { status: 'skipped', reason: 'missing_credentials' };
    }
    
    console.log(`Updating Supabase for bundle_id: ${bundleID}, status: ${status}`);
    
    const updateData = {
      stripe_session_id: stripeSessionID,
      status: status || 'paid',
      updated_at: new Date().toISOString()
    };
    
    // Add promo code fields if a promo code was used
    if (promoCode) {
      updateData.promo_code = promoCode;
      updateData.discount_amount = discountAmount;
      updateData.discount_percentage = discountPercentage;
    }
    
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
          'Prefer': 'return=representation'
        }
      }
    );
    
    console.log('Supabase API response status:', response.status);
    
    return {
      status: 'success',
      data: response.data,
      promoCode: promoCode
    };
  } catch (error) {
    console.error('Error in updateSupabase function:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error message:', error.message);
    
    throw {
      status: 'error',
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    };
  }
}
