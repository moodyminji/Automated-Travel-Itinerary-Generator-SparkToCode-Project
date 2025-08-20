import React from 'react';

const Terms: React.FC = () => {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">1. Introduction</h3>
        <p className="mb-4">
          Welcome to Tajawal. By accessing or using our website or mobile app, you agree to 
          these Terms & Conditions. If you do not agree, please do not use our services.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">2. Services Provided</h3>
        <p className="mb-4">
          Tajawal allows users to search, compare, and book travel services including flights, 
          hotels, and trip packages through third-party providers.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">3. User Responsibilities</h3>
        <p className="mb-3">When using Tajawal, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate and truthful information during booking.</li>
          <li>Ensure you meet all travel requirements (passport, visas, vaccinations).</li>
          <li>Use the service for personal, non-commercial purposes only.</li>
          <li>Not engage in fraudulent or harmful activity on our platform.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">4. Booking & Payment</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Prices are subject to change until the booking is confirmed.</li>
          <li>Bookings are confirmed only upon receipt of payment.</li>
        </ul>
      </div>
    </>
  );
};

export default Terms;