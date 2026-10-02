import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { AnimatePresence, motion } from '../ui/motion';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { compareList, openEnquiry, showToast } = useCompare();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Colleges', path: '/colleges' },
    { label: 'Compare', path: '/compare' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md top-0 sticky z-40 shadow-sm border-b border-slate-200/80">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-16">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Open Navigation Menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors md:hidden cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#0051d5] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#0b1c30]">EduCompass</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold pb-1 transition-colors relative ${
                  isActive(link.path)
                    ? 'text-[#0051d5] border-b-2 border-[#0051d5]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {link.path === '/compare' && compareList.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#0051d5] text-white text-[10px] font-bold">
                    {compareList.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openEnquiry('General Admissions Consultation')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0051d5]">support_agent</span>
              <span>Enquire</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Student portal & sign-in gateway active for 2025 batch.')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#316bf3] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 bg-white shadow-2xl border-r border-slate-200 flex flex-col h-full p-4 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">school</span>
                  </div>
                  <span className="text-lg font-bold text-[#0b1c30]">EduCompass</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-[#0051d5]/10 text-[#0051d5]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">home</span>
                  <span>Home</span>
                </Link>

                <Link
                  to="/colleges"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                    isActive('/colleges')
                      ? 'bg-[#0051d5]/10 text-[#0051d5]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span>Explore Colleges</span>
                </Link>

                <Link
                  to="/compare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center justify-between text-sm font-semibold transition-colors ${
                    isActive('/compare')
                      ? 'bg-[#0051d5]/10 text-[#0051d5]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                    <span>Compare Colleges</span>
                  </div>
                  {compareList.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#0051d5] text-white text-xs font-bold">
                      {compareList.length}/3
                    </span>
                  )}
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                    isActive('/about')
                      ? 'bg-[#0051d5]/10 text-[#0051d5]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">info</span>
                  <span>About Platform</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                    isActive('/contact')
                      ? 'bg-[#0051d5]/10 text-[#0051d5]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                  <span>Admissions Contact</span>
                </Link>

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openEnquiry();
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    <span>Talk to Admission Counselor</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                <p className="font-semibold text-slate-800 mb-1">Direct Admissions Helpline</p>
                <p className="flex items-center gap-1.5 text-[#0051d5] font-bold">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  +91 (800) 245-8890
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
