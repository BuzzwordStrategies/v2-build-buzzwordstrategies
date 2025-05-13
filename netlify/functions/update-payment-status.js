// netlify/functions/update-payment-status.js
const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { bundleID, stripeSessionID, status } = JSON.parse(event.body);

    if (!bundleID || !stripeSessionID) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameters' }) 
      };
    }

    // Update Supabase
    await updateSupabase(bundleID, stripeSessionID, status);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update payment status' })
    };
  }
};

async function updateSupabase(bundleID, stripeSessionID, status) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn('Supabase credentials not found, skipping database update');
    return;
  }
  
  await axios.patch(
    `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${bundleID}`,
    {
      stripe_session_id: stripeSessionID,
      status: status || 'paid',
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
}
