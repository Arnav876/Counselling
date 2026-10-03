import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from '../ui/motion';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { compareList, openEnquiry, showToast } = useCompare();
  const { user, isAuthenticated, isAdmin, isSuperAdmin, logout, openAuthModal } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Colleges', path: '/colleges' },
    { label: 'Compare', path: '/compare' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md top-0 sticky z-40 shadow-xs border-b border-[#DCE5EF]">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-16">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Open Navigation Menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-[#5F6F82] hover:text-[#12305A] hover:bg-[#F7FAFD] transition-colors md:hidden cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo-icon.png"
                alt="Admission by Choice Logo"
                className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#12305A]">
                  Admission <span className="text-[#0757C9]">by Choice</span>
                </span>
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
                    ? 'text-[#0757C9] border-b-2 border-[#0757C9]'
                    : 'text-[#5F6F82] hover:text-[#12305A]'
                }`}
              >
                {link.label}
                {link.path === '/compare' && compareList.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#0757C9] text-white text-[10px] font-bold">
                    {compareList.length}
                  </span>
                )}
              </Link>
            ))}

            {/* If Admin, show link to Admin Dashboard in Navbar */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-semibold pb-1 transition-colors flex items-center gap-1 ${
                  isActive('/admin')
                    ? 'text-[#0757C9] border-b-2 border-[#0757C9]'
                    : 'text-[#0757C9] hover:text-[#06449E]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openEnquiry('General Admissions Consultation')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DCE5EF] bg-white text-[#12305A] text-xs font-semibold hover:bg-[#F7FAFD] hover:border-[#0757C9] transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0757C9]">support_agent</span>
              <span>Enquire</span>
            </button>

            {/* Authenticated User Menu or Sign In Button */}
            {!isAuthenticated || !user ? (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-[#DCE5EF] hover:border-[#0757C9] bg-white transition-all cursor-pointer shadow-xs group"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0757C9&color=fff&size=128`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#0757C9]/20"
                  />
                  <div className="hidden sm:flex flex-col text-left pr-1">
                    <span className="text-xs font-bold text-[#12305A] truncate max-w-[110px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-[#0757C9]">
                      {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Student'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#5F6F82] group-hover:text-[#12305A]">
                    expand_more
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DCE5EF] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#DCE5EF]">
                      <p className="font-bold text-[#12305A] truncate">{user.name}</p>
                      <p className="text-[#5F6F82] text-[11px] truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-[#0757C9] hover:bg-[#0757C9]/10 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/account?tab=saved"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#12305A] hover:bg-[#F7FAFD]"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#0757C9]">bookmark</span>
                      <span>Saved Colleges</span>
                    </Link>

                    <Link
                      to="/account?tab=chat"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#12305A] hover:bg-[#F7FAFD]"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#159EAE]">smart_toy</span>
                      <span>AI Advisory History</span>
                    </Link>

                    <Link
                      to="/account?tab=enquiries"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#12305A] hover:bg-[#F7FAFD]"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#FFBE2E]">assignment</span>
                      <span>My Enquiries</span>
                    </Link>

                    <Link
                      to="/account?tab=profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#12305A] hover:bg-[#F7FAFD]"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#5F6F82]">person</span>
                      <span>Account Settings</span>
                    </Link>

                    <div className="border-t border-[#DCE5EF] my-1"></div>

                    <button
                      type="button"
                      onClick={async () => {
                        setIsProfileDropdownOpen(false);
                        await logout();
                        navigate('/');
                        showToast('Signed out successfully');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
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
              className="fixed inset-0 bg-[#12305A]/50 backdrop-blur-xs z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 bg-white shadow-2xl border-r border-[#DCE5EF] flex flex-col h-full p-4 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#DCE5EF]">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo-icon.png"
                    alt="Admission by Choice"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-lg font-bold text-[#12305A]">
                    Admission <span className="text-[#0757C9]">by Choice</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#5F6F82] hover:bg-[#F7FAFD]"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              {/* Mobile Auth Status */}
              {isAuthenticated && user && (
                <div className="p-3 mb-3 bg-[#F7FAFD] rounded-xl border border-[#DCE5EF] flex items-center gap-3">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0757C9&color=fff&size=128`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#12305A] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#5F6F82] truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5 flex-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-[#0757C9]/10 text-[#0757C9]'
                      : 'text-[#12305A] hover:bg-[#F7FAFD]'
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
                      ? 'bg-[#0757C9]/10 text-[#0757C9]'
                      : 'text-[#12305A] hover:bg-[#F7FAFD]'
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
                      ? 'bg-[#0757C9]/10 text-[#0757C9]'
                      : 'text-[#12305A] hover:bg-[#F7FAFD]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                    <span>Compare Colleges</span>
                  </div>
                  {compareList.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#0757C9] text-white text-xs font-bold">
                      {compareList.length}/3
                    </span>
                  )}
                </Link>

                <Link
                  to="/blogs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                    isActive('/blogs')
                      ? 'bg-[#0757C9]/10 text-[#0757C9]'
                      : 'text-[#12305A] hover:bg-[#F7FAFD]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  <span>Admissions Blog & Guides</span>
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                      isActive('/account')
                        ? 'bg-[#0757C9]/10 text-[#0757C9]'
                        : 'text-[#12305A] hover:bg-[#F7FAFD]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    <span>My Student Account</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                      isActive('/admin')
                        ? 'bg-[#0757C9]/10 text-[#0757C9]'
                        : 'text-[#0757C9] hover:bg-[#0757C9]/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    <span>Admin Portal</span>
                  </Link>
                )}

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                    isActive('/about')
                      ? 'bg-[#0757C9]/10 text-[#0757C9]'
                      : 'text-[#12305A] hover:bg-[#F7FAFD]'
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
                      ? 'bg-[#0757C9]/10 text-[#0757C9]'
                      : 'text-[#12305A] hover:bg-[#F7FAFD]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                  <span>Admissions Contact</span>
                </Link>

                <div className="pt-4 mt-2 border-t border-[#DCE5EF]">
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-colors flex items-center justify-center gap-2 mb-2 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      <span>Sign In with Google</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await logout();
                        navigate('/');
                        showToast('Signed out');
                      }}
                      className="w-full py-2.5 px-4 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mb-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE5EF] text-xs text-[#5F6F82]">
                <p className="font-semibold text-[#12305A] mb-1">Direct Admissions Helpline</p>
                <p className="flex items-center gap-1.5 text-[#0757C9] font-bold">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  +91 78790 84889
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
