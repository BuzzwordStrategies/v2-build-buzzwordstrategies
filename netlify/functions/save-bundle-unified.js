// netlify/functions/save-bundle-unified.js
const { saveBundle, updateCustomerInfo, updateAgreement } = require('./utils/supabase-service');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { action, bundle_id, ...payload } = data;
    
    console.log('Received request:', { action, bundle_id, payload });
    
    let result;
    
    switch (action) {
      case 'save_bundle':
        // Save or update bundle configuration
        result = await saveBundle({ bundle_id, ...payload });
        break;
        
      case 'update_customer':
        // Update customer information
        if (!bundle_id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'bundle_id is required for customer update' })
          };
        }
        result = await updateCustomerInfo(bundle_id, payload);
        break;
        
      case 'save_agreement':
        // Save agreement and generate PDF
        if (!bundle_id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'bundle_id is required for agreement' })
          };
        }
        result = await updateAgreement(bundle_id, payload);
        break;
        
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
    
    if (result.success) {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: result.error || 'Operation failed',
          details: result 
        })
      };
    }
    
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
