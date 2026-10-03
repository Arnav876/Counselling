import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { adminService } from '../services/adminService';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { showToast } = useCompare();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await adminService.adminLogin({
        email: email.trim(),
        password
      });

      await refreshUser();
      showToast(`Welcome back, ${res.user.name} (${res.user.role})`);
      navigate('/admin');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid administrator email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F7FAFD] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-[#DCE5EF] overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-br from-[#12305A] via-[#0757C9] to-[#06449E] px-8 py-8 text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <span className="material-symbols-outlined text-[30px] text-[#FFBE2E]">admin_panel_settings</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">Admin Portal Login</h2>
          <p className="text-xs text-blue-100 mt-1">
            Authorized administrative access for Admission by Choice
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0 mt-0.5">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#12305A] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#5F6F82] text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admissionbychoice@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#DCE5EF] rounded-xl focus:outline-hidden focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12305A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#5F6F82] text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#DCE5EF] rounded-xl focus:outline-hidden focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#0757C9] hover:bg-[#06449E] text-white text-xs font-bold transition-all active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#DCE5EF] flex items-center justify-between text-xs text-[#5F6F82]">
            <Link to="/" className="hover:text-[#0757C9] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Website</span>
            </Link>
            <span className="text-[11px] text-[#5F6F82]">
              🔒 256-Bit SSL Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
