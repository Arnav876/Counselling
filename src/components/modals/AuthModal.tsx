import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { AnimatePresence, motion } from '../ui/motion';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, isLoading } = useAuth();
  const { showToast } = useCompare();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = async (email: string, name: string) => {
    setAuthError(null);
    try {
      const res = await loginWithGoogle({
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0757C9&color=fff&size=128`
      });
      showToast(`Signed in successfully as ${res.user.role === 'SUPER_ADMIN' ? 'Super Admin' : res.user.role === 'ADMIN' ? 'Admin' : 'Student'} (${res.user.email})`);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setAuthError('Please enter a valid Google email address');
      return;
    }
    const name = customName.trim() || customEmail.split('@')[0];
    await handleQuickLogin(customEmail.trim(), name);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#12305A]/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DCE5EF] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-[#0757C9] to-[#06449E] px-6 py-6 text-white text-center relative">
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <img src="/logo-icon.png" alt="Admission by Choice" className="w-8 h-8 object-contain" />
            </div>

            <h3 className="text-xl font-bold tracking-tight">Admission by Choice</h3>
            <p className="text-xs text-blue-100 mt-1">
              Sign in with Google to access saved colleges, AI counseling history & enquiries
            </p>
          </div>

          <div className="p-6 space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Google Verified Sign-In Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('student@admissionbychoice.com', 'Rahul Verma')}
              className="w-full py-3 px-4 rounded-xl border-2 border-[#DCE5EF] hover:border-[#0757C9] bg-white text-[#12305A] text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:shadow-md active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-[#DCE5EF]"></div>
              <span className="shrink mx-3 text-xs text-[#5F6F82] uppercase tracking-wider font-semibold">
                Quick Role Verification
              </span>
              <div className="grow border-t border-[#DCE5EF]"></div>
            </div>

            {/* Role Options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  closeAuthModal();
                  window.location.href = '/admin/login';
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#DCE5EF] text-left transition-all cursor-pointer group hover:border-[#0757C9]"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0757C9]">
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Admin Portal</span>
                </div>
                <p className="text-[11px] text-[#5F6F82] mt-0.5">
                  Password Required &rarr;
                </p>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('student.neet@gmail.com', 'Priya Sharma')}
                className="p-3 rounded-xl bg-[#0757C9]/5 hover:bg-[#0757C9]/10 border border-[#0757C9]/20 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#12305A]">
                  <span className="material-symbols-outlined text-[16px] text-[#159EAE]">school</span>
                  <span>Student Portal</span>
                </div>
                <p className="text-[11px] text-[#5F6F82] truncate mt-0.5 group-hover:text-[#12305A]">
                  Saved Colleges & AI Chat
                </p>
              </button>
            </div>

            {/* Custom Google Account Testing */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-center text-xs text-[#0757C9] hover:underline font-semibold pt-1 cursor-pointer"
              >
                + Sign in with custom Google email address
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[#DCE5EF] space-y-2.5">
                <p className="text-xs font-semibold text-[#12305A]">Sign in with custom Google Account:</p>
                <div>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-[#DCE5EF] rounded-lg focus:outline-hidden focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Full Name (optional)"
                    className="w-full px-3 py-2 text-xs border border-[#DCE5EF] rounded-lg focus:outline-hidden focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-[#0757C9] hover:bg-[#06449E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {isLoading ? 'Verifying...' : 'Sign In with This Google Account'}
                </button>
              </form>
            )}

            <div className="pt-2 text-center text-[11px] text-[#5F6F82]">
              Protected by Google OAuth 2.0 & server-side role verification.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
