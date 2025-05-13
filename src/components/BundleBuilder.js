// src/components/BundleBuilder.js
import React, { useState, useEffect, useRef } from 'react';
import UserInfoForm from './UserInfoForm';
import ContractAgreementForm from './ContractAgreementForm';

// Products array outside component to avoid re-creation on each render
const products = [
  "Meta Ads", "Google Ads", "TikTok Ads", "SEO",
  "GBP Ranker", "Backlinks", "Content", "Social Posts"
];

// Service descriptions for info popups
const serviceDescriptions = {
  "Meta Ads": "Reach your ideal customers through targeted Facebook and Instagram advertising.",
  "Google Ads": "Get your business in front of customers actively searching for your products or services.",
  "TikTok Ads": "Connect with younger audiences through engaging short-form video content.",
  "SEO": "Improve your organic visibility in search engines to drive more qualified traffic.",
  "GBP Ranker": "Optimize your Google Business Profile to appear in local searches and Google Maps.",
  "Backlinks": "Build your website's authority through high-quality links from reputable sources.",
  "Content": "Establish thought leadership and improve SEO with professionally written articles.",
  "Social Posts": "Maintain an active and engaging social media presence across major platforms."
};

// Case studies and success metrics for each service
const serviceSuccessStories = {
  "Meta Ads": "A dental clinic in Denver increased new patient appointments by 43% in just 3 months using our Meta Ads service, with a 5.2x return on ad spend.",
  "Google Ads": "A local fitness center generated 127 new membership sign-ups in their first quarter with our Google Ads management, averaging just $38 per acquisition.",
  "TikTok Ads": "A specialty dental lab reached over 500,000 dentists with engaging before/after content, resulting in 47 new lab accounts within 60 days.",
  "SEO": "A small business owner increased organic traffic by 215% year-over-year after 6 months of our SEO service, resulting in 28 new monthly leads.",
  "GBP Ranker": "A multi-location dental practice saw a 67% increase in Google Maps direction requests after optimizing their Google Business Profile.",
  "Backlinks": "An e-commerce store improved domain authority from 18 to 42 in one year with our backlink service, resulting in page 1 rankings for 78 target keywords.",
  "Content": "A B2B service provider established themselves as an industry thought leader, with their blog content generating 34 qualified leads per month.",
  "Social Posts": "A fitness studio increased their social following by 324% in 6 months while generating consistent client referrals through engagement."
};

const BundleBuilder = () => {
  // State for mobile navigation
  const [activeTab, setActiveTab] = useState('industry'); // 'industry', 'services', 'tiers'
  const [isMobile, setIsMobile] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  
  // Refs for scrolling
  const productsSectionRef = useRef(null);
  const tiersSectionRef = useRef(null);
  const pricingSectionRef = useRef(null);
  
  // Product and pricing data
  const pricing = {
    "Meta Ads": { Base: 770, Standard: 980, Premium: 1410 },
    "Google Ads": { Base: 770, Standard: 980, Premium: 1410 },
    "TikTok Ads": { Base: 770, Standard: 980, Premium: 1410 },
    "SEO": { Base: 790, Standard: 1000, Premium: 1450 },
    "GBP Ranker": { Base: 315, Standard: 420, Premium: 675 },
    "Backlinks": { Base: 420, Standard: 630, Premium: 990 },
    "Content": { Base: 210, Standard: 420, Premium: 760 },
    "Social Posts": { Base: 315, Standard: 525, Premium: 895 }
  };

  const businessTypes = ["Dental Clinic", "Dental Lab", "Small Business", "Fitness", "Something Else"];

  // Keep all existing industry descriptions (bestForIndustry and genericBestFor)
  // I'm assuming these are large objects, so I'm not including them in this snippet
  
  // Detailed feature descriptions
  // I'm assuming detailedFeatures is a large object, so I'm not including it in this snippet

  // State variables
  const [selectedTiers, setSelectedTiers] = useState({});
  const [currentlyOpenService, setCurrentlyOpenService] = useState(null);
  const [subLength, setSubLength] = useState(3);
  const [bundleName, setBundleName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalService, setModalService] = useState('');
  const [modalTier, setModalTier] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  
  // New state for the service info modal
  const [showServiceInfoModal, setShowServiceInfoModal] = useState(false);
  const [serviceInfoContent, setServiceInfoContent] = useState({
    title: '',
    description: '',
    successStory: ''
  });
  
  // Form step state variables
  const [formStep, setFormStep] = useState(0); // 0: bundle confirmation, 1: user info, 2: contract agreement
  const [userInfo, setUserInfo] = useState(null);
  const [agreementInfo, setAgreementInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bundleRejected, setBundleRejected] = useState(false);

  // Calculate discounts
  const getSubscriptionDiscount = (months) => {
    const discounts = {
      3: 0, 6: 2, 9: 3.5, 12: 5, 15: 6.5, 18: 8, 21: 9, 24: 10
    };
    return discounts[months] || 0;
  };

  const getBundleDiscount = (num) => {
    const discounts = {
      0: 0, 1: 0, 2: 1, 3: 2.5, 4: 4, 5: 5.5, 6: 7, 7: 8.5, 8: 10
    };
    return discounts[num] || 10;
  };

  // Calculate total pricing
  const calculateFinalPrice = () => {
    const selected = Object.entries(selectedTiers).filter(([_, tier]) => tier);
    const productCount = selected.length;
    let total = selected.reduce((sum, [service, tier]) => sum + pricing[service][tier], 0);

    // Bundle discount is 0 for 0 or 1 product
    const bundleDiscount = productCount <= 1 ? 0 : getBundleDiscount(productCount);
    const subDiscount = getSubscriptionDiscount(subLength);

    const afterBundle = total * (1 - bundleDiscount / 100);
    const final = afterBundle * (1 - subDiscount / 100);
    const totalSaved = total - final;

    return { final, totalSaved, selected, bundleDiscount, productCount };
  };

  const { final, totalSaved, selected, bundleDiscount, productCount } = calculateFinalPrice();
  
  // Discount calculations - both should be 0 if no products selected
  const subscriptionDiscount = productCount > 0 ? getSubscriptionDiscount(subLength) : 0;
  const totalDiscountPercentage = bundleDiscount + subscriptionDiscount;
  const maxDiscount = 20;

  // Get best for text based on selected business type
  const getBestForText = (service, tier) => {
    if (selectedBusiness && bestForIndustry?.[selectedBusiness]?.[service]?.[tier]) {
      return bestForIndustry[selectedBusiness][service][tier];
    }
    return genericBestFor?.[service]?.[tier] || "";
  };

  // Handle tier selection
  const handleTierSelect = (service, tier) => {
    setSelectedTiers(prev => ({
      ...prev,
      [service]: prev[service] === tier ? null : tier
    }));
    
    // On mobile, go back to services tab after selecting a tier
    if (isMobile) {
      setTimeout(() => {
        setActiveTab('services');
        setCurrentlyOpenService(null);
      }, 300);
    }
  };

  // Open modal for tier details
  const openTierDetailsModal = (service, tier) => {
    setModalService(service);
    setModalTier(tier);
    setShowModal(true);
  };
  
  // Open service info modal
  const openServiceInfoModal = (service) => {
    setServiceInfoContent({
      title: service,
      description: serviceDescriptions[service],
      successStory: serviceSuccessStories[service]
    });
    setShowServiceInfoModal(true);
  };

  // Handle industry selection
  const handleIndustrySelect = (industry) => {
    setSelectedBusiness(industry);
    
    // Mobile navigation
    if (isMobile) {
      setActiveTab('services');
    }
  };
  
  // Handle product selection
  const handleProductSelect = (product) => {
    setCurrentlyOpenService(product);
    
    // Mobile navigation
    if (isMobile) {
      setActiveTab('tiers');
    }
  };

  // Form submission handlers
  const handleBundleConfirm = () => {
    setBundleRejected(false);
    setFormStep(1);
  };

  const handleBundleReject = () => {
    setBundleRejected(true);
    setShowPurchaseModal(false);
  };

  const handleUserInfoSubmit = (formData) => {
    setUserInfo(formData);
    setFormStep(2);
  };

  const handleAgreementSubmit = async (agreementData) => {
    setAgreementInfo(agreementData);
    setIsLoading(true);
    
    const bundleID = "bwb-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
    
    const selectedServices = Object.entries(selectedTiers)
      .filter(([, tier]) => tier)
      .map(([product, tier]) => `${product}: ${tier}`)
      .join(', ');
    
    try {
      const response = await fetch('/.netlify/functions/save-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundleID,
          bundleName: bundleName || 'My Bundle',
          subLength,
          finalMonthly: final.toFixed(2),
          selectedServices,
          userInfo: userInfo,
          agreementInfo: agreementData
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert('Error processing your request. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Header scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setHeaderCollapsed(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Load saved bundle on mount
  useEffect(() => {
    const saved = localStorage.getItem("buzzwordBundle");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setSelectedTiers(parsedData.selectedTiers || {});
        setSubLength(parsedData.subLength || 3);
        setBundleName(parsedData.bundleName || "");
        setSelectedBusiness(parsedData.selectedBusiness || "");
        
        // Set active tab based on saved data
        if (parsedData.selectedBusiness) {
          setActiveTab('services');
        }
      } catch (e) {
        console.error("Error loading saved bundle:", e);
      }
    }
  }, []);

  // Save bundle data
  useEffect(() => {
    const bundleData = {
      selectedTiers,
      subLength,
      bundleName,
      selectedBusiness,
      finalMonthly: parseFloat(final.toFixed(2))
    };
    localStorage.setItem("buzzwordBundle", JSON.stringify(bundleData));
  }, [selectedTiers, subLength, bundleName, selectedBusiness, final]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Logo and Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] py-4 px-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <a href="https://www.buzzwordstrategies.com" className="cursor-pointer">
              <img 
                src="https://images.squarespace-cdn.com/content/v1/673fc8d414047c5c20a42e65/ab4663d3-4840-47f0-88cf-a5b1144ed31a/Remove+background+project+%281%29.png?format=1000w"
                alt="Buzzword Strategies" 
                className="h-10 w-auto hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
      
      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-[#121212] border-b border-[#FFBA38]/20">
          <div className="flex justify-between">
            <button 
              onClick={() => setActiveTab('industry')}
              className={`flex-1 py-3 text-xs font-medium ${activeTab === 'industry' ? 'text-[#FFBA38] border-b-2 border-[#FFBA38]' : 'text-[#F8F6F0]/60'}`}
            >
              Industry
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-3 text-xs font-medium ${activeTab === 'services' ? 'text-[#FFBA38] border-b-2 border-[#FFBA38]' : 'text-[#F8F6F0]/60'}`}
            >
              Services {Object.keys(selectedTiers).length > 0 && `(${Object.keys(selectedTiers).length})`}
            </button>
            <button 
              onClick={() => {
                if (currentlyOpenService) {
                  setActiveTab('tiers');
                } else if (Object.keys(selectedTiers).length > 0) {
                  setActiveTab('tiers');
                  setCurrentlyOpenService(Object.keys(selectedTiers)[0]);
                }
              }}
              className={`flex-1 py-3 text-xs font-medium ${activeTab === 'tiers' ? 'text-[#FFBA38] border-b-2 border-[#FFBA38]' : 'text-[#F8F6F0]/60'}`}
              disabled={!currentlyOpenService && Object.keys(selectedTiers).length === 0}
            >
              Tiers
            </button>
          </div>
        </div>
      )}

      {/* Compact Pricing Header */}
      <div className={`sticky ${isMobile ? 'top-11' : 'top-0'} z-40 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#FFBA38]/10 transition-all duration-300 ${headerCollapsed && isMobile ? 'py-1' : 'py-2'}`}>
        <div className="max-w-6xl mx-auto px-3">
          {/* Total Discount Progress Bar */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#F8F6F0]/70">Total Savings</span>
            <span className="text-[#FFBA38]">{totalDiscountPercentage.toFixed(1)}% Discount</span>
          </div>
          <div className="relative w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden mb-2">
            <div 
              className="absolute h-full bg-gradient-to-r from-[#FFBA38] to-[#FFD700] rounded-full transition-all duration-500"
              style={{ width: `${(totalDiscountPercentage / maxDiscount) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-[#F8F6F0]">
                {totalDiscountPercentage < maxDiscount ? 
                  `${(maxDiscount - totalDiscountPercentage).toFixed(1)}% until maximum savings` :
                  'Maximum savings reached!'}
              </span>
            </div>
          </div>
          
          {/* Mobile Compact Subscription Length */}
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-[#F8F6F0]/70">Length</span>
                <span className="text-[#FFBA38]">{subLength} Months · {subscriptionDiscount}% Off</span>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="3"
                value={subLength}
                onChange={(e) => setSubLength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#2A2A2A] rounded-full appearance-none cursor-pointer accent-[#FFBA38]"
                style={{
                  background: `linear-gradient(to right, #FFBA38 0%, #FFBA38 ${(subLength - 3) / 21 * 100}%, #2A2A2A ${(subLength - 3) / 21 * 100}%, #2A2A2A 100%)`
                }}
              />
            </div>
            
            {/* Price Display */}
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-[#F8F6F0]">${final.toFixed(2)}</div>
              <div className="text-xs text-[#FFBA38]/70">Per Month</div>
            </div>
          </div>
          
          {/* Purchase Button (only show if services selected) */}
          {selected.length > 0 && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="px-4 py-2 bg-[#FFBA38] hover:bg-[#D4941E] text-[#1A1A1A] text-sm font-semibold rounded-lg transition-all duration-300"
              >
                Continue to Purchase
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-3 py-3">
        {/* Industry Selection (Step 1) */}
        {(!isMobile || activeTab === 'industry') && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#FFBA38]/70 uppercase tracking-wider mb-3">Select Your Industry</h3>
            <div className="grid grid-cols-3 gap-2">
              {businessTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleIndustrySelect(type)}
                  className={`px-3 py-2 text-xs rounded-lg transition-all duration-300 ${
                    selectedBusiness === type
                      ? 'bg-[#FFBA38] text-[#1A1A1A] font-medium'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A]/80 border border-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid (Step 2) */}
        {(!isMobile || activeTab === 'services') && selectedBusiness && (
          <div className="mb-6" ref={productsSectionRef}>
            <h3 className="text-sm font-medium text-[#FFBA38]/70 uppercase tracking-wider mb-3">Select Services</h3>
            <div className="grid grid-cols-4 gap-2">
              {products.map(service => (
                <div 
                  key={service} 
                  className={`relative p-2 rounded-lg transition-all duration-300 cursor-pointer text-center ${
                    selectedTiers[service] 
                      ? 'bg-[#2A2A2A] text-[#F8F6F0] border border-[#FFBA38]/30'
                      : 'bg-[#2A2A2A] text-[#F8F6F0]/70 hover:bg-[#2A2A2A]/80 border border-gray-700'
                  }`}
                  onClick={() => handleProductSelect(service)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium mb-1">{service}</span>
                    <span className="text-[10px] text-[#FFBA38]">
                      From ${Math.min(...Object.values(pricing[service]))}
                    </span>
                    
                    {/* Info button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openServiceInfoModal(service);
                      }}
                      className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#121212] text-[#F8F6F0]/60 flex items-center justify-center"
                    >
                      <span className="text-[8px]">i</span>
                    </button>
                    
                    {/* Selected indicator */}
                    {selectedTiers[service] && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFBA38] rounded-full flex items-center justify-center text-[#1A1A1A] text-[8px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Services */}
        {(!isMobile || activeTab === 'services') && selected.length > 0 && (
          <div className="mb-6" ref={pricingSectionRef}>
            <h3 className="text-sm font-medium text-[#FFBA38]/70 uppercase tracking-wider mb-3">Your Selected Services</h3>
            <div className="space-y-2">
              {selected.map(([product, tier]) => (
                <div key={product} className="flex items-center justify-between px-3 py-2 bg-[#2A2A2A] text-[#F8F6F0] rounded-lg border border-[#FFBA38]/20">
                  <div className="flex items-center">
                    <span className="text-xs font-medium">{product}</span>
                    <span className="text-xs text-[#F8F6F0]/60 ml-1">({tier})</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-[#FFBA38] mr-2">${pricing[product][tier]}</span>
                    <button
                      onClick={() => handleTierSelect(product, null)}
                      className="text-[#F8F6F0]/60 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier Selection (Step 3) */}
        {(!isMobile || activeTab === 'tiers') && currentlyOpenService && (
          <div ref={tiersSectionRef}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#FFBA38]/70 uppercase tracking-wider">
                {currentlyOpenService} Tiers
              </h3>
              {isMobile && (
                <button 
                  onClick={() => {
                    setActiveTab('services');
                    setCurrentlyOpenService(null);
                  }}
                  className="text-xs text-[#FFBA38] underline"
                >
                  Back to Services
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {["Base", "Standard", "Premium"].map(tier => (
                <div
                  key={tier}
                  onClick={() => handleTierSelect(currentlyOpenService, tier)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTiers[currentlyOpenService] === tier 
                      ? 'bg-[#2A2A2A] border-2 border-[#FFBA38]' 
                      : 'bg-[#2A2A2A] border border-gray-700 hover:border-[#FFBA38]/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#F8F6F0]">{tier}</h4>
                      <div className="text-lg font-bold text-[#FFBA38]">
                        ${pricing[currentlyOpenService][tier]}
                        <span className="text-xs text-[#F8F6F0]/60 font-normal">/mo</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTierDetailsModal(currentlyOpenService, tier);
                      }}
                      className="w-5 h-5 rounded-full bg-[#1A1A1A] text-[#F8F6F0]/60 flex items-center justify-center"
                    >
                      <span className="text-xs">i</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-[#F8F6F0]/80 mt-2">
                    {getBestForText(currentlyOpenService, tier)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-[#121212] rounded-xl p-4 w-full max-w-md border border-[#FFBA38]/20 max-h-[90vh] overflow-y-auto">
            {formStep === 0 ? (
              // Step 1: Bundle Confirmation
              <>
                <h2 className="text-xl font-bold text-[#F8F6F0] mb-4">Finalize Your Bundle</h2>
                <input
                  type="text"
                  placeholder="Bundle Name (Optional)"
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  className="w-full p-3 bg-[#2A2A2A] border border-[#FFBA38]/20 rounded-lg mb-4 text-[#F8F6F0] placeholder-[#F8F6F0]/40 text-sm"
                />
                
                <div className="p-3 bg-[#2A2A2A] border border-[#FFBA38]/20 rounded-lg mb-4">
                  <h3 className="font-medium text-[#FFBA38] text-sm mb-2">Selected Services</h3>
                  <ul className="space-y-1">
                    {selected.map(([product, tier]) => (
                      <li key={product} className="flex justify-between items-center text-xs">
                        <span className="text-[#F8F6F0]">{product}</span>
                        <span className="text-[#F8F6F0]/70">{tier}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-[#FFBA38]/10">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#F8F6F0]/70">Subscription Length</span>
                      <span className="text-[#F8F6F0]">{subLength} months</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-[#FFBA38] mb-1">${final.toFixed(2)}/month</div>
                  <div className="text-xs text-[#F8F6F0]/70">Total monthly savings: ${totalSaved.toFixed(2)}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleBundleReject}
                    className="py-2 bg-[#2A2A2A] text-[#F8F6F0]/70 rounded-lg hover:bg-[#2A2A2A]/80 font-medium transition-colors text-sm"
                  >
                    Reject Bundle
                  </button>
                  <button
                    onClick={handleBundleConfirm}
                    className="py-2 bg-[#FFBA38] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#D4941E] transition-colors text-sm"
                  >
                    Approve Bundle
                  </button>
                </div>
              </>
            ) : formStep === 1 ? (
              // Step 2: User Information Form
              <UserInfoForm 
                onSubmit={handleUserInfoSubmit} 
                onCancel={() => setFormStep(0)} 
              />
            ) : (
              // Step 3: Contract Agreement
              <>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-3 border-[#FFBA38] border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-[#F8F6F0] text-sm">Processing your agreement...</p>
                  </div>
                ) : (
                  <ContractAgreementForm 
                    onSubmit={handleAgreementSubmit}
                    onCancel={() => setFormStep(1)}
                    bundleName={bundleName}
                    selectedServices={Object.entries(selectedTiers)
                      .filter(([, tier]) => tier)
                      .map(([product, tier]) => `${product}: ${tier}`)
                      .join(', ')}
                    clientName={userInfo?.clientName || ''}
                    subLength={subLength}
                    finalMonthly={final.toFixed(2)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Feature Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-[#121212] rounded-xl p-4 w-full max-w-md border border-[#FFBA38]/20 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-[#FFBA38]/10 pb-3">
              <h2 className="text-lg font-bold text-[#F8F6F0]">
                {modalService} – {modalTier} Tier
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-[#2A2A2A] text-[#F8F6F0]/60 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal content would go here */}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleTierSelect(modalService, modalTier);
                }}
                className="flex-1 py-2 bg-[#FFBA38] text-[#1A1A1A] font-medium rounded-lg hover:bg-[#D4941E] transition-colors text-sm"
              >
                Select This Tier
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-[#2A2A2A] text-[#F8F6F0] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Info Modal */}
      {showServiceInfoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-[#121212] rounded-xl p-4 w-full max-w-md border border-[#FFBA38]/20 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-[#FFBA38]/10 pb-3">
              <h2 className="text-lg font-bold text-[#F8F6F0]">
                {serviceInfoContent.title}
              </h2>
              <button
                onClick={() => setShowServiceInfoModal(false)}
                className="w-7 h-7 rounded-full bg-[#2A2A2A] text-[#F8F6F0]/60 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-[#F8F6F0]/80 mb-4">
                {serviceInfoContent.description}
              </p>
              
              <div className="p-3 bg-[#FFBA38]/10 border border-[#FFBA38]/20 rounded-lg">
                <h3 className="text-xs font-semibold text-[#FFBA38] mb-2">
                  Success Story
                </h3>
                <p className="text-xs text-[#F8F6F0]/80 italic">
                  "{serviceInfoContent.successStory}"
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowServiceInfoModal(false);
                  handleProductSelect(serviceInfoContent.title);
                }}
                className="flex-1 py-2 bg-[#FFBA38] text-[#1A1A1A] font-medium rounded-lg hover:bg-[#D4941E] transition-colors text-sm"
              >
                Select This Service
              </button>
              <button
                onClick={() => setShowServiceInfoModal(false)}
                className="flex-1 py-2 bg-[#2A2A2A] text-[#F8F6F0] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Back to Top" button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 bg-[#FFBA38] text-[#1A1A1A] rounded-full p-2 shadow-lg hover:bg-[#D4941E] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Fixed FAB for checkout when products selected */}
      {isMobile && selected.length > 0 && !showPurchaseModal && (
        <div className="fixed z-40 bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="bg-[#FFBA38] text-[#1A1A1A] font-medium rounded-full py-2 px-6 shadow-lg flex items-center"
          >
            <span className="mr-2">${final.toFixed(2)}/mo</span>
            <span>Checkout</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}

      {/* Custom styles */}
      <style jsx>{`
        /* Slider styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #FFBA38;
          border: 2px solid #F8F6F0;
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #FFBA38;
          border: 2px solid #F8F6F0;
          border-radius: 50%;
          cursor: pointer;
        }
        
        /* Professional scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1A1A1A;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #FFBA38;
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #D4941E;
        }
      `}</style>
    </div>
  );
};

export default BundleBuilder;
