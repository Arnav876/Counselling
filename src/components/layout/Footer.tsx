import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';

export const Footer: React.FC = () => {
  const { showToast } = useCompare();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast(`Subscribed ${newsletterEmail} to 2025 Admissions Alerts!`);
    setNewsletterEmail('');
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto pb-16 md:pb-0">
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">school</span>
              </div>
              <span className="text-xl font-bold text-[#0b1c30]">EduCompass</span>
            </Link>
            <p className="text-sm text-slate-600 max-w-md mb-4 leading-relaxed">
              India's premier institutional discovery and academic benchmarking platform. Providing transparent cutoffs, verified fee schedules, distance calculation, and direct management quota guidance.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-slate-600">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                100% Verified Accreditations
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#0051d5]">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                2025-26 Admissions Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight uppercase text-xs">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-[#0051d5] transition-colors">Home Discovery</Link>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-[#0051d5] transition-colors">Explore Colleges</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#0051d5] transition-colors">Compare Institutions</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0051d5] transition-colors">About Us & Methodology</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0051d5] transition-colors">Counselor Helpline</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Legal */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight uppercase text-xs">
              Admissions Newsletter
            </h4>
            <p className="text-xs text-slate-500 mb-3">
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
                  className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded bg-[#0051d5] text-white flex items-center justify-center hover:bg-[#316bf3] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </form>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => showToast('Privacy Policy verified according to IT Act & Data Privacy standards.')}
                className="hover:text-[#0051d5] transition-colors"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => showToast('Terms of Service applied to institutional directory data.')}
                className="hover:text-[#0051d5] transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduCompass Discovery Inc. All institutional data and marks reserved.</p>
          <p className="text-slate-400">Phase 1 Frontend Architecture • Verified Academic Benchmarking</p>
        </div>
      </div>
    </footer>
  );
};
