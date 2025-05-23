// src/components/ContractAgreementForm.js
import React, { useState, useEffect } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const ContractAgreementForm = ({ 
  onSubmit, 
  onCancel, 
  bundleName, 
  selectedServices, 
  clientName,
  subLength,
  finalMonthly,
  bundleID,
  theme,
  isDarkMode
}) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [errors, setErrors] = useState({});
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  // Clear errors when input changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [agreeToTerms, signatureName, privacyPolicyAccepted, errors]);
  
  // PDF Generation Function
  const generateAgreementPDF = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Add a page to the document
      const page = pdfDoc.addPage([612, 792]); // Letter size
      const { width, height } = page.getSize();
      
      // Set font size and line height
      const fontSize = 11;
      const headerSize = 16;
      const lineHeight = 16;
      let y = height - 50; // Start from top with margin
      
      // Helper function to add text and move cursor down
      const addText = (text, font = timesRoman, size = fontSize) => {
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
      addText('MARKETING SERVICES AGREEMENT', timesRomanBold, headerSize);
      y -= 10; // Extra space after title
      
      // Add introduction
      addText(`This Marketing Services Agreement (the "Agreement") is made and entered into as of ${currentDate},`, timesRoman, fontSize);
      addText(`by and between Buzzword Strategies LLC ("Agency") and ${clientName} ("Client").`, timesRoman, fontSize);
      y -= 10; // Extra space
      
      // Add service details
      addText('SELECTED SERVICES:', timesRomanBold, fontSize);
      addText(selectedServices, timesRoman, fontSize);
      y -= 5;
      
      addText(`Subscription Length: ${subLength} months`, timesRoman, fontSize);
      addText(`Monthly Fee: $${finalMonthly}`, timesRoman, fontSize);
      y -= 10;
      
      // Add key sections from agreement (abbreviated)
      addText('AGREEMENT SUMMARY:', timesRomanBold, fontSize);
      y -= 5;
      
      addText('1. SERVICES', timesRomanBold, fontSize);
      addText('Agency will provide Client with the marketing services specified in the selected bundle.', timesRoman, fontSize);
      y -= 5;
      
      addText('2. TERM AND TERMINATION', timesRomanBold, fontSize);
      addText(`This Agreement shall commence on the Effective Date for an initial ${subLength}-month period,`, timesRoman, fontSize);
      addText('automatically renewing thereafter until canceled with 30 days notice.', timesRoman, fontSize);
      y -= 5;
      
      addText('3. FEES AND PAYMENT', timesRomanBold, fontSize);
      addText(`Client shall pay Agency $${finalMonthly} per month for the Services.`, timesRoman, fontSize);
      y -= 5;
      
      addText('4. INTELLECTUAL PROPERTY', timesRomanBold, fontSize);
      addText('Agency retains ownership of all marketing strategies, processes, and methodologies.', timesRoman, fontSize);
      addText('Client owns all finished creative deliverables created specifically for Client.', timesRoman, fontSize);
      y -= 5;
      
      // Jump to signature section
      y = 150;
      
      addText('CLIENT ACCEPTANCE:', timesRomanBold, fontSize);
      addText(`Electronic Signature: ${signatureName}`, timesRoman, fontSize);
      addText(`Date: ${currentDate}`, timesRoman, fontSize);
      addText(`Bundle ID: ${bundleID}`, timesRoman, fontSize);
      
      // Add legal footer
      y = 50;
      const footerSize = 8;
      addText('This document is a summary of the agreement. The complete terms are available in the online agreement.', timesRoman, footerSize);
      addText('Electronic signature is valid as an original signature per E-SIGN Act.', timesRoman, footerSize);
      
      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
      
      // Convert Uint8Array to base64 string using browser APIs instead of Node.js Buffer
      const bytes = new Uint8Array(pdfBytes);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    const validationErrors = {};
    
    // Validation
    if (!agreeToTerms) {
      validationErrors.agreeToTerms = 'You must agree to the terms by checking the box';
    }
    
    if (!privacyPolicyAccepted) {
      validationErrors.privacyPolicyAccepted = 'You must accept the Privacy Policy';
    }
    
    if (!signatureName.trim()) {
      validationErrors.signatureName = 'Please type your full name to indicate agreement';
    } else if (signatureName.trim().toLowerCase() !== clientName.toLowerCase()) {
      validationErrors.signatureName = 'The name must match your full name exactly';
    }
    
    // If there are errors, show them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Generate PDF
      const pdfBase64 = await generateAgreementPDF();
      
      // Create agreement data with PDF
      const agreementData = {
        agreeToTerms,
        signatureName: signatureName.trim(),
        agreementDate: currentDate,
        privacyPolicyAccepted,
        agreementPdf: pdfBase64, // Add the PDF data
        agreementFilename: `agreement_${bundleID}_${new Date().toISOString().split('T')[0]}.pdf`
      };
      
      // Submit the agreement data to parent
      await onSubmit(agreementData);
      // The parent component (BundleBuilder) will handle the redirect
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'An unexpected error occurred'}. Please try again.`);
      setIsProcessing(false);
    }
  };

  // Subscription Terms Component
  const SubscriptionTerms = () => (
    <div className={`${theme.bgTertiary} border ${theme.border} rounded-lg p-4 mb-4 text-sm ${theme.textSecondary}`}>
      <h4 className={`font-medium ${theme.accentText} mb-2`}>Subscription Terms Summary</h4>
      <div className="space-y-2">
        <p>
          <strong className={theme.text}>Initial Commitment:</strong> {subLength} months at ${finalMonthly}/month.
        </p>
        <p>
          <strong className={theme.text}>Automatic Renewal:</strong> Monthly renewal after initial period until canceled.
        </p>
        <p>
          <strong className={theme.text}>Early Termination:</strong> 50% of remaining payments if canceled during initial period.
        </p>
        <p>
          <strong className={theme.text}>Billing Cycle:</strong> Payment charged on the same date each month.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>Marketing Services Agreement</h2>
      <p className={`text-sm ${theme.textSecondary} mb-4`}>Please review and agree to the following terms.</p>
      
      {/* Subscription Terms Summary */}
      <SubscriptionTerms />
      
      {/* Contract text in scrollable container */}
      <div className={`${theme.bgTertiary} border ${theme.border} rounded-lg p-4 h-[400px] overflow-y-auto mb-4 text-sm ${theme.textSecondary}`}>
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${theme.accentText}`}>MARKETING SERVICES AGREEMENT</h3>
          
          <p>This Marketing Services Agreement (the "Agreement") is made and entered into as of {currentDate}, by and between Buzzword Strategies LLC, a Wyoming limited liability company with its principal place of business at 1603 Capitol Ave Ste 415 #465784, Cheyenne, WY 82001 ("Agency"), and {clientName}, ("Client").</p>
          
          <p><strong>WHEREAS</strong>, Agency is in the business of providing marketing services;</p>
          
          <p><strong>WHEREAS</strong>, Client has selected a specific marketing bundle and tiers through Agency's online platform and has agreed to the terms of such bundle by pressing "accept" on a pop-up confirmation prior to executing this Agreement;</p>
          
          <p><strong>WHEREAS</strong>, Client desires to engage Agency to provide such services, and Agency desires to provide such services, subject to the terms and conditions set forth herein;</p>
          
          <p><strong>NOW, THEREFORE</strong>, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:</p>
          
          <h4 className={`${theme.accentText} mt-2`}>1. SERVICES</h4>
          
          <p><strong>1.1 Scope of Services.</strong> Agency agrees to provide Client with the marketing services (the "Services") as specified in the bundle and tiers selected by Client through the Agency's online platform and accepted by Client by pressing "accept" on a pop-up confirmation prior to the execution of this Agreement. The details of the selected bundle and tiers, including the specific services, deliverables, and performance metrics, are incorporated herein by reference and will be provided to Client via email following execution of this Agreement.</p>
          
          <p><strong>1.2 Change Orders.</strong> Any modifications to the Services will require a written change order signed by both parties ("Change Order"). Agency reserves the right to adjust fees and timelines based on approved Change Orders.</p>

          <p><strong>1.3 No Guaranteed Results.</strong> Agency will use commercially reasonable efforts to perform the Services in a professional and workmanlike manner. However, Client acknowledges and agrees that marketing outcomes depend on numerous factors beyond Agency's control, including market conditions, competition, industry trends, Client's products/services, and platform algorithm changes. Agency expressly disclaims any guarantees regarding specific performance metrics, rankings, lead generation volume, conversion rates, or sales results. The testimonials and case studies presented on Agency's website and platform represent specific client results and are not guarantees or promises that Client will achieve similar results. Results may vary substantially based on numerous factors unique to Client's business.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>2. TERM AND TERMINATION</h4>
          
          <p><strong>2.1 Term.</strong> This Agreement shall commence on the Effective Date and shall continue for the initial subscription period of {subLength} months selected by Client as part of the bundle ("Initial Term"), unless terminated earlier as provided herein. Following the Initial Term, this Agreement will automatically renew for successive one-month periods (each a "Renewal Term") unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the then-current term.</p>

          <p><strong>2.2 Automatic Renewal Notice.</strong> CLIENT ACKNOWLEDGES THAT THIS AGREEMENT INVOLVES A SUBSCRIPTION THAT WILL AUTOMATICALLY RENEW. Agency will send Client a reminder notice between 15 and 45 days before each automatic renewal date. Client may cancel at any time by contacting support@buzzwordstrategies.com or by logging into their account dashboard.</p>
          
          <p><strong>2.3 Termination by Client During Initial Term.</strong> Client may terminate this Agreement during the Initial Term upon thirty (30) days' written notice to Agency, subject to an early termination fee equal to 50% of the remaining subscription fees due for the remainder of the Initial Term. No early termination fee applies after the Initial Term.</p>
          
          <p><strong>2.4 Termination for Cause.</strong> Either party may terminate this Agreement immediately upon written notice if the other party breaches any material term of this Agreement and fails to cure such breach within fifteen (15) days of receiving written notice of the breach.</p>
          
          <p><strong>2.5 Effect of Termination.</strong> Upon termination, Client shall pay Agency for all Services performed up to the date of termination, plus any applicable early termination fee. Sections 4, 5, 6, 7, 8, 9, 10, and 11 shall survive termination. Agency will provide Client with all deliverables completed as of the termination date within fifteen (15) business days.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>3. FEES AND PAYMENT</h4>
          
          <p><strong>3.1 Fees.</strong> Client shall pay Agency the fees as specified in the selected bundle and tiers, which include a monthly fee of ${finalMonthly} payable in advance for each month of the {subLength}-month subscription period. All fees are exclusive of taxes, which shall be Client's responsibility.</p>
          
          <p><strong>3.2 Payment Terms.</strong> Client authorizes Agency to charge the payment method provided by Client for all fees when due. Payment shall be made in advance of services rendered, as specified in the selected bundle. Subscription fees will be automatically charged on the same day of each month as the initial subscription date or the nearest available day. Client will receive a receipt for each payment via email. Late payments shall bear interest at a rate of 1.5% per month or the maximum rate permitted by law, whichever is less.</p>

          <p><strong>3.3 Refund Policy.</strong> Due to the nature of digital marketing services, no refunds will be issued except in cases of material failure by Agency to deliver the contracted Services. Client shall notify Agency of any material service delivery issues within five (5) business days of such occurrence. Agency shall have fifteen (15) days to remedy any legitimate service issues before a prorated refund will be considered.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>4. INTELLECTUAL PROPERTY RIGHTS</h4>
          
          <p><strong>4.1 Agency Materials.</strong> Agency retains all right, title, and interest in and to all materials, concepts, know-how, techniques, processes, methodologies, and intellectual property owned or developed by Agency prior to or independent of this Agreement ("Agency Materials"), including all marketing strategies, processes, workflows, and methodologies. Agency grants Client a non-exclusive, non-transferable license to use Agency Materials solely in connection with the Services and deliverables provided under this Agreement for the duration of the Agreement.</p>
          
          <p><strong>4.2 Client Materials.</strong> Client retains all right, title, and interest in and to all materials, information, and intellectual property provided by Client to Agency ("Client Materials"). Client grants Agency a non-exclusive, non-transferable license to use Client Materials solely for the purpose of providing the Services.</p>
          
          <p><strong>4.3 Deliverables.</strong> Subject to full payment of all fees, Client shall own all right, title, and interest in the finished content and creative deliverables specifically created for Client as part of the Services, excluding Agency Materials and Third-Party Materials ("Client Deliverables"). For clarity, Client Deliverables include finished advertisements, written content, images, and videos created specifically for Client, but exclude marketing strategies, processes, workflows, methodologies, and templates.</p>
          
          <p><strong>4.4 Third-Party Materials.</strong> Deliverables may incorporate third-party materials ("Third-Party Materials"), including stock images, music, or software. Client's use of Third-Party Materials shall be subject to applicable third-party licenses, and Client agrees to comply with all such licenses.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>5. CONFIDENTIALITY</h4>
          
          <p><strong>5.1 Definition.</strong> "Confidential Information" means all non-public information disclosed by one party to the other that is designated as confidential or reasonably should be understood to be confidential, including business plans, customer data, financial information, marketing strategies, and technical information.</p>
          
          <p><strong>5.2 Obligations.</strong> The receiving party shall use Confidential Information solely for performing its obligations under this Agreement and shall protect it using at least the same degree of care it uses to protect its own confidential information, but no less than reasonable care. Confidential Information may be disclosed to employees or contractors bound by similar confidentiality obligations and who need to know such information to perform their duties.</p>
          
          <p><strong>5.3 Exceptions.</strong> Confidentiality obligations do not apply to information that is (a) publicly available through no fault of the receiving party, (b) already known to the receiving party without restriction before receipt, (c) independently developed by the receiving party without use of Confidential Information, or (d) rightfully obtained from a third party not under a duty of confidentiality.</p>
          
          <p><strong>5.4 Duration.</strong> Confidentiality obligations shall survive termination of this Agreement for three (3) years.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>6. REPRESENTATIONS AND WARRANTIES</h4>
          
          <p><strong>6.1 Mutual Representations.</strong> Each party represents that it has the authority to enter into this Agreement and that its performance will not violate any other agreements or applicable laws.</p>
          
          <p><strong>6.2 Agency Warranties.</strong> Agency warrants that the Services will be performed in a professional manner consistent with industry standards. TO THE MAXIMUM EXTENT PERMITTED BY LAW, AGENCY DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          
          <p><strong>6.3 Client Warranties.</strong> Client warrants that (a) it owns or has the right to use all Client Materials and that such materials do not infringe any third-party rights; (b) it will use the Services and deliverables in compliance with all applicable laws and regulations; and (c) it will provide timely and accurate information necessary for Agency to perform the Services.</p>

          <p><strong>6.4 Compliance with Laws and Platform Policies.</strong> Client acknowledges that digital marketing platforms (including Google, Meta, and TikTok) have specific advertising policies governing content, targeting, and data collection. Client is responsible for ensuring that its products, services, and website comply with all applicable platform policies and laws. Agency will not knowingly create ads that violate platform policies but cannot guarantee platform approval of all advertisements.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>7. LIMITATION OF LIABILITY</h4>
          
          <p><strong>7.1 Exclusion of Damages.</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOST PROFITS, LOST REVENUES, LOST BUSINESS OPPORTUNITIES, LOSS OF USE, OR LOSS OF DATA, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
          
          <p><strong>7.2 Cap on Liability.</strong> EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INTELLECTUAL PROPERTY RIGHTS, EACH PARTY'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT OR OTHERWISE, SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY CLIENT TO AGENCY UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTHS PRECEDING THE FIRST INCIDENT OUT OF WHICH THE LIABILITY AROSE.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>8. INDEMNIFICATION</h4>
          
          <p><strong>8.1 Agency Indemnification.</strong> Agency shall defend, indemnify, and hold harmless Client against third-party claims, actions, or proceedings alleging that the Services (excluding Client Materials and Third-Party Materials) infringe the intellectual property rights of a third party, provided that Client (a) promptly notifies Agency in writing of the claim; (b) gives Agency sole control over the defense and settlement of the claim; and (c) provides all reasonable assistance to Agency.</p>
          
          <p><strong>8.2 Client Indemnification.</strong> Client shall defend, indemnify, and hold harmless Agency against third-party claims, actions, or proceedings arising from (a) Client Materials; (b) Client's use of the Services or deliverables in violation of this Agreement or applicable law; (c) Client's products or services; or (d) Client's breach of this Agreement.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>9. CLIENT RESPONSIBILITIES</h4>
          
          <p><strong>9.1 Cooperation.</strong> Client acknowledges that its timely provision of and access to information, materials, and approvals is essential to Agency's delivery of the Services. Client shall designate a primary contact for communication and shall respond to Agency's requests for feedback, approvals, or information within three (3) business days unless otherwise agreed.</p>
          
          <p><strong>9.2 Platform Access.</strong> Client shall provide Agency with necessary access to marketing platforms, websites, and analytics tools required to perform the Services. Client remains responsible for maintaining accurate login credentials and security for all platforms.</p>

          <p><strong>9.3 Ad Account Spending.</strong> For services related to advertising management, Client acknowledges that ad spend is separate from Agency's management fee. Client is solely responsible for funding the appropriate advertising platform accounts (Google Ads, Meta Ads, etc.) and maintaining sufficient budget to run campaigns. Agency will not be responsible for costs related to platform advertising spending.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>10. DATA PRIVACY AND COMPLIANCE</h4>
          
          <p><strong>10.1 Data Privacy.</strong> Each party shall comply with applicable data protection laws, including the California Consumer Privacy Act and California Privacy Rights Act where applicable. Client shall obtain all necessary consents for the collection, use, and processing of any personal data processed in connection with the Services and shall maintain a privacy policy that accurately discloses its data practices.</p>
          
          <p><strong>10.2 Regulatory Compliance.</strong> Client is responsible for ensuring that all marketing materials and campaigns comply with applicable laws and regulations, including but not limited to the CAN-SPAM Act, FTC regulations regarding deceptive advertising, and industry-specific regulations applicable to Client's business.</p>

          <p><strong>10.3 Privacy Notice.</strong> Agency collects and processes personal information as described in the Agency's Privacy Policy. By entering into this Agreement, Client acknowledges receipt of this Privacy Policy.</p>
          
          <h4 className={`${theme.accentText} mt-2`}>11. GENERAL PROVISIONS</h4>
          
          <p><strong>11.1 Independent Contractors.</strong> The parties are independent contractors. Nothing in this Agreement creates a partnership, joint venture, agency, or employment relationship.</p>
          
          <p><strong>11.2 Non-Solicitation.</strong> During the term of this Agreement and for one (1) year thereafter, neither party shall directly or indirectly solicit or hire the other party's employees or contractors who were involved in providing or receiving the Services, without the other party's prior written consent.</p>
          
          <p><strong>11.3 Force Majeure.</strong> Neither party shall be liable for delays due to causes beyond its reasonable control, including but not limited to acts of God, changes in law, labor disputes, and significant internet disruptions.</p>
          
          <p><strong>11.4 Assignment.</strong> Neither party may assign this Agreement without the other's written consent, which shall not be unreasonably withheld. Notwithstanding the foregoing, either party may assign this Agreement to a successor in connection with a merger, acquisition, or sale of all or substantially all of its assets.</p>
          
          <p><strong>11.5 Governing Law.</strong> This Agreement shall be governed by the laws of the State of Wyoming, without regard to its conflict of law principles. For any Client residing in California, California consumer protection laws shall apply where required by law.</p>
          
          <p><strong>11.6 Dispute Resolution.</strong> Any dispute arising out of or related to this Agreement shall be resolved through good faith negotiation between the parties. If the dispute cannot be resolved through negotiation, either party may initiate mediation through a mutually agreed mediator. If mediation is unsuccessful, the parties may pursue their rights through litigation in the courts of Wyoming, and each party consents to the personal jurisdiction of such courts.</p>
          
          <p><strong>11.7 Entire Agreement.</strong> This Agreement, including the details of the bundle named "{bundleName || 'Marketing Bundle'}" with services: {selectedServices}, as accepted by Client, constitutes the entire agreement between the parties and supersedes all prior and contemporaneous agreements, proposals, or representations, written or oral, concerning its subject matter.</p>

          <p><strong>11.8 Electronic Signature.</strong> The parties agree that electronic signatures shall have the same force and effect as original signatures. By typing their name below and clicking "Agree & Continue to Payment," Client acknowledges that they have read, understand, and agree to be bound by the terms of this Agreement.</p>

          <p><strong>11.9 Notice.</strong> All notices under this Agreement must be in writing and will be deemed given when delivered personally, by email (with confirmation of receipt), or by certified or registered mail to the address specified by the receiving party.</p>

          <p><strong>11.10 Severability.</strong> If any provision of this Agreement is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that this Agreement will otherwise remain in full force and effect.</p>
        </div>
      </div>
      
      {/* Agreement checkboxes */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={() => setAgreeToTerms(!agreeToTerms)}
            className={`mt-1 w-4 h-4 ${theme.accentText} ${theme.bgTertiary} ${theme.border} rounded focus:ring-2 ${isDarkMode ? 'focus:ring-[#D28C00]' : 'focus:ring-purple-600'}`}
          />
          <label htmlFor="agreeToTerms" className={`text-sm ${theme.textSecondary}`}>
            I have read and agree to the Marketing Services Agreement above and agree to be bound by its terms.
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs ml-6">{errors.agreeToTerms}</p>
        )}

        {/* Privacy Policy Consent */}
        <div className="flex items-start gap-2 mt-3">
          <input
            type="checkbox"
            id="privacyPolicyConsent"
            checked={privacyPolicyAccepted}
            onChange={() => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}
            className={`mt-1 w-4 h-4 ${theme.accentText} ${theme.bgTertiary} ${theme.border} rounded focus:ring-2 ${isDarkMode ? 'focus:ring-[#D28C00]' : 'focus:ring-purple-600'}`}
          />
          <label htmlFor="privacyPolicyConsent" className={`text-sm ${theme.textSecondary}`}>
            I have read and agree to the{' '}
            <button 
              type="button" 
              onClick={() => setShowPrivacyPolicy(true)}
              className={`${theme.accentText} underline`}
            >
              Privacy Policy
            </button>
          </label>
        </div>
        {errors.privacyPolicyAccepted && (
          <p className="text-red-500 text-xs ml-6">{errors.privacyPolicyAccepted}</p>
        )}
        
        {/* Signature field */}
        <div className="mt-4">
          <p className={`text-sm ${theme.textSecondary} mb-2`}>
            Type your full name below to indicate your agreement to these terms:
          </p>
          <input
            type="text"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Type your full name (as it appears above)"
            className={`w-full p-3 ${theme.bgTertiary} border ${
              errors.signatureName ? 'border-red-500' : theme.border
            } rounded-lg ${theme.text} ${isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'} focus:${theme.borderAccent} focus:outline-none transition-colors`}
          />
          {errors.signatureName && (
            <p className="text-red-500 text-xs mt-1">{errors.signatureName}</p>
          )}
        </div>
        
        {/* Legal notice */}
        <div className={`text-sm ${theme.textSecondary} mt-3`}>
          By typing your name above and clicking "Agree & Continue to Payment", you are electronically signing this agreement as of {currentDate}.
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className={`py-3 ${theme.bgTertiary} ${theme.textSecondary} rounded-lg hover:${theme.borderAccent} ${theme.border} border font-medium transition-colors`}
          disabled={isProcessing}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={`py-3 ${isProcessing ? `${theme.bgTertiary} ${theme.textSecondary}` : `${theme.accent} ${isDarkMode ? 'text-black' : 'text-white'} ${theme.accentHover}`} font-semibold rounded-lg transition-colors`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${theme.textSecondary}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Agree & Continue to Payment'
          )}
        </button>
      </div>

      {/* Privacy Policy Modal - using the imported component */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal
          isVisible={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
          onAccept={() => {
            setPrivacyPolicyAccepted(true);
            setShowPrivacyPolicy(false);
          }}
          currentDate={currentDate}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default ContractAgreementForm;
