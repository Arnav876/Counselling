import React, { useState } from 'react';
import { useCompare } from '../context/CompareContext';
import { collegeService } from '../services/collegeService';
import { FadeIn } from '../components/ui/motion';

export const Contact: React.FC = () => {
  const { showToast } = useCompare();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredState: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await collegeService.submitContact(formData);
      showToast('Thank you! Your inquiry has been recorded. Our counselor will contact you shortly.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredState: '',
      });
    } catch (err) {
      showToast('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0b1c30] mb-4">Contact Our Admissions Team</h1>
            <p className="text-lg text-[#45464d]">
              Have questions about college admissions, management quotas, or counseling processes? Our expert counselors are here to help.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#c6c6cd]/40 shadow-sm">
              <h2 className="text-xl font-bold text-[#0b1c30] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1" htmlFor="fullName">
                    Full Name <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] placeholder:text-[#76777d] focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1" htmlFor="email">
                      Email Address <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] placeholder:text-[#76777d] focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1" htmlFor="phone">
                      Phone Number <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] placeholder:text-[#76777d] focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1" htmlFor="subject">
                    Subject <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] placeholder:text-[#76777d] focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1" htmlFor="preferredState">
                    Preferred State (Optional)
                  </label>
                  <select
                    id="preferredState"
                    value={formData.preferredState}
                    onChange={(e) => setFormData({ ...formData, preferredState: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] bg-white focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                  >
                    <option value="">Select a state</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1" htmlFor="message">
                    Message <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your admission requirements..."
                    className="w-full p-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] placeholder:text-[#76777d] focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0051d5] text-white text-sm font-semibold hover:bg-[#316bf3] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#c6c6cd]/40 shadow-sm">
                <h2 className="text-xl font-bold text-[#0b1c30] mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0b1c30] mb-1">Helpline Number</h3>
                      <p className="text-sm text-[#45464d]">+91 (800) 245-8890</p>
                      <p className="text-xs text-[#76777d]">Mon-Sat, 9 AM - 7 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0b1c30] mb-1">Email Us</h3>
                      <p className="text-sm text-[#45464d]">admissions@educompass.in</p>
                      <p className="text-xs text-[#76777d]">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0b1c30] mb-1">Office Address</h3>
                      <p className="text-sm text-[#45464d]">
                        EduCompass Discovery Inc.<br />
                        Tech Park, Sector 5<br />
                        Bengaluru, Karnataka 560100
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0051d5] rounded-2xl p-6 sm:p-8 text-white">
                <h2 className="text-xl font-bold mb-4">Need Immediate Assistance?</h2>
                <p className="text-sm text-white/90 mb-6">
                  Our admission counselors are available for immediate consultation. Schedule a callback or visit our office.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // This would open the enquiry modal
                    window.location.href = 'tel:+918002458890';
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-white text-[#0051d5] text-sm font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};
