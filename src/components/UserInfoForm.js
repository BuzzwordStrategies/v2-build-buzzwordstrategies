// src/components/UserInfoForm.js
import React, { useState } from 'react';

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
    marketingConsent: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    if (!formData.marketingConsent) newErrors.marketingConsent = 'You must agree to be contacted';
    
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-[#F8F6F0] mb-4">Your Information</h2>
      <p className="text-sm text-[#F8F6F0]/70 mb-6">Please provide your details to create your agreement</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">Full Name *</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientName ? 'border-red-500' : 'border-[#FFBA38]/20'} rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
          />
          {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">Email Address *</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientEmail ? 'border-red-500' : 'border-[#FFBA38]/20'} rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
          />
          {errors.clientEmail && <p className="mt-1 text-xs text-red-500">{errors.clientEmail}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientPhone ? 'border-red-500' : 'border-[#FFBA38]/20'} rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
          />
          {errors.clientPhone && <p className="mt-1 text-xs text-red-500">{errors.clientPhone}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">Company Name</label>
          <input
            type="text"
            name="clientCompany"
            value={formData.clientCompany}
            onChange={handleChange}
            className="w-full p-3 bg-[#2A2A2A] border border-[#FFBA38]/20 rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">Street Address *</label>
          <input
            type="text"
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleChange}
            className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientAddress ? 'border-red-500' : 'border-[#FFBA38]/20'} rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
          />
          {errors.clientAddress && <p className="mt-1 text-xs text-red-500">{errors.clientAddress}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">City *</label>
          <input
            type="text"
            name="clientCity"
            value={formData.clientCity}
            onChange={handleChange}
            className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientCity ? 'border-red-500' : 'border-[#FFBA38]/20'} rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
          />
          {errors.clientCity && <p className="mt-1 text-xs text-red-500">{errors.clientCity}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">State *</label>
            <input
              type="text"
              name="clientState"
              value={formData.clientState}
              onChange={handleChange}
              className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientState ? 'border-red-500' : 'border-[#FFBA38]/20'} rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
            />
            {errors.clientState && <p className="mt-1 text-xs text-red-500">{errors.clientState}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#F8F6F0]/70 mb-1">ZIP Code *</label>
            <input
              type="text"
              name="clientZip"
              value={formData.clientZip}
              onChange={handleChange}
              className={`w-full p-3 bg-[#2A2A2A] border ${errors.clientZip ? 'border-red-500' : 'border-[#FFBA38]/20'} rounded-lg text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors`}
            />
            {errors.clientZip && <p className="mt-1 text-xs text-red-500">{errors.clientZip}</p>}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="marketingConsent"
              name="marketingConsent"
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="w-4 h-4 text-[#FFBA38] bg-[#2A2A2A] border-[#FFBA38]/20 rounded focus:ring-[#FFBA38]/50"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="marketingConsent" className={`text-sm font-medium ${errors.marketingConsent ? 'text-red-500' : 'text-[#F8F6F0]/70'}`}>
              I agree to be contacted about future Buzzword Strategies marketing offers *
            </label>
            {errors.marketingConsent && <p className="mt-1 text-xs text-red-500">{errors.marketingConsent}</p>}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="py-3 bg-[#2A2A2A] text-[#F8F6F0]/70 rounded-lg hover:bg-[#2A2A2A]/80 font-medium transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="py-3 bg-[#FFBA38] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#D4941E] transition-colors"
        >
          Continue to Agreement
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;
