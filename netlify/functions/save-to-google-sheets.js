// netlify/functions/save-to-google-sheets.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);

    // Google Sheets credentials
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

    // Initialize the document
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
    
    // Authentication
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    });

    // Load document properties and sheets
    await doc.loadInfo();
    
    // Get the first sheet
    const sheet = doc.sheetsByIndex[0];
    
    // Format date
    const timestamp = new Date().toISOString();
    
    // Add a row
    await sheet.addRow({
      timestamp,
      bundleID: data.bundleID,
      bundleName: data.bundleName,
      subLength: data.subLength,
      finalMonthly: data.finalMonthly,
      selectedServices: data.selectedServices,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientAddress: data.clientAddress,
      clientCity: data.clientCity,
      clientState: data.clientState,
      clientZip: data.clientZip,
      clientCompany: data.clientCompany,
      marketingConsent: data.marketingConsent ? 'Yes' : 'No',
      status: data.status,
      docusignEnvelopeId: data.docusignEnvelopeId,
      stripeSessionId: data.stripeSessionId
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data saved to Google Sheets successfully' })
    };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to save to Google Sheets', 
        details: error.message 
      })
    };
  }
};
