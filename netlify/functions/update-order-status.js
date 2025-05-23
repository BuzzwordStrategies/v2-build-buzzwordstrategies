// netlify/functions/update-order-status.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
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
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const supabase = getSupabase();
    const data = JSON.parse(event.body);
    
    console.log('Updating order status for bundle_id:', data.bundle_id);
    console.log('New status:', data.status);
    
    // Build the update object
    const updateData = {
      status: data.status,
      updated_at: new Date().toISOString()
    };
    
    // Add any additional fields based on the status
    switch (data.status) {
      case 'customer_info_added':
        // Add customer information when they complete that step
        if (data.customer_info) {
          Object.assign(updateData, {
            customer_name: data.customer_info.clientName,
            customer_email: data.customer_info.clientEmail,
            customer_phone: data.customer_info.clientPhone,
            customer_address: data.customer_info.clientAddress,
            customer_city: data.customer_info.clientCity,
            customer_state: data.customer_info.clientState,
            customer_zip: data.customer_info.clientZip,
            customer_company: data.customer_info.clientCompany || '',
            customer_website: data.customer_info.clientWebsite || '',
            marketing_consent: data.customer_info.marketingConsent || false,
            privacy_consent: data.customer_info.privacyConsent || false
          });
        }
        break;
        
      case 'agreement_signed':
        // Add agreement information when they sign
        if (data.agreement_info) {
          Object.assign(updateData, {
            agreement_accepted: data.agreement_info.agreeToTerms,
            agreement_signature: data.agreement_info.signatureName,
            agreement_date: data.agreement_info.agreementDate,
            privacy_policy_accepted: data.agreement_info.privacyPolicyAccepted
          });
          
          // Handle PDF if provided
          if (data.agreement_info.agreementPdf) {
            updateData.agreement_pdf = data.agreement_info.agreementPdf;
            updateData.agreement_filename = data.agreement_info.agreementFilename;
          }
        }
        break;
        
      case 'payment_initiated':
        // Track when they go to Stripe
        if (data.stripe_session_id) {
          updateData.stripe_session_id = data.stripe_session_id;
        }
        break;
        
      case 'paid':
        // Mark as paid when Stripe confirms
        if (data.stripe_session_id) {
          updateData.stripe_session_id = data.stripe_session_id;
        }
        if (data.promo_code) {
          updateData.promo_code = data.promo_code;
          updateData.discount_amount = data.discount_amount;
          updateData.discount_percentage = data.discount_percentage;
        }
        break;
        
      case 'rejected':
      case 'abandoned':
        // Track why they left
        if (data.rejection_reason) {
          updateData.rejection_reason = data.rejection_reason;
        }
        if (data.abandoned_at_step) {
          updateData.abandoned_at_step = data.abandoned_at_step;
        }
        break;
    }
    
    // Update the specific order
    const { data: result, error } = await supabase
      .from('pending_orders')
      .update(updateData)
      .eq('bundle_id', data.bundle_id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('Order updated successfully:', result.bundle_id, 'Status:', result.status);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result,
        message: `Order status updated to ${data.status}`
      })
    };
    
  } catch (error) {
    console.error('Error updating order:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to update order',
        message: error.message,
        code: error.code
      })
    };
  }
};
