// Create a new file: netlify/functions/generate-agreement-pdf.js

const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    const {
      bundleID,
      clientName,
      bundleName,
      selectedServices,
      subLength,
      finalMonthly,
      agreementDate,
      signatureName
    } = data;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Add a page to the document
    const page = pdfDoc.addPage([612, 792]); // 8.5 x 11 inches
    const { width, height } = page.getSize();
    
    // Set font size and line height
    const fontSize = 11;
    const lineHeight = 14;
    let y = height - 50; // Start from top with margin
    
    // Helper function to add text and move cursor down
    const addText = (text, font = timesRomanFont, size = fontSize) => {
      page.drawText(text, {
        x: 50,
        y,
        font,
        size,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
      });
      y -= lineHeight;
    };
    
    // Add title
    addText('MARKETING SERVICES AGREEMENT', timesRomanBoldFont, 16);
    y -= 10; // Add spacing after title
    
    // Add introduction
    addText(`This Marketing Services Agreement (the "Agreement") is made and entered into as of ${agreementDate},`);
    addText('by and between Buzzword Strategies LLC ("Agency") and ' + clientName + ' ("Client").');
    y -= 10;
    
    // Add agreement details
    addText(`Selected Bundle: ${bundleName || 'Marketing Bundle'}`, timesRomanBoldFont);
    addText(`Selected Services: ${selectedServices}`, timesRomanBoldFont);
    addText(`Subscription Length: ${subLength} months`, timesRomanBoldFont);
    addText(`Monthly Fee: $${finalMonthly}`, timesRomanBoldFont);
    y -= 10;
    
    // Add terms and conditions
    // Note: This is a simplified version. The real PDF would include all agreement terms
    addText('TERMS AND CONDITIONS', timesRomanBoldFont, 14);
    y -= 5;
    
    addText('1. SERVICES', timesRomanBoldFont);
    addText('Agency agrees to provide Client with the marketing services as specified in the selected bundle and tiers.');
    y -= 5;
    
    addText('2. TERM AND TERMINATION', timesRomanBoldFont);
    addText(`This Agreement shall commence on the Effective Date and continue for the initial subscription period of ${subLength} months,`);
    addText('automatically renewing monthly thereafter unless canceled with 30 days\' notice.');
    y -= 5;
    
    // Add additional terms (abbreviated)
    addText('3. FEES AND PAYMENT', timesRomanBoldFont);
    addText(`Client shall pay Agency a monthly fee of $${finalMonthly} in advance for the duration of this Agreement.`);
    y -= 5;
    
    // Skip to signature section (for brevity)
    y = 150;
    
    addText('By signing below, Client acknowledges having read, understood, and agreed to all terms and conditions of this Agreement.', timesRomanFont);
    y -= 20;
    
    addText('CLIENT SIGNATURE:', timesRomanBoldFont);
    addText(`Name: ${signatureName}`);
    addText(`Date: ${agreementDate}`);
    addText(`Bundle ID: ${bundleID}`);
    y -= 20;
    
    addText('ELECTRONIC SIGNATURE ACKNOWLEDGMENT:', timesRomanBoldFont, 10);
    addText('Client agrees that the electronic signature above has the same legal validity and effect as a handwritten signature.', timesRomanFont, 10);
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    
    // In a real implementation, you would save this to Supabase
    // For now, we'll just return it for testing
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        pdfBase64,
        message: "Agreement PDF generated successfully"
      })
    };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate PDF',
        message: error.message
      })
    };
  }
};
