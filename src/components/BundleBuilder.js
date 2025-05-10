import React, { useState, useEffect } from 'react';

const BundleBuilder = () => {
  // Product and pricing data
  const products = [
    "Meta Ads", "Google Ads", "TikTok Ads", "SEO",
    "GBP Ranker", "Backlinks", "Content", "Social Posts"
  ];

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

  // Industry-specific tier descriptions
  const bestForIndustry = {
    "Dental Clinic": {
      "Meta Ads": {
        Base: "Want to fill empty chairs & attract patients seeking routine care",
        Standard: "Ready to book high-value procedures like implants & ortho", 
        Premium: "Need to dominate your market & expand to new locations"
      },
      "Google Ads": {
        Base: "Want patients searching 'dentist near me' to find you first",
        Standard: "Ready to capture searches for profitable specialties",
        Premium: "Need to own every dental search in your city"
      },
      "TikTok Ads": {
        Base: "Want to attract younger patients with engaging content",
        Standard: "Ready to showcase smile transformations that go viral",
        Premium: "Need to build a recognizable brand across regions"
      },
      "SEO": {
        Base: "Want your website to show up in local dental searches",
        Standard: "Ready to rank #1 for implants, veneers & orthodontics",
        Premium: "Need to dominate every dental keyword in your market"
      },
      "GBP Ranker": {
        Base: "Want more 5-star reviews & better Google Maps visibility",
        Standard: "Ready to be the top choice when patients compare clinics",
        Premium: "Need to control the local search landscape"
      },
      "Backlinks": {
        Base: "Want Google to see your practice as trustworthy",
        Standard: "Ready to outrank established competitors",
        Premium: "Need unshakeable authority in your market"
      },
      "Content": {
        Base: "Want to educate patients & build trust online",
        Standard: "Ready to be seen as the dental expert in your area",
        Premium: "Need to be the go-to resource for dental information"
      },
      "Social Posts": {
        Base: "Want to stay connected with current patients",
        Standard: "Ready to showcase before/after results daily",
        Premium: "Need an always-active social presence that converts"
      }
    },
    "Dental Lab": {
      "Meta Ads": {
        Base: "Want local dentists to discover your lab services",
        Standard: "Ready to expand beyond your current service area",
        Premium: "Need to be the preferred lab nationwide"
      },
      "Google Ads": {
        Base: "Want dentists searching for labs to find you first",
        Standard: "Ready to promote digital dentistry capabilities",
        Premium: "Need to capture all high-value dental lab searches"
      },
      "TikTok Ads": {
        Base: "Want to showcase your craftsmanship to dentists",
        Standard: "Ready to demonstrate cutting-edge technology",
        Premium: "Need to be seen as the innovation leader"
      },
      "SEO": {
        Base: "Want dentists to find your lab when researching options",
        Standard: "Ready to rank for all major lab services",
        Premium: "Need to dominate dental lab search results"
      },
      "GBP Ranker": {
        Base: "Want better visibility when dentists search locally",
        Standard: "Ready to stand out from competing labs",
        Premium: "Need to control regional lab search results"
      },
      "Backlinks": {
        Base: "Want search engines to trust your lab website",
        Standard: "Ready to build industry-wide recognition",
        Premium: "Need unquestionable authority in dental technology"
      },
      "Content": {
        Base: "Want to share technical expertise with dentists",
        Standard: "Ready to publish case studies that attract clients",
        Premium: "Need to be the thought leader in dental technology"
      },
      "Social Posts": {
        Base: "Want to showcase completed cases regularly",
        Standard: "Ready to engage the dental community daily",
        Premium: "Need to be the most visible lab on social media"
      }
    },
    "Small Business": {
      "Meta Ads": {
        Base: "Want to test if social media can bring customers",
        Standard: "Ready to scale what's working & reach more people",
        Premium: "Need to maximize every opportunity for growth"
      },
      "Google Ads": {
        Base: "Want your first consistent source of new leads",
        Standard: "Ready to expand services & capture more searches",
        Premium: "Need to dominate your industry online"
      },
      "TikTok Ads": {
        Base: "Want to see if viral content can grow your business",
        Standard: "Ready to build a community around your brand",
        Premium: "Need to scale viral success into real revenue"
      },
      "SEO": {
        Base: "Want customers to find you instead of competitors",
        Standard: "Ready to rank for multiple services & locations",
        Premium: "Need to be the undisputed online leader"
      },
      "GBP Ranker": {
        Base: "Want better reviews & local search visibility",
        Standard: "Ready to be the obvious choice in your area",
        Premium: "Need to dominate local search across regions"
      },
      "Backlinks": {
        Base: "Want Google to see you as a legitimate business",
        Standard: "Ready to build authority in your industry",
        Premium: "Need bulletproof online credibility"
      },
      "Content": {
        Base: "Want to start attracting customers with helpful content",
        Standard: "Ready to be seen as an industry expert",
        Premium: "Need to be the leading voice in your field"
      },
      "Social Posts": {
        Base: "Want to build initial social media presence",
        Standard: "Ready for consistent engagement & growth",
        Premium: "Need social media to drive significant revenue"
      }
    },
    "Fitness": {
      "Meta Ads": {
        Base: "Want to fill classes & attract new members locally",
        Standard: "Ready to promote specialty programs & trainers",
        Premium: "Need to scale membership across locations"
      },
      "Google Ads": {
        Base: "Want people searching 'gym near me' to find you",
        Standard: "Ready to promote personal training & programs",
        Premium: "Need to capture every fitness-related search"
      },
      "TikTok Ads": {
        Base: "Want to showcase your gym culture & energy",
        Standard: "Ready to build a fitness community online",
        Premium: "Need viral transformation content at scale"
      },
      "SEO": {
        Base: "Want to rank when people search for local gyms",
        Standard: "Ready to rank for specific programs & classes",
        Premium: "Need to dominate all fitness searches in your market"
      },
      "GBP Ranker": {
        Base: "Want better visibility in local gym searches",
        Standard: "Ready to showcase all your classes & amenities",
        Premium: "Need to own the local fitness search results"
      },
      "Backlinks": {
        Base: "Want search engines to trust your fitness brand",
        Standard: "Ready to build authority in the fitness space",
        Premium: "Need unmatched online fitness authority"
      },
      "Content": {
        Base: "Want to share workout tips & gym updates",
        Standard: "Ready to be the local fitness knowledge source",
        Premium: "Need to be the ultimate fitness resource"
      },
      "Social Posts": {
        Base: "Want to showcase member success stories",
        Standard: "Ready for daily motivation & class highlights",
        Premium: "Need non-stop engaging fitness content"
      }
    },
    "Something Else": {
      "Meta Ads": {
        Base: "Get started with targeted social media advertising",
        Standard: "Scale successful campaigns & reach your ideal audience",
        Premium: "Maximize reach & achieve market leadership through social"
      },
      "Google Ads": {
        Base: "Start capturing customers actively searching for your offerings",
        Standard: "Expand visibility across search networks & capture more demand",
        Premium: "Dominate search results & capture all relevant traffic"
      },
      "TikTok Ads": {
        Base: "Test viral marketing & reach new audiences",
        Standard: "Build engaged community & consistent content strategy",
        Premium: "Lead your industry with viral content at scale"
      },
      "SEO": {
        Base: "Improve visibility in organic search results",
        Standard: "Rank for competitive keywords & multiple service areas",
        Premium: "Achieve complete search domination in your industry"
      },
      "GBP Ranker": {
        Base: "Enhance local visibility & gather more reviews",
        Standard: "Become the preferred choice in local searches",
        Premium: "Control local search results across all service areas"
      },
      "Backlinks": {
        Base: "Build initial domain authority & credibility",
        Standard: "Establish strong industry presence & trust",
        Premium: "Achieve unmatched authority in your market"
      },
      "Content": {
        Base: "Start attracting customers with valuable content",
        Standard: "Position yourself as an industry thought leader",
        Premium: "Become the definitive resource in your field"
      },
      "Social Posts": {
        Base: "Establish consistent social media presence",
        Standard: "Drive engagement & build loyal following",
        Premium: "Transform social media into a revenue engine"
      }
    }
  };

  // Generic best for (fallback)
  const genericBestFor = {
    "Meta Ads": {
      Base: "Want to test if social ads can grow your business",
      Standard: "Ready to scale successful campaigns & reach more customers",
      Premium: "Need maximum reach & sophisticated targeting"
    },
    "Google Ads": {
      Base: "Want your first reliable source of online leads",
      Standard: "Ready to expand reach & capture more searches",
      Premium: "Need to dominate your market's search results"
    },
    "TikTok Ads": {
      Base: "Want to explore viral marketing potential",
      Standard: "Ready to build an engaged community",
      Premium: "Need to scale viral content into revenue"
    },
    "SEO": {
      Base: "Want to be found online by potential customers",
      Standard: "Ready to outrank your competition",
      Premium: "Need to dominate every relevant search"
    },
    "GBP Ranker": {
      Base: "Want better local search visibility",
      Standard: "Ready to become the top local choice",
      Premium: "Need to control local search results"
    },
    "Backlinks": {
      Base: "Want Google to trust your website more",
      Standard: "Ready to build serious online authority",
      Premium: "Need unshakeable search dominance"
    },
    "Content": {
      Base: "Want to start attracting customers with content",
      Standard: "Ready to establish thought leadership",
      Premium: "Need to be the industry's go-to resource"
    },
    "Social Posts": {
      Base: "Want to build initial social presence",
      Standard: "Ready for consistent social engagement",
      Premium: "Need social media as a revenue driver"
    }
  };

  // Detailed tier features
  const detailedFeatures = {
    "Google Ads": {
      Base: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by Google.",
        budget: "Recommended Media Budget: $0–$2,500 monthly paid directly to Google",
        features: [
          "• Strategic search and display campaign development",
          "• Professional keyword research and selection",
          "• Google Ads pixel implementation",
          "• Custom ad creation with extensions",
          "• Weekly performance analysis and reporting"
        ]
      },
      Standard: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by Google.",
        budget: "Recommended Media Budget: $2,500–$5,000 monthly paid directly to Google",
        features: [
          "• Includes all Base tier services",
          "• Advanced keyword expansion strategies",
          "• Comprehensive A/B testing protocols",
          "• Sophisticated remarketing campaigns",
          "• Bi-weekly optimization consultations"
        ]
      },
      Premium: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by Google.",
        budget: "Recommended Media Budget: $5,000+ monthly paid directly to Google",
        features: [
          "• Includes all Standard tier services",
          "• Performance Max campaign deployment",
          "• Dedicated account strategist",
          "• Full-funnel conversion optimization",
          "• Weekly executive strategy sessions"
        ]
      }
    },
    "Meta Ads": {
      Base: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by Meta.",
        budget: "Recommended Media Budget: $0–$2,500 monthly paid directly to Meta",
        features: [
          "• Comprehensive campaign strategy development",
          "• Three custom-designed ad creatives",
          "• Facebook pixel installation and configuration",
          "• Precision audience targeting",
          "• Weekly performance monitoring"
        ]
      },
      Standard: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by Meta.",
        budget: "Recommended Media Budget: $2,500–$5,000 monthly paid directly to Meta",
        features: [
          "• Includes all Base tier services",
          "• Six professional ad creatives",
          "• Advanced retargeting implementation",
          "• Lookalike audience development",
          "• Bi-weekly performance optimization"
        ]
      },
      Premium: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by Meta.",
        budget: "Recommended Media Budget: $5,000+ monthly paid directly to Meta",
        features: [
          "• Includes all Standard tier services",
          "• Nine or more premium ad creatives",
          "• Comprehensive full-funnel campaigns",
          "• Advanced conversion tracking systems",
          "• Weekly strategic advisory sessions"
        ]
      }
    },
    "TikTok Ads": {
      Base: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by TikTok.",
        budget: "Recommended Media Budget: $500–$2,500 monthly paid directly to TikTok",
        features: [
          "• Strategic campaign architecture",
          "• TikTok pixel integration",
          "• Audience segmentation and targeting",
          "• Professional ad copywriting",
          "• Monthly budget allocation guidance"
        ]
      },
      Standard: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by TikTok.",
        budget: "Recommended Media Budget: $2,500–$5,000 monthly paid directly to TikTok",
        features: [
          "• Includes all Base tier services",
          "• Creative testing methodology",
          "• Custom audience development",
          "• Performance optimization protocols",
          "• Bi-weekly analytics reporting"
        ]
      },
      Premium: {
        disclaimer: "Management Service Notice: This plan includes expert campaign management by Buzzword Strategies. Media spend is billed separately by TikTok.",
        budget: "Recommended Media Budget: $5,000+ monthly paid directly to TikTok",
        features: [
          "• Includes all Standard tier services",
          "• User-generated content coordination",
          "• Advanced targeting strategies",
          "• Comprehensive analytics dashboard",
          "• Weekly optimization consultations"
        ]
      }
    },
    "SEO": {
      Base: {
        features: [
          "• 10 strategically selected keywords",
          "• Google Analytics configuration",
          "• XML sitemap development",
          "• Foundational on-page optimization",
          "• Monthly ranking reports"
        ]
      },
      Standard: {
        features: [
          "• Includes all Base tier services",
          "• 20 targeted keywords",
          "• Technical SEO audit",
          "• Content optimization strategy",
          "• Competitive analysis"
        ]
      },
      Premium: {
        features: [
          "• Includes all Standard tier services",
          "• 40 high-value keywords",
          "• Advanced link building strategy",
          "• Local SEO optimization",
          "• Quarterly strategic reviews"
        ]
      }
    },
    "GBP Ranker": {
      Base: {
        features: [
          "• One optimized image weekly",
          "• Monthly Q&A content",
          "• AI-powered review responses",
          "• Profile optimization",
          "• Basic ranking analytics"
        ]
      },
      Standard: {
        features: [
          "• Includes all Base tier services",
          "• Three optimized images weekly",
          "• Bi-weekly Q&A content",
          "• Enhanced AI response system",
          "• Category optimization"
        ]
      },
      Premium: {
        features: [
          "• Includes all Standard tier services",
          "• Daily image optimization",
          "• Weekly Q&A content",
          "• Human-verified responses",
          "• Multi-location management"
        ]
      }
    },
    "Backlinks": {
      Base: {
        features: [
          "• 10 high-quality backlinks monthly",
          "• DA 10+ domain selection",
          "• Diverse link portfolio",
          "• Natural anchor text distribution",
          "• Monthly link acquisition report"
        ]
      },
      Standard: {
        features: [
          "• Includes all Base tier services",
          "• 15 premium backlinks monthly",
          "• DA 30+ domain selection",
          "• 500-word guest articles",
          "• Competitor link analysis"
        ]
      },
      Premium: {
        features: [
          "• Includes all Standard tier services",
          "• 20 authority backlinks monthly",
          "• DA 50+ domain selection",
          "• 1,000-word guest articles",
          "• Strategic link planning"
        ]
      }
    },
    "Content": {
      Base: {
        features: [
          "• One professional article monthly",
          "• 500-word composition",
          "• SEO optimization",
          "• Human editorial review",
          "• Blog publication service"
        ]
      },
      Standard: {
        features: [
          "• Includes all Base tier services",
          "• Two articles monthly",
          "• 1,000 words per article",
          "• Keyword research integration",
          "• Internal linking strategy"
        ]
      },
      Premium: {
        features: [
          "• Includes all Standard tier services",
          "• Four articles monthly",
          "• 2,000 words per article",
          "• Topic clustering strategy",
          "• Content calendar development"
        ]
      }
    },
    "Social Posts": {
      Base: {
        features: [
          "• Four posts monthly",
          "• Single platform focus",
          "• Licensed imagery",
          "• Strategic scheduling",
          "• Monthly analytics report"
        ]
      },
      Standard: {
        features: [
          "• Includes all Base tier services",
          "• 16 posts monthly",
          "• Three platform distribution",
          "• Custom graphics design",
          "• Engagement monitoring"
        ]
      },
      Premium: {
        features: [
          "• Includes all Standard tier services",
          "• 28 posts monthly",
          "• Six platform coverage",
          "• Video content creation",
          "• Community management"
        ]
      }
    }
  };

  // State variables
  const [selectedTiers, setSelectedTiers] = useState({});
  const [currentlyOpenService, setCurrentlyOpenService] = useState(products[0]);
  const [subLength, setSubLength] = useState(3);
  const [bundleName, setBundleName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalService, setModalService] = useState('');
  const [modalTier, setModalTier] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState('');

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
    if (selectedBusiness && bestForIndustry[selectedBusiness]) {
      return bestForIndustry[selectedBusiness][service][tier];
    }
    return genericBestFor[service][tier];
  };

  // Handle tier selection
  const handleTierSelect = (service, tier) => {
    setSelectedTiers(prev => ({
      ...prev,
      [service]: prev[service] === tier ? null : tier
    }));
  };

  // Open modal for tier details
  const openTierDetailsModal = (service, tier) => {
    setModalService(service);
    setModalTier(tier);
    setShowModal(true);
  };

  // Process checkout
  const openDocuSignModal = async () => {
    const bundleID = "bwb-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
    
    const selectedServices = Object.entries(selectedTiers)
      .filter(([, tier]) => tier)
      .map(([product, tier]) => `${product}: ${tier}`)
      .join(', ');
    
    console.log('Sending to DocuSign:', {
      bundleID,
      bundleName: bundleName || 'My Bundle',
      subLength,
      finalMonthly: final.toFixed(2),
      selectedServices
    });

    try {
      const response = await fetch('/.netlify/functions/create-docusign-envelope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundleID,
          bundleName: bundleName || 'My Bundle',
          subLength,
          finalMonthly: final.toFixed(2),
          selectedServices
        })
      });
      
      console.log('DocuSign response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('DocuSign error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('DocuSign response data:', data);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error generating contract. Please try again. No URL returned from DocuSign.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error generating contract: ${error.message}. Please check the console for more details.`);
    }
  };

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
        const firstService = Object.keys(parsedData.selectedTiers).find(service => products.includes(service)) || products[0];
        setCurrentlyOpenService(firstService);
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
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] py-6 px-4 border-b border-[#FFBA38]/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <a href="https://www.buzzwordstrategies.com" className="cursor-pointer">
              <img 
                src="https://images.squarespace-cdn.com/content/v1/673fc8d414047c5c20a42e65/ab4663d3-4840-47f0-88cf-a5b1144ed31a/Remove+background+project+%281%29.png?format=1000w"
                alt="Buzzword Strategies" 
                className="h-14 w-auto hover:opacity-90 transition-opacity"
              />
            </a>
            
            {/* Business Selector */}
            <div className="flex flex-col items-center gap-3 w-full">
              <span className="text-sm text-[#FFBA38]/70 uppercase tracking-wider">Select Industry</span>
              <div className="flex flex-wrap gap-3 justify-center px-2">
                {businessTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedBusiness(type)}
                    className={`px-6 py-3 text-sm rounded-lg transition-all duration-300 ${
                      selectedBusiness === type
                        ? 'bg-[#FFBA38] text-[#1A1A1A] font-medium shadow-lg shadow-[#FFBA38]/20'
                        : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A]/80 border border-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#FFBA38]/10">
        <div className="max-w-6xl mx-auto">
          {/* Total Discount Progress Bar */}
          <div className="bg-[#121212]/50 py-4 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#F8F6F0]/70">Total Savings</span>
                <span className="text-sm font-semibold text-[#FFBA38]">
                  {totalDiscountPercentage.toFixed(1)}% Discount
                </span>
              </div>
              <div className="relative w-full h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-[#FFBA38] to-[#FFD700] rounded-full transition-all duration-500"
                  style={{ width: `${(totalDiscountPercentage / maxDiscount) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#F8F6F0]">
                    {totalDiscountPercentage < maxDiscount ? 
                      `${(maxDiscount - totalDiscountPercentage).toFixed(1)}% until maximum savings` :
                      'Maximum savings reached!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="px-4 py-4">
            <div className="flex items-start justify-between gap-8">
              {/* Subscription Term */}
              <div className="flex-1 max-w-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-[#F8F6F0]/70">Subscription Length</span>
                  <span className="text-sm font-semibold text-[#FFBA38]">
                    {subLength} Months · {subscriptionDiscount}% Off
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="24"
                  step="3"
                  value={subLength}
                  onChange={(e) => setSubLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#2A2A2A] rounded-full appearance-none cursor-pointer accent-[#FFBA38]"
                  style={{
                    background: `linear-gradient(to right, #FFBA38 0%, #FFBA38 ${(subLength - 3) / 21 * 100}%, #2A2A2A ${(subLength - 3) / 21 * 100}%, #2A2A2A 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-[#F8F6F0]/50 mt-2">
                  <span>3</span>
                  <span>12</span>
                  <span>24</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-right">
                <div className="text-4xl font-bold text-[#F8F6F0] mb-1">${final.toFixed(2)}</div>
                <div className="text-sm text-[#FFBA38]/70 mb-3">Per Month</div>
                {selected.length > 0 && (
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="px-6 py-3 bg-[#FFBA38] hover:bg-[#D4941E] text-[#1A1A1A] font-semibold rounded-lg transition-all duration-300"
                  >
                    Continue to Purchase
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Selected Services */}
        {selected.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-[#FFBA38]/70 uppercase tracking-wider mb-4">Selected Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selected.map(([product, tier]) => (
                <div key={product} className="flex items-center justify-between px-4 py-3 bg-[#2A2A2A] text-[#F8F6F0] rounded-lg border border-[#FFBA38]/20">
                  <span className="font-medium">{product} – {tier}</span>
                  <button
                    onClick={() => handleTierSelect(product, null)}
                    className="text-[#F8F6F0]/60 hover:text-red-500 transition-colors ml-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Selection */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-[#FFBA38]/70 uppercase tracking-wider mb-4">Select Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map(service => (
              <button
                key={service}
                onClick={() => setCurrentlyOpenService(service)}
                className={`relative p-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  service === currentlyOpenService 
                    ? 'bg-[#FFBA38] text-[#1A1A1A]' 
                    : selectedTiers[service] 
                      ? 'bg-[#2A2A2A] text-[#F8F6F0] border border-[#FFBA38]/30'
                      : 'bg-[#2A2A2A] text-[#F8F6F0]/70 hover:bg-[#2A2A2A]/80'
                }`}
              >
                {service}
                {selectedTiers[service] && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFBA38] rounded-full flex items-center justify-center text-[#1A1A1A] text-xs font-bold">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tier Selection */}
        {currentlyOpenService && (
          <div>
            <h3 className="text-sm font-medium text-[#FFBA38]/70 uppercase tracking-wider mb-4">
              Choose {currentlyOpenService} Tier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Base", "Standard", "Premium"].map(tier => (
                <div
                  key={tier}
                  onClick={() => handleTierSelect(currentlyOpenService, tier)}
                  className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTiers[currentlyOpenService] === tier 
                      ? 'bg-[#2A2A2A] border-2 border-[#FFBA38]' 
                      : 'bg-[#2A2A2A] border border-gray-700 hover:border-[#FFBA38]/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-[#F8F6F0] mb-1">{tier}</h4>
                      <div className="text-3xl font-bold text-[#FFBA38]">
                        ${pricing[currentlyOpenService][tier]}
                        <span className="text-sm text-[#F8F6F0]/60 font-normal">/month</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTierDetailsModal(currentlyOpenService, tier);
                      }}
                      className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F8F6F0]/60 hover:bg-[#121212] hover:text-[#FFBA38] transition-all flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-[#F8F6F0]/80 leading-relaxed">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] rounded-xl p-8 w-full max-w-md border border-[#FFBA38]/20">
            <h2 className="text-2xl font-bold text-[#F8F6F0] mb-6">Finalize Your Bundle</h2>
            <input
              type="text"
              placeholder="Bundle Name (Optional)"
              value={bundleName}
              onChange={(e) => setBundleName(e.target.value)}
              className="w-full p-4 bg-[#2A2A2A] border border-[#FFBA38]/20 rounded-lg mb-6 text-[#F8F6F0] placeholder-[#F8F6F0]/40 focus:border-[#FFBA38]/50 focus:outline-none transition-colors"
            />
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-[#FFBA38] mb-2">${final.toFixed(2)}/month</div>
              <div className="text-sm text-[#F8F6F0]/70">Total monthly savings: ${totalSaved.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="py-3 bg-[#2A2A2A] text-[#F8F6F0]/70 rounded-lg hover:bg-[#2A2A2A]/80 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={openDocuSignModal}
                className="py-3 bg-[#FFBA38] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#D4941E] transition-colors"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] rounded-xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-[#FFBA38]/20">
            <div className="flex justify-between items-center mb-6 border-b border-[#FFBA38]/10 pb-4">
              <h2 className="text-2xl font-bold text-[#F8F6F0]">
                {modalService} – {modalTier} Tier
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-[#2A2A2A] text-[#F8F6F0]/60 hover:bg-[#1A1A1A] hover:text-[#FFBA38] transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Disclaimer for Ad Services */}
            {detailedFeatures[modalService]?.[modalTier]?.disclaimer && (
              <div className="mb-6 p-4 bg-[#FFBA38]/10 border border-[#FFBA38]/20 rounded-lg">
                <p className="text-sm text-[#F8F6F0]/80 mb-3">
                  {detailedFeatures[modalService][modalTier].disclaimer}
                </p>
                <p className="text-sm text-[#FFBA38] font-medium">
                  {detailedFeatures[modalService][modalTier].budget}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#FFBA38]/90 mb-4">
                Included Features
              </h3>
              {detailedFeatures[modalService]?.[modalTier]?.features?.map((feature, index) => (
                <div key={index} className="text-[#F8F6F0]/80 text-sm pl-6">
                  {feature}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="mt-8 w-full py-3 bg-[#2A2A2A] text-[#F8F6F0] font-medium rounded-lg hover:bg-[#1A1A1A] hover:text-[#FFBA38] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Luxury Professional Styles */}
      <style jsx>{`
        /* Slider styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #FFBA38;
          border: 3px solid #F8F6F0;
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #FFBA38;
          border: 3px solid #F8F6F0;
          border-radius: 50%;
          cursor: pointer;
        }
        
        /* Professional scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1A1A1A;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #FFBA38;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #D4941E;
        }
      `}</style>
    </div>
  );
};

export default BundleBuilder;