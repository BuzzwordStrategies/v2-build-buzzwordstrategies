// netlify/functions/create-docusign-envelope.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { bundleID, bundleName, subLength, finalMonthly, selectedServices, clientEmail, clientName, clientAddress, clientCity, clientState, clientZip, clientPhone } = JSON.parse(event.body);

    // DocuSign credentials
    const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;
    const DOCUSIGN_USER_ID = process.env.DOCUSIGN_USER_ID;
    const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
    const DOCUSIGN_BASE_URL = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi';
    const DOCUSIGN_PRIVATE_KEY = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, '\n');
    const DOCUSIGN_TEMPLATE_ID = process.env.DOCUSIGN_TEMPLATE_ID;

    // Generate a bundleID if none provided
    const finalBundleID = bundleID || "BWB-" + Date.now();

    // Get JWT token
    const jwtToken = await getJWTToken(
      DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_USER_ID,
      DOCUSIGN_PRIVATE_KEY
    );

    // Set up stripe checkout URL
    const stripe_checkout_url = `https://ephemeral-moonbeam-0a8703.netlify.app/.netlify/functions/create-stripe-checkout?bundleID=${encodeURIComponent(finalBundleID)}&bundleName=${encodeURIComponent(bundleName || "My Bundle")}&finalMonthly=${encodeURIComponent(finalMonthly)}&subLength=${encodeURIComponent(subLength)}&selectedServices=${encodeURIComponent(selectedServices || "No services selected")}`;

    // Create envelope definition using template
    const envelopeDefinition = {
      emailSubject: `Buzzword Strategies Marketing Agreement - ${bundleName}`,
      templateId: DOCUSIGN_TEMPLATE_ID,
      templateRoles: [
        {
          email: clientEmail || 'client@example.com',
          name: clientName || 'Client Name',
          roleName: "Client",
          clientUserId: "1", // For embedded signing
          tabs: {
            textTabs: [
              { tabLabel: "bundleID", value: finalBundleID },
              { tabLabel: "bundleName", value: bundleName || "Marketing Bundle" },
              { tabLabel: "subLength", value: subLength.toString() },
              { tabLabel: "finalMonthly", value: finalMonthly.toString() },
              { tabLabel: "selectedServices", value: selectedServices || "Marketing services" },
              { tabLabel: "clientName", value: clientName || "" },
              { tabLabel: "clientEmail", value: clientEmail || "" },
              { tabLabel: "clientAddress", value: clientAddress || "" },
              { tabLabel: "clientCity", value: clientCity || "" },
              { tabLabel: "clientState", value: clientState || "" },
              { tabLabel: "clientZip", value: clientZip || "" },
              { tabLabel: "clientPhone", value: clientPhone || "" },
              { tabLabel: "currentDate", value: new Date().toLocaleDateString() }
            ]
          }
        }
      ],
      status: "sent"
    };

    // Send the envelope
    const response = await axios.post(
      `${DOCUSIGN_BASE_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes`,
      envelopeDefinition,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("DocuSign envelope created:", response.data.envelopeId);

    // After creating the envelope successfully
    const envelopeId = response.data.envelopeId;
    
    // Save to Supabase
    await saveToSupabase({
      envelopeId,
      bundleID: finalBundleID,
      bundleName,
      subLength,
      finalMonthly,
      selectedServices,
      clientEmail,
      clientName,
      status: "pending_signature"
    });

    // Get the signing URL for embedded signing
    const viewRequest = {
      returnUrl: stripe_checkout_url,
      authenticationMethod: 'none',
      email: clientEmail || 'client@example.com',
      userName: clientName || 'Client Name',
      clientUserId: "1"
    };

    const signingUrlResponse = await axios.post(
      `${DOCUSIGN_BASE_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/views/recipient`,
      viewRequest,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ url: signingUrlResponse.data.url })
    };

  } catch (error) {
    console.error('Error creating DocuSign envelope:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to create DocuSign envelope', 
        details: error.message,
        response: error.response?.data
      })
    };
  }
};

async function getJWTToken(clientId, userId, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const later = now + 3600; // 1 hour from now

  const payload = {
    iss: clientId,
    sub: userId,
    aud: 'account-d.docusign.com',
    iat: now,
    exp: later,
    scope: 'signature impersonation'
  };

  // Create the JWT
  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  // Exchange JWT for access token
  const response = await axios.post(
    'https://account-d.docusign.com/oauth/token',
    new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data.access_token;
}

// Function to save envelope data to Supabase
async function saveToSupabase(data) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn('Supabase credentials not found, skipping database save');
      return;
    }
    
    // Format the data to match your pending_orders table structure
    const orderData = {
      bundle_id: data.bundleID,
      bundle_name: data.bundleName,
      sub_length: parseInt(data.subLength), // Ensure this is an integer
      final_monthly: parseFloat(data.finalMonthly), // Ensure this is numeric
      selected_services: data.selectedServices,
      customer_email: data.clientEmail,
      customer_name: data.clientName,
      status: data.status || 'pending_signature',
      docusign_envelope_id: data.envelopeId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/pending_orders`,
      orderData,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );
    
    console.log('Order data saved to Supabase successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving to Supabase:', error.response?.data || error.message);
    // Continue execution even if Supabase save fails
    return null;
  }
}
