// src/components/UserInfoForm.js
import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const UserInfoForm = ({ onSubmit, onCancel, setShowPrivacyPolicy: parentSetShowPrivacyPolicy }) => {
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
        
        {/* Privacy Policy Consent */}
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
        
        {/* Legal Compliance Disclosure */}
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
      
      {/* Privacy Policy Modal - using the imported component */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal
          isVisible={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
          onAccept={() => {
            setFormData(prev => ({ ...prev, privacyConsent: true }));
            setShowPrivacyPolicy(false);
          }}
          currentDate={new Date().toLocaleDateString()}
        />
      )}
    </>
  );
};

export default UserInfoForm;
