// src/components/ContractAgreementForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContractAgreementForm = ({ 
  onSubmit, 
  onCancel, 
  bundleName, 
  selectedServices, 
  clientName,
  subLength,
  finalMonthly,
  bundleID
}) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [errors, setErrors] = useState({});
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Clear errors when input changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [agreeToTerms, signatureName, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    const validationErrors = {};
    
    // Validation
    if (!agreeToTerms) {
      validationErrors.agreeToTerms = 'You must agree to the terms by checking the box';
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
    
    // Create agreement data
    const agreementData = {
      agreeToTerms,
      signatureName: signatureName.trim(),
      agreementDate: currentDate
    };
    
    setIsProcessing(true);
    
    try {
      // First, submit the agreement data
      await onSubmit(agreementData);
      
      // Then create a Stripe checkout session
      const response = await axios.post('/.netlify/functions/create-stripe-checkout', {
        bundleID: bundleID || `bwb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        bundleName: bundleName || 'Marketing Bundle',
        finalMonthly,
        subLength,
        selectedServices
      });
      
      // Redirect to Stripe checkout
      if (response.data && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'An unexpected error occurred'}. Please try again.`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#F8F6F0] mb-4">Marketing Services Agreement</h2>
      <p className="text-sm text-[#F8F6F0]/70 mb-4">Please review and agree to the following terms.</p>
      
      {/* Contract text in scrollable container */}
      <div className="bg-[#2A2A2A] border border-[#FFBA38]/20 rounded-lg p-4 h-[400px] overflow-y-auto mb-4 text-sm text-[#F8F6F0]/90">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFBA38]">MARKETING SERVICES AGREEMENT</h3>
          
          <p>This Marketing Services Agreement (the "Agreement") is made and entered into as of {currentDate}, by and between Buzzword Strategies LLC, a Wyoming limited liability company with its principal place of business at 1603 Capitol Ave Ste 415 #465784, Cheyenne, WY 82001 ("Agency"), and {clientName}, ("Client").</p>
          
          <p><strong>WHEREAS</strong>, Agency is in the business of providing marketing services;</p>
          
          <p><strong>WHEREAS</strong>, Client has selected a specific marketing bundle and tiers through Agency's online platform and has agreed to the terms of such bundle by pressing "accept" on a pop-up confirmation prior to executing this Agreement;</p>
          
          <p><strong>WHEREAS</strong>, Client desires to engage Agency to provide such services, and Agency desires to provide such services, subject to the terms and conditions set forth herein;</p>
          
          <p><strong>NOW, THEREFORE</strong>, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:</p>
          
          <h4 className="text-[#FFBA38] mt-2">1. SERVICES</h4>
          
          <p><strong>1.1 Scope of Services.</strong> Agency agrees to provide Client with the marketing services (the "Services") as specified in the bundle and tiers selected by Client through the Agency's online platform and accepted by Client by pressing "accept" on a pop-up confirmation prior to the execution of this Agreement. The details of the selected bundle and tiers, including the specific services, deliverables, and performance metrics, are incorporated herein by reference.</p>
          
          <p><strong>1.2 Change Orders.</strong> Any modifications to the Services will require a written change order signed by both parties ("Change Order"). Agency reserves the right to adjust fees and timelines based on approved Change Orders.</p>
          
          <h4 className="text-[#FFBA38] mt-2">2. TERM AND TERMINATION</h4>
          
          <p><strong>2.1 Term.</strong> This Agreement shall commence on the Effective Date and shall continue for the subscription period of {subLength} months selected by Client as part of the bundle, unless terminated earlier as provided herein.</p>
          
          <p><strong>2.2 Termination for Convenience.</strong> Either party may terminate this Agreement upon thirty (30) days' written notice to the other party.</p>
          
          <p><strong>2.3 Termination for Cause.</strong> Either party may terminate this Agreement immediately upon written notice if the other party breaches any material term of this Agreement and fails to cure such breach within fifteen (15) days of receiving written notice of the breach.</p>
          
          <p><strong>2.4 Effect of Termination.</strong> Upon termination, Client shall pay Agency for all Services performed up to the date of termination. Sections 4, 5, 6, 7, 8, 9, 10, and 11 shall survive termination.</p>
          
          <h4 className="text-[#FFBA38] mt-2">3. FEES AND PAYMENT</h4>
          
          <p><strong>3.1 Fees.</strong> Client shall pay Agency the fees as specified in the selected bundle and tiers, which include a monthly fee of ${finalMonthly} payable in advance for each month of the {subLength}-month subscription period. All fees are exclusive of taxes, which shall be Client's responsibility.</p>
          
          <p><strong>3.2 Payment Terms.</strong> Payment shall be made in advance of services rendered, as specified in the selected bundle. Late payments shall bear interest at a rate of 1.5% per month or the maximum rate permitted by law, whichever is less.</p>
          
          <h4 className="text-[#FFBA38] mt-2">4. INTELLECTUAL PROPERTY RIGHTS</h4>
          
          <p><strong>4.1 Agency Materials.</strong> Agency retains all right, title, and interest in and to all materials, concepts, know-how, techniques, processes, methodologies, and intellectual property owned or developed by Agency prior to or independent of this Agreement ("Agency Materials"). Agency grants Client a non-exclusive, non-transferable license to use Agency Materials solely in connection with the Services and deliverables provided under this Agreement.</p>
          
          <p><strong>4.2 Client Materials.</strong> Client retains all right, title, and interest in and to all materials, information, and intellectual property provided by Client to Agency ("Client Materials"). Client grants Agency a non-exclusive, non-transferable license to use Client Materials solely for the purpose of providing the Services.</p>
          
          <p><strong>4.3 Deliverables.</strong> Upon full payment of all fees, Agency grants Client a non-exclusive, non-transferable license to use the deliverables created under this Agreement, excluding Agency Materials and Third-Party Materials.</p>
          
          <p><strong>4.4 Third-Party Materials.</strong> Deliverables may incorporate third-party materials ("Third-Party Materials"). Client's use of Third-Party Materials shall be subject to applicable third-party licenses.</p>
          
          <h4 className="text-[#FFBA38] mt-2">5. CONFIDENTIALITY</h4>
          
          <p><strong>5.1 Definition.</strong> "Confidential Information" means all non-public information disclosed by one party to the other that is designated as confidential or reasonably should be understood to be confidential.</p>
          
          <p><strong>5.2 Obligations.</strong> The receiving party shall use Confidential Information solely for performing its obligations under this Agreement and shall protect it using reasonable care. Confidential Information may be disclosed to employees or contractors bound by similar confidentiality obligations.</p>
          
          <p><strong>5.3 Exceptions.</strong> Confidentiality obligations do not apply to information that is publicly available, already known, independently developed, or required to be disclosed by law.</p>
          
          <p><strong>5.4 Duration.</strong> Confidentiality obligations shall survive termination of this Agreement for three (3) years.</p>
          
          <h4 className="text-[#FFBA38] mt-2">6. REPRESENTATIONS AND WARRANTIES</h4>
          
          <p><strong>6.1 Mutual Representations.</strong> Each party represents that it has the authority to enter into this Agreement and that its performance will not violate any other agreements or laws.</p>
          
          <p><strong>6.2 Agency Warranties.</strong> Agency warrants that the Services will be performed in a professional manner. Agency disclaims all other warranties, express or implied.</p>
          
          <p><strong>6.3 Client Warranties.</strong> Client warrants that it owns or has the right to use all Client Materials and that such materials do not infringe any third-party rights.</p>
          
          <h4 className="text-[#FFBA38] mt-2">7. LIMITATION OF LIABILITY</h4>
          
          <p><strong>7.1 Exclusion of Damages.</strong> Neither party shall be liable for any indirect, incidental, special, or consequential damages arising out of this Agreement.</p>
          
          <p><strong>7.2 Cap on Liability.</strong> Except for breaches of confidentiality or intellectual property rights, each party's total liability shall not exceed the fees paid by Client to Agency under this Agreement.</p>
          
          <h4 className="text-[#FFBA38] mt-2">8. INDEMNIFICATION</h4>
          
          <p><strong>8.1 Agency Indemnification.</strong> Agency shall indemnify Client against third-party claims arising from Agency's breach of this Agreement or infringement of intellectual property rights (excluding Client Materials and Third-Party Materials).</p>
          
          <p><strong>8.2 Client Indemnification.</strong> Client shall indemnify Agency against third-party claims arising from Client's breach of this Agreement, infringement by Client Materials, or Client's use of deliverables.</p>
          
          <h4 className="text-[#FFBA38] mt-2">9. RESULTS AND PERFORMANCE</h4>
          
          <p><strong>9.1 No Guarantees.</strong> Agency does not guarantee any specific results or outcomes from the Services. Marketing outcomes depend on factors beyond Agency's control, including market conditions, competition, and Client's products/services.</p>
          
          <p><strong>9.2 Client Responsibilities.</strong> Client acknowledges that successful outcomes require Client's active participation and timely fulfillment of responsibilities as outlined in the selected bundle and tiers.</p>
          
          <h4 className="text-[#FFBA38] mt-2">10. DATA PRIVACY AND COMPLIANCE</h4>
          
          <p><strong>10.1 Data Privacy.</strong> Each party shall comply with applicable data protection laws. Client shall obtain necessary consents for any personal data processed in connection with the Services.</p>
          
          <p><strong>10.2 Regulatory Compliance.</strong> Client is responsible for ensuring that all marketing materials and campaigns comply with applicable laws and regulations.</p>
          
          <h4 className="text-[#FFBA38] mt-2">11. GENERAL PROVISIONS</h4>
          
          <p><strong>11.1 Independent Contractors.</strong> The parties are independent contractors, and nothing in this Agreement creates a partnership, joint venture, or employment relationship.</p>
          
          <p><strong>11.2 Non-Solicitation.</strong> During the term and for one (1) year thereafter, neither party shall solicit or hire the other's employees or contractors involved in the Services.</p>
          
          <p><strong>11.3 Force Majeure.</strong> Neither party shall be liable for delays due to causes beyond its reasonable control.</p>
          
          <p><strong>11.4 Assignment.</strong> Neither party may assign this Agreement without the other's written consent.</p>
          
          <p><strong>11.5 Governing Law.</strong> This Agreement shall be governed by the laws of Wyoming.</p>
          
          <p><strong>11.6 Dispute Resolution.</strong> Disputes shall be resolved through negotiation, mediation, or, if necessary, in the courts of Wyoming.</p>
          
          <p><strong>11.7 Entire Agreement.</strong> This Agreement, including the details of the bundle named "{bundleName || 'Marketing Bundle'}" with services: {selectedServices}, as accepted by Client, constitutes the entire agreement between the parties.</p>
        </div>
      </div>
      
      {/* Agreement checkbox */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={() => setAgreeToTerms(!agreeToTerms)}
            className="mt-1 w-4 h-4 text-[#FFBA38] bg-[#2A2A2A] border-[#FFBA38]/20 rounded focus:ring-[#FFBA38]/50"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-[#F8F6F0]/80">
            I have read and agree to the Marketing Services Agreement above and agree to be bound by its terms.
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs ml-6">{errors.agreeToTerms}</p>
        )}
        
        {/* Signature field */}
        <div className="mt-4">
          <p className="text-sm text-[#F8F6F0]/80 mb-2">
            Type your full name below to indicate your agreement to these terms:
          </p>
          <input
            type="text"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Type your full name (as it appears above)"
            className={`w-full p-3 bg-[#2A2A2A] border ${
              errors.signatureName ? 'border-red-500' : 'border-[#FFBA38]/20'
            } rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
          />
          {errors.signatureName && (
            <p className="text-red-500 text-xs mt-1">{errors.signatureName}</p>
          )}
        </div>
        
        {/* Legal notice */}
        <div className="text-sm text-[#F8F6F0]/60 mt-3">
          By typing your name above and clicking "Agree & Continue to Payment", you are electronically signing this agreement as of {currentDate}.
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="py-3 bg-[#2A2A2A] text-[#F8F6F0]/70 rounded-lg hover:bg-[#2A2A2A]/80 font-medium transition-colors"
          disabled={isProcessing}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={`py-3 ${isProcessing ? 'bg-[#2A2A2A] text-[#F8F6F0]/50' : 'bg-[#FFBA38] text-[#1A1A1A] hover:bg-[#D4941E]'} font-semibold rounded-lg transition-colors`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#F8F6F0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
  );
};

export default ContractAgreementForm;
