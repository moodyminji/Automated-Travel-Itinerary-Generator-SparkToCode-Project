import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal.tsx';
import PrivacyPolicy from '../components/PrivacyPolicy.tsx';
import Terms from '../components/Terms.tsx';
import TravelIllustration from '../components/TravelIllustration.tsx';

function App() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-8">
        {/* Logo (replaces text + icons) */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Tajawal Logo"
            className="h-24 w-auto"
          />
        </div>

        <div className="flex space-x-10">
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="text-slate-600 hover:text-slate-800 font-medium text-lg transition-colors duration-200"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-slate-600 hover:text-slate-800 font-medium text-lg transition-colors duration-200"
          >
            Terms
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-start px-8 py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight mb-8">
            Plan your dream<br />
            trip in minutes
          </h1>

          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Seamlessly plan and book your<br />
            perfect getaway with ease.
          </p>

          <div className="flex space-x-6">
            {/* Sign Up → /signup */}
            <Link
              to="/signup"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Sign Up
            </Link>

            {/* Log in → /login */}
            <Link
              to="/login"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-10 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Travel Illustration (unchanged) */}
      <TravelIllustration />

      {/* Modals */}
      <Modal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicy />
      </Modal>

      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Terms"
      >
        <Terms />
      </Modal>
    </div>
  );
}

export default App;
