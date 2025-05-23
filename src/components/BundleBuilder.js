// Professional Bundle Builder with Complete Workflow Tracking
import React, { useState, useEffect, useRef, useCallback } from 'react';
import UserInfoForm from './UserInfoForm';
import ContractAgreementForm from './ContractAgreementForm';

// Static data
const products = [
  "Meta Ads", "Google Ads", "TikTok Ads", "SEO",
  "GBP Ranker", "Backlinks", "Content", "Social Posts"
];

// Service descriptions
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

// Professional SVG icons as components
const ServiceIcon = ({ service, className = "w-6 h-6" }) => {
  const icons = {
    "Meta Ads": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h3zm7 0v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-8m4 0V7a4 4 0 00-8 0v4m16 1v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-8m4 0h-4" />
      </svg>
    ),
    "Google Ads": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    "TikTok Ads": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    "SEO": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    "GBP Ranker": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    "Backlinks": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    "Content": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    "Social Posts": (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  };
  
  return icons[service] || icons["Meta Ads"];
};

// Success stories with disclaimers
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

// Success story disclaimer
const successStoryDisclaimer = "* Individual results may vary. Performance depends on factors including industry, competition, market conditions, budget, and implementation. Past results do not guarantee future performance.";

// Pricing data
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
      Premium: "Improve local search visibility across service areas"
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
        "• 10 Posts Monthly",
        "• 2 Platforms",
        "• Custom Branded Creative",
        "• Strategic scheduling",
        "• Monthly analytics report"
      ]
    },
    Standard: {
      features: [
        "• Includes all Base tier services",
        "• 15 posts monthly",
        "• 1 Short form reel",
        "• 3 platform distribution",
        "• Custom Branded Creative",
        "• Engagement monitoring"
      ]
    },
    Premium: {
      features: [
        "• Includes all Standard tier services",
        "• 30 posts monthly",
        "• 5 platform coverage",
        "• Custom branded Creative",
        "• Engagement monitoring"
      ]
    }
  }
};

// Helper functions
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

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Improved animated gradient background with honey-like flow
const AnimatedBackground = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    let blobs = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize blobs for honey-like effect
      blobs = [];
      for (let i = 0; i < 5; i++) {
        blobs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 200 + Math.random() * 100,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2
        });
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const animate = () => {
      time += 0.005;
      
      // Clear canvas
      ctx.fillStyle = isDarkMode ? '#000000' : '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw blobs
      blobs.forEach((blob, index) => {
        // Update position with slow, fluid movement
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.phase += 0.01;
        
        // Soft boundaries
        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;
        
        // Create gradient for each blob
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius * (1 + Math.sin(blob.phase) * 0.1)
        );
        
        if (isDarkMode) {
          // Dark mode: golden honey gradient
          gradient.addColorStop(0, 'rgba(210, 140, 0, 0.03)');
          gradient.addColorStop(0.5, 'rgba(210, 140, 0, 0.02)');
          gradient.addColorStop(1, 'rgba(210, 140, 0, 0)');
        } else {
          // Light mode: purple to pink gradient
          const baseOpacity = 0.02 + Math.sin(time + index) * 0.01;
          gradient.addColorStop(0, `rgba(147, 51, 234, ${baseOpacity})`);
          gradient.addColorStop(0.5, `rgba(219, 39, 119, ${baseOpacity * 0.7})`);
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode]);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Enhanced Sydney Chatbot with attention-grabbing features
const ChatbotWidget = ({ isDarkMode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  useEffect(() => {
    // Load Zapier script if not already loaded
    const existingScript = document.querySelector('script[src*="zapier-interfaces"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      script.type = 'module';
      script.async = true;
      document.body.appendChild(script);
    }

    // Tooltip animation timer
    const tooltipTimer = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 4000); // Show for 4 seconds
    }, 15000); // Every 15 seconds

    // Add custom styles for the enhanced chatbot button
    const customStyles = document.createElement('style');
    customStyles.textContent = `
      /* Enhanced chatbot button styling */
      zapier-interfaces-chatbot-embed {
        --chatbot-button-background: ${isDarkMode ? 'linear-gradient(135deg, #D28C00 0%, #FFBA38 100%)' : 'linear-gradient(135deg, #9333EA 0%, #DB2777 100%)'} !important;
        --chatbot-button-color: ${isDarkMode ? '#1A1A1A' : '#FFFFFF'} !important;
        --chatbot-button-border-radius: 50px !important;
        --chatbot-button-box-shadow: 0 12px 48px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.6), 0 0 30px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.4) !important;
        --chatbot-button-hover-transform: scale(1.1) !important;
        --chatbot-button-transition: all 0.3s ease !important;
        position: relative !important;
        z-index: 1000 !important;
      }
      
      /* Floating particles animation */
      @keyframes float-particles {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-20px) rotate(360deg);
          opacity: 0;
        }
      }
      
      /* Attention-grabbing glow pulse */
      @keyframes chatbot-mega-glow {
        0%, 100% {
          box-shadow: 0 12px 48px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.6), 0 0 30px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.4);
          transform: scale(1);
        }
        25% {
          box-shadow: 0 16px 60px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.8), 0 0 40px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.6);
          transform: scale(1.02);
        }
        50% {
          box-shadow: 0 20px 72px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 1.0), 0 0 50px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.8);
          transform: scale(1.05);
        }
        75% {
          box-shadow: 0 16px 60px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.8), 0 0 40px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.6);
          transform: scale(1.02);
        }
      }
      
      /* Attention shake animation */
      @keyframes chatbot-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      /* Bounce animation */
      @keyframes chatbot-bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-8px); }
        60% { transform: translateY(-4px); }
      }
      
      /* Notification badge pulse */
      @keyframes badge-pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.8;
        }
      }
      
      /* Apply enhanced animations to the chatbot button */
      zapier-interfaces-chatbot-embed::part(button) {
        animation: chatbot-mega-glow 3s ease-in-out infinite, chatbot-bounce 4s ease-in-out infinite 1s, chatbot-shake 6s ease-in-out infinite 3s;
        background: ${isDarkMode ? 'linear-gradient(135deg, #D28C00 0%, #FFBA38 100%)' : 'linear-gradient(135deg, #9333EA 0%, #DB2777 100%)'} !important;
        border: none !important;
        font-weight: 700 !important;
        font-size: 17px !important;
        padding: 20px 28px !important;
        min-width: 140px !important;
        height: 72px !important;
        position: relative !important;
        overflow: visible !important;
      }
      
      /* Enhanced hover effects */
      zapier-interfaces-chatbot-embed::part(button):hover {
        transform: scale(1.15) !important;
        box-shadow: 0 24px 80px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.7), 0 0 60px rgba(${isDarkMode ? '210, 140, 0' : '147, 51, 234'}, 0.5) !important;
        animation-play-state: paused !important;
      }
      
      /* Button icon styling */
      zapier-interfaces-chatbot-embed::part(button-icon) {
        width: 28px !important;
        height: 28px !important;
        margin-right: 10px !important;
      }
      
      /* Container for floating elements */
      .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
      
      /* Notification badge */
      .notification-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        background: ${isDarkMode ? '#FF4444' : '#FF3366'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        animation: badge-pulse 2s ease-in-out infinite;
        box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
        z-index: 1001;
      }
      
      /* Floating tooltip */
      .chatbot-tooltip {
        position: absolute;
        bottom: 80px;
        right: 0;
        background: ${isDarkMode ? '#2A2A2A' : '#FFFFFF'};
        color: ${isDarkMode ? '#F8F6F0' : '#1A1A1A'};
        padding: 12px 16px;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        border: 1px solid ${isDarkMode ? '#D28C00' : '#9333EA'};
        z-index: 1001;
        max-width: 200px;
        white-space: normal;
        text-align: center;
      }
      
      .chatbot-tooltip.show {
        transform: translateY(0);
        opacity: 1;
      }
      
      .chatbot-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        right: 20px;
        border: 8px solid transparent;
        border-top-color: ${isDarkMode ? '#2A2A2A' : '#FFFFFF'};
      }
      
      /* Floating particles */
      .particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: ${isDarkMode ? '#FFBA38' : '#9333EA'};
        border-radius: 50%;
        animation: float-particles 3s ease-out infinite;
        pointer-events: none;
      }
      
      .particle:nth-child(2) { animation-delay: 0.5s; left: 10px; }
      .particle:nth-child(3) { animation-delay: 1s; left: 20px; }
      .particle:nth-child(4) { animation-delay: 1.5s; left: 30px; }
      .particle:nth-child(5) { animation-delay: 2s; left: 40px; }
      
      /* Pulsing ring effect */
      .pulse-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        border: 2px solid ${isDarkMode ? '#D28C00' : '#9333EA'};
        border-radius: 50%;
        animation: pulse-ring 2s ease-out infinite;
        pointer-events: none;
      }
      
      @keyframes pulse-ring {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(customStyles);
    
    return () => {
      clearInterval(tooltipTimer);
      if (document.head.contains(customStyles)) {
        document.head.removeChild(customStyles);
      }
    };
  }, [isDarkMode]);

  // Hide notification badge when chatbot is clicked
  const handleChatbotClick = () => {
    setShowNotificationBadge(false);
    setShowTooltip(false);
  };

  return (
    <div className="chatbot-container">
      {/* Pulsing ring effect */}
      <div className="pulse-ring"></div>
      
      {/* Floating particles */}
      <div className="particle" style={{ bottom: '40px', right: '10px' }}></div>
      <div className="particle" style={{ bottom: '45px', right: '15px' }}></div>
      <div className="particle" style={{ bottom: '35px', right: '20px' }}></div>
      <div className="particle" style={{ bottom: '42px', right: '25px' }}></div>
      <div className="particle" style={{ bottom: '38px', right: '30px' }}></div>
      
      {/* Notification badge */}
      {showNotificationBadge && (
        <div className="notification-badge">
          !
        </div>
      )}
      
      {/* Floating tooltip */}
      <div className={`chatbot-tooltip ${showTooltip ? 'show' : ''}`}>
        💬 Ask Sydney about marketing strategies!
      </div>
      
      {/* Zapier chatbot embed */}
      <div onClick={handleChatbotClick}>
        <zapier-interfaces-chatbot-embed 
          is-popup='true' 
          chatbot-id='cma6zv294001y12wdgvajk0lj'
        ></zapier-interfaces-chatbot-embed>
      </div>
    </div>
  );
};

// Main Component
const BundleBuilder = () => {
  // Theme state - detect system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark if can't detect
  });
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // GA4 Event Tracking
  const trackEvent = useCallback((eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }, []);
  
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
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form step state variables
  const [formStep, setFormStep] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [agreementInfo, setAgreementInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bundleRejected, setBundleRejected] = useState(false);
  
  // Subscription acknowledgment state
  const [subscriptionAcknowledged, setSubscriptionAcknowledged] = useState(false);
  
  // Bundle ID state - this will be unique for each purchase attempt
  const [bundleID, setBundleID] = useState('');
  
  // Flag to prevent initial saving
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Refs for scrolling
  const productsSectionRef = useRef(null);
  const tiersSectionRef = useRef(null);
  const pricingSectionRef = useRef(null);
  
  // Save timeout ref
  const saveTimeoutRef = useRef(null);
  
  // Theme configuration
  const theme = {
    dark: {
      bg: 'bg-black',
      bgSecondary: 'bg-[#0A0A0A]',
      bgTertiary: 'bg-[#141414]',
      cardBg: 'bg-[#1A1A1A]',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      accent: 'bg-[#D28C00]',
      accentHover: 'hover:bg-[#B77A00]',
      accentText: 'text-[#D28C00]',
      border: 'border-gray-800',
      borderAccent: 'border-[#D28C00]',
      green: 'text-green-500',
      red: 'text-red-500'
    },
    light: {
      bg: 'bg-white',
      bgSecondary: 'bg-gray-50',
      bgTertiary: 'bg-gray-100',
      cardBg: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      accent: 'bg-purple-600',
      accentHover: 'hover:bg-purple-700',
      accentText: 'text-purple-600',
      border: 'border-gray-200',
      borderAccent: 'border-purple-600',
      green: 'text-green-600',
      red: 'text-red-600'
    }
  };
  
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  
  // Calculate final price
  const calculateFinalPrice = useCallback(() => {
    const selected = Object.entries(selectedTiers).filter(([_, tier]) => tier);
    const productCount = selected.length;
    let total = selected.reduce((sum, [service, tier]) => sum + pricing[service][tier], 0);

    const bundleDiscount = productCount <= 1 ? 0 : getBundleDiscount(productCount);
    const subDiscount = getSubscriptionDiscount(subLength);

    const afterBundle = total * (1 - bundleDiscount / 100);
    const final = afterBundle * (1 - subDiscount / 100);
    const totalSaved = total - final;

    return { final, totalSaved, selected, bundleDiscount, productCount };
  }, [selectedTiers, subLength]);

  const { final, totalSaved, selected, bundleDiscount, productCount } = calculateFinalPrice();
  
  const subscriptionDiscount = productCount > 0 ? getSubscriptionDiscount(subLength) : 0;
  const totalDiscountPercentage = bundleDiscount + subscriptionDiscount;
  
  // Get best for text based on selected business type
  const getBestForText = useCallback((service, tier) => {
    if (selectedBusiness && bestForIndustry[selectedBusiness]) {
      return bestForIndustry[selectedBusiness][service][tier];
    }
    return bestForIndustry["Something Else"][service][tier];
  }, [selectedBusiness]);
  
  // Handle product selection with smooth scroll
  const handleProductSelect = useCallback((product) => {
    setCurrentlyOpenService(product);
    setCurrentStep(3);
    
    // Track GA4 event
    trackEvent('product_selected', {
      product: product
    });
    
    setTimeout(() => {
      if (tiersSectionRef.current) {
        const yOffset = -80;
        const y = tiersSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 300);
  }, [trackEvent]);
  
  // Handle tier selection
  const handleTierSelect = useCallback((service, tier) => {
    setSelectedTiers(prev => {
      const newTiers = { ...prev };
      if (tier === null || newTiers[service] === tier) {
        delete newTiers[service];
      } else {
        newTiers[service] = tier;
      }
      return newTiers;
    });
    
    // Track GA4 event
    trackEvent('tier_selected', {
      service: service,
      tier: tier
    });
  }, [trackEvent]);
  
  // Handle chatbot bundle updates
  const handleChatbotBundleUpdate = useCallback((updates) => {
    if (updates.selectedBusiness) {
      setSelectedBusiness(updates.selectedBusiness);
      setCurrentStep(2);
    }
    
    if (updates.selectedTiers) {
      setSelectedTiers(prev => ({
        ...prev,
        ...updates.selectedTiers
      }));
    }
    
    if (updates.subLength) {
      setSubLength(updates.subLength);
    }
    
    if (updates.bundleName) {
      setBundleName(updates.bundleName);
    }
  }, []);
  
  // Open modal for tier details
  const openTierDetailsModal = useCallback((service, tier) => {
    setModalService(service);
    setModalTier(tier);
    setShowModal(true);
  }, []);
  
  // Open service info modal
  const openServiceInfoModal = useCallback((service) => {
    setServiceInfoContent({
      title: service,
      description: serviceDescriptions[service],
      successStory: serviceSuccessStories[service]
    });
    setShowServiceInfoModal(true);
  }, []);
  
  // Create order function - creates a new database row when bundle is confirmed
  const createOrder = useCallback(async () => {
    try {
      // Create a fresh bundle ID for this specific purchase attempt
      const newBundleID = `bwb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Creating new order with bundle ID:', newBundleID);
      
      // Prepare the bundle data
      const bundleData = {
        bundle_id: newBundleID,
        bundle_name: bundleName || 'My Bundle',
        selected_tiers: selectedTiers,
        selected_services: Object.entries(selectedTiers)
          .filter(([, tier]) => tier)
          .map(([product, tier]) => `${product}: ${tier}`)
          .join(', '),
        sub_length: subLength,
        final_monthly: final.toFixed(2),
        selected_business: selectedBusiness,
        status: 'bundle_started', // Initial status when they start checkout
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Create the initial order record
      const response = await fetch('/.netlify/functions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bundleData)
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create order');
      }
      
      console.log('Order created successfully:', result);
      
      // Update the bundle ID in state to use this new one
      setBundleID(newBundleID);
      
      return newBundleID;
      
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [bundleName, selectedTiers, subLength, final, selectedBusiness]);
  
  // Handle user info submission - updates existing order row
  const handleUserInfoSubmit = useCallback(async (formData) => {
    try {
      setUserInfo(formData);
      
      // Track GA4 event
      trackEvent('checkout_progress', {
        checkout_step: 2,
        checkout_option: 'user_info_submitted'
      });
      
      // Update the existing order with customer information
      const response = await fetch('/.netlify/functions/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundle_id: bundleID,
          status: 'customer_info_added',
          customer_info: formData
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('Failed to update order with customer info:', result);
        // Continue anyway - we don't want to block the user
      } else {
        console.log('Order updated with customer info');
      }
      
      setFormStep(2);
    } catch (error) {
      console.error('Error submitting user info:', error);
      // Continue anyway
      setFormStep(2);
    }
  }, [bundleID, trackEvent]);
  
  // Handle agreement submission - updates existing order row and redirects to payment
  const handleAgreementSubmit = useCallback(async (agreementData) => {
    setAgreementInfo(agreementData);
    setIsLoading(true);
    
    try {
      // Update the order with agreement information
      const updateResponse = await fetch('/.netlify/functions/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundle_id: bundleID,
          status: 'agreement_signed',
          agreement_info: agreementData
        })
      });
      
      const updateResult = await updateResponse.json();
      
      if (!updateResponse.ok || !updateResult.success) {
        console.error('Failed to update order with agreement:', updateResult);
        // Continue to payment anyway
      }
      
      // Track GA4 purchase event
      trackEvent('purchase', {
        transaction_id: bundleID,
        value: final,
        currency: 'USD',
        items: Object.entries(selectedTiers)
          .filter(([, tier]) => tier)
          .map(([product, tier]) => ({
            item_name: product,
            item_variant: tier,
            price: pricing[product][tier],
            quantity: 1
          }))
      });
      
      // Update status to payment_initiated before redirecting
      await fetch('/.netlify/functions/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundle_id: bundleID,
          status: 'payment_initiated'
        })
      });
      
      // Create payment URL
      const selectedServicesStr = Object.entries(selectedTiers)
        .filter(([, tier]) => tier)
        .map(([product, tier]) => `${product}: ${tier}`)
        .join(', ');
      
      const queryParams = new URLSearchParams({
        bundleID: bundleID,  // Now using the unique bundle ID for this order
        bundleName: bundleName || 'My Bundle',
        finalMonthly: final.toFixed(2),
        subLength: subLength,
        selectedServices: selectedServicesStr
      }).toString();
      
      // Redirect to payment
      window.location.href = `/.netlify/functions/create-stripe-checkout?${queryParams}`;
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your request. Please try again.');
      setIsLoading(false);
    }
  }, [bundleID, bundleName, final, selectedTiers, subLength, trackEvent]);
  
  // Handle page abandonment - updates order status when user leaves
  const handlePageAbandon = useCallback(async (reason) => {
    if (bundleID && formStep > 0) {
      try {
        await fetch('/.netlify/functions/update-order-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bundle_id: bundleID,
            status: 'abandoned',
            abandoned_at_step: formStep,
            rejection_reason: reason
          })
        });
      } catch (error) {
        console.error('Error updating abandonment status:', error);
      }
    }
  }, [bundleID, formStep]);
  
  // Reset and start fresh - marks old order as abandoned and clears state
  const resetAndStartFresh = useCallback(async () => {
    // If there's an existing bundle in progress, mark it as abandoned
    if (bundleID && formStep > 0) {
      try {
        await fetch('/.netlify/functions/update-order-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bundle_id: bundleID,
            status: 'abandoned',
            abandoned_at_step: formStep,
            rejection_reason: 'User started new bundle configuration'
          })
        });
        console.log('Previous bundle marked as abandoned');
      } catch (error) {
        console.error('Error marking bundle as abandoned:', error);
      }
    }
    
    // Clear all current state
    setBundleID('');
    setFormStep(0);
    setUserInfo(null);
    setAgreementInfo(null);
    setShowPurchaseModal(false);
    setBundleRejected(false);
    
    // Don't clear the bundle configuration - they might want to keep their selections
    // But you could clear these too if you want a complete reset:
    // setSelectedTiers({});
    // setBundleName('');
    // setSubLength(3);
    
    console.log('Ready for fresh bundle creation');
  }, [bundleID, formStep]);
  
  // Form submission handlers
  const handleBundleConfirm = useCallback(async () => {
    if (!subscriptionAcknowledged) {
      alert("Please acknowledge the subscription terms by checking the box.");
      return;
    }
    
    setBundleRejected(false);
    
    // Track GA4 event
    trackEvent('checkout_progress', {
      checkout_step: 1,
      checkout_option: 'bundle_confirmed'
    });
    
    try {
      // Create a new order in the database
      await createOrder();
      
      // Move to the next step
      setFormStep(1);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error starting your order. Please try again.');
    }
  }, [subscriptionAcknowledged, createOrder, trackEvent]);
  
  const handleBundleReject = useCallback(async () => {
    setBundleRejected(true);
    setShowPurchaseModal(false);
    
    // If we have a bundle ID, update its status to rejected
    if (bundleID) {
      try {
        await fetch('/.netlify/functions/update-order-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bundle_id: bundleID,
            status: 'rejected',
            rejection_reason: 'User canceled at bundle confirmation'
          })
        });
      } catch (error) {
        console.error('Error updating order status:', error);
        // Don't show error to user - this is just tracking
      }
    }
  }, [bundleID]);
  
  // Track when they leave the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (bundleID && formStep > 0 && formStep < 3) {
        // They're in the middle of the process
        handlePageAbandon('User closed browser/tab');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [bundleID, formStep, handlePageAbandon]);
  
  // Check if user is coming back to reconfigure
  useEffect(() => {
    const checkForReset = () => {
      // If they have a bundle ID but they're back at the product selection
      // and the modal is closed, they might be starting over
      if (bundleID && !showPurchaseModal && formStep === 0) {
        // Give them a moment to interact before assuming they're starting fresh
        const resetTimer = setTimeout(() => {
          if (!showPurchaseModal) {
            console.log('User appears to be starting fresh');
            resetAndStartFresh();
          }
        }, 3000); // 3 seconds to determine intent
        
        return () => clearTimeout(resetTimer);
      }
    };
    
    checkForReset();
  }, [bundleID, showPurchaseModal, formStep, resetAndStartFresh]);
  
  // Load saved bundle configuration on mount (but not order-specific data)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("buzzwordBundleConfig");
      if (saved) {
        const parsedData = JSON.parse(saved);
        setSelectedTiers(parsedData.selectedTiers || {});
        setSubLength(parsedData.subLength || 3);
        setBundleName(parsedData.bundleName || "");
        setSelectedBusiness(parsedData.selectedBusiness || "");
        
        // Don't restore bundleID - each session should get a fresh one
        // Don't restore formStep - they should start from beginning
        
        const firstService = Object.keys(parsedData.selectedTiers || {}).find(service => products.includes(service)) || products[0];
        setCurrentlyOpenService(firstService);
        
        if (parsedData.selectedBusiness) {
          setCurrentStep(2);
          if (Object.keys(parsedData.selectedTiers || {}).length > 0) {
            setCurrentStep(3);
          }
        }
      }
      
      setInitialLoadComplete(true);
    } catch (e) {
      console.error("Error loading saved configuration:", e);
      setInitialLoadComplete(true);
    }
  }, []);
  
  // Save bundle configuration (not order-specific data)
  useEffect(() => {
    if (initialLoadComplete) {
      const configData = {
        selectedTiers,
        subLength,
        bundleName,
        selectedBusiness
      };
      
      // Don't save bundleID - each session should get a fresh one
      localStorage.setItem("buzzwordBundleConfig", JSON.stringify(configData));
    }
  }, [selectedTiers, subLength, bundleName, selectedBusiness, initialLoadComplete]);
  
  // Subscription Terms Disclosure Component
  const SubscriptionDisclosure = () => {
    return (
      <div className={`p-4 ${currentTheme.cardBg} ${currentTheme.border} border rounded-lg mb-4`}>
        <h4 className={`font-medium ${currentTheme.accentText} mb-2`}>Subscription Terms</h4>
        <div className={`${currentTheme.textSecondary} space-y-2 text-sm`}>
          <p>
            <strong className={currentTheme.text}>Initial Commitment:</strong> By approving this bundle, you agree to an initial commitment of {subLength} months at ${final.toFixed(2)}/month.
          </p>
          <p>
            <strong className={currentTheme.text}>Automatic Renewal:</strong> After the initial period, your subscription will automatically renew monthly until canceled.
          </p>
        </div>
        <div className="mt-3 flex items-start">
          <input
            type="checkbox"
            id="termsAcknowledgment"
            checked={subscriptionAcknowledged}
            onChange={() => setSubscriptionAcknowledged(!subscriptionAcknowledged)}
            className={`mt-1 w-4 h-4 ${currentTheme.accentText} ${currentTheme.bg} ${currentTheme.border} rounded focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-[#D28C00]' : 'focus:ring-purple-600'}`}
          />
          <label htmlFor="termsAcknowledgment" className={`ml-2 ${currentTheme.textSecondary} text-sm`}>
            I understand this is a subscription with an initial {subLength}-month commitment.
          </label>
        </div>
      </div>
    );
  };
  
  // Start Over Button Component
  const StartOverButton = () => (
    <button
      onClick={() => {
        resetAndStartFresh();
        // Optionally track this action
        trackEvent('bundle_reset', {
          previous_bundle_id: bundleID,
          reset_at_step: formStep
        });
      }}
      className={`text-sm ${currentTheme.textSecondary} hover:${currentTheme.text} underline mt-2`}
    >
      Start over with a new configuration
    </button>
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} relative`}>
      {/* Improved animated background */}
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      {/* Enhanced Chatbot Widget with Sydney */}
      <ChatbotWidget isDarkMode={isDarkMode} />
      
      {/* Header */}
      <div className={`${currentTheme.bgSecondary} border-b ${currentTheme.border} relative z-10`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            <a href="https://www.buzzwordstrategies.com" className="cursor-pointer">
              <img 
                src="https://images.squarespace-cdn.com/content/v1/673fc8d414047c5c20a42e65/ab4663d3-4840-47f0-88cf-a5b1144ed31a/Remove+background+project+%281%29.png?format=1000w"
                alt="Buzzword Strategies" 
                className="h-8 md:h-10 w-auto"
              />
            </a>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${currentTheme.cardBg} ${currentTheme.border} border transition-colors`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step 
                        ? `${currentTheme.accent} ${isDarkMode ? 'text-black' : 'text-white'}` 
                        : `${currentTheme.cardBg} ${currentTheme.textSecondary} ${currentTheme.border} border`
                    }`}>
                      {step}
                    </div>
                    <span className={`ml-2 text-xs md:text-sm ${currentStep >= step ? currentTheme.text : currentTheme.textSecondary} hidden md:block`}>
                      {step === 1 ? 'Industry' : step === 2 ? 'Services' : 'Tiers'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 mx-2 h-0.5 ${currentStep > step ? currentTheme.accent : currentTheme.cardBg}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Business Selector */}
          <div className={`px-4 pb-4 ${currentTheme.bgTertiary} ${currentTheme.border} border-t`}>
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-sm font-medium ${currentTheme.textSecondary} mb-3 text-center`}>Select Your Industry</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {businessTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedBusiness(type);
                      setCurrentStep(2);
                      
                      // Track GA4 event
                      trackEvent('business_type_selected', {
                        business_type: type
                      });
                      
                      setTimeout(() => {
                        if (productsSectionRef.current) {
                          const yOffset = -80;
                          const y = productsSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 300);
                    }}
                    className={`px-4 py-2 text-sm rounded-lg transition-all ${
                      selectedBusiness === type
                        ? `${currentTheme.accent} ${isDarkMode ? 'text-black' : 'text-white'} font-medium`
                        : `${currentTheme.cardBg} ${currentTheme.text} ${currentTheme.border} border ${currentTheme.accentHover}`
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

      {/* Sticky Header with improved bundle discount clarity */}
      <div className={`sticky top-0 z-40 ${currentTheme.bg} ${currentTheme.border} border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Subscription Length */}
            <div className="flex-1 max-w-xs md:max-w-md">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs ${currentTheme.textSecondary}`}>Length</span>
                <span className={`text-xs font-medium ${currentTheme.green}`}>
                  {subscriptionDiscount}% off
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="3"
                value={subLength}
                onChange={(e) => {
                  setSubLength(parseInt(e.target.value));
                }}
                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${currentTheme.bgTertiary}`}
                style={{
                  background: `linear-gradient(to right, ${isDarkMode ? '#D28C00' : '#9333EA'} 0%, ${isDarkMode ? '#D28C00' : '#9333EA'} ${(subLength - 3) / 21 * 100}%, ${isDarkMode ? '#1A1A1A' : '#E5E7EB'} ${(subLength - 3) / 21 * 100}%, ${isDarkMode ? '#1A1A1A' : '#E5E7EB'} 100%)`
                }}
              />
              <div className={`text-xs ${currentTheme.textSecondary} mt-1 text-center`}>{subLength} months</div>
            </div>

            {/* Price Display with improved bundle discount clarity */}
            <div className="text-right ml-4">
              <div className={`text-2xl md:text-3xl font-semibold ${currentTheme.text}`}>
                ${final.toFixed(0)}
                <span className={`text-base ${currentTheme.textSecondary} font-normal`}>/mo</span>
              </div>
              {totalSaved > 0 && (
                <div className="space-y-0.5">
                  <div className={`text-xs ${currentTheme.green}`}>
                    Save ${totalSaved.toFixed(0)}/mo
                  </div>
                  {productCount > 1 && (
                    <div className={`text-xs ${currentTheme.accentText}`}>
                      {bundleDiscount}% bundle discount ({productCount} products)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Selected Services Summary */}
        {selected.length > 0 && (
          <div className="mb-6" ref={pricingSectionRef}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${currentTheme.textSecondary}`}>Selected Services</h3>
              <button
                onClick={() => {
                  setShowPurchaseModal(true);
                  // Track GA4 event
                  trackEvent('begin_checkout', {
                    value: final,
                    currency: 'USD',
                    items: selected.map(([product, tier]) => ({
                      item_name: product,
                      item_variant: tier,
                      price: pricing[product][tier]
                    }))
                  });
                }}
                className={`px-4 py-2 ${currentTheme.accent} ${isDarkMode ? 'text-black' : 'text-white'} text-sm font-medium rounded-lg ${currentTheme.accentHover} transition-colors`}
              >
                Continue to Purchase
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selected.map(([product, tier]) => (
                <div key={product} className={`flex items-center justify-between p-3 ${currentTheme.cardBg} rounded-lg ${currentTheme.border} border`}>
                  <div className="flex items-center">
                    <ServiceIcon service={product} className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{product}</span>
                    <span className={`ml-2 text-sm ${currentTheme.textSecondary}`}>{tier}</span>
                  </div>
                  <button
                    onClick={() => handleTierSelect(product, null)}
                    className={`${currentTheme.textSecondary} hover:${currentTheme.red} transition-colors`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Selection with info buttons */}
        <div className="mb-8" ref={productsSectionRef}>
          <h3 className={`text-sm font-medium ${currentTheme.textSecondary} mb-4`}>Select Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map(service => (
              <div key={service} className="relative">
                <button
                  onClick={() => handleProductSelect(service)}
                  className={`w-full p-4 rounded-lg transition-all ${
                    service === currentlyOpenService 
                      ? `${currentTheme.accent} ${isDarkMode ? 'text-black' : 'text-white'} shadow-lg`
                      : selectedTiers[service]
                        ? `${currentTheme.cardBg} ${currentTheme.borderAccent} border-2`
                        : `${currentTheme.cardBg} ${currentTheme.border} border hover:${currentTheme.borderAccent}`
                  }`}
                >
                  <ServiceIcon 
                    service={service} 
                    className={`w-8 h-8 mx-auto mb-2 ${
                      service === currentlyOpenService 
                        ? isDarkMode ? 'text-black' : 'text-white'
                        : ''
                    }`} 
                  />
                  <h4 className="font-medium text-sm">{service}</h4>
                  <p className={`text-xs mt-1 ${
                    service === currentlyOpenService 
                      ? isDarkMode ? 'text-black/70' : 'text-white/70'
                      : currentTheme.textSecondary
                  }`}>
                    From ${Math.min(...Object.values(pricing[service]))}
                  </p>
                  {selectedTiers[service] && (
                    <span className={`inline-block mt-2 text-xs font-medium ${currentTheme.green}`}>
                      ✓ {selectedTiers[service]}
                    </span>
                  )}
                </button>
                {/* Info button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openServiceInfoModal(service);
                  }}
                  className={`absolute top-2 right-2 p-1 rounded-full ${currentTheme.bg} ${currentTheme.border} border ${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
                  title={`Learn about ${service}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tier Selection */}
        {currentlyOpenService && (
          <div ref={tiersSectionRef}>
            <h3 className={`text-sm font-medium ${currentTheme.textSecondary} mb-4`}>
              Choose {currentlyOpenService} Tier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Base", "Standard", "Premium"].map(tier => (
                <div
                  key={tier}
                  onClick={() => handleTierSelect(currentlyOpenService, tier)}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    selectedTiers[currentlyOpenService] === tier 
                      ? `${currentTheme.cardBg} ${currentTheme.borderAccent} border-2 shadow-lg`
                      : `${currentTheme.cardBg} ${currentTheme.border} border hover:${currentTheme.borderAccent}`
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{tier}</h4>
                      <div className={`text-2xl font-bold ${currentTheme.text} mt-1`}>
                        ${pricing[currentlyOpenService][tier]}
                        <span className={`text-sm ${currentTheme.textSecondary} font-normal`}>/mo</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTierDetailsModal(currentlyOpenService, tier);
                      }}
                      className={`${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className={`text-sm ${currentTheme.textSecondary} leading-relaxed`}>
                    {getBestForText(currentlyOpenService, tier)}
                  </p>
                  {selectedTiers[currentlyOpenService] === tier && (
                    <div className={`mt-3 flex items-center ${currentTheme.green} text-sm font-medium`}>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal with fixed button positioning */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme.cardBg} rounded-xl w-full max-w-md ${currentTheme.border} border flex flex-col max-h-[90vh]`}>
            {/* Modal content with scrollable area */}
            <div className="flex-1 overflow-y-auto p-6">
              {formStep === 0 ? (
                <>
                  <h2 className={`text-xl font-semibold mb-4 ${currentTheme.text}`}>Finalize Your Bundle</h2>
                  
                  <input
                    type="text"
                    placeholder="Bundle Name (Optional)"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    className={`w-full p-3 ${currentTheme.bgTertiary} ${currentTheme.border} border rounded-lg mb-4 ${currentTheme.text} ${isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                  />
                  
                  <div className={`p-4 ${currentTheme.bgTertiary} rounded-lg mb-4`}>
                    <h3 className={`font-medium mb-3 ${currentTheme.text}`}>Order Summary</h3>
                    <div className="space-y-2">
                      {selected.map(([product, tier]) => (
                        <div key={product} className={`flex justify-between text-sm ${currentTheme.text}`}>
                          <span>{product} - {tier}</span>
                          <span>${pricing[product][tier]}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-3 pt-3 border-t ${currentTheme.border}`}>
                      <div className={`flex justify-between text-sm ${currentTheme.text}`}>
                        <span>Subscription ({subLength} months)</span>
                        <span className={currentTheme.green}>-{subscriptionDiscount}%</span>
                      </div>
                      {bundleDiscount > 0 && (
                        <div className={`flex justify-between text-sm ${currentTheme.text}`}>
                          <span>Bundle discount ({productCount} products)</span>
                          <span className={currentTheme.green}>-{bundleDiscount}%</span>
                        </div>
                      )}
                      <div className={`flex justify-between font-semibold mt-2 text-lg ${currentTheme.text}`}>
                        <span>Total</span>
                        <span>${final.toFixed(2)}/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  <SubscriptionDisclosure />
                  
                  {bundleRejected && <StartOverButton />}
                </>
              ) : formStep === 1 ? (
                <UserInfoForm 
                  onSubmit={handleUserInfoSubmit} 
                  onCancel={() => setFormStep(0)}
                  setShowPrivacyPolicy={setShowPrivacyPolicy}
                  theme={currentTheme}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className={`w-12 h-12 border-4 ${currentTheme.borderAccent} border-t-transparent rounded-full animate-spin mb-4`}></div>
                      <p className={currentTheme.text}>Processing your agreement...</p>
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
                      theme={currentTheme}
                      isDarkMode={isDarkMode}
                    />
                  )}
                </>
              )}
            </div>
            
            {/* Fixed action buttons at bottom */}
            {formStep === 0 && (
              <div className="flex gap-3 p-6 pt-0">
                <button
                  onClick={handleBundleReject}
                  className={`flex-1 py-3 ${currentTheme.bgTertiary} ${currentTheme.border} border rounded-lg font-medium transition-colors hover:${currentTheme.borderAccent} ${currentTheme.text}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBundleConfirm}
                  className={`flex-1 py-3 ${currentTheme.accent} ${isDarkMode ? 'text-black' : 'text-white'} font-medium rounded-lg ${currentTheme.accentHover} transition-colors`}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme.cardBg} rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto ${currentTheme.border} border`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${currentTheme.text}`}>
                {modalService} – {modalTier} Tier
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {detailedFeatures[modalService]?.[modalTier]?.disclaimer && (
              <div className={`mb-4 p-3 ${currentTheme.bgTertiary} rounded-lg`}>
                <p className={`text-sm ${currentTheme.textSecondary} mb-2`}>
                  {detailedFeatures[modalService][modalTier].disclaimer}
                </p>
                <p className={`text-sm font-medium ${currentTheme.accentText}`}>
                  {detailedFeatures[modalService][modalTier].budget}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className={`font-medium ${currentTheme.text} mb-3`}>Included Features</h3>
              {detailedFeatures[modalService]?.[modalTier]?.features?.map((feature, index) => (
                <div key={index} className={`text-sm ${currentTheme.textSecondary}`}>
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleTierSelect(modalService, modalTier);
                }}
                className={`flex-1 py-3 ${currentTheme.accent} ${isDarkMode ? 'text-black' : 'text-white'} font-medium rounded-lg ${currentTheme.accentHover} transition-colors`}
              >
                Select This Tier
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 py-3 ${currentTheme.bgTertiary} ${currentTheme.border} border rounded-lg font-medium transition-colors hover:${currentTheme.borderAccent} ${currentTheme.text}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Info Modal */}
      {showServiceInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme.cardBg} rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto ${currentTheme.border} border`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${currentTheme.text}`}>{serviceInfoContent.title}</h2>
              <button
                onClick={() => setShowServiceInfoModal(false)}
                className={`${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className={`font-medium ${currentTheme.text} mb-2`}>What is {serviceInfoContent.title}?</h3>
              <p className={`text-sm ${currentTheme.textSecondary} mb-4`}>
                {serviceInfoContent.description}
              </p>
              
              <div className={`p-4 ${currentTheme.bgTertiary} rounded-lg mb-3`}>
                <h3 className={`text-sm font-medium ${currentTheme.accentText} mb-2`}>Success Story</h3>
                <p className={`text-sm ${currentTheme.textSecondary} italic`}>
                  "{serviceInfoContent.successStory}"
                </p>
              </div>
              
              <p className={`text-xs ${currentTheme.textSecondary} italic`}>
                {successStoryDisclaimer}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowServiceInfoModal(false);
                  handleProductSelect(serviceInfoContent.title);
                }}
                className={`flex-1 py-3 ${currentTheme.accent} ${isDarkMode ? 'text-black' : 'text-white'} font-medium rounded-lg ${currentTheme.accentHover} transition-colors`}
              >
                Select This Service
              </button>
              <button
                onClick={() => {
                  setShowServiceInfoModal(false);
                  // Trigger chatbot expansion by clicking the chat button
                  const chatButton = document.querySelector('[aria-label="Ask Sydney"]');
                  if (chatButton) chatButton.click();
                }}
                className={`flex-1 py-3 ${currentTheme.bgTertiary} ${currentTheme.border} border rounded-lg font-medium transition-colors hover:${currentTheme.borderAccent} ${currentTheme.text}`}
              >
                Ask Sydney
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        /* Range slider styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: ${isDarkMode ? '#D28C00' : '#9333EA'};
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: ${isDarkMode ? '#D28C00' : '#9333EA'};
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#0A0A0A' : '#F3F4F6'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#D28C00' : '#9333EA'};
          border-radius: 3px;
        }
        
        /* Pulse animation */
        @keyframes pulse {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 0;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default BundleBuilder;
