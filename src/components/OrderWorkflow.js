
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Step 1: Bundle Selection Component
export function BundleSelection({ onNext }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBundleSelect = async (bundleData) => {
    setLoading(true);
    try {
      // Create new order in Supabase
      const response = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundleData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Store order ID in session storage for workflow
        sessionStorage.setItem('currentOrderId', data.orderId);
        onNext(data.orderId);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to start order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your bundle selection UI */}
      <button 
        onClick={() => handleBundleSelect({
          bundle_id: 'starter',
          bundle_name: 'Starter Package',
          selected_tiers: ['basic'],
          selected_services: ['service1', 'service2'],
          sub_length: 'monthly',
          final_monthly: 99.99
        })}
        disabled={loading}
      >
        {loading ? 'Creating Order...' : 'Select Starter Bundle'}
      </button>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/order/update-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          ...formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onNext();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Failed to save information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.customer_name}
        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.customer_email}
        onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.customer_phone}
        onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
        required
      />
      {/* Add other form fields as needed */}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </form>
  );
}

// Step 3: Disclaimer/Agreement
export function DisclaimerStep({ orderId, onNext }) {
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!signature) {
      alert('Please provide your signature');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/order/accept-disclaimer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error accepting disclaimer:', error);
      alert('Failed to accept agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Terms and Conditions</h2>
      <div style={{ height: '300px', overflow: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {/* Your disclaimer text */}
        <p>Lorem ipsum dolor sit amet...</p>
      </div>
      <input
        type="text"
        placeholder="Type your full name as signature"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />
      <button onClick={handleAccept} disabled={loading || !signature}>
        {loading ? 'Processing...' : 'I Accept'}
      </button>
    </div>
  );
}

// Step 4: Payment
export function PaymentStep({ orderId }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/order/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          priceId: 'price_xxxxx', // Your Stripe price ID
          customerEmail: 'customer@email.com' // Get from order data
        })
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Complete Your Order</h2>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Redirecting to payment...' : 'Proceed to Payment'}
      </button>
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
      // You could also fetch the order status and set the appropriate step
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
    <div>
      {step === 1 && <BundleSelection onNext={handleBundleNext} />}
      {step === 2 && <CustomerInfoForm orderId={orderId} onNext={handleFormNext} />}
      {step === 3 && <DisclaimerStep orderId={orderId} onNext={handleDisclaimerNext} />}
      {step === 4 && <PaymentStep orderId={orderId} />}
    </div>
  );
}
