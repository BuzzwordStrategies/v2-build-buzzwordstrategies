// src/components/UserInfoForm.js
import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal'; // We'll create this component next

const UserInfoForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientCity: '',
    clientState: '',
    clientZip: '',
    clientCompany: '',
    clientWebsite: '',
    marketingConsent: false,
    privacyConsent: false // Added privacy consent field
  });

  const [errors, setErrors] = useState({});
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'Name is required';
    if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) newErrors.clientEmail = 'Email is invalid';
    if (!formData.clientPhone.trim()) newErrors.clientPhone = 'Phone is required';
    if (!formData.clientAddress.trim()) newErrors.clientAddress = 'Address is required';
    if (!formData.clientCity.trim()) newErrors.clientCity = 'City is required';
    if (!formData.clientState.trim()) newErrors.clientState = 'State is required';
    if (!formData.clientZip.trim()) newErrors.clientZip = 'ZIP is required';
    
    // New validation for privacy policy consent
    if (!formData.privacyConsent) newErrors.privacyConsent = 'You must agree to the Privacy Policy';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Your Information</h2>
        <p className="text-sm text-white/85 mb-6">Please provide your details to create your agreement</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">Full Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientName ? 'border-red-500' : 'border-[#D28C00]/20'} rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors`}
            />
            {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">Email Address *</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientEmail ? 'border-red-500' : 'border-[#D28C00]/20'} rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors`}
            />
            {errors.clientEmail && <p className="mt-1 text-xs text-red-500">{errors.clientEmail}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientPhone ? 'border-red-500' : 'border-[#D28C00]/20'} rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors`}
            />
            {errors.clientPhone && <p className="mt-1 text-xs text-red-500">{errors.clientPhone}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">Company Name</label>
            <input
              type="text"
              name="clientCompany"
              value={formData.clientCompany}
              onChange={handleChange}
              className="w-full p-3 bg-[#2A2A2A] border border-[#D28C00]/20 rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/85 mb-1">Company Website</label>
            <input
              type="text"
              name="clientWebsite"
              value={formData.clientWebsite}
              onChange={handleChange}
              placeholder="example.com"
              className="w-full p-3 bg-[#2A2A2A] border border-[#D28C00]/20 rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors"
            />
            <p className="mt-1 text-xs text-white/80">Just enter your domain name (e.g., example.com)</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/85 mb-1">Street Address *</label>
            <input
              type="text"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientAddress ? 'border-red-500' : 'border-[#D28C00]/20'} rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors`}
            />
            {errors.clientAddress && <p className="mt-1 text-xs text-red-500">{errors.clientAddress}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">City *</label>
            <input
              type="text"
              name="clientCity"
              value={formData.clientCity}
              onChange={handleChange}
              className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientCity ? 'border-red-500' : 'border-[#D28C00]/20'} rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors`}
            />
            {errors.clientCity && <p className="mt-1 text-xs text-red-500">{errors.clientCity}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">State *</label>
              <input
                type="text"
                name="clientState"
                value={formData.clientState}
                onChange={handleChange}
                className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientState ? 'border-red-500' : 'border-[#D28C00]/20'} rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors`}
              />
              {errors.clientState && <p className="mt-1 text-xs text-red-500">{errors.clientState}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">ZIP Code *</label>
              <input
                type="text"
                name="clientZip"
                value={formData.clientZip}
                onChange={handleChange}
                className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientZip ? 'border-red-500' : 'border-[#D28C00]/20'} rounded-lg text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors`}
              />
              {errors.clientZip && <p className="mt-1 text-xs text-red-500">{errors.clientZip}</p>}
            </div>
          </div>
        </div>
        
        {/* Marketing Consent Checkbox */}
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="marketingConsent"
                name="marketingConsent"
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={handleChange}
                className="w-4 h-4 text-[#D28C00] bg-[#2A2A2A] border-[#D28C00]/20 rounded focus:ring-[#D28C00]/50"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="marketingConsent" className="text-sm font-medium text-white/85">
                I agree to be contacted about future Buzzword Strategies marketing offers
              </label>
            </div>
          </div>
        </div>
        
        {/* Privacy Policy Consent - ADDED */}
        <div className="mt-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="privacyConsent"
                name="privacyConsent"
                type="checkbox"
                checked={formData.privacyConsent}
                onChange={handleChange}
                className="w-4 h-4 text-[#D28C00] bg-[#2A2A2A] border-[#D28C00]/20 rounded focus:ring-[#D28C00]/50"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="privacyConsent" className="text-sm font-medium text-white/85">
                I have read and agree to the <button 
                  type="button" 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-[#D28C00] underline hover:text-[#B77A00]"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
          </div>
          {errors.privacyConsent && (
            <p className="mt-1 text-xs text-red-500 ml-7">{errors.privacyConsent}</p>
          )}
        </div>
        
        {/* Legal Compliance Disclosure - ADDED */}
        <div className="mt-6 p-4 bg-[#2A2A2A]/50 border border-[#D28C00]/20 rounded-lg">
          <p className="text-xs text-white/80">
            By submitting this form, you consent to our collection and use of your personal information as described in our Privacy Policy. Your information will be processed securely via Stripe and stored in our Supabase database. We implement appropriate safeguards to protect your data and respect your privacy rights under applicable laws, including CCPA protections for California residents.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="py-3 bg-[#2A2A2A] text-white/85 rounded-lg hover:bg-[#2A2A2A]/80 font-medium transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="py-3 bg-[#D28C00] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#B77A00] transition-colors"
          >
            Continue to Agreement
          </button>
        </div>
      </form>
      
      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] rounded-xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-[#D28C00]/20">
            <div className="flex justify-between items-center mb-6 border-b border-[#D28C00]/10 pb-4">
              <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="w-10 h-10 rounded-full bg-[#2A2A2A] text-white/60 hover:bg-[#1A1A1A] hover:text-[#D28C00] transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 text-white/85 text-sm">
              <h3 className="text-lg font-semibold text-[#D28C00] mb-2">1. Introduction</h3>
              <p>
                Buzzword Strategies LLC ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Bundle Builder platform and marketing services.
              </p>
              
              <h3 className="text-lg font-semibold text-[#D28C00] mt-4 mb-2">2. Information We Collect</h3>
              <p>We collect several types of information from and about users of our services, including:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, company name, website URL, and payment information.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our services, including pages visited, time spent, and actions taken.</li>
                <li><strong>Marketing Preferences:</strong> Your consent choices regarding marketing communications.</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-[#D28C00] mt-4 mb-2">3. How We Use Your Information</h3>
              <ul className="list-disc pl-6">
                <li>To provide and maintain our services</li>
                <li>To process transactions and manage your account</li>
                <li>To fulfill our service obligations and deliver marketing services</li>
                <li>To contact you regarding your account, services, or changes to policies</li>
                <li>To improve our website and services</li>
                <li>To send promotional materials and newsletters (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-[#D28C00] mt-4 mb-2">4. Your Rights</h3>
              <p>Depending on your location, you may have rights regarding your personal information, including:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Right to access personal information we hold about you</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to request deletion of your information</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent (where processing is based on consent)</li>
              </ul>
              <p className="mt-2">
                California residents have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA).
              </p>
              
              <h3 className="text-lg font-semibold text-[#D28C00] mt-4 mb-2">5. Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                <br />
                <br />
                Buzzword Strategies LLC<br />
                1603 Capitol Ave Ste 415 #465784<br />
                Cheyenne, WY 82001<br />
                Email: privacy@buzzwordstrategies.com
              </p>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowPrivacyPolicy(false);
                  setFormData(prev => ({ ...prev, privacyConsent: true }));
                }}
                className="w-full py-3 bg-[#D28C00] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#B77A00] transition-colors"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfoForm;
