// netlify/functions/create-docusign-envelope.js
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { bundleID, bundleName, subLength, finalMonthly, selectedServices, clientEmail, clientName, clientAddress, clientCity, clientState, clientZip, clientPhone } = JSON.parse(event.body);

    // DocuSign credentials
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

    // Direct link to Stripe checkout
    const stripe_checkout_url = `https://ephemeral-moonbeam-0a8703.netlify.app/.netlify/functions/create-stripe-checkout?bundleID=${encodeURIComponent(finalBundleID)}&bundleName=${encodeURIComponent(bundleName || "My Bundle")}&finalMonthly=${encodeURIComponent(finalMonthly)}&subLength=${encodeURIComponent(subLength)}&selectedServices=${encodeURIComponent(selectedServices || "No services selected")}`;

    // Generate the document content with all legal terms
    const documentContent = generateContractDocument(finalBundleID, bundleName, subLength, finalMonthly, selectedServices);

    // Convert the document content to base64
    const documentBase64 = Buffer.from(documentContent).toString('base64');

    // Create the envelope definition with document and tabs
    const envelopeDefinition = {
      emailSubject: `Buzzword Strategies Bundle Agreement - ${bundleName}`,
      documents: [
        {
          documentBase64: documentBase64,
          name: "Marketing Services Agreement",
          fileExtension: "html",
          documentId: "1"
        }
      ],
      recipients: {
        signers: [
          {
            email: clientEmail || 'client@example.com',
            name: clientName || 'Client Name',
            recipientId: "1",
            routingOrder: "1",
            clientUserId: "1", // For embedded signing
            tabs: {
              signHereTabs: [
                {
                  documentId: "1",
                  pageNumber: "6",
                  xPosition: "150",
                  yPosition: "715"
                },
                {
                  documentId: "1",
                  pageNumber: "8",
                  xPosition: "150", 
                  yPosition: "980"
                }
              ],
              initialHereTabs: [
                {
                  documentId: "1",
                  pageNumber: "2",
                  xPosition: "650",
                  yPosition: "410"
                },
                {
                  documentId: "1",
                  pageNumber: "3", 
                  xPosition: "650",
                  yPosition: "375" 
                }
              ],
              textTabs: [
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "170",
                  yPosition: "175",
                  width: "200",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientName",
                  value: clientName || ""
                },
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "170",
                  yPosition: "205",
                  width: "350",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientAddress",
                  value: clientAddress || ""
                },
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "170",
                  yPosition: "235",
                  width: "200",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientCity",
                  value: clientCity || ""
                },
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "170",
                  yPosition: "265",
                  width: "200",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientState",
                  value: clientState || ""
                },
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "320",
                  yPosition: "265",
                  width: "100",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientZIP",
                  value: clientZip || ""
                },
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "250",
                  yPosition: "295",
                  width: "200",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientPhone",
                  value: clientPhone || ""
                },
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "285",
                  yPosition: "325",
                  width: "250",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientEmail",
                  value: clientEmail || ""
                },
                {
                  documentId: "1",
                  pageNumber: "1",
                  xPosition: "260",
                  yPosition: "355",
                  width: "100",
                  height: "22",
                  required: "true",
                  tabLabel: "EffectiveDate"
                },
                {
                  documentId: "1",
                  pageNumber: "2",
                  xPosition: "250",
                  yPosition: "680",
                  width: "200",
                  height: "22",
                  required: "true",
                  tabLabel: "PaymentMethod"
                },
                {
                  documentId: "1",
                  pageNumber: "6",
                  xPosition: "240",
                  yPosition: "205",
                  width: "150",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientTitle"
                },
                {
                  documentId: "1",
                  pageNumber: "6",
                  xPosition: "500",
                  yPosition: "205",
                  width: "150",
                  height: "22",
                  required: "true",
                  tabLabel: "ClientSignDate"
                }
              ]
            }
          }
        ]
      },
      status: "sent"
    };

    console.log("Sending envelope definition:", JSON.stringify(envelopeDefinition.recipients, null, 2));

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

    // Save envelope data to Supabase
    await saveToSupabase({
      envelopeId: response.data.envelopeId,
      bundleID: finalBundleID,
      bundleName,
      subLength,
      finalMonthly,
      selectedServices,
      clientEmail,
      clientName,
      clientAddress,
      clientCity,
      clientState,
      clientZip,
      clientPhone,
      status: "sent"
    });

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

// Function to generate the entire contract document with proper formatting
function generateContractDocument(bundleID, bundleName, subLength, finalMonthly, selectedServices) {
  // Create HTML document with CSS styling
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Marketing Services Agreement</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.4;
        margin: 30px;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo {
        max-width: 200px;
        margin-bottom: 20px;
      }
      h1 {
        font-size: 16pt;
        text-align: center;
        margin-bottom: 20px;
      }
      h2 {
        font-size: 12pt;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      .parties {
        margin-bottom: 20px;
      }
      .section {
        margin-bottom: 15px;
      }
      .signature {
        margin-top: 40px;
      }
      .field {
        border-bottom: 1px solid #000;
        min-width: 150px;
        display: inline-block;
      }
      .form-field {
        min-height: 22px;
        border-bottom: 1px solid #000;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img class="logo" src="https://buzzwordstrategies.com/logo.png" alt="Buzzword Strategies Logo">
      <h1>MARKETING SERVICES AGREEMENT</h1>
      <p>Auto-Filling Service Contract</p>
    </div>
    
    <div class="parties">
      <p><strong>BETWEEN:</strong> BUZZWORD STRATEGIES LLC (hereinafter referred to as "Agency") 1603 Capitol Ave Ste 415 
      #465784 Cheyenne, WY 82001 (508) 789-7369 josh@buzzwordstrategies.com</p>
      
      <p><strong>AND:</strong></p>
      <p class="form-field" data-tab-id="ClientName">____________________ (hereinafter referred to as "Client")</p>
      <p class="form-field" data-tab-id="ClientAddress">Street Address: ____________________</p>
      <p class="form-field" data-tab-id="ClientCity">City: ____________________</p>
      <p class="form-field" data-tab-id="ClientState">State: ____________________</p>
      <p class="form-field" data-tab-id="ClientZIP">ZIP: ____________________</p>
      <p class="form-field" data-tab-id="ClientPhone">Phone Number: ____________________</p>
      <p class="form-field" data-tab-id="ClientEmail">Email Address: ____________________</p>
      <p class="form-field" data-tab-id="EffectiveDate">EFFECTIVE DATE: ____________________</p>
    </div>
    
    <div class="section">
      <h2>SERVICES</h2>
      <p><strong>1.1 Scope of Services</strong> Agency agrees to provide Client with marketing services (the "Services") as described in the attached Statement of Work ("SOW"), which is incorporated by reference into this Agreement. Any additional services not specified in the SOW must be authorized by Client in writing and may be subject to additional fees.</p>
      
      <p><strong>1.2 Statement of Work</strong> Each SOW shall include, at minimum: Detailed description of Services to be provided Deliverables and timelines Fee structure and payment schedule Client responsibilities and requirements Any other project-specific terms The Statement of Work attached as Exhibit A will automatically populate based on the service package and tier selected by the Client. The specific services, deliverables, frequency, and performance metrics will correspond to the package selected during the sales process.</p>
      
      <p><strong>1.3 Change Orders</strong> Any modifications to the Services outlined in the SOW will require a Change Order. Change Orders must be in writing and signed by both parties. Agency reserves the right to adjust fees and timelines based on approved Change Orders.</p>
    </div>
    
    <div class="section">
      <h2>TERM AND TERMINATION</h2>
      <p><strong>2.1 Term</strong> This Agreement shall commence on the Effective Date and shall continue until completion of the Services as outlined in the SOW, unless terminated earlier as provided herein.</p>
      
      <p><strong>2.2 Termination for Convenience</strong> Either party may terminate this Agreement upon thirty (30) days' written notice to the other party.</p>
      
      <p><strong>2.3 Termination for Cause</strong> Either party may terminate this Agreement immediately upon written notice if the other party: Breaches any material term of this Agreement and fails to cure such breach within fifteen (15) days of receiving written notice of the breach; Becomes insolvent, files for bankruptcy, or makes an assignment for the benefit of creditors; or Engages in illegal, fraudulent, or unethical business practices.</p>
      
      <p><strong>2.4 Effect of Termination</strong> Upon termination of this Agreement: Client shall pay Agency for all Services performed up to the date of termination; Agency shall promptly deliver to Client all materials and deliverables completed or in progress as of the date of termination; All licenses granted under this Agreement shall terminate, except as otherwise specified herein; The rights and obligations of the parties under Sections 4, 5, 6, 7, 8, 9, 10, and 11 shall survive termination.</p>
      
      <p><strong>2.5 Early Termination and Cancellation Fees</strong> If Client terminates this Agreement for convenience before completion of the ${subLength}-month term, Client shall pay: An early termination fee equal to 25% of the remaining contract value (calculated as the monthly fee multiplied by the number of months remaining in the term) These fees shall be due immediately upon termination and are in addition to any other amounts owed for Services performed prior to termination.</p>
      <p class="form-field">Initial here: _______</p>
    </div>
    
    <div class="section">
      <h2>FEES AND PAYMENT</h2>
      <p><strong>3.1 Fees</strong> Client shall pay Agency the fees set forth in this Agreement, specifically the monthly fee of $${finalMonthly} USD for the duration of the ${subLength}-month subscription. All fees are exclusive of taxes, which shall be Client's responsibility.</p>
      
      <p><strong>3.2 Expenses</strong> Client shall reimburse Agency for all reasonable out-of-pocket expenses incurred in connection with the Services, provided such expenses are approved in advance in writing by Client and supported by appropriate documentation.</p>
      
      <p><strong>3.3 Payment Terms</strong> Payment is made in advance of services rendered. Client shall pay Agency according to the following schedule: First payment: Due upon contract signing (covering days 1-30) Second payment: Due on day 31 (covering days 31-60) Third payment: Due on day 61 (covering days 61-90) Subsequent payments: Due every 30 days thereafter for the duration of the subscription All payments shall be processed automatically using the payment method provided by Client upon contract signing. Late payments shall bear interest at a rate of 1.5% per month or the maximum rate permitted by law, whichever is less.</p>
      <p class="form-field" data-tab-id="PaymentMethod">Payment method: ____________________</p>
      
      <p><strong>3.4 Disputed Invoices</strong> If Client disputes any portion of a charge, Client shall notify Agency in writing within five (5) business days of the charge date, specifying the amount and basis of the dispute. Client shall pay the undisputed portion of the charge according to the payment terms, and the parties shall work in good faith to resolve the disputed portion promptly.</p>
      <p class="form-field">Initial here: _______</p>
    </div>
    
    <div class="section">
      <h2>INTELLECTUAL PROPERTY RIGHTS</h2>
      <p><strong>4.1 Agency Materials</strong> Agency retains all right, title, and interest in and to all materials, concepts, know-how, techniques, processes, methodologies, and intellectual property owned or developed by Agency prior to or independent of this Agreement ("Agency Materials"). Agency grants Client a non-exclusive, non-transferable license to use Agency Materials solely in connection with the Services and deliverables provided under this Agreement for the duration of the Agreement.</p>
      
      <p><strong>4.2 Client Materials</strong> Client retains all right, title, and interest in and to all materials, information, and intellectual property provided by Client to Agency in connection with this Agreement ("Client Materials"). Client grants Agency a non-exclusive, non-transferable license to use Client Materials solely for the purpose of providing the Services under this Agreement.</p>
      
      <p><strong>4.3 Deliverables</strong> Upon full payment of all fees and expenses due under this Agreement, Agency grants Client a non-exclusive, non-transferable license to use the deliverables created for Client under this Agreement, excluding Agency Materials and Third-Party Materials. The ownership of all deliverables remains with Agency.</p>
      
      <p><strong>4.4 Third-Party Materials</strong> Deliverables may incorporate third-party materials, including but not limited to stock photos, software, and fonts ("Third-Party Materials"). Client's use of Third-Party Materials shall be subject to the applicable third-party licenses. Agency shall notify Client of any Third-Party Materials incorporated into the deliverables and any associated limitations or restrictions.</p>
      <p class="form-field">Initial here: _______</p>
    </div>
    
    <div class="section">
      <h2>CONFIDENTIALITY</h2>
      <p><strong>5.1 Definition</strong> "Confidential Information" means all non-public information disclosed by one party ("Disclosing Party") to the other party ("Receiving Party"), whether orally, in writing, or by other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, but is not limited to, business plans, marketing strategies, customer lists, financial information, trade secrets, and proprietary technology.</p>
      
      <p><strong>5.2 Obligations</strong> The Receiving Party shall: Use Confidential Information solely for the purpose of performing its obligations under this Agreement; Protect Confidential Information using the same degree of care it uses to protect its own confidential information, but no less than reasonable care; Not disclose Confidential Information to any third party without the Disclosing Party's prior written consent, except to employees, agents, or contractors who need to know such information and who are bound by obligations of confidentiality at least as restrictive as those contained herein; Promptly notify the Disclosing Party of any unauthorized use or disclosure of Confidential Information.</p>
      
      <p><strong>5.3 Exceptions</strong> The obligations in Section 5.2 shall not apply to information that: Is or becomes publicly available through no fault of the Receiving Party; Was known to the Receiving Party prior to disclosure by the Disclosing Party; Is rightfully received by the Receiving Party from a third party without a duty of confidentiality; Is independently developed by the Receiving Party without reference to or use of the Disclosing Party's Confidential Information; or is required to be disclosed by law or court order, provided that the Receiving Party gives the Disclosing Party prompt written notice of such requirement and cooperates with the Disclosing Party in seeking a protective order or other appropriate remedy.</p>
      
      <p><strong>5.4 Duration</strong> The obligations of confidentiality under this Section shall survive the termination of this Agreement for a period of three (3) years, except for trade secrets, which shall be maintained in confidence for as long as the information remains a trade secret under applicable law.</p>
    </div>
    
    <div class="section">
      <h2>REPRESENTATIONS AND WARRANTIES</h2>
      <p><strong>6.1 Mutual Representations and Warranties</strong> Each party represents and warrants that: It has the full right, power, and authority to enter into and perform this Agreement; Its performance under this Agreement will not conflict with any other obligation to any third party; and It will comply with all applicable laws, rules, and regulations in performing its obligations under this Agreement.</p>
      
      <p><strong>6.2 Agency Representations and Warranties</strong> Agency represents and warrants that: The Services will be performed in a professional and workmanlike manner in accordance with industry standards; the deliverables, excluding Client Materials and Third-Party Materials, will not infringe or misappropriate any third party's intellectual property rights; and agency has all necessary rights and licenses to provide the Services and deliverables under this Agreement.</p>
      
      <p><strong>6.3 Client Representations and Warranties</strong> Client represents and warrants that: All Client Materials provided to Agency are owned by Client or Client has the right to use and provide them to Agency for use in connection with the Services; Client Materials do not and will not infringe or misappropriate any third party's intellectual property rights; and Client will review and approve all deliverables and materials before publication or use in marketing campaigns.</p>
      
      <p><strong>6.4 Disclaimer of Warranties</strong> EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, EACH PARTY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. AGENCY MAKES NO WARRANTY THAT THE SERVICES WILL ACHIEVE ANY PARTICULAR RESULT OR OUTCOME FOR CLIENT'S BUSINESS.</p>
    </div>
    
    <div class="section">
      <h2>LIMITATION OF LIABILITY</h2>
      <p><strong>7.1 Exclusion of Damages</strong> IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THIS AGREEMENT, EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
      
      <p><strong>7.2 Cap on Liability</strong> EXCEPT FOR BREACHES OF SECTIONS 4 (INTELLECTUAL PROPERTY RIGHTS) AND 5 (CONFIDENTIALITY), EACH PARTY'S TOTAL CUMULATIVE LIABILITY TO THE OTHER PARTY FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATING TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT, OR OTHERWISE, SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY CLIENT TO AGENCY UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</p>
      
      <p><strong>7.3 Essential Purpose</strong> THE LIMITATIONS OF LIABILITY IN THIS SECTION 7 SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY AND ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE BARGAIN BETWEEN THE PARTIES.</p>
    </div>
    
    <div class="section">
      <h2>INDEMNIFICATION</h2>
      <p><strong>8.1 Agency Indemnification</strong> Agency shall defend, indemnify, and hold harmless Client and its officers, directors, employees, and agents from and against any third-party claims, actions, suits, proceedings, and demands, and all damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: Agency's breach of any representation, warranty, or covenant in this Agreement; Agency's negligence or willful misconduct; or Any allegation that the deliverables, excluding Client Materials and Third-Party Materials, infringe or misappropriate any third party's intellectual property rights.</p>
      
      <p><strong>8.2 Client Indemnification</strong> Client shall defend, indemnify, and hold harmless Agency and its officers, directors, employees, and agents from and against any third-party claims, actions, suits, proceedings, and demands, and all damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: Client's breach of any representation, warranty, or covenant in this Agreement; Client's negligence or willful misconduct; Any allegation that Client Materials infringe or misappropriate any third party's intellectual property rights; or Client's use of the deliverables in a manner not authorized by this Agreement.</p>
      
      <p><strong>8.3 Indemnification Procedure</strong> The indemnified party shall: Promptly notify the indemnifying party in writing of any claim, action, suit, or proceeding for which indemnification is sought; Give the indemnifying party sole control of the defense and settlement of the claim; and Provide reasonable cooperation to the indemnifying party at the indemnifying party's expense. The indemnified party may participate in the defense at its own expense.</p>
    </div>
    
    <div class="section">
      <h2>RESULTS AND PERFORMANCE</h2>
      <p><strong>9.1 No Guarantees</strong> Agency does not make any guarantees, representations, or warranties regarding the results or performance of the Services. Marketing outcomes depend on numerous factors beyond Agency's control, including but not limited to market conditions, competition, Client's products/services, and Client's implementation of recommendations.</p>
      
      <p><strong>9.2 Performance Expectations</strong> Any discussions about potential outcomes or results are estimates only and are not guaranteed. Actual results may vary based on factors beyond Agency's control.</p>
      
      <p><strong>9.3 Client Responsibilities</strong> Client acknowledges that successful marketing outcomes require Client's active participation and timely fulfillment of Client responsibilities as outlined in the SOW. Failure by Client to fulfill these responsibilities may impact results and shall not constitute grounds for non-payment or termination for cause.</p>
    </div>
    
    <div class="section">
      <h2>DATA PRIVACY AND COMPLIANCE</h2>
      <p><strong>10.1 Data Privacy</strong> Each party shall comply with all applicable data protection and privacy laws, rules, and regulations. Client shall obtain all necessary consents and provide all required notices to individuals whose personal data may be processed in connection with the Services.</p>
      
      <p><strong>10.2 Regulatory Compliance</strong> Client is responsible for ensuring that all marketing materials and campaigns comply with applicable laws, rules, and regulations, including without limitation those related to advertising, marketing, consumer protection, intellectual property, data privacy, and industry-specific regulations. Agency will provide guidance based on its professional expertise but cannot provide legal advice.</p>
    </div>
    
    <div class="section">
      <h2>GENERAL PROVISIONS</h2>
      <p><strong>11.1 Independent Contractors</strong> The relationship between the parties is that of independent contractors. Nothing in this Agreement shall be construed to create a partnership, joint venture, agency, or employment relationship between the parties.</p>
      
      <p><strong>11.2 Non-Solicitation</strong> During the term of this Agreement and for one (1) year thereafter, neither party shall directly or indirectly solicit or hire any employee or contractor of the other party who was involved in the provision or receipt of Services under this Agreement, without the other party's prior written consent.</p>
      
      <p><strong>11.3 Force Majeure</strong> Neither party shall be liable for any delay or failure to perform its obligations under this Agreement due to causes beyond its reasonable control, including but not limited to acts of God, natural disasters, terrorism, war, civil unrest, labor disputes, or government actions.</p>
      
      <p><strong>11.4 Assignment</strong> Neither party may assign or transfer this Agreement, in whole or in part, without the other party's prior written consent, which shall not be unreasonably withheld. Any attempted assignment in violation of this Section shall be null and void. This Agreement shall be binding upon and inure to the benefit of the parties and their respective successors and permitted assigns.</p>
      
      <p><strong>11.5 Notices</strong> All notices under this Agreement shall be in writing and shall be delivered by hand, certified mail (return receipt requested), or overnight courier to the address specified by the receiving party. Notices shall be effective upon receipt.</p>
      
      <p><strong>11.6 No Waiver</strong> The failure of either party to enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision.</p>
      
      <p><strong>11.7 Severability</strong> If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall continue in full force and effect, and the invalid or unenforceable provision shall be replaced by a valid and enforceable provision that most closely approximates the intent and economic effect of the original provision.</p>
      
      <p><strong>11.8 Entire Agreement</strong> This Agreement, together with the SOW and any exhibits or attachments, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous communications, representations, or agreements, whether oral or written.</p>
      
      <p><strong>11.9 Amendment</strong> This Agreement may be amended only by a written instrument signed by both parties.</p>
      
      <p><strong>11.10 Governing Law</strong> This Agreement shall be governed by and construed in accordance with the laws of Wyoming, without regard to its conflict of laws principles.</p>
      
      <p><strong>11.11 Dispute Resolution</strong> Any dispute arising out of or relating to this Agreement shall be resolved as follows: The parties shall first attempt to resolve the dispute through good-faith negotiation. If the dispute cannot be resolved through negotiation within thirty (30) days, the parties shall submit the dispute to mediation under the rules of the American Arbitration Association. If the dispute cannot be resolved through mediation within sixty (60) days, either party may file suit in the state or federal courts located in Wyoming, which shall have exclusive jurisdiction over any such dispute.</p>
      
      <p><strong>11.12 Attorneys' Fees</strong> In any action to enforce this Agreement, the prevailing party shall be entitled to recover its costs and reasonable attorneys' fees.</p>
      
      <p><strong>11.13 Counterparts</strong> This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed original signatures.</p>
    </div>
    
    <div class="section">
      <h2>PORTFOLIO RIGHTS AND CASE STUDIES</h2>
      <p>Agency may include a general description of the Services provided to Client in Agency's portfolio and marketing materials. Agency may develop case studies or white papers regarding the Services, subject to Client's prior written approval, which shall not be unreasonably withheld.</p>
    </div>
    
    <div class="section">
      <h2>FEEDBACK AND TESTIMONIALS</h2>
      <p>Client agrees that Agency may request feedback and testimonials regarding the Services. Any testimonials provided by Client may be used by Agency in its marketing materials, subject to Client's prior written approval.</p>
    </div>
    
    <div class="signature">
      <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the Effective Date.</p>
      
      <p><strong>BUZZWORD STRATEGIES LLC</strong></p>
      <p>By: Joshua Kelley Cook</p>
      <p>Name: Joshua Kelley Cook</p>
      <p>Title: Owner</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      
      <div style="margin-top: 50px;">
        <p><strong>CLIENT:</strong></p>
        <p>By: ____________________</p>
        <p>Name: <span class="form-field" data-tab-id="ClientName">____________________</span></p>
        <p>Title: <span class="form-field" data-tab-id="ClientTitle">____________________</span></p>
        <p>Date: <span class="form-field" data-tab-id="ClientSignDate">____________________</span></p>
      </div>
    </div>
    
    <div style="page-break-before: always;">
      <h1>EXHIBIT A: STATEMENT OF WORK for ${bundleID}</h1>
      <h2>SELECTED BUNDLE DETAILS</h2>
      
      <div class="section">
        <h3>CLIENT BUNDLE INFORMATION</h3>
        <p><strong>Bundle Name:</strong> ${bundleName || "My Bundle"}</p>
        <p><strong>Subscription Length:</strong> ${subLength} months</p>
        <p><strong>Monthly Fee:</strong> $${finalMonthly} USD</p>
      </div>
      
      <div class="section">
        <h3>SELECTED SERVICES</h3>
        <p>Client has selected the following services from Buzzword Strategies LLC:</p>
        <p>${selectedServices || "No services selected"}</p>
        
        <div style="margin-top: 40px;">
          <h3>Digital Marketing Service Tiers</h3>
          
          <p><strong>Google Ads</strong></p>
          <p><em>Base:</em> $0-2.5K budget | Search/Display campaigns | Basic targeting | Pixel + conversion setup | Keyword research | Negative keywords | Ad creation & extensions | Retargeting | Weekly reviews</p>
          <p><em>Standard:</em> $2.5-5K budget | All Base features | Enhanced keyword research | Advanced targeting | Comprehensive ad testing | Detailed reporting</p>
          <p><em>Premium:</em> $5K+ budget | All Standard features | Keyword expansion | Performance Max | Dedicated strategist | Full funnel buildout | Advanced conversion tracking</p>
          
          <p><strong>Meta Ads</strong></p>
          <p><em>Base:</em> $0-2.5K budget | 3 graphics | Campaign build | Pixel setup | Basic targeting | Ad copy creation | Retargeting | Weekly reviews</p>
          <p><em>Standard:</em> $2.5-5K budget | 6 graphics | All Base features | Enhanced targeting | Ad copy & budget guidance | Optimized retargeting</p>
          <p><em>Premium:</em> $5K+ budget | 9 graphics | Unlimited creative sets | Conversion testing | Advanced targeting | Full funnel strategy | Comprehensive insights</p>
          
          <p><strong>TikTok Ads</strong></p>
          <p><em>Base:</em> $0-2.5K budget | Campaign build | Pixel setup | Basic targeting | Ad copy creation | Budget recommendations</p>
          <p><em>Standard:</em> $2.5-5K budget | All Base features | Enhanced targeting | Ad testing | Conversion optimization | Performance insights</p>
          <p><em>Premium:</em> $5K+ budget | UGC coordination | Advanced targeting | Scaling strategy | Comprehensive optimization | Detailed analytics</p>
          
          <p><strong>SEO</strong></p>
          <p><em>Base:</em> 10 keywords | Analytics & GSC setup | XML sitemap | Schema setup | On-page audits | Basic optimizations | Monthly reporting</p>
          <p><em>Standard:</em> 20 keywords | All Base features | Enhanced schema | Alt/title tag SEO | Comprehensive backlink audits | Detailed reporting</p>
          <p><em>Premium:</em> 40 keywords | All Standard features | Backlink strategy | Technical SEO audit | Complete optimization | Advanced performance tracking</p>
          
          <p><strong>GMB Ranker</strong></p>
          <p><em>Base:</em> 1 image/week | Monthly Q&A | AI review replies | Image optimization | Content verification</p>
          <p><em>Standard:</em> 3 images/week | Bi-weekly Q&A | All Base features | Enhanced AI training | More frequent optimization</p>
          <p><em>Premium:</em> Daily images | Weekly Q&A | All Standard features | Human verification | Custom AI tuning | Advanced image drip</p>
          
          <p><strong>Backlinks</strong></p>
          <p><em>Base:</em> DA 10+ | 10 backlinks | 13 in-content links | Various backlink types | Monthly report</p>
          <p><em>Standard:</em> DA 30+ | 15 backlinks | 23 in-content links | Enhanced variety | 500-word blog content</p>
          <p><em>Premium:</em> DA 50+ | 20 backlinks | 41 in-content links | Maximum diversity | 1,000-word blog content | Web 2.0 posting</p>
          
          <p><strong>Content</strong></p>
          <p><em>Base:</em> 1 article/month | 500 words | AI GPT-4o written | SEO keywords | Human reviewed | Publishing</p>
          <p><em>Standard:</em> 2 articles/month | 1,000 words | All Base features | Enhanced SEO | In-depth research</p>
          <p><em>Premium:</em> 4 articles/month | 2,000 words | All Standard features | Advanced research | Comprehensive SEO</p>
          
          <p><strong>Social Posts</strong></p>
          <p><em>Base:</em> 1 post/week (4/month) | 1 channel | Licensed images | Quality assurance | Monthly reporting</p>
          <p><em>Standard:</em> 4 posts/week (16/month) | 3 channels | All Base features | Diverse content | Enhanced reporting</p>
          <p><em>Premium:</em> Daily posts (28/month) | 6 channels | Time optimization | All Standard features | Advanced tracking</p>
        </div>
      </div>
      
      <div class="section">
        <h3>CLIENT RESPONSIBILITIES</h3>
        <p>To facilitate the delivery of services, Client agrees to:</p>
        <ul>
          <li>Provide timely access to relevant accounts, platforms, and assets</li>
          <li>Respond to Agency requests for information or approvals within 3 business days</li>
          <li>Provide brand guidelines, marketing materials, and other necessary resources</li>
          <li>Grant appropriate access levels to websites, social media accounts, and advertising platforms</li>
          <li>Designate a primary point of contact for communication with Agency</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>DELIVERABLES TIMELINE</h3>
        <p><strong>Initial Setup:</strong> Completed within 10 business days of receiving all required access and materials</p>
        <p><strong>Regular Deliverables:</strong> According to the service descriptions above</p>
        <p><strong>Reporting:</strong> Monthly performance reports delivered within 5 business days after the end of each month</p>
      </div>
      
      <div class="section">
        <h3>PAYMENT SCHEDULE</h3>
        <p>Client agrees to pay Agency according to the following schedule:</p>
        <p><strong>Payment Structure:</strong> Payments are made in advance of services rendered</p>
        <p><strong>First Payment:</strong> Due upon contract signing (covering days 1-30)</p>
        <p><strong>Subsequent Payments:</strong> Due every 30 days (day 31, day 61, etc.) for the duration of the ${subLength}-month term</p>
        <p><strong>Monthly Service Fee:</strong> $${finalMonthly} USD per 30-day period</p>
        <p><strong>Payment Method:</strong> Credit card, ACH, or other method agreed upon by both parties</p>
        <p><strong>Late Payment Fee:</strong> 1.5% per month on outstanding balances</p>
        <p>If Client fails to make any payment when due, Agency reserves the right to suspend Services until payment is received in full.</p>
      </div>
      
      <div class="section">
        <h3>ADDITIONAL SERVICES</h3>
        <p>Services requested beyond the scope of this SOW will be quoted separately and implemented upon written approval from Client.</p>
      </div>
      
      <div class="section">
        <h3>SERVICE LEVEL EXPECTATIONS</h3>
        <p><strong>Response Time:</strong> Agency will respond to Client communications within 2 business days during business hours</p>
        <p><strong>Revisions:</strong> Package includes up to 2 rounds of revisions per deliverable</p>
        <p><strong>Turnaround Time:</strong> Standard deliverables will be completed according to the timelines specified above</p>
      </div>
      
      <div class="section">
        <h3>TERM</h3>
        <p><strong>Initial Term:</strong> ${subLength} months (beginning on the Effective Date)</p>
        <p><strong>Renewal:</strong> This SOW will automatically renew for successive 3-month terms unless either party provides written notice of non-renewal at least 30 days prior to the end of the current term</p>
      </div>
      
      <div class="signature">
        <p><strong>SIGNATURES</strong></p>
        <p>The undersigned represent that they have the authority to execute this Statement of Work on behalf of their respective organizations.</p>
        
        <p><strong>BUZZWORD STRATEGIES LLC</strong></p>
        <p>By: Joshua Kelley Cook</p>
        <p>Name: Joshua Kelley Cook</p>
        <p>Title: Owner</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        
        <div style="margin-top: 50px;">
          <p><strong>CLIENT:</strong></p>
          <p>By: ____________________</p>
          <p>Name: <span class="form-field" data-tab-id="ClientName">____________________</span></p>
          <p>Title: <span class="form-field" data-tab-id="ClientTitle">____________________</span></p>
          <p>Date: <span class="form-field" data-tab-id="ClientSignDate">____________________</span></p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
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
      status: data.status || 'sent',
      docusign_envelope_id: data.envelopeId,
      // Note: stripe_session_id will be added later when Stripe checkout is created
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
