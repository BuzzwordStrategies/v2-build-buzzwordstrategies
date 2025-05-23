import React, { useState, useEffect } from 'react';

// Step 1: Bundle Selection Component
export function BundleSelection({ onNext }) {
  const [loading, setLoading] = useState(false);

  const handleBundleSelect = async (bundleData) => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...bundleData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('currentOrderId', data.orderId);
        onNext(data.orderId);
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to start order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Your Bundle</h2>
      <div className="space-y-4">
        <button 
          onClick={() => handleBundleSelect({
            bundle_id: 'starter',
            bundle_name: 'Starter Package',
            selected_tiers: { 'Meta Ads': 'Base', 'SEO': 'Base' },
            selected_services: 'Meta Ads: Base, SEO: Base',
            sub_length: 3,
            final_monthly: 1560
          })}
          disabled={loading}
          className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating Order...' : 'Starter Bundle - $1,560/mo'}
        </button>
        
        <button 
          onClick={() => handleBundleSelect({
            bundle_id: 'professional',
            bundle_name: 'Professional Package',
            selected_tiers: { 'Meta Ads': 'Standard', 'Google Ads': 'Standard', 'SEO': 'Standard' },
            selected_services: 'Meta Ads: Standard, Google Ads: Standard, SEO: Standard',
            sub_length: 6,
            final_monthly: 2960
          })}
          disabled={loading}
          className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating Order...' : 'Professional Bundle - $2,960/mo'}
        </button>
        
        <button 
          onClick={() => handleBundleSelect({
            bundle_id: 'enterprise',
            bundle_name: 'Enterprise Package',
            selected_tiers: { 'Meta Ads': 'Premium', 'Google Ads': 'Premium', 'SEO': 'Premium', 'Content': 'Premium' },
            selected_services: 'Meta Ads: Premium, Google Ads: Premium, SEO: Premium, Content: Premium',
            sub_length: 12,
            final_monthly: 5620
          })}
          disabled={loading}
          className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating Order...' : 'Enterprise Bundle - $5,620/mo'}
        </button>
      </div>
    </div>
  );
}

// Step 2: Customer Information Form
export function CustomerInfoForm({ orderId, onNext }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_company: '',
    customer_website: '',
    customer_address: '',
    customer_city: '',
    customer_state: '',
    customer_zip: '',
    marketing_consent: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!formData.customer_email.trim()) newErrors.customer_email = 'Email is required';
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-form',
          orderId,
          ...formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onNext();
      } else {
        throw new Error(data.message || 'Failed to save information');
      }
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Failed to save information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="tel"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            type="text"
            name="customer_company"
            value={formData.customer_company}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="text"
            name="customer_website"
            value={formData.customer_website}
            onChange={handleChange}
            placeholder="example.com"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="customer_address"
            value={formData.customer_address}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            name="customer_city"
            value={formData.customer_city}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              name="customer_state"
              value={formData.customer_state}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ZIP</label>
            <input
              type="text"
              name="customer_zip"
              value={formData.customer_zip}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="marketing_consent"
            checked={formData.marketing_consent}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm">I agree to receive marketing communications</span>
        </label>
      </div>
      
      <div className="mt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}

// Step 3: Disclaimer/Agreement
export function DisclaimerStep({ orderId, onNext }) {
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!signature || !agreed) {
      alert('Please provide your signature and check the agreement box');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept-disclaimer',
          orderId,
          agreement_accepted: true,
          agreement_signature: signature,
          agreement_date: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onNext();
      } else {
        throw new Error(data.message || 'Failed to accept agreement');
      }
    } catch (error) {
      console.error('Error accepting disclaimer:', error);
      alert('Failed to accept agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto mb-6">
        <h3 className="font-bold mb-2">Marketing Services Agreement</h3>
        <p className="mb-4">
          This agreement is entered into between Buzzword Strategies LLC ("Agency") and the undersigned ("Client").
        </p>
        
        <h4 className="font-semibold mt-4 mb-2">1. Services</h4>
        <p className="mb-4">
          Agency agrees to provide Client with the marketing services as specified in the selected bundle and tiers.
        </p>
        
        <h4 className="font-semibold mt-4 mb-2">2. Term</h4>
        <p className="mb-4">
          This Agreement shall commence on the Effective Date and continue for the subscription period selected, 
          automatically renewing monthly thereafter unless canceled with 30 days notice.
        </p>
        
        <h4 className="font-semibold mt-4 mb-2">3. Payment</h4>
        <p className="mb-4">
          Client agrees to pay the monthly fee as specified in the bundle selection. Payment is due in advance.
        </p>
        
        <h4 className="font-semibold mt-4 mb-2">4. Cancellation</h4>
        <p className="mb-4">
          Client may cancel at any time with 30 days written notice. Early termination during the initial term 
          is subject to a fee equal to 50% of the remaining subscription fees.
        </p>
        
        <p className="text-sm text-gray-600 mt-8">
          By signing below, you acknowledge that you have read, understood, and agree to be bound by these terms.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">I have read and agree to the terms and conditions</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Electronic Signature *</label>
          <input
            type="text"
            placeholder="Type your full name"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <button 
          onClick={handleAccept} 
          disabled={loading || !signature || !agreed}
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'I Accept & Continue to Payment'}
        </button>
      </div>
    </div>
  );
}

// Step 4: Payment
export function PaymentStep({ orderId }) {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Fetch order data to get details for Stripe
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/.netlify/functions/get-order?orderId=${orderId}`);
        const data = await response.json();
        if (data.success) {
          setOrderData(data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCheckout = async () => {
    if (!orderData) {
      alert('Order data not loaded. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Redirect to your existing Stripe checkout function
      const queryParams = new URLSearchParams({
        bundleID: orderId,
        bundleName: orderData.bundle_name || 'Marketing Bundle',
        finalMonthly: orderData.final_monthly || '0',
        subLength: orderData.sub_length || '3',
        selectedServices: orderData.selected_services || ''
      }).toString();
      
      window.location.href = `/.netlify/functions/create-stripe-checkout?${queryParams}`;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
      
      {orderData ? (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <p className="text-sm mb-1">Bundle: {orderData.bundle_name}</p>
          <p className="text-sm mb-1">Services: {orderData.selected_services}</p>
          <p className="text-sm mb-1">Subscription: {orderData.sub_length} months</p>
          <p className="text-lg font-bold mt-2">${orderData.final_monthly}/month</p>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mt-2"></div>
        </div>
      )}
      
      <button 
        onClick={handleCheckout} 
        disabled={loading || !orderData}
        className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-400"
      >
        {loading ? 'Redirecting to payment...' : 'Proceed to Secure Payment'}
      </button>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        You will be redirected to Stripe for secure payment processing
      </p>
    </div>
  );
}

// Main Workflow Component
export function OrderWorkflow() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Check if there's an existing order in progress
    const existingOrderId = sessionStorage.getItem('currentOrderId');
    if (existingOrderId) {
      setOrderId(existingOrderId);
      // You could fetch the order status and set the appropriate step
    }
  }, []);

  const handleBundleNext = (newOrderId) => {
    setOrderId(newOrderId);
    setStep(2);
  };

  const handleFormNext = () => {
    setStep(3);
  };

  const handleDisclaimerNext = () => {
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {['Select Bundle', 'Your Information', 'Agreement', 'Payment'].map((label, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > index + 1 ? 'bg-green-500 text-white' : 
                  step === index + 1 ? 'bg-blue-500 text-white' : 
                  'bg-gray-300 text-gray-600'
                }`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>{label}</span>
                {index < 3 && <div className={`flex-1 h-1 mx-2 ${
                  step > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                }`} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="max-w-4xl mx-auto mt-8">
        {step === 1 && <BundleSelection onNext={handleBundleNext} />}
        {step === 2 && orderId && <CustomerInfoForm orderId={orderId} onNext={handleFormNext} />}
        {step === 3 && orderId && <DisclaimerStep orderId={orderId} onNext={handleDisclaimerNext} />}
        {step === 4 && orderId && <PaymentStep orderId={orderId} />}
      </div>
    </div>
  );
}

export default OrderWorkflow;
