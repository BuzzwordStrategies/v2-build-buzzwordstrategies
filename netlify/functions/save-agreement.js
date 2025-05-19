// netlify/functions/save-agreement.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  console.log('Starting save-agreement handler');
  
  try {
    // Parse and validate the incoming data
    const data = JSON.parse(event.body);
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    if (!data.bundleID) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameter: bundleID' }) 
      };
    }
    
    const { 
      bundleID, 
      bundleName, 
      subLength, 
      finalMonthly, 
      selectedServices, 
      userInfo, 
      agreementInfo,
      selectedTiers
    } = data;

    // Ensure we have a bundleID, generate if not provided
    const finalBundleID = bundleID || `bwb-${uuidv4()}`;

    // Save to Supabase
    console.log('Saving agreement data to Supabase...');
    const saveResult = await saveToSupabase({
      bundleID: finalBundleID,
      bundleName,
      subLength,
      finalMonthly,
      selectedServices,
      selectedTiers: selectedTiers ? JSON.stringify(selectedTiers) : '{}',
      clientName: userInfo?.clientName,
      clientEmail: userInfo?.clientEmail,
      clientPhone: userInfo?.clientPhone,
      clientAddress: userInfo?.clientAddress,
      clientCity: userInfo?.clientCity,
      clientState: userInfo?.clientState,
      clientZip: userInfo?.clientZip,
      clientCompany: userInfo?.clientCompany || '',
      clientWebsite: userInfo?.clientWebsite || '',
      marketingConsent: userInfo?.marketingConsent || false,
      agreementAccepted: agreementInfo?.agreeToTerms,
      agreementSignature: agreementInfo?.signatureName,
      agreementDate: agreementInfo?.agreementDate,
      agreementPdf: agreementInfo?.agreementPdf, // Base64 encoded PDF
      agreementFilename: agreementInfo?.agreementFilename || 
        `agreement_${finalBundleID}_${new Date().toISOString().split('T')[0]}.pdf`,
      status: 'agreement_signed'
    });
    
    console.log('Supabase save result:', saveResult);

    // Create redirect URL to Stripe checkout
    console.log('Creating Stripe checkout URL...');
    const queryParams = new URLSearchParams({
      bundleID: finalBundleID,
      bundleName: bundleName || "My Bundle",
      finalMonthly: finalMonthly || "0",
      subLength: subLength || "1",
      selectedServices: selectedServices || "No services selected"
    }).toString();
    
    const stripe_checkout_url = `/.netlify/functions/create-stripe-checkout?${queryParams}`;
    console.log('Stripe checkout URL:', stripe_checkout_url);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: "Agreement successfully saved",
        redirectUrl: stripe_checkout_url,
        bundleID: finalBundleID
      })
    };
  } catch (error) {
    console.error('Error saving agreement:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to save agreement',
        message: error.message,
        details: error.response?.data || error.stack
      })
    };
  }
};

// Function to save data to Supabase
async function saveToSupabase(data) {
  console.log('Starting saveToSupabase function');
  
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn('Supabase credentials not found, skipping database save');
      return { status: 'skipped', reason: 'missing_credentials' };
    }
    
    // Format the data for Supabase
    const orderData = {
      bundle_id: data.bundleID,
      bundle_name: data.bundleName || 'My Bundle',
      sub_length: parseInt(data.subLength) || 3,
      final_monthly: parseFloat(data.finalMonthly) || 0,
      selected_services: data.selectedServices || '',
      selected_tiers: data.selectedTiers || '{}',
      customer_email: data.clientEmail || '',
      customer_name: data.clientName || '',
      customer_address: data.clientAddress ? 
        `${data.clientAddress}, ${data.clientCity || ''}, ${data.clientState || ''} ${data.clientZip || ''}`.trim() : '',
      customer_phone: data.clientPhone || '',
      customer_company: data.clientCompany || '',
      customer_website: data.clientWebsite || '',
      marketing_consent: !!data.marketingConsent,
      agreement_accepted: !!data.agreementAccepted,
      agreement_signature: data.agreementSignature || '',
      agreement_date: data.agreementDate || new Date().toISOString().split('T')[0],
      agreement_pdf: data.agreementPdf || null,
      agreement_filename: data.agreementFilename || '',
      status: data.status || 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Sending data to Supabase:', JSON.stringify({
      ...orderData,
      agreement_pdf: orderData.agreement_pdf ? '(Base64 PDF data omitted for logging)' : null
    }, null, 2));
    
    console.log('Supabase URL:', SUPABASE_URL);
    
    // Check if bundle already exists
    const checkResponse = await axios.get(
      `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${data.bundleID}`,
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
        `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${data.bundleID}`,
        orderData,
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
        orderData,
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
    console.log('Supabase API response data:', JSON.stringify(response.data, null, 2));
    
    return {
      status: 'success',
      data: response.data
    };
  } catch (error) {
    console.error('Error in saveToSupabase function:', error);
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
