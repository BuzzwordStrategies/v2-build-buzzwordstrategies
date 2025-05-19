// netlify/functions/get-agreement-pdf.js
const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const bundleID = event.queryStringParameters?.bundleID;
  
  if (!bundleID) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing bundleID parameter' }) };
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Supabase credentials not found' }) };
    }
    
    // Query Supabase for the agreement PDF
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${bundleID}&select=agreement_pdf,agreement_filename`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    if (!response.data || response.data.length === 0 || !response.data[0].agreement_pdf) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Agreement not found' }) };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        pdfData: response.data[0].agreement_pdf,
        filename: response.data[0].agreement_filename || `agreement_${bundleID}.pdf`
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
