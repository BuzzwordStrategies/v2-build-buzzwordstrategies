// netlify/functions/save-agreement-improved.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  console.log('Starting save-agreement-improved handler');
  
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

    // Try to save to Supabase but don't block progress
    let supabaseSaveResult = { success: false, error: null };
    
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
      
      if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        throw new Error('Supabase credentials not found in environment variables');
      }
      
      console.log('Using Supabase URL:', SUPABASE_URL);
      
      // First, let's create a simplified record - WITHOUT the PDF for now
      // This helps us identify if it's the PDF causing problems
      const basicOrderData = {
        bundle_id: finalBundleID,
        bundle_name: bundleName || 'My Bundle',
        sub_length: parseInt(subLength) || 3,
        final_monthly: parseFloat(finalMonthly) || 0,
        selected_services: selectedServices || '',
        selected_tiers: typeof selectedTiers === 'object' ? JSON.stringify(selectedTiers) : '{}',
        customer_name: userInfo?.clientName || '',
        customer_email: userInfo?.clientEmail || '',
        customer_phone: userInfo?.clientPhone || '',
        customer_address: userInfo?.clientAddress || '',
        customer_city: userInfo?.clientCity || '',
        customer_state: userInfo?.clientState || '',
        customer_zip: userInfo?.clientZip || '',
        customer_company: userInfo?.clientCompany || '',
        marketing_consent: userInfo?.marketingConsent === true,
        agreement_accepted: agreementInfo?.agreeToTerms === true,
        agreement_signature: agreementInfo?.signatureName || '',
        agreement_date: agreementInfo?.agreementDate || new Date().toISOString().split('T')[0],
        status: 'agreement_signed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
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
        console.log('Updating existing record (basic data)');
        response = await axios.patch(
          `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${finalBundleID}`,
          basicOrderData,
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
        console.log('Creating new record (basic data)');
        response = await axios.post(
          `${SUPABASE_URL}/rest/v1/pending_orders`,
          basicOrderData,
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
      
      console.log('Basic data saved successfully, status:', response.status);
      
      // If we have PDF data, update the record with it separately
      if (agreementInfo?.agreementPdf) {
        console.log('Updating record with PDF data');
        
        const pdfData = {
          agreement_pdf: agreementInfo.agreementPdf,
          agreement_filename: agreementInfo?.agreementFilename || 
            `agreement_${finalBundleID}_${new Date().toISOString().split('T')[0]}.pdf`
        };
        
        const pdfResponse = await axios.patch(
          `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${finalBundleID}`,
          pdfData,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          }
        );
        
        console.log('PDF data saved successfully, status:', pdfResponse.status);
      }
      
      supabaseSaveResult = { success: true };
    } catch (supabaseError) {
      console.error('Error saving to Supabase:', supabaseError.message);
      
      if (supabaseError.response) {
        console.error('Response status:', supabaseError.response.status);
        console.error('Response data:', JSON.stringify(supabaseError.response.data, null, 2));
      }
      
      supabaseSaveResult = { 
        success: false, 
        error: supabaseError.message,
        responseData: supabaseError.response?.data,
        responseStatus: supabaseError.response?.status
      };
      
      // Continue to payment despite Supabase error
      console.log('Continuing to payment despite Supabase error');
    }

    // Always create redirect URL to Stripe checkout
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
        bundleID: finalBundleID,
        supabaseSave: supabaseSaveResult
      })
    };
  } catch (error) {
    console.error('Error in save-agreement-improved:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to save agreement',
        message: error.message,
        stack: error.stack,
        responseData: error.response?.data,
        responseStatus: error.response?.status
      })
    };
  }
};
