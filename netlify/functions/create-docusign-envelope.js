// netlify/functions/create-docusign-envelope.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { bundleID, bundleName, subLength, finalMonthly, selectedServices, clientEmail, clientName } = JSON.parse(event.body);

    // DocuSign credentials from environment variables
    const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;
    const DOCUSIGN_USER_ID = process.env.DOCUSIGN_USER_ID;
    const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
    const DOCUSIGN_BASE_URL = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi';
    const DOCUSIGN_PRIVATE_KEY = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, '\n');

    // Get JWT token
    const jwtToken = await getJWTToken(
      DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_USER_ID,
      DOCUSIGN_PRIVATE_KEY
    );

    // Create the envelope
    const envelopeDefinition = {
      emailSubject: `Buzzword Strategies Bundle Agreement - ${bundleName}`,
      documents: [{
        documentBase64: await createContractPDF(bundleName, subLength, finalMonthly, selectedServices),
        name: 'Bundle Agreement',
        fileExtension: 'pdf',
        documentId: '1'
      }],
      recipients: {
        signers: [{
          email: clientEmail || 'client@example.com',
          name: clientName || 'Client Name',
          recipientId: '1',
          routingOrder: '1',
          clientUserId: '1', // This enables embedded signing
          tabs: {
            signHereTabs: [{
              documentId: '1',
              pageNumber: '1',
              recipientId: '1',
              tabLabel: 'SignHere',
              xPosition: '100',
              yPosition: '500'
            }],
            dateSignedTabs: [{
              documentId: '1',
              pageNumber: '1',
              recipientId: '1',
              tabLabel: 'DateSigned',
              xPosition: '300',
              yPosition: '500'
            }]
          }
        }]
      },
      status: 'sent'
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

    // Get the signing URL for embedded signing
    const envelopeId = response.data.envelopeId;
    const viewRequest = {
      returnUrl: 'https://build.buzzwordstrategies.com/thank-you',
      authenticationMethod: 'none',
      email: clientEmail || 'client@example.com',
      userName: clientName || 'Client Name',
      clientUserId: '1'
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
      body: JSON.stringify({ error: 'Failed to create DocuSign envelope', details: error.message })
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

async function createContractPDF(bundleName, subLength, finalMonthly, selectedServices) {
  // This is a simple text-based PDF for now
  // You might want to use a library like PDFKit for better formatting
  const pdfContent = `
BUZZWORD STRATEGIES BUNDLE AGREEMENT

Bundle Details:
--------------
Bundle Name: ${bundleName}
Subscription Length: ${subLength} months
Monthly Cost: $${finalMonthly}

Selected Services:
-----------------
${selectedServices}

Terms and Conditions:
--------------------
1. This agreement is for a ${subLength}-month subscription term.
2. The monthly fee of $${finalMonthly} will be charged monthly.
3. Services will begin upon contract execution.
4. Either party may terminate with 30 days written notice after the initial term.

By signing below, you agree to these terms.

_______________________________     _______________
Client Signature                    Date

_______________________________     
Client Name (Print)


_______________________________     _______________
Buzzword Strategies Representative  Date
`;

  // Convert to base64
  return Buffer.from(pdfContent).toString('base64');
}