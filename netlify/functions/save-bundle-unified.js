// netlify/functions/save-bundle-unified.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with proper error handling
const initSupabase = () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { action, bundle_id, ...payload } = data;
    
    // Initialize Supabase client
    let supabase;
    try {
      supabase = initSupabase();
    } catch (error) {
      console.error('Supabase initialization error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Database configuration error',
          message: 'Please check Netlify environment variables'
        })
      };
    }
    
    // Log the action for debugging
    console.log(`Processing action: ${action} for bundle_id: ${bundle_id}`);
    
    let result;
    
    switch (action) {
      case 'save_bundle':
        // Handle initial bundle creation/update
        const bundleData = {
          bundle_id: bundle_id || `bwb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bundle_name: payload.bundle_name || 'My Bundle',
          selected_tiers: typeof payload.selected_tiers === 'object' 
            ? JSON.stringify(payload.selected_tiers) 
            : payload.selected_tiers || '{}',
          selected_services: payload.selected_services || '',
          sub_length: parseInt(payload.sub_length) || 3,
          final_monthly: parseFloat(payload.final_monthly) || 0,
          selected_business: payload.selected_business || '',
          status: 'bundle_created',
          updated_at: new Date().toISOString()
        };
        
        // Check if bundle exists
        const { data: existing, error: checkError } = await supabase
          .from('pending_orders')
          .select('id')
          .eq('bundle_id', bundleData.bundle_id)
          .single();
        
        if (existing && !checkError) {
          // Update existing record
          const { data: updateData, error: updateError } = await supabase
            .from('pending_orders')
            .update(bundleData)
            .eq('bundle_id', bundleData.bundle_id)
            .select()
            .single();
          
          if (updateError) throw updateError;
          result = updateData;
        } else {
          // Create new record
          bundleData.created_at = new Date().toISOString();
          
          const { data: insertData, error: insertError } = await supabase
            .from('pending_orders')
            .insert([bundleData])
            .select()
            .single();
          
          if (insertError) throw insertError;
          result = insertData;
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            data: result,
            bundle_id: bundleData.bundle_id
          })
        };
        
      case 'update_customer':
        // Update customer information
        const customerData = {
          customer_name: payload.clientName || '',
          customer_email: payload.clientEmail || '',
          customer_phone: payload.clientPhone || '',
          customer_address: payload.clientAddress || '',
          customer_city: payload.clientCity || '',
          customer_state: payload.clientState || '',
          customer_zip: payload.clientZip || '',
          customer_company: payload.clientCompany || '',
          customer_website: payload.clientWebsite || '',
          marketing_consent: payload.marketingConsent || false,
          privacy_consent: payload.privacyConsent || false,
          status: 'customer_info_added',
          updated_at: new Date().toISOString()
        };
        
        const { data: customerUpdate, error: customerError } = await supabase
          .from('pending_orders')
          .update(customerData)
          .eq('bundle_id', bundle_id)
          .select()
          .single();
        
        if (customerError) throw customerError;
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            data: customerUpdate
          })
        };
        
      case 'save_agreement':
        // Save agreement information
        const agreementData = {
          agreement_accepted: payload.agreeToTerms || false,
          agreement_signature: payload.signatureName || '',
          agreement_date: payload.agreementDate || new Date().toISOString().split('T')[0],
          privacy_policy_accepted: payload.privacyPolicyAccepted || false,
          status: 'agreement_signed',
          updated_at: new Date().toISOString()
        };
        
        // If PDF data is provided, save it separately to avoid issues
        if (payload.agreementPdf) {
          agreementData.agreement_pdf = payload.agreementPdf;
          agreementData.agreement_filename = payload.agreementFilename || 
            `agreement_${bundle_id}_${new Date().toISOString().split('T')[0]}.pdf`;
        }
        
        const { data: agreementUpdate, error: agreementError } = await supabase
          .from('pending_orders')
          .update(agreementData)
          .eq('bundle_id', bundle_id)
          .select()
          .single();
        
        if (agreementError) throw agreementError;
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            data: agreementUpdate,
            redirectUrl: `/.netlify/functions/create-stripe-checkout?bundleID=${bundle_id}`
          })
        };
        
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action specified' })
        };
    }
    
  } catch (error) {
    console.error('Handler error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        message: error.message,
        code: error.code,
        hint: error.hint || 'Check Netlify environment variables'
      })
    };
  }
};
