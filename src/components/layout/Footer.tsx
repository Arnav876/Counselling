import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';

export const Footer: React.FC = () => {
  const { showToast } = useCompare();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast(`Subscribed ${newsletterEmail} to 2025-26 Admissions Alerts!`);
    setNewsletterEmail('');
  };

  return (
    <footer className="w-full bg-white border-t border-[#DCE5EF] mt-auto pb-16 md:pb-0">
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group">
              <img
                src="/logo-icon.png"
                alt="Admission by Choice"
                className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-extrabold tracking-tight text-[#12305A]">
                Admission <span className="text-[#0757C9]">by Choice</span>
              </span>
            </Link>
            <p className="text-sm text-[#5F6F82] max-w-md mb-4 leading-relaxed">
              India's premier institutional discovery and academic benchmarking platform. Providing transparent cutoffs, verified fee schedules, distance calculation, and direct management quota guidance.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[#5F6F82]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#159EAE]/10 border border-[#159EAE]/30 text-xs font-semibold text-[#087C8B]">
                <span className="material-symbols-outlined text-[16px] text-[#159EAE]">verified</span>
                100% Verified Accreditations
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0757C9]/10 border border-[#0757C9]/30 text-xs font-semibold text-[#0757C9]">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                2025-26 Admissions Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#12305A] mb-3.5 tracking-wider uppercase">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5F6F82]">
              <li>
                <Link to="/" className="hover:text-[#0757C9] transition-colors">Home Discovery</Link>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-[#0757C9] transition-colors">Explore Colleges</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#0757C9] transition-colors">Compare Institutions</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0757C9] transition-colors">About Us & Methodology</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0757C9] transition-colors">Counselor Helpline</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Alerts */}
          <div>
            <h4 className="text-xs font-bold text-[#12305A] mb-3.5 tracking-wider uppercase">
              Admissions Newsletter
            </h4>
            <p className="text-xs text-[#5F6F82] mb-3">
              Receive notifications regarding state counseling rounds, cutoff releases, and NRI quota seat matrix.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full h-9 pl-3 pr-8 rounded-lg border border-[#DCE5EF] text-xs text-[#12305A] bg-white placeholder:text-[#5F6F82]/60 focus:outline-none focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded bg-[#0757C9] text-white flex items-center justify-center hover:bg-[#06449E] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </form>
            <div className="mt-4 pt-3 border-t border-[#DCE5EF] flex items-center gap-3 text-xs text-[#5F6F82]">
              <button
                type="button"
                onClick={() => showToast('Privacy Policy verified according to IT Act & Data Privacy standards.')}
                className="hover:text-[#0757C9] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => showToast('Terms of Service applied to institutional directory data.')}
                className="hover:text-[#0757C9] transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#DCE5EF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F6F82]">
          <p>© {new Date().getFullYear()} Admission by Choice. All institutional data and marks reserved.</p>
          <p className="text-[#5F6F82]/80">India Higher Education & Benchmarking Platform</p>
        </div>
      </div>
    </footer>
  );
};
