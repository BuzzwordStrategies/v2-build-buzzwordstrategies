// netlify/functions/create-docusign-envelope.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  // Handle GET request - returns consent URL
  if (event.httpMethod === 'GET') {
    const consentUrl = generateConsentUrl(
      process.env.DOCUSIGN_INTEGRATION_KEY
    );
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: "Consent required for DocuSign. Visit this URL to authorize the application:",
        consentUrl: consentUrl
      })
    };
  }

  // Handle POST request - create envelope
  if (event.httpMethod === 'POST') {
    try {
      const { bundleID, bundleName, subLength, finalMonthly, selectedServices, clientEmail, clientName } = JSON.parse(event.body);

      // DocuSign credentials from environment variables
      const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;
      const DOCUSIGN_USER_ID = process.env.DOCUSIGN_USER_ID;
      const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
      const DOCUSIGN_BASE_URL = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi';
      const DOCUSIGN_PRIVATE_KEY = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, '\n');

      // Get JWT token
      let jwtToken;
      try {
        jwtToken = await getJWTToken(
          DOCUSIGN_INTEGRATION_KEY,
          DOCUSIGN_USER_ID,
          DOCUSIGN_PRIVATE_KEY
        );
        console.log('JWT token obtained successfully');
      } catch (error) {
        if (error.response?.data?.error === 'consent_required') {
          const consentUrl = generateConsentUrl(DOCUSIGN_INTEGRATION_KEY);
          return {
            statusCode: 401,
            body: JSON.stringify({
              error: 'DocuSign consent required',
              message: 'Application requires authorization in DocuSign',
              consentUrl: consentUrl
            })
          };
        } else {
          throw error;
        }
      }

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
              value: bundleID || "BWB-" + Date.now()
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

      console.log('Sending envelope definition with template variables:', JSON.stringify(envelopeDefinition));

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

      console.log('Envelope created successfully:', response.data.envelopeId);

      // Get the signing URL for embedded signing
      const envelopeId = response.data.envelopeId;
      const viewRequest = {
        returnUrl: 'https://ephemeral-moonbeam-0a8703.netlify.app/thank-you',
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
      console.error('Full error details:', JSON.stringify(error.response?.data || error.message, null, 2));
      
      // Check if the error is consent_required
      if (error.response?.data?.error === 'consent_required') {
        const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;
        const consentUrl = generateConsentUrl(DOCUSIGN_INTEGRATION_KEY);
        
        return {
          statusCode: 401,
          body: JSON.stringify({
            error: 'DocuSign consent required',
            message: 'Please visit the following URL to authorize this application with DocuSign:',
            consentUrl: consentUrl
          })
        };
      }
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to create DocuSign envelope', 
          details: error.message,
          responseData: error.response?.data
        })
      };
    }
  }

  // Handle other HTTP methods
  return { 
    statusCode: 405, 
    body: JSON.stringify({ error: 'Method Not Allowed' })
  };
};

// Helper function to generate the consent URL
function generateConsentUrl(integrationKey) {
  const docusignOAuthUrl = 'https://account-d.docusign.com/oauth/auth';
  const params = new URLSearchParams({
    response_type: 'code',
    scope: 'signature impersonation',
    client_id: integrationKey,
    redirect_uri: 'https://ephemeral-moonbeam-0a8703.netlify.app/auth-callback'
  });
  
  return `${docusignOAuthUrl}?${params.toString()}`;
}

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
  try {
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
  } catch (error) {
    console.error('JWT token exchange failed:', error.response?.data || error.message);
    throw error;
  }
}
