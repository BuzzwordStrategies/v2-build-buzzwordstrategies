// netlify/functions/create-docusign-envelope.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  // Handle POST request only for simplicity
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { bundleID, bundleName, subLength, finalMonthly, selectedServices, clientEmail, clientName } = JSON.parse(event.body);

    // DocuSign credentials from environment variables
    const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;
    const DOCUSIGN_USER_ID = process.env.DOCUSIGN_USER_ID;
    const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
    const DOCUSIGN_BASE_URL = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi';
    const DOCUSIGN_PRIVATE_KEY = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, '\n');

    // Generate a bundleID if none provided
    const finalBundleID = bundleID || "BWB-" + Date.now();

    // Get JWT token
    const jwtToken = await getJWTToken(
      DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_USER_ID,
      DOCUSIGN_PRIVATE_KEY
    );

    // Create envelope from template using template custom fields
    const envelopeDefinition = {
      emailSubject: `Buzzword Strategies Bundle Agreement - ${bundleName}`,
      templateId: "ca675320-b73c-4d59-9b15-b7c071ffd196",
      templateRoles: [{
        email: clientEmail || 'client@example.com',
        name: clientName || 'Client Name',
        roleName: "Signer",
        clientUserId: "1" // For embedded signing
      }],
      status: "sent",
      customFields: {
        textCustomFields: [
          {
            name: "bundleID",
            value: finalBundleID
          },
          {
            name: "bundleName", 
            value: bundleName || "My Bundle"
          },
          {
            name: "subLength",
            value: subLength.toString()
          },
          {
            name: "finalMonthly", 
            value: finalMonthly.toString()
          },
          {
            name: "selectedServices",
            value: selectedServices || "No services selected"
          }
        ]
      }
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

    // Direct link to Stripe checkout instead of thank-you page
    const stripe_checkout_url = `https://ephemeral-moonbeam-0a8703.netlify.app/.netlify/functions/create-stripe-checkout?bundleID=${encodeURIComponent(finalBundleID)}&bundleName=${encodeURIComponent(bundleName || "My Bundle")}&finalMonthly=${encodeURIComponent(finalMonthly)}&subLength=${encodeURIComponent(subLength)}&selectedServices=${encodeURIComponent(selectedServices || "No services selected")}`;

    // Get the signing URL for embedded signing
    const envelopeId = response.data.envelopeId;
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
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to create DocuSign envelope', 
        details: error.message
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
