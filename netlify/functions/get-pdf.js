// netlify/functions/get-pdf.js
const axios = require('axios');

exports.handler = async (event) => {
  // Get the bundleID from the query parameters
  const bundleID = event.queryStringParameters?.bundleID;
  
  if (!bundleID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing bundleID parameter' })
    };
  }
  
  try {
    // Get Supabase credentials
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Supabase credentials not found' })
      };
    }
    
    // Fetch the PDF data from Supabase
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/pending_orders?bundle_id=eq.${bundleID}&select=agreement_pdf,agreement_filename`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    // Check if data was found
    if (!response.data || response.data.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No PDF found for this bundle ID' })
      };
    }
    
    // Get the PDF data and filename
    const { agreement_pdf, agreement_filename } = response.data[0];
    
    if (!agreement_pdf) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'PDF data not found in record' })
      };
    }
    
    // Option 1: Return as downloadable PDF (uncomment to use)
    const filename = agreement_filename || `agreement_${bundleID}.pdf`;
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: agreement_pdf,
      isBase64Encoded: true
    };
    
    // Option 2: Return as JSON (uncomment to use)
    /*
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        filename: agreement_filename || `agreement_${bundleID}.pdf`,
        pdfData: agreement_pdf
      })
    };
    */
  } catch (error) {
    console.error('Error fetching PDF:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch PDF',
        message: error.message
      })
    };
  }
};
