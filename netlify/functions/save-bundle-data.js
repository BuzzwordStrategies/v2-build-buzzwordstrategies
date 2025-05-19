// netlify/functions/save-bundle-data.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  console.log('Starting save-bundle-data handler');
  
  try {
    const data = JSON.parse(event.body);
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    const { 
      bundleID, 
      bundleName, 
      selectedTiers,
      subLength, 
      selectedBusiness,
      finalMonthly,
      formStep,
      userInfo
    } = data;
    
    // Ensure we have a bundleID, generate if not provided
    const finalBundleID = bundleID || `bwb-${Date.now()}-${uuidv4().slice(0,8)}`;

    // Format the data for Supabase
    const bundleData = {
      bundle_name: bundleName || "My Bundle",
      selected_tiers: JSON.stringify(selectedTiers || {}),
      sub_length: parseInt(subLength) || 3,
      selected_business: selectedBusiness || "",
      final_monthly: parseFloat(finalMonthly) || 0,
      form_step: formStep || 0
    };
    
    // Add customer info if available
    if (userInfo) {
      bundleData.customer_name = userInfo.clientName;
      bundleData.customer_email = userInfo.clientEmail;
      bundleData.customer_phone = userInfo.clientPhone;
      bundleData.customer_address = userInfo.clientAddress;
      bundleData.customer_city = userInfo.clientCity;
      bundleData.customer_state = userInfo.clientState;
      bundleData.customer_zip = userInfo.clientZip;
      bundleData.customer_company = userInfo.clientCompany || '';
      bundleData.customer_website = userInfo.clientWebsite || '';
      bundleData.marketing_consent = userInfo.marketingConsent || false;
    }
    
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn('Supabase credentials not found, skipping database save');
      return { 
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: "Bundle data processed (Supabase credentials not found)",
          bundleID: finalBundleID
        })
      };
    }
    
    // For new records, add status
    if (!bundleID) {
      bundleData.status = 'in_progress';
    }
    
    // Try using the RPC function first
    try {
      console.log('Using safe_update_bundle RPC function');
      const rpcResponse = await axios.post(
        `${SUPABASE_URL}/rest/v1/rpc/safe_update_bundle`,
        {
          p_bundle_id: finalBundleID,
          p_data: bundleData
        },
        {
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('RPC response status:', rpcResponse.status);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: "Bundle data saved successfully",
          bundleID: finalBundleID,
          records: rpcResponse.data.all_records
        })
      };
    } catch (rpcError) {
      console.error('RPC error, falling back to direct methods:', rpcError.message);
      
      // Check if bundle already exists
      const checkResponse = await axios.get(
  `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${finalBundleID}`,
        {
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          }
        }
      );
      
      let response;
      
      if (checkResponse.data && checkResponse.data.length > 0) {
        // Update existing record
        console.log('Updating existing record');
        response = await axios.patch(
          `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${finalBundleID}`,
          {
            ...bundleData,
            updated_at: new Date().toISOString()
          },
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
        // Create new record
        console.log('Creating new record');
        response = await axios.post(
          `${SUPABASE_URL}/rest/v1/pending_orders`,
          {
            ...bundleData,
            bundle_id: finalBundleID,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'in_progress'
          },
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
      
      // Get all records
      const allRecordsResponse = await axios.get(
        `${SUPABASE_URL}/rest/v1/pending_orders?order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          }
        }
      );
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: "Bundle data saved successfully (fallback method)",
          bundleID: finalBundleID,
          records: allRecordsResponse.data
        })
      };
    }
  } catch (error) {
    console.error('Error saving bundle data:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to save bundle data',
        message: error.message,
        details: error.response?.data || error.stack
      })
    };
  }
};
