// src/components/PrivacyPolicyModal.js
import React from 'react';

const PrivacyPolicyModal = ({ isVisible, onClose, onAccept, currentDate, theme, isDarkMode }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${theme.cardBg} rounded-xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border ${theme.border}`}>
        <div className={`flex justify-between items-center mb-6 border-b ${theme.border} pb-4`}>
          <h2 className={`text-2xl font-bold ${theme.text}`}>Privacy Policy</h2>
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-full ${theme.bgTertiary} ${theme.textSecondary} hover:${theme.bg} hover:${theme.accentText} transition-all flex items-center justify-center`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className={`space-y-4 ${theme.textSecondary} text-sm`}>
          <p>Last Updated: {currentDate || new Date().toLocaleDateString()}</p>
          
          <section>
            <h3 className={`text-lg font-semibold ${theme.accentText} mb-2`}>1. Introduction</h3>
            <p>
              Buzzword Strategies LLC ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Bundle Builder platform and marketing services.
            </p>
          </section>

          <section>
            <h3 className={`text-lg font-semibold ${theme.accentText} mb-2`}>2. Information We Collect</h3>
            <p>We collect several types of information from and about users of our services, including:</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, company name, website URL, and payment information.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our services, including pages visited, time spent, and actions taken.</li>
              <li><strong>Marketing Preferences:</strong> Your consent choices regarding marketing communications.</li>
            </ul>
          </section>
          
          <section>
            <h3 className={`text-lg font-semibold ${theme.accentText} mt-4 mb-2`}>3. How We Use Your Information</h3>
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
            <h3 className={`text-lg font-semibold ${theme.accentText} mt-4 mb-2`}>4. Disclosure of Your Information</h3>
            <p>We may disclose your personal information to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Service Providers:</strong> Third parties that help us operate our business and deliver services (e.g., payment processors, cloud storage providers)</li>
              <li><strong>Marketing Platforms:</strong> When necessary to deliver the contracted marketing services (e.g., Google, Meta, TikTok)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>
          
          <section>
            <h3 className={`text-lg font-semibold ${theme.accentText} mt-4 mb-2`}>5. Data Storage and Security</h3>
            <p>
              We use Supabase and Stripe to store and process your information securely. We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, or destruction.
            </p>
          </section>
          
          <section>
            <h3 className={`text-lg font-semibold ${theme.accentText} mt-4 mb-2`}>6. Your Rights</h3>
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
            <h3 className={`text-lg font-semibold ${theme.accentText} mt-4 mb-2`}>7. Third-Party Links and Services</h3>
            <p>
              Our services may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>
          
          <section>
            <h3 className={`text-lg font-semibold ${theme.accentText} mt-4 mb-2`}>8. Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>
          
          <section>
            <h3 className={`text-lg font-semibold ${theme.accentText} mt-4 mb-2`}>9. Contact Us</h3>
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
            onClick={onAccept}
            className={`w-full py-3 ${theme.accent} ${isDarkMode ? 'text-black' : 'text-white'} font-semibold rounded-lg ${theme.accentHover} transition-colors`}
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
