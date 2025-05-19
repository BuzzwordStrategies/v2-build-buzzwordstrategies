// src/components/BundleBuilder.js
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import UserInfoForm from './UserInfoForm';
import ContractAgreementForm from './ContractAgreementForm';
import axios from 'axios';

// Products array outside component to avoid re-creation on each render
const products = [
  "Meta Ads", "Google Ads", "TikTok Ads", "SEO",
  "GBP Ranker", "Backlinks", "Content", "Social Posts"
];

// Service descriptions for info popups
const serviceDescriptions = {
  "Meta Ads": "Reach your ideal customers through targeted Facebook and Instagram advertising. Our Meta Ads service connects you with potential customers based on demographics, interests, and behaviors that align with your business goals.",
  "Google Ads": "Get your business in front of customers actively searching for your products or services. Google Ads puts you at the top of search results when your potential customers are looking for what you offer.",
  "TikTok Ads": "Connect with younger audiences through engaging short-form video content. TikTok has one of the highest engagement rates across all social platforms, making it perfect for brand awareness.",
  "SEO": "Improve your organic visibility in search engines to drive more qualified traffic to your website. Our SEO strategies help you rank higher for the keywords your customers are searching for.",
  "GBP Ranker": "Optimize your Google Business Profile to appear in local searches and Google Maps. Local visibility is crucial for brick-and-mortar businesses and service providers with geographic areas.",
  "Backlinks": "Build your website's authority through high-quality links from reputable sources. Backlinks remain one of Google's top ranking factors and signal your site's trustworthiness.",
  "Content": "Establish thought leadership and improve SEO with professionally written articles tailored to your audience. Quality content builds trust, educates customers, and improves conversion rates.",
  "Social Posts": "Maintain an active and engaging social media presence across major platforms. Regular posting keeps your brand top-of-mind and helps nurture relationships with your audience."
};

// Case studies and success metrics for each service
const serviceSuccessStories = {
  "Meta Ads": "A dental clinic in Denver increased new patient appointments by 43% in just 3 months using our Meta Ads service, with a 5.2x return on ad spend. Individual results may vary based on industry, competition, and market conditions.",
  "Google Ads": "A local fitness center generated 127 new membership sign-ups in their first quarter with our Google Ads management, averaging just $38 per acquisition. Results will vary based on your specific business goals and market.",
  "TikTok Ads": "A specialty dental lab reached over 500,000 dentists with engaging before/after content, resulting in 47 new lab accounts within 60 days. Performance depends on content quality and audience receptiveness.",
  "SEO": "A small business owner increased organic traffic by 215% year-over-year after 6 months of our SEO service, resulting in 28 new monthly leads. SEO results typically take 3-6 months and vary by industry and competition.",
  "GBP Ranker": "A multi-location dental practice saw a 67% increase in Google Maps direction requests after optimizing their Google Business Profile. Results depend on local competition and review generation ability.",
  "Backlinks": "An e-commerce store improved domain authority from 18 to 42 in one year with our backlink service, resulting in page 1 rankings for 78 target keywords. Results vary based on current authority and competition.",
  "Content": "A B2B service provider established themselves as an industry thought leader, with their blog content generating 34 qualified leads per month. Content marketing typically requires consistency over time for optimal results.",
  "Social Posts": "A fitness studio increased their social following by 324% in 6 months while generating consistent client referrals through engagement. Social media success depends on content quality and audience engagement."
};

const BundleBuilder = () => {
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

  // Industry-specific tier descriptions
  const bestForIndustry = {
    // Dental Clinic descriptions
    "Dental Clinic": {
      "Meta Ads": {
        Base: "Want to fill empty chairs & attract patients seeking routine care",
        Standard: "Ready to book high-value procedures like implants & ortho", 
        Premium: "Need to improve visibility and expand to new locations"
      },
      "Google Ads": {
        Base: "Want patients searching 'dentist near me' to find you first",
        Standard: "Ready to capture searches for profitable specialties",
        Premium: "Need to improve visibility for dental search terms in your city"
      },
      "TikTok Ads": {
        Base: "Want to attract younger patients with engaging content",
        Standard: "Ready to showcase smile transformations that go viral",
        Premium: "Need to build a recognizable brand across regions"
      },
      "SEO": {
        Base: "Want your website to show up in local dental searches",
        Standard: "Ready to rank #1 for implants, veneers & orthodontics",
        Premium: "Need to improve visibility for every dental keyword in your market"
      },
      "GBP Ranker": {
        Base: "Want more 5-star reviews & better Google Maps visibility",
        Standard: "Ready to be the top choice when patients compare clinics",
        Premium: "Need to improve local search visibility"
      },
      "Backlinks": {
        Base: "Want Google to see your practice as trustworthy",
        Standard: "Ready to outrank established competitors",
        Premium: "Need enhanced authority in your market"
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
    // Dental Lab descriptions
    "Dental Lab": {
      "Meta Ads": {
        Base: "Want local dentists to discover your lab services",
        Standard: "Ready to expand beyond your current service area",
        Premium: "Need to be highly visible nationwide"
      },
      "Google Ads": {
        Base: "Want dentists searching for labs to find you first",
        Standard: "Ready to promote digital dentistry capabilities",
        Premium: "Need to improve visibility for dental lab searches"
      },
      "TikTok Ads": {
        Base: "Want to showcase your craftsmanship to dentists",
        Standard: "Ready to demonstrate cutting-edge technology",
        Premium: "Need to be seen as the innovation leader"
      },
      "SEO": {
        Base: "Want dentists to find your lab when researching options",
        Standard: "Ready to rank for all major lab services",
        Premium: "Need to improve visibility in dental lab search results"
      },
      "GBP Ranker": {
        Base: "Want better visibility when dentists search locally",
        Standard: "Ready to stand out from competing labs",
        Premium: "Need to improve regional lab search results"
      },
      "Backlinks": {
        Base: "Want search engines to trust your lab website",
        Standard: "Ready to build industry-wide recognition",
        Premium: "Need enhanced authority in dental technology"
      },
      "Content": {
        Base: "Want to share technical expertise with dentists",
        Standard: "Ready to publish case studies that attract clients",
        Premium: "Need to be the thought leader in dental technology"
      },
      "Social Posts": {
        Base: "Want to showcase completed cases regularly",
        Standard: "Ready to engage the dental community daily",
        Premium: "Need to be highly visible on social media"
      }
    },
    // Small Business descriptions
    "Small Business": {
      "Meta Ads": {
        Base: "Want to test if social media can bring customers",
        Standard: "Ready to scale what's working & reach more people",
        Premium: "Need to maximize every opportunity for growth"
      },
      "Google Ads": {
        Base: "Want your first consistent source of new leads",
        Standard: "Ready to expand services & capture more searches",
        Premium: "Need to improve visibility online"
      },
      "TikTok Ads": {
        Base: "Want to see if viral content can grow your business",
        Standard: "Ready to build a community around your brand",
        Premium: "Need to scale viral success into real revenue"
      },
      "SEO": {
        Base: "Want customers to find you instead of competitors",
        Standard: "Ready to rank for multiple services & locations",
        Premium: "Need to be highly visible online"
      },
      "GBP Ranker": {
        Base: "Want better reviews & local search visibility",
        Standard: "Ready to be the obvious choice in your area",
        Premium: "Need to improve local search visibility across regions"
      },
      "Backlinks": {
        Base: "Want Google to see you as a legitimate business",
        Standard: "Ready to build authority in your industry",
        Premium: "Need strong online credibility"
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
    // Fitness descriptions
    "Fitness": {
      "Meta Ads": {
        Base: "Want to fill classes & attract new members locally",
        Standard: "Ready to promote specialty programs & trainers",
        Premium: "Need to scale membership across locations"
      },
      "Google Ads": {
        Base: "Want people searching 'gym near me' to find you",
        Standard: "Ready to promote personal training & programs",
        Premium: "Need to improve visibility for fitness-related searches"
      },
      "TikTok Ads": {
        Base: "Want to showcase your gym culture & energy",
        Standard: "Ready to build a fitness community online",
        Premium: "Need viral transformation content at scale"
      },
      "SEO": {
        Base: "Want to rank when people search for local gyms",
        Standard: "Ready to rank for specific programs & classes",
        Premium: "Need to improve visibility for fitness searches in your market"
      },
      "GBP Ranker": {
        Base: "Want better visibility in local gym searches",
        Standard: "Ready to showcase all your classes & amenities",
        Premium: "Need to improve local fitness search results"
      },
      "Backlinks": {
        Base: "Want search engines to trust your fitness brand",
        Standard: "Ready to build authority in the fitness space",
        Premium: "Need strong online fitness authority"
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
    // Generic "Something Else" descriptions
    "Something Else": {
      "Meta Ads": {
        Base: "Get started with targeted social media advertising",
        Standard: "Scale successful campaigns & reach your ideal audience",
        Premium: "Maximize reach & improve market visibility through social"
      },
      "Google Ads": {
        Base: "Start capturing customers actively searching for your offerings",
        Standard: "Expand visibility across search networks & capture more demand",
        Premium: "Improve visibility in search results for relevant traffic"
      },
      "TikTok Ads": {
        Base: "Test viral marketing & reach new audiences",
        Standard: "Build engaged community & consistent content strategy",
        Premium: "Lead your industry with viral content at scale"
      },
      "SEO": {
        Base: "Improve visibility in organic search results",
        Standard: "Rank for competitive keywords & multiple service areas",
        Premium: "Achieve improved visibility in your industry"
      },
      "GBP Ranker": {
        Base: "Enhance local visibility & gather more reviews",
        Standard: "Become the preferred choice in local searches",
        Premium: "Improve local search visibility across all service areas"
      },
      "Backlinks": {
        Base: "Build initial domain authority & credibility",
        Standard: "Establish strong industry presence & trust",
        Premium: "Achieve enhanced authority in your market"
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
      Premium: "Need to improve visibility in search results"
    },
    "TikTok Ads": {
      Base: "Want to explore viral marketing potential",
      Standard: "Ready to build an engaged community",
      Premium: "Need to scale viral content into revenue"
    },
    "SEO": {
      Base: "Want to be found online by potential customers",
      Standard: "Ready to outrank your competition",
      Premium: "Need to improve visibility in relevant searches"
    },
    "GBP Ranker": {
      Base: "Want better local search visibility",
      Standard: "Ready to become the top local choice",
      Premium: "Need to improve local search results"
    },
    "Backlinks": {
      Base: "Want Google to trust your website more",
      Standard: "Ready to build serious online authority",
      Premium: "Need strong search visibility"
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
  
  // Service info modal state
  const [showServiceInfoModal, setShowServiceInfoModal] = useState(false);
  const [serviceInfoContent, setServiceInfoContent] = useState({
    title: '',
    description: '',
    successStory: ''
  });
  
  // Results disclaimer modal state
  const [showPerformanceDisclaimer, setShowPerformanceDisclaimer] = useState(false);
  
  // Privacy policy modal state
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  // Step indicator state
  const [currentStep, setCurrentStep] = useState(1); // 1: Industry, 2: Services, 3: Tiers

  // Form step state variables
  const [formStep, setFormStep] = useState(0); // 0: bundle confirmation, 1: user info, 2: contract agreement
  const [userInfo, setUserInfo] = useState(null);
  const [agreementInfo, setAgreementInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bundleRejected, setBundleRejected] = useState(false);
  
  // Subscription acknowledgment state
  const [subscriptionAcknowledged, setSubscriptionAcknowledged] = useState(false);

  // Bundle ID state
  const [bundleID, setBundleID] = useState('');

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

  // Function to save bundle data to Supabase
  const saveToSupabase = async (step) => {
    try {
      // Get current bundle data
      const currentBundleID = bundleID || `bwb-${uuidv4()}`;
      
      const selectedServices = Object.entries(selectedTiers)
        .filter(([, tier]) => tier)
        .map(([product, tier]) => `${product}: ${tier}`)
        .join(', ');
        
      const bundleData = {
        bundleID: currentBundleID,
        bundleName: bundleName || 'My Bundle',
        selectedTiers: selectedTiers,
        subLength,
        selectedBusiness,
        finalMonthly: parseFloat(final.toFixed(2)),
        formStep: step,
        selectedServices,
        userInfo: step >= 1 ? userInfo : null,
        agreementInfo: step >= 2 ? agreementInfo : null
      };

      // If no bundleID exists yet, set it
      if (!bundleID) {
        setBundleID(currentBundleID);
      }

      // Save to either our Express server (if deployed) or use Netlify function
      try {
        // Try Express endpoint first
        await axios.post('/api/supabase/save-bundle', bundleData);
        console.log('Saved to Express server');
      } catch (expressError) {
        // Fallback to Netlify function
        console.log('Falling back to Netlify function', expressError);
        await axios.post('/.netlify/functions/save-bundle-data', bundleData);
        console.log('Saved to Netlify function');
      }

      return currentBundleID;
    } catch (error) {
      console.error('Error saving bundle data:', error);
      return bundleID || null; // Return existing bundleID if there's an error
    }
  };

  // Handle tier selection - Updated with data saving
  const handleTierSelect = async (service, tier) => {
    setSelectedTiers(prev => ({
      ...prev,
      [service]: prev[service] === tier ? null : tier
    }));
    
    // Save data when tiers are selected (after a short delay to let state update)
    setTimeout(async () => {
      if (bundleID) {
        await saveToSupabase(0);
      }
    }, 500);
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

  // Form submission handlers - Updated with data saving
  const handleBundleConfirm = async () => {
    if (!subscriptionAcknowledged) {
      alert("Please acknowledge the subscription terms by checking the box.");
      return;
    }
    
    setBundleRejected(false); // Reset if previously rejected
    // Save bundle data at step 0 (bundle confirmation)
    await saveToSupabase(0);
    setFormStep(1);
  };

  const handleBundleReject = () => {
    setBundleRejected(true);
    setShowPurchaseModal(false);
    // You could log this rejection to Supabase here
  };

  const handleUserInfoSubmit = async (formData) => {
    setUserInfo(formData);
    // Save bundle data at step 1 (user info)
    await saveToSupabase(1);
    setFormStep(2); // Move to contract agreement
  };

 const handleAgreementSubmit = async (agreementData) => {
  setAgreementInfo(agreementData);
  setIsLoading(true);
  
  try {
    // Save bundle data at step 2 (agreement)
    const finalBundleID = await saveToSupabase(2);
    
    // Format the selected services string
    const selectedServicesStr = Object.entries(selectedTiers)
      .filter(([, tier]) => tier)
      .map(([product, tier]) => `${product}: ${tier}`)
      .join(', ');
    
    // Create a full payload with all needed data including PDF
    const payload = {
      bundleID: finalBundleID,
      bundleName: bundleName || 'My Bundle',
      subLength,
      finalMonthly: final.toFixed(2),
      selectedServices: selectedServicesStr,
      selectedTiers,
      userInfo,
      agreementInfo: agreementData // This now includes the PDF
    };
    
    // Save agreement data with PDF to Supabase
    const response = await axios.post('/.netlify/functions/save-agreement', payload);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to save agreement');
    }
    
    // Directly create query params for Stripe checkout
    const queryParams = new URLSearchParams({
      bundleID: payload.bundleID,
      bundleName: payload.bundleName,
      finalMonthly: payload.finalMonthly,
      subLength: payload.subLength,
      selectedServices: selectedServicesStr
    }).toString();
    
    // Direct redirect to Stripe checkout
    window.location.href = `/.netlify/functions/create-stripe-checkout?${queryParams}`;
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message || 'An unexpected error occurred'}. Please try again.`);
    setIsLoading(false);
  }
};

  // Handle product selection with auto-scroll
  const handleProductSelect = (product) => {
    setCurrentlyOpenService(product);
    setCurrentStep(3); // Move to step 3: Tier selection
    
    // Scroll to tiers section after a short delay
    setTimeout(() => {
      tiersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  // Component for Performance Disclaimer Modal
  const PerformanceDisclaimerModal = () => {
    if (!showPerformanceDisclaimer) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#121212] rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-[#D28C00]/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Results Disclaimer</h2>
            <button
              onClick={() => setShowPerformanceDisclaimer(false)}
              className="w-10 h-10 rounded-full bg-[#2A2A2A] text-white/60 hover:bg-[#1A1A1A] hover:text-[#D28C00] transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4 text-white/85 text-sm">
            <p>
              The case studies and success stories presented on this platform represent <strong>specific client results</strong> and are shared for illustrative purposes only.
            </p>
            
            <p>
              <strong>IMPORTANT:</strong> These results are not guarantees or promises of specific outcomes. Your results may vary substantially based on numerous factors, including but not limited to:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Your business type, industry, and target market</li>
              <li>Your product or service quality and pricing</li>
              <li>Your current market position and competition</li>
              <li>Seasonal and market trends</li>
              <li>Platform algorithm changes (Google, Meta, etc.)</li>
              <li>Your level of engagement with our recommendations</li>
              <li>Your existing website quality and conversion rate</li>
            </ul>
            
            <p>
              While we strive to provide high-quality marketing services and will use commercially reasonable efforts to help you achieve your marketing goals, we cannot guarantee specific results, rankings, or returns on investment.
            </p>
            
            <p>
              Digital marketing is an ongoing process that often requires testing, optimization, and patience before achieving optimal results.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setShowPerformanceDisclaimer(false)}
              className="w-full py-3 bg-[#D28C00] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#B77A00] transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Privacy Policy Modal
  const PrivacyPolicyModal = () => {
    if (!showPrivacyPolicy) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#121212] rounded-xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-[#D28C00]/20">
          <div className="flex justify-between items-center mb-6">
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
          
          <div className="space-y-4 text-sm text-white/85">
            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">1. Introduction</h3>
              <p>
                Buzzword Strategies LLC ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Bundle Builder platform and marketing services.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">2. Information We Collect</h3>
              <p>We collect several types of information from and about users of our services, including:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, company name, website URL, and payment information.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our services, including pages visited, time spent, and actions taken.</li>
                <li><strong>Marketing Preferences:</strong> Your consent choices regarding marketing communications.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">3. How We Use Your Information</h3>
              <ul className="list-disc pl-6">
                <li>To provide and maintain our services</li>
                <li>To process transactions and manage your account</li>
                <li>To fulfill our service obligations and deliver marketing services</li>
                <li>To contact you regarding your account, services, or changes to policies</li>
                <li>To improve our website and services</li>
                <li>To send promotional materials and newsletters (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">4. Disclosure of Your Information</h3>
              <p>We may disclose your personal information to:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Service Providers:</strong> Third parties that help us operate our business and deliver services (e.g., payment processors, cloud storage providers)</li>
                <li><strong>Marketing Platforms:</strong> When necessary to deliver the contracted marketing services (e.g., Google, Meta, TikTok)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="mt-2">We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">5. Data Storage and Security</h3>
              <p>
                We use Supabase and Stripe to store and process your information securely. We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">6. Your Rights</h3>
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
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">7. Third-Party Links and Services</h3>
              <p>
                Our services may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">8. Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-[#D28C00]">9. Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                <br />
                <br />
                Buzzword Strategies LLC<br />
                1603 Capitol Ave Ste 415 #465784<br />
                Cheyenne, WY 82001<br />
                Email: privacy@buzzwordstrategies.com
              </p>
            </section>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="w-full py-3 bg-[#D28C00] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#B77A00] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Subscription Terms Disclosure Component
  const SubscriptionDisclosure = () => {
    return (
      <div className="p-4 bg-[#2A2A2A] border border-[#D28C00]/20 rounded-lg mb-4 text-sm">
        <h4 className="font-medium text-[#D28C00] mb-2">Subscription Terms</h4>
        <div className="text-white space-y-2">
          <p>
            <strong>Initial Commitment:</strong> By approving this bundle, you agree to an initial commitment of {subLength} months at ${final.toFixed(2)}/month.
          </p>
          <p>
            <strong>Automatic Renewal:</strong> After the initial period, your subscription will automatically renew monthly until canceled. You'll receive renewal notifications by email.
          </p>
          <p>
            <strong>Cancellation:</strong> You may cancel at any time after the initial commitment period with no penalty. Early cancellation during the initial period incurs a fee equal to 50% of remaining payments.
          </p>
          <p>
            <strong>Billing:</strong> Your payment method will be charged automatically on the same day each month.
          </p>
        </div>
        <div className="mt-3 flex items-start">
          <input
            type="checkbox"
            id="termsAcknowledgment"
            checked={subscriptionAcknowledged}
            onChange={() => setSubscriptionAcknowledged(!subscriptionAcknowledged)}
            className="mt-1 w-4 h-4 text-[#D28C00] bg-[#2A2A2A] border-[#D28C00]/20 rounded focus:ring-[#D28C00]/50"
          />
          <label htmlFor="termsAcknowledgment" className="ml-2 text-white/85">
            I understand this is a subscription with an initial {subLength}-month commitment that will automatically renew monthly thereafter until canceled.
          </label>
        </div>
      </div>
    );
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
        
        // Load bundleID if available
        if (parsedData.bundleID) {
          setBundleID(parsedData.bundleID);
        }
        
        const firstService = Object.keys(parsedData.selectedTiers).find(service => products.includes(service)) || products[0];
        setCurrentlyOpenService(firstService);
        
        // Set current step based on saved data
        if (parsedData.selectedBusiness) {
          setCurrentStep(2);
          if (Object.keys(parsedData.selectedTiers || {}).length > 0) {
            setCurrentStep(3);
          }
        }
      } catch (e) {
        console.error("Error loading saved bundle:", e);
      }
    }
  }, []);

  // Save bundle data
  useEffect(() => {
    const bundleData = {
      bundleID,
      selectedTiers,
      subLength,
      bundleName,
      selectedBusiness,
      finalMonthly: parseFloat(final.toFixed(2))
    };
    localStorage.setItem("buzzwordBundle", JSON.stringify(bundleData));
  }, [bundleID, selectedTiers, subLength, bundleName, selectedBusiness, final]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Performance Disclaimer Modal */}
      <PerformanceDisclaimerModal />
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal />
      
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] py-6 px-4 border-b border-[#D28C00]/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <a href="https://www.buzzwordstrategies.com" className="cursor-pointer">
              <img 
                src="https://images.squarespace-cdn.com/content/v1/673fc8d414047c5c20a42e65/ab4663d3-4840-47f0-88cf-a5b1144ed31a/Remove+background+project+%281%29.png?format=1000w"
                alt="Buzzword Strategies" 
                className="h-14 w-auto hover:opacity-90 transition-opacity"
              />
            </a>
            
            {/* Step indicator */}
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#D28C00] text-[#1A1A1A]' : 'bg-[#2A2A2A] text-white/50'} font-bold`}>1</div>
                  <div className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-[#D28C00]' : 'text-white/50'}`}>Select Industry</div>
                </div>
                <div className={`flex-1 mx-2 h-1 ${currentStep >= 2 ? 'bg-[#D28C00]' : 'bg-[#2A2A2A]'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#D28C00] text-[#1A1A1A]' : 'bg-[#2A2A2A] text-white/50'} font-bold`}>2</div>
                  <div className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-[#D28C00]' : 'text-white/50'}`}>Choose Services</div>
                </div>
                <div className={`flex-1 mx-2 h-1 ${currentStep >= 3 ? 'bg-[#D28C00]' : 'bg-[#2A2A2A]'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#D28C00] text-[#1A1A1A]' : 'bg-[#2A2A2A] text-white/50'} font-bold`}>3</div>
                  <div className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-[#D28C00]' : 'text-white/50'}`}>Select Tiers</div>
                </div>
              </div>
            </div>
            
        {/* Business Selector */}
<div className="flex flex-col items-center gap-3 w-full">
  <span className="text-sm text-[#D28C00]/70 uppercase tracking-wider">Step 1: Select Your Industry</span>
  <div className="flex flex-wrap gap-3 justify-center px-2">
    {businessTypes.map(type => (
      <button
        key={type}
        onClick={() => {
          // Inline implementation instead of using handleIndustrySelect
          setSelectedBusiness(type);
          setCurrentStep(2); // Move to step 2 after selection
          
          // Save data after update if bundleID exists
          if (bundleID) {
            setTimeout(() => saveToSupabase(0), 500);
          }
          
          // Scroll to products section after a short delay
          setTimeout(() => {
            productsSectionRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }, 300);
        }}
        className={`px-6 py-3 text-sm rounded-lg transition-all duration-300 ${
          selectedBusiness === type
            ? 'bg-[#D28C00] text-[#1A1A1A] font-medium shadow-lg shadow-[#D28C00]/20'
            : 'bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/80 border border-gray-700'
        }`}
      >
        {type}
      </button>
    ))}
  </div>
  {selectedBusiness && (
    <div className="flex items-center mt-2 animate-pulse">
      <svg className="w-5 h-5 text-[#D28C00] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      <span className="text-sm text-white">Scroll down to select your services</span>
    </div>
  )}
</div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#D28C00]/10">
        <div className="max-w-6xl mx-auto">
          {/* Total Discount Progress Bar */}
          <div className="bg-[#121212]/50 py-4 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Total Savings</span>
                <span className="text-sm font-semibold text-[#D28C00]">
                  {totalDiscountPercentage.toFixed(1)}% Discount
                </span>
              </div>
              <div className="relative w-full h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-[#D28C00] to-[#EDC56A] rounded-full transition-all duration-500"
                  style={{ width: `${(totalDiscountPercentage / maxDiscount) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
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
                  <span className="text-sm font-medium text-white/70">Subscription Length</span>
                  <span className="text-sm font-semibold text-[#D28C00]">
                    {subLength} Months · {subscriptionDiscount}% Off
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="24"
                  step="3"
                  value={subLength}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setSubLength(newValue);
                    // Save data after update
                    if (bundleID) {
                      setTimeout(() => saveToSupabase(0), 500);
                    }
                  }}
                  className="w-full h-2 bg-[#2A2A2A] rounded-full appearance-none cursor-pointer accent-[#D28C00]"
                  style={{
                    background: `linear-gradient(to right, #D28C00 0%, #D28C00 ${(subLength - 3) / 21 * 100}%, #2A2A2A ${(subLength - 3) / 21 * 100}%, #2A2A2A 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-white/50 mt-2">
                  <span>3</span>
                  <span>12</span>
                  <span>24</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">${final.toFixed(2)}</div>
                <div className="text-sm text-[#D28C00]/70 mb-3">Per Month</div>
                {selected.length > 0 && (
                  <button
                    onClick={async () => {
                      // Generate bundleID if it doesn't exist
                      if (!bundleID) {
                        const newBundleID = `bwb-${uuidv4()}`;
                        setBundleID(newBundleID);
                        // We save this in localStorage via the useEffect
                      }
                      setShowPurchaseModal(true);
                      pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-[#D28C00] hover:bg-[#B77A00] text-[#1A1A1A] font-semibold rounded-lg transition-all duration-300 flex items-center"
                  >
                    <span>Continue to Purchase</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
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
          <div className="mb-10" ref={pricingSectionRef}>
            <h3 className="text-sm font-medium text-[#D28C00]/70 uppercase tracking-wider mb-4">Your Selected Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selected.map(([product, tier]) => (
                <div key={product} className="flex items-center justify-between px-4 py-3 bg-[#2A2A2A] text-white rounded-lg border border-[#D28C00]/20">
                  <div className="flex items-center">
                    <span className="font-medium">{product} – {tier}</span>
                    <div 
                      className="ml-2 w-5 h-5 rounded-full bg-[#121212] text-[#D28C00] flex items-center justify-center cursor-pointer hover:bg-[#D28C00] hover:text-[#121212] transition-colors"
                      onClick={() => openServiceInfoModal(product)}
                    >
                      <span className="text-xs font-bold">i</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTierSelect(product, null)}
                    className="text-white/60 hover:text-red-500 transition-colors ml-4"
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
        <div className="mb-12" ref={productsSectionRef}>
          <h3 className="text-sm font-medium text-[#D28C00]/70 uppercase tracking-wider mb-4">Step 2: Select Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(service => (
              <div 
                key={service} 
                className={`relative p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                  service === currentlyOpenService 
                    ? 'bg-[#D28C00] text-[#1A1A1A] shadow-lg shadow-[#D28C00]/20' 
                    : selectedTiers[service] 
                      ? 'bg-[#2A2A2A] text-white border border-[#D28C00]/30'
                      : 'bg-[#2A2A2A] text-white/70 hover:bg-[#2A2A2A]/80 border border-gray-700 hover:border-[#D28C00]/30'
                }`}
                onClick={() => handleProductSelect(service)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{service}</span>
                  <div 
                    className={`w-5 h-5 rounded-full ${
                      service === currentlyOpenService 
                        ? 'bg-[#1A1A1A] text-[#D28C00]' 
                        : 'bg-[#121212] text-white/70'
                    } flex items-center justify-center cursor-pointer hover:bg-[#D28C00] hover:text-[#121212] transition-colors`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openServiceInfoModal(service);
                    }}
                  >
                    <span className="text-xs font-bold">i</span>
                  </div>
                </div>
                <p className="text-xs opacity-80 mb-2">{serviceDescriptions[service].split('.')[0]}.</p>
                {selectedTiers[service] && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#D28C00] rounded-full flex items-center justify-center text-[#1A1A1A] text-xs font-bold">
                    ✓
                  </span>
                )}
                <div className="mt-2 text-xs">
                  <span className={`${
                    service === currentlyOpenService 
                      ? 'text-[#1A1A1A]/70' 
                      : 'text-[#D28C00]'
                  }`}>
                    From ${Math.min(...Object.values(pricing[service]))} /month
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-4 justify-center">
            <button 
              onClick={() => setShowPerformanceDisclaimer(true)}
              className="text-xs text-[#D28C00] underline mt-1"
            >
              View Results Disclaimer
            </button>
          </div>
          {selectedBusiness && currentlyOpenService && (
            <div className="flex items-center mt-4 justify-center animate-pulse">
              <svg className="w-5 h-5 text-[#D28C00] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-sm text-white">Scroll down to select your tier</span>
            </div>
          )}
        </div>

        {/* Tier Selection */}
        {currentlyOpenService && (
          <div ref={tiersSectionRef}>
            <h3 className="text-sm font-medium text-[#D28C00]/70 uppercase tracking-wider mb-4">
              Step 3: Choose {currentlyOpenService} Tier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Base", "Standard", "Premium"].map(tier => (
                <div
                  key={tier}
                  onClick={() => handleTierSelect(currentlyOpenService, tier)}
                  className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTiers[currentlyOpenService] === tier 
                      ? 'bg-[#2A2A2A] border-2 border-[#D28C00] shadow-lg shadow-[#D28C00]/10' 
                      : 'bg-[#2A2A2A] border border-gray-700 hover:border-[#D28C00]/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-white mb-1">{tier}</h4>
                      <div className="text-3xl font-bold text-[#D28C00]">
                        ${pricing[currentlyOpenService][tier]}
                        <span className="text-sm text-white/60 font-normal">/month</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTierDetailsModal(currentlyOpenService, tier);
                      }}
                      className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white/60 hover:bg-[#121212] hover:text-[#D28C00] transition-all flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {getBestForText(currentlyOpenService, tier)}
                  </p>
                  
                  {/* Feature highlights preview */}
                  <div className="mt-4 pt-4 border-t border-[#D28C00]/10">
                    <h5 className="text-xs font-medium text-[#D28C00]/70 mb-2">Feature Highlights:</h5>
                    <ul className="space-y-1">
                      {detailedFeatures[currentlyOpenService]?.[tier]?.features?.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="text-xs text-white/70">{feature}</li>
                      ))}
                      {detailedFeatures[currentlyOpenService]?.[tier]?.features?.length > 2 && (
                        <li className="text-xs text-[#D28C00]">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openTierDetailsModal(currentlyOpenService, tier);
                            }}
                            className="underline hover:no-underline"
                          >
                            See all features
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedTiers[currentlyOpenService] === tier && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 rounded-full bg-[#D28C00] flex items-center justify-center text-[#1A1A1A] text-xs font-bold">
                        ✓
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Action button */}
            {selectedTiers[currentlyOpenService] && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setCurrentStep(2), 500);
                  }}
                  className="px-6 py-3 bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Select Another Service
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] rounded-xl p-8 w-full max-w-md md:max-w-2xl border border-[#D28C00]/20 max-h-[90vh] overflow-y-auto">
            {formStep === 0 ? (
              // Step 1: Bundle Confirmation
              <>
                <h2 className="text-2xl font-bold text-white mb-6">Finalize Your Bundle</h2>
                <input
                  type="text"
                  placeholder="Bundle Name (Optional)"
                  value={bundleName}
                  onChange={(e) => {
                    setBundleName(e.target.value);
                    // Save after a delay
                    if (bundleID) {
                      setTimeout(() => saveToSupabase(0), 1000);
                    }
                  }}
                  className="w-full p-4 bg-[#2A2A2A] border border-[#D28C00]/20 rounded-lg mb-6 text-white placeholder-white/40 focus:border-[#D28C00]/50 focus:outline-none transition-colors"
                />
                
                <div className="p-4 bg-[#2A2A2A] border border-[#D28C00]/20 rounded-lg mb-6">
                  <h3 className="font-medium text-[#D28C00] mb-3">Selected Services</h3>
                  <ul className="space-y-2">
                    {selected.map(([product, tier]) => (
                      <li key={product} className="flex justify-between items-center">
                        <span className="text-white">{product}</span>
                        <span className="text-white/70">{tier}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t border-[#D28C00]/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Subscription Length</span>
                      <span className="text-white">{subLength} months</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-[#D28C00] mb-2">${final.toFixed(2)}/month</div>
                  <div className="text-sm text-white/70">Total monthly savings: ${totalSaved.toFixed(2)}</div>
                </div>
                
                {/* Subscription Terms Disclosure */}
                <SubscriptionDisclosure />
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleBundleReject}
                    className="py-3 bg-[#2A2A2A] text-white/70 rounded-lg hover:bg-[#2A2A2A]/80 font-medium transition-colors"
                  >
                    Reject Bundle
                  </button>
                  <button
                    onClick={handleBundleConfirm}
                    className="py-3 bg-[#D28C00] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#B77A00] transition-colors"
                  >
                    Approve Bundle
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-xs text-[#D28C00] underline"
                  >
                    View Privacy Policy
                  </button>
                </div>
              </>
            ) : formStep === 1 ? (
              // Step 2: User Information Form
              <UserInfoForm 
                onSubmit={handleUserInfoSubmit} 
                onCancel={() => setFormStep(0)}
                setShowPrivacyPolicy={setShowPrivacyPolicy}
              />
            ) : (
              // Step 3: Contract Agreement
              <>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-[#D28C00] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg">Processing your agreement...</p>
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
                    bundleID={bundleID}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Feature Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] rounded-xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-[#D28C00]/20">
            <div className="flex justify-between items-center mb-6 border-b border-[#D28C00]/10 pb-4">
              <h2 className="text-2xl font-bold text-white">
                {modalService} – {modalTier} Tier
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-[#2A2A2A] text-white/60 hover:bg-[#1A1A1A] hover:text-[#D28C00] transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Disclaimer for Ad Services */}
            {detailedFeatures[modalService]?.[modalTier]?.disclaimer && (
              <div className="mb-6 p-4 bg-[#D28C00]/10 border border-[#D28C00]/20 rounded-lg">
                <p className="text-sm text-white/80 mb-3">
                  {detailedFeatures[modalService][modalTier].disclaimer}
                </p>
                <p className="text-sm text-[#D28C00] font-medium">
                  {detailedFeatures[modalService][modalTier].budget}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#D28C00]/90 mb-4">
                Included Features
              </h3>
              {detailedFeatures[modalService]?.[modalTier]?.features?.map((feature, index) => (
                <div key={index} className="text-white/80 text-sm pl-6">
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleTierSelect(modalService, modalTier);
                }}
                className="flex-1 py-3 bg-[#D28C00] text-[#1A1A1A] font-medium rounded-lg hover:bg-[#B77A00] transition-colors"
              >
                Select This Tier
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-[#2A2A2A] text-white font-medium rounded-lg hover:bg-[#1A1A1A] hover:text-[#D28C00] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Info Modal */}
      {showServiceInfoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-[#D28C00]/20">
            <div className="flex justify-between items-center mb-6 border-b border-[#D28C00]/10 pb-4">
              <h2 className="text-2xl font-bold text-white">
                {serviceInfoContent.title}
              </h2>
              <button
                onClick={() => setShowServiceInfoModal(false)}
                className="w-10 h-10 rounded-full bg-[#2A2A2A] text-white/60 hover:bg-[#1A1A1A] hover:text-[#D28C00] transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#D28C00]/90 mb-3">
                What is {serviceInfoContent.title}?
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {serviceInfoContent.description}
              </p>
              
              <div className="mt-6 p-4 bg-[#D28C00]/10 border border-[#D28C00]/20 rounded-lg">
                <h3 className="text-sm font-semibold text-[#D28C00] mb-2">
                  Success Story
                </h3>
                <p className="text-white/80 text-sm italic">
                  "{serviceInfoContent.successStory}"
                </p>
                <div className="mt-2">
                  <button 
                    onClick={() => {
                      setShowServiceInfoModal(false);
                      setShowPerformanceDisclaimer(true);
                    }}
                    className="text-xs text-[#D28C00] underline"
                  >
                    View Results Disclaimer
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowServiceInfoModal(false);
                  handleProductSelect(serviceInfoContent.title);
                }}
                className="flex-1 py-3 bg-[#D28C00] text-[#1A1A1A] font-medium rounded-lg hover:bg-[#B77A00] transition-colors"
              >
                Select This Service
              </button>
              <button
                onClick={() => setShowServiceInfoModal(false)}
                className="flex-1 py-3 bg-[#2A2A2A] text-white font-medium rounded-lg hover:bg-[#1A1A1A] hover:text-[#D28C00] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bundle Rejection Notification */}
      {bundleRejected && (
        <div className="fixed bottom-4 right-4 bg-[#2A2A2A] border border-red-500 p-4 rounded-lg shadow-lg max-w-xs animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Bundle Rejected</h4>
              <p className="text-white/70 text-xs mt-1">Your bundle has been rejected. You can continue building your bundle.</p>
            </div>
            <button 
              onClick={() => setBundleRejected(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* "Back to Top" button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 left-4 bg-[#D28C00] text-[#1A1A1A] rounded-full p-3 shadow-lg hover:bg-[#B77A00] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Luxury Professional Styles */}
      <style jsx>{`
        /* Slider styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #D28C00;
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #D28C00;
          border: 3px solid #FFFFFF;
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
          background: #D28C00;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #B77A00;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default BundleBuilder;
