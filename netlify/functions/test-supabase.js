// netlify/functions/test-supabase.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // This function tests your Supabase connection and creates a test record
  
  try {
    // Check if we have the required environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Missing environment variables',
          hasUrl: !!SUPABASE_URL,
          hasKey: !!SUPABASE_SERVICE_KEY,
          message: 'Please check your Netlify environment variables'
        })
      };
    }
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Try to create a test record
    const testBundle = {
      bundle_id: `test-${Date.now()}`,
      bundle_name: 'Test Bundle',
      selected_services: 'This is a test',
      sub_length: 3,
      final_monthly: 99.99,
      status: 'test',
      customer_email: 'test@example.com'
    };
    
    const { data, error } = await supabase
      .from('pending_orders')
      .insert([testBundle])
      .select()
      .single();
    
    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Database error',
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
      };
    }
    
    // Success! Now let's read it back to verify
    const { data: readData, error: readError } = await supabase
      .from('pending_orders')
      .select('*')
      .eq('bundle_id', testBundle.bundle_id)
      .single();
    
    if (readError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Read error',
          message: 'Created record but could not read it back',
          details: readError
        })
      };
    }
    
    // Clean up - delete the test record
    await supabase
      .from('pending_orders')
      .delete()
      .eq('bundle_id', testBundle.bundle_id);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Supabase connection is working perfectly!',
        testRecord: readData,
        supabaseUrl: SUPABASE_URL
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unexpected error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};
