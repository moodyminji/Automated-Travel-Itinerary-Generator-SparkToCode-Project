import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../hooks/useThemeMode'; // <-- import theme hook
import Modal from '../components/Modal.tsx';
import PrivacyPolicy from '../components/PrivacyPolicy.tsx';
import Terms from '../components/Terms.tsx';
import TravelIllustration from '../components/TravelIllustration.tsx';
import { FaMapMarkedAlt, FaWallet, FaChartPie } from "react-icons/fa";
import { DarkMode, LightMode } from '@mui/icons-material';

function LandingPage() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 text-slate-800'
        }`}
    >
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-8">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Tajawal Logo" style={{ width: 90, height: 90 }} />
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className={`font-bold text-lg transition-colors duration-200 ${isDark ? 'text-white hover:text-gray-300' : 'text-[#555555] hover:text-[#333333]'
              }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setIsTermsOpen(true)}
            className={`font-bold text-lg transition-colors duration-200 ${isDark ? 'text-white hover:text-gray-300' : 'text-[#555555] hover:text-[#333333]'
              }`}
          >
            Terms
          </button>

          {/* Dark/Light Toggle */}
          <button
            onClick={toggleMode}
            className="px-3 py-2 rounded-lg hover:bg-surface/70"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
            style={{ color: isDark ? '#F5A623' : '#1D3557' }}
          >
            {isDark ? <LightMode /> : <DarkMode />}
          </button>
        </div>

      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-start px-8 py-20">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            Plan your dream<br />
            trip in minutes
          </h2>
          <p className="text-xl mb-12 leading-relaxed">
            Seamlessly plan and book your<br />
            perfect getaway with ease.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/signup"
              className="bg-[#F5A623] hover:bg-[#e59410] text-white font-semibold px-10 py-4 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="border-2 border-[#F5A623] text-[#F5A623] bg-white hover:bg-[#fff5e6] font-semibold px-10 py-4 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Travel Illustration */}
      <TravelIllustration />

      {/* Features Section */}
      <section className="relative z-10 mt-24 px-8 grid md:grid-cols-3 gap-12 text-center">
        <div>
          <FaMapMarkedAlt className="mx-auto h-16 w-16 mb-4" style={{ color: "#F5A623" }} />
          <h3 className="text-xl font-semibold">Smart Itineraries</h3>
          <p className="mt-2">Day-by-day travel plans tailored to you.</p>
        </div>
        <div>
          <FaWallet className="mx-auto h-16 w-16 mb-4" style={{ color: "#F5A623" }} />
          <h3 className="text-xl font-semibold">Budget-Friendly</h3>
          <p className="mt-2">Find the best options within your budget.</p>
        </div>
        <div>
          <FaChartPie className="mx-auto h-16 w-16 mb-4" style={{ color: "#F5A623" }} />
          <h3 className="text-xl font-semibold">Budget Overview</h3>
          <p className="mt-2">Visualize your costs with charts and insights.</p>
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="Privacy Policy">
        <PrivacyPolicy />
      </Modal>
      <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} title="Terms">
        <Terms />
      </Modal>
    </div>
  );
}

export default LandingPage;
