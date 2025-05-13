// netlify/functions/save-agreement.js
const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    const { 
      bundleID, 
      bundleName, 
      subLength, 
      finalMonthly, 
      selectedServices, 
      userInfo, 
      agreementInfo 
    } = data;

    // Save to Supabase
    const saveResult = await saveToSupabase({
      bundleID,
      bundleName,
      subLength,
      finalMonthly,
      selectedServices,
      clientName: userInfo.clientName,
      clientEmail: userInfo.clientEmail,
      clientPhone: userInfo.clientPhone,
      clientAddress: userInfo.clientAddress,
      clientCity: userInfo.clientCity,
      clientState: userInfo.clientState,
      clientZip: userInfo.clientZip,
      clientCompany: userInfo.clientCompany || '',
      marketingConsent: userInfo.marketingConsent,
      agreementAccepted: agreementInfo.agreeToTerms,
      agreementSignature: agreementInfo.signatureName,
      agreementDate: agreementInfo.agreementDate,
      status: 'agreement_signed'
    });

    // Create Stripe checkout session
    const stripe_checkout_url = `https://ephemeral-moonbeam-0a8703.netlify.app/.netlify/functions/create-stripe-checkout?bundleID=${encodeURIComponent(bundleID)}&bundleName=${encodeURIComponent(bundleName || "My Bundle")}&finalMonthly=${encodeURIComponent(finalMonthly)}&subLength=${encodeURIComponent(subLength)}&selectedServices=${encodeURIComponent(selectedServices || "No services selected")}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        redirectUrl: stripe_checkout_url
      })
    };
  } catch (error) {
    console.error('Error saving agreement:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to save agreement',
        details: error.message
      })
    };
  }
};

// Function to save data to Supabase
async function saveToSupabase(data) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn('Supabase credentials not found, skipping database save');
      return;
    }
    
    // Format the data for Supabase
    const orderData = {
      bundle_id: data.bundleID,
      bundle_name: data.bundleName,
      sub_length: parseInt(data.subLength),
      final_monthly: parseFloat(data.finalMonthly),
      selected_services: data.selectedServices,
      customer_email: data.clientEmail,
      customer_name: data.clientName,
      customer_address: `${data.clientAddress}, ${data.clientCity}, ${data.clientState} ${data.clientZip}`,
      customer_phone: data.clientPhone,
      customer_company: data.clientCompany,
      marketing_consent: data.marketingConsent,
      agreement_accepted: data.agreementAccepted,
      agreement_signature: data.agreementSignature,
      agreement_date: data.agreementDate,
      status: data.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const response = await axios.post(
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
    
    console.log('Order data saved to Supabase successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving to Supabase:', error.response?.data || error.message);
    throw error;
  }
}
