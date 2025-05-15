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
    const finalBundleID = bundleID || `bwb-${uuidv4()}`;

    // Save to Supabase
    console.log('Saving bundle data to Supabase...');
    
    // Format the data for Supabase
    const bundleData = {
      bundle_id: finalBundleID,
      bundle_name: bundleName || "My Bundle",
      selected_tiers: JSON.stringify(selectedTiers || {}),
      sub_length: parseInt(subLength) || 3,
      selected_business: selectedBusiness || "",
      final_monthly: parseFloat(finalMonthly) || 0,
      form_step: formStep || 0,
      updated_at: new Date().toISOString()
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
      bundleData.customer_website = userInfo.clientWebsite || ''; // Added website field
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
      // Create new record
      console.log('Creating new record');
      bundleData.created_at = new Date().toISOString();
      bundleData.status = 'in_progress';
      
      response = await axios.post(
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
    
    console.log('Supabase API response status:', response.status);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: "Bundle data saved successfully",
        bundleID: finalBundleID
      })
    };
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
