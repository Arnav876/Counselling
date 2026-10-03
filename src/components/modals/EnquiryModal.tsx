import React, { useState } from 'react';
import { useCompare } from '../../context/CompareContext';
import { collegeService } from '../../services/collegeService';
import { AnimatePresence, motion } from '../ui/motion';

export const EnquiryModal: React.FC = () => {
  const { isEnquiryOpen, enquiryCollege, closeEnquiry, showToast } = useCompare();

  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    preferredCourse: 'Computer Science & Engineering (CSE)',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isEnquiryOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await collegeService.submitEnquiry({
        collegeName: enquiryCollege,
        studentName: formData.studentName,
        phone: formData.phone,
        preferredCourse: formData.preferredCourse,
        notes: formData.notes,
      });
      setIsSubmitted(true);
      showToast(`Admissions callback requested for ${formData.studentName}!`);
      setTimeout(() => {
        setIsSubmitted(false);
        closeEnquiry();
        setFormData({
          studentName: '',
          phone: '',
          email: '',
          preferredCourse: 'Computer Science & Engineering (CSE)',
          notes: '',
        });
      }, 1800);
    } catch (err) {
      console.error(err);
      showToast('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#12305A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#DCE5EF] relative my-8"
        >
          <button
            type="button"
            onClick={closeEnquiry}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#5F6F82] hover:text-[#12305A] hover:bg-[#F7FAFD] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#159EAE]/10 text-[#087C8B] flex items-center justify-center mx-auto mb-4 border border-[#159EAE]/30">
                <span className="material-symbols-outlined text-[32px] text-[#159EAE]">verified</span>
              </div>
              <h3 className="text-xl font-bold text-[#12305A] mb-2">Inquiry Registered</h3>
              <p className="text-sm text-[#5F6F82] leading-relaxed">
                Our authorized admission counselor for <strong className="text-[#12305A]">{enquiryCollege}</strong> will contact you via phone within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-[22px]">send</span>
                </div>
                <h3 className="text-xl font-bold text-[#12305A]">Direct Admission Desk</h3>
                <p className="text-sm text-[#0757C9] font-semibold truncate">{enquiryCollege}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="studentName">
                    Student Full Name <span className="text-[#F04A35]">*</span>
                  </label>
                  <input
                    id="studentName"
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:outline-none focus:border-[#0757C9] focus:ring-2 focus:ring-[#0757C9]/15 transition-all bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="phone">
                      Mobile Number <span className="text-[#F04A35]">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:outline-none focus:border-[#0757C9] focus:ring-2 focus:ring-[#0757C9]/15 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:outline-none focus:border-[#0757C9] focus:ring-2 focus:ring-[#0757C9]/15 transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="preferredCourse">
                    Preferred Academic Major
                  </label>
                  <select
                    id="preferredCourse"
                    value={formData.preferredCourse}
                    onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] bg-white focus:outline-none focus:border-[#0757C9] focus:ring-2 focus:ring-[#0757C9]/15 transition-all"
                  >
                    <option>Computer Science & Engineering (CSE)</option>
                    <option>Artificial Intelligence & Machine Learning (AI/ML)</option>
                    <option>Information Science & Engineering (ISE)</option>
                    <option>Electronics & Communication (ECE)</option>
                    <option>Mechanical & Robotics</option>
                    <option>NRI / Foreign Direct Seat Matrix</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="notes">
                    Entrance Scores / Query (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Mention KCET/COMEDK/JEE rank or NRI seat inquiry..."
                    className="w-full p-2.5 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:outline-none focus:border-[#0757C9] focus:ring-2 focus:ring-[#0757C9]/15 transition-all resize-none bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#0757C9] text-white text-sm font-semibold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">support_agent</span>
                        <span>Request Immediate Callback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
