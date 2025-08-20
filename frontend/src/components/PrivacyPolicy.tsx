import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">1. Introduction</h3>
        <p className="mb-4">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and 
          protect your information when you use our services. By using our website or app, you 
          agree to the terms described here.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">2. Information We Collect</h3>
        <p className="mb-3">We may collect the following information when you use our service:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal Information: Name, email address, phone number, payment details.</li>
          <li>Account Details: Login credentials, booking history, saved preferences.</li>
          <li>Usage Data: IP address, browser type, device information, and interactions with the app.</li>
          <li>Location Data: If you enable location sharing, we may collect your real-time location to improve search results and recommendations.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">3. How We Use Your Information</h3>
        <p className="mb-3">We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Process bookings and payments.</li>
          <li>Provide customer support.</li>
          <li>Send booking confirmations and updates.</li>
        </ul>
      </div>
    </>
  );
};

export default PrivacyPolicy;