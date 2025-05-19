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
    console.log('Received data:', JSON.stringify({
      ...data,
      agreementInfo: data.agreementInfo ? {
        ...data.agreementInfo,
        agreementPdf: data.agreementInfo.agreementPdf ? '(Base64 PDF data omitted for logging)' : null
      } : null
    }, null, 2));
    
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
    
    try {
      // Prepare data for Supabase
      const orderData = {
        bundle_id: finalBundleID,
        bundle_name: bundleName || 'My Bundle',
        sub_length: parseInt(subLength) || 3,
        final_monthly: parseFloat(finalMonthly) || 0,
        selected_services: selectedServices || '',
        selected_tiers: selectedTiers ? JSON.stringify(selectedTiers) : '{}',
        customer_name: userInfo?.clientName || '',
        customer_email: userInfo?.clientEmail || '',
        customer_phone: userInfo?.clientPhone || '',
        customer_address: userInfo?.clientAddress || '',
        customer_city: userInfo?.clientCity || '',
        customer_state: userInfo?.clientState || '',
        customer_zip: userInfo?.clientZip || '',
        customer_company: userInfo?.clientCompany || '',
        customer_website: userInfo?.clientWebsite || '',
        marketing_consent: userInfo?.marketingConsent || false,
        agreement_accepted: !!agreementInfo?.agreeToTerms,
        agreement_signature: agreementInfo?.signatureName || '',
        agreement_date: agreementInfo?.agreementDate || new Date().toISOString().split('T')[0],
        status: 'agreement_signed',
        updated_at: new Date().toISOString()
      };
      
      // Handle PDF separately to avoid potential issues
      // Check if PDF needs to be stored
      if (agreementInfo?.agreementPdf) {
        // Add PDF data - but check length first
        if (agreementInfo.agreementPdf.length > 500000) {
          console.log('PDF data is very large, consider alternative storage solution');
          // For extremely large PDFs, you might want to compress or use Supabase Storage instead
        }
        
        orderData.agreement_pdf = agreementInfo.agreementPdf;
        orderData.agreement_filename = agreementInfo?.agreementFilename || 
          `agreement_${finalBundleID}_${new Date().toISOString().split('T')[0]}.pdf`;
      }
      
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
      
      if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        throw new Error('Supabase credentials not found');
      }
      
      console.log('Using Supabase URL:', SUPABASE_URL);
      
      // Check if record already exists
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
          orderData,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          }
        );
      } else {
        // Create new record
        console.log('Creating new record');
        orderData.created_at = new Date().toISOString();
        
        response = await axios.post(
          `${SUPABASE_URL}/rest/v1/pending_orders`,
          orderData,
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
      
      console.log('Supabase API response status:', response.status);
    } catch (supabaseError) {
      console.error('Error saving to Supabase:', supabaseError.message);
      console.error('Response data:', supabaseError.response?.data);
      console.error('Status code:', supabaseError.response?.status);
      
      // Continue anyway since we want to redirect to payment
      console.log('Continuing to payment despite Supabase error');
    }

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
        message: "Agreement successfully processed",
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
