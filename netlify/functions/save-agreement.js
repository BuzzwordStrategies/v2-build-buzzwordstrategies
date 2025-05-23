// netlify/functions/save-agreement.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with error handling
const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

exports.handler = async (event) => {
  // Log the incoming request
  console.log('Save agreement called with method:', event.httpMethod);
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  let supabase;
  let requestData;
  
  try {
    // Parse the request
    requestData = JSON.parse(event.body);
    console.log('Request data:', {
      ...requestData,
      agreementInfo: requestData.agreementInfo ? {
        ...requestData.agreementInfo,
        agreementPdf: '[PDF data omitted from logs]'
      } : null
    });
    
    // Validate required fields
    if (!requestData.bundleID) {
      throw new Error('bundleID is required');
    }
    
    // Initialize Supabase
    supabase = getSupabase();
    console.log('Supabase initialized successfully');
    
    // Extract all the data
    const {
      bundleID,
      bundleName,
      subLength,
      finalMonthly,
      selectedServices,
      selectedTiers,
      userInfo,
      agreementInfo
    } = requestData;
    
    // Build the complete record
    const orderData = {
      bundle_id: bundleID,
      bundle_name: bundleName || 'My Bundle',
      selected_tiers: selectedTiers || {},
      selected_services: selectedServices || '',
      sub_length: parseInt(subLength) || 3,
      final_monthly: parseFloat(finalMonthly) || 0,
      status: 'agreement_signed',
      updated_at: new Date().toISOString()
    };
    
    // Add user info if provided
    if (userInfo) {
      Object.assign(orderData, {
        customer_name: userInfo.clientName || '',
        customer_email: userInfo.clientEmail || '',
        customer_phone: userInfo.clientPhone || '',
        customer_address: userInfo.clientAddress || '',
        customer_city: userInfo.clientCity || '',
        customer_state: userInfo.clientState || '',
        customer_zip: userInfo.clientZip || '',
        customer_company: userInfo.clientCompany || '',
        customer_website: userInfo.clientWebsite || '',
        marketing_consent: userInfo.marketingConsent === true,
        privacy_consent: userInfo.privacyConsent === true
      });
    }
    
    // Add agreement info if provided
    if (agreementInfo) {
      Object.assign(orderData, {
        agreement_accepted: agreementInfo.agreeToTerms === true,
        agreement_signature: agreementInfo.signatureName || '',
        agreement_date: agreementInfo.agreementDate || new Date().toISOString().split('T')[0],
        privacy_policy_accepted: agreementInfo.privacyPolicyAccepted === true
      });
      
      // Handle PDF separately if it exists
      if (agreementInfo.agreementPdf) {
        orderData.agreement_pdf = agreementInfo.agreementPdf;
        orderData.agreement_filename = agreementInfo.agreementFilename || 
          `agreement_${bundleID}_${new Date().toISOString().split('T')[0]}.pdf`;
      }
    }
    
    console.log('Attempting to save order data for bundle:', bundleID);
    
    // Check if record exists
    const { data: existing, error: checkError } = await supabase
      .from('pending_orders')
      .select('id')
      .eq('bundle_id', bundleID)
      .maybeSingle();
    
    let result;
    
    if (existing) {
      // Update existing record
      console.log('Updating existing record');
      const { data, error } = await supabase
        .from('pending_orders')
        .update(orderData)
        .eq('bundle_id', bundleID)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new record
      console.log('Creating new record');
      orderData.created_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('pending_orders')
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    console.log('Successfully saved order:', result.bundle_id);
    
    // Create the redirect URL for Stripe
    const queryParams = new URLSearchParams({
      bundleID: bundleID,
      bundleName: bundleName || 'My Bundle',
      finalMonthly: finalMonthly || '0',
      subLength: subLength || '3',
      selectedServices: selectedServices || ''
    }).toString();
    
    const redirectUrl = `/.netlify/functions/create-stripe-checkout?${queryParams}`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Agreement saved successfully',
        bundleID: bundleID,
        redirectUrl: redirectUrl
      })
    };
    
  } catch (error) {
    console.error('Error in save-agreement:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    // Provide helpful error messages
    let errorMessage = 'Failed to save agreement';
    let hint = '';
    
    if (error.message.includes('credentials')) {
      hint = 'Check that SUPABASE_URL and SUPABASE_SERVICE_KEY are set in Netlify';
    } else if (error.code === '23505') {
      hint = 'This bundle ID already exists';
    } else if (error.code === '42P01') {
      hint = 'The pending_orders table does not exist. Please create it in Supabase.';
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: errorMessage,
        message: error.message,
        code: error.code,
        hint: hint
      })
    };
  }
};
