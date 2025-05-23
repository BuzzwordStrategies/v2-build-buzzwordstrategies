const { testConnection, getBundle } = require('./utils/supabase-service');

exports.handler = async (event) => {
  const { bundle_id } = event.queryStringParameters || {};
  
  try {
    // Test basic connection
    const connectionTest = await testConnection();
    
    let bundleTest = null;
    if (bundle_id) {
      bundleTest = await getBundle(bundle_id);
    }
    
    // Check environment variables
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      NODE_ENV: process.env.NODE_ENV
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        connection: connectionTest,
        bundle: bundleTest,
        environment: envCheck,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      }, null, 2)
    };
  }
};
