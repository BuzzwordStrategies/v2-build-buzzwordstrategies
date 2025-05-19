// netlify/functions/get-agreement-pdf.js
const axios = require('axios');

exports.handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  // Get bundleID from query parameters
  const bundleID = event.queryStringParameters?.bundleID;
  
  if (!bundleID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameter: bundleID' })
    };
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Supabase credentials not found' })
      };
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
    
    // Check if we found an agreement
    if (!response.data || response.data.length === 0 || !response.data[0].agreement_pdf) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Agreement not found' })
      };
    }
    
    const { agreement_pdf, agreement_filename } = response.data[0];
    
    // Option 1: Return PDF as base64 for displaying in browser
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        pdfData: agreement_pdf,
        filename: agreement_filename
      })
    };
    
    // Option 2: Return PDF for download (uncomment this to use instead of Option 1)
    /*
    const pdfBuffer = Buffer.from(agreement_pdf, 'base64');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${agreement_filename}"`,
        'Content-Length': pdfBuffer.length.toString()
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true
    };
    */
  } catch (error) {
    console.error('Error fetching agreement PDF:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to retrieve agreement PDF',
        message: error.message,
        details: error.response?.data || error.stack
      })
    };
  }
};
