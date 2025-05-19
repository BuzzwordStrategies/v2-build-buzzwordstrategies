// netlify/functions/debug-supabase.js
const axios = require('axios');

exports.handler = async (event) => {
  console.log('Starting debug-supabase handler');
  
  try {
    // Get Supabase credentials
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ 
          error: 'Supabase credentials not found',
          supabaseUrlExists: !!SUPABASE_URL,
          supabaseKeyExists: !!SUPABASE_SERVICE_KEY,
          message: 'Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your Netlify environment variables'
        })
      };
    }
    
    // Check if we can connect to Supabase
    try {
      const response = await axios.get(
        `${SUPABASE_URL}/rest/v1/pending_orders?limit=1`,
        {
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          }
        }
      );
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Successfully connected to Supabase',
          tableExists: true,
          rowCount: response.data.length,
          supabaseUrl: SUPABASE_URL.replace(/^(https:\/\/[^.]+).*$/, '$1.xxx'), // Redacted for security
          response: response.status
        })
      };
    } catch (getError) {
      // Try creating a simple test record
      try {
        // First, check if the table exists
        const tablesResponse = await axios.get(
          `${SUPABASE_URL}/rest/v1/`,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
          }
        );
        
        // Create test record
        const testData = {
          bundle_id: `test-${Date.now()}`,
          bundle_name: 'Debug Test Bundle',
          sub_length: 3,
          final_monthly: 99.99,
          selected_services: 'Test Service',
          status: 'test',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const createResponse = await axios.post(
          `${SUPABASE_URL}/rest/v1/pending_orders`,
          testData,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          }
        );
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Successfully created test record in Supabase',
            getError: getError.message,
            createStatus: createResponse.status,
            availableTables: tablesResponse.data
          })
        };
      } catch (createError) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Failed to connect to Supabase',
            getError: getError.message,
            createError: createError.message,
            createErrorResponse: createError.response?.data,
            createErrorStatus: createError.response?.status,
            supabaseUrl: SUPABASE_URL.replace(/^(https:\/\/[^.]+).*$/, '$1.xxx') // Redacted for security
          })
        };
      }
    }
  } catch (error) {
    console.error('Error in debug-supabase:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to debug Supabase connection',
        message: error.message,
        stack: error.stack
      })
    };
  }
};
