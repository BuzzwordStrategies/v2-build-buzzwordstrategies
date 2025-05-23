// netlify/functions/save-bundle-unified.js
const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    const { action, bundle_id, ...payload } = data;
    
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Supabase credentials missing',
          hasUrl: !!SUPABASE_URL,
          hasKey: !!SUPABASE_SERVICE_KEY
        })
      };
    }
    
    let result;
    
    switch (action) {
      case 'save_bundle':
        // Direct API call to Supabase
        const bundleData = {
          bundle_id: bundle_id || `bwb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bundle_name: payload.bundle_name || 'My Bundle',
          selected_tiers: JSON.stringify(payload.selected_tiers || {}),
          selected_services: payload.selected_services || '',
          sub_length: parseInt(payload.sub_length) || 3,
          final_monthly: parseFloat(payload.final_monthly) || 0,
          selected_business: payload.selected_business || '',
          status: 'bundle_created',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        try {
          // First check if bundle exists
          const checkResponse = await axios.get(
            `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${bundleData.bundle_id}`,
            {
              headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
              }
            }
          );
          
          if (checkResponse.data && checkResponse.data.length > 0) {
            // Update existing
            delete bundleData.created_at; // Don't update created_at
            result = await axios.patch(
              `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${bundleData.bundle_id}`,
              bundleData,
              {
                headers: {
                  'apikey': SUPABASE_SERVICE_KEY,
                  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=representation'
                }
              }
            );
          } else {
            // Create new
            result = await axios.post(
              `${SUPABASE_URL}/rest/v1/pending_orders`,
              bundleData,
              {
                headers: {
                  'apikey': SUPABASE_SERVICE_KEY,
                  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=representation'
                }
              }
            );
          }
          
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              data: result.data,
              bundle_id: bundleData.bundle_id
            })
          };
        } catch (error) {
          console.error('Supabase error:', error.response?.data || error.message);
          return {
            statusCode: 500,
            body: JSON.stringify({
              error: 'Database error',
              details: error.response?.data || error.message
            })
          };
        }
        
      case 'update_customer':
        // Similar pattern for customer update...
        // Implementation here
        break;
        
      case 'save_agreement':
        // Similar pattern for agreement...
        // Implementation here
        break;
        
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
    
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
