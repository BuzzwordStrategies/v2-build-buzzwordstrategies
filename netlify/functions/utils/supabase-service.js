// netlify/functions/utils/supabase-service.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
let supabase;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  
  return supabase;
}

// Order status constants
const ORDER_STATUS = {
  BUNDLE_CREATED: 'bundle_created',
  FORM_STARTED: 'form_started',
  FORM_COMPLETED: 'form_completed',
  AGREEMENT_SIGNED: 'agreement_signed',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed'
};

// Create or update bundle data
async function saveBundle(bundleData) {
  const supabase = getSupabaseClient();
  
  // Ensure we have a bundle_id
  const bundle_id = bundleData.bundle_id || bundleData.bundleID || `bwb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Prepare the data according to your table schema
  const dbData = {
    bundle_id: bundle_id,
    bundle_name: bundleData.bundle_name || bundleData.bundleName || 'My Bundle',
    selected_tiers: typeof bundleData.selected_tiers === 'object' 
      ? JSON.stringify(bundleData.selected_tiers) 
      : bundleData.selected_tiers,
    selected_services: bundleData.selected_services || bundleData.selectedServices || '',
    sub_length: parseInt(bundleData.sub_length || bundleData.subLength || 3),
    final_monthly: parseFloat(bundleData.final_monthly || bundleData.finalMonthly || 0),
    selected_business: bundleData.selected_business || bundleData.selectedBusiness || '',
    status: bundleData.status || ORDER_STATUS.BUNDLE_CREATED,
    updated_at: new Date().toISOString()
  };
  
  try {
    // Check if bundle already exists
    const { data: existing, error: fetchError } = await supabase
      .from('pending_orders')
      .select('id')
      .eq('bundle_id', bundle_id)
      .single();
    
    let result;
    
    if (existing && !fetchError) {
      // Update existing record
      const { data, error } = await supabase
        .from('pending_orders')
        .update(dbData)
        .eq('bundle_id', bundle_id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new record
      dbData.created_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('pending_orders')
        .insert([dbData])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    console.log('Bundle saved successfully:', result);
    return { success: true, data: result, bundle_id: bundle_id };
    
  } catch (error) {
    console.error('Error saving bundle:', error);
    return { success: false, error: error.message };
  }
}

// Update customer information
async function updateCustomerInfo(bundle_id, customerData) {
  const supabase = getSupabaseClient();
  
  const dbData = {
    customer_name: customerData.customer_name || customerData.clientName || '',
    customer_email: customerData.customer_email || customerData.clientEmail || '',
    customer_phone: customerData.customer_phone || customerData.clientPhone || '',
    customer_company: customerData.customer_company || customerData.clientCompany || '',
    customer_website: customerData.customer_website || customerData.clientWebsite || '',
    customer_address: customerData.customer_address || customerData.clientAddress || '',
    customer_city: customerData.customer_city || customerData.clientCity || '',
    customer_state: customerData.customer_state || customerData.clientState || '',
    customer_zip: customerData.customer_zip || customerData.clientZip || '',
    marketing_consent: customerData.marketing_consent || customerData.marketingConsent || false,
    status: ORDER_STATUS.FORM_COMPLETED,
    updated_at: new Date().toISOString()
  };
  
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .update(dbData)
      .eq('bundle_id', bundle_id)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('Customer info updated successfully:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error updating customer info:', error);
    return { success: false, error: error.message };
  }
}

// Update agreement information
async function updateAgreement(bundle_id, agreementData) {
  const supabase = getSupabaseClient();
  
  const dbData = {
    agreement_accepted: agreementData.agreement_accepted || agreementData.agreeToTerms || false,
    agreement_signature: agreementData.agreement_signature || agreementData.signatureName || '',
    agreement_date: agreementData.agreement_date || agreementData.agreementDate || new Date().toISOString(),
    agreement_pdf: agreementData.agreement_pdf || agreementData.agreementPdf || null,
    agreement_filename: agreementData.agreement_filename || agreementData.agreementFilename || null,
    status: ORDER_STATUS.AGREEMENT_SIGNED,
    updated_at: new Date().toISOString()
  };
  
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .update(dbData)
      .eq('bundle_id', bundle_id)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('Agreement updated successfully:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error updating agreement:', error);
    return { success: false, error: error.message };
  }
}

// Update payment status
async function updatePaymentStatus(bundle_id, paymentData) {
  const supabase = getSupabaseClient();
  
  const dbData = {
    stripe_session_id: paymentData.stripe_session_id || paymentData.stripeSessionID || '',
    status: paymentData.status || ORDER_STATUS.PAYMENT_PENDING,
    updated_at: new Date().toISOString()
  };
  
  // Add promo code data if present
  if (paymentData.promo_code) {
    dbData.promo_code = paymentData.promo_code;
    dbData.discount_amount = paymentData.discount_amount;
    dbData.discount_percentage = paymentData.discount_percentage;
  }
  
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .update(dbData)
      .eq('bundle_id', bundle_id)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('Payment status updated successfully:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: error.message };
  }
}

// Get bundle by ID
async function getBundle(bundle_id) {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .select('*')
      .eq('bundle_id', bundle_id)
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
    
  } catch (error) {
    console.error('Error fetching bundle:', error);
    return { success: false, error: error.message };
  }
}

// Test database connection
async function testConnection() {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return { success: true, message: 'Database connection successful' };
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  ORDER_STATUS,
  saveBundle,
  updateCustomerInfo,
  updateAgreement,
  updatePaymentStatus,
  getBundle,
  testConnection
};
